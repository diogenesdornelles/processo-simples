import { UserProps } from '@/domain/interfaces/user.interfaces';

const SESSION_KEY =
  process.env.NEXT_PUBLIC_AUTH_SESSION || 'default_auth_session';

export const manageSession = {
  saveUser: async (user: UserProps) => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(SESSION_KEY, JSON.stringify(user));
      } catch (error) {
        console.error('Erro ao salvar sessão:', error);
        throw error;
      }
    }
  },

  removeUser: async () => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(SESSION_KEY);
      } catch (error) {
        console.error('Erro ao remover sessão:', error);
        throw error;
      }
    }
  },

  getUser: async (): Promise<UserProps | null> => {
    if (typeof window !== 'undefined') {
      try {
        const sessionData = localStorage.getItem(SESSION_KEY);

        if (!sessionData || sessionData === '' || sessionData === 'null') {
          return null;
        }

        const user: UserProps = JSON.parse(sessionData);
        return user;
      } catch (error) {
        console.warn('Erro ao fazer parse da sessão:', error);
        localStorage.removeItem(SESSION_KEY);
        return null;
      }
    }
    return null;
  },

  clearUser: async () => {
    await manageSession.removeUser();
  },

  existsUser: async (): Promise<boolean> => {
    const user = await manageSession.getUser();
    return user !== null;
  },
};
