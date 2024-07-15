
const order = {
    number: '45715',
    tariff_code: 137,
    comment: 'Тестовый заказ. Позвоните за час.',
    recipient: {
      name: 'Зинуров Рамазан Разябович',
      phones: [
        { number: "+79874070867" }
      ]
    },
    from_location: {
      code: 424,
      city: 'Казань',
      address: 'ул. Лебедева, 1, к8'
    },
    to_location: {
      code: 424,
      city: 'Казань',
      address: 'ул. Пушкина, 3'
    },
    packages: [
      {
        number: '1',
        weight: 1370,
        length: 20,
        width: 20,
        height: 10,
        items: [
          {
            name: 'стеклянные флаконы',
            ware_key: '1',
            weight: 1370,
            amount: 1,
            cost: 100,
            payment: {
              value: 0
            }
          }
        ]
      }
    ]
  };
  
  export default order;
  