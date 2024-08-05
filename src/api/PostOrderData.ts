import axios from "axios";

export const PostOrderData = async (payload: any) => {
  try {
    const response = await axios.post(
      "http://94.180.255.226:8020/order",
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
      `http://94.180.255.226:8020/barcode/${id}`,
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
      `http://94.180.255.226:8020/invoice/${id}`,
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