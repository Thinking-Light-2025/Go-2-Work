// Avisos.tsx

import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { collection, query, where, onSnapshot, getDocs, doc, getDoc } from 'firebase/firestore';
import { db, auth } from '@/src/firebase/config';
import { colors } from '@/src/components/global';
import { StatusBarObject } from '@/src/components/objects';
import { useRouter } from 'expo-router';

interface Candidatura {
    id: string;
    jobId?: string;
    userId?: string;
    status?: string;
    companyId?: string;
    appliedAt?: string;
    name_conta?: string;
}

interface Vaga {
    id: string;
    nome_vaga?: string;
    nome_empresa?: string;
    regime?: string;
    setor?: string;
    name_conta?: string;
    email?: string;
    modalidade?: string;
    // Adicione outros campos relevantes da sua coleção 'Vagas-trabalhos'
}

interface CandidatoInfo {
    [userId: string]: { name_conta?: string };
}

export default function Avisos() {
    const [candidaturasEmpresa, setCandidaturasEmpresa] = useState<Candidatura[]>([]); // Para empresas
    const [vagasEmpresaPublicadas, setVagasEmpresaPublicadas] = useState<Vaga[]>([]); // Vagas publicadas pela empresa logada
    const [infoCandidatos, setInfoCandidatos] = useState<CandidatoInfo>({}); // Info de candidatos para empresas

    const [candidaturasPessoa, setCandidaturasPessoa] = useState<CandidaturaVagaInfo[]>([]); // Para pessoas
    const [loading, setLoading] = useState(true); // Novo estado de loading
    
    const [isEmpresa, setIsEmpresa] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const verificarETrazerDados = async () => {
            setLoading(true);
            const user = auth.currentUser;
            if (user) {
                const userDoc = await getDoc(doc(db, 'Contas', user.uid));
                if (userDoc.exists() && userDoc.data()?.tipo_conta === 'Empresa') {
                    setIsEmpresa(true);
                    // Lógica de empresa (já existente)
                    const empresaUid = user.uid;
                    const vagasCollection = collection(db, 'Vagas-trabalhos');
                    const qVagasEmpresa = query(vagasCollection, where('uid_criadorVaga', '==', empresaUid));
                    const snapshotVagasEmpresa = await getDocs(qVagasEmpresa);
                    const idsVagasEmpresa = snapshotVagasEmpresa.docs.map(doc => doc.id);
                    setVagasEmpresaPublicadas(snapshotVagasEmpresa.docs.map(doc => ({ id: doc.id, ...doc.data() } as Vaga)));

                    if (idsVagasEmpresa.length > 0) {
                        const applicationsCollection = collection(db, 'applications');
                        const qCandidaturas = query(applicationsCollection, where('jobId', 'in', idsVagasEmpresa));
                        const unsubscribeCandidaturas = onSnapshot(qCandidaturas, async (snapshotCandidaturas) => {
                            const candidaturasList: Candidatura[] = [];
                            const candidatosIds = new Set<string>();
                            snapshotCandidaturas.forEach((doc) => {
                                const candidaturaData = { id: doc.id, ...doc.data() } as Candidatura;
                                candidaturasList.push(candidaturaData);
                                if (candidaturaData.userId) {
                                    candidatosIds.add(candidaturaData.userId);
                                }
                            });
                            setCandidaturasEmpresa(candidaturasList);

                            const candidatosInfo: CandidatoInfo = {};
                            for (const userId of candidatosIds) {
                                const candidatoDoc = await getDoc(doc(db, 'Contas', userId));
                                if (candidatoDoc.exists()) {
                                    candidatosInfo[userId] = candidatoDoc.data();
                                }
                            }
                            setInfoCandidatos(candidatosInfo);
                        });
                        setLoading(false);
                        return () => unsubscribeCandidaturas();
                    } else {
                        setCandidaturasEmpresa([]);
                        setInfoCandidatos({});
                        setLoading(false);
                    }
                } else {
                    // Lógica para tipo Pessoa
                    setIsEmpresa(false);
                    const applicationsCollection = collection(db, 'applications');
                    const qMinhasCandidaturas = query(applicationsCollection, where('userId', '==', user.uid));

                    const unsubscribeMinhasCandidaturas = onSnapshot(qMinhasCandidaturas, async (snapshotCandidaturas) => {
                        const candidaturasPessoaList: CandidaturaVagaInfo[] = [];
                        const jobIdsUnicos = new Set<string>();

                        snapshotCandidaturas.forEach((docSnap) => {
                            const candidaturaData = { id: docSnap.id, ...docSnap.data() } as Candidatura;
                            if (candidaturaData.jobId) {
                                jobIdsUnicos.add(candidaturaData.jobId);
                                candidaturasPessoaList.push({
                                    idCandidatura: candidaturaData.id,
                                    jobId: candidaturaData.jobId,
                                    status: candidaturaData.status || 'Pendente',
                                    appliedAt: candidaturaData.appliedAt,
                                });
                            }
                        });

                        // Buscar detalhes das vagas para as quais o usuário se candidatou
                        if (jobIdsUnicos.size > 0) {
                            const vagasRef = collection(db, 'Vagas-trabalhos');
                            // Firestore limita 'in' a 10 valores, se tiver mais, precisa de múltiplas consultas
                            const jobIdsArray = Array.from(jobIdsUnicos);
                            const vagasPromises = jobIdsArray.map(id => getDoc(doc(vagasRef, id)));
                            const vagasSnaps = await Promise.all(vagasPromises);

                            const vagasInfoMap = new Map<string, Vaga>();
                            vagasSnaps.forEach(vagaSnap => {
                                if (vagaSnap.exists()) {
                                    vagasInfoMap.set(vagaSnap.id, { id: vagaSnap.id, ...vagaSnap.data() } as Vaga);
                                }
                            });

                            const finalCandidaturasPessoa = candidaturasPessoaList.map(candidatura => {
                                const vagaInfo = vagasInfoMap.get(candidatura.jobId);
                                return {
                                    ...candidatura,
                                    nome_vaga: vagaInfo?.nome_vaga,
                                    nome_empresa: vagaInfo?.nome_empresa,
                                    modalidade: vagaInfo?.modalidade,
                                    email_empresa: vagaInfo?.email, // Email da empresa na vaga
                                };
                            });
                            setCandidaturasPessoa(finalCandidaturasPessoa);
                        } else {
                            setCandidaturasPessoa([]);
                        }
                        setLoading(false);
                    });
                    return () => unsubscribeMinhasCandidaturas();
                }
            } else {
                setLoading(false);
                // Usuário não logado, talvez redirecionar para tela de login
                router.replace('/login'); // Exemplo de redirecionamento
            }
        };

        verificarETrazerDados();
    }, []); // Dependência vazia para rodar apenas uma vez no montagem

    // Renderização de Candidaturas para EMPRESA (já existente e funcionando)
    const renderCandidaturaEmpresa = ({ item }: { item: Candidatura }) => {
        const nomeCandidato = infoCandidatos[item.userId || '']?.name_conta || 'Nome não disponível';
        const vagaRelacionada = vagasEmpresaPublicadas.find(vaga => vaga.id === item.jobId)?.nome_vaga || 'Vaga não encontrada';

        return (
            <TouchableOpacity style={styles.candidaturaItem} onPress={() => {
                router.push({
                    pathname: '/(tabs)/(stack)/detalhesCandidatura',
                    params: {
                        idCandidatura: item.id,
                        uidCandidato: item.userId,
                        jobId: item.jobId,
                    },
                });
            }}>
                <Text style={styles.tituloCandidatura}>Candidato: {nomeCandidato}</Text>
                <Text style={styles.infoCandidatura}>Vaga: {vagaRelacionada}</Text>
                <Text style={styles.infoCandidatura}>Status: {item.status || 'Pendente'}</Text>
            </TouchableOpacity>
        );
    };

    // Renderização de Candidaturas para PESSOA (NOVA)
    const renderMinhaCandidatura = ({ item }: { item: CandidaturaVagaInfo }) => {
        const statusColor = (status: string) => {
            switch (status) {
                case 'Aceita': return colors.verde;
                case 'Rejeitada': return colors.vermelho;
                case 'Visualizada': return colors.azulClaro;
                case 'Pendente': return colors.amarelo2;
                default: return colors.tituloBranco;
            }
        };

        return (
            <TouchableOpacity style={styles.vagaItem} onPress={() => {
                // Aqui você pode adicionar a lógica para navegar para os detalhes da sua candidatura
                router.push({
                    pathname: '/minhaCandidaturaDetalhes', // A nova tela que vamos criar
                    params: {
                        idCandidatura: item.idCandidatura,
                        jobId: item.jobId,
                        // Poderíamos passar os dados já resolvidos para renderização inicial rápida
                        // mas a nova tela irá buscar para garantir consistência
                    },
                });
            }}>
                <Text style={styles.titulo}>{item.nome_vaga || 'Vaga não informada'}</Text>
                <Text style={styles.subTitle}>{item.nome_empresa || 'Empresa não informada'}</Text>
                <Text style={styles.info}>Modalidade: {item.modalidade || 'Não informado'}</Text>
                <Text style={styles.info}>Email da Empresa: {item.email_empresa || 'Não informado'}</Text>
                <Text style={[styles.info, { fontWeight: 'bold', color: statusColor(item.status || 'Pendente') }]}>
                    Status: {item.status || 'Pendente'}
                </Text>
            </TouchableOpacity>
        );
    };

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color={colors.amarelo1} />
                <Text style={styles.loadingText}>Carregando avisos...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <StatusBarObject />
            <Text style={styles.header}>{isEmpresa ? 'Candidaturas Recebidas' : 'Minhas Candidaturas'}</Text>
            
            {isEmpresa ? (
                // Conteúdo para Empresas
                candidaturasEmpresa.length === 0 ? (
                    <Text style={[styles.infoCandidatura, { textAlign: 'center', marginTop: 20 }]}>
                        Nenhuma candidatura recebida para suas vagas.
                    </Text>
                ) : (
                    <FlatList
                        data={candidaturasEmpresa}
                        renderItem={renderCandidaturaEmpresa}
                        keyExtractor={(item) => item.id}
                    />
                )
            ) : (
                // Conteúdo para Pessoas (Minhas Candidaturas)
                candidaturasPessoa.length === 0 ? (
                    <Text style={[styles.info, { textAlign: 'center', marginTop: 20 }]}>
                        Você ainda não se candidatou a nenhuma vaga.
                    </Text>
                ) : (
                    <FlatList
                        data={candidaturasPessoa}
                        renderItem={renderMinhaCandidatura}
                        keyExtractor={(item) => item.idCandidatura}
                    />
                )
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: colors.fundo,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.fundo,
    },
    loadingText: {
        marginTop: 10,
        color: colors.tituloBranco,
        fontSize: 16,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.tituloBranco,
        marginBottom: 16,
    },
    // Estilos para a visualização de vagas por candidatos (reutilizados)
    vagaItem: {
        backgroundColor: colors.cinza,
        padding: 16,
        marginBottom: 12,
        borderRadius: 8,
    },
    titulo: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
        color: colors.tituloBranco,
    },
    info: {
        fontSize: 16,
        color: colors.tituloBranco,
        marginBottom: 3,
    },
    // Estilos para a visualização de candidaturas por empresas (já existentes)
    candidaturaItem: {
        backgroundColor: colors.fundo2,
        padding: 16,
        marginBottom: 12,
        borderRadius: 8,
        borderColor: colors.amarelo2,
        borderWidth: 1,
    },
    tituloCandidatura: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
        color: colors.amarelo2,
    },
    infoCandidatura: {
        fontSize: 16,
        color: colors.tituloBranco,
        marginBottom: 3,
    },
});