// src/firebase/functions/get/getCompanyApplications.ts

import { db } from '../../config.js'; // Ajuste o caminho conforme a sua estrutura
import { collection, query, where, onSnapshot, orderBy, QuerySnapshot, DocumentData } from 'firebase/firestore';

// Interface para o documento de candidatura como ele vem do Firestore
interface ApplicationDocument {
  id: string; // O ID do documento da candidatura no Firestore
  userId: string;
  jobId: string;
  companyId: string;
  status: 'pendente' | 'aceita' | 'rejeitada';
  appliedAt: any; // Firestore Timestamp
  respondedAt?: any; // Firestore Timestamp
  responseMessage?: string;
}

/**
 * Assina (escuta em tempo real) as candidaturas recebidas para uma empresa específica.
 *
 * @param companyId - O UID da empresa cujas candidaturas queremos buscar.
 * @param onApplicationsUpdate - Callback chamado sempre que a lista de candidaturas é atualizada.
 * Recebe um array de ApplicationDocument.
 * @param onError - Callback chamado em caso de erro.
 * @returns Uma função para cancelar a assinatura (listener).
 */
export const subscribeCompanyApplications = (
  companyId: string,
  onApplicationsUpdate: (applications: ApplicationDocument[]) => void,
  onError: (error: Error) => void
): () => void => {

  // Cria a query: buscar na coleção 'applications' onde 'companyId' seja igual ao companyId fornecido
  const q = query(
    collection(db, 'applications'),
    where('companyId', '==', companyId),
    orderBy('appliedAt', 'desc') // Opcional: ordenar pelas mais recentes
  );

  // Configura o listener em tempo real
  const unsubscribe = onSnapshot(q, (snapshot: QuerySnapshot<DocumentData>) => {
    const applications: ApplicationDocument[] = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        userId: data.userId,
        jobId: data.jobId,
        companyId: data.companyId,
        status: data.status,
        appliedAt: data.appliedAt,
        respondedAt: data.respondedAt || undefined, // Garante undefined se não existir
        responseMessage: data.responseMessage || undefined, // Garante undefined se não existir
      };
    });
    // Chama o callback com os dados atualizados
    onApplicationsUpdate(applications);
  }, (error: any) => {
    // Chama o callback de erro
    console.error("Erro ao buscar candidaturas da empresa:", error);
    onError(error);
  });

  // Retorna a função de unsubscribe para que o listener possa ser cancelado
  return unsubscribe;
};

// Nota: Para buscar informações adicionais (nome do candidato, nome da vaga),
// você precisará fazer buscas adicionais na tela ou componente que usa este listener,
// ou modificar este listener para já buscar dados relacionados (mais complexo).
// No início, vamos focar em buscar as candidaturas.