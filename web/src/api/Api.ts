import {
  CreateProc,
  ProcProps,
  UpdateProc,
} from '@/domain/interfaces/proc.interfaces';
import {
  CreateUser,
  UserProps,
  UpdateUser,
} from '@/domain/interfaces/user.interfaces';
import {
  CreateEvent,
  EventProps,
  UpdateEvent,
} from '@/domain/interfaces/event.interfaces';
import {
  CreateDoc,
  DocProps,
  UpdateDoc,
} from '@/domain/interfaces/doc.interfaces';
import {
  LoginCredentials,
  LoginProps,
} from '@/domain/interfaces/login.interfaces';
import { restClient } from '@/utils/restClient';

export const Api = {
  auth: {
    login: async (credentials: LoginCredentials): Promise<LoginProps> => {
      const { data } = await restClient.post('login', credentials);
      return data;
    },
    logout: async (): Promise<void> => {
      await restClient.post('logout');
    },
    me: async (): Promise<UserProps> => {
      const { data } = await restClient.get('me');
      return data;
    },
  },

  user: {
    getAll: async (): Promise<UserProps[]> => {
      const { data } = await restClient.get('users');
      return data;
    },
    get: async (id: number): Promise<UserProps> => {
      const { data } = await restClient.get(`users/${id}`);
      return data;
    },
    create: async (user: CreateUser): Promise<UserProps> => {
      const { data } = await restClient.post('users', user);
      return data;
    },
    update: async (id: number, user: UpdateUser): Promise<UserProps> => {
      const { data } = await restClient.put(`users/${id}`, user);
      return data;
    },
    delete: async (id: number): Promise<void> => {
      await restClient.delete(`users/${id}`);
    },
  },

  proc: {
    getAll: async (): Promise<ProcProps[]> => {
      const { data } = await restClient.get('procs');
      return data;
    },
    get: async (id: number): Promise<ProcProps> => {
      const { data } = await restClient.get(`procs/${id}`);
      return data;
    },
    create: async (proc: CreateProc): Promise<ProcProps> => {
      const { data } = await restClient.post('procs', proc);
      return data;
    },
    update: async (id: number, proc: UpdateProc): Promise<ProcProps> => {
      const { data } = await restClient.put(`procs/${id}`, proc);
      return data;
    },
    delete: async (id: number): Promise<void> => {
      await restClient.delete(`procs/${id}`);
    },
  },

  event: {
    getAll: async (): Promise<EventProps[]> => {
      const { data } = await restClient.get('events');
      return data;
    },
    get: async (id: number): Promise<EventProps> => {
      const { data } = await restClient.get(`events/${id}`);
      return data;
    },
    create: async (event: CreateEvent): Promise<EventProps> => {
      const { data } = await restClient.post('events', event);
      return data;
    },
    update: async (id: number, event: UpdateEvent): Promise<EventProps> => {
      const { data } = await restClient.put(`events/${id}`, event);
      return data;
    },
    delete: async (id: number): Promise<void> => {
      await restClient.delete(`events/${id}`);
    },
  },

  doc: {
    getAll: async (): Promise<DocProps[]> => {
      const { data } = await restClient.get('docs');
      return data;
    },
    get: async (id: number): Promise<DocProps> => {
      const { data } = await restClient.get(`docs/${id}`);
      return data;
    },
    create: async (doc: CreateDoc): Promise<DocProps> => {
      const formData = new FormData();
      Object.entries(doc).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value);
        }
      });

      const { data } = await restClient.post('docs', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return data;
    },
    update: async (id: number, doc: UpdateDoc): Promise<DocProps> => {
      const formData = new FormData();
      formData.append('_method', 'PUT');

      Object.entries(doc).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value);
        }
      });

      const { data } = await restClient.post(`docs/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return data;
    },
    delete: async (id: number): Promise<void> => {
      await restClient.delete(`docs/${id}`);
    },
  },

  login: {
    post: async (credentials: LoginCredentials): Promise<LoginProps> => {
      console.warn('Api.login.post is deprecated. Use Api.auth.login instead.');
      return Api.auth.login(credentials);
    },
  },
};
