import { runInAction, makeAutoObservable } from 'mobx';
import { enableLogging } from 'mobx-logger';
import { Conversation, IUserData, GroupedChatMessages } from '../models';
import {
  getConversations,
  createConversation,
  markMessagesAsRead,
} from '../api/chat';
import { CableConnection } from '../api/chat_connection';
import AsyncStorage from '@react-native-community/async-storage';
import { isToday, isYesterday } from '../utils/datetime_utils';

export class ChatStore {
  isLoading: boolean = false;
  isRefreshing: boolean = false;
  error: string = '';
  conversations?: Conversation[] = undefined;
  currentConversationId?: string = undefined;
  cableConnection?: CableConnection = undefined;

  constructor() {
    makeAutoObservable(this);
  }

  reset = () => {
    this.isLoading = false;
    this.isRefreshing = false;
    this.error = '';
    this.conversations = undefined;
    this.currentConversationId = undefined;
    this.cableConnection = undefined;
  };

  initializeCableConnection = async (senderId: string) => {
    if (this.cableConnection) {
      this.cableConnection.disconnectSocket();
    }
    if (!this.currentConversationId) {
      console.error('no current conversation');
    }
    const access_token = await AsyncStorage.getItem('user_access_token');
    this.cableConnection = new CableConnection(
      access_token!,
      this.currentConversationId!,
      senderId,
      this.messageReceived,
    );
  };

  get shouldFetch(): boolean {
    return !this.isLoading && this.conversations == undefined;
  }

  get groupedMessages(): GroupedChatMessages {
    const messages = this.currentConversation?.messages || [];

    const grouped: GroupedChatMessages = {};
    for (const m of messages) {
      if (isToday(m.createdAt)) {
        grouped['Today'] = [...grouped['Today'], m];
      } else if (isYesterday(m.createdAt)) {
        grouped['Yesterday'] = [...grouped['Yesterday'], m];
      } else {
        const dateStr = m.createdAt.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        });
        grouped[dateStr] = [...grouped[dateStr], m];
      }
    }
    return grouped;
  }

  numberOfUnReadMessages(user: IUserData): number {
    if (!this.conversations) {
      return 0;
    }
    const messages = this.conversations
      .map((c) => c.messages)
      .reduce((a, b) => a.concat(b), []);
    return messages.filter((m) => m.sender.id != user.id && !m.read).length;
  }

  getConversations = async (
    fromRefresh: boolean = false,
    bearerToken?: string,
  ) => {
    this.isLoading = true;
    if (fromRefresh) {
      this.isRefreshing = true;
    }
    this.error = '';
    const { result, error } = await getConversations(bearerToken);
    if (error) {
      runInAction(() => {
        this.isLoading = false;
        if (fromRefresh) {
          this.isRefreshing = false;
        }
        this.error = error;
      });
    } else if (result) {
      runInAction(() => {
        this.isLoading = false;
        if (fromRefresh) {
          this.isRefreshing = false;
        }
        this.conversations = result;
        this.error = '';
      });
    } else {
      runInAction(() => {
        this.isLoading = false;
        if (fromRefresh) {
          this.isRefreshing = false;
        }
        this.error = 'Error fetching conversations. Please try again.';
      });
    }
  };

  findOrCreateConversation = async (
    otherUserId: string,
    bearerToken?: string,
  ) => {
    if (!this.conversations) {
      await this.getConversations(false, bearerToken);
    }

    const conv = this.conversations?.find(
      (c) => c.otherUser.id === otherUserId,
    );

    if (!conv) {
      await this.createConversation(otherUserId, bearerToken);
    } else {
      this.setCurrentConversation(conv.id);
    }
  };

  createConversation = async (otherUserId: string, bearerToken?: string) => {
    this.isLoading = true;
    this.error = '';
    const { result, error } = await createConversation(
      otherUserId,
      bearerToken,
    );
    if (error) {
      runInAction(() => {
        this.isLoading = false;
        this.error = error;
      });
    } else if (result) {
      runInAction(() => {
        this.isLoading = false;
        this.conversations = [...(this.conversations || []), result];
        this.setCurrentConversation(result.id);
        this.error = '';
      });
    } else {
      runInAction(() => {
        this.isLoading = false;
        this.error = 'Error fetching conversations. Please try again.';
      });
    }
  };

  setCurrentConversation = (id: string) => {
    this.currentConversationId = id;
  };

  get currentConversation(): Conversation | undefined {
    return (
      this.conversations?.find((c) => c.id === this.currentConversationId) ||
      undefined
    );
  }

  sendMessage = (message: string, user: IUserData) => {
    const newMessage = {
      content: message,
      createdAt: new Date(),
      sender: user,
      sentByMe: true,
      read: false,
    };

    this.conversations!.find(
      (c) => c.id === this.currentConversationId!,
    )!.messages.push(newMessage);
    this.cableConnection!.sendMessage(message);
  };

  messageReceived = (data: any, senderId: string) => {
    if (data.sender.id === senderId) {
      return;
    }

    const newMessage = {
      content: data.content,
      createdAt: new Date(),
      sender: data.sender,
      sentByMe: false,
      read: false,
    };

    this.conversations!.find(
      (c) => c.id === this.currentConversationId!,
    )!.messages.push(newMessage);
  };

  markMessagesAsRead = async () => {
    if (!this.currentConversationId) return;

    this.error = '';

    for (const c of this.conversations || []) {
      for (const m of c.messages) {
        if (!m.sentByMe && !m.read) {
          m.read = true;
        }
      }
    }

    const { result, error } = await markMessagesAsRead(
      this.currentConversationId,
    );
    if (error) {
      runInAction(() => {
        this.error = error;
      });
    } else if (result) {
      runInAction(() => {
        const index = this.conversations!.findIndex(
          (c) => c.id === this.currentConversationId!,
        );
        this.conversations![index] = result;
        this.error = '';
      });
    } else {
      runInAction(() => {
        this.error = 'Error marking messages as read. Please try again.';
      });
    }
  };
}

export const chatStore = new ChatStore();
