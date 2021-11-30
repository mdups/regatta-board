import * as React from 'react';
import { StyleSheet, Text, Alert } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { resetPassword as authResetPassword } from '../../api/authentication';
import { observer } from 'mobx-react-lite';
import { useState } from 'react';

export const ForgotPasswordScreen: React.FC = observer(() => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const resetPassword = async () => {
    if (!email) {
      showEmailNotFoundError();
      return;
    }

    const { result, error } = await authResetPassword(email, password);

    if (error) {
      showEmailNotFoundError();
    }

    if (result) {
      showSuccessMessage();
    }
  };

  const showEmailNotFoundError = () => {
    Alert.alert(
      'Error',
      'Cannot find account with the given email. If you are still unable to reset your password, please email contact@regattaboard.com.',
    );
  };

  const showSuccessMessage = () => {
    Alert.alert(
      'Success',
      'Your password has been reset. Go back to the login screen to log in to the app.',
    );
  };

  return (
    <KeyboardAwareScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      keyboardShouldPersistTaps={'handled'}>
      <Text style={styles.text}>
        Enter your account's email address and new password below
      </Text>
      <TextInput
        style={styles.nameText}
        value={email}
        label="Email Address"
        placeholder="john.smith@example.com"
        mode="flat"
        autoCapitalize="none"
        keyboardType="email-address"
        onChangeText={(v) => setEmail(v)}
      />
      <TextInput
        secureTextEntry
        style={styles.nameText}
        mode="flat"
        autoCapitalize="none"
        placeholder="New password..."
        onChangeText={(v) => setPassword(v)}
        value={password}
      />
      <Button
        mode="contained"
        onPress={() => resetPassword()}
        style={styles.button}>
        Reset Password
      </Button>
    </KeyboardAwareScrollView>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {},
  nameText: {
    fontSize: 28,
    marginTop: 18,
    height: 60,
    width: '90%',
    backgroundColor: 'white',
    alignSelf: 'center',
  },
  button: {
    marginTop: 24,
  },
});
