import { RootState } from "../../store/store";
export const validateForm = ({
  type_order,
  key_api,
  password_api,
  name_sender,
  type_shipment,
  date_shipment,
  time_shipment,
  comment,
  city_shipment,
  address_shipment,
  phone,
  boxes,
  name_product,
  declared_cost,
}: RootState["setting"]) => {
  const errorMessages: string[] = [];

  if (!key_api) errorMessages.push("Введите ключ API");
  if (!password_api) errorMessages.push("Введите секретный ключ");
  if (!type_order) errorMessages.push("Выберите тип заказа");
  if (!name_product) errorMessages.push("Введите наименование товара");
  if (!name_sender) errorMessages.push("Введите имя отправителя");
  if (!phone) errorMessages.push("Введите номер телефона");
  if (!city_shipment) errorMessages.push("Введите город отправки");
  if (!type_shipment) errorMessages.push("Выберите тип отправки");

  if (type_shipment === "door") {
    if (!date_shipment) errorMessages.push("Введите дату отправки");
    if (!time_shipment) errorMessages.push("Введите время отправки");
    if (!address_shipment) errorMessages.push("Введите адрес отправки");
    if (!comment) errorMessages.push("Введите комментарии");
  }

  if (boxes.length === 0) errorMessages.push("Добавьте коробки");
  if (!declared_cost || declared_cost < 0)
    errorMessages.push("Введите заявленную стоимость");

  return errorMessages;
};
