import { isObservable } from 'mobx';
import { observer } from 'mobx-react-lite';
import React, { useContext } from 'react';
import { StyleSheet, Text, ActivityIndicator } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { TextInput, Button } from 'react-native-paper';
import { UserStoreContext } from '../../../App';

interface Props {
  onFocus: () => void;
  email: string;
  password: string;
  onEmailChange: (email: string) => void;
  onPasswordChange: (password: string) => void;
  handleSubmit: () => void;
  submitButtonText: string;
  showSignUpText?: boolean;
  navigation: any;
  children: any;
}

export const AuthLayout: React.FC<Props> = observer((props: Props) => {
  const userStore = useContext(UserStoreContext);
  console.log('render auth layout');
  console.log('isobservable: ', isObservable(userStore.error));

  const {
    email,
    password,
    onEmailChange,
    onPasswordChange,
    handleSubmit,
    submitButtonText,
    onFocus,
    showSignUpText,
    navigation,
  } = props;

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      onFocus();
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation]);

  return (
    <KeyboardAwareScrollView
      keyboardShouldPersistTaps={'handled'}
      style={styles.container}
      contentContainerStyle={styles.contentContainer}>
      {showSignUpText && (
        <Text style={styles.textStyle}>
          Sign Up with a new account
          {'\n\n'}
          <Text style={styles.innerTextStyle}>
            You'll be able to change between a boat owner and a crew member once
            signed in.
          </Text>
        </Text>
      )}
      {!!userStore.error && (
        <Text style={{ color: 'red', textAlign: 'center' }}>
          {userStore.error.toString()}
        </Text>
      )}
      <TextInput
        style={styles.textInput}
        mode="outlined"
        autoCapitalize="none"
        placeholder="Email"
        keyboardType="email-address"
        onChangeText={(email) => onEmailChange(email)}
        value={email}
      />
      <TextInput
        secureTextEntry
        style={styles.textInput}
        mode="outlined"
        autoCapitalize="none"
        placeholder="Password"
        onChangeText={(password) => onPasswordChange(password)}
        value={password}
      />
      <Button
        onPress={() => handleSubmit()}
        mode="contained"
        style={styles.buttonStyle}>
        <Text>{submitButtonText}</Text>
      </Button>
      {!!userStore.isLoading && <ActivityIndicator style={{ margin: 18 }} />}
      {props.children}
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
  textInput: {
    height: 40,
    width: '90%',
    marginTop: 8,
  },
  buttonStyle: {
    marginTop: 20,
    marginBottom: 10,
  },
  textStyle: {
    textAlign: 'center',
    margin: 12,
  },
  innerTextStyle: {
    fontSize: 12,
    fontWeight: '300',
  },
});
