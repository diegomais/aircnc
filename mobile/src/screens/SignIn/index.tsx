import React, { useCallback, useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAuth } from '../../contexts/auth';
import { styles as s } from './styles';

export function SignInScreen() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [techs, setTechs] = useState('');

  const handleSubmit = useCallback(async () => {
    await signIn({ email, techs });
  }, [email, techs]);

  return (
    <KeyboardAvoidingView
      enabled={Platform.OS === 'ios'}
      behavior="padding"
      style={s.container}
    >
      <Image source={require('../../../assets/logo.png')} />

      <View style={s.form}>
        <Text style={s.label}>Your email</Text>
        <TextInput
          style={s.input}
          placeholder="Enter your email"
          placeholderTextColor="#999"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          value={email}
          onChangeText={setEmail}
        />

        <Text style={s.label}>Technologies</Text>
        <TextInput
          style={s.input}
          placeholder="Interested techs"
          placeholderTextColor="#999"
          autoCapitalize="words"
          autoCorrect={false}
          value={techs}
          onChangeText={setTechs}
        />

        <TouchableOpacity onPress={handleSubmit} style={s.button}>
          <Text style={s.buttonText}>Search spots</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
