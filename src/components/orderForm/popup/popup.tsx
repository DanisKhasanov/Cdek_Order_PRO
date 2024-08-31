import { useEffect } from "react";
import { GetOrderData } from "../../../api/GetOrderData";

const Popups = () => {
  useEffect(() => {
    window.addEventListener("message", function (event) {
      var receivedMessage = event.data;
      const order = GetOrderData(receivedMessage.objectId);
      console.log(order);
    });
  }, []);

  const openModal = () => {
    const windowProps =
      "toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=no,resizable=no,width=760,height=760";
    const popup = window.open(
      "https://localhost:5174/order",
      // "https://vite-test.flx-it.ru/order",
      "somePopup",
      windowProps
    );

    if (popup) {
      popup.postMessage(
        {
          name: "ShowPopupRequest",
          messageId: 12,
          popupName: "somePopup",
        },
        // "https://vite-test.flx-it.ru"
        "https://localhost:5174"
      );
    }
  };

  return (
    <div className="popup">
      <div className="popup-content">
        <button className="button" onClick={openModal}>
          Открыть виджет
        </button>
      </div>
    </div>
  );
};

export default Popups;
