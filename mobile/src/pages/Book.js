import React, { useState } from 'react';
import {
  Alert,
  AsyncStorage,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity
} from 'react-native';

import api from '../services/api';

import logo from '../../assets/logo.png';

export default function Book({ navigation }) {
  const [date, setDate] = useState('');
  const id = navigation.getParam('id');

  async function handleSubmit() {
    const user_id = await AsyncStorage.getItem('aircnc:user');

    await api.post(`/spots/${id}/bookings`, { date }, { headers: { user_id } });

    Alert.alert('Reservation request sent.');

    navigation.navigate('List');
  }

  function handleCancel() {
    navigation.navigate('List');
  }

  return (
    <SafeAreaView style={styles.container}>
      <Image style={styles.logo} source={logo} />

      <Text style={styles.label}>Booking date</Text>
      <TextInput
        style={styles.input}
        placeholder="Date"
        placeholderTextColor="#999"
        autoCapitalize="none"
        autoCorrect={false}
        value={date}
        onChangeText={setDate}
      />
      <TouchableOpacity onPress={handleSubmit} style={styles.button}>
        <Text style={styles.buttonText}>Reserve</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={handleCancel}
        style={[styles.button, styles.cancelButton]}
      >
        <Text style={styles.buttonText}>Cancel reserve</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 30
  },
  logo: {
    height: 32,
    resizeMode: 'contain',
    alignSelf: 'center'
  },
  label: {
    fontWeight: 'bold',
    color: '#444',
    marginBottom: 8,
    marginTop: 30
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#444',
    height: 44,
    marginBottom: 20,
    borderRadius: 4
  },
  button: {
    height: 42,
    backgroundColor: '#f05a5b',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4
  },
  cancelButton: {
    backgroundColor: '#ccc',
    marginTop: 10
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16
  }
});
