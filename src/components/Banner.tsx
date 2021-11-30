import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export interface BannerProps {
  text: string;
}

export const Banner: React.FC<BannerProps> = (props) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{props.text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'lightblue',
    padding: 6,
  },
  text: {
    fontSize: 12,
    textAlign: 'center',
  },
});
