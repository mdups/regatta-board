import AsyncStorage from '@react-native-community/async-storage'
import { API_WS_BASE } from '../utils/config'
//@ts-ignore
import ActionCable from 'react-native-actioncable'

export class CableConnection {
  cable: any
  connection: any

  constructor(access_token: string, conversationId: string, senderId: string, onMessageReceived: Function) {
    var wsUrl = API_WS_BASE + 'cable'
    wsUrl += '?access_token=' + access_token

    this.cable = ActionCable.createConsumer(wsUrl)
    this.connection = this.createConnection(conversationId, senderId, onMessageReceived)
  }

  sendMessage(message: string) {
    this.connection.speak(message)
  }

  disconnectSocket() {
    this.cable.disconnect()
  }

  private createConnection(conversationId: string, senderId: string, onMessageReceived: Function) {
    return this.cable.subscriptions.create({channel: 'ConversationChannel', conversation_id: conversationId, sender: senderId}, {
      connected: function() {
        console.log('connected to ConversationChannel. Room code: ' + conversationId + '.')
      },
      disconnected: function() {},
      received: function(data: any) {
        if (data.participants.indexOf(senderId) != -1) {
          return onMessageReceived(data, senderId)
        }
      },
      speak: function(message: string) {
        console.log('speak')
        return this.perform('speak', {
          conversation_id: conversationId,
          message: message,
          sender_id: senderId
        })
      }
    })
  }
}
