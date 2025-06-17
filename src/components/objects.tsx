import { StatusBar, StatusBarProps, TouchableOpacity, TouchableOpacityProps, StyleSheet, View} from "react-native"
import { colors } from "./global"
import { TextInput, TextInputProps } from "react-native"
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
// import { width } from "../firebase/functions/interfaces"

export function Botão({ style, ...rest }: TouchableOpacityProps & { style?: any }) {
  return (
    <TouchableOpacity
      style={[styles.botaoBase, style]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  botaoBase: {
    width: '90%',
    height: 60,
    backgroundColor: colors.amarelo2,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
});

export function BotãoInicio({ ...rest }: TouchableOpacityProps) {
  return (
    <TouchableOpacity
      style={{
        width: '90%',
        height: 50,
        backgroundColor: colors.amarelo2,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
        marginTop: 10,
        marginBottom: 90,
      }}
      {...rest}
    />
  )
}

export function BotãoRedondo({ ...rest }: TouchableOpacityProps) {
  return (
    <TouchableOpacity
      style={{
        width: 60,
        height: 60,
        backgroundColor: colors.amarelo1,
        borderRadius: 100,
        justifyContent: "center",
        alignItems: "center",
      }}
      {...rest}
    />
  )
}

export function InputWhite({ ...rest }: TextInputProps) {
  return (
    <TextInput
      style={{
        width: "90%",
        marginTop: 10,
        height: 50,
        paddingLeft: 20,
        color: "#000",
        borderColor: '#000',
        backgroundColor: "#444",
        borderRadius: 5,
        marginBottom: 15,
        fontSize: 16,
      }}
      {...rest}
    />
  )
}

export function TxtInput({style, ...rest }: TextInputProps) {
  return (
    <TextInput
      style={[
      {
        width: '90%',
        height: 55,
        paddingLeft: 20,
        paddingRight: 20,
        borderColor: colors.amarelo2,
        color: 'white',
        borderWidth: 1.2,
        borderRadius: 8,
        fontSize: 16,
      },
      style
    ]}
      {...rest}
    />
  )
}

interface TxtInputLoginProps extends React.ComponentProps<typeof TextInput> {
  isPassword?: boolean;
}

export function TxtInputLogin({ style, isPassword, ...rest }: TxtInputLoginProps) {
  const [secureText, setSecureText] = useState(isPassword ?? false);

  const toggleSecureText = () => {
    setSecureText(!secureText);
  };

  return (
    <View style={styles3.inputContainer}>
      <TextInput
        style={[styles3.input, style]}
        secureTextEntry={secureText}
        placeholderTextColor="#ccc"
        {...rest}
      />

      {isPassword && (
        <TouchableOpacity onPress={toggleSecureText} style={styles3.eyeIcon}>
          <Ionicons
            name={secureText ? 'eye-off' : 'eye'}
            size={24}
            color={colors.amarelo2}
          />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles3 = StyleSheet.create({
  inputContainer: {
    width: '90%',
    height: 55,
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: colors.amarelo2,
    borderWidth: 1.2,
    borderRadius: 8,
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: 'transparent',
  },
  input: {
    flex: 1,
    color: 'white',
    fontSize: 16,
  },
  eyeIcon: {
    marginLeft: 10,
  },
});


export function TextArea({ ...rest }: TextInputProps) {
  return (
    <TextInput
      style={{
        color: colors.tituloBranco,
        maxHeight: 1350, // Altura ajustável da área de texto
        borderWidth: 1, // Largura da borda
        maxWidth: "100%",
        //backgroundColor: colors.cinza,
        borderColor: colors.amarelo2,
        borderRadius: 9, // Bordas arredondadas
        padding: 20, // Espaçamento interno
        textAlignVertical: 'center', // Alinha o texto no topo da área de texto
        fontSize: 16, // Tamanho do texto
      }}
      {...rest}
    />
  )
}


export function StatusBarObject({ ...rest }: StatusBarProps) {
  return (
      <StatusBar
        barStyle="light-content" // ou "dark-content"
        backgroundColor={colors.preto} // fundo da 
        {...rest}
      />
  )
}
