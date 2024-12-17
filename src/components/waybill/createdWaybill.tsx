import { Box, Typography, Link } from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CircularProgress from "@mui/material/CircularProgress";
import { useState } from "react";
import { GetBarcode, GetInvoice } from "../../api/api";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { formatDateTime } from "../../helpers/formatDateTime";
import { RequestStatus } from "../../enum/RequestStatus";

const CreatedWaybill = ({
  response,
  socketId,
}: {
  response: any;
  socketId: string;
}) => {
  const [loadingBarcode, setLoadingBarcode] = useState(false);
  const [loadingInvoice, setLoadingInvoice] = useState(false);
  const packages = useSelector((state: RootState) => state.orderForm.packages);
  const orderData = useSelector((state: RootState) => state.orderForm);

  const getBarcode = async (accountId: string, orderUUID: string) => {
    setLoadingBarcode(true);

    try {
      if (!socketId) {
        throw new Error("Нет подключения к сокету");
      }
      await GetBarcode(accountId, orderUUID, socketId);
    } catch (error) {
      console.error("Ошибка при получении шрихкодов:", error);
    } finally {
      setLoadingBarcode(false);
    }
  };

  const getInvoice = async (accountId: string, orderUUID: string) => {
    setLoadingInvoice(true);
    try {
      if (!socketId) {
        throw new Error("Нет подключения к сокету");
      }
      await GetInvoice(accountId, orderUUID, socketId);
    } catch (error) {
      console.error("Ошибка при получении счета:", error);
    } finally {
      setLoadingInvoice(false);
    }
  };

  const requestStatus =
    response?.requests?.[0]?.state &&
    RequestStatus[response.requests[0].state as keyof typeof RequestStatus];

  return (
    <Box
      sx={{
        padding: 3,
        borderRadius: 2,
        boxShadow: 3,
        backgroundColor: "background.paper",
      }}
    >
      <Box sx={{ textAlign: "center", mb: 3 }}>
        <CheckCircleOutlineIcon sx={{ fontSize: 60, color: "success.main" }} />
        <Typography variant="h6" sx={{ color: "success.main", mb: 1 }}>
          Заказ успешно создан!
        </Typography>
      </Box>

      <Box
        sx={{ mb: 3, borderBottom: "1px solid", borderColor: "divider", pb: 2 }}
      >
        <Typography>
          По документу создана накладная
          <Box
            component="span"
            sx={{
              cursor: "pointer",
              fontWeight: "bold",
              mx: 1,
              color: "primary.main",
              "&:hover": { textDecoration: "underline" },
            }}
            onClick={() => getInvoice(orderData.accountId, response.uuid)}
          >
            {response?.number || "Номер недоступен"}
          </Box>
          от {formatDateTime(response.date)}
        </Typography>
      </Box>

      <Box
        sx={{ mb: 3, borderBottom: "1px solid", borderColor: "divider", pb: 2 }}
      >
        <Typography>
          <Link
            href={response.href}
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              color: "primary.main",
              fontWeight: "bold",
              textDecoration: "none",
              "&:hover": { textDecoration: "underline" },
            }}
          >
            Переход в СДЕК к заказу
          </Link>
        </Typography>
      </Box>

      <Box
        sx={{ mb: 3, borderBottom: "1px solid", borderColor: "divider", pb: 2 }}
      >
        {orderData.toLocation?.address ? (
          <Typography>
            Накладная по адрессу: {orderData.toLocation.address}
          </Typography>
        ) : (
          <Typography>
            Накладная в {orderData.deliveryPointAddress?.type}:{" "}
            {orderData.deliveryPointAddress?.city}{" "}
            {orderData.deliveryPointAddress?.address}
          </Typography>
        )}
      </Box>

      <Box
        sx={{ mb: 3, borderBottom: "1px solid", borderColor: "divider", pb: 2 }}
      >
        <Typography>
          Последний статус по накладной:{" "}
          <b>{requestStatus || "Статус недоступен"}</b> от{" "}
          {formatDateTime(response.date)}
        </Typography>
      </Box>

      {packages.length > 1 && (
        <Box sx={{ mb: 3 }}>
          <Link
            href="#"
            onClick={(e) => {
              e.preventDefault();
              getBarcode(orderData.accountId, response.uuid);
            }}
            sx={{
              color: "primary.main",
              fontWeight: "bold",
              textDecoration: "none",
              "&:hover": { textDecoration: "underline" },
            }}
          >
            Печати на штрихкоды
          </Link>
        </Box>
      )}

      {(loadingInvoice || loadingBarcode) && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mt: 2,
          }}
        >
          <CircularProgress size={25} />
          <Typography sx={{ ml: 1 }}>
            {loadingInvoice
              ? "Загрузка накладной..."
              : "Загрузка штрих-кодов..."}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default CreatedWaybill;
