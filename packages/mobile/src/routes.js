import { createAppContainer, createSwitchNavigator } from 'react-navigation';

import SignIn from './pages/SignIn';
import List from './pages/List';
import Book from './pages/Book';

const Routes = createAppContainer(
  createSwitchNavigator({
    SignIn,
    List,
    Book
  })
);

export default Routes;
