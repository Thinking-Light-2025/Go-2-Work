// formEmpresa.tsx
import { colors } from '@/src/components/global';
import { Botão, TxtInput } from '@/src/components/objects';
import { auth, db } from '@/src/firebase/config'; // Não precisamos mais do 'storage' aqui
import { height, width } from '@/src/firebase/functions/interface';
import { Link, useRouter } from 'expo-router';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, ActivityIndicator, Image, TouchableOpacity, ScrollView, Button } from 'react-native';
import * as ImagePicker from 'expo-image-picker'; // Importa ImagePicker
// Não precisamos mais de 'ref', 'uploadBytes', 'getDownloadURL' de 'firebase/storage'

export const FormEmpresa = () => {
  const router = useRouter();
  const [name, setName] = useState('');
  const [cnpj , setCnpj] = useState('');
  const [setor, setSetor] = useState('');
  const [regiao, setRegiao] = useState('');
  const [descricao, setDescricao] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmarPassword, setConfirmarPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null); // Estado para a URI local da imagem
  const tipo_conta = 'Empresa';

  // Define uma imagem de perfil padrão local
  const defaultProfileImage = require('@/src/images/profile.png'); // Certifique-se do caminho correto!

  /** DÁ PARA COMPONENTIZAR
   * @function pickImage
   * @description Função para permitir que o usuário selecione uma imagem da galeria.
   */
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão necessária', 'Desculpe, precisamos da permissão da galeria para isso funcionar!');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri); // Salva a URI local no estado
    }
  };

  // A função uploadImageToFirebase não será mais necessária

  const onRegisterPress = async () => {
    if (!name || !email || !password || !descricao || !cnpj || !setor) {
      Alert.alert("Erro", "Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    if (password !== confirmarPassword) {
      Alert.alert('Erro', 'As senhas não coincidem.');
      return;
    }

    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

      const data = {
        uid: uid,
        email: email,
        nome_empresa: name,
        senha: password, // Lembrete: não é recomendado salvar a senha diretamente.
        descricao,
        cnpj,
        setor,
        regiao,
        tipo_conta,
        profileImageUrl: profileImage, // Salva diretamente a URI local
        createdAt: new Date(),
      };
      await setDoc(doc(db, 'Contas', uid), data);
      console.log("Nova empresa cadastrada com UID: ", uid);
      Alert.alert("Sucesso", "Conta de empresa criada com sucesso!");
      router.replace('/(tabs)/Home/Home');
    } catch (error: any) {
      console.error("Erro ao criar a conta:", error);
      let errorMessage = "Falha ao criar a conta. Verifique as informações.";
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'Este email já está em uso. Tente outro.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'O formato do email é inválido.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'A senha é muito fraca. Ela deve ter pelo menos 6 caracteres.';
      }
      Alert.alert("Erro", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <View style={styles.containerMed}>

          {/* Seção da Foto de Perfil / Logo */}
          <View style={styles.containerFotoPerfil}>
            <Text style={styles.containerMed_AreaInput_text}>Selecione a logo da empresa:</Text>
            <TouchableOpacity onPress={pickImage}>
              <Image
                style={styles.fotoPerfil}
                source={profileImage ? { uri: profileImage } : defaultProfileImage}
              />
            </TouchableOpacity>
            {profileImage && (
              <Button title="Remover Logo" onPress={() => setProfileImage(null)} color={colors.amarelo2} />
            )}
          </View>

          <View style={styles.containerMed_AreaInput}>
            <Text style={styles.containerMed_AreaInput_text}>Nome da empresa:</Text>
            <TxtInput
              value={name}
              onChangeText={setName}
              placeholder="Nome da Empresa"
              placeholderTextColor={colors.amarelo2}
            />
          </View>

          <View style={styles.containerMed_AreaInput}>
            <Text style={styles.containerMed_AreaInput_text}>Email:</Text>
            <TxtInput
              value={email}
              onChangeText={setEmail}
              placeholder="Email empresarial para contato"
              placeholderTextColor={colors.amarelo2}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.containerMed_AreaInput}>
            <Text style={styles.containerMed_AreaInput_text}>Descrição da empresa:</Text>
            <TxtInput
              value={descricao}
              onChangeText={setDescricao}
              placeholder="Escreva uma breve descrição sobre a empresa"
              placeholderTextColor={colors.amarelo2}
              multiline
              numberOfLines={4}
              style={{ height: 120, fontSize: 17}}
            />
          </View>

          <View style={styles.containerMed_AreaInput}>
            <Text style={styles.containerMed_AreaInput_text}>CNPJ:</Text>
            <TxtInput
              value={cnpj}
              onChangeText={setCnpj}
              placeholder="CNPJ da empresa"
              placeholderTextColor={colors.amarelo2}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.containerMed_AreaInput}>
            <Text style={styles.containerMed_AreaInput_text}>Setor:</Text>
            <TxtInput
              value={setor}
              onChangeText={setSetor}
              placeholder="Em qual setor sua empresa atua"
              placeholderTextColor={colors.amarelo2}
            />
          </View>

          <View style={styles.containerMed_AreaInput}>
            <Text style={styles.containerMed_AreaInput_text}>Região (opcional):</Text>
            <TxtInput
              value={regiao}
              onChangeText={setRegiao}
              placeholder="Em qual região sua empresa atua"
              placeholderTextColor={colors.amarelo2}
            />
          </View>

          <View style={styles.containerMed_AreaInput}>
            <Text style={styles.containerMed_AreaInput_text}>Senha:</Text>
            <TxtInput
              value={password}
              onChangeText={setPassword}
              placeholder="Senha para criar conta"
              secureTextEntry
              placeholderTextColor={colors.amarelo2}
            />
          </View>

          <View style={styles.containerMed_AreaInput}>
            <Text style={styles.containerMed_AreaInput_text}>Confirmar senha:</Text>
            <TxtInput
              value={confirmarPassword}
              onChangeText={setConfirmarPassword}
              placeholder="Confirmas senha da conta"
              secureTextEntry
              placeholderTextColor={colors.amarelo2}
            />
          </View>

          {isLoading ? (
            <ActivityIndicator size="large" color={colors.amarelo1} />
          ) : (
            <View style={styles.buttonArea}>
              <Botão onPress={onRegisterPress}>
                <Text style={styles.textButton}>Cadastrar</Text>
              </Botão>
            </View>
          )}

          <Text style={styles.lowText}>
            Deseja fazer login?
            <Link href='/login' style={{color: colors.amarelo1}}> Clique aqui</Link>
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

export const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  container: {
    flex: 1,
    minHeight: 500,
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: colors.fundo2,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  containerMed: {
    width: width * 0.9,
    minHeight: 800,
    padding: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  containerMed_AreaInput: {
    width: width * 0.9,
    maxHeight: 170,
    margin: 10,
    marginLeft: 50,
    justifyContent: 'center',
  },
  containerMed_AreaInput_text: {
    fontSize: 17,
    color: colors.tituloBranco,
    marginBottom: 8,
    marginLeft: 20,
  },
  textButton: {
    color: colors.preto,
    fontSize: 20,
    fontWeight: '400',
  },
  buttonArea: {
    width: width * 0.9,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 0,
  },
  lowText: {
    fontSize: 17,
    color: colors.tituloBranco,
    marginBottom: 20,
  },
  fotoPerfil: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 2,
    borderColor: colors.amarelo2,
    marginTop: 10,
    marginBottom: 10,
    alignSelf: 'center',
  },
  containerFotoPerfil: {
    backgroundColor: colors.fundo,
    alignItems: 'center',
    marginTop: 10,
    padding: 15,
    width: width * 0.8,
    borderRadius: 8,
    marginBottom: 20,
  },
});