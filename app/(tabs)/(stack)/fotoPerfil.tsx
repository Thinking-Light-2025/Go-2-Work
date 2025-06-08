// Imports React Native
import { View, Text, StyleSheet, Alert, ActivityIndicator, ScrollView } from 'react-native'; // Adicionado ScrollView
import React, { useState } from 'react';

// Imports Expo
import { Link, useRouter } from 'expo-router';

// Imports firebase
import { auth, db } from '@/src/firebase/config';
import { width } from '@/src/firebase/functions/interface';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

// Componentes internos
import { colors } from '@/src/components/global';
import { Botão, TxtInput } from '@/src/components/objects';
import { styles } from '@/src/firebase/forms/formEmpresa'

