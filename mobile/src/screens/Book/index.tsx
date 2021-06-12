import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import {
  Alert,
  Image,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { useAuth } from '../../contexts/auth';
import { api } from '../../services/api';
import { styles as s } from './styles';

type RouteParams = {
  id: string;
};

export function BookScreen() {
  const { user } = useAuth();
  const { goBack } = useNavigation();
  const { params } = useRoute();
  const { id } = params as RouteParams;
  const [date, setDate] = useState('');

  const handleSubmit = useCallback(() => {
    api
      .post(
        `/spots/${id}/bookings`,
        { date },
        { headers: { user_id: user?.id } }
      )
      .then(() => {
        Alert.alert('Reservation request sent.');
        goBack();
      });
  }, [date, goBack, id, user?.id]);

  const handleCancel = useCallback(() => {
    goBack();
  }, [goBack]);

  return (
    <SafeAreaView style={s.container}>
      <Image style={s.logo} source={require('../../../assets/logo.png')} />

      <Text style={s.label}>Booking date</Text>
      <TextInput
        style={s.input}
        placeholder="Date"
        placeholderTextColor="#999"
        autoCapitalize="none"
        autoCorrect={false}
        value={date}
        onChangeText={setDate}
      />
      <TouchableOpacity onPress={handleSubmit} style={s.button}>
        <Text style={s.buttonText}>Reserve</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={handleCancel}
        style={[s.button, s.cancelButton]}
      >
        <Text style={s.buttonText}>Cancel reserve</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
