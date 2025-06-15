// detalhesCandidatura.tsx

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { doc, getDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/src/firebase/config';
import { colors } from '@/src/components/global';
import { StatusBarObject, Botão } from '@/src/components/objects';

interface RouteParams {
    idCandidatura?: string;
    uidCandidato?: string;
    jobId?: string;
    nomeVaga?: string;
    status?: string;
    nomeCandidato?: string;
}

interface VagaDetalhada extends RouteParams {
    appliedAt: React.JSX.Element;
    createdAt: Timestamp;
    nome_empresa?: string;
    regime?: string;
    setor?: string;
    descricao?: string; // Supondo que você tenha essa informação na sua vaga
    // Adicione outros campos relevantes da sua coleção 'Vagas-trabalhos'
}

interface CandidatoDetalhado extends RouteParams {
    email?: string;
    telefone?: string;
    desc_sobre?: string;
    links_externos?: string;
    // Adicione outros campos relevantes da sua coleção 'Contas' para candidatos
}

export default function DetalhesCandidatura() {
    const { idCandidatura, uidCandidato, jobId, nomeVaga, status, nomeCandidato } = useLocalSearchParams<RouteParams>();
    const [vaga, setVaga] = useState<VagaDetalhada>({ nomeVaga, status, nomeCandidato } as VagaDetalhada);
    const [candidato, setCandidato] = useState<CandidatoDetalhado>({ nomeCandidato } as CandidatoDetalhado);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

useEffect(() => {
    const fetchDetalhes = async () => {
        setLoading(true);
        setError(null);
        console.log('ID da Vaga recebido:', jobId); // ADICIONE ESTE LOG

        try {
            if (jobId) {
                const vagaDoc = await getDoc(doc(db, 'Vagas-trabalho', jobId));
                // ... restante do seu código
            }
            // ... restante do seu código
        } catch (e: any) {
            setError('Erro ao carregar detalhes.');
            console.error('Erro ao buscar detalhes:', e);
        } finally {
            setLoading(false);
        }
    };

    fetchDetalhes();
}, [jobId, uidCandidato]);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.amarelo1} />
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <StatusBarObject />
            <ScrollView>
                <Text style={styles.header}>Detalhes da Candidatura</Text>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Informações da Candidatura</Text>
                    <Text style={styles.infoText}>ID da Candidatura: {idCandidatura}</Text>
                    <Text style={styles.infoText}>Status: {status || 'Pendente'}</Text>
                    {vaga.appliedAt && <Text style={styles.infoText}>Data de Aplicação: {vaga.appliedAt}</Text>}
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Informações do Candidato</Text>
                    <Text style={styles.infoText}>Nome: {candidato.nomeCandidato || 'Não disponível'}</Text>
                    {candidato.email && <Text style={styles.infoText}>Email: {candidato.email}</Text>}
                    {candidato.telefone && <Text style={styles.infoText}>Telefone: {candidato.telefone}</Text>}
                    {candidato.desc_sobre && <Text style={styles.infoText}>Sobre: {candidato.desc_sobre}</Text>}
                    {candidato.links_externos && <Text style={styles.infoText}>Links: {candidato.links_externos}</Text>}
                    {/* Adicione outras informações do candidato que você deseja exibir */}
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Informações da Vaga</Text>
                    <Text style={styles.infoText}>Vaga: {vaga.nomeVaga || 'Não disponível'}</Text>
                    {vaga.nome_empresa && <Text style={styles.infoText}>Empresa: {vaga.nome_empresa}</Text>}
                    {vaga.regime && <Text style={styles.infoText}>Regime: {vaga.regime}</Text>}
                    {vaga.setor && <Text style={styles.infoText}>Setor: {vaga.setor}</Text>}
                    {vaga.descricao && <Text style={styles.infoText}>Descrição: {vaga.descricao}</Text>}
                    {/* Adicione outras informações da vaga que você deseja exibir */}
                </View>
                    <View style={{ flexDirection: 'row', gap: 10 }}>
                        <Botão activeOpacity={0.8} style={{ flex: 1 }}>
                            <Text style={{ fontSize: 18, color: colors.tituloBranco }}>Rejeitar</Text>
                        </Botão>
                        <Botão activeOpacity={0.8} style={{ flex: 1 }}>
                            <Text style={{ fontSize: 18, color: colors.tituloBranco }}>Aceitar</Text>
                        </Botão>
                    </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: colors.fundo,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.fundo,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: colors.fundo,
    },
    errorText: {
        fontSize: 18,
        color: colors.amarelo1,
        textAlign: 'center',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.tituloBranco,
        marginBottom: 16,
        textAlign: 'center',
    },
    section: {
        backgroundColor: colors.fundo2,
        padding: 16,
        marginBottom: 12,
        borderRadius: 8,
        borderColor: colors.amarelo2,
        borderWidth: 1,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.amarelo2,
        marginBottom: 8,
    },
    infoText: {
        fontSize: 16,
        color: colors.tituloBranco,
        marginBottom: 6,
    },
});

/*
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/src/firebase/config';
import { colors } from '@/src/components/global';
import { StatusBarObject } from '@/src/components/objects';

interface VagaDetalhada {
    nome_empresa?: string;
    regime?: string;
    setor?: string;
    descricao?: string;
    createdAt?: any; // Timestamp
    // Outros campos relevantes da sua coleção 'Vagas-trabalho'
}

interface CandidatoDetalhado {
    email?: string;
    telefone?: string;
    desc_sobre?: string;
    links_externos?: string;
    createdAt?: any; // Timestamp
    name_conta?: string;
    // Outros campos relevantes da sua coleção 'Contas' para candidatos
}

export default function DetalhesCandidatura() {
    const { idCandidatura, uidCandidato, jobId, nomeVaga, status, nomeCandidato } = useLocalSearchParams();
    const [vagaDetalhe, setVagaDetalhe] = useState<VagaDetalhada>({});
    const [candidatoDetalhe, setCandidatoDetalhe] = useState<CandidatoDetalhado>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDetails = async () => {
            setLoading(true);
            setError(null);

            try {
                if (jobId) {
                    const vagaDocRef = doc(db, 'Vagas-trabalho', jobId);
                    const vagaDocSnap = await getDoc(vagaDocRef);
                    if (vagaDocSnap.exists()) {
                        setVagaDetalhe(vagaDocSnap.data() as VagaDetalhada);
                    } else {
                        setError('Detalhes da vaga não encontrados.');
                    }
                }

                if (uidCandidato) {
                    const candidatoDocRef = doc(db, 'Contas', uidCandidato);
                    const candidatoDocSnap = await getDoc(candidatoDocRef);
                    if (candidatoDocSnap.exists()) {
                        setCandidatoDetalhe(candidatoDocSnap.data() as CandidatoDetalhado);
                    } else {
                        setError('Detalhes do candidato não encontrados.');
                    }
                }
            } catch (e: any) {
                setError('Erro ao carregar detalhes.');
                console.error(e);
            } finally {
                setLoading(false);
            }
        };

        fetchDetails();
    }, [jobId, uidCandidato]);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.amarelo1} />
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <StatusBarObject />
            <ScrollView>
                <Text style={styles.header}>Detalhes da Candidatura</Text>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Informações da Candidatura</Text>
                    <Text style={styles.infoText}>ID da Candidatura: {idCandidatura}</Text>
                    <Text style={styles.infoText}>Status: {status || 'Pendente'}</Text>
                    
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Informações do Candidato</Text>
                    <Text style={styles.infoText}>Nome: {nomeCandidato || candidatoDetalhe.name_conta || 'Não disponível'}</Text>
                    {candidatoDetalhe.email && <Text style={styles.infoText}>Email: {candidatoDetalhe.email}</Text>}
                    {candidatoDetalhe.telefone && <Text style={styles.infoText}>Telefone: {candidatoDetalhe.telefone}</Text>}
                    {candidatoDetalhe.desc_sobre && <Text style={styles.infoText}>Sobre: {candidatoDetalhe.desc_sobre}</Text>}
                    {candidatoDetalhe.links_externos && <Text style={styles.infoText}>Links: {candidatoDetalhe.links_externos}</Text>}
                    {candidatoDetalhe.createdAt && <Text style={styles.infoText}>Criado em: {candidatoDetalhe.createdAt.toDate().toLocaleDateString()}</Text>}
                    
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Informações da Vaga</Text>
                    <Text style={styles.infoText}>Vaga: {nomeVaga || 'Não disponível'}</Text>
                    {vagaDetalhe.nome_empresa && <Text style={styles.infoText}>Empresa: {vagaDetalhe.nome_empresa}</Text>}
                    {vagaDetalhe.regime && <Text style={styles.infoText}>Regime: {vagaDetalhe.regime}</Text>}
                    {vagaDetalhe.setor && <Text style={styles.infoText}>Setor: {vagaDetalhe.setor}</Text>}
                    {vagaDetalhe.descricao && <Text style={styles.infoText}>Descrição: {vagaDetalhe.descricao}</Text>}
                    {vagaDetalhe.createdAt && <Text style={styles.infoText}>Criado em: {vagaDetalhe.createdAt?.toDate().toLocaleDateString()}</Text>}
                    
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: colors.fundo,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.fundo,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: colors.fundo,
    },
    errorText: {
        fontSize: 18,
        color: colors.amarelo1,
        textAlign: 'center',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.tituloBranco,
        marginBottom: 16,
        textAlign: 'center',
    },
    section: {
        backgroundColor: colors.fundo2,
        padding: 16,
        marginBottom: 12,
        borderRadius: 8,
        borderColor: colors.amarelo2,
        borderWidth: 1,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.amarelo2,
        marginBottom: 8,
    },
    infoText: {
        fontSize: 16,
        color: colors.tituloBranco,
        marginBottom: 6,
    },
});
*/