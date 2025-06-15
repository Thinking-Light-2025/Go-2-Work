import { collection, getDocs, limit, query, where } from "firebase/firestore";
import { db } from "../../config";

export async function fetchEmpresas (fetchEmpresasData: any) {
    const {setEmpresas, setFilteredEmpresas, setLoading} =  fetchEmpresasData;
    try {
        const q = query(
        collection(db, "Contas"),
        where("tipo_conta", "==", "Empresa"), // Condição
        limit(11)
        );
        const querySnapshot = await getDocs(q);      
        const UsersArray = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        }));
        setEmpresas(UsersArray);
        setFilteredEmpresas(UsersArray); // Inicializa com todos os dados
    } catch (error) {
        console.error("Erro ao buscar as vagas:", error);
    } finally {
        setLoading(false);
    }
  };