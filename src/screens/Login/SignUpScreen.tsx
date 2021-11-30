import React, { useContext, useState } from 'react';
import { Text, Keyboard } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Button } from 'react-native-paper';
import { AuthLayout } from './AuthLayout';
import { observer } from 'mobx-react-lite';
import { UserStoreContext } from '../../../App';

interface Props {
  navigation: StackNavigationProp<any, any>;
}

export const SignUpScreen: React.FC<Props> = observer((props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const userStore = useContext(UserStoreContext);

  const onFocus = () => {
    userStore.clearError();
  };

  const onSuccessfulSignUp = async () => {
    userStore.getCurrentUser().then(async () => {
      if (userStore.user) {
        props.navigation.replace('Home', {
          type: userStore.user!.type,
        });
      }
    });
  };

  const handleSignUp = () => {
    Keyboard.dismiss();
    userStore.handleSignUp(email, password, () => onSuccessfulSignUp());
  };

  return (
    <AuthLayout
      onFocus={() => onFocus()}
      email={email}
      password={password}
      onEmailChange={(email) => setEmail(email)}
      onPasswordChange={(password) => setPassword(password)}
      handleSubmit={() => handleSignUp()}
      submitButtonText="Sign Up"
      showSignUpText
      navigation={props.navigation}>
      <Button onPress={() => props.navigation.navigate('Login')}>
        <Text>Already have an account? Login</Text>
      </Button>
    </AuthLayout>
  );
});
