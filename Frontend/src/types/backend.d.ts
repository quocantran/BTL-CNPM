export interface IBackendRes<T> {
  code: number | string;
  message?: string;
  error?: string;
  metadata?: T;
}

export interface IModelPaginate<T> {
  meta: {
    current: number;
    pageSize: number;
    pages: number;
    total: number;
  };
  result: T[];
}

export interface IMeta {
  current: number;
  pageSize: number;
  pages: number;
  total: number;
}

export interface IFile {
  url: string;
}

export interface IAccount {
  access_token: string;
  user: {
    _id: string;
    email: string;
    name: string;
    role: {
      _id: string;
      name: string;
    };
    permissions: {
      _id: string;
      name: string;
      apiPath: string;
      method: string;
      module: string;
    }[];
  };
}

export interface IGetAccount extends Omit<IAccount, "access_token"> {}

export interface IUser {
  _id?: string;
  name: string;
  email: string;
  password?: string;
  role?: {
    _id: string;
    name: string;
  };

  createdAt?: string;
  updatedAt?: string;
}

export interface IPermission {
  _id?: string;
  name: string;
  apiPath: string;
  method: string;
  module: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IRole {
  _id?: string;
  name: string;
  description: string;
  permissions: IPermission[] | string[];
  createdAt?: string;
  updatedAt?: string;
}
