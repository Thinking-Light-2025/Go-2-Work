import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  ScrollView,
  Pressable,
} from 'react-native';
import { colors } from '@/src/components/global';
import { useGlobalSearchParams } from 'expo-router';
import { Vagas, width } from '@/src/firebase/functions/interface';
import { fetchJobs_Geral } from '@/src/firebase/functions/get/getJobs';
import { StatusBarObject } from '@/src/components/objects';
import MyModal from '../../src/components/modal'


type Item = {
  id: string;
  nome_vaga: string;
  nome_empresa: string;
  salario: number;
  descricaoVaga: string;
  modalidade: string;
  email: string;
  localizacao: string;
  uid_criadorVaga: string; // Supondo que também use isso em outros lugares
  setor: string;
  regime: string;
};

export default function Geral() {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  const openModal = (item: Item) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedItem(null);
  };

  const { coleção, campo, valor, coleçãoUnica } = useGlobalSearchParams();
  const dataBox = { coleção, campo, valor };
  const dataBox2 = { coleçãoUnica };

  const [jobs, setJobs] = useState<Vagas[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Vagas[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const valueData = { setJobs, setFilteredJobs, setLoading };
    fetchJobs_Geral(valueData, dataBox, dataBox2);
  }, []);

  useEffect(() => {
    if (searchQuery === '') {
      setFilteredJobs(jobs);
    } else {
      const filtered = jobs.filter(job =>
        (job.nome_vaga && job.nome_vaga.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (job.nome_empresa && job.nome_empresa.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setFilteredJobs(filtered);
    }
  }, [searchQuery, jobs]);

  const renderItem = ({ item }: { item: Vagas }) => (
    <Pressable  style={styles.item}>
      <View style={stylesVagas.item}>
        <Text style={stylesVagas.title}>{item.nome_vaga}</Text>
        <Text style={stylesVagas.subTitle}>{item.nome_empresa}</Text>

        <View style={stylesVagas.box_mode}>
          <Text style={stylesVagas.mode}>Salário:</Text>
          <Text style={stylesVagas.mode}>R$ {item.salario}</Text>
        </View>

        <View style={stylesVagas.box_mode}>
          <Text style={stylesVagas.mode}>Modalidades:</Text>
          <Text style={stylesVagas.mode}>{item.modalidade}</Text>
        </View>

        <View style={stylesVagas.box_mode}>
          <Text style={stylesVagas.mode}>Contato:</Text>
          <Text style={stylesVagas.mode} numberOfLines={1} ellipsizeMode="tail">{item.email}</Text>
        </View>

        <View style={stylesVagas.box_mode}>
          <Text style={stylesVagas.mode}>Localização:</Text>
          <Text style={stylesVagas.mode}>{item.localizacao}</Text>
        </View>

        <Pressable style={stylesVagas.button} onPress={() => openModal(item)}>
            <Text style={{color: colors.tituloBranco, fontSize: 17, fontWeight: 'bold'}} >Visualizar melhor</Text>
        </Pressable>

      </View>

    </Pressable>
  );

  return (
    <View style={styles.container}>
      <StatusBarObject />
  
      {loading ? (
        <ActivityIndicator size="large" color={colors.amarelo1} />
      ) : (
        <FlatList
          data={filteredJobs}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 50 }}
          ListHeaderComponent={
            <View style={styles.containerTop}>
              <TextInput
                style={styles.searchBar}
                placeholder="Buscar vagas..."
                placeholderTextColor="#aaa"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              <Text style={styles.titleTop}>
                {campo} {valor}
              </Text>
            </View>
          }
        />
      )}
  
      {modalVisible && selectedItem && (
        <MyModal
          visible={modalVisible}
          onClose={closeModal}
          item={selectedItem}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.preto,
  },
  containerTop: {
    width: '100%',
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 0,
    backgroundColor: colors.preto,
    alignItems: 'center',
  },
  titleTop: {
    fontSize: 20,
    color: colors.amarelo2,
    fontWeight: '600',
    marginTop: 10,
    textAlign: 'center',
  },
  searchBar: {
    width: '100%',
    height: 50,
    backgroundColor: colors.cinza,
    borderRadius: 15,
    paddingHorizontal: 20,
    fontSize: 16,
    color: colors.tituloBranco,
    elevation: 2,
  },
  containerBottom: {
    flex: 1,
    paddingHorizontal: 15,
    paddingTop: 10,
  },
  item: {
    marginBottom: 15,
  },
});

const stylesVagas = StyleSheet.create({
  item: {
    backgroundColor: colors.cinza,
    padding: 15,
    borderRadius: 15,
    marginVertical: 8,
    width: width * 0.9,
    alignSelf: 'center',
    alignItems: 'center',
  },
  title: { 
    fontSize: 35, 
    fontWeight: 'bold', 
    color: colors.tituloBranco 
  },
  subTitle: { 
    fontSize: 21, 
    color: colors.tituloAmarelo, 
    marginBottom: 10 
  },
  box_mode: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 2,
  },
  mode: { 
    fontSize: 16, 
    color: colors.tituloBranco, 
    paddingHorizontal: 10,
  },
  buttonCandidatar: {
    backgroundColor: colors.amarelo2,
    padding: 10,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
  },
  buttonText: { 
    fontSize: 16, 
    color: colors.tituloBranco 
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: colors.amarelo2,
    justifyContent: "center", alignItems: "center",
    borderRadius: 10, flexDirection: "row",
    marginTop: 15,
  },
});


/*import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  ScrollView,
  Touchable,
  Pressable,
} from 'react-native';
import { colors } from '@/src/components/global';
import { useGlobalSearchParams } from 'expo-router';
import { height, Vagas, width } from '@/src/firebase/functions/interface';
import { fetchJobs_Geral } from '@/src/firebase/functions/get/getJobs';
import { StatusBarObject } from '@/src/components/objects';
import {  } from '../../src/components/modal'

type Item = {
  id: string;
  nome: string;
  empresa: string;
  salario: number;
  descricaoVaga: string;
};

export default function Geral() {
  // Inicio da Função que Retorna Itens na FlatList
// Agora você define explicitamente o tipo dos itens como 'Item[]'
  const [itens, setItens] = useState<Item[]>([]); // Estado para armazenar os itens da coleção
  const [modalVisible, setModalVisible] = useState(false); // Estado para controlar a visibilidade do Modal
  const [selectedItem, setSelectedItem] = useState<Item | null>(null); // Estado para armazenar o item selecionado

  const openModal = (item: Item) => {
    setSelectedItem(item); // Define o item selecionado
    setModalVisible(true); // Abre o modal
  };

  const closeModal = () => {
    setModalVisible(false); // Fecha o modal
    setSelectedItem(null); // Limpa o item selecionado
  };

  const { coleção, campo, valor, coleçãoUnica } = useGlobalSearchParams();
  const dataBox = { coleção, campo, valor };
  const dataBox2 = { coleçãoUnica };

  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const valueData = { setJobs, setFilteredJobs, setLoading };
    fetchJobs_Geral(valueData, dataBox, dataBox2);
  }, []);

  useEffect(() => {
    if (searchQuery === '') {
      setFilteredJobs(jobs);
    } else {
      const filtered = jobs.filter(job =>
        (job.nome_vaga && job.nome_vaga.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (job.nome_empresa && job.nome_empresa.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setFilteredJobs(filtered);
    }
  }, [searchQuery, jobs]);

  const renderItem = ({ item }: { item: Vagas }) => (
    <FlatList
    data={itens}
    renderItem={({item}) = > (
    />
    <Pressable onPress={() => openModal(item)} style={styles.item}>
      <View style={stylesVagas.item}>
        <Text style={stylesVagas.title}>{item.nome_vaga}</Text>
        <Text style={stylesVagas.subTitle}>{item.nome_empresa}</Text>

        <View style={stylesVagas.box_mode}>
          <Text style={stylesVagas.mode}>Salário:</Text>
          <Text style={stylesVagas.mode}>R$ {item.salario}</Text>
        </View>

        <View style={stylesVagas.box_mode}>
          <Text style={stylesVagas.mode}>Modalidades:</Text>
          <Text style={stylesVagas.mode}>{item.modalidade}</Text>
        </View>

        <View style={stylesVagas.box_mode}>
          <Text style={stylesVagas.mode}>Contato:</Text>
          <Text style={stylesVagas.mode}>{item.email}</Text>
        </View>

        <View style={stylesVagas.box_mode}>
          <Text style={stylesVagas.mode}>Localização:</Text>
          <Text style={stylesVagas.mode}>{item.localizacao}</Text>
        </View>
      </View>
    </Pressable>
    keyExtractor={(item) => item.id}
    />
  )}
  );

  return (
    <View style={styles.container}>
      <StatusBarObject />

      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <View style={styles.containerTop}>
          <TextInput
            style={styles.searchBar}
            placeholder="Buscar vagas..."
            placeholderTextColor="#aaa"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <Text style={styles.titleTop}>
            {campo} {valor}
          </Text>
        </View>

        <View style={styles.containerBottom}>
          {loading ? (
            <ActivityIndicator size="large" color={colors.amarelo1} />
          ) : (
            <FlatList
              data={filteredJobs}
              keyExtractor={(item) => item.id}
              renderItem={renderItem}
              nestedScrollEnabled
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 50 }}
            />
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.preto,
  },
  containerTop: {
    width: '100%',
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 0,
    backgroundColor: colors.preto,
    alignItems: 'center',
  },
  titleTop: {
    fontSize: 25,
    color: colors.amarelo2,
    fontWeight: '600',
    margin: 10,
    textAlign: 'center',
  },
  searchBar: {
    width: '100%',
    height: 50,
    backgroundColor: colors.cinza,
    borderRadius: 15,
    paddingHorizontal: 20,
    fontSize: 16,
    color: colors.tituloBranco,
    elevation: 2,
  },
  containerBottom: {
    flex: 1,
    paddingHorizontal: 15,
    paddingTop: 10,
  },
});

const stylesVagas = StyleSheet.create({
  item: {
    backgroundColor: colors.cinza,
    padding: 15, borderRadius: 15, marginVertical: 8,
    width: width * 0.9, alignSelf: 'center', alignItems: 'center',
  },
  title: { fontSize: 35, fontWeight: 'bold', color: colors.tituloBranco },
  subTitle: { fontSize: 21, color: colors.tituloAmarelo, marginBottom: 10 },
  box_mode: {
    flexDirection: 'row', justifyContent: 'space-between',
    width: '100%', marginBottom: 2
  },
  mode: { fontSize: 17, color: colors.tituloBranco, paddingInline: 10, },
  buttonCandidatar: {
    backgroundColor: colors.amarelo2,
    padding: 10, borderRadius: 10, marginTop: 20,
    alignItems: 'center'
  },
  buttonText: { fontSize: 16, color: colors.tituloBranco },
});*/