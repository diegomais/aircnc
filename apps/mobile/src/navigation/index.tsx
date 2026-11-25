import { createStaticNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { ComponentType } from 'react';
import * as routes from '@/constants/screens';
import { useIsSignedIn, useIsSignedOut } from '@/contexts/auth';
import { BookScreen } from '@/screens/Book';
import { ListScreen } from '@/screens/List';
import { SignInScreen } from '@/screens/SignIn';
import { RootStackParamList } from './types';

const RootStack = createNativeStackNavigator<RootStackParamList>({
  screens: {
    [routes.LIST_SCREEN]: {
      if: useIsSignedIn,
      screen: ListScreen,
    },
    [routes.BOOK_SCREEN]: {
      if: useIsSignedIn,
      screen: BookScreen,
    },
    [routes.SIGN_IN_SCREEN]: {
      if: useIsSignedOut,
      screen: SignInScreen,
    },
  },
  screenOptions: {
    headerShown: false,
  }
});

export const Navigation = createStaticNavigation(RootStack) as ComponentType;
