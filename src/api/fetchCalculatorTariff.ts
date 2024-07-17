// try {
//     const response = await axios.post(
//       "https://api.edu.cdek.ru/v2/calculator/tariff",
//       payload,
//       {
//         headers: {
//           "Content-Type": "application/json",
//         },
//       }
//     );
//     console.log("Ответ сервера:", response.data);
//     navigate("/tariffs"); // Переход на следующую страницу после успешного запроса
//   } catch (error) {
//     console.error("Ошибка при отправке запроса:", error);
//   }
// };

//TODO: запрос либо в бэкенд либо по API cdek для калькулятора тарифа. При этом надо отфильтровать по Режимы доставки = delivery_mode (склад-ПВЗ, склад-дверь, склад-постомат)

const fakeResponse = {
  tariff_codes: [
    {
      tariff_code: 1,
      tariff_name: "До ПВЗ",
      tariff_description:
      "Классическая экспресс-доставка документов и грузов по всей территории России по принципу «от двери до двери» со стандартными сроками доставки",
      delivery_mode: 1,
      delivery_sum: 1135.0,
      period_min: 2,
      period_max: 2,
    },
    {
      tariff_code: 483,
      tariff_name: "Экспресс до ПВЗ",
      tariff_description: "Экспресс-доставка",
      delivery_mode: 4,
      delivery_sum: 1000.0,
      period_min: 2,
      period_max: 3,
      calendar_min: 2,
      calendar_max: 3,
    },
    // {
    //   tariff_code: 11,
    //   tariff_name: "До Постомата",
    //   tariff_description:
    //   "Отправитель самостоятельно доставляет груз/документы в офис СД «Экспресс-курьер», получатель самостоятельно забирает груз/документы в офисе СД «Экспресс-курьер»",
    //   delivery_mode: 4,
    //   delivery_sum: 560.0,
    //   period_min: 1,
    //   period_max: 4,
    // },
    // {
    //   tariff_code: 486,
    //   tariff_name: "Экспресс До Постамата",
    //   tariff_description: "Экспресс-доставка",
    //   delivery_mode: 7,
    //   delivery_sum: 1000.0,
    //   period_min: 2,
    //   period_max: 3,
    //   calendar_min: 2,
    //   calendar_max: 3,
    // },
    {
      tariff_code: 10,
      tariff_name: "До Двери",
      tariff_description:
        "Отправитель самостоятельно доставляет груз/документы в офис СД «Экспресс-курьер», получатель самостоятельно забирает груз/документы в офисе СД «Экспресс-курьер»",
      delivery_mode: 4,
      delivery_sum: 960.0,
      period_min: 1,
      period_max: 5,
    },
    {
      tariff_code: 485,
      tariff_name: "Экспресс До Двери",
      tariff_description: "Экспресс-доставка",
      delivery_mode: 6,
      delivery_sum: 1080.0,
      period_min: 2,
      period_max: 3,
      calendar_min: 2,
      calendar_max: 3,
    },
    
  ],
};

export default fakeResponse;
