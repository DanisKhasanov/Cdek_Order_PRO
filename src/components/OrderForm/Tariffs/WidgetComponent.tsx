  // const widgetRef = useRef();
  // const [isWidgetOpen, setIsWidgetOpen] = useState(false);

  // const [deliveryTime, setDeliveryTime] = useState(" ");
  // const [realCost, setRealCost] = useState(0);
  // const [additionalCost, setAdditionalCost] = useState(realCost + 100); 
 
 
 
 // try {
    //   widgetRef.current = new (window as any).CDEKWidget({
    //     apiKey: "f4e034c2-8c37-4168-8b97-99b6b3b268d7",
    //     servicePath: "http://127.0.0.1:8000/service.php",
    //     popup: true,
    //     defaultLocation: "Новосибирск",
    //     from: "Казань",
    //     goods: [{ length: 10, width: 20, height: 20, weight: 5 }],
    //     // sender:true,
    //     // hideDeliveryOptions: {
    //     //   door: true,
    //     // },
    //     // root: 'dev-container',
    //     hideDeliveryOptions: {
    //       // office: true,
    //       door: true,
    //     },
    //     onReady: function () {
    //       $("#linkForWidjet").css("display", "inline");
    //     },
    //     onChoose: function (_type, tariff, address) {
    //       try {
    //         $('[name="chosenPost"]').val(address.name);
    //         $('[name="addresPost"]').val(address.address);
    //         $('[name="pricePost"]').val(tariff.delivery_sum);
    //         $('[name="timePost"]').val(
    //           `${tariff.period_min}-${tariff.period_max}`
    //         );
    //         // Обновление состояния сроков и стоимости
    //         setDeliveryTime(
    //           `${tariff.period_min}-${tariff.period_max} раб. дн.`
    //         );
    //         setRealCost(tariff.delivery_sum);
    //         setAdditionalCost(tariff.delivery_sum + 100);
    //         this.close();
    //         setIsWidgetOpen(false);
    //         console.log("Выбранный пункт выдачи:", address.name);
    //         console.log("Адрес пункта:", address.address);
    //         console.log("Стоимость доставки:", tariff.delivery_sum);
    //         console.log("Сроки доставки (дней):", tariff.period_max);
    //       } catch (error) {
    //         console.error("Ошибка при выборе:", error);
    //       }
    //     },
    //     onError: function (error) {
    //       console.error("Ошибка виджета:", error);
    //       setIsWidgetOpen(false);
    //     },
    //   });
    // } catch (error) {
    //   console.error("Ошибка инициализации виджета:", error);
    // }


     // const handleOpenWidget = () => {
  //   if (widgetRef.current && !isWidgetOpen) {
  //     widgetRef.current.open();
  //     setIsWidgetOpen(true);
  //   }
  // };