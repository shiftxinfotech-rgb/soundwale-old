import {ChatPreview, User} from '@data';
import {useUserInfo} from '@hooks';
import {
  collection,
  doc,
  getDoc,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
  where,
} from '@react-native-firebase/firestore';
import {useEffect, useState} from 'react';
import {isDev} from './const';

const chatPath = isDev() ? 'chats_dev' : 'chats';
const userPath = isDev() ? 'users_dev' : 'users';

export const useUserChats = (currentUserId: string) => {
  const [chats, setChats] = useState<ChatPreview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const senderInfo = useUserInfo();

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
      async snapshot => {
        if (snapshot.empty) {
          setChats([]);
          setLoading(false);
          return;
        }

        const chatList: ChatPreview[] = await Promise.all(
          snapshot.docs
            .filter(docSnap => !docSnap.data().deletedFor?.[currentUserId])
            .map(async docSnap => {
              const data = docSnap.data();

              const opponentId = data.users.find(
                (uid: string) => uid !== currentUserId,
              );

              const unreadCount = data.unreadCount?.[currentUserId] ?? 0;
              let receiver: User = {
                id: String(opponentId),
                name: '',
                avatar: '',
                phone: '',
                isOnline: false,
              };
              let sender: User = {
                id: String(currentUserId),
                name: senderInfo?.name ?? '',
                avatar: senderInfo?.image_url ?? '',
                phone: senderInfo?.mobile_number ?? '',
                isOnline: true,
              };

              try {
                const opponentRef = doc(db, userPath, String(opponentId));
                const opponentSnap = await getDoc(opponentRef);
                if (opponentSnap.exists()) {
                  const u = opponentSnap.data() as User;
                  receiver = {
                    id: String(opponentId),
                    name: u.name ?? 'Unknown',
                    avatar: u.avatar ?? '',
                    phone: u.phone ?? '',
                    isOnline: u.isOnline,
                    lastSeen: u.lastSeen,
                  };
                }
              } catch (err) {}

              const lastMessageTime = data.lastMessageTime?.toMillis?.() ?? 0;
              const userReadTime =
                data.readReceipts?.[String(currentUserId)]?.toMillis?.() ?? 0;
              const lastMessageBy = data.lastMessageBy;

              const isUnread =
                !!lastMessageBy &&
                String(lastMessageBy) !== String(currentUserId) &&
                lastMessageTime > userReadTime;
              return {
                _id: data._id,
                users: data.users,
                isTyping: data.isTyping,
                userInfo: {sender, receiver},
                threadId: data.threadId,
                productId: data.productId,
                lastMessage: data.lastMessage,
                lastMessageTime: data.lastMessageTime,
                createdAt: data.createdAt,
                readReceipts: data.readReceipts,
                unreadCount: unreadCount,
                isUnread,
              };
            }),
        );

        setChats(chatList);
        setLoading(false);
      },
      err => {
        setError(err);
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, [
    currentUserId,
    senderInfo?.image_url,
    senderInfo?.mobile_number,
    senderInfo?.name,
  ]);

  return {chats, loading, error};
};
