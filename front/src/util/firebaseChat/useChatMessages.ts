import {ChatMessage} from '@data';
import {
  collection,
  doc,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
} from '@react-native-firebase/firestore';
import {useEffect, useState} from 'react';
import {isDev} from './const';

const chatPath = isDev() ? 'chats_dev' : 'chats';
export const useChatMessages = (
  productId: string,
  senderId: string,
  receiverId: string,
) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!productId || !senderId || !receiverId) {
      return;
    }

    const db = getFirestore();
    const chatId = [productId, senderId, receiverId].sort().join('_');
    const messagesRef = collection(doc(db, chatPath, chatId), 'messages');

    const q = query(messagesRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, snapshot => {
      const loadedMessages: ChatMessage[] = snapshot.docs.map(item => {
        const data = item.data();
        return {
          _id: item.id,
          text: data.text,
          createdAt: data.createdAt?.toDate?.() ?? new Date(),
          user: data.user,
        };
      });
      setMessages(loadedMessages);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [productId, senderId, receiverId]);

  return {messages, loading};
};
