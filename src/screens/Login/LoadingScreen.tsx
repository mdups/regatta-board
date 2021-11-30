import React, { useContext, useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-community/async-storage';
import { StackActions } from '@react-navigation/native';
import { UserStoreContext } from '../../../App';
import { observer } from 'mobx-react-lite';

interface Props {
  navigation: StackNavigationProp<any, any>;
}

export const LoadingScreen: React.FC<Props> = observer((props) => {
  const userStore = useContext(UserStoreContext);

  useEffect(() => {
    messaging().onNotificationOpenedApp((remoteMessage) => {
      handleOpenedByNotification(remoteMessage);
    });

    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        handleOpenedByNotification(remoteMessage);
      });

    checkForPermissions();
  }, []);

  const handleOpenedByNotification = async (remoteMessage: any) => {
    if (remoteMessage && remoteMessage.data) {
      console.log(
        'Notification caused app to open from background state:',
        remoteMessage.notification,
      );
      const conversationId = remoteMessage.data.conversation_id;
      if (conversationId) {
        const accessToken = await AsyncStorage.getItem('user_access_token');
        if (accessToken) {
          userStore.getCurrentUser(accessToken);
        }

        const pushHome = StackActions.replace('Home');
        const pushConversations = StackActions.replace('Conversations');
        props.navigation.dispatch(pushHome);
        props.navigation.dispatch(pushConversations);
      } else {
        console.log('no conversation id');
      }
    }
  };

  const checkForPermissions = async () => {
    await messaging().registerDeviceForRemoteMessages();
    const enabled = await messaging().hasPermission();
    if (
      enabled === messaging.AuthorizationStatus.AUTHORIZED ||
      enabled === messaging.AuthorizationStatus.PROVISIONAL
    ) {
      goToNextScreen();
    } else {
      requestPermissions();
    }
  };

  const requestPermissions = async () => {
    try {
      await messaging().requestPermission();
      goToNextScreen();
    } catch (error) {
      goToNextScreen();
    }
  };

  const goToNextScreen = async () => {
    const accessToken = await AsyncStorage.getItem('user_access_token');
    if (accessToken) {
      await userStore.getCurrentUser(accessToken);
      if (userStore.user) {
        if (userStore.shouldSetPushToken) {
          await userStore.setPushToken();
        }
        props.navigation.replace('Home', {
          type: userStore.user.type,
        });
      } else {
        props.navigation.replace('Welcome');
      }
    } else {
      props.navigation.replace('Welcome');
    }
  };

  return (
    <View style={styles.container}>
      <Text>Loading</Text>
      <ActivityIndicator size="large" />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
