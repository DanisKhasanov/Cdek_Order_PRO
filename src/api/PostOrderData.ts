import axios from "axios";

export const PostOrderData = async (payload: any) => {
  try {
    const response = await axios.post(
      "https://cdek.flx-it.ruorder",
      payload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Ошибка при отправке данных на сервер:", error);
    throw error;
  }
};

export const GetBarcode = async (id: number) => {
  try {
    const response = await axios.get(
      `https://cdek.flx-it.ru/barcode/${id}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        responseType: 'blob'  
      }
    );
    
   return window.open(URL.createObjectURL(response.data))

  } catch (error) {
    console.error("Ошибка при получении шрихкодов:", error);
    throw error;
  }
};

export const GetInvoice = async (id: number) => {
  try {
    const response = await axios.get(
      `https://cdek.flx-it.ru/invoice/${id}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        responseType: 'blob'  
      }
    );

    
    return window.open(URL.createObjectURL(response.data))
  } catch (error) {
    console.error("Ошибка при получении счета:", error);
    throw error;
  }
}