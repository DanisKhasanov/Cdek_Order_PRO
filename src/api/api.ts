import axios from "axios";
import { RequestTemplateTariff } from "./requestTemplate/RequestTemplateTariff";
import { RequestTemplateWaybill } from "./requestTemplate/RequestTemplateWaybill";

const URL_API = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: URL_API,
});

const username = "danis_widget";
const password = "FLX_cdekWidget5";

let isRefreshing = false;
let refreshSubscribers: Array<(token: string) => void> = [];

const subscribeTokenRefresh = (callback: (token: string) => void) => {
  refreshSubscribers.push(callback);
};

const onRefreshed = (token: string) => {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
};

export const login = async () => {
  const response = await api.post("/auth/login/", {
    username,
    password,
  });
  const { accessToken, refreshToken } = response.data;

  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem("refreshToken", refreshToken);

  return accessToken;
};

const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem("refreshToken");

  if (!refreshToken) {
    throw new Error("Refresh токен отсутствует");
  }

  const response = await api.post("/auth/token", {
    refreshToken,
  });

  const { accessToken } = response.data;

  localStorage.setItem("accessToken", accessToken);
  return accessToken;
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

    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const newToken = await refreshAccessToken();
          isRefreshing = false;
          onRefreshed(newToken);
        } catch (refreshError) {
          isRefreshing = false;
          console.error("Не удалось обновить токен:", refreshError);
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

export const PostOrderData = async (payload: any, accountId: string) => {
  const requestTemplate = RequestTemplateWaybill(payload);
  try {
    const response = await api.post(
      `/order?accountId=${accountId}`,
      requestTemplate
    );
    return response.data;
  } catch (error) {
    console.error("Ошибка при отправке данных на сервер:", error);
    throw error;
  }
};

export const GetBarcode = async (
  accountId: string,
  orderUUID: string,
  nameRecipient: string
) => {
  try {
    const response = await api.post(
      `/barcode?accountId=${accountId}`,
      {
        orderUUID,
      },
  
    );
    return response.data;
    // const fileURL = URL.createObjectURL(response.data);
    // const link = document.createElement("a");
    // link.href = fileURL;
    // const date = new Date();
    // const dateFormatted = date.toLocaleDateString("ru-RU");
    // link.download = `Штрихкод_${nameRecipient}_${dateFormatted}.pdf`;
    // link.click();
    // URL.revokeObjectURL(fileURL);
  } catch (error) {
    console.error("Ошибка при получении шрихкодов:", error);
    throw error;
  }
};


export const GetInvoice = async (
  id: number,
  account: string,
  nameRecipient: string
) => {
  try {
    const response = await api.get(`/invoice/${id}?account=${account}`, {
      responseType: "blob",
    });
    const fileURL = URL.createObjectURL(response.data);
    const link = document.createElement("a");
    link.href = fileURL;
    const date = new Date();
    const dateFormatted = date.toLocaleDateString("ru-RU");
    link.download = `Накладная_${nameRecipient}_${dateFormatted}.pdf`;
    link.click();
    URL.revokeObjectURL(fileURL);
  } catch (error) {
    console.error("Ошибка при получении счета:", error);
    throw error;
  }
};

export const GetOrderData = async (id: string, account: string) => {
  try {
    const response = await api.get(
      `/moysklad/order/${id}?accountId=${account}`
    );
    return response.data;
  } catch (error) {
    console.error("Ошибка при отправке данных на сервер:", error);
    throw error;
  }
};

export const GetDataCity = async (payment: any, accountId: string) => {
  try {
    const response = await api.post(`/cod?accountId=${accountId}`, payment);
    return response.data;
  } catch (error) {
    console.error("Ошибка при отправке данных на сервер:", error);
    throw error;
  }
};

export const GetTariffData = async (payload: any, accountId: string) => {
  const requestTemplate = RequestTemplateTariff(payload);
  try {
    const response = await api.post(
      `/tarifflist?accountId=${accountId}`,
      requestTemplate
    );

    return response.data;
  } catch (error) {
    console.error("Ошибка при отправке данных на сервер:", error);
    throw error;
  }
};

export const GetIdAccount = async (payload: any) => {
  try {
    const response = await api.get(`/moysklad/context/${payload.contextKey}`);
    return response.data;
  } catch (error) {
    console.error("Ошибка при отправке данных на сервер:", error);
    throw error;
  }
};

export const GetSettingAccount = async (payload: string) => {
  try {
    const response = await api.get(
      `/moysklad/vendor/1.0/apps/fe8d0f25-3e10-446b-be98-95fda422ef6f/${payload}`
    );
    return response.data;
  } catch (error) {
    console.error("Ошибка при отправке данных на сервер:", error);
    throw error;
  }
};

export const GetSetting = async (accountId: string) => {
  try {
    const response = await api.get(`/moysklad/settings?accountId=${accountId}`);
    return response.data;
  } catch (error) {
    console.error("Ошибка при отправке данных на сервер:", error);
    throw error;
  }
};
