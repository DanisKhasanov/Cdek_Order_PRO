import axios from "axios";

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

export const PostOrderData = async (payload: any) => {
  try {
    const response = await api.post("/order", payload);
    return response.data;
  } catch (error) {
    console.error("Ошибка при отправке данных на сервер:", error);
    throw error;
  }
};

export const GetBarcode = async (id: number, account: string, name: string) => {
  try {
    const response = await api.get(`/barcode/${id}?account=${account}`, {
      responseType: "blob",
    });
    const fileURL = URL.createObjectURL(response.data);
    const link = document.createElement("a");
    link.href = fileURL;
    const date = new Date();
    const dateFormatted = date.toLocaleDateString("ru-RU");
    link.download = `Штрихкод_${name}_${dateFormatted}.pdf`;
    link.click();
    URL.revokeObjectURL(fileURL);
  } catch (error) {
    console.error("Ошибка при получении шрихкодов:", error);
    throw error;
  }
};

export const GetInvoice = async (id: number, account: string, name: string) => {
  try {
    const response = await api.get(`/invoice/${id}?account=${account}`, {
      responseType: "blob",
    });
    const fileURL = URL.createObjectURL(response.data);
    const link = document.createElement("a");
    link.href = fileURL;
    const date = new Date();
    const dateFormatted = date.toLocaleDateString("ru-RU");
    link.download = `Накладная_${name}_${dateFormatted}.pdf`;
    link.click();
    URL.revokeObjectURL(fileURL);
  } catch (error) {
    console.error("Ошибка при получении счета:", error);
    throw error;
  }
};

export const GetOrderData = async (id: string) => {
  try {
    const response = await api.get(`/ms/order/${id}`);
    return response.data;
  } catch (error) {
    console.error("Ошибка при отправке данных на сервер:", error);
    throw error;
  }
};

export const GetDataCity = async (payment: any) => {
  try {
    const response = await api.post("/cod", payment);
    return response.data;
  } catch (error) {
    console.error("Ошибка при отправке данных на сервер:", error);
    throw error;
  }
};

export const GetTariffData = async (payload: any) => {
  try {
    const response = await api.post("/tarifflist", payload);
    return response.data;
  } catch (error) {
    console.error("Ошибка при отправке данных на сервер:", error);
    throw error;
  }
};

export const RequestTemplateCargo = (orderData: any) => ({
  to_location: {
    account: orderData.account,
    postal_code: orderData.to_location.postal_code,
    city: orderData.to_location.city,
  },
});

export const RequestTemplateWaybill = (orderData: any) => {
  const defaultCost = 100;
  const numberOfPackages = orderData.packages.length;
  const value = orderData.sum;
  const costPerPackage =
    numberOfPackages > 0 ? defaultCost / numberOfPackages : 0;

  return {
    number: orderData.number,
    account: orderData.account,
    sender: {
      phones: orderData.sender.phones.map((phone: any) => ({
        number: phone.number,
      })),
    },
    tariff_code: orderData.tariff_code,
    recipient: orderData.recipient,
    ...(orderData.to_location && {
      to_location: {
        code: orderData.to_location.code,
        address: orderData.to_location.address,
      },
    }),
    ...(orderData.delivery_point && {
      delivery_point: orderData.delivery_point,
    }),
    packages: orderData.packages.map((pkg: any, index: number) => ({
      number: pkg.number,
      weight: pkg.weight * 1000,
      length: pkg.length,
      width: pkg.width,
      height: pkg.height,
      items: pkg.items.map((item: any) => ({
        name: item.name,
        ware_key: item.ware_key,
        marking: item.marking,
        weight: item.weight * 1000,
        amount: item.amount,
        payment:
          orderData.cod === true && index === 0
            ? { value: value }
            : { value: 0 },
        cost: costPerPackage,
      })),
    })),
    comment: orderData.comment_delivery,
    services: orderData.services,
    delivery_recipient_cost: orderData.delivery_recipient_cost,
  };
};

export const RequestTemplateTariff = (orderData: any) => ({
  account: orderData.account,
  to_location: {
    code: orderData.to_location?.code,
  },
  packages: orderData.packages.map((packageItem: any) => ({
    weight: packageItem.weight * 1000,
    length: packageItem.length,
    width: packageItem.width,
    height: packageItem.height,
  })),
});

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

export const GetSetting = async (payload: string) => {
  try {
    const response = {
      type_order: "test",
      name_sender: "Иванов Иван Иванович",
      type_shipment: "test",
      date_shipment: "test",
      time_shipment: "test",
      comment: "test",
      city_shipment: "test",
      address_shipment: "test",
      phone: "test",
      boxes: [
        {
          id: 1,
          weight: 10,
          length: 10,
          width: 10,
          height: 10,
        },
        {
          id: 2,
          weight: 20,
          length: 20,
          width: 20,
          height: 20,
        },
        {
          id: 3,
          weight: 30,
          length: 30,
          width: 30,
          height: 30,
        },
      ],
      name_product: "Пластиковый ящик",
      declared_cost: 200,
    };

    // const response = await api.get(`/setting/${payload}`);
    return response;
  } catch (error) {
    console.error("Ошибка при отправке данных на сервер:", error);
    throw error;
  }
};
