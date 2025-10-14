export enum Role {
  USER = 'user',
  ADMIN = 'admin',
}

export interface IUser {
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
}

export type IUserRegister = Omit<IUser, 'passwordHash' | 'createdAt' | 'updatedAt'> & {
  password: string;
};

export type IUserLogin = Pick<IUser, 'email' | 'passwordHash'>;

export type IUserUpdate = Partial<IUser> & { id: string };

export interface IUserResponse {
  message: string;
  // Make createdAt and updatedAt optional in the response shape
  user:
    | (Omit<IUser, 'passwordHash' | 'createdAt' | 'updatedAt'> & {
        id: string;
        createdAt?: Date;
        updatedAt?: Date;
      })
    | null;
  status: number;
  token?: string;
}
