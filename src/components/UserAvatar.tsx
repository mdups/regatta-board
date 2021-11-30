import * as React from 'react';
import { Avatar } from 'react-native-paper';
import { StyleSheet } from 'react-native';
import { getInitialsFromName } from '../utils/chat_utils';

export interface Props {
  name: string;
  size?: number;
}

export const UserAvatar: React.FC<Props> = (props) => {
  return (
    <Avatar.Text
      style={styles.avatar}
      size={props.size || 48}
      label={getInitialsFromName(props.name)}
      color="white"
    />
  );
};

const styles = StyleSheet.create({
  avatar: {
    backgroundColor: 'grey',
  },
});
