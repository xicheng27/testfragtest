export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

export interface AuthActionResult {
  ok: boolean;
  user?: AuthUser;
  error?: string;
}

type AccountRecord = AuthUser & {
  passwordHash: string;
  salt: string;
  createdAt: string;
};

type StoredSession =
  | { type: 'account'; userId: string }
  | { type: 'guest' };

export interface AuthRepository {
  restoreSession: () => Promise<{ user: AuthUser | null; isGuest: boolean }>;
  signUp: (name: string, email: string, password: string) => Promise<AuthActionResult>;
  logIn: (email: string, password: string) => Promise<AuthActionResult>;
  continueAsGuest: () => void;
  clearSession: () => void;
}

const ACCOUNTS_KEY = 'scentmatch:accounts:v1';
const SESSION_KEY = 'scentmatch:session:v1';

function readAccounts(): AccountRecord[] {
  try {
    const value = window.localStorage.getItem(ACCOUNTS_KEY);
    if (!value) return [];
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeAccounts(accounts: AccountRecord[]) {
  window.localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
}

function writeSession(session: StoredSession) {
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function publicUser(account: AccountRecord): AuthUser {
  return { id: account.id, name: account.name, email: account.email };
}

function randomToken(byteLength = 16) {
  const bytes = crypto.getRandomValues(new Uint8Array(byteLength));
  return Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('');
}

async function hashPassword(password: string, salt: string) {
  const payload = new TextEncoder().encode(`${salt}:${password}`);
  const digest = await crypto.subtle.digest('SHA-256', payload);
  return Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, '0')).join('');
}

export const localAuthRepository: AuthRepository = {
  async restoreSession() {
    try {
      const value = window.localStorage.getItem(SESSION_KEY);
      if (!value) return { user: null, isGuest: false };

      const session = JSON.parse(value) as StoredSession;
      if (session.type === 'guest') return { user: null, isGuest: true };

      const account = readAccounts().find(candidate => candidate.id === session.userId);
      if (account) return { user: publicUser(account), isGuest: false };
    } catch {
      // Invalid browser data is treated as a signed-out session.
    }

    window.localStorage.removeItem(SESSION_KEY);
    return { user: null, isGuest: false };
  },

  async signUp(name, email, password) {
    const normalizedEmail = normalizeEmail(email);
    const accounts = readAccounts();
    if (accounts.some(account => account.email === normalizedEmail)) {
      return { ok: false, error: 'An account with this email already exists.' };
    }

    const salt = randomToken();
    const account: AccountRecord = {
      id: `user_${randomToken(12)}`,
      name: name.trim(),
      email: normalizedEmail,
      salt,
      passwordHash: await hashPassword(password, salt),
      createdAt: new Date().toISOString(),
    };

    writeAccounts([...accounts, account]);
    writeSession({ type: 'account', userId: account.id });
    return { ok: true, user: publicUser(account) };
  },

  async logIn(email, password) {
    const normalizedEmail = normalizeEmail(email);
    const account = readAccounts().find(candidate => candidate.email === normalizedEmail);
    if (!account) {
      return { ok: false, error: 'No account was found for this email.' };
    }

    const passwordHash = await hashPassword(password, account.salt);
    if (passwordHash !== account.passwordHash) {
      return { ok: false, error: 'The password you entered is incorrect.' };
    }

    writeSession({ type: 'account', userId: account.id });
    return { ok: true, user: publicUser(account) };
  },

  continueAsGuest() {
    writeSession({ type: 'guest' });
  },

  clearSession() {
    window.localStorage.removeItem(SESSION_KEY);
  },
};
