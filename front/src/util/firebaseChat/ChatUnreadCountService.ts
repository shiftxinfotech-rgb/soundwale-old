import {
  collection,
  FirebaseFirestoreTypes,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
  where,
} from '@react-native-firebase/firestore';
import {isDev} from './const';

const chatPath = isDev() ? 'chats_dev' : 'chats';

let currentUnreadCount = 0;
let currentUserId: string | null = null;
let globalListener: (() => void) | null = null;
const subscribers = new Set<(count: number) => void>();

const updateSubscribers = (count: number) => {
  currentUnreadCount = count;
  subscribers.forEach(callback => callback(count));
};

export class ChatUnreadCountService {
  static startRealtimeListener(userId: string) {
    if (!userId) {
      updateSubscribers(0);
      return;
    }

    // If already listening for the same user, do nothing
    if (currentUserId === userId && globalListener) {
      console.log(
        '🔄 ChatUnreadCountService: Already listening for user',
        userId,
      );
      return;
    }

    // Clean up existing listener
    if (globalListener) {
      console.log(
        '🔄 ChatUnreadCountService: Cleaning up existing listener for user',
        currentUserId,
      );
      globalListener();
      globalListener = null;
    }

    console.log(
      '🔄 ChatUnreadCountService: Starting real-time listener for user',
      userId,
    );
    currentUserId = userId;

    const db = getFirestore();
    const q = query(
      collection(db, chatPath),
      where('users', 'array-contains', userId),
      orderBy('lastMessageTime', 'desc'),
    );

    globalListener = onSnapshot(
      q,
      snapshot => {
        if (!snapshot || snapshot.empty) {
          console.log('📊 ChatUnreadCountService: No unread messages');
          updateSubscribers(0);
          return;
        }
        let count = 0;
        snapshot.forEach(doc => {
          const data = doc.data() as FirebaseFirestoreTypes.DocumentData;
          const lastMessageTime = data.lastMessageTime?.toMillis?.() ?? 0;
          const userReadTime =
            data.readReceipts?.[String(userId)]?.toMillis?.() ?? 0;
          const lastMessageBy = data.lastMessageBy;

          if (String(lastMessageBy) === String(userId)) {
            return;
          }

          const isUnread = lastMessageTime > userReadTime;
          if (isUnread) {
            count += 1;
          }
        });
        console.log(
          '📊 ChatUnreadCountService: Unread count updated to',
          count,
        );
        updateSubscribers(count);
      },
      error => {
        console.log(
          '❌ ChatUnreadCountService: Error in real-time listener:',
          error,
        );
        // On error, set count to 0 to avoid showing stale data
        updateSubscribers(0);
      },
    );
  }

  static stopRealtimeListener() {
    if (globalListener) {
      console.log(
        '🔄 ChatUnreadCountService: Stopping real-time listener for user',
        currentUserId,
      );
      globalListener();
      globalListener = null;
    }
    currentUserId = null;
  }

  static subscribe(callback: (count: number) => void) {
    console.log(
      '📡 ChatUnreadCountService: New subscriber added, total subscribers:',
      subscribers.size + 1,
    );
    subscribers.add(callback);
    // Return current value immediately
    callback(currentUnreadCount);

    return () => {
      subscribers.delete(callback);
      console.log(
        '📡 ChatUnreadCountService: Subscriber removed, total subscribers:',
        subscribers.size,
      );
    };
  }

  static getCurrentCount(): number {
    return currentUnreadCount;
  }

  static isListening(): boolean {
    return globalListener !== null;
  }

  static getCurrentUserId(): string | null {
    return currentUserId;
  }

  static reset() {
    this.stopRealtimeListener();
    currentUnreadCount = 0;
    subscribers.clear();
  }
}
