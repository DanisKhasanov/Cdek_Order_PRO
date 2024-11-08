import axios from "axios";

// const URL_API = import.meta.env.VITE_API_URL;
const URL_API = "https://cdek.flx-it.ru/api";

const api = axios.create({
  baseURL: URL_API,
  // headers: {
  //   "Content-Type": "application/json",
  // },
  // withCredentials: true,
});

export const login = async (username: string, password: string) => {
  try {
    const response = await axios.post(
      "https://cdek.flx-it.ru/api/auth/login",
      {
        username,
        password,
      },
      {
        headers: {
          Accept: "application/json",
        },
      }
    );

    console.log("response auth", response);
    const { access_token, refresh_token } = response.data;

    // Сохраняем токены в localStorage
    localStorage.setItem("access_token", access_token);
    localStorage.setItem("refresh_token", refresh_token);

    return access_token;
  } catch (error) {
    console.error("Ошибка при авторизации:", error);
    throw error;
  }
};

// // Метод для обновления access токена
// const refreshAccessToken = async () => {
//   const refreshToken = localStorage.getItem("refresh_token");

//   if (!refreshToken) {
//     throw new Error("Нет refresh токена");
//   }

//   try {
//     const response = await api.post("/auth/token", {
//       refresh_token: refreshToken,
//     });
//     const { access_token } = response.data;

//     // Сохраняем новый access токен
//     localStorage.setItem("access_token", access_token);

//     return access_token;
//   } catch (error) {
//     console.error("Ошибка при обновлении токена:", error);
//     throw error;
//   }
// };

// // Перехватчик для запроса (для добавления токена в заголовки)
// api.interceptors.request.use(
//   async (config) => {
//     let accessToken = localStorage.getItem("access_token");

//     // Если нет токена, делаем запрос на авторизацию
//     // if (!accessToken) {
//     //   accessToken = await login(username, password); // Первый запрос на авторизацию
//     // }

//     // Добавляем токен в заголовок Authorization
//     if (accessToken) {
//       config.headers["Authorization"] = `Bearer ${accessToken}`;
//     }

//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// // Перехватчик для ответа (для обработки ошибки 401 и обновления токена)
// api.interceptors.response.use(
//   (response) => {
//     return response;
//   },
//   async (error) => {
//     if (error.response && error.response.status === 401) {
//       // Если ошибка 401 (неавторизован), пробуем обновить токен
//       try {
//         const accessToken = await refreshAccessToken();
//         error.config.headers["Authorization"] = `Bearer ${accessToken}`;

//         // Повторный запрос с новым токеном
//         return axios(error.config);
//       } catch (refreshError) {
//         console.error("Не удалось обновить токен:", refreshError);
//         throw refreshError;
//       }
//     }
//     return Promise.reject(error);
//   }
// );

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
