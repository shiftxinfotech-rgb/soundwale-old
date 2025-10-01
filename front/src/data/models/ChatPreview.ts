import {User} from './User';

export interface ChatPreview {
  _id: string;
  users: string[];
  userInfo: {sender: User; receiver: User};
  threadId: string;
  productId: string;
  lastMessage: string;
  lastMessageTime: number;
  createdAt: number;
  isUnread: boolean;
  unreadCount: number;
  readReceipts: {
    [key: string]: number | null;
  };
}
