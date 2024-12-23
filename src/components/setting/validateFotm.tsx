import { RootState } from "../../store/store";
export const validateForm = ({
  orderType,
  cdekClientId,
  cdekClientSecret,
  sender,
  typeShipment,
  dateShipment,
  timeShipment,
  comment,
  fromLocation,
  addressShipment,
  boxesTypes,
  defaultProductName,
  defaultDeclaredCost,
}: RootState["setting"]) => {
  const errorMessages: string[] = [];

  if (!cdekClientId) errorMessages.push("Введите ключ API");
  if (!cdekClientSecret) errorMessages.push("Введите секретный ключ");
  if (!orderType) errorMessages.push("Выберите тип заказа");
  if (!defaultProductName) errorMessages.push("Введите наименование товара");
  if (!sender.name) errorMessages.push("Введите имя отправителя");
  if (!sender.phones) errorMessages.push("Введите номер телефона");
  if (!fromLocation) errorMessages.push("Введите город отправки");
  if (!typeShipment) errorMessages.push("Выберите тип отправки");

  // if (typeShipment === "door") {
  //   if (!dateShipment) errorMessages.push("Введите дату отправки");
  //   if (!timeShipment) errorMessages.push("Введите время отправки");
  //   if (!addressShipment) errorMessages.push("Введите адрес отправки");
  //   if (!comment) errorMessages.push("Введите комментарии");
  // }

  if (!boxesTypes.some((box) => box.height && box.length && box.maxWeight && box.width))
    errorMessages.push("Введите значения в коробках");
  if (!defaultDeclaredCost || defaultDeclaredCost < 0)
    errorMessages.push("Введите заявленную стоимость");
  

  return errorMessages;
};
