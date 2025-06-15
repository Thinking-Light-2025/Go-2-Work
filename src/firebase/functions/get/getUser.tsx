// src/firebase/utils.ts (ou src/firebase/functions/interface.tsx)

import { auth, db } from "../../config";
import { doc, getDoc } from "firebase/firestore";

export const getUserData = async () => {
    const user = auth.currentUser;
    if (!user) {
        console.log("Usuário não logado ao tentar buscar dados.");
        return null;
    }
    try {
        const docRef = doc(db, 'Contas', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return { uid: user.uid, email: user.email, ...docSnap.data() };
        } else {
            console.warn("Documento do usuário não encontrado.");
            return null;
        }
    } catch (error) {
        console.error("Erro ao buscar dados do usuário:", error);
        return null;
    }
};