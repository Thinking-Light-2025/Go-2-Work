// src/firebase/functions/get/getJobs.tsx

import { collection, getDocs, limit, query, where } from "firebase/firestore";
import { db } from "./../../config";

interface Vagas {
  criadorId: string;
}

export const getVagas = async (DadosJobs: any) => {
    const {setJobs, setFilteredJobs, setLoading} =  DadosJobs;

    try {
        const q = query(
        collection(db, "Vagas-trabalhos"),
        limit(3) // Limita a 3 resultados
        );
        const querySnapshot = await getDocs(q);
        const jobsArray = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        }));
        setJobs(jobsArray);
        setFilteredJobs(jobsArray); // Inicializa com todos os dados
    } catch (error) {
        console.error("Erro ao buscar as vagas:", error);
    } finally {
        setLoading(false);
    }
};

export const fetchJobs_Geral = async (valueData: any, dataBox: any, dataBox2: any) => {
    const { setJobs, setFilteredJobs, setLoading } = valueData;
    const { coleção, campo, valor } = dataBox;

    // Coloca o loading como true antes de buscar os dados
    setLoading(true);
    try {
        let q; 
        // Verifica se 'campo' e 'valor' estão vazios
        if (!campo || !valor) {
            // Se os campos estão vazios, faz a query para buscar todas as vagas na coleção "Vagas-trabalho"
            q = query(collection(db, "Vagas-trabalhos"));
        } else {
            // Caso contrário, faz a query com filtro na coleção especificada
            q = query(
                collection(db, coleção),
                where(campo, "==", valor)
            );
        }
        // Busca os documentos da query
        const querySnapshot = await getDocs(q);
        // Mapeia os documentos retornados para um array
        const jobsArray = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));
        // Atualiza o estado com os resultados
        setJobs(jobsArray);
        setFilteredJobs(jobsArray);  // Inicializa com os dados filtrados ou completos
    } catch (error) {
        // Caso haja algum erro
        console.error("Erro ao buscar as vagas:", error);
    } finally {
        // Certifica-se de que o loading seja setado como false após a operação
        setLoading(false);
    }
};

export async function getFreelancerVagas (DadosFreelancer: any)  {
    const {setFreelancer, setFilteredFreelancer, setLoading} =  DadosFreelancer;
    
    try {
        const q = query(
        collection(db, "Servicos-freelancer"),
        limit(4) // Limita a 2 resultados
        );
        const querySnapshot = await getDocs(q);
        const jobsArray = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        }));
        setFreelancer(jobsArray);
        setFilteredFreelancer(jobsArray); // Inicializa com todos os dados
    } catch (error) {
        console.error("Erro ao buscar as vagas freelancer:", error);
    } finally {
        setLoading(false);
    }
};