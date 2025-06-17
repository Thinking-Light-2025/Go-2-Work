import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '@/src/components/global';
import FormVagaCLT from '@/src/firebase/forms/FormVagaCLT'; // componente de vaga CLT
import { StatusBarObject } from '@/src/components/objects';
import FormServicosFree from '@/src/firebase/forms/FormServicosFree';

export default function CreateService() {
  const [selectedForm, setSelectedForm] = useState<'clt' | 'freela'>('clt');

  return (
    <View style={styles.container}>
      <StatusBarObject />

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, selectedForm === 'clt' && styles.tabSelected]}
          onPress={() => setSelectedForm('clt')}
        >
          <Text style={styles.tabText}>Vaga CLT</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedForm === 'freela' && styles.tabSelected]}
          onPress={() => setSelectedForm('freela')}
        >
          <Text style={styles.tabText}>Freelancer</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.formContainer}>
        {selectedForm === 'clt' ? <FormVagaCLT /> : <FormServicosFree />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.fundo, paddingTop: 30 },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  tab: {
    padding: 12,
    marginHorizontal: 10,
    borderBottomWidth: 2,
    borderColor: 'transparent',
  },
  tabSelected: { borderColor: colors.amarelo1, },
  tabText: { fontSize: 18, color: colors.tituloBranco },
  formContainer: { flex: 1 },
});