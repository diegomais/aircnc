import React, { useEffect, useState } from 'react';
import {
  Alert,
  AsyncStorage,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet
} from 'react-native';
import socketio from 'socket.io-client';

import SpotList from '../components/SpotList';

import logo from '../../assets/logo.png';

export default function List() {
  const [techs, setTechs] = useState([]);

  useEffect(() => {
    AsyncStorage.getItem('aircnc:user').then(user_id => {
      const socket = socketio('http://192.168.2.140:3333', {
        query: { user_id }
      });

      socket.on('booking_response', booking => {
        Alert.alert(
          `Your reservation at ${booking.spot.company} for ${
            booking.date
          } was ${booking.approved ? 'accept' : 'reject'}.`
        );
      });
    });
  }, []);

  useEffect(() => {
    AsyncStorage.getItem('aircnc:techs').then(storedTechs => {
      setTechs(storedTechs.split(',').map(item => item.trim()));
    });
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Image style={styles.logo} source={logo} />

      <ScrollView>
        {techs.map(tech => (
          <SpotList key={tech} tech={tech} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  logo: {
    height: 32,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginTop: 10
  }
});
