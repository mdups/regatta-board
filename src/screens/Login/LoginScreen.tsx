import React, { useContext, useState } from 'react';
import { StyleSheet, Text, Keyboard } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Button } from 'react-native-paper';
import { AuthLayout } from './AuthLayout';
import { observer } from 'mobx-react-lite';
import { UserStoreContext } from '../../../App';
import { isObservable, toJS } from 'mobx';

interface Props {
  navigation: StackNavigationProp<any, any>;
}

export const LoginScreen: React.FC<Props> = observer((props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const userStore = useContext(UserStoreContext);
  console.log('userStore', toJS(userStore));
  console.log('isobservable login screen: ', isObservable(userStore));

  const onFocus = () => {
    userStore.clearError();
  };

  const handleSuccessfulLogin = async () => {
    userStore.getCurrentUser().then(async () => {
      if (userStore.user) {
        props.navigation.replace('Home', {
          type: userStore.user.type,
        });
      } else {
        userStore.error = 'Error fetching user data';
      }
    });
  };

  const handleLogin = () => {
    Keyboard.dismiss();
    userStore.handleLogin(email, password, () => handleSuccessfulLogin());
  };

  return (
    <AuthLayout
      onFocus={() => onFocus()}
      email={email}
      password={password}
      onEmailChange={(email) => setEmail(email)}
      onPasswordChange={(password) => setPassword(password)}
      handleSubmit={() => handleLogin()}
      submitButtonText="Login"
      navigation={props.navigation}>
      <Button onPress={() => props.navigation.navigate('SignUp')}>
        <Text>Don't have an account? Sign Up</Text>
      </Button>
      <Button
        onPress={() => props.navigation.navigate('ForgotPassword')}
        color="grey"
        mode="text"
        compact
        labelStyle={styles.forgotPasswordButton}>
        <Text>Forgot password?</Text>
      </Button>
    </AuthLayout>
  );
});

const styles = StyleSheet.create({
  forgotPasswordButton: {
    fontSize: 12,
    marginTop: 12,
  },
});
