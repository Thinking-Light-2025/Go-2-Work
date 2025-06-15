// src/firebase/functions/create/createCandidatura.ts

import { db, auth } from '../../config'; // Ajuste o caminho conforme a sua estrutura
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { User } from 'firebase/auth'; // Importe User para tipagem

// Interface para os dados que serão salvos na coleção 'applications'
interface ApplicationData {
  userId: string;
  jobId: string; // O ID do documento na coleção 'Vagas-trabalhos'
  companyId: string; // O UID da empresa que postou a vaga (item.uid_criadorVaga)
  status: 'pendente' | 'aceita' | 'rejeitada';
  appliedAt: any; // Usaremos serverTimestamp()
}

/**
 * Cria um novo documento de candidatura na coleção 'applications'.
 * @param jobId - O ID do documento da vaga (vindo de Vagas-trabalhos).
 * @param companyId - O UID da empresa criadora da vaga (vindo de item.uid_criadorVaga).
 * @returns Uma Promise que resolve com o ID do novo documento de candidatura.
 * @throws Erro se o usuário não estiver logado ou se a escrita falhar.
 */
export const createApplication = async (jobId: string, companyId: string): Promise<string> => {
  const currentUser: User | null = auth.currentUser;

  if (!currentUser) {
    console.error("Erro: Usuário não logado para criar candidatura.");
    throw new Error("Usuário não autenticado.");
  }

  const applicationRef = collection(db, 'applications'); // Referência para a coleção 'applications'

  const applicationData: ApplicationData = {
    userId: currentUser.uid, // UID do usuário logado
    jobId: jobId,
    companyId: companyId,
    status: 'pendente', // Status inicial da candidatura
    appliedAt: serverTimestamp(), // Timestamp do servidor
  };

  try {
    const docRef = await addDoc(applicationRef, applicationData);
    console.log("Candidatura criada com sucesso com ID: ", docRef.id);
    return docRef.id; // Retorna o ID do documento criado
  } catch (error) {
    console.error("Erro ao criar candidatura: ", error);
    // Você pode querer lançar um erro mais específico dependendo do tipo de erro
    throw new Error("Não foi possível criar a candidatura. Tente novamente.");
  }
};

// Você pode remover a função handleAddVagaCLT se não precisar mais dela com a assinatura antiga.
// Ou, se ela for usada em outro lugar com a estrutura anterior, você pode mantê-la
// e fazer com que ela chame a nova função createApplication.
// Por exemplo:
/*
export const handleAddVagaCLT = async ({ userId, uidCriadorVaga, nome_vaga, nome_candidato, setLoading }: any) => {
  // Nota: setLoading ainda parece fora de lugar aqui.
  // O ideal é que essa função seja apenas um wrapper ou seja removida.
  console.warn("handleAddVagaCLT está obsoleta, use createApplication.");
  try {
     // Aqui você pode adicionar lógica de verificação extra se necessário
     await createApplication(nome_vaga, uidCriadorVaga); // Assumindo que nome_vaga era o jobId na chamada original (precisa verificar)
     // Note que nome_candidato não é usado em createApplication
     if (setLoading) setLoading(false); // Gerencia loading aqui se necessário
     return true;
  } catch (error) {
     console.error("Erro em handleAddVagaCLT:", error);
     if (setLoading) setLoading(false); // Gerencia loading aqui se necessário
     throw error;
  }
};
*/

// Mantenha ou remova handleAddVagaCLT conforme discutido anteriormente

// Você pode remover a função handleAddVagaCLT se não precisar mais dela com a assinatura antiga.
// Ou, se ela for usada em outro lugar com a estrutura anterior, você pode mantê-la
// e fazer com que ela chame a nova função createApplication.
// Por exemplo:
/*
export const handleAddVagaCLT = async ({ userId, uidCriadorVaga, nome_vaga, nome_candidato, setLoading }: any) => {
  // Nota: setLoading ainda parece fora de lugar aqui.
  // O ideal é que essa função seja apenas um wrapper ou seja removida.
  console.warn("handleAddVagaCLT está obsoleta, use createApplication.");
  try {
     // Aqui você pode adicionar lógica de verificação extra se necessário
     await createApplication(nome_vaga, uidCriadorVaga); // Assumindo que nome_vaga era o jobId na chamada original (precisa verificar)
     // Note que nome_candidato não é usado em createApplication
     if (setLoading) setLoading(false); // Gerencia loading aqui se necessário
     return true;
  } catch (error) {
     console.error("Erro em handleAddVagaCLT:", error);
     if (setLoading) setLoading(false); // Gerencia loading aqui se necessário
     throw error;
  }
};
*/

/*import { addDoc, collection } from "firebase/firestore";
import { Alert } from "react-native";
import { router } from "expo-router";
import { db } from "../../config";

export async function handleAddVagaCLT({ userId, uidCriadorVaga, nome_vaga, nome_candidato, setLoading }) {
    try {
        setLoading(true);
        
        // Estruture o objeto com os dados da candidatura
        const newCandidatura = {
            userId: userId, // UID do usuário que está se candidatando
            // vagaId: vagaId, // ID da vaga
            uidCriadorVaga: uidCriadorVaga, // UID do criador da vaga

            nome_vaga: nome_vaga,
            nome_candidato: nome_candidato,
            createdAt: new Date(), // Data da candidatura
        };
        console.log(newCandidatura)
        // Adiciona a nova candidatura à coleção "Candidaturas"
        await addDoc(collection(db, 'candidaturas'), newCandidatura);
        Alert.alert('Concluído!', 'Candidatura enviada com sucesso!');
        router.replace('/(tabs)/Home/Home'); // Redireciona para a página inicial

    } catch (error) {
        Alert.alert('Erro ao adicionar documento', 'Tente novamente mais tarde.');
        console.error('Erro ao adicionar documento:', error);
    } finally {
        setLoading(false);
    }
}
*/