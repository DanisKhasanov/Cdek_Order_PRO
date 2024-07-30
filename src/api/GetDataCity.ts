import { PayloadAction } from '@reduxjs/toolkit';
import axios from "axios";

export const GetDataCity = async (payment:any) => {
  try {
    const response = await axios.post("http://94.180.255.226:8020/cod", payment, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("Получение данных о городе:", response.data);
    return response.data;
  } catch (error) {
    console.error("Ошибка при отправке данных на сервер:", error);
    throw error;
  }
};



