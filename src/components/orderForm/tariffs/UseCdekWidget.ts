import { useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/store";

const UseCdekWidget = (
  setSelectedPickupPoint: any,
  selectedTariffType: string | null
) => {
  const apiKey = import.meta.env.VITE_CDEK_API_KEY;
  const servicePath = import.meta.env.VITE_CDEK_SERVICE_PATH;
  const widgetRef = useRef<any>();
  const orderData = useSelector((state: RootState) => state.orderForm);
console.log(selectedTariffType)
  const initializeWidget = async () => {
    try {
      if ((window as any).CDEKWidget && selectedTariffType) {
        widgetRef.current = new (window as any).CDEKWidget({
          apiKey: apiKey,
          servicePath: servicePath,
          popup: true,
          from: "Казань",
          defaultLocation: orderData.to_location.address,
          hideFilters: {
            have_cashless: true,
            have_cash: true,
            is_dressing_room: true,
            type: true,
          },
          forceFilters: {
            type: selectedTariffType,
          },
          hideDeliveryOptions: {
            door: true,
          },
          onChoose(delivery: any, rate: any, address: any) {
            try {
              setSelectedPickupPoint({
                delivery,
                rate,
                address,
                type: selectedTariffType,
              });
              if (setSelectedPickupPoint) {
                widgetRef.current.close();
              }
            } catch (error) {
              console.error("Ошибка при выборе:", error);
            }
          },
          onError: function (error: any) {
            console.error("Ошибка виджета:", error);
          },
        });
      } else {
        console.error("CDEKWidget не загружен");
      }
    } catch (error) {
      console.error("Ошибка инициализации виджета:", error);
    }
  };

  useEffect(() => {
    initializeWidget();
    console.log('1')
  }, [selectedTariffType ]);

  const handleOpenWidget = () => {
    if (widgetRef.current) {
      widgetRef.current.open();
    }
  };

  return { handleOpenWidget };
};

export default UseCdekWidget;
