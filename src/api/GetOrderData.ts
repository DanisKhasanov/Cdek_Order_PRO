import axios from "axios";

export const GetOrderData = async (payload: any) => {
  try {
    const response = await axios.post("https://jsonplaceholder.typicode.com/posts", payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("Получение данных:", response.data);
    return response.data;
  } catch (error) {
    console.error("Ошибка при отправке данных на сервер:", error);
    throw error;
  }
};





