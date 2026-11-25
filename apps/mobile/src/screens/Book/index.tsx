import { useNavigation } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useCallback, useState } from 'react';
import {
  Alert,
  Image,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { useAuth } from '@/contexts/auth';
import type { RootStackParamList } from '@/navigation/types';
import { api } from '@/services/api';
import { styles as s } from './styles';

type Props = NativeStackScreenProps<RootStackParamList, 'Book'>;

export function BookScreen({ route: { params: { id } } }: Props) {
  const { user } = useAuth();
  const navigation = useNavigation();
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
        navigation.goBack();
      }).catch((error) => {
        console.error(JSON.stringify(error.response, null, 2));
        Alert.alert('Failed to send reservation request.');
      });
  }, [date, navigation.goBack, id, user?.id]);

  const handleCancel = useCallback(() => {
    navigation.goBack();
  }, [navigation.goBack]);

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
