// src/firebase/functions/handleApplyJob.ts
import { createApplication } from '@/src/firebase/functions/create/createCandidatura';
import { verification } from '@/src/firebase/functions/interface'; // Assumindo que verification está aqui
import { Alert } from 'react-native'; // Usaremos Alert para feedback ao usuário

interface ApplyJobProps {
    jobId: string;
    uidCriadorVaga: string;
    onStart?: () => void;   // Callback opcional para quando a candidatura começa
    onComplete?: () => void; // Callback opcional para quando a candidatura termina (sucesso ou falha)
    onSuccess?: () => void; // Callback opcional para sucesso
    onError?: (error: any) => void; // Callback opcional para erro
}

/**
 * Lida com o processo de candidatura a uma vaga.
 * Verifica autenticação do usuário e tenta criar a candidatura.
 * Fornece feedback ao usuário e gerencia estados de loading.
 *
 * @param {string} jobId - O ID da vaga à qual o usuário está se candidatando.
 * @param {string} uidCriadorVaga - O UID do criador da vaga (empresa).
 * @param {Function} [onStart] - Função de callback chamada antes do processo de candidatura iniciar.
 * @param {Function} [onComplete] - Função de callback chamada após o processo de candidatura (sucesso ou falha) ser concluído.
 * @param {Function} [onSuccess] - Função de callback chamada em caso de sucesso na candidatura.
 * @param {Function} [onError] - Função de callback chamada em caso de erro na candidatura, com o objeto de erro.
 */
export const handleApplyJob = async ({
    jobId,
    uidCriadorVaga,
    onStart,
    onComplete,
    onSuccess,
    onError,
}: ApplyJobProps) => {
    // 1. Iniciar o processo (opcional, para definir um estado de loading)
    onStart?.();

    const user = verification(); // Verifica se o usuário está autenticado
    if (!user?.uid) {
        Alert.alert('Erro', 'Você precisa estar logado para se candidatar a uma vaga.');
        onComplete?.(); // Finaliza o loading mesmo em caso de erro de autenticação
        onError?.(new Error('Usuário não autenticado'));
        return;
    }

    try {
        await createApplication(jobId, uidCriadorVaga);
        Alert.alert('Sucesso', 'Candidatura realizada com sucesso!');
        onSuccess?.(); // Chama o callback de sucesso
    } catch (error: any) {
        if (error.message.includes('Já existe uma candidatura para esta vaga')) {
            Alert.alert('Atenção', 'Você já se candidatou para esta vaga.');
        } else {
            Alert.alert('Erro', 'Ocorreu um erro ao realizar a candidatura. Tente novamente mais tarde.');
            console.error('Erro ao candidatar:', error);
        }
        onError?.(error); // Chama o callback de erro
    } finally {
        // 3. Finalizar o processo (opcional, para desativar o estado de loading)
        onComplete?.();
    }
};