// detalhesCandidatura.tsx
import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ActivityIndicator, // Adicionado para feedback de loading
    ScrollView,
    TouchableOpacity,
    Alert,
    Linking // Para abrir links externos (e.g., redes sociais do candidato)
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router'; // Para obter os parâmetros passados
import { doc, getDoc, updateDoc } from 'firebase/firestore'; // Para buscar e atualizar documentos
import { db } from '@/src/firebase/config'; // Seu arquivo de configuração do Firebase
import { colors } from '@/src/components/global'; // Presumo que este arquivo exista
import { StatusBarObject } from '@/src/components/objects'; // Presumo que este arquivo exista

// Interfaces para os dados
interface CandidaturaDetalhes {
    id: string;
    jobId: string;
    userId: string;
    status: string;
    companyId?: string; // Tornar opcional se nem sempre existir
    appliedAt: { toDate: () => Date }; // Firestore timestamp
}

interface VagaDetalhes {
    id: string;
    nome_vaga: string;
    nome_empresa?: string; // Assumindo que pode não estar presente
    descricao?: string;
    localizacao?: string;
    modalidade?: string;
    regime?: string;
    salario?: string;
    email?: string; // E-mail da empresa na vaga (pode ser útil)
    // Adicione outros campos da coleção 'Vagas-trabalhos' conforme necessário
}

interface CandidatoDetalhes {
    uid: string;
    name_conta: string;
    email: string;
    telefone: string;
    desc_sobre?: string;
    endereco?: string;
    links_externos?: string; // String de links separados, talvez por vírgula ou JSON
    // Adicione outros campos da coleção 'Contas' (tipo Pessoa) conforme necessário
}

export default function DetalhesCandidatura() {
    const { idCandidatura, uidCandidato, jobId, nomeVaga, status, nomeCandidato } = useLocalSearchParams();
    const router = useRouter();

    const [candidatura, setCandidatura] = useState<CandidaturaDetalhes | null>(null);
    const [vaga, setVaga] = useState<VagaDetalhes | null>(null);
    const [candidato, setCandidato] = useState<CandidatoDetalhes | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentStatus, setCurrentStatus] = useState<string>(status as string || 'Pendente');

    useEffect(() => {
        const fetchDetalhes = async () => {
            // Verifica se os parâmetros essenciais estão presentes
            if (!idCandidatura || !uidCandidato || !jobId) {
                setError('Parâmetros da candidatura ausentes. Não foi possível carregar os detalhes.');
                setLoading(false);
                return;
            }

            try {
                // 1. Buscar detalhes da Candidatura
                const candidaturaRef = doc(db, 'applications', idCandidatura as string);
                const candidaturaSnap = await getDoc(candidaturaRef);

                if (!candidaturaSnap.exists()) {
                    setError('Candidatura não encontrada no banco de dados.');
                    setLoading(false);
                    return;
                }
                const candidaturaData = { id: candidaturaSnap.id, ...candidaturaSnap.data() } as CandidaturaDetalhes;
                setCandidatura(candidaturaData);
                // Sincroniza o estado de status com o que vem do banco de dados (mais preciso)
                setCurrentStatus(candidaturaData.status || 'Pendente'); 

                // 2. Buscar detalhes da Vaga
                // É uma boa prática verificar se jobId é uma string antes de usá-lo
                if (typeof jobId === 'string') {
                    const vagaRef = doc(db, 'Vagas-trabalhos', jobId);
                    const vagaSnap = await getDoc(vagaRef);

                    if (vagaSnap.exists()) {
                        setVaga({ id: vagaSnap.id, ...vagaSnap.data() } as VagaDetalhes);
                    } else {
                        console.warn('Vaga não encontrada para o jobId:', jobId);
                        setVaga(null); // Define como null se a vaga não for encontrada
                    }
                } else {
                    console.warn('jobId inválido ou ausente para buscar a vaga.');
                    setVaga(null);
                }

                // 3. Buscar detalhes do Candidato
                // É uma boa prática verificar se uidCandidato é uma string antes de usá-lo
                if (typeof uidCandidato === 'string') {
                    const candidatoRef = doc(db, 'Contas', uidCandidato);
                    const candidatoSnap = await getDoc(candidatoRef);

                    if (candidatoSnap.exists()) {
                        setCandidato({ uid: candidatoSnap.id, ...candidatoSnap.data() } as CandidatoDetalhes);
                    } else {
                        console.warn('Candidato não encontrado para o uidCandidato:', uidCandidato);
                        setCandidato(null); // Define como null se o candidato não for encontrado
                    }
                } else {
                    console.warn('uidCandidato inválido ou ausente para buscar o candidato.');
                    setCandidato(null);
                }

            } catch (err: any) {
                console.error('Erro ao buscar detalhes da candidatura:', err);
                setError('Erro ao carregar os detalhes da candidatura. Tente novamente.');
            } finally {
                setLoading(false);
            }
        };

        fetchDetalhes();
    }, [idCandidatura, uidCandidato, jobId]); // Dependências para re-executar quando os parâmetros mudam

    const handleUpdateStatus = async (newStatus: string) => {
        if (!candidatura) {
            Alert.alert('Erro', 'Dados da candidatura não carregados. Não foi possível atualizar o status.');
            return;
        }

        setLoading(true); // Começa a carregar
        try {
            const candidaturaRef = doc(db, 'applications', candidatura.id);
            await updateDoc(candidaturaRef, {
                status: newStatus
            });
            setCurrentStatus(newStatus); // Atualiza o status local para refletir a mudança
            Alert.alert('Sucesso', `Status da candidatura atualizado para: ${newStatus}`);
        } catch (err) {
            console.error('Erro ao atualizar status:', err);
            Alert.alert('Erro', 'Não foi possível atualizar o status da candidatura. Verifique sua conexão.');
        } finally {
            setLoading(false); // Para de carregar
        }
    };

    const handleOpenLink = async (url: string) => {
        // Adiciona http(s):// se não estiver presente para que Linking funcione corretamente
        const fullUrl = url.startsWith('http://') || url.startsWith('https://') ? url : `https://${url}`;
        
        try {
            const supported = await Linking.canOpenURL(fullUrl);
            if (supported) {
                await Linking.openURL(fullUrl);
            } else {
                Alert.alert('Erro', `Não foi possível abrir o link: ${fullUrl}. Formato inválido ou aplicativo não encontrado.`);
            }
        } catch (error) {
            console.error('Erro ao abrir link:', error);
            Alert.alert('Erro', 'Ocorreu um erro ao tentar abrir o link.');
        }
    };

    // Feedback de carregamento
    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color={colors.amarelo1} />
                <Text style={styles.loadingText}>Carregando detalhes da candidatura...</Text>
            </View>
        );
    }

    // Feedback de erro
    if (error) {
        return (
            <View style={styles.centered}>
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Text style={styles.backButtonText}>Voltar</Text>
                </TouchableOpacity>
            </View>
        );
    }

    // Caso a candidatura principal não seja encontrada (após loading)
    if (!candidatura) {
        return (
            <View style={styles.centered}>
                <Text style={styles.errorText}>Candidatura não encontrada ou não disponível.</Text>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Text style={styles.backButtonText}>Voltar</Text>
                </TouchableOpacity>
            </View>
        );
    }

    // Função auxiliar para formatar timestamp
    const formatTimestamp = (timestamp: { toDate: () => Date } | undefined) => {
        if (!timestamp) return 'Data não disponível';
        const date = timestamp.toDate();
        return date.toLocaleDateString('pt-BR') + ' às ' + date.toLocaleTimeString('pt-BR');
    };

    return (
        <View style={styles.container}>
            <StatusBarObject />
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text style={styles.header}>Detalhes da Candidatura</Text>

                {/* Seção da Candidatura */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Candidatura</Text>
                    <Text style={styles.infoText}>Status: <Text style={styles.statusText(currentStatus)}>{currentStatus}</Text></Text>
                    <Text style={styles.infoText}>Candidatou em: {formatTimestamp(candidatura.appliedAt)}</Text>
                    {/* Mais detalhes da candidatura se houver */}
                </View>

                {/* Seção da Vaga */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Detalhes da Vaga</Text>
                    {vaga ? (
                        <>
                            <Text style={styles.infoText}>Vaga: {vaga.nome_vaga || 'Não informado'}</Text>
                            <Text style={styles.infoText}>Empresa: {vaga.nome_empresa || 'Não informado'}</Text>
                            <Text style={styles.infoText}>Localização: {vaga.localizacao || 'Não informado'}</Text>
                            <Text style={styles.infoText}>Modalidade: {vaga.modalidade || 'Não informado'}</Text>
                            <Text style={styles.infoText}>Regime: {vaga.regime || 'Não informado'}</Text>
                            <Text style={styles.infoText}>Salário: {vaga.salario || 'Não informado'}</Text>
                            {vaga.descricao && (
                                <>
                                    <Text style={styles.subTitle}>Descrição da Vaga:</Text>
                                    <Text style={styles.descriptionText}>{vaga.descricao}</Text>
                                </>
                            )}
                        </>
                    ) : (
                        <Text style={styles.notFoundText}>Informações da vaga não encontradas ou excluídas.</Text>
                    )}
                </View>

                {/* Seção do Candidato */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Detalhes do Candidato</Text>
                    {candidato ? (
                        <>
                            <Text style={styles.infoText}>Nome: {candidato.name_conta || 'Não informado'}</Text>
                            <Text style={styles.infoText}>Email: {candidato.email || 'Não informado'}</Text>
                            <Text style={styles.infoText}>Telefone: {candidato.telefone || 'Não informado'}</Text>
                            {candidato.endereco && <Text style={styles.infoText}>Endereço: {candidato.endereco}</Text>}
                            {candidato.desc_sobre && (
                                <>
                                    <Text style={styles.subTitle}>Sobre:</Text>
                                    <Text style={styles.descriptionText}>{candidato.desc_sobre}</Text>
                                </>
                            )}
                            {candidato.links_externos && (
                                <View style={styles.linksContainer}>
                                    <Text style={styles.subTitle}>Links Externos:</Text>
                                    {candidato.links_externos.split(',').map((link, index) => {
                                        const trimmedLink = link.trim();
                                        let label = trimmedLink;

                                        if (trimmedLink.includes('instagram.com')) {
                                            label = 'Perfil no Instagram';
                                        } else if (trimmedLink.includes('linkedin.com')) {
                                            label = 'Perfil no LinkedIn';
                                        }

                                        return (
                                            <TouchableOpacity key={index} onPress={() => handleOpenLink(trimmedLink)}>
                                                <Text style={styles.linkText}>{label}</Text>
                                            </TouchableOpacity>
                                        );
                                    })}
                                </View>
                            )}
                            <TouchableOpacity
                                style={styles.contactButton}
                                onPress={() => Linking.openURL(`mailto:${candidato.email}`)}
                                disabled={!candidato.email} // Desabilita se não houver email
                            >
                                <Text style={styles.contactButtonText}>Enviar E-mail</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.contactButton}
                                onPress={() => Linking.openURL(`tel:${candidato.telefone}`)}
                                disabled={!candidato.telefone} // Desabilita se não houver telefone
                            >
                                <Text style={styles.contactButtonText}>Ligar para Candidato</Text>
                            </TouchableOpacity>
                        </>
                    ) : (
                        <Text style={styles.notFoundText}>Informações do candidato não encontradas ou excluídas.</Text>
                    )}
                </View>

                {/* Seção de Ações (para a Empresa) */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Ações</Text>
                    <View style={styles.buttonRow}>
                        <TouchableOpacity
                            style={[styles.actionButton, currentStatus === 'Aceita' && styles.actionButtonActive]}
                            onPress={() => handleUpdateStatus('Aceita')}
                            disabled={loading} // Desabilita durante o carregamento
                        >
                            <Text style={styles.actionButtonText}>Aceitar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.actionButton, currentStatus === 'Rejeitada' && styles.actionButtonActive]}
                            onPress={() => handleUpdateStatus('Rejeitada')}
                            disabled={loading}
                        >
                            <Text style={styles.actionButtonText}>Rejeitar</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.buttonRow}>
                        <TouchableOpacity
                            style={[styles.actionButton, currentStatus === 'Visualizada' && styles.actionButtonActive]}
                            onPress={() => handleUpdateStatus('Visualizada')}
                            disabled={loading}
                        >
                            <Text style={styles.actionButtonText}>Visualizada</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.actionButton, currentStatus === 'Pendente' && styles.actionButtonActive]}
                            onPress={() => handleUpdateStatus('Pendente')}
                            disabled={loading}
                        >
                            <Text style={styles.actionButtonText}>Pendente</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Text style={styles.backButtonText}>Voltar para Candidaturas</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.fundo,
    },
    scrollContent: {
        padding: 16,
        paddingBottom: 40, // Espaço extra para scroll
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.fundo,
    },
    header: {
        fontSize: 26,
        fontWeight: 'bold',
        color: colors.tituloBranco,
        marginBottom: 24,
        textAlign: 'center',
    },
    section: {
        backgroundColor: colors.fundo2,
        borderRadius: 10,
        padding: 18,
        marginBottom: 20,
        borderColor: colors.amarelo2,
        borderWidth: 1,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.amarelo2,
        marginBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: colors.cinzaClaro,
        paddingBottom: 5,
    },
    subTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.tituloBranco,
        marginTop: 10,
        marginBottom: 5,
    },
    infoText: {
        fontSize: 16,
        color: colors.tituloBranco,
        marginBottom: 5,
    },
    descriptionText: {
        fontSize: 15,
        color: colors.textoClaro,
        lineHeight: 22,
        marginBottom: 10,
    },
    linkText: {
        fontSize: 15,
        color: colors.link,
        textDecorationLine: 'underline',
        marginBottom: 5,
    },
    linksContainer: {
        marginBottom: 10,
    },
    notFoundText: {
        fontSize: 16,
        color: colors.vermelho,
        fontStyle: 'italic',
        textAlign: 'center',
        marginTop: 10,
    },
    statusText: (status: string) => {
        let color = colors.tituloBranco; // Cor padrão
        if (status === 'Aceita') color = colors.verde;
        else if (status === 'Rejeitada') color = colors.vermelho;
        else if (status === 'Visualizada') color = colors.amarelo2; // Amarelo para visualizada
        return {
            color: color,
            fontWeight: 'bold',
        };
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 10,
    },
    actionButton: {
        backgroundColor: colors.cinza,
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 8,
        flex: 1, // Faz os botões ocuparem o espaço disponível igualmente
        marginHorizontal: 5,
        alignItems: 'center',
    },
    actionButtonActive: {
        backgroundColor: colors.amarelo2, // Cor para o botão de status ativo
    },
    actionButtonText: {
        color: colors.tituloBranco,
        fontWeight: 'bold',
        fontSize: 15,
        textAlign: 'center',
    },
    contactButton: {
        backgroundColor: colors.amarelo1,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 15,
        marginBottom: 10,
    },
    contactButtonText: {
        color: colors.fundo,
        fontWeight: 'bold',
        fontSize: 16,
    },
    backButton: {
        backgroundColor: colors.cinzaEscuro,
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20,
    },
    backButtonText: {
        color: colors.tituloBranco,
        fontWeight: 'bold',
        fontSize: 16,
    },
    loadingText: {
        color: colors.tituloBranco,
        marginTop: 10,
        fontSize: 16,
    },
    errorText: {
        color: colors.vermelho,
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
    },
});

// detalhesCandidatura.tsx
/*import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ActivityIndicator, // Adicionado para feedback de loading
    ScrollView,
    TouchableOpacity,
    Alert,
    Linking // Para abrir links externos (e.g., redes sociais do candidato)
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router'; // Para obter os parâmetros passados
import { doc, getDoc, updateDoc } from 'firebase/firestore'; // Para buscar e atualizar documentos
import { db } from '@/src/firebase/config'; // Seu arquivo de configuração do Firebase
import { colors } from '@/src/components/global'; // Presumo que este arquivo exista
import { StatusBarObject } from '@/src/components/objects'; // Presumo que este arquivo exista

// Interfaces para os dados
interface CandidaturaDetalhes {
    id: string;
    jobId: string;
    userId: string;
    status: string;
    companyId?: string; // Tornar opcional se nem sempre existir
    appliedAt: { toDate: () => Date }; // Firestore timestamp
}

interface VagaDetalhes {
    id: string;
    nome_vaga: string;
    nome_empresa?: string; // Assumindo que pode não estar presente
    descricao?: string;
    localizacao?: string;
    modalidade?: string;
    regime?: string;
    salario?: string;
    email?: string; // E-mail da empresa na vaga (pode ser útil)
    // Adicione outros campos da coleção 'Vagas-trabalhos' conforme necessário
}

interface CandidatoDetalhes {
    uid: string;
    name_conta: string;
    email: string;
    telefone: string;
    desc_sobre?: string;
    endereco?: string;
    links_externos?: string; // String de links separados, talvez por vírgula ou JSON
    // Adicione outros campos da coleção 'Contas' (tipo Pessoa) conforme necessário
}

export default function DetalhesCandidatura() {
    const { idCandidatura, uidCandidato, jobId, nomeVaga, status, nomeCandidato } = useLocalSearchParams();
    const router = useRouter();

    const [candidatura, setCandidatura] = useState<CandidaturaDetalhes | null>(null);
    const [vaga, setVaga] = useState<VagaDetalhes | null>(null);
    const [candidato, setCandidato] = useState<CandidatoDetalhes | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentStatus, setCurrentStatus] = useState<string>(status as string || 'Pendente');

    useEffect(() => {
        const fetchDetalhes = async () => {
            // Verifica se os parâmetros essenciais estão presentes
            if (!idCandidatura || !uidCandidato || !jobId) {
                setError('Parâmetros da candidatura ausentes. Não foi possível carregar os detalhes.');
                setLoading(false);
                return;
            }

            try {
                // 1. Buscar detalhes da Candidatura
                const candidaturaRef = doc(db, 'applications', idCandidatura as string);
                const candidaturaSnap = await getDoc(candidaturaRef);

                if (!candidaturaSnap.exists()) {
                    setError('Candidatura não encontrada no banco de dados.');
                    setLoading(false);
                    return;
                }
                const candidaturaData = { id: candidaturaSnap.id, ...candidaturaSnap.data() } as CandidaturaDetalhes;
                setCandidatura(candidaturaData);
                // Sincroniza o estado de status com o que vem do banco de dados (mais preciso)
                setCurrentStatus(candidaturaData.status || 'Pendente'); 

                // 2. Buscar detalhes da Vaga
                // É uma boa prática verificar se jobId é uma string antes de usá-lo
                if (typeof jobId === 'string') {
                    const vagaRef = doc(db, 'Vagas-trabalhos', jobId);
                    const vagaSnap = await getDoc(vagaRef);

                    if (vagaSnap.exists()) {
                        setVaga({ id: vagaSnap.id, ...vagaSnap.data() } as VagaDetalhes);
                    } else {
                        console.warn('Vaga não encontrada para o jobId:', jobId);
                        setVaga(null); // Define como null se a vaga não for encontrada
                    }
                } else {
                    console.warn('jobId inválido ou ausente para buscar a vaga.');
                    setVaga(null);
                }


                // 3. Buscar detalhes do Candidato
                // É uma boa prática verificar se uidCandidato é uma string antes de usá-lo
                if (typeof uidCandidato === 'string') {
                    const candidatoRef = doc(db, 'Contas', uidCandidato);
                    const candidatoSnap = await getDoc(candidatoRef);

                    if (candidatoSnap.exists()) {
                        setCandidato({ uid: candidatoSnap.id, ...candidatoSnap.data() } as CandidatoDetalhes);
                    } else {
                        console.warn('Candidato não encontrado para o uidCandidato:', uidCandidato);
                        setCandidato(null); // Define como null se o candidato não for encontrado
                    }
                } else {
                    console.warn('uidCandidato inválido ou ausente para buscar o candidato.');
                    setCandidato(null);
                }

            } catch (err: any) {
                console.error('Erro ao buscar detalhes da candidatura:', err);
                setError('Erro ao carregar os detalhes da candidatura. Tente novamente.');
            } finally {
                setLoading(false);
            }
        };

        fetchDetalhes();
    }, [idCandidatura, uidCandidato, jobId]); // Dependências para re-executar quando os parâmetros mudam

    const handleUpdateStatus = async (newStatus: string) => {
        if (!candidatura) {
            Alert.alert('Erro', 'Dados da candidatura não carregados. Não foi possível atualizar o status.');
            return;
        }

        setLoading(true); // Começa a carregar
        try {
            const candidaturaRef = doc(db, 'applications', candidatura.id);
            await updateDoc(candidaturaRef, {
                status: newStatus
            });
            setCurrentStatus(newStatus); // Atualiza o status local para refletir a mudança
            Alert.alert('Sucesso', `Status da candidatura atualizado para: ${newStatus}`);
        } catch (err) {
            console.error('Erro ao atualizar status:', err);
            Alert.alert('Erro', 'Não foi possível atualizar o status da candidatura. Verifique sua conexão.');
        } finally {
            setLoading(false); // Para de carregar
        }
    };

    const handleOpenLink = async (url: string) => {
        // Adiciona http(s):// se não estiver presente para que Linking funcione corretamente
        const fullUrl = url.startsWith('http://') || url.startsWith('https://') ? url : `https://${url}`;
        
        try {
            const supported = await Linking.canOpenURL(fullUrl);
            if (supported) {
                await Linking.openURL(fullUrl);
            } else {
                Alert.alert('Erro', `Não foi possível abrir o link: ${fullUrl}. Formato inválido ou aplicativo não encontrado.`);
            }
        } catch (error) {
            console.error('Erro ao abrir link:', error);
            Alert.alert('Erro', 'Ocorreu um erro ao tentar abrir o link.');
        }
    };

    // Feedback de carregamento
    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color={colors.amarelo1} />
                <Text style={styles.loadingText}>Carregando detalhes da candidatura...</Text>
            </View>
        );
    }

    // Feedback de erro
    if (error) {
        return (
            <View style={styles.centered}>
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Text style={styles.backButtonText}>Voltar</Text>
                </TouchableOpacity>
            </View>
        );
    }

    // Caso a candidatura principal não seja encontrada (após loading)
    if (!candidatura) {
        return (
            <View style={styles.centered}>
                <Text style={styles.errorText}>Candidatura não encontrada ou não disponível.</Text>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Text style={styles.backButtonText}>Voltar</Text>
                </TouchableOpacity>
            </View>
        );
    }

    // Função auxiliar para formatar timestamp
    const formatTimestamp = (timestamp: { toDate: () => Date } | undefined) => {
        if (!timestamp) return 'Data não disponível';
        const date = timestamp.toDate();
        return date.toLocaleDateString('pt-BR') + ' às ' + date.toLocaleTimeString('pt-BR');
    };

    return (
        <View style={styles.container}>
            <StatusBarObject />
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text style={styles.header}>Detalhes da Candidatura</Text>

                
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Candidatura</Text>
                    <Text style={styles.infoText}>Status: <Text style={styles.statusText(currentStatus)}>{currentStatus}</Text></Text>
                    <Text style={styles.infoText}>Candidatou em: {formatTimestamp(candidatura.appliedAt)}</Text>
                    
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Detalhes da Vaga</Text>
                    {vaga ? (
                        <>
                            <Text style={styles.infoText}>Vaga: {vaga.nome_vaga || 'Não informado'}</Text>
                            <Text style={styles.infoText}>Empresa: {vaga.nome_empresa || 'Não informado'}</Text>
                            <Text style={styles.infoText}>Localização: {vaga.localizacao || 'Não informado'}</Text>
                            <Text style={styles.infoText}>Modalidade: {vaga.modalidade || 'Não informado'}</Text>
                            <Text style={styles.infoText}>Regime: {vaga.regime || 'Não informado'}</Text>
                            <Text style={styles.infoText}>Salário: {vaga.salario || 'Não informado'}</Text>
                            {vaga.descricao && (
                                <>
                                    <Text style={styles.subTitle}>Descrição da Vaga:</Text>
                                    <Text style={styles.descriptionText}>{vaga.descricao}</Text>
                                </>
                            )}
                        </>
                    ) : (
                        <Text style={styles.notFoundText}>Informações da vaga não encontradas ou excluídas.</Text>
                    )}
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Detalhes do Candidato</Text>
                    {candidato ? (
                        <>
                            <Text style={styles.infoText}>Nome: {candidato.name_conta || 'Não informado'}</Text>
                            <Text style={styles.infoText}>Email: {candidato.email || 'Não informado'}</Text>
                            <Text style={styles.infoText}>Telefone: {candidato.telefone || 'Não informado'}</Text>
                            {candidato.endereco && <Text style={styles.infoText}>Endereço: {candidato.endereco}</Text>}
                            {candidato.desc_sobre && (
                                <>
                                    <Text style={styles.subTitle}>Sobre:</Text>
                                    <Text style={styles.descriptionText}>{candidato.desc_sobre}</Text>
                                </>
                            )}
                            {candidato.links_externos && (
                                <View style={styles.linksContainer}>
                                    <Text style={styles.subTitle}>Links Externos:</Text>
                                    
                                    {candidato.links_externos.split(',').map((link, index) => (
                                        <TouchableOpacity key={index} onPress={() => handleOpenLink(link.trim())}>
                                            <Text style={styles.linkText}>{link.trim()}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            )}
                            <TouchableOpacity
                                style={styles.contactButton}
                                onPress={() => Linking.openURL(`mailto:${candidato.email}`)}
                                disabled={!candidato.email} // Desabilita se não houver email
                            >
                                <Text style={styles.contactButtonText}>Enviar E-mail</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.contactButton}
                                onPress={() => Linking.openURL(`tel:${candidato.telefone}`)}
                                disabled={!candidato.telefone} // Desabilita se não houver telefone
                            >
                                <Text style={styles.contactButtonText}>Ligar para Candidato</Text>
                            </TouchableOpacity>
                        </>
                    ) : (
                        <Text style={styles.notFoundText}>Informações do candidato não encontradas ou excluídas.</Text>
                    )}
                </View>

                
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Ações</Text>
                    <View style={styles.buttonRow}>
                        <TouchableOpacity
                            style={[styles.actionButton, currentStatus === 'Aceita' && styles.actionButtonActive]}
                            onPress={() => handleUpdateStatus('Aceita')}
                            disabled={loading} // Desabilita durante o carregamento
                        >
                            <Text style={styles.actionButtonText}>Aceitar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.actionButton, currentStatus === 'Rejeitada' && styles.actionButtonActive]}
                            onPress={() => handleUpdateStatus('Rejeitada')}
                            disabled={loading}
                        >
                            <Text style={styles.actionButtonText}>Rejeitar</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.buttonRow}>
                        <TouchableOpacity
                            style={[styles.actionButton, currentStatus === 'Visualizada' && styles.actionButtonActive]}
                            onPress={() => handleUpdateStatus('Visualizada')}
                            disabled={loading}
                        >
                            <Text style={styles.actionButtonText}>Visualizada</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.actionButton, currentStatus === 'Pendente' && styles.actionButtonActive]}
                            onPress={() => handleUpdateStatus('Pendente')}
                            disabled={loading}
                        >
                            <Text style={styles.actionButtonText}>Pendente</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Text style={styles.backButtonText}>Voltar para Candidaturas</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.fundo,
    },
    scrollContent: {
        padding: 16,
        paddingBottom: 40, // Espaço extra para scroll
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.fundo,
    },
    header: {
        fontSize: 26,
        fontWeight: 'bold',
        color: colors.tituloBranco,
        marginBottom: 24,
        textAlign: 'center',
    },
    section: {
        backgroundColor: colors.fundo2,
        borderRadius: 10,
        padding: 18,
        marginBottom: 20,
        borderColor: colors.amarelo2,
        borderWidth: 1,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.amarelo2,
        marginBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: colors.cinzaClaro,
        paddingBottom: 5,
    },
    subTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.tituloBranco,
        marginTop: 10,
        marginBottom: 5,
    },
    infoText: {
        fontSize: 16,
        color: colors.tituloBranco,
        marginBottom: 5,
    },
    descriptionText: {
        fontSize: 15,
        color: colors.textoClaro,
        lineHeight: 22,
        marginBottom: 10,
    },
    linkText: {
        fontSize: 15,
        color: colors.link,
        textDecorationLine: 'underline',
        marginBottom: 5,
    },
    linksContainer: {
        marginBottom: 10,
    },
    notFoundText: {
        fontSize: 16,
        color: colors.vermelho,
        fontStyle: 'italic',
        textAlign: 'center',
        marginTop: 10,
    },
    statusText: (status: string) => {
        let color = colors.tituloBranco; // Cor padrão
        if (status === 'Aceita') color = colors.verde;
        else if (status === 'Rejeitada') color = colors.vermelho;
        else if (status === 'Visualizada') color = colors.amarelo2; // Amarelo para visualizada
        return {
            color: color,
            fontWeight: 'bold',
        };
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 10,
    },
    actionButton: {
        backgroundColor: colors.cinza,
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 8,
        flex: 1, // Faz os botões ocuparem o espaço disponível igualmente
        marginHorizontal: 5,
        alignItems: 'center',
    },
    actionButtonActive: {
        backgroundColor: colors.amarelo2, // Cor para o botão de status ativo
    },
    actionButtonText: {
        color: colors.tituloBranco,
        fontWeight: 'bold',
        fontSize: 15,
        textAlign: 'center',
    },
    contactButton: {
        backgroundColor: colors.amarelo1,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 15,
        marginBottom: 10,
    },
    contactButtonText: {
        color: colors.fundo,
        fontWeight: 'bold',
        fontSize: 16,
    },
    backButton: {
        backgroundColor: colors.cinzaEscuro,
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20,
    },
    backButtonText: {
        color: colors.tituloBranco,
        fontWeight: 'bold',
        fontSize: 16,
    },
    loadingText: {
        color: colors.tituloBranco,
        marginTop: 10,
        fontSize: 16,
    },
    errorText: {
        color: colors.vermelho,
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
    },
});
*/