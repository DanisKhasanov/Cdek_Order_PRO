import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  Paper,
  CircularProgress,
} from "@mui/material";
import { useEffect, useState } from "react";
import { SendingProps } from "../../props/SendingProps";

export const Sending = ({
  orderNumber,
  setOrderNumber,
  loading,
  error,
  onSubmit,
}: SendingProps) => {
  const isFormValid = orderNumber.trim() !== "";

  const [placeholderText, setPlaceholderText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  const texts = ["55555", "12345", "24242"];
  const typingSpeed = 100;
  const changeTextInterval = 2000;

  useEffect(() => {
    let charIndex = 0;
    let typingInterval: any;
    let textChangeTimeout: any;

    const typeText = () => {
      const currentText = texts[currentIndex];
      typingInterval = setInterval(() => {
        setPlaceholderText(currentText.slice(0, charIndex + 1));
        charIndex++;

        if (charIndex >= currentText.length) {
          clearInterval(typingInterval);
        }
      }, typingSpeed);
    };

    typeText();

    textChangeTimeout = setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % texts.length);
      charIndex = 0;
      setPlaceholderText("");
    }, changeTextInterval);

    return () => {
      clearInterval(typingInterval);
      clearTimeout(textChangeTimeout);
    };
  }, [currentIndex]);

  return (
    <Box>
      <Paper
        elevation={3}
        sx={{
          p: 8,
          minWidth: "30vw",
          borderRadius: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          backgroundColor: "#f5f5f5",
        }}
      >
        <Typography variant="h5" sx={{ mb: 2 }}>
          Введите номер заказа, чтобы продолжить
        </Typography>
        <Box component="form" onSubmit={onSubmit} sx={{ width: "100%", mt: 2 }}>
          <TextField
            placeholder={`Например: ${placeholderText}`}
            type="number"
            sx={{
              mb: 2,
              width: "100%",
              backgroundColor: "#fff",
              "& input[type=number]": {
                MozAppearance: "textfield",
              },
              "& input[type=number]::-webkit-outer-spin-button": {
                WebkitAppearance: "none",
                margin: 0,
              },
              "& input[type=number]::-webkit-inner-spin-button": {
                WebkitAppearance: "none",
                margin: 0,
              },
            }}
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value)}
          />
          {error && (
            <Alert severity="error" sx={{ maxWidth: "50vw" }}>
              {error}
            </Alert>
          )}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <Button
              variant="contained"
              type="submit"
              fullWidth
              size="large"
              sx={{
                mt: 1,
                textTransform: "none",
                backgroundColor: "#1ab248",
                "&:hover": {
                  backgroundColor: "#1ab248",
                },
              }}
              disabled={!isFormValid || loading}
            >
              {loading ? <CircularProgress size={24} /> : "Отправить"}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};
