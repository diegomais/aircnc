import React, { useEffect, useState } from 'react';
import {
  AsyncStorage,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet
} from 'react-native';

import SpotList from '../components/SpotList';

import logo from '../../assets/logo.png';

export default function List() {
  const [techs, setTechs] = useState([]);

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
