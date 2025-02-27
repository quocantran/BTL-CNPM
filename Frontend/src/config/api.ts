import { setRefreshTokenAction } from "@/lib/redux/slice/auth.slice";
import { makeStore } from "@/lib/redux/store";
import {
  IBackendRes,
  IAccount,
  IUser,
  IModelPaginate,
  IGetAccount,
  IPermission,
  IRole,
  IFile,
} from "@/types/backend";
import { message, notification } from "antd";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;

interface FetchOptions extends RequestInit {
  headers: {
    [key: string]: string;
  };
}

const fetchWithInterceptor = async (
  url: string,
  options: FetchOptions = {
    headers: {},
  }
) => {
  // Pre-request interceptor
  if (typeof window !== "undefined" && localStorage.getItem("access_token")) {
    options.headers = {
      ...options.headers,
      Authorization: "Bearer " + localStorage.getItem("access_token"),
    };
  }
  if (!options.headers?.Accept && options.headers?.["Content-Type"]) {
    options.headers = {
      ...options.headers,
      Accept: "application/json",
      "Content-Type": "application/json; charset=utf-8",
    };
  }

  let response = await fetch(url, options);

  // Post-response interceptor
  if (!response.ok) {
    if (response.status === 401 && url !== "/api/v1/auths/login") {
      const access_token = await refreshToken();
      if (access_token) {
        options.headers["Authorization"] = `Bearer ${access_token}`;
        localStorage.setItem("access_token", access_token);
        response = await fetch(url, options);
      }
    }

    if (
      response.status === 400 &&
      url === "/api/v1/auths/refresh" &&
      location.pathname.startsWith("/admin")
    ) {
      const message =
        (await response.json())?.message ?? "Có lỗi xảy ra, vui lòng login.";
      //dispatch redux action
      makeStore().dispatch(setRefreshTokenAction({ status: true, message }));
    }
    if (!response.ok) {
      const res = await response.json();
      return res;
    }
  }

  return response.json();
};

// API USERS

export const fetchUsers = async (
  current: number,
  name: string = ""
): Promise<IBackendRes<IModelPaginate<IUser>> | undefined> => {
  const regex = new RegExp(name, "i");
  const res = await fetchWithInterceptor(
    `${BACKEND_URL}/api/v1/users?populate=role&pageSize=5&current=${current}${
      name ? `&name=${regex}` : ""
    }`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (!res) {
    notification.error({
      message: "Có lỗi xảy ra",
      description: res.message,
    });
  } else {
    return res;
  }
};

export const countUsers = async (): Promise<IBackendRes<number>> => {
  const res = await fetchWithInterceptor(
    `${BACKEND_URL}/api/v1/users/record/count`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-cache",
    }
  );
  return res;
};

export const createUser = async (body: IUser) => {
  const res = await fetchWithInterceptor(`${BACKEND_URL}/api/v1/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("access_token"),
    },
    body: JSON.stringify(body),
  });
  if (res.statusCode === 400) {
    notification.error({
      message: "Có lỗi xảy ra",
      description: res.message,
    });
    return;
  }

  return res;
};

export const updateUser = async (id: string | undefined, body: IUser) => {
  const res = await fetchWithInterceptor(`${BACKEND_URL}/api/v1/users/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("access_token"),
    },

    body: JSON.stringify(body),
  });
  if (res.statusCode === 400) {
    notification.error({
      message: "Có lỗi xảy ra",
      description: res.message,
    });
    return;
  }

  return res;
};

export const deleteUser = async (id: string) => {
  const res = await fetchWithInterceptor(`${BACKEND_URL}/api/v1/users/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("access_token"),
    },
  });
  if (res.statusCode === 400) {
    notification.error({
      message: "Có lỗi xảy ra",
      description: res.message,
    });
    return;
  }
  return res;
};

// Roles Apis

export const fetchRoles = async (
  current: number = 1,
  name: string = ""
): Promise<IBackendRes<IModelPaginate<IRole>> | undefined> => {
  const regex = new RegExp(name, "i");
  const res = await fetchWithInterceptor(
    `${BACKEND_URL}/api/v1/roles${current ? `?current=${current}` : ""}${
      name ? `&name=${regex}` : ""
    }`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    }
  );
  if (!res) {
    notification.error({
      message: "Có lỗi xảy ra",
      description: res.message,
    });
  } else {
    return res;
  }
};

export const fetchRoleById = async (
  id?: string
): Promise<IBackendRes<IRole> | undefined> => {
  const res = await fetchWithInterceptor(`${BACKEND_URL}/api/v1/roles/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
    },
  });
  if (!res.metadata) {
    notification.error({
      message: "Có lỗi xảy ra",
      description: res.message,
    });
  } else {
    return res;
  }
};

export const createRole = async (body: IRole) => {
  const res = await fetchWithInterceptor(`${BACKEND_URL}/api/v1/roles`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
    },
    body: JSON.stringify(body),
  });
  if (res.statusCode === 400) {
    notification.error({
      message: "Có lỗi xảy ra",
      description: res.message,
    });
    return;
  }
  return res;
};

export const updateRole = async (id: string, body: IRole) => {
  const res = await fetchWithInterceptor(`${BACKEND_URL}/api/v1/roles/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
    },
    body: JSON.stringify(body),
  });
  if (res.statusCode === 400) {
    notification.error({
      message: "Có lỗi xảy ra",
      description: res.message,
    });
    return;
  }
  return res;
};

export const deleteRole = async (id: string) => {
  const res = await fetchWithInterceptor(`${BACKEND_URL}/api/v1/roles/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
    },
  });
  if (!res) {
    notification.error({
      message: "Có lỗi xảy ra",
      description: res.message,
    });
    return;
  }
  return res;
};

// API PERMISSIONS

export const fetchPermissions = async (
  current: number = 1,
  name: string = "",
  module: string = "",
  pageSize: number = 10
): Promise<IBackendRes<IModelPaginate<IPermission>> | undefined> => {
  const nameRegex = new RegExp(name, "i");
  const moduleRegex = new RegExp(module, "i");
  const res = await fetchWithInterceptor(
    `${BACKEND_URL}/api/v1/permissions?current=${current}${
      name ? `&name=${nameRegex}` : ""
    }${module ? `&module=${moduleRegex}` : ""}${
      pageSize ? `&pageSize=${pageSize}` : ""
    }`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    }
  );
  if (!res) {
    notification.error({
      message: "Có lỗi xảy ra",
      description: res.message,
    });
  } else {
    return res;
  }
};

export const createPermission = async (body: IPermission) => {
  const res = await fetchWithInterceptor(`${BACKEND_URL}/api/v1/permissions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
    },
    body: JSON.stringify(body),
  });
  if (res.statusCode === 400) {
    notification.error({
      message: "Có lỗi xảy ra",
      description: res.message,
    });
    return;
  } else {
    return res;
  }
};

export const updatePermission = async (id: string, body: IPermission) => {
  const res = await fetchWithInterceptor(
    `${BACKEND_URL}/api/v1/permissions/${id}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
      body: JSON.stringify(body),
    }
  );
  if (!res) {
    notification.error({
      message: "Có lỗi xảy ra",
      description: res.message,
    });
  } else {
    return res;
  }
};

export const deletePermission = async (id: string) => {
  const res = await fetchWithInterceptor(
    `${BACKEND_URL}/api/v1/permissions/${id}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    }
  );
  if (!res) {
    notification.error({
      message: "Có lỗi xảy ra",
      description: res.message,
    });
    return;
  } else {
    return res;
  }
};

// Auth Apis

export const callLogin = async (
  email: string,
  password: string
): Promise<IBackendRes<IAccount> | undefined> => {
  const res = await fetch(`${BACKEND_URL}/api/v1/auths/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    notification.error({
      message: "Có lỗi xảy ra",
      description: await res.json().then((data) => data.message),
    });
    return;
  }
  const data = await res.json();
  return data;
};

export const callRegister = async (body: IUser) => {
  const res = await fetch(`${BACKEND_URL}/api/v1/auths/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify(body),
  });
  if (!res.ok) {
    notification.error({
      message: "Có lỗi xảy ra",
      description: await res.json().then((data) => data.message),
    });
    return;
  }
  const data = await res.json();
  return data;
};

export const callFetchAccount = async (
  accessToken = ""
): Promise<IBackendRes<IGetAccount> | undefined> => {
  const res = await fetchWithInterceptor(
    `${BACKEND_URL}/api/v1/auths/account`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${
          localStorage.getItem("access_token") ?? accessToken
        }`,
      },
    }
  );
  if (!res) {
    return Promise.resolve(undefined);
  }

  return res;
};

export const refreshToken = async (): Promise<string | null> => {
  const res = await fetch(`${BACKEND_URL}/api/v1/auths/refresh`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
  if (!res.ok) {
    return null;
  }
  const data: IBackendRes<IAccount> = await res.json();
  return data.metadata?.access_token || null;
};

export const logout = async (): Promise<void> => {
  const res = await fetchWithInterceptor(`${BACKEND_URL}/api/v1/auths/logout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
    },
    credentials: "include",
  });
  if (res.statusCode === 400) {
    notification.error({
      message: "Có lỗi xảy ra",
      description: res.message,
    });
    return;
  }

  return res;
};

//api files

export const uploadFile = async (file: File): Promise<IBackendRes<IFile>> => {
  const formData = new FormData();
  formData.append("fileUpload", file);
  const res = await fetch(`${BACKEND_URL}/api/v1/files/upload`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
    },
    body: formData,
  });
  return await res.json();
};
