import { Alert } from "react-native";
import { auth, db } from "../../config"; // Certifique-se de que auth e db estão corretamente configurados
import { sendPasswordResetEmail, signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

// export async function onLoginPress(ValuesLogin) {
//     const { email, password, setIsLoading, router } = ValuesLogin;

//     // Verifica se os campos estão preenchidos
//     if (email.trim() === '' || password.trim() === '') {
//         Alert.alert("Erro", "Por favor, preencha todos os campos.");
//         return;
//     }

//     setIsLoading(true);
//     try {
//         const userCredential = await signInWithEmailAndPassword(auth, email, password);
//         const uid = userCredential.user.uid;  
//         const userDoc = await getDoc(doc(db,  "Contas", uid));

//         // Verifica se o documento existe
//         if (!userDoc.exists()) {
//             Alert.alert("Erro", "Usuário não encontrado.");
//             return;
//         }

//         const userData = userDoc.data();
//         await AsyncStorage.setItem('user', JSON.stringify(userData));

//         router.push({
//             pathname: '/(tabs)/Home/Home',
//             params: { user: JSON.stringify(userData) },
//         });
//         Alert.alert("Sucesso", "Login realizado com sucesso!");
//         console.log("Login OK");
//     } catch (error) {
//         console.error("Erro no login:", error);
//         Alert.alert("Erro", "Verifique suas credenciais e tente novamente.");
//     } finally {
//         setIsLoading(false);
//     }
// };

// export async function handleRecovery({ email }) {
//     // Não é necessário criar uma nova instância do auth
//     sendPasswordResetEmail(auth, email)
//         .then(() => {
//             Alert.alert('Enviado com sucesso!', 'Verifique seu e-mail para redefinir a senha.');
//         })
//         .catch((error) => {
//             console.error('Erro ao enviar o e-mail de redefinição de senha:', error);
//             Alert.alert('Erro', 'Ocorreu um erro ao enviar o e-mail de recuperação.');
//         });
// };