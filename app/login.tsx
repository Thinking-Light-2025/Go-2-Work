import React, { useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { TxtInput, Botão, StatusBarObject, TxtInputLogin } from '../src/components/objects';
import { colors } from '@/src/components/global';
import { width } from '@/src/firebase/functions/interface';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/src/firebase/config';
import { AntDesign } from '@expo/vector-icons';

export default function Login() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function login() {
    try {
      setIsLoading(true);
      const result = await signInWithEmailAndPassword(auth, email, password);
      console.log("Login realizado com sucesso:", result.user.uid);
      Alert.alert("Login bem-sucedido!", "Seja bem-vindo de volta!");
      router.replace('/(tabs)/Home/Home');
    } catch (error: any) {
      console.error("Erro ao fazer login:", error.message);
      Alert.alert("Erro no login", error.message);
    } finally {
      setIsLoading(false);
    }
  }

  function Back() {
    router.replace('/')
  }

  return (
    <View style={styles.container}>
      <StatusBarObject />

      <View style={styles.cardTop}>
        <AntDesign name="caretleft" size={30} color={colors.amarelo2} onPress={ () => Back()} style={{ right: 160, marginBottom: 10 }} />
        <Text style={styles.cardTop_Title}>Go 2 Work</Text>
        <Text style={styles.cardTop_subTitle}>Volte para encontrar novas oportunidades.</Text>
      </View>

      <View style={styles.cardBottom}>
        <Text style={styles.cardBottom_text}>Digite seu email:</Text>
        <TxtInput 
          placeholder="Email"
          value={email}
          placeholderTextColor={colors.tituloBranco}
          onChangeText={setEmail}
        />

        <Text style={styles.cardBottom_text}>Digite sua senha:</Text>
        <TxtInputLogin
          placeholder="Senha"
          placeholderTextColor={colors.tituloBranco}
          isPassword={true}
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity /* onPress={handleRecoveryPress} */>
          <Text style={styles.cardBottom_recovery}>Deseja recuperar sua senha?</Text>
        </TouchableOpacity>

        {isLoading ? (
          <ActivityIndicator size="large" color={colors.amarelo1} />
        ) : (
          <Botão activeOpacity={0.8} onPress={login}>
            <Text style={{ fontSize: 18, color: colors.tituloBranco }}>Entrar</Text>
          </Botão>
        )}

        <Text style={styles.textBottom}>
          Não tem conta?{' '}
          <Link href="/createAccount" style={styles.links}>
            Crie aqui agora!
          </Link>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.preto,
  },
  cardTop: {
    height: '24%',
    width: width,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  cardTop_Title: {
    fontSize: 50,
    color: colors.amarelo2,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  cardTop_subTitle: {
    fontSize: 17,
    color: colors.tituloBranco,
    marginBottom: 20,
    textAlign: 'center'
  },
  cardBottom: {
    minHeight: '65%',
    width: "90%",
    backgroundColor: colors.fundo2,
    alignItems: "center",
    padding: 10,
    borderRadius: 20,
    marginTop: 20,
  },
  cardBottom_text: {
    fontSize: 18,
    marginBottom: 10,
    marginTop: 20,
    color: colors.tituloBranco,
  },
  cardBottom_recovery: {
    fontSize: 18,
    marginBottom: 35,
    marginTop: 35,
    color: colors.tituloBranco,
  },
  textBottom: {
    fontSize: 18,
    marginTop: 40,
    color: colors.tituloBranco,
    textAlign: 'center',
  },
  links: {
    color: colors.amarelo1,
    fontWeight: '600',
  },
});