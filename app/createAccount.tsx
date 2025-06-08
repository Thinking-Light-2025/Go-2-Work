import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '@/src/firebase/config';
import { addDoc, collection } from 'firebase/firestore';
import { width } from '@/src/firebase/functions/interface';
import { colors } from '@/src/components/global';
import { StatusBarObject } from '@/src/components/objects';
import { AntDesign } from '@expo/vector-icons';

import { DropdownComponent } from '@/src/components/dropdown';

export default function CreateAccount() {
  const router = useRouter();
  const [tipoConta, setTipoConta] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function createUser() {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const { uid } = userCredential.user;

      await addDoc(collection(db, 'Contas'), {
        uid,
        email,
        tipoConta,
      });

      Alert.alert('Concluído!', 'Conta criada com sucesso!');
      router.replace('/(tabs)/Home/Home');
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Erro ao criar conta:", error.message);
        Alert.alert('Erro', error.message);
      }
    }
  }

  function Back() {
    router.push('/');
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.preto }}>
      <StatusBarObject />
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={Style.cardTop}>
          <AntDesign name="caretleft" size={30} color={colors.amarelo2} onPress={Back} style={{ right: 160, marginBottom: 10 }} />
          <Text style={Style.Title}>Criar Conta</Text>
        </View>

        <DropdownComponent
          tipoConta={tipoConta}
          setTipoConta={setTipoConta}
          setEmail={setEmail}
          setPassword={setPassword}
          onSubmit={createUser}
        />
      </ScrollView>
    </View>
  );
}

const Style = StyleSheet.create({
  cardTop: {
    marginTop: 60,
    justifyContent: 'center',
    alignItems: 'center'
  },
  Title: {
    fontSize: 50,
    fontWeight: "bold",
    color: colors.amarelo2
  },
  cardQuestionForm: {
    minHeight: 120,
    alignItems: "center",
    justifyContent: "space-around",
    marginBottom: 20
  },
  cardQuestionForm_title: {
    fontSize: 18,
    color: colors.tituloBranco,
    marginBottom: 10
  },
  picker: {
    height: 50,
    width: '90%',
    backgroundColor: colors.cinza,
    color: colors.tituloBranco
  },
  formContainer: {
    width: width,
    alignItems: 'center',
  },
  selectText: {
    fontSize: 16,
    color: colors.tituloBranco,
    textAlign: 'center',
    marginTop: 20
  },
});
