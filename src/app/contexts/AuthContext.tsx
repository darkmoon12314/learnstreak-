import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { ref, set, get, update } from 'firebase/database';
import { auth, database } from '../config/firebase';

const LOCAL_PROFILE_KEY = 'learnstreak-user-profile';
const LOCAL_AUTH_USERS_KEY = 'learnstreak-local-auth-users';

type LocalAuthUser = {
  uid: string;
  email: string;
  password: string;
  name: string;
};

const createDefaultUserData = (uid: string, email: string, name: string, lastLoginDate?: string): UserData => ({
  uid,
  email,
  name,
  streakCount: 0,
  xpPoints: 0,
  coursesCompleted: [],
  certificates: [],
  lastLoginDate: lastLoginDate || new Date().toISOString().split('T')[0],
  maxStreak: 0,
  badges: [],
  completedLessons: {},
  quizzesPassed: 0
});

const getLocalAuthUsers = (): Record<string, LocalAuthUser> => {
  if (typeof window === 'undefined') return {};

  try {
    const raw = window.localStorage.getItem(LOCAL_AUTH_USERS_KEY);
    return raw ? JSON.parse(raw) as Record<string, LocalAuthUser> : {};
  } catch {
    return {};
  }
};

const saveLocalAuthUsers = (users: Record<string, LocalAuthUser>) => {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.setItem(LOCAL_AUTH_USERS_KEY, JSON.stringify(users));
  } catch {
    // Ignore local storage quota errors.
  }
};

const getStoredUserData = (uid: string): UserData | null => {
  if (typeof window === 'undefined') return null;

  try {
    const raw = window.localStorage.getItem(`${LOCAL_PROFILE_KEY}:${uid}`);
    return raw ? JSON.parse(raw) as UserData : null;
  } catch {
    return null;
  }
};

const saveStoredUserData = (uid: string, data: UserData) => {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.setItem(`${LOCAL_PROFILE_KEY}:${uid}`, JSON.stringify(data));
  } catch {
    // Ignore storage quota errors during offline/demo flows.
  }
};

const readUserProfile = async (uid: string): Promise<UserData | null> => {
  try {
    const userRef = ref(database, `users/${uid}`);
    const snapshot = await get(userRef);
    if (snapshot.exists()) {
      return snapshot.val() as UserData;
    }
  } catch {
    const fallback = getStoredUserData(uid);
    if (fallback) {
      return fallback;
    }
  }

  return getStoredUserData(uid);
};

const writeUserProfile = async (uid: string, data: UserData) => {
  try {
    await set(ref(database, `users/${uid}`), data);
    saveStoredUserData(uid, data);
  } catch {
    saveStoredUserData(uid, data);
  }
};

const updateUserProfile = async (uid: string, data: Partial<UserData>) => {
  const currentData = getStoredUserData(uid);
  const mergedData = currentData ? { ...currentData, ...data } : data as UserData;

  try {
    await update(ref(database, `users/${uid}`), data);
    saveStoredUserData(uid, mergedData);
  } catch {
    saveStoredUserData(uid, mergedData);
  }
};

interface UserData {
  uid: string;
  email: string;
  name: string;
  streakCount: number;
  xpPoints: number;
  coursesCompleted: string[];
  certificates: string[];
  lastLoginDate: string;
  maxStreak: number;
  badges: string[];
  completedLessons: Record<string, string[]>; // courseId -> array of lessonIds
  quizzesPassed: number; // Total number of quizzes passed
}

interface AuthContextType {
  currentUser: FirebaseUser | null;
  userData: UserData | null;
  loading: boolean;
  showWelcome: boolean;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateUserData: (data: Partial<UserData>) => Promise<void>;
  dismissWelcome: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showWelcome, setShowWelcome] = useState(false);

  const checkAndUpdateStreak = async (uid: string, lastLogin: string) => {
    const today = new Date().toISOString().split('T')[0];

    if (lastLogin !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      const currentProfile = getStoredUserData(uid) || null;

      if (lastLogin !== yesterdayStr && lastLogin !== today) {
        // More than 1 day since last login - this will be handled when first lesson is completed
      }

      const updatedProfile = currentProfile ? { ...currentProfile, lastLoginDate: today } : null;

      if (updatedProfile) {
        saveStoredUserData(uid, updatedProfile);
      }

      try {
        await update(ref(database, `users/${uid}`), {
          lastLoginDate: today
        });
      } catch {
        // Permission-denied database writes are handled locally.
      }
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);

      if (user) {
        const existingProfile = await readUserProfile(user.uid);

        if (existingProfile) {
          await checkAndUpdateStreak(user.uid, existingProfile.lastLoginDate || '');
          const refreshedProfile = await readUserProfile(user.uid);

          if (refreshedProfile) {
            setUserData(refreshedProfile);
            setShowWelcome(refreshedProfile.xpPoints === 0);
          } else {
            setUserData(existingProfile);
            setShowWelcome(existingProfile.xpPoints === 0);
          }
        } else {
          const fallbackProfile = getStoredUserData(user.uid);
          if (fallbackProfile) {
            setUserData(fallbackProfile);
            setShowWelcome(fallbackProfile.xpPoints === 0);
          }
        }
      } else {
        setUserData(null);
        setShowWelcome(false);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signUp = async (email: string, password: string, name: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const today = new Date().toISOString().split('T')[0];
      const initialUserData = createDefaultUserData(user.uid, email, name, today);

      await writeUserProfile(user.uid, initialUserData);
      saveStoredUserData(user.uid, initialUserData);
      setUserData(initialUserData);
      return;
    } catch (error: any) {
      const normalizedEmail = email.trim().toLowerCase();
      const authUsers = getLocalAuthUsers();
      const existingUser = authUsers[normalizedEmail];

      if (existingUser) {
        throw new Error('An account with this email already exists. Please sign in instead.');
      }

      const localUid = `local-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      const today = new Date().toISOString().split('T')[0];
      const initialUserData = createDefaultUserData(localUid, normalizedEmail, name, today);

      saveLocalAuthUsers({
        ...authUsers,
        [normalizedEmail]: {
          uid: localUid,
          email: normalizedEmail,
          password: password,
          name: name,
        }
      });

      saveStoredUserData(localUid, initialUserData);
      setUserData(initialUserData);
      setCurrentUser({
        uid: localUid,
        email: normalizedEmail,
        displayName: name,
      } as FirebaseUser);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return;
    } catch (error: any) {
      const normalizedEmail = email.trim().toLowerCase();
      const authUsers = getLocalAuthUsers();
      const localUser = authUsers[normalizedEmail];

      if (!localUser || localUser.password !== password) {
        throw new Error('Invalid email or password.');
      }

      const storedProfile = getStoredUserData(localUser.uid) || createDefaultUserData(localUser.uid, normalizedEmail, localUser.name);

      saveStoredUserData(localUser.uid, storedProfile);
      setUserData(storedProfile);
      setCurrentUser({
        uid: localUser.uid,
        email: normalizedEmail,
        displayName: localUser.name,
      } as FirebaseUser);
    }
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
    setCurrentUser(null);
    setUserData(null);
  };

  const updateUserData = async (data: Partial<UserData>) => {
    if (!currentUser) return;

    await updateUserProfile(currentUser.uid, data);

    const refreshedProfile = await readUserProfile(currentUser.uid);
    if (refreshedProfile) {
      setUserData(refreshedProfile);
    }
  };

  const dismissWelcome = () => {
    setShowWelcome(false);
  };

  const value: AuthContextType = {
    currentUser,
    userData,
    loading,
    showWelcome,
    signUp,
    signIn,
    signOut,
    updateUserData,
    dismissWelcome
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
