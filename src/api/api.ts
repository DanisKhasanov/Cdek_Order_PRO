import axios from "axios";
import { RequestTemplateTariff } from "../helpers/requestTemplate/RequestTemplateTariff";
import { RequestTemplateWaybill } from "../helpers/requestTemplate/RequestTemplateWaybill";
const URL_API = import.meta.env.VITE_API_URL;

let isRefreshing = false;
let refreshSubscribers: Array<(token: string) => void> = [];

const api = axios.create({
  baseURL: URL_API,
});

const subscribeTokenRefresh = (callback: (token: string) => void) => {
  refreshSubscribers.push(callback);
};

const onRefreshed = (token: string) => {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
};

const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem("refreshToken");

  if (!refreshToken) {
    throw new Error("Refresh токен отсутствует");
  }
  try {
    const response = await api.post("/auth/token", { refreshToken });
    const { accessToken } = response.data;
    localStorage.setItem("accessToken", accessToken);
    return accessToken;
  } catch (error) {
    throw new Error("Не удалось обновить токен");
  }
};

api.interceptors.request.use(
  async (config) => {
    let accessToken = localStorage.getItem("accessToken");

    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response && error.response.status === 401) {
      console.error("Access токен отсутствует");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      window.location.href = "/login";
      return Promise.reject(error);
    }

    if (
      error.response &&
      error.response.status === 403 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const newToken = await refreshAccessToken();
          isRefreshing = false;
          onRefreshed(newToken);
          return api(originalRequest);
        } catch (refreshError) {
          isRefreshing = false;
          console.error("Не удалось обновить токен:", refreshError);
          window.location.href = "/login";
          return Promise.reject(refreshError);
        }
      }

      return new Promise((resolve) => {
        subscribeTokenRefresh((newToken) => {
          originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
          resolve(axios(originalRequest));
        });
      });
    }

    return Promise.reject(error);
  }
);

export const login = async (username: string, password: string) => {
  try {
    const response = await api.post("/auth/login/", {
      username,
      password,
    });
    const { accessToken, refreshToken } = response.data;
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);

    return response;
  } catch (error) {
    console.error("Ошибка при отправке логина или пароля на сервер:", error);
    throw error;
  }
};

export const PostOrderData = async (payload: any) => {
  const requestTemplate = RequestTemplateWaybill(payload);
  try {
    const response = await api.post(`/order`, requestTemplate);
    return response.data;
  } catch (error) {
    console.error("Ошибка при отправке данных на сервер:", error);
    throw error;
  }
};

export const GetBarcode = async (orderUUID: string, socketId: string) => {
  try {
    const response = await api.post(`/barcode`, {
      orderUUID,
      socketId,
    });
    return response.data;
  } catch (error) {
    console.error("Ошибка при получении шрихкодов:", error);
    throw error;
  }
};

export const GetInvoice = async (orderUUID: string, socketId: string) => {
  try {
    const response = await api.post(`/waybill/`, {
      orderUUID,
      socketId,
    });
    return response.data;
  } catch (error) {
    console.error("Ошибка при получении счета:", error);
    throw error;
  }
};

export const GetOrderData = async (orderNumber: string) => {
  try {
    const response = await api.get(`/moysklad/order/${orderNumber}`);
    return response.data;
  } catch (error) {
    console.error("Ошибка при отправке данных на сервер:", error);
    throw error;
  }
};

export const GetDataCity = async (data: any) => {
  try {
    const response = await api.post(`/cod`, data);
    return response.data;
  } catch (error) {
    console.error("Ошибка при отправке данных на сервер:", error);
    throw error;
  }
};

export const GetTariffData = async (payload: any) => {
  const requestTemplate = RequestTemplateTariff(payload);
  try {
    const response = await api.post(`/tarifflist`, requestTemplate);

    return response.data;
  } catch (error) {
    console.error("Ошибка при отправке данных на сервер:", error);
    throw error;
  }
};

export const GetCargoSpace = async (payload: any) => {
  const data = {
    order: {
      weight: payload.weight,
      cod: payload.cod,
      positions: payload.positions,
    },
  };

  try {
    const response = await api.post(`/calculatepackages`, data);

    const packagesWithIds = response.data.map((pkg: any) => ({
      ...pkg,
      items: pkg.items.map((item: any) => ({
        ...item,
        id: `${item.ware_key}_${Date.now()}_${Math.random()
          .toString(36)
          .substr(2, 5)}`,
      })),
    }));

    return packagesWithIds;
  } catch (error) {
    console.error("Ошибка при получении грузового места:", error);
    throw error;
  }
};
