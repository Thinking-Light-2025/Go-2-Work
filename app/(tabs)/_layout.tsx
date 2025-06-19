import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import { colors } from '@/src/components/global';
import { Ionicons } from '@expo/vector-icons';
import React, { useState, useEffect } from 'react';
import { Image, Text, StyleSheet, View, ActivityIndicator } from 'react-native';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/src/firebase/config';
// Importe DrawerItemList aqui
import { DrawerItemList } from '@react-navigation/drawer'; 
import { DrawerNavigationHelpers, DrawerDescriptorMap } from '@react-navigation/drawer/lib/typescript/commonjs/src/types';
import { DrawerNavigationState, ParamListBase } from '@react-navigation/native';

// --- Componente de Cabeçalho Customizado do Drawer ---
const CustomDrawerContent = (props: React.JSX.IntrinsicAttributes & { state: DrawerNavigationState<ParamListBase>; navigation: DrawerNavigationHelpers; descriptors: DrawerDescriptorMap; }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUserData = async () => {
    const user = auth.currentUser;
    if (user) {
      try {
        const userDocRef = doc(db, 'Contas', user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const data = userDocSnap.data();
          setUserData(data);
        } else {
          console.warn("Documento do usuário não encontrado no Firestore.");
        }
      } catch (error) {
        console.error("Erro ao buscar dados do usuário:", error);
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
      console.log("Nenhum usuário logado.");
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  // Define a imagem padrão caso não haja foto de perfil ou usuário
  const defaultProfileImage = require('@/src/assets/profile.png'); 

  // Obtém a URL da imagem de perfil e o nome com base no tipo de conta
  let profileImageUrl = userData?.profileImageUrl;
  let userName = "Usuário Anônimo";

  if (userData) {
    if (userData.tipo_conta === 'Pessoa') {
      userName = userData.name_conta || 'Pessoa Usuária';
    } else if (userData.tipo_conta === 'Empresa') {
      userName = userData.nome_empresa || 'Empresa';
    } else if (userData.tipo_conta === 'Freelancer') {
      userName = userData.nomeFree || 'Freelancer';
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.fundo }}> {/* Certifique-se que o background do Drawer é consistente */}
      {loading ? (
        <View style={styles.drawerHeaderContainer}>
          <ActivityIndicator size="large" color={colors.amarelo1} />
        </View>
      ) : (
        <View style={styles.drawerHeaderContainer}>
          <Image
            style={styles.drawerProfileImage}
            source={profileImageUrl ? { uri: profileImageUrl } : defaultProfileImage}
          />
          <Text style={styles.drawerUserName}>{userName}</Text>
        </View>
      )}
      
      {/* --- Renderiza os itens de navegação do Drawer aqui --- */}
      <DrawerItemList {...props} /> 
    </View>
  );
};

export default function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        screenOptions={{
          drawerStyle: {
            backgroundColor: colors.fundo, // O background do Drawer é definido aqui
            width: 270,
          },
          drawerActiveTintColor: colors.amarelo1,
          drawerInactiveTintColor: colors.textoCinza,
        }}
        // --- Chamar o componente de cabeçalho customizado ---
        drawerContent={(props) => <CustomDrawerContent {...props} />}
      >

        <Drawer.Screen 
          name="Home"
          options={{
            title: "Início",
            headerTitleStyle: {
              color: colors.tituloBranco
            },
            headerTintColor: colors.tituloBranco, 
            headerStyle: {
              backgroundColor: colors.fundo2, 
            },
            drawerIcon: ({ color }) => (
              <Ionicons name="home-outline" size={24} color={color} /> 
            ),
          }}
        />

        <Drawer.Screen 
          name="Avisos"
          options={{
            title: "Avisos",
            headerTitleStyle: {
              color: colors.tituloBranco
            },
            headerTintColor: colors.tituloBranco, 
            headerStyle: {
              backgroundColor: colors.fundo2, 
            },
            drawerIcon: ({ color }) => (
              <Ionicons name="notifications-outline" size={24} color={color} /> 
            ),
          }}
        />

        <Drawer.Screen 
          name="Geral"
          options={{
            title: "Oportunidades",
            headerTitleStyle: {
              color: colors.tituloBranco
            },
            headerTintColor: colors.tituloBranco, 
            headerStyle: {
              backgroundColor: colors.fundo2, 
            },
            drawerIcon: ({ color }) => (
              <Ionicons name="briefcase-outline" size={24} color={color} /> 
            ),
          }}
        />

        <Drawer.Screen 
          name="CreateJob"
          options={{
            title: "Criar vagas ou serviços",
            headerTitleStyle: {
              color: colors.tituloBranco
            },
            headerTintColor: colors.tituloBranco, 
            headerStyle: {
              backgroundColor: colors.fundo2, 
            },
            drawerIcon: ({ color }) => (
              <Ionicons name="add-circle-outline" size={24} color={color} /> 
            ),
          }}  
        />

        <Drawer.Screen 
          name="CreateFreelancerJob"
          options={{
            title: "Criar serviços freelancer",
            headerTitleStyle: {
              color: colors.tituloBranco
            },
            headerTintColor: colors.tituloBranco, 
            headerStyle: {
              backgroundColor: colors.fundo2, 
            },
            drawerIcon: ({ color }) => (
              <Ionicons name="add-circle-outline" size={24} color={color} /> 
            ),
          }}  
        />

        <Drawer.Screen 
          name="Config"
          options={{
            title: "Configurações",
            headerTitleStyle: {
              color: colors.tituloBranco
            },
            headerTintColor: colors.tituloBranco, 
            headerStyle: {
              backgroundColor: colors.fundo2, 
            },
            drawerIcon: ({ color }) => (
              <Ionicons name="settings-outline" size={24} color={color} />                     
            ),
          }}
        />
        <Drawer.Screen 
          name="(stack)/detalhesCandidatura"
          options={{
            title: "detalhes",
            headerTitleStyle: {
              color: colors.tituloBranco
            },
            headerTintColor: colors.tituloBranco, 
            headerStyle: {
              backgroundColor: colors.fundo2, 
            },
            drawerItemStyle: { display: 'none' },
            drawerIcon: ({ color }) => (
              <Ionicons name="settings-outline" size={24} color={color} />                     
            ),
          }}
        />

        <Drawer.Screen 
          name="(stack)/minhaCandidaturaDetalhes"
          options={{
            title: "minha",
            headerTitleStyle: {
              color: colors.tituloBranco
            },
            headerTintColor: colors.tituloBranco, 
            headerStyle: {
              backgroundColor: colors.fundo2, 
            },
            drawerItemStyle: { display: 'none' },
            drawerIcon: ({ color }) => (
              <Ionicons name="settings-outline" size={24} color={color} />                     
            ),
          }}
        />
        <Drawer.Screen 
          name="(stack)"
          options={{
            title: "Candidaturas",
            headerTitleStyle: {
              color: colors.tituloBranco
            },
            headerTintColor: colors.tituloBranco, 
            headerStyle: {
              backgroundColor: colors.fundo2, 
            },
            drawerItemStyle: { display: 'none' },
            drawerIcon: ({ color }) => (
              <Ionicons name="settings-outline" size={24} color={color} />                     
            ),
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  // Estilo para a imagem de perfil no Drawer
  drawerProfileImage: {
    width: 80,
    height: 80,
    borderRadius: 40, 
    borderWidth: 2,
    borderColor: colors.amarelo2,
    marginBottom: 10,
  },
  // Estilo para o container do cabeçalho do Drawer
  drawerHeaderContainer: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: colors.fundo2, 
    paddingTop: 50, 
  },
  // Estilo para o nome do usuário no Drawer
  drawerUserName: {
    color: colors.tituloBranco,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  // Certifique-se de que os estilos de layout do DrawerItemList não estejam sobrescrevendo.
  // Removi o estilo 'fotoPerfil' duplicado, pois 'drawerProfileImage' é o que estamos usando.
});