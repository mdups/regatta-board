import React from 'react';
import { View, StyleSheet, Text, Pressable } from 'react-native';
import { UserAvatar } from './UserAvatar';
import { timeToString } from '../utils/datetime_utils';
import Clipboard from '@react-native-clipboard/clipboard';
import Toast from 'react-native-simple-toast';

interface Props {
  direction: 'left' | 'right';
  text: string;
  senderName: string;
  createdAt: Date;
}

export const MessageBubble: React.FC<Props> = (props) => {
  const onPress = () => {
    Clipboard.setString(props.text);
    Toast.show('Message copied to clipboard');
  };

  const renderLeftMessage = () => {
    const bubbleStyles = [styles.messageBubble, styles.messageBubbleLeft];
    const bubbleTextStyle = styles.messageBubbleTextLeft;

    return (
      <Pressable
        onPress={onPress}
        style={{
          flexDirection: 'column',
          marginRight: 48 + 30,
          marginLeft: 8,
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            flex: 1,
            justifyContent: 'flex-start',
          }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <UserAvatar name={props.senderName} size={30} />
            <View style={bubbleStyles}>
              <Text style={bubbleTextStyle}>{props.text}</Text>
            </View>
          </View>
        </View>
        <Text style={{ textAlign: 'left', marginLeft: 10, fontSize: 10 }}>
          {timeToString(props.createdAt, true)}
        </Text>
      </Pressable>
    );
  };

  const renderRightMessage = () => {
    const bubbleStyles = [styles.messageBubble, styles.messageBubbleRight];
    const bubbleTextStyle = styles.messageBubbleTextRight;

    return (
      <Pressable
        onPress={onPress}
        style={{ flexDirection: 'column', marginRight: 8, marginLeft: 48 }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            flex: 1,
            justifyContent: 'flex-end',
          }}>
          <View style={bubbleStyles}>
            <Text style={bubbleTextStyle}>{props.text}</Text>
          </View>
        </View>
        <Text style={{ textAlign: 'right', marginRight: 10, fontSize: 10 }}>
          {timeToString(props.createdAt, true)}
        </Text>
      </Pressable>
    );
  };

  if (props.direction === 'left') {
    return renderLeftMessage();
  }
  return renderRightMessage();
};

const styles = StyleSheet.create({
  messageBubble: {
    borderRadius: 6,
    marginVertical: 8,
    marginRight: 10,
    marginLeft: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    flexDirection: 'row',
  },
  messageBubbleLeft: {
    backgroundColor: '#d5d8d4',
  },
  messageBubbleTextLeft: {
    color: 'black',
    fontSize: 18,
  },
  messageBubbleRight: {
    backgroundColor: '#0277BD',
  },
  messageBubbleTextRight: {
    color: 'white',
    fontSize: 18,
  },
});
