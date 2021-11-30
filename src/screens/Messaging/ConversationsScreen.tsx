import React, { useEffect } from 'react';
import { View, StyleSheet, RefreshControl, FlatList, Text } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ConversationRow } from '../../components/ConversationRow';
import { Conversation } from '../../models';
import { observer } from 'mobx-react-lite';
import { ChatStoreContext } from '../../../App';

export interface Props {
  navigation: StackNavigationProp<any, any>;
}

export const ConversationsScreen: React.FC<Props> = observer((props) => {
  const chatStore = React.useContext(ChatStoreContext);

  useEffect(() => {
    if (chatStore.shouldFetch) {
      chatStore.getConversations();
    }
    return () => {
      chatStore.cableConnection?.disconnectSocket();
    };
  }, []);

  const navigateToChat = (id: string) => {
    chatStore.setCurrentConversation(id);
    props.navigation.navigate('Chat');
  };

  const renderListItem = ({
    item,
    index,
  }: {
    item: Conversation;
    index: number;
  }) => {
    const mostRecentMessage =
      item.messages.length > 0
        ? item.messages[item.messages.length - 1].content
        : 'Tap here to send a message!';
    const mostRecentDate =
      item.messages.length > 0
        ? item.messages[item.messages.length - 1].createdAt
        : undefined;
    return (
      <ConversationRow
        key={index}
        id={item.id}
        name={item.otherUser.name}
        mostRecentMessage={mostRecentMessage}
        date={mostRecentDate}
        onPress={(id: string) => navigateToChat(id)}
      />
    );
  };

  if (chatStore.conversations?.length === 0) {
    return (
      <View style={styles.containerNoMessages}>
        <Text style={styles.noMessagesText}>No Messages Yet!</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={chatStore.conversations!}
        renderItem={({ item, index }: { item: Conversation; index: number }) =>
          renderListItem({ item, index })
        }
        refreshControl={
          <RefreshControl
            refreshing={chatStore.isRefreshing}
            onRefresh={() => chatStore.getConversations(true)}
          />
        }
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerNoMessages: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noMessagesText: {
    fontSize: 24,
    textAlign: 'center',
  },
});
