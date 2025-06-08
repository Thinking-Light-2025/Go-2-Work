import React, { useState } from 'react'; // Importe useState
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native'; // Importe ActivityIndicator

import { colors } from '@/src/components/global';
import { handleApplyJob } from '@/src/firebase/functions/get/handleApplyJob'; // Certifique-se de que o caminho está correto

type Item = {
    id: string; // O ID do documento da vaga
    nome_vaga: string;
    nome_empresa: string;
    salario: number;
    descricaoVaga: string;
    modalidade: string;
    email: string;
    localizacao: string;
    setor: string;
    regime: string;
    uid_criadorVaga: string; // O UID do criador da vaga (empresa)
};

type MyModalProps = {
    visible: boolean;
    onClose: () => void;
    item: Item | null;
};

const MyModal: React.FC<MyModalProps> = ({ visible, onClose, item }) => {
    // NOVO: Estado para controlar o loading do botão de candidatar
    const [isApplying, setIsApplying] = useState(false);

    return (
        <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
            <View style={styles.modalBackground}>
                <View style={styles.modalContainer}>
                    {item ? (
                        <>
                            <ScrollView contentContainerStyle={styles.content}>
                                <Text style={styles.modalTitle}>{item.nome_vaga}</Text>
                                <Text style={styles.modalSubtitle}>{item.nome_empresa}</Text>

                                <Text style={styles.modalText}>Salário: R$ {item.salario}</Text>
                                <Text style={styles.modalText}>Email de contato: {item.email}</Text>
                                <Text style={styles.modalText}>Modalidade: {item.modalidade}</Text>
                                <Text style={styles.modalText}>Localização: {item.localizacao}</Text>
                                <Text style={styles.modalText}>Setor social: {item.setor}</Text>
                                <Text style={styles.modalText}>Regime da vaga: {item.regime}</Text>
                                <Text style={styles.modalText}>Descrição: {item.descricaoVaga}</Text>
                            </ScrollView>

                            <View style={styles.buttonContainer}>
                                <TouchableOpacity onPress={onClose} style={styles.button}>
                                    <Text style={styles.buttonText}>Fechar</Text>
                                </TouchableOpacity>

                                {/* >>>>>>> MUDANÇA AQUI: Chame handleApplyJob dentro de uma função anônima <<<<<<< */}
                                <TouchableOpacity
                                    style={styles.button}
                                    onPress={() => {
                                        // Garante que item não é nulo antes de tentar candidatar
                                        if (item) {
                                            handleApplyJob({
                                                jobId: item.id, // O ID da vaga atual
                                                uidCriadorVaga: item.uid_criadorVaga, // O UID do criador da vaga
                                                onStart: () => setIsApplying(true), // Ativa o loading
                                                onComplete: () => setIsApplying(false), // Desativa o loading ao finalizar
                                            });
                                        }
                                    }}
                                    disabled={isApplying} // Desabilita o botão enquanto a candidatura está em andamento
                                >
                                    {/* >>>>>>> NOVO: Mostra ActivityIndicator durante o loading <<<<<<< */}
                                    {isApplying ? (
                                        <ActivityIndicator size="small" color={colors.tituloBranco} />
                                    ) : (
                                        <Text style={styles.buttonText}>Candidatar</Text>
                                    )}
                                </TouchableOpacity>
                            </View>
                        </>
                    ) : (
                        <Text style={styles.modalText}>Nenhum item selecionado.</Text>
                    )}
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        width: '90%',
        height: '70%',
        backgroundColor: colors.cinza,
        borderRadius: 16,
        padding: 20,
        justifyContent: 'center',
    },
    content: {
        alignItems: 'center',
        paddingBottom: 20,
    },
    modalTitle: {
        fontSize: 36,
        fontWeight: 'bold',
        color: colors.tituloAmarelo,
        marginBottom: 4,
        textAlign: 'center',
    },
    modalSubtitle: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.tituloAmarelo,
        marginBottom: 16,
        textAlign: 'center',
    },
    modalText: {
        fontSize: 16,
        color: colors.tituloBranco,
        textAlign: 'center',
        marginBottom: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
        gap: 12,
    },
    button: {
        flex: 1,
        backgroundColor: colors.tituloAmarelo,
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: 'center',
        marginHorizontal: 5,
    },
    buttonText: {
        fontSize: 15,
        fontWeight: '600',
        color: colors.tituloBranco,
    },
});

export default MyModal;