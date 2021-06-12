import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import * as routes from '../constants/screens';
import { useAuth } from '../contexts/auth';
import { BookScreen } from '../screens/Book';
import { ListScreen } from '../screens/List';
import { SignInScreen } from '../screens/SignIn';

const Stack = createStackNavigator();

export function Navigation() {
  const { user } = useAuth();

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user?.id ? (
          <>
            <Stack.Screen name={routes.LIST_SCREEN} component={ListScreen} />
            <Stack.Screen name={routes.BOOK_SCREEN} component={BookScreen} />
          </>
        ) : (
          <Stack.Screen name={routes.SIGN_IN_SCREEN} component={SignInScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
