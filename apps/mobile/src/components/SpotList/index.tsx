import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCallback, useEffect, useState } from 'react';
import { FlatList, Image, Text, TouchableOpacity, View } from 'react-native';
import { BOOK_SCREEN } from '@/constants/screens';
import type { RootStackParamList } from '@/navigation/types';
import { api } from '@/services/api';
import { styles as s } from './styles';

type Props = {
  tech: string;
};

type Navigation = NativeStackNavigationProp<RootStackParamList>;

type Spot = {
  _id: string;
  company: string;
  price: number;
  thumbnail_url: string;
};

export function SpotList({ tech }: Props) {
  const navigation = useNavigation<Navigation>();
  const [spots, setSpots] = useState<Spot[]>([]);

  useEffect(() => {
    api.get('/spots', { params: { tech } }).then(({ data }) => {
      setSpots(data);
    });
  }, [tech]);

  const handleNavigate = useCallback(
    (id: string) => {
      navigation.navigate(BOOK_SCREEN, { id });
    },
    [navigation.navigate]
  );

  return (
    <View style={s.container}>
      <Text style={s.title}>
        Companies that use <Text style={s.bold}>{tech}</Text>
      </Text>

      <FlatList
        style={s.list}
        data={spots}
        keyExtractor={(spot) => spot._id}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={s.listItem}>
            <Image style={s.thumbnail} source={{ uri: item.thumbnail_url }} />
            <Text style={s.company}>{item.company}</Text>
            <Text style={s.price}>
              {item.price ? `${item.price} per day` : 'Free'}
            </Text>
            <TouchableOpacity
              style={s.button}
              onPress={() => handleNavigate(item._id)}
            >
              <Text style={s.buttonText}>Request reservation</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}
