import { useEffect, useState } from "react";
import Tooltip from "@mui/material/Tooltip";
import HelpOutlineTwoToneIcon from "@mui/icons-material/HelpOutlineTwoTone";

const Popups = () => {
  const [receivedMessage, setReceivedMessage] = useState({
    id: "",
    contextKey: "",
  });
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const domen = import.meta.env.VITE_DOMEN;
  
  useEffect(() => {
    const handleMessage = (event: any) => {
      // if (event.data.name === "Open") {
        // const id = event.data.objectId;
        const id = "9a73939a-abd1-11ef-0a80-11b5004c0849";
        setReceivedMessage((prev) => ({ ...prev, id: id }));
      // }
    };
    window.addEventListener("message", handleMessage);

    // const queryParams = new URLSearchParams(window.location.search);
    // const contextKey = queryParams.get("contextKey");
    const contextKey = "142ab7cac19e3452b2eef7d9583bb42af932acd7";

    if (contextKey) {
      setReceivedMessage((prev) => ({ ...prev, contextKey: contextKey }));
    }

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  useEffect(() => {
    console.log(receivedMessage);
    if (receivedMessage.id && receivedMessage.contextKey) {
      setIsButtonDisabled(false);
    }
  }, [receivedMessage]);

  const openModal = () => {
    const windowProps =
      "toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=no,resizable=no,width=900,height=700";
    const url = domen + "/order";
    const popup = window.open(url, "Pop up window", windowProps);

    if (popup) {
      popup.onload = () => {
        setTimeout(() => {
          popup.postMessage(
            {
              name: "ShowPopupRequest",
              messageId: 12,
              popupName: "somePopup",
              popupParameters: receivedMessage,
            },
            domen
          );
        }, 1500);
      };
    }
  };

  return (
    <div className="popup">
      <div>
        <button
          className={`button ${isButtonDisabled ? "disabled" : ""}`}
          onClick={openModal}
        //   disabled={isButtonDisabled}
        >
          {isButtonDisabled ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                fontSize: "10px",
              }}
            >
              Данные не получены
              <Tooltip
                title={
                  <span style={{ fontSize: "10px" }}>
                    Попробуйте обновить страницу <br /> или закройте карточку
                    покупателя
                  </span>
                }
                placement="right"
                arrow
                sx={{}}
              >
                <HelpOutlineTwoToneIcon
                  style={{
                    cursor: "pointer",
                    color: "rgba(5, 107, 241, 0.7)",
                    fontSize: "15px",
                  }}
                />
              </Tooltip>
            </div>
          ) : (
            "Открыть виджет"
          )}
        </button>
      </div>
    </div>
  );
};

export default Popups;
