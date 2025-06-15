import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../../config";
import { verification } from "../interface";

export async function handleDeleteVaga(vagaId) {
    const { filteredVagas } = vagaId
    try {
      const userAuth = verification();
      if (!userAuth.isAuthenticated) {
        console.error("User is not authenticated");
        return;
      }
  
      // Deletar o documento da coleção Vagas-trabalhos
      const vagaRef = doc(db, "Vagas-trabalhos", vagaId);
      await deleteDoc(vagaRef);
      
      // Atualizar a lista de vagas após a exclusão
      filteredVagas();
    } catch (error) {
      console.error("Error deleting job posting:", error);
    }
};