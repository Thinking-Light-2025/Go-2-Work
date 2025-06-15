import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { Botão } from '@/src/components/objects';
import { colors } from '@/src/components/global';
import { addDoc, collection, doc, getDoc, getFirestore, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../config';
import { verification } from '../functions/interface';
import { router } from 'expo-router';

export default function FormServicosFree() {
  const [loading, setLoading] = useState(false);

  const [titulo_servico, setTitulo_servico] = useState("");
  const [categoria_servico, setCategoria_servico] = useState("");
  const [email, setEmail] = useState("");
  const [descricao_servico, setDescricao_servico] = useState("");
  const [valor_servico, setValor_servico] = useState("");
  const [tempo_execucao, setTempo_execucao] = useState("");
  const [modalidade_servico, setModalidade_servico] = useState("");
  const [localizacao_servico, setLocalizacao_servico] = useState("");

  const buscarDadosDaConta = async () => {
    const db = getFirestore();
    const uid = auth.currentUser?.uid;
  
    if (!uid) {
      console.error("Usuário não autenticado.");
      return null;
    }
  
    try {
      const docRef = doc(db, "Contas", uid); // nome da sua coleção aqui
      const docSnap = await getDoc(docRef);
  
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      } else {
        console.warn("Documento do usuário não encontrado.");
        return null;
      }
    } catch (erro) {
      console.error("Erro ao buscar dados do usuário:", erro);
      return null;
    }
  };

  async function createServicoFree() {
    if (!titulo_servico || !descricao_servico || !categoria_servico) {
      Alert.alert("Preencha os campos obrigatórios.");
      return;
    }
  
    const tipoConta = verification()?.tipo_conta;
    const dados = await buscarDadosDaConta();
    let tipo = dados.tipo_conta
  
    // Verifica se é empresa
    if (tipo !== "Freelancer") {
      Alert.alert("Apenas contas do tipo Freelancer podem criar um serviço.");
      console.log("Apenas contas do tipo Freelancer podem criar um serviço.", tipo);
      return;
    }
  
    setLoading(true);
    try {
      await addDoc(collection(db, "Servicos-freelancer"), {
        titulo_servico,
        responsavel_servico: verification()?.name_conta,
        email,
        categoria_servico,
        descricao_servico,
        valor_servico,
        tempo_execucao,
        modalidade_servico,
        localizacao_servico,
        dataPublicacao_servico: serverTimestamp(),
        uid_criadorServico: auth.currentUser?.uid,
      });
  
      Alert.alert("Serviço criado com sucesso!");
      setTitulo_servico("");
      setCategoria_servico("");
      setDescricao_servico("");
      setValor_servico("");
      setTempo_execucao("");
      setModalidade_servico("");
      setLocalizacao_servico("");
      router.replace("/(tabs)/Home/Home");
    } catch (error) {
      console.error("Erro ao criar serviço:", error);
      Alert.alert("Erro ao criar serviço.");
    } finally {
      setLoading(false);
    }
  }
  

  return (
    <ScrollView style={styles.form} contentContainerStyle={{ paddingBottom: 40 }}>
      <Input label="Título do serviço" value={titulo_servico} onChangeText={setTitulo_servico} />
      <Input label="Email de contato" value={email} onChangeText={setEmail} />
      <Input label="Categoria (ex: design, elétrica)" value={categoria_servico} onChangeText={setCategoria_servico} />
      <Input label="Descrição do serviço" value={descricao_servico} onChangeText={setDescricao_servico} multiline />
      <Input label="Valor estimado (opcional)" value={valor_servico} onChangeText={setValor_servico} />
      {/* <Input label="Valor estimado (opcional)" value={valor_servico} onChangeText={setValor_servico} />  // COMPETENÇIAS ARRUMAR */}
      <Input label="Tempo de execução (opcional)" value={tempo_execucao} onChangeText={setTempo_execucao} />
      <Input label="Modalidade (ex: presencial/remoto)" value={modalidade_servico} onChangeText={setModalidade_servico} />
      <Input label="Localização" value={localizacao_servico} onChangeText={setLocalizacao_servico} />

      <View style={styles.buttonArea}>
        {loading ? (
          <ActivityIndicator size="large" color={colors.amarelo1} />
        ) : (
          <Botão onPress={createServicoFree}>
            <Text style={styles.textButton}>Criar Serviço</Text>
          </Botão>
        )}
      </View>
    </ScrollView>
  );
}

function Input({ label, value, onChangeText, multiline = false }) {
  return (
    <View style={styles.inputArea}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, multiline && { height: 100, textAlignVertical: 'top' }]}
        placeholder=""
        placeholderTextColor={colors.placeholder}
        value={value}
        onChangeText={onChangeText}
        multiline={multiline}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    paddingHorizontal: 20,
    backgroundColor: colors.fundo,
    flex: 1,
  },
  inputArea: {
    marginBottom: 15,
  },
  label: {
    color: colors.tituloBranco,
    marginBottom: 5,
    fontSize: 16,
    fontWeight: '500',
  },
  input: {
    backgroundColor: colors.fundo2,
    color: colors.tituloBranco,
    padding: 12,
    borderRadius: 12,
    fontSize: 16,
  },
  buttonArea: {
    marginTop: 30,
    alignItems: 'center',
  },
  textButton: {
    fontSize: 18,
    color: colors.texto,
  },
});
