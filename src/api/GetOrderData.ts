import axios from "axios";

export const GetOrderData = async (id: string) => {
  try {
    const response = await axios.get(`https://cdek.flx-it.ru/ms/order/${id}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Ошибка при отправке данных на сервер:", error);
    throw error;
  }
};
