import React, { useContext, useEffect, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Keyboard,
  SafeAreaView,
} from 'react-native';
import { ChatInputBar } from '../../components/ChatInputBar';
import { MessageBubble } from '../../components/MessageBubble';
import { StackNavigationProp } from '@react-navigation/stack';
import { getMessageDirection } from '../../utils/chat_utils';
//@ts-ignore
import KeyboardSpacer from 'react-native-keyboard-spacer';
import { ChatDateStamp } from '../../components/ChatDateStamp';
import { ChatStoreContext, UserStoreContext } from '../../../App';
import { observer } from 'mobx-react-lite';
import { toJS } from 'mobx';

interface Props {
  navigation: StackNavigationProp<any, any>;
}

export const ChatScreen: React.FC<Props> = observer((props) => {
  //When the keyboard appears, this gets the ScrollView to move the end back "up" so the last message is visible with the keyboard up
  //Without this, whatever message is the keyboard's height from the bottom will look like the last message.
  const keyboardDidShow = (e: any) => {
    // @ts-ignore
    scrollView.current.scrollToEnd();
  };

  //When the keyboard dissapears, this gets the ScrollView to move the last message back down.
  const keyboardDidHide = (e: any) => {
    // @ts-ignore
    scrollView.current.scrollToEnd();
  };

  let scrollView = useRef<ScrollView>();
  let keyboardDidShowListener: any;
  let keyboardDidHideListener: any;

  const userStore = useContext(UserStoreContext);
  const chatStore = useContext(ChatStoreContext);

  const [inputBarText, setInputBarText] = useState('');

  props.navigation.setOptions({
    title: chatStore.currentConversation?.otherUser.name || 'Chat',
  });

  useEffect(() => {
    keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      keyboardDidShow,
    );
    keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      keyboardDidHide,
    );

    if (userStore.user) {
      chatStore.initializeCableConnection(userStore.user.id);
    }
    chatStore.markMessagesAsRead();

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  useEffect(() => {
    setTimeout(function () {
      //@ts-ignore
      scrollView.current.scrollToEnd();
    });
  });

  const sendMessage = () => {
    chatStore.sendMessage(inputBarText, userStore.user!);

    setInputBarText('');
  };

  //This event fires way too often.
  //We need to move the last message up if the input bar expands due to the user's new message exceeding the height of the box.
  //We really only need to do anything when the height of the InputBar changes, but AutogrowInput can't tell us that.
  //The real solution here is probably a fork of AutogrowInput that can provide this information.
  const onInputSizeChange = () => {
    setTimeout(function () {
      //@ts-ignore
      scrollView.current.scrollToEnd({ animated: false });
    });
  };

  const renderMessages = () => {
    const messages = chatStore.currentConversation?.messages || undefined;
    console.log(toJS(messages));

    if (!messages || messages.length === 0) {
      return <View />;
    }

    const components = [];
    let currentDate = messages[0].createdAt.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
    components.push(<ChatDateStamp text={currentDate} />);
    let i = 0;
    for (const m of messages) {
      let mDate = m.createdAt.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
      if (currentDate != mDate) {
        components.push(<ChatDateStamp text={mDate} />);
        currentDate = mDate;
      }
      components.push(
        <MessageBubble
          key={i}
          direction={getMessageDirection(m)}
          text={m.content}
          senderName={m.sender.name}
          createdAt={m.createdAt}
        />,
      );
      i++;
    }

    return components;
  };

  return (
    <SafeAreaView style={styles.outer}>
      {/* @ts-ignore */}
      <ScrollView ref={scrollView} style={styles.messages}>
        {renderMessages()}
      </ScrollView>
      <ChatInputBar
        onSendPressed={() => sendMessage()}
        onSizeChange={() => onInputSizeChange()}
        onChangeText={(text) => setInputBarText(text)}
        text={inputBarText}
      />
      <KeyboardSpacer />
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  outer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    backgroundColor: 'white',
  },
  messages: {
    flex: 1,
  },
});
