import {AuthData, ChatPreview, User} from '@data';
import {getAuth, signInAnonymously} from '@react-native-firebase/auth';
import {get, getDatabase, ref, update} from '@react-native-firebase/database';
import {
  collection,
  deleteDoc,
  deleteField,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  increment,
  limit,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  startAfter,
  updateDoc,
  where,
} from '@react-native-firebase/firestore';
import {IMessage} from 'react-native-gifted-chat';
import {isDev} from './const';

const firestore = getFirestore();
const database = getDatabase();

const rdbPath = isDev() ? 'status_dev' : 'status';
const chatPath = isDev() ? 'chats_dev' : 'chats';
const usersPath = isDev() ? 'users_dev' : 'users';

export class ChatHelper {
  static async createChat(productId: string, receiver: User, sender: User) {
    const chatId = [productId, sender.id, receiver.id].sort().join('_');
    const chatRef = doc(firestore, chatPath, chatId);
    const existing = await chatRef.get();

    if (existing.exists()) {
      const existingData = existing.data()! as ChatPreview;
      return {
        ...existingData,
        userInfo: {sender, receiver},
      };
    }

    const opponentRef = doc(firestore, usersPath, receiver.id.toString());
    const opponentSnap = await getDoc(opponentRef);
    if (!opponentSnap.exists()) {
      await setDoc(opponentRef, {
        name: receiver.name ?? 'Unknown',
        avatar: receiver.avatar ?? '',
        phone: receiver.phone ?? '',
        state: 'offline',
        lastSeen: null,
        createdAt: serverTimestamp(),
      });
    }

    const chatObject = {
      _id: chatId,
      users: [String(sender.id), String(receiver.id)],
      threadId: chatId,
      productId: productId,
      lastMessageTime: serverTimestamp(),
      createdAt: serverTimestamp(),
      readReceipts: {
        [String(sender.id)]: serverTimestamp(),
        [String(receiver.id)]: null,
      },
    };
    await chatRef.set(chatObject);
    return {
      ...chatObject,
      lastMessageTime: new Date().getTime(),
      createdAt: new Date().getTime(),
      lastMessage: '',
      userInfo: {sender, receiver},
    } as ChatPreview;
  }

  static async sendNewMessage(chatId: string, message: IMessage) {
    const chatDocRef = doc(firestore, chatPath, chatId);
    const messageRef = doc(
      collection(chatDocRef, 'messages'),
      message._id.toString(),
    );
    await setDoc(messageRef, {
      _id: message._id,
      text: message.text,
      user: message.user,
      createdAt: serverTimestamp(),
    });
    await updateDoc(chatDocRef, {
      lastMessage: message.text,
      lastMessageTime: serverTimestamp(),
      lastMessageBy: message.user._id,
    });
  }

  static async setPresence(userId: string) {
    if (!userId) {
      return;
    }

    const userStatusRTDB = ref(database, `/${rdbPath}/${userId}`);
    const userStatusFS = doc(firestore, usersPath, userId);

    const isOffline = {
      state: 'offline',
      lastSeen: serverTimestamp(),
    };

    const isOnline = {
      state: 'online',
      lastSeen: serverTimestamp(),
    };

    const connectedRef = ref(database, '.info/connected');
    connectedRef.on('value', snapshot => {
      if (snapshot.val() === false) {
        return;
      }

      userStatusRTDB
        .onDisconnect()
        .set(isOffline)
        .then(() => {
          userStatusRTDB.set(isOnline);
          updateDoc(userStatusFS, isOnline);
        });
    });
  }

  static async createUserProfile(user: AuthData) {
    if (!user?.id) {
      return;
    }
    try {
      const userRef = doc(firestore, usersPath, user.id.toString());
      await setDoc(
        userRef,
        {
          name: user.name,
          phone: user.mobile_number ?? '',
          email: user.email ?? '',
          avatar: user.image_url ?? '',
          state: 'offline',
          lastSeen: null,
          createdAt: serverTimestamp(),
        },
        {mergeFields: ['name', 'phone', 'email', 'avatar']},
      );
    } catch (error) {}
  }

  static async markChatAsRead(chatId: string, userId: string) {
    await updateDoc(doc(firestore, chatPath, chatId), {
      [`readReceipts.${String(userId)}`]: serverTimestamp(),
    });
  }

  static async logoutUser() {
    const auth = getAuth();
    await auth.signOut();
  }

  static async signInOrCreateUser() {
    try {
      const auth = getAuth();
      const userCredential = await signInAnonymously(auth);
      return userCredential.user!;
    } catch (error) {
      console.error('❌ Failed to sign in:', error);
      return null;
    }
  }

  static async deleteChatForUser(chatId: string, userId: string) {
    const chatRef = doc(firestore, chatPath, chatId);
    await updateDoc(chatRef, {
      [`deletedFor.${userId}`]: serverTimestamp(),
    });
  }

  static async restoreChatIfDeleted(chatId: string, userId: string) {
    const chatRef = doc(firestore, chatPath, chatId);
    await updateDoc(chatRef, {
      [`deletedFor.${userId}`]: deleteField(),
    });
  }

  static async deleteChat(userId: string) {
    let lastDoc: any = null;
    console.log('deleteChat', userId);
    while (true) {
      const querySnapshot = query(
        collection(firestore, chatPath),
        where('users', 'array-contains', userId),
        orderBy('lastMessageTime', 'desc'),
        ...(lastDoc ? [startAfter(lastDoc)] : []),
        limit(100),
      );

      const snapshot = await getDocs(querySnapshot);
      if (snapshot.empty) {
        break;
      }

      // Delete messages subcollections first, then chat documents
      const deletePromises = snapshot.docs.map(async (docSnap: any) => {
        const chatId = docSnap.id;

        // Delete all messages in the subcollection
        const messagesRef = collection(
          doc(firestore, chatPath, chatId),
          'messages',
        );
        const messagesSnapshot = await getDocs(messagesRef);

        const messageDeletePromises = messagesSnapshot.docs.map(
          (messageDoc: any) => deleteDoc(messageDoc.ref),
        );

        // Wait for all messages to be deleted
        await Promise.all(messageDeletePromises);

        // Then delete the chat document
        return deleteDoc(doc(firestore, chatPath, chatId));
      });

      await Promise.all(deletePromises);

      lastDoc = snapshot.docs[snapshot.docs.length - 1];
      await new Promise(res => setTimeout(res, 200));
    }

    // Delete user profile
    const opponentRef = doc(firestore, usersPath, userId);
    await deleteDoc(opponentRef);
  }

  static async makeChatActive(chatId: string, userId: string) {
    const db = getDatabase();
    const rtdbRef = ref(db, `/${rdbPath}/${userId}`);
    update(rtdbRef, {
      activeChatWithUid: chatId,
    });
  }

  static async makeChatInactive(userId: string) {
    const db = getDatabase();
    const rtdbRef = ref(db, `/${rdbPath}/${userId}`);
    update(rtdbRef, {
      activeChatWithUid: null,
    });
  }

  static async updateUnreadCount(chatId: string, receiverId: string) {
    const chatDocRef = doc(firestore, chatPath, chatId);
    await updateDoc(chatDocRef, {
      [`unreadCount.${receiverId}`]: increment(1),
      lastMessageTime: serverTimestamp(),
    });
  }

  static async resetUnread(chatId: string, receiverId: string) {
    const chatDocRef = doc(firestore, chatPath, chatId);
    await updateDoc(chatDocRef, {
      [`unreadCount.${receiverId}`]: 0,
    });
  }

  static async getActiveChatID(userId: string) {
    const db = getDatabase();
    const rtdbRef = ref(db, `/${rdbPath}/${userId}/activeChatWithUid`);
    const snapshot = await get(rtdbRef);
    return snapshot.val();
  }
}
