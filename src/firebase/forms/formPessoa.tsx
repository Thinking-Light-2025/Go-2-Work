// formPessoa.js

// Imports React Native
import { View, Text, Alert, ActivityIndicator, ScrollView, Image, TouchableOpacity, Button } from 'react-native'; // Adicionado TouchableOpacity
import React, { useState } from 'react';

// Imports Expo
import { Link, useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker'; // Importa o ImagePicker

// Componentes internos
import { colors } from '@/src/components/global';
import { Botão, TxtInput } from '@/src/components/objects';
import { styles } from '@/src/firebase/forms/formEmpresa' // Certifique-se de que 'styles' tem o estilo para fotoPerfil

// Imports firebase
import { auth, db } from '@/src/firebase/config';
// import { width } from '@/src/firebase/functions/interface'; // 'width' não está sendo usado, pode ser removido se não for necessário
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

export const FormPessoa = () => {
  const router = useRouter();

  // Estados para os campos do formulário
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [endereco, setEndereco] = useState('');
  const [descricao, setDescricao] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [instagram, setInstagram] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null); // Novo estado para a imagem de perfil

  // Define uma imagem de perfil padrão (se nenhuma for selecionada)
  const defaultProfileImage = 'https://via.placeholder.com/150/0000FF/FFFFFF?text=Adicionar+Foto'; // Exemplo de placeholder

  /**
   * @function pickImage
   * @description Função para permitir que o usuário selecione uma imagem da galeria.
   */
  const pickImage = async () => {
    // Solicita permissão para acessar a galeria
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão necessária', 'Desculpe, precisamos da permissão da galeria para isso funcionar!');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, // Apenas imagens
      allowsEditing: true, // Permite cortar a imagem
      aspect: [1, 1], // Proporção 1:1 (quadrada)
      quality: 1, // Qualidade máxima
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri); // Define a URI da imagem selecionada
    }
  };

  /**
   * @function createUser
   * @description Função assíncrona para criar um novo usuário no Firebase Authentication
   * e salvar seus dados no Firestore.
   */
  async function createUser() {
    // 1. Inicia o estado de carregamento
    setIsLoading(true);

    try {
      // 2. Validação dos campos obrigatórios
      if (!name || !email || !password || !descricao || !endereco) {
        Alert.alert("Preencha todos os campos obrigatórios!");
        return; // Retorna para não prosseguir com a criação do usuário
      }

      // 3. Criação do usuário no Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const userUid = userCredential.user.uid;
      console.log("Usuário cadastrado no Auth com sucesso! UID:", userUid);

      // 4. Preparação dos dados para o Firestore
      const dadosConta = {
        uid: userUid,
        email: email,
        name_conta: name,
        telefone: telefone,
        endereco: endereco,
        desc_sobre: descricao,
        instagram: instagram,
        linkedin: linkedin,
        tipo_conta: 'Pessoa',
        createdAt: new Date(),
        profileImageUrl: profileImage, // Adiciona a URI da imagem ao Firestore
      };

      // 5. Salvando os dados do usuário no Firestore
      const userDocRef = doc(db, 'Contas', userUid);
      await setDoc(userDocRef, dadosConta);
      console.log("Dados da conta salvos no Firestore com sucesso para o UID:", userUid);

      // 6. Sucesso no cadastro
      router.replace('/(tabs)/Home/Home');

    } catch (error) {
      // 7. Tratamento de erros
      console.error("Erro no processo de cadastro:", error);

      let errorMessage = "Ocorreu um erro ao cadastrar. Verifique as informações.";

      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'Este email já está em uso. Tente outro.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'O formato do email é inválido.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'A senha é muito fraca. Ela deve ter pelo menos 8 caracteres.';
      }

      Alert.alert("Erro ao cadastrar!", errorMessage);

    } finally {
      // 8. Finaliza o estado de carregamento, independentemente do sucesso ou falha
      setIsLoading(false);
    }
  }

  // Renderização do componente
  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.containerMed}>

          {/* ... Seus outros campos de formulário (Nome, Email, Senha, Telefone, Endereço, Descrição, Instagram, LinkedIn) ... */}
          {/* Campo Nome */}
          <View style={styles.containerMed_AreaInput}>
            <Text style={styles.containerMed_AreaInput_text}>Digite seu nome:</Text>
            <TxtInput
              value={name}
              onChangeText={setName}
              placeholder="Seu nome completo"
              placeholderTextColor={colors.amarelo2}
            />
          </View>

          {/* Campo Email */}
          <View style={styles.containerMed_AreaInput}>
            <Text style={styles.containerMed_AreaInput_text}>Digite seu email:</Text>
            <TxtInput
              value={email}
              onChangeText={setEmail}
              placeholder="seu.email@example.com"
              placeholderTextColor={colors.amarelo2}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {/* Campo Senha */}
          <View style={styles.containerMed_AreaInput}>
            <Text style={styles.containerMed_AreaInput_text}>Crie sua senha:</Text>
            <TxtInput
              value={password}
              onChangeText={setPassword}
              placeholder="Mínimo de 8 caracteres"
              placeholderTextColor={colors.amarelo2}
              secureTextEntry
            />
          </View>

          {/* Campo Telefone */}
          <View style={styles.containerMed_AreaInput}>
            <Text style={styles.containerMed_AreaInput_text}>Telefone (Opcional):</Text>
            <TxtInput
              value={telefone}
              onChangeText={setTelefone}
              placeholder="(XX) XXXXX-XXXX"
              placeholderTextColor={colors.amarelo2}
              keyboardType="phone-pad"
            />
          </View>

          {/* Campo Endereço */}
          <View style={styles.containerMed_AreaInput}>
            <Text style={styles.containerMed_AreaInput_text}>Digite seu endereço:</Text>
            <TxtInput
              value={endereco}
              onChangeText={setEndereco}
              placeholder="Rua, Número, Bairro, Cidade, Estado"
              placeholderTextColor={colors.amarelo2}
            />
          </View>

          {/* Campo Descrição */}
          <View style={[styles.containerMed_AreaInput]}>
            <Text style={styles.containerMed_AreaInput_text}>Uma breve descrição sobre você:</Text>
            <TxtInput
              value={descricao}
              onChangeText={setDescricao}
              placeholder="Fale um pouco sobre suas habilidades e experiências"
              placeholderTextColor={colors.amarelo2}
              multiline
              numberOfLines={5}
              style={{ height: 150, fontSize: 17}} // Ajuste para multiline
            />
          </View>

          {/* Campo Instagram */}
          <View style={styles.containerMed_AreaInput}>
            <Text style={styles.containerMed_AreaInput_text}>Link do seu Instagram (Opcional):</Text>
            <TxtInput
              value={instagram}
              onChangeText={setInstagram}
              placeholder="ex: instagram.com/seuperfil"
              placeholderTextColor={colors.amarelo2}
              autoCapitalize="none"
            />
          </View>

          {/* Campo Linkedin */}
          <View style={styles.containerMed_AreaInput}>
            <Text style={styles.containerMed_AreaInput_text}>Link do seu LinkedIn (Opcional):</Text>
            <TxtInput
              value={linkedin}
              onChangeText={setLinkedin}
              placeholder="ex: linkedin.com/in/seuperfil"
              placeholderTextColor={colors.amarelo2}
              autoCapitalize="none"
            />
          </View>

          {/* Seção da Foto de Perfil */}
          <View style={styles.containerFotoPerfil}>
            <Text style={styles.containerMed_AreaInput_text}>Selecione uma foto de perfil:</Text>
            <TouchableOpacity onPress={pickImage}>
              <Image
                style={styles.fotoPerfil}
                source={{ uri: profileImage || defaultProfileImage }} // Usa a imagem selecionada ou a padrão
              />
            </TouchableOpacity>
            {profileImage && (
              <Button title="Remover Foto" onPress={() => setProfileImage(null)} color={colors.amarelo2} />
            )}
          </View>


          {/* Botão de Cadastro ou Indicador de Atividade */}
          <View style={styles.buttonArea}>
            {isLoading ? (
              <ActivityIndicator size="large" color={colors.amarelo1} />
            ) : (
              <Botão onPress={createUser}>
                <Text style={styles.textButton}>Cadastrar</Text>
              </Botão>
            )}
          </View>

          {/* Link para Login */}
          <Text style={styles.lowText}>
            Já tem uma conta?{' '}
            <Link href="/login" style={{ color: colors.amarelo1 }}>
              Clique aqui
            </Link>
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};