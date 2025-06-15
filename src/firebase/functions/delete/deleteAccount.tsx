// DELETAR CONTAS

import { deleteDoc, doc } from "firebase/firestore";
import { deleteUser } from "firebase/auth";
import { auth, db } from "@/src/firebase/config"; // Certifique-se de exportar o `auth` no config
import { verification } from "../interface";
import { Alert } from "react-native";

export async function deleteAcount() {
  Alert.alert(
    "Confirmar Exclusão",
    "Tem certeza que deseja excluir sua conta? Essa ação não poderá ser desfeita.",
    [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: async () => {
          try {
            const user = auth.currentUser;
            const uid = verification()?.uid;

            if (!user || !uid) {
              Alert.alert("Erro", "Usuário não autenticado.");
              return;
            }

            await deleteDoc(doc(db, "Contas", uid)); // Remove do Firestore
            await deleteUser(user); // Remove do Firebase Auth

            Alert.alert("Conta excluída", "Sua conta foi excluída com sucesso.");
          } catch (error: any) {
            console.error("Erro ao deletar conta:", error);
            Alert.alert("Erro", error.message || "Não foi possível excluir a conta.");
          }
        },
      },
    ]
  );
};
