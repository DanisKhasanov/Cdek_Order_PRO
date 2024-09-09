import { useEffect, useState } from "react";

const Popups = () => {
  const [receivedMessage, setReceivedMessage] = useState("");
  const domen = import.meta.env.VITE_DOMEN;
  // useEffect(() => {
  //   if (receivedMessage) {
  //     console.log("id клиента:", receivedMessage);
  //   }
  // }, [receivedMessage]);

  useEffect(() => {
    const handleMessage = (event: any) => {
      console.log("Данные из event", event);
      var id = event.data.objectId;
      setReceivedMessage(id);
    };
    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  useEffect(() => {
    console.log("id клиента:", receivedMessage);
  }, [receivedMessage]);

  const openModal = () => {
    const windowProps =
      "toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=no,resizable=no,width=760,height=760";
    const url = domen + "/order/";
    const popup = window.open(url, "Pop up window", windowProps);

    if (popup) {
      popup.onload = () => {
        popup.postMessage(
          {
            name: "ShowPopupRequest",
            messageId: 12,
            popupName: "somePopup",
            popupParameters: receivedMessage,
          },
          domen
        );
      };
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
