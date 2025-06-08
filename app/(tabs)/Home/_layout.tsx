import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Tabs } from 'expo-router';
import React from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '@/src/components/global';

export default function Layout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          width: '95%', height: 70, 
          margin: 10, marginBottom: 20,  paddingHorizontal: 20,
          justifyContent: "center",
          alignItems: 'center',
          borderRadius: 15,
          backgroundColor: colors.fundo2, // cor de fundo da tab
          elevation: 0,           // Android sombra
          borderTopWidth: 0,      // iOS linha superior
        },
        tabBarItemStyle: {
          justifyContent: 'center',
          alignItems: 'center',
        },
        tabBarIconStyle: {
          justifyContent: 'center',
          alignItems: 'center',
        }

        // tabBarShowLabel: false, // opcional: para esconder os labels das tabs
      }}
    >
      <Tabs.Screen 
        name="Home"
        options={{
          title: "",         
          tabBarLabelStyle: { 
            fontSize: 12, // ajuste o tamanho da fonte aqui
            fontWeight: 'bold', // opcional: para deixar o texto em negrito
          },
          tabBarIcon: ({ size, color, focused }) => {
              return <MaterialCommunityIcons name='home' color={focused ? colors.amarelo1 : 'gray'} size={30} top={10}/>
          },
        }}
        />
      <Tabs.Screen 
        name="Others"
        options={{
          title: "",         
          tabBarLabelStyle: { 
            fontSize: 12, // ajuste o tamanho da fonte aqui
            fontWeight: 'bold', // opcional: para deixar o texto em negrito
          },
          tabBarIcon: ({ size, color, focused }) => {
              return <MaterialCommunityIcons name='book' color={focused ? colors.amarelo1 : 'gray'} size={30}  top={10}/>
          },
        }}
        />
      <Tabs.Screen 
        name="Account"
        options={{
          title: "",         
          tabBarLabelStyle: { 
            fontSize: 12, // ajuste o tamanho da fonte aqui
            fontWeight: 'bold', // opcional: para deixar o texto em negrito
          },
          tabBarIcon: ({ size, color, focused }) => {
              return <MaterialCommunityIcons name='account' color={focused ? colors.amarelo1 : 'gray'} size={30} top={10} />
          },
        }}
        />
        <Tabs.Screen
          name="ia"
          options={{
            title: "",
            tabBarIcon: ({focused}) => {
              return <MaterialCommunityIcons name='robot' color={focused ? colors.amarelo1 : 'gray'} size={30} top={10} />
            }
          }}
        />
      </Tabs>
      
  );
}