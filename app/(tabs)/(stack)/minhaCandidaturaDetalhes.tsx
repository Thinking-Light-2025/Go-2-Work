// minhaCandidaturaDetalhes.tsx

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/src/firebase/config';
import { colors } from '@/src/components/global';
import { StatusBarObject } from '@/src/components/objects';

interface CandidaturaDetalhesPropria {
    id: string;
    jobId: string;
    userId: string; // Deve ser o ID do usuário logado
    status: string;
    appliedAt: { toDate: () => Date };
}

interface VagaDetalhesPropria {
    id: string;
    nome_vaga: string;
    nome_empresa?: string;
    descricao?: string;
    localizacao?: string;
    modalidade?: string;
    regime?: string;
    salario?: string;
    email?: string; // Email da empresa na vaga
}

interface CandidaturaVagaInfo {
    idCandidatura: string; // ID do documento da candidatura
    jobId: string;         // ID da vaga
    status: string;        // Status da candidatura
    appliedAt: { toDate: () => Date }; // Data de aplicação
    nome_vaga?: string;    // Nome da vaga
    nome_empresa?: string; // Nome da empresa
    modalidade?: string;
    email_empresa?: string; // Email da empresa (da vaga)
}

export default function MinhaCandidaturaDetalhes() {
    const { idCandidatura, jobId } = useLocalSearchParams();
    const router = useRouter();

    const [candidatura, setCandidatura] = useState<CandidaturaDetalhesPropria | null>(null);
    const [vaga, setVaga] = useState<VagaDetalhesPropria | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDetalhes = async () => {
            if (!idCandidatura || !jobId) {
                setError('Parâmetros da candidatura ausentes.');
                setLoading(false);
                return;
            }

            try {
                // 1. Buscar detalhes da Candidatura específica do usuário
                const candidaturaRef = doc(db, 'applications', idCandidatura as string);
                const candidaturaSnap = await getDoc(candidaturaRef);

                if (!candidaturaSnap.exists()) {
                    setError('Candidatura não encontrada.');
                    setLoading(false);
                    return;
                }
                setCandidatura({ id: candidaturaSnap.id, ...candidaturaSnap.data() } as CandidaturaDetalhesPropria);

                // 2. Buscar detalhes da Vaga
                const vagaRef = doc(db, 'Vagas-trabalhos', jobId as string);
                const vagaSnap = await getDoc(vagaRef);

                if (vagaSnap.exists()) {
                    setVaga({ id: vagaSnap.id, ...vagaSnap.data() } as VagaDetalhesPropria);
                } else {
                    console.warn('Vaga não encontrada para o jobId:', jobId);
                    setVaga(null);
                }

            } catch (err: any) {
                console.error('Erro ao buscar detalhes da candidatura:', err);
                setError('Erro ao carregar os detalhes da candidatura. Tente novamente.');
            } finally {
                setLoading(false);
            }
        };

        fetchDetalhes();
    }, [idCandidatura, jobId]);

    const formatTimestamp = (timestamp: { toDate: () => Date } | undefined) => {
        if (!timestamp) return 'Data não disponível';
        const date = timestamp.toDate();
        return date.toLocaleDateString('pt-BR') + ' às ' + date.toLocaleTimeString('pt-BR');
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Aceita': return colors.verde;
            case 'Rejeitada': return colors.vermelho;
            case 'Visualizada': return colors.azulClaro;
            case 'Pendente': return colors.amarelo2;
            default: return colors.tituloBranco;
        }
    };

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color={colors.amarelo1} />
                <Text style={styles.loadingText}>Carregando detalhes da sua candidatura...</Text>
            </View>
        );
    }

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

    return (
        <View style={styles.container}>
            <StatusBarObject />
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text style={styles.header}>Detalhes da Sua Candidatura</Text>

                {/* Seção da Candidatura */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Sua Candidatura</Text>
                    <Text style={styles.infoText}>
                        Status: <Text style={[styles.statusText, { color: getStatusColor(candidatura.status) }]}>{candidatura.status || 'Pendente'}</Text>
                    </Text>
                    <Text style={styles.infoText}>Candidatou em: {formatTimestamp(candidatura.appliedAt)}</Text>
                </View>

                {/* Seção da Vaga */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Detalhes da Vaga</Text>
                    {vaga ? (
                        <>
                            <Text style={styles.infoText}>Vaga: {vaga.nome_vaga || 'Não informado'}</Text>
                            <Text style={styles.infoText}>Empresa: {vaga.nome_empresa || 'Não informado'}</Text>
                            <Text style={styles.infoText}>Modalidade: {vaga.modalidade || 'Não informado'}</Text>
                            <Text style={styles.infoText}>Email da Empresa: {vaga.email || 'Não informado'}</Text>
                            {vaga.localizacao && <Text style={styles.infoText}>Localização: {vaga.localizacao}</Text>}
                            {vaga.regime && <Text style={styles.infoText}>Regime: {vaga.regime}</Text>}
                            {vaga.salario && <Text style={styles.infoText}>Salário: {vaga.salario}</Text>}
                            {vaga.descricao && (
                                <>
                                    <Text style={styles.subTitle}>Descrição:</Text>
                                    <Text style={styles.descriptionText}>{vaga.descricao}</Text>
                                </>
                            )}
                        </>
                    ) : (
                        <Text style={styles.notFoundText}>Informações da vaga não encontradas ou excluídas.</Text>
                    )}
                </View>

                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Text style={styles.backButtonText}>Voltar para Meus Avisos</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.fundo,
        padding: 16,
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
    errorText: {
        color: colors.vermelho,
        fontSize: 18,
        textAlign: 'center',
        marginBottom: 20,
    },
    header: {
        fontSize: 28,
        fontWeight: 'bold',
        color: colors.amarelo2,
        marginBottom: 20,
        textAlign: 'center',
    },
    scrollContent: {
        paddingBottom: 20, // Espaçamento extra no final
    },
    section: {
        backgroundColor: colors.fundo2,
        borderRadius: 10,
        padding: 15,
        marginBottom: 15,
        borderColor: colors.amarelo2,
        borderWidth: 1,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: colors.tituloBranco,
        marginBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: colors.cinzaClaro,
        paddingBottom: 5,
    },
    infoText: {
        fontSize: 16,
        color: colors.tituloBranco,
        marginBottom: 5,
    },
    statusText: {
        fontWeight: 'bold',
    },
    subTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.tituloBranco,
        marginTop: 10,
        marginBottom: 5,
    },
    descriptionText: {
        fontSize: 16,
        color: colors.tituloBranco,
        lineHeight: 24,
    },
    notFoundText: {
        fontSize: 16,
        color: colors.cinzaClaro,
        fontStyle: 'italic',
    },
    backButton: {
        backgroundColor: colors.cinzaClaro,
        padding: 15,
        borderRadius: 10,
        marginTop: 20,
        alignItems: 'center',
    },
    backButtonText: {
        color: colors.tituloBranco,
        fontSize: 18,
        fontWeight: 'bold',
    },
});