import axios from "axios";

export const PostOrderData = async (payload: any) => {
  try {
    const response = await axios.post("https://cdek.flx-it.ru/order", payload, {
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

export const GetBarcode = async (id: number, account: string, name: string) => {
  try {
    const response = await axios.get(
      `https://cdek.flx-it.ru/barcode/${id}?account=${account}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        responseType: "blob",
      }
    );
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
    const response = await axios.get(
      `https://cdek.flx-it.ru/invoice/${id}?account=${account}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        responseType: "blob",
      }
    );

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
