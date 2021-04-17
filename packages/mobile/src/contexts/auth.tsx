import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { TECHS_KEY, USER_ID_KEY } from '../constants/storage';
import { api } from '../services/api';

type User = {
  id: string;
  techs: string[];
};

type SignInCredentials = {
  email: string;
  techs: string;
};

type AuthContextData = {
  loading: boolean;
  signIn(credentials: SignInCredentials): Promise<void>;
  signOut(): Promise<void>;
  user: User;
};

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC = ({ children }) => {
  const [user, setUser] = useState<User>({} as User);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AsyncStorage.multiGet([USER_ID_KEY, TECHS_KEY]).then(
      ([userId, userTechs]) => {
        if (userId[1] && userTechs[1]) {
          setUser({
            id: userId[1],
            techs: userTechs[1].split(',').map((item) => item.trim()),
          });
        }
        setLoading(false);
      }
    );
  }, []);

  const signIn = useCallback(async ({ email, techs }: SignInCredentials) => {
    const { data } = await api.post('/sessions', { email });
    await AsyncStorage.multiSet([
      [USER_ID_KEY, data._id],
      [TECHS_KEY, techs],
    ]);
    setUser({
      id: data._id,
      techs: techs.split(',').map((item) => item.trim()),
    });
  }, []);

  const signOut = useCallback(async () => {
    await AsyncStorage.multiRemove([USER_ID_KEY, TECHS_KEY]);
    setUser({} as User);
  }, []);

  return (
    <AuthContext.Provider value={{ loading, user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextData => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};
