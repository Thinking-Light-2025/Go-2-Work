// Account.tsx

// Imports do React
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, ScrollView, Alert, TouchableOpacity, Image } from 'react-native';

// Imports do Expo
import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// Imports de componentes nativos
import { colors } from '@/src/components/global';
import { StatusBarObject } from '@/src/components/objects';

// Imports do Firebase
import { Users, Vagas, width, height, Empresas, Freelancer, servicoFreelancer } from '@/src/firebase/functions/interface';
import { dados_usuario, userServicos, userVagas } from '@/src/firebase/functions/get/getInforUser';
import { handleDeleteVaga } from '@/src/firebase/functions/delete/deleteJob';
import { signOut } from 'firebase/auth';
import { auth } from '@/src/firebase/config';

export default function Account() {
  const [usersData, setUsersData] = useState<Users[]>([]);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userVagasList, setUserVagasList] = useState<Vagas[]>([]);
  const [filteredVagas, setFilteredVagas] = useState<Vagas[]>([]);
  const [userServicosList, setUserServicosList] = useState<Vagas[]>([]);
  const [filteredServicos, setFilteredServicos] = useState<Vagas[]>([]);
  const [filteredUsersData, setFilteredUsersData] = useState<Users[]>([]);
  const [tipoConta, setTipoConta] = useState<string | null>(null);

  useEffect(() => {
    const userVagaData = { setUserVagasList, setFilteredVagas, setLoading };
    userVagas(userVagaData);
    const userServicosFunc = { setUserServicosList, setFilteredServicos, setLoading };
    userServicos(userServicosFunc);

    const passData = { setUsersData, setFilteredUsersData, setTipoConta, setLoading };
    dados_usuario(passData);

    const vagaId = { filteredVagas };
    handleDeleteVaga(vagaId);
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.amarelo1} />
        <Text style={{ color: colors.tituloBranco }}>Carregando...</Text>
      </View>
    );
  }

  // Inicio da parte que renderiza a tela da empresa.
  const renderUserEmpresa = ({ item }: { item: Empresas }) => (
    <View style={styles.data}>
      <View style={styles.areaTop}>
        <Image source={{uri: 'https://reactjs.org/logo-og.png'}} style={styles.fotoPerfil}/>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.nome_empresa}</Text>
        <Text style={styles.subTitle}>{item.email}</Text>
      </View>
      </View>
      <View style={styles.areaLow}>
        <View style={styles.areaLow_top}>
          <View style={styles.areaLow_areaInfor}>
            <Text style={styles.areaLow_top_text}>Informações da conta</Text>
            <AntDesign name="rightcircle" size={30} color={colors.amarelo2} />
          </View>
        </View>
        <View style={styles.areaLow_low}><Text style={styles.areaLow_low_text}>Contato:</Text><Text style={styles.areaLow_low_text2}>{item.email}</Text></View>
        <View style={styles.areaLow_low}><Text style={styles.areaLow_low_text}>Setor:</Text><Text style={styles.areaLow_low_text2}>{item.setor}</Text></View>
        <View style={styles.areaLow_low}><Text style={styles.areaLow_low_text}>CNPJ:</Text><Text style={styles.areaLow_low_text2}>{item.cnpj}</Text></View>
        <View style={styles.areaLow_low}><Text style={styles.areaLow_low_text}>Descrição:</Text><Text style={styles.areaLow_low_text2}>{item.descricao}</Text></View>
      </View>
    </View>
  );
  // Fim da parte que renderiza a tela da empresa.

  // Inicio da parte que renderiza a tela de pessoas.
  const renderUserPessoa = ({ item }: { item: Users }) => (
    <View style={styles.data}>
      <View style={styles.areaTop}>
        <Text style={styles.title}>{item.name_conta}</Text>
        <Text style={styles.subTitle}>{item.email}</Text>
      </View>
      <View style={styles.areaLow}>
        <View style={styles.areaLow_top}>
          <View style={styles.areaLow_areaInfor}>
            <Text style={styles.areaLow_top_text}>Informações da conta</Text>
            <TouchableOpacity onPress={() => router.replace('/(tabs)/Config')}>
              <AntDesign name="rightcircle" size={30} color={colors.amarelo2} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.areaLow_low}><Text style={styles.areaLow_low_text}>Contato:</Text><Text style={styles.areaLow_low_text2}>{item.email}</Text></View>
        <View style={styles.areaLow_low}><Text style={styles.areaLow_low_text}>Senha:</Text><Text style={styles.areaLow_low_text2}>{item.senha}</Text></View>
        <View style={styles.areaLow_low}><Text style={styles.areaLow_low_text}>Telefone:</Text><Text style={styles.areaLow_low_text2}>{item.telefone}</Text></View>
        <View style={styles.areaLow_low}><Text style={styles.areaLow_low_text}>Links:</Text><Text style={styles.areaLow_low_text2}>{item.links_externos}</Text></View>
      </View>
    </View>
  );
  // Fim da parte que renderiza a tela da pessoas.

  // Inicio da parte que renderiza a tela de freelancers.
  const renderUserFreelancer = ({ item }: { item: Freelancer } ) => (
    <View style={styles.data}>
      <View style={styles.areaTop}>
        <Text style={styles.title}>{item.nomeFree}</Text>
        <Text style={styles.subTitle}>{item.email}</Text>
      </View>
      <View style={styles.areaLow}>
        <View style={styles.areaLow_top}>
          <View style={styles.areaLow_areaInfor}>
            <Text style={styles.areaLow_top_text}>Informações da conta</Text>
            <AntDesign name="rightcircle" size={30} color={colors.amarelo2} />
          </View>
        </View>
        <View style={styles.areaLow_low}><Text style={styles.areaLow_low_text}>Contato:</Text><Text style={styles.areaLow_low_text2}>{item.email}</Text></View>
        <View style={styles.areaLow_low}><Text style={styles.areaLow_low_text}>Setor:</Text><Text style={styles.areaLow_low_text2}>{item.setor}</Text></View>
        <View style={styles.areaLow_low}><Text style={styles.areaLow_low_text}>Região de atuação:</Text><Text style={styles.areaLow_low_text2}>{item.regiao}</Text></View>
        <View style={styles.areaLow_low}><Text style={styles.areaLow_low_text}>Links:</Text><Text style={styles.areaLow_low_text2}>{item.links}</Text></View>
        <View style={styles.areaLow_low}><Text style={styles.areaLow_low_text}>Descrição:</Text><Text style={styles.areaLow_low_text2}>{item.descricao}</Text></View>
      </View>
    </View>
  );
  // Fim da parte que renderiza a tela de freelancers.

  const renderVagaCard = ({ item }: { item: Vagas }) => (
    <View style={stylesVagas.item}>
      <View style={stylesVagas.item_areaTitle}>
        <MaterialCommunityIcons name="information-outline" size={30} color="white" />
        <Text style={stylesVagas.title}>{item.nome_vaga}</Text>
        <MaterialCommunityIcons
          name="delete"
          size={30}
          color="red"
          onPress={() => {
            Alert.alert(
              "Excluir vaga",
              `Deseja realmente excluir a vaga "${item.name}"?`,
              [
                { text: "Cancelar", style: "cancel" },
                { text: "Excluir", onPress: () => handleDeleteVaga(item.uid), style: "destructive" }
              ]
            );
          }}
        />
      </View>
      <Text style={stylesVagas.text}>Salário: R$ {item.salario}</Text>
      <Text style={stylesVagas.text}>Empresa: {item.nome_empresa}</Text>
      <Text style={stylesVagas.text}>Email: {item.email}</Text>
      <Text style={stylesVagas.text}>Localização: {item.localizacao}</Text>
      <Text style={stylesVagas.text}>Setor: {item.setor}</Text>
    </View>
  );
  const renderServicoCard = ({ item }: { item: servicoFreelancer }) => (
    <View style={stylesVagas.item}>
      <View style={stylesVagas.item_areaTitle}>
        <MaterialCommunityIcons name="information-outline" size={30} color="white" />
        <Text style={stylesVagas.title}>{item.titulo_servico}</Text>
        <MaterialCommunityIcons
          name="delete"
          size={30}
          color="red"
          onPress={() => {
            Alert.alert(
              "Excluir vaga",
              `Deseja realmente excluir a vaga "${item.nome_vaga}"?`,
              [
                { text: "Cancelar", style: "cancel" },
                { text: "Excluir", onPress: () => handleDeleteVaga(item.id), style: "destructive" }
              ]
            );
          }}
        />
      </View>
      <Text style={stylesVagas.text}>Empresa: {item.responsavel}</Text>
      <Text style={stylesVagas.text}>Email: {item.email}</Text>
      <Text style={stylesVagas.text}>Data de publicação: {item.dataPublicacao_servico}</Text>
      <Text style={stylesVagas.text}>Modalidade: {item.modalidade_servico}</Text>
      <Text style={stylesVagas.text}>Valor: R$ {item.valor_servico}</Text>
    </View>
  );

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.replace('/');
    } catch (error: any) {
      console.error('Erro ao deslogar:', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBarObject />
      <ScrollView>
        {tipoConta === 'Empresa' ? (
          <FlatList
            data={filteredUsersData}
            keyExtractor={(item) => item.uid}
            renderItem={renderUserEmpresa}
            scrollEnabled={false}
          />
        ) : tipoConta === 'Pessoa' ? (
          <FlatList
            data={filteredUsersData}
            keyExtractor={(item) => item.uid}
            renderItem={renderUserPessoa}
            scrollEnabled={false}
          />
        ) : tipoConta === 'Freelancer' ? (
          <FlatList
            data={filteredUsersData}
            keyExtractor={(item) => item.uid}
            renderItem={renderUserFreelancer}
            scrollEnabled={false}
          />
        ) : (
          <Text style={styles.sectionTitle}>Tipo de conta desconhecido</Text>
        )}

        <Text style={styles.sectionTitle}>Suporte</Text>
        <View style={styles.areaLow}>
          <View style={styles.areaLow_areaInfor}>
            <Text style={styles.areaLow_top_text}>Opções de suporte</Text>
          </View>
          <View style={styles.areaLow_low}><Text style={styles.areaLow_low_text}>Central de Ajuda</Text><AntDesign name="caretright" size={24} color={colors.tituloBranco} /></View>
          <View style={styles.areaLow_low}><Text style={styles.areaLow_low_text}>Fale Conosco</Text><AntDesign name="caretright" size={24} color={colors.tituloBranco} /></View>
          <TouchableOpacity onPress={() => {
            Alert.alert(
              "Você está saindo da conta",
              "Tem certeza que deseja sair?",
              [
                { text: "Cancelar" },
                { text: "Sim", onPress: () => handleSignOut() }
              ]
            );
          }}>
            <View style={styles.areaLow_low}>
              <Text style={styles.areaLow_low_text}>Sair do aplicativo</Text>
              <AntDesign name="caretright" size={24} color={colors.tituloBranco} />
            </View>
          </TouchableOpacity>
        </View>

        {(tipoConta === 'Empresa' ) && (
          <>
            <Text style={styles.sectionTitle}>Suas vagas criadas:</Text>
            <View style={stylesVagas.AreaVagasView}>
              {filteredVagas.length > 0 ? (
                <FlatList
                  data={filteredVagas}
                  keyExtractor={(item) => item.id}
                  renderItem={renderVagaCard}
                  scrollEnabled={false}
                />
              ) : (
                <Text style={stylesVagas.emptyMessage}>Você não tem vagas postadas ainda.</Text>
              )}
            </View>
          </>
        )}

          {/* {tipoConta === 'Freelancer' && (
            <>
              <Text style={styles.sectionTitle}>Seus serviços freelancer:</Text>
              <View style={stylesVagas.AreaVagasView}>
                {filteredServicos.length > 0 ? (
                  <FlatList
                    data={filteredServicos}
                    keyExtractor={(item) => item.id}
                    renderItem={renderServicoCard}
                    scrollEnabled={false}
                  />
                ) : (
                  <Text style={stylesVagas.emptyMessage}>Você não tem serviços postados ainda.</Text>
                )}
              </View>
            </>
          )} */}

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.preto,
    paddingBottom: 120,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.preto
  },
  sectionTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    color: colors.amarelo2,
    marginLeft: 20,
    marginTop: 30,
  },
  data: {
    maxWidth: width,
    minHeight: height * 0.1,
    alignItems: 'center',
  },
  areaTop: {
    backgroundColor: colors.fundo2,
    flexDirection: 'row',
    alignItems: 'center',
    width: width,
    paddingVertical: 20,
    justifyContent: 'flex-end',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    padding: 20,
  },
  title: {
    fontSize: 35,
    fontWeight: 'bold',
    color: colors.tituloBranco,
  },
  subTitle: {
    fontSize: 20,
    color: colors.cinza2,
    marginBottom: 10,
  },
  areaLow: {
    width: '90%',
    padding: 15,
    backgroundColor: colors.fundo2,
    borderRadius: 20,
    marginTop: 25,
    alignSelf: 'center',
  },
  areaLow_top: {
    width: '100%',
    minHeight: 50,
    alignItems: 'center',
  },
  areaLow_areaInfor: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  areaLow_top_text: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.tituloBranco,
  },
  areaLow_low: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 11,
  },
  areaLow_low_text: {
    fontSize: 16,
    color: colors.cinza2,
  },
  areaLow_low_text2: {
    fontSize: 16,
    color: colors.tituloAmarelo,
    flexShrink: 1,
    textAlign: 'right'
  },
  fotoPerfil: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 10,
  },
  textContainer: {
  flex: 1,
  justifyContent: 'center',
  },
});

const stylesVagas = StyleSheet.create({
  AreaVagasView: {
    padding: 20,
    width: width,
  },
  item: {
    padding: 10,
    marginBottom: 15,
    backgroundColor: colors.cinza,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  item_areaTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.tituloAmarelo,
    flex: 1,
    marginLeft: 10,
  },
  text: {
    fontSize: 16,
    color: colors.tituloBranco,
    marginBottom: 4,
  },
  emptyMessage: {
    fontSize: 16,
    color: colors.tituloBranco,
    textAlign: 'center',
    marginTop: 20,
  },
});
