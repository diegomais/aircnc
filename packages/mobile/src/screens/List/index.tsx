import React, { useEffect } from 'react';
import {
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import io from 'socket.io-client';
import { SpotList } from '../../components/SpotList';
import { getEnvironment } from '../../config/environment';
import { useAuth } from '../../contexts/auth';
import { styles as s } from './styles';

type Booking = {
  approved: boolean;
  date: string;
  spot: {
    company: string;
  };
};

export function ListScreen() {
  const { apiURL } = getEnvironment();
  const { signOut, user } = useAuth();

  useEffect(() => {
    const socket = io(apiURL, {
      query: { user_id: user?.id },
      transports: ['websocket'],
    });

    socket.on('booking_response', (booking: Booking) => {
      Alert.alert(
        `Your reservation at ${booking.spot.company} for ${booking.date} was ${
          booking.approved ? 'accept' : 'reject'
        }.`
      );
    });
  }, [user?.id]);

  return (
    <SafeAreaView style={s.container}>
      <TouchableOpacity onPress={signOut}>
        <Image style={s.logo} source={require('../../../assets/logo.png')} />
      </TouchableOpacity>

      <ScrollView>
        {user?.techs &&
          user?.techs.map((tech) => <SpotList key={tech} tech={tech} />)}
      </ScrollView>
    </SafeAreaView>
  );
}
