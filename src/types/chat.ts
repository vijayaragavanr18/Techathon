export interface Message {
  role: 'user' | 'bot';
  text: string;
  timestamp?: Date;
  sentiment?: 'urgent' | 'concerned' | 'neutral' | 'positive';
}

export interface ChatState {
  messages: Message[];
  isTyping: boolean;
  isSpeaking: boolean;
  isListening: boolean;
} 