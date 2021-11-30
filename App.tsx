import React from 'react';
import { LoadingScreen } from './src/screens/Login/LoadingScreen';
import { SignUpScreen } from './src/screens/Login/SignUpScreen';
import { LoginScreen } from './src/screens/Login/LoginScreen';
import { HomeScreen } from './src/screens/Home/HomeScreen';
import { WelcomeScreen } from './src/screens/Login/WelcomeScreen';
import { ProfileScreen } from './src/screens/Profile/ProfileScreen';
import { ForgotPasswordScreen } from './src/screens/Login/ForgotPasswordScreen';
import {
  Provider as PaperProvider,
  DefaultTheme,
  IconButton,
  Colors,
} from 'react-native-paper';
import { CreateSNNScreen } from './src/screens/SNN/CreateSNNScreen';
import { AboutScreen } from './src/screens/About/AboutScreen';
import { SettingsScreen } from './src/screens/Settings/SettingsScreen';
import { ConversationsScreen } from './src/screens/Messaging/ConversationsScreen';
import { ChatScreen } from './src/screens/Messaging/ChatScreen';
import { CrewSNNSStore, crewSNNSStore } from './src/stores/crew_snns_store';
import { UserStore, userStore } from './src/stores/user_store';
import { LocationsStore, locationsStore } from './src/stores/locations_store';
import { BoatSNNSStore, boatSNNSStore } from './src/stores/boat_snns_store';
import { ChatStore, chatStore } from './src/stores/chat_store';
import * as Sentry from '@sentry/react-native';
import { apiEnvironment } from './src/utils/config_utils';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View } from 'react-native';
import { enableScreens } from 'react-native-screens';
import { EditSNNScreen } from './src/screens/SNN/EditSNNScreen';

enableScreens();

if (apiEnvironment() === 'production') {
  Sentry.init({
    dsn: 'https://cf5193888beb40438689a98501b0f99a@sentry.io/3310336',
  });
}

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#0277BD',
    accent: 'white',
  },
};

const StackNav = createStackNavigator();

function myNavigationContainer() {
  return (
    <NavigationContainer>
      <StackNav.Navigator
        initialRouteName="LoadingScreen"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#0277BD',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}>
        <StackNav.Screen
          name="Loading"
          component={LoadingScreen}
          options={{ header: () => <View /> }}
        />
        <StackNav.Screen
          name="Welcome"
          component={WelcomeScreen} //@ts-ignore
          options={({ navigation }) => ({
            title: 'Welcome',
            headerLeft: () => <View />,
            headerRight: () => (
              <IconButton
                icon="information-outline"
                color={Colors.white}
                size={30}
                onPress={() => {
                  navigation.navigate('About');
                }}
              />
            ),
          })}
        />
        <StackNav.Screen
          name="SignUp"
          component={SignUpScreen}
          //@ts-ignore
          options={({ navigation }) => ({
            title: 'Sign Up',
            headerRight: () => (
              <IconButton
                icon="information-outline"
                color={Colors.white}
                size={30}
                onPress={() => {
                  navigation.navigate('About');
                }}
              />
            ),
          })}
        />
        <StackNav.Screen
          name="ForgotPassword"
          component={ForgotPasswordScreen}
          options={{ title: 'Reset Password' }}
        />
        <StackNav.Screen
          name="Login"
          component={LoginScreen}
          options={({ navigation }) => ({
            title: 'Login',
            headerRight: () => (
              <IconButton
                icon="information-outline"
                color={Colors.white}
                size={30}
                onPress={() => {
                  navigation.navigate('About');
                }}
              />
            ),
          })}
        />
        <StackNav.Screen name="Home" component={HomeScreen} />
        <StackNav.Screen
          name="Profile"
          component={ProfileScreen}
          options={({ navigation, route }) => ({
            title: 'Profile',
            headerLeft: () => (
              <IconButton
                icon="chevron-left"
                size={32}
                color="white"
                onPress={() => {
                  navigation.goBack();
                }}
              />
            ),
            headerRight: () => (
              <IconButton
                icon="account-settings"
                size={32}
                color="white"
                onPress={() => {
                  navigation.navigate('Settings');
                }}
              />
            ),
          })}
        />
        <StackNav.Screen
          name="CreateSNN"
          component={CreateSNNScreen}
          options={{ title: 'Create Crew Alert' }}
        />
        <StackNav.Screen
          name="EditSNN"
          component={EditSNNScreen}
          options={{ title: 'Edit Crew Alert' }}
        />
        <StackNav.Screen name="About" component={AboutScreen} />
        <StackNav.Screen
          name="Settings"
          component={SettingsScreen}
          options={({ navigation, route }) => ({
            title: 'Settings',
            headerLeft: () => (
              <IconButton
                icon="chevron-left"
                size={32}
                color="white"
                onPress={() => {
                  navigation.goBack();
                }}
              />
            ),
          })}
        />
        <StackNav.Screen
          name="Conversations"
          component={ConversationsScreen}
          options={({ navigation, route }) => ({
            title: 'Conversations',
            headerLeft: () => (
              <IconButton
                icon="chevron-left"
                size={32}
                color="white"
                onPress={() => {
                  navigation.goBack();
                }}
              />
            ),
          })}
        />
        <StackNav.Screen
          name="Chat"
          component={ChatScreen}
          options={({ navigation, route }) => ({
            title: route.params ? (route.params as any).name : '',
            headerLeft: () => (
              <IconButton
                icon="chevron-left"
                size={32}
                color="white"
                onPress={() => {
                  navigation.goBack();
                }}
              />
            ),
          })}
        />
      </StackNav.Navigator>
    </NavigationContainer>
  );
}

export const CrewSNNSStoreContext = React.createContext<CrewSNNSStore>(
  new CrewSNNSStore(),
);
export const UserStoreContext = React.createContext<UserStore>(new UserStore());
export const LocationsStoreContext = React.createContext<LocationsStore>(
  new LocationsStore(),
);
export const BoatSNNSStoreContext = React.createContext<BoatSNNSStore>(
  new BoatSNNSStore(),
);
export const ChatStoreContext = React.createContext<ChatStore>(new ChatStore());

export const App: React.FC = () => {
  return (
    <CrewSNNSStoreContext.Provider value={crewSNNSStore}>
      <UserStoreContext.Provider value={userStore}>
        <LocationsStoreContext.Provider value={locationsStore}>
          <BoatSNNSStoreContext.Provider value={boatSNNSStore}>
            <ChatStoreContext.Provider value={chatStore}>
              <PaperProvider theme={theme}>
                {myNavigationContainer()}
              </PaperProvider>
            </ChatStoreContext.Provider>
          </BoatSNNSStoreContext.Provider>
        </LocationsStoreContext.Provider>
      </UserStoreContext.Provider>
    </CrewSNNSStoreContext.Provider>
  );
};
