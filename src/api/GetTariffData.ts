import axios from "axios";

export const GetTariffData = async (payload: any) => {
  try {
    const response = await axios.post("https://cdek.flx-it.ru/tarifflist", payload, {
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





