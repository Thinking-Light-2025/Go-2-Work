import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, Dimensions, TouchableOpacity, ActivityIndicator, StatusBar } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { colors } from '../src/components/global';
import { StatusBarObject } from '../src/components/objects';

const { width, height } = Dimensions.get('window');

export default function Index() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  const handleLoginPress = () => router.replace('/login');
  const handleCreateAccountPress = () => router.replace('/createAccount');

  useEffect(() => {
    const loadData = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setLoading(false);
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.amarelo1} />
        <Text style={styles.loadingText}>Carregando...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBarObject />
      
      <View style={styles.bottomContainer}>
        <Text style={styles.Title}>Go 2 Work</Text>
        <Text style={styles.subTitle}>Criado pela Thinking Light</Text>

        <View style={styles.viewButton}>
          <View style={styles.areaButton}>
            <TouchableOpacity style={styles.buttonLogin} onPress={handleLoginPress}>
              <Text style={styles.buttonText}>Entre na sua conta</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.buttonCreate} onPress={handleCreateAccountPress}>
              <Text style={styles.buttonText2}>Crie sua conta</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Link href="/(tabs)/Geral" style={styles.linkText}>
          Entrar em uma conta
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.preto
  },
  Title: {
    fontSize: 50,
    color: colors.amarelo2,
    fontWeight: '700'
  },
  subTitle: {
    fontSize: 18,
    color: colors.tituloBranco,
  },
  bottomContainer: {
    width: width * 0.9,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  areaButton: {
    width: width * 0.9,
    height: 160,
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  viewButton: {
    marginTop: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    height: 200,
  },
  buttonLogin: {
    width: '90%',
    height: 60,
    backgroundColor: colors.amarelo2,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  buttonCreate: {
    width: '90%',
    height: 60,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: colors.amarelo2,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  buttonText: {
    fontSize: 20,
    color: colors.preto,
    fontWeight: '500',
  },
  buttonText2: {
    fontSize: 20,
    color: colors.amarelo2,
    fontWeight: '500',
  },
  linkText: {
    fontSize: 18,
    color: '#fff',
    marginTop: 10
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.preto,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: colors.amarelo1,
  },
});