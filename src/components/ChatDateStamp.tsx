import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export interface ChatDateStampProps {
  text: string;
}

export const ChatDateStamp: React.FC<ChatDateStampProps> = (props) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{props.text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 6,
    margin: 6,
    backgroundColor: 'lightblue',
    alignSelf: 'center',
    borderRadius: 5,
  },
  text: {
    fontSize: 11,
    textAlign: 'center',
  },
});
