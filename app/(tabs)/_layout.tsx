import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import { colors } from '@/src/components/global';
import { Ionicons } from '@expo/vector-icons';

export default function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        screenOptions={{
          drawerStyle: {
            backgroundColor: colors.fundo,
            width: 270,
          },
          drawerActiveTintColor: colors.amarelo1,
          drawerInactiveTintColor: colors.textoCinza,
        }}
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
            title: "stack",
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