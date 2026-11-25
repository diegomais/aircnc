import * as routes from "@/constants/screens";

export type RootStackParamList = {
  [routes.BOOK_SCREEN]: { id: string };
  [routes.LIST_SCREEN]: undefined;
  [routes.SIGN_IN_SCREEN]: undefined;
};
