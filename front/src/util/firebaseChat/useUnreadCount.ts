import {
  collection,
  FirebaseFirestoreTypes,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
  where,
} from '@react-native-firebase/firestore';
import {useEffect, useState} from 'react';
import {isDev} from './const';

const chatPath = isDev() ? 'chats_dev' : 'chats';

export const useUnreadChatCount = (currentUserId: string) => {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!currentUserId) {
      return;
    }

    const db = getFirestore();
    const q = query(
      collection(db, chatPath),
      where('users', 'array-contains', currentUserId),
      orderBy('lastMessageTime', 'desc'),
    );

    const unsubscribe = onSnapshot(
      q,
      snapshot => {
        if (!snapshot || snapshot.empty) {
          setUnreadCount(0);
          return;
        }
        let count = 0;
        snapshot.forEach(doc => {
          const data = doc.data() as FirebaseFirestoreTypes.DocumentData;
          const lastMessageTime = data.lastMessageTime?.toMillis?.() ?? 0;
          const userReadTime =
            data.readReceipts?.[String(currentUserId)]?.toMillis?.() ?? 0;
          const lastMessageBy = data.lastMessageBy;
          if (String(lastMessageBy) === String(currentUserId)) {
            return;
          }
          const isUnread = lastMessageTime > userReadTime;
          if (isUnread) {
            count += 1;
          }
        });
        setUnreadCount(count);
      },
      error => {
        console.log('Error', error);
      },
    );

    return () => unsubscribe();
  }, [currentUserId]);

  return unreadCount;
};
