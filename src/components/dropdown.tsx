import React from 'react';
import { SelectList } from 'react-native-dropdown-select-list';
import { StyleSheet, View, Text } from 'react-native';

// Design
import { colors } from '@/src/components/global';
import { AntDesign } from '@expo/vector-icons';
import { width } from '@/src/firebase/functions/interface';

// Formulários
import { FormPessoa } from '@/src/firebase/forms/formPessoa';
import { FormEmpresa } from '@/src/firebase/forms/formEmpresa';
import { FormFreelancer } from '@/src/firebase/forms/formFreelancer';

interface DropdownComponentProps {
  tipoConta: string;
  setTipoConta: (val: string) => void;
  setEmail: (val: string) => void;
  setPassword: (val: string) => void;
  onSubmit: () => void;
}

export const DropdownComponent: React.FC<DropdownComponentProps> = ({
  tipoConta,
  setTipoConta,
  setEmail,
  setPassword,
  onSubmit
}) => {
  const data = [
    { key: '1', value: 'Pessoa' },
    { key: '2', value: 'Empresa' },
    { key: '3', value: 'Freelancer' },
  ];

  return (
    <View>
      <SelectList
        setSelected={setTipoConta}
        data={data}
        save="value"
        boxStyles={styles.boxEstilo}
        dropdownStyles={styles.dropdownEstilo}
        dropdownItemStyles={styles.dropdownItemEstilo}
        dropdownTextStyles={styles.dropdownTextoEstilo}
        placeholder="Selecione uma opção"
        search={false}
        inputStyles={styles.textoInputEstilo}
        arrowicon={<AntDesign name="down" size={20} color={colors.amarelo1} />}
      />

      <View style={styles.formContainer}>
        {tipoConta === 'Pessoa' && (
          <FormPessoa setEmail={setEmail} setPassword={setPassword} onSubmit={onSubmit} />
        )}
        {tipoConta === 'Empresa' && (
          <FormEmpresa setEmail={setEmail} setPassword={setPassword} onSubmit={onSubmit} />
        )}
        {tipoConta === 'Freelancer' && (
          <FormFreelancer setEmail={setEmail} setPassword={setPassword} onSubmit={onSubmit} />
        )}
        {tipoConta === '' && (
          <Text style={styles.selectText}>Por favor, selecione um tipo de conta acima</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  boxEstilo: {
    backgroundColor: colors.fundo2,
    borderColor: colors.amarelo2,
    borderWidth: 2,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    margin: 15,
  },
  dropdownEstilo: {
    backgroundColor: colors.cinza,
    borderColor: colors.amarelo1,
    borderWidth: 1,
    borderRadius: 8,
    marginTop: 8,
    margin: 15,
  },
  dropdownItemEstilo: {
    backgroundColor: colors.fundo2,
    paddingVertical: 12,
    marginHorizontal: 8,
  },
  dropdownTextoEstilo: {
    color: colors.tituloBranco,
    fontSize: 16,
  },
  textoInputEstilo: {
    color: colors.tituloBranco,
    fontSize: 16,
  },
  formContainer: {
    width: width,
    alignItems: 'center',
  },
  selectText: {
    fontSize: 16,
    color: colors.tituloBranco,
    textAlign: 'center',
    marginTop: 20,
  },
});
