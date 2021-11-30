import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button } from 'react-native-paper';
import { StackNavigationProp } from '@react-navigation/stack';

interface Props {
  navigation: StackNavigationProp<any, any>;
}

export const WelcomeScreen: React.FC<Props> = (props) => {
  const { container, buttonContainer, buttonStyle } = styles;
  return (
    <View style={container}>
      <View style={buttonContainer}>
        <Button
          mode="contained"
          style={buttonStyle}
          onPress={() =>
            props.navigation.navigate('SignUp', {
              type: 'crew',
            })
          }>
          Sign up
        </Button>
        <Button
          onPress={() => props.navigation.navigate('Login')}
          style={buttonStyle}>
          Already have an account? Login
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  buttonStyle: {
    marginBottom: 20,
  },
});
