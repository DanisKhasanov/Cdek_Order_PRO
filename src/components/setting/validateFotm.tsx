import { RootState } from "../../store/store";
export const validateForm = ({
  typeOrder,
  keyApi,
  passwordApi,
  nameSender,
  typeShipment,
  dateShipment,
  timeShipment,
  comment,
  cityShipment,
  addressShipment,
  phone,
  boxes,
  nameProduct,
  declaredCost,
}: RootState["setting"]) => {
  const errorMessages: string[] = [];

  if (!keyApi) errorMessages.push("Введите ключ API");
  if (!passwordApi) errorMessages.push("Введите секретный ключ");
  if (!typeOrder) errorMessages.push("Выберите тип заказа");
  if (!nameProduct) errorMessages.push("Введите наименование товара");
  if (!nameSender) errorMessages.push("Введите имя отправителя");
  if (!phone) errorMessages.push("Введите номер телефона");
  if (!cityShipment) errorMessages.push("Введите город отправки");
  if (!typeShipment) errorMessages.push("Выберите тип отправки");

  if (typeShipment === "door") {
    if (!dateShipment) errorMessages.push("Введите дату отправки");
    if (!timeShipment) errorMessages.push("Введите время отправки");
    if (!addressShipment) errorMessages.push("Введите адрес отправки");
    if (!comment) errorMessages.push("Введите комментарии");
  }

  if (!boxes.some((box) => box.height && box.length && box.weight && box.width))
    errorMessages.push("Введите значения в коробках");
  if (!declaredCost || declaredCost < 0)
    errorMessages.push("Введите заявленную стоимость");
  

  return errorMessages;
};
