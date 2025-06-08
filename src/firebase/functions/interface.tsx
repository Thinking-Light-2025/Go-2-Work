// interface.tsx

import { Dimensions } from "react-native";
import { auth, db } from "../config";
import { doc, getDoc } from "firebase/firestore";

export interface Users {
    email: string,

    name_conta: string,
    senha: string,
    telefone: string,
    endereco: string,
    desc_sobre: string,
    links_externos: string,
}
export interface Empresas {
    uid: string,

    email: string,
    nome_empresa: string,
    password: string,
    setor: string,
    descricao: string,
    cnpj: number,
    tipo_conta: string,
}
export interface Freelancer {
    uid: string,

    descricao: string,
    email: string,
    links: string,
    nomeFree: string,
    regiao: string,
    senha: string,
    setor: string,
    cnpj: number,
    tipo_conta: string,
}


export interface Vagas {
    name: any;
    uid: string;
    id: string;
    vaga_id: string,
    nome_vaga: string,
    uid_criadorVaga: string,
    nome_empresa: string,
    salario: number,
    email: string,
    modalidade: string,
    localizacao: string,
    descricao: string,
    regime: string,
    setor: string,
    createdAt: Date,
};

export interface servicoFreelancer {
    nome_vaga: any;
    name: any;
    servico_id: string,
    uid_criadorServico: string,
    titulo_servico: string;
    dataPublicacao_servico: Date;
    descricao_servico: string;
    modalidade_servico: string,
    localizacao_servico: string;
    responsavel: string;
    valor_servico: string; // ou number, dependendo de como você armazena
    email: string;
    tempo_execucao: string;
};

export interface CandidaturaVaga {
    id_candidatura: string;
    uid_candidato: string;
    uid_criadorVaga: string;
    nome_vaga: string;
    status: string;
    nome_candidato: string;
    dataCandidatura: Date;
}

export interface CandidaturaError {
    code: string;
    message: string;
    details?: any;
}


export const { width, height } = Dimensions.get('window');


export const verification = () => {
    const user = auth.currentUser ; // Obtém o usuário atual

    if (!user) {
        console.log("Usuário não logado");
        return {
            isAuthenticated: false,
            uid: null,
            email: null,
            name_conta: null,
            tipo_conta: null,
        };
    }

    return {
        isAuthenticated: true,
        uid: user.uid,
        email: user.email,
        name_conta: user.displayName || null, // Use displayName se disponível
    };
};