import { useRef, useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/store";

const useCdekWidget = (
  setSelectedPickupPoint: any,
  selectedTariffType: any
) => {

  
  const apiKey = import.meta.env.VITE_CDEK_API_KEY;
  const servicePath = import.meta.env.VITE_CDEK_SERVICE_PATH;
  const widgetRef = useRef<any>(null);
  const orderData = useSelector((state: RootState) => state.orderForm);

  const initializeWidget = useCallback(async () => {
    try {
      if ((window as any).CDEKWidget) {
        widgetRef.current = new (window as any).CDEKWidget({
          apiKey: apiKey,
          servicePath: servicePath,
          popup: true,
          from: "Казань",
          defaultLocation: orderData.to_location.city,
          hideFilters: {
            have_cashless: true,
            have_cash: true,
            is_dressing_room: true,
            type: true,
          },
          forceFilters: {
            type: selectedTariffType === "POSTAMAT" ? "POSTAMAT" : "PVZ",
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
  }, [apiKey, servicePath, orderData.to_location.city, selectedTariffType, setSelectedPickupPoint]);

  useEffect(() => {
    initializeWidget();
    return () => {
      if (widgetRef.current) {
        widgetRef.current.close();
      }
    };
  }, [initializeWidget]);

  const handleOpenWidget = useCallback(() => {
    if (widgetRef.current) {
      widgetRef.current.open();
    }
  }, []);

  return { initializeWidget, handleOpenWidget };
};

export default useCdekWidget;
