import { ChatMessage } from '../models'

export function getMessageDirection(message: ChatMessage): 'left' | 'right' {
  return message.sentByMe ? 'right' : 'left'
}

export function getInitialsFromName(name: string): string {
  return name.split(" ").reduce((acc, nm) => acc + nm[0], '')
}
