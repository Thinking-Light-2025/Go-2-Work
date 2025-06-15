// formFreelancer.tsx
import { colors } from '@/src/components/global';
import { Botão, TxtInput } from '@/src/components/objects';
import { auth, db } from '@/src/firebase/config';
import { height, width } from '@/src/firebase/functions/interface';
import { Link, useRouter } from 'expo-router';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, ActivityIndicator, Image, TouchableOpacity, ScrollView, Button } from 'react-native'; // Adicionado Image, TouchableOpacity, ScrollView, Button
import * as ImagePicker from 'expo-image-picker'; // Importa ImagePicker

export const FormFreelancer = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState('');
  const [setor, setSetor] = useState('');
  const [regiao, setRegiao] = useState('');
  const [links, setLinks] = useState('');
  const [descricao, setDescricao] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmarPassword, setConfirmarPassword] = useState('');
  const [profileImage, setProfileImage] = useState<string | null>(null); // Novo estado para a URI local da imagem
  const tipo_conta = 'Freelancer';

  // Define uma imagem de perfil padrão local
  const defaultProfileImage = require('@/src/images/profile.png'); // Certifique-se do caminho correto!

  /**
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

  const onRegisterPress = async () => {
    if (!name || !email || !password || !descricao || !links || !setor) {
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
        uid: uid, // Use o uid obtido da criação do usuário
        email: email,
        nomeFree: name,
        senha: password, // Lembrete: não é recomendado salvar a senha diretamente.
        descricao,
        setor,
        regiao,
        links,
        tipo_conta,
        profileImageUrl: profileImage, // Salva diretamente a URI local
        createdAt: new Date(),
      };
      await setDoc(doc(db, 'Contas', uid), data);
      console.log("Novo usuario: ", uid);
      Alert.alert("Sucesso", "Conta criada com sucesso!");
      router.replace('/(tabs)/Home/Home');
    } catch (error: any) { // Adicionado : any para tipagem do erro
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
    <ScrollView contentContainerStyle={styles.scrollContainer}> {/* Adicionado ScrollView e estilo para o container */}
      <View style={styles.container}>
        <View style={styles.containerMed}>

          {/* Seção da Foto de Perfil */}
          <View style={styles.containerFotoPerfil}>
            <Text style={styles.containerMed_AreaInput_text}>Selecione sua foto de perfil:</Text>
            <TouchableOpacity onPress={pickImage}>
              <Image
                style={styles.fotoPerfil}
                source={profileImage ? { uri: profileImage } : defaultProfileImage}
              />
            </TouchableOpacity>
            {profileImage && (
              <Button title="Remover Foto" onPress={() => setProfileImage(null)} color={colors.amarelo2} />
            )}
          </View>

          <View style={styles.containerMed_AreaInput}>
            <Text style={styles.containerMed_AreaInput_text}>Seu nome:</Text>
            <TxtInput
              value={name}
              onChangeText={setName}
              placeholder="Seu nome completo"
              placeholderTextColor={colors.amarelo2}
            />
          </View>

          <View style={styles.containerMed_AreaInput}>
            <Text style={styles.containerMed_AreaInput_text}>Email para contato:</Text>
            <TxtInput
              value={email}
              onChangeText={setEmail}
              placeholder="seu.email@example.com"
              placeholderTextColor={colors.amarelo2}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.containerMed_AreaInput}>
            <Text style={styles.containerMed_AreaInput_text}>Descrição do serviço:</Text>
            <TxtInput
              value={descricao}
              onChangeText={setDescricao}
              placeholder="Fale um pouco sobre suas você e suas habilidades"
              placeholderTextColor={colors.amarelo2}
              multiline
              numberOfLines={4}
              style={{ height: 120, fontSize: 17 }}
            />
          </View>

          <View style={styles.containerMed_AreaInput}>
            <Text style={styles.containerMed_AreaInput_text}>Setor:</Text>
            <TxtInput
              value={setor}
              onChangeText={setSetor}
              placeholder="Setor no qual setor você atua"
              placeholderTextColor={colors.amarelo2}
            />
          </View>

          <View style={styles.containerMed_AreaInput}>
            <Text style={styles.containerMed_AreaInput_text}>Região:</Text>
            <TxtInput
              value={regiao}
              onChangeText={setRegiao}
              placeholder="Região na qual você trabalha"
              placeholderTextColor={colors.amarelo2}
            />
          </View>

          <View style={styles.containerMed_AreaInput}>
            <Text style={styles.containerMed_AreaInput_text}>Links de contato:</Text>
            <TxtInput
              value={links}
              onChangeText={setLinks}
              placeholder="Ex: seuportifolio.com, linkedin.com/in/seuuser"
              placeholderTextColor={colors.amarelo2}
            />
          </View>

          <View style={styles.containerMed_AreaInput}>
            <Text style={styles.containerMed_AreaInput_text}>Senha:</Text>
            <TxtInput
              value={password}
              onChangeText={setPassword}
              placeholder="Mínimo de 8 caracteres"
              secureTextEntry
              placeholderTextColor={colors.amarelo2}
            />
          </View>

          <View style={styles.containerMed_AreaInput}>
            <Text style={styles.containerMed_AreaInput_text}>Confirmar senha:</Text>
            <TxtInput
              value={confirmarPassword}
              onChangeText={setConfirmarPassword}
              placeholder="Mínimo de 8 caracteres"
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

const styles = StyleSheet.create({
  scrollContainer: { // Novo estilo para o ScrollView
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20, // Adicione padding vertical para evitar que o conteúdo encoste nas bordas
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
    minHeight: 800, // Ajuste se necessário para acomodar mais campos
    padding: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  containerMed_AreaInput: {
    width: width * 0.9,
    maxHeight: 170, // Pode precisar de ajuste se o input for multiline e muito alto
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
    borderRadius: 75, // Metade da largura/altura para ficar circular
    borderWidth: 2,
    borderColor: colors.amarelo2,
    marginTop: 10,
    marginBottom: 10,
    alignSelf: 'center', // Centraliza a imagem
  },
  containerFotoPerfil: {
    backgroundColor: colors.fundo,
    alignItems: 'center',
    marginTop: 10,
    padding: 15,
    width: width * 0.8,
    borderRadius: 8,
    marginBottom: 20, // Adicionado espaço abaixo da seção da foto
  },
});