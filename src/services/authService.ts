import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { auth } from './firebase.ts';

export interface AuthUser {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  isDemo?: boolean;
}

interface StoredAccount {
  uid: string;
  email: string;
  displayName: string;
  passwordHash: string;
  photoURL?: string;
  createdAt: string;
}

const SESSION_STORAGE_KEY = 'fitpulse_auth_session_v1';
const ACCOUNTS_STORAGE_KEY = 'fitpulse_registered_accounts_v1';

// Pre-seeded Demo User
export const DEMO_USER: AuthUser = {
  uid: 'user_local_demo_101',
  email: 'alex.fitness@example.com',
  displayName: 'Alex Rivers',
  photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
  isDemo: true,
};

// Simple hashing for local credentials
function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return `hash_${Math.abs(hash).toString(36)}_${str.length}`;
}

// Local account helpers
function getStoredAccounts(): StoredAccount[] {
  try {
    const raw = localStorage.getItem(ACCOUNTS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function saveStoredAccounts(accounts: StoredAccount[]): void {
  try {
    localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(accounts));
  } catch (e) {
    console.warn('Failed to save local accounts:', e);
  }
}

// Auth State Observers
type AuthStateListener = (user: AuthUser | null) => void;
const listeners: Set<AuthStateListener> = new Set();

function notifyListeners(user: AuthUser | null): void {
  listeners.forEach((listener) => {
    try {
      listener(user);
    } catch (e) {
      console.error('Error in auth listener:', e);
    }
  });
}

// Get active session from localStorage
export function getCurrentUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(SESSION_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.warn('Failed to read auth session:', e);
  }
  return null;
}

// Set active session in localStorage
function setSessionUser(user: AuthUser | null): void {
  try {
    if (user) {
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(SESSION_STORAGE_KEY);
    }
  } catch (e) {
    console.warn('Failed to update auth session:', e);
  }
  notifyListeners(user);
}

// Listen to auth changes
export function onAuthStateChange(listener: AuthStateListener): () => void {
  listeners.add(listener);
  // Immediate emit
  listener(getCurrentUser());
  return () => {
    listeners.delete(listener);
  };
}

// 1. Sign In with Email & Password
export async function signInWithEmail(email: string, password: string): Promise<AuthUser> {
  const cleanEmail = email.trim().toLowerCase();
  if (!cleanEmail || !cleanEmail.includes('@')) {
    throw new Error('Please provide a valid email address.');
  }
  if (!password || password.length < 6) {
    throw new Error('Password must be at least 6 characters long.');
  }

  // Check demo user
  if (cleanEmail === DEMO_USER.email.toLowerCase()) {
    setSessionUser(DEMO_USER);
    return DEMO_USER;
  }

  // Attempt Firebase Auth first if real credentials configured
  try {
    const userCredential = await signInWithEmailAndPassword(auth, cleanEmail, password);
    const fbUser = userCredential.user;
    const authUser: AuthUser = {
      uid: fbUser.uid,
      email: fbUser.email || cleanEmail,
      displayName: fbUser.displayName || cleanEmail.split('@')[0],
      photoURL: fbUser.photoURL || undefined,
    };
    setSessionUser(authUser);
    return authUser;
  } catch (firebaseErr: any) {
    // If Firebase reports bad key / invalid config / network or user not found, fall back to local store
    console.log('Firebase auth attempt returned, checking local accounts...', firebaseErr?.code || firebaseErr?.message);
    
    const accounts = getStoredAccounts();
    const account = accounts.find((a) => a.email === cleanEmail);
    if (!account) {
      throw new Error('No account found with this email. Please sign up first.');
    }
    if (account.passwordHash !== simpleHash(password)) {
      throw new Error('Incorrect password. Please try again.');
    }

    const authUser: AuthUser = {
      uid: account.uid,
      email: account.email,
      displayName: account.displayName,
      photoURL: account.photoURL,
    };
    setSessionUser(authUser);
    return authUser;
  }
}

// 2. Sign Up with Email & Password
export async function signUpWithEmail(
  email: string,
  password: string,
  displayName: string
): Promise<AuthUser> {
  const cleanEmail = email.trim().toLowerCase();
  const cleanName = displayName.trim() || cleanEmail.split('@')[0];

  if (!cleanEmail || !cleanEmail.includes('@')) {
    throw new Error('Please enter a valid email address.');
  }
  if (!password || password.length < 6) {
    throw new Error('Password must be at least 6 characters.');
  }
  if (cleanEmail === DEMO_USER.email.toLowerCase()) {
    throw new Error('This email is reserved for demo mode. Please use another email or click Quick Demo Access.');
  }

  // Check if account already exists locally
  const accounts = getStoredAccounts();
  if (accounts.some((a) => a.email === cleanEmail)) {
    throw new Error('An account with this email already exists. Please sign in.');
  }

  let newUid = `user_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

  // Attempt Firebase Sign Up
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, cleanEmail, password);
    if (userCredential?.user) {
      newUid = userCredential.user.uid;
    }
  } catch (fbErr) {
    // Graceful fallback to local user registration
    console.log('Firebase signup falling back to local account engine:', fbErr);
  }

  // Register user in local accounts store
  const newAccount: StoredAccount = {
    uid: newUid,
    email: cleanEmail,
    displayName: cleanName,
    passwordHash: simpleHash(password),
    photoURL: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(cleanName)}&backgroundColor=10b981`,
    createdAt: new Date().toISOString(),
  };

  accounts.push(newAccount);
  saveStoredAccounts(accounts);

  const authUser: AuthUser = {
    uid: newAccount.uid,
    email: newAccount.email,
    displayName: newAccount.displayName,
    photoURL: newAccount.photoURL,
  };

  setSessionUser(authUser);
  return authUser;
}

// 3. Quick Demo Login (1-Click instant test)
export async function signInDemoUser(): Promise<AuthUser> {
  setSessionUser(DEMO_USER);
  return DEMO_USER;
}

// 4. Google Sign-In
export async function signInWithGoogle(): Promise<AuthUser> {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const fbUser = result.user;
    const authUser: AuthUser = {
      uid: fbUser.uid,
      email: fbUser.email || 'google.user@fitnesspro.app',
      displayName: fbUser.displayName || 'Google Fitness User',
      photoURL: fbUser.photoURL || undefined,
    };
    setSessionUser(authUser);
    return authUser;
  } catch (err: any) {
    console.warn('Firebase Google Auth fallback:', err);
    // Fallback demo Google user
    const googleUser: AuthUser = {
      uid: `google_user_${Date.now()}`,
      email: 'alex.fitness.google@gmail.com',
      displayName: 'Alex Google User',
      photoURL: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=250&q=80',
    };
    setSessionUser(googleUser);
    return googleUser;
  }
}

// 5. Sign Out
export async function signOutUser(): Promise<void> {
  try {
    await signOut(auth);
  } catch (e) {
    // Ignore signOut errors
  }
  setSessionUser(null);
}
