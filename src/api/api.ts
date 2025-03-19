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
    // const response = await api.post(`/calculatepackages`, data);
    const test = [
      {
        number: "1",
        weight: 1609,
        length: 20,
        width: 20,
        height: 10,
        items: [
          {
            name: "Атомайзер-помадка 10мл, однотонный глянцевый (золотой)",
            ware_key: "P001-10:AA GOLD",
            weight: 29,
            payment: {
              value: 0,
              vat_sum: 0,
              vat_rate: 5,
            },
            amount: 5,
            cost: 20,
          },
          {
            name: "Атомайзер-помадка 10мл, однотонный глянцевый (красный)",
            ware_key: "P001-10:AA RED",
            weight: 29,
            payment: {
              value: 0,
              vat_sum: 0,
              vat_rate: 5,
            },
            amount: 7,
            cost: 0,
          },
          {
            name: "Атомайзер-помадка 10мл, однотонный глянцевый (синий)",
            ware_key: "P001-10:AA BLUE",
            weight: 29,
            payment: {
              value: 0,
              vat_sum: 0,
              vat_rate: 5,
            },
            amount: 2,
            cost: 0,
          },
          {
            name: "Атомайзер-помадка 10мл, однотонный глянцевый (пудрово-розовый)",
            ware_key: "P001-10:AA POWDERY PINK",
            weight: 29,
            payment: {
              value: 0,
              vat_sum: 0,
              vat_rate: 5,
            },
            amount: 5,
            cost: 0,
          },
          {
            name: "Атомайзер-помадка 10мл, однотонный (черный)",
            ware_key: "P001-10:AI BLACK",
            weight: 29,
            payment: {
              value: 0,
              vat_sum: 0,
              vat_rate: 5,
            },
            amount: 5,
            cost: 0,
          },
          {
            name: "Атомайзер-карандаш, 20мл (кратно 5) (золото)",
            ware_key: "S128-20:AA GOLD",
            weight: 21,
            payment: {
              value: 0,
              vat_sum: 0,
              vat_rate: 5,
            },
            amount: 5,
            cost: 0,
          },
          {
            name: "Атомайзер-помадка 5мл, однотонный (золотой)",
            ware_key: "P001-5:AA GOLD",
            weight: 16,
            payment: {
              value: 0,
              vat_sum: 0,
              vat_rate: 5,
            },
            amount: 4,
            cost: 0,
          },
          {
            name: "Атомайзер-помадка 5мл, однотонный (красный)",
            ware_key: "P001-5:AA RED",
            weight: 16,
            payment: {
              value: 0,
              vat_sum: 0,
              vat_rate: 5,
            },
            amount: 5,
            cost: 0,
          },
          {
            name: "Атомайзер-помадка 5мл, однотонный (розовый)",
            ware_key: "P001-5:AA PINK",
            weight: 16,
            payment: {
              value: 0,
              vat_sum: 0,
              vat_rate: 5,
            },
            amount: 4,
            cost: 0,
          },
          {
            name: "Атомайзер-помадка 5мл, однотонный (серебристый)",
            ware_key: "P001-5:AA SILVER",
            weight: 16,
            payment: {
              value: 0,
              vat_sum: 0,
              vat_rate: 5,
            },
            amount: 3,
            cost: 0,
          },
          {
            name: "Атомайзер-помадка 5мл, однотонный (черный)",
            ware_key: "P001-5:AA BLACK",
            weight: 16,
            payment: {
              value: 0,
              vat_sum: 0,
              vat_rate: 5,
            },
            amount: 6,
            cost: 0,
          },
          {
            name: "Атомайзер-карандаш 10мл, прозрачное стекло, металлическая крышка (кратно 5) (золотой)",
            ware_key: "S004-10:AA GOLD",
            weight: 11,
            payment: {
              value: 0,
              vat_sum: 0,
              vat_rate: 5,
            },
            amount: 10,
            cost: 0,
          },
          {
            name: "Атомайзер-карандаш 5.5мл, прозрачное стекло, крышка металл (кратно 5) (золотой)",
            ware_key: "S009-5.5:AA (5) GOLD",
            weight: 11,
            payment: {
              value: 0,
              vat_sum: 0,
              vat_rate: 5,
            },
            amount: 25,
            cost: 0,
          },
          {
            name: "Атомайзер-карандаш 5мл, прозрачное стекло, металлическая крышка (кратно 5) (серебристый)",
            ware_key: "S004-5:AA SILVER",
            weight: 8,
            payment: {
              value: 0,
              vat_sum: 0,
              vat_rate: 5,
            },
            amount: 10,
            cost: 0,
          },
          {
            name: "Насадка для шприца (кратно 20)",
            ware_key: "E200:AA",
            weight: 0,
            payment: {
              value: 0,
              vat_sum: 0,
              vat_rate: 5,
            },
            amount: 20,
            cost: 0,
          },
          {
            name: "Доставка",
            ware_key: "dlv001",
            weight: 0,
            payment: {
              value: 0,
              vat_sum: 0,
              vat_rate: 5,
            },
            amount: 1,
            cost: 0,
          },
        ],
      },
    ];
    // return response.data;
    return test;
  } catch (error) {
    console.error("Ошибка при получении грузового места:", error);
    throw error;
  }
};
