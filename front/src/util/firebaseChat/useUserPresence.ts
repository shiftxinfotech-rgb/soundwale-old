import {doc, getFirestore, onSnapshot} from '@react-native-firebase/firestore';
import {useEffect, useState} from 'react';
import {isDev} from './const';

const path = isDev() ? 'users_dev' : 'users';

export const useUserPresence = (userId: string) => {
  const [online, setOnline] = useState<boolean>(false);
  const [lastSeen, setLastSeen] = useState<Date | null>(null);

  useEffect(() => {
    if (!userId) {
      return;
    }
    const db = getFirestore();
    const userDocRef = doc(db, path, userId);

    const unsubscribe = onSnapshot(userDocRef, snapshot => {
      if (!snapshot.exists()) {
        setOnline(false);
        setLastSeen(null);
        return;
      }

      const data = snapshot.data();
      if (data) {
        setOnline(data.state === 'online');
        setLastSeen(data.lastSeen?.toDate?.() ?? null);
      }
    });

    return () => unsubscribe();
  }, [userId]);

  return {online, lastSeen};
};
