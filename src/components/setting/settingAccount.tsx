import {
    TextField,
    Button,
    MenuItem,
    Typography,
    Box,
    Checkbox,
    FormControlLabel,
  } from "@mui/material";
import { useState } from "react";

export const SettingAccount = () => {
  const [isAgreementAccepted, setIsAgreementAccepted] = useState(false);

  const handleAgreementChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsAgreementAccepted(event.target.checked);
  };
  return (
    <Box>
      <Typography variant="h6" sx={{ mt: 1 }}>
      Подключение аккаунта
    </Typography>

    <TextField fullWidth margin="dense" label="Ключ API" name="api-key" />

    <TextField
      fullWidth
      margin="dense"
      label="Пароль API"
      type="password"
      name="password-api"
    />

    <TextField
      fullWidth
      select
      margin="dense"
      label="Тип заказа СДЭК"
      name="order-type"
    >
      <MenuItem value="1">Интернет-магазин</MenuItem>
      <MenuItem value="2">Доставка</MenuItem>
    </TextField>

    <Typography variant="h6" sx={{ mt: 1 }}>
      Параметры доставки
    </Typography>

    <TextField
      fullWidth
      select
      margin="dense"
      label="Тип отгрузки"
      name="delivery-type"
    >
      <MenuItem value="1">От склада</MenuItem>
      <MenuItem value="2">От двери</MenuItem>
    </TextField>

    <TextField
      fullWidth
      margin="dense"
      label="Город отгрузки"
      name="delivery-city"
    />

    <TextField
      fullWidth
      margin="dense"
      label="Адрес отгрузки"
      name="delivery-address"
    />
    
    <FormControlLabel
      control={
        <Checkbox
          checked={isAgreementAccepted}
          onChange={handleAgreementChange}
        />
      }
      label="Согласен с условиями пользовательского соглашения и обработки персональных данных"
      sx={{ mt: 2 }}
    />
    <Button
      variant="contained"
      sx={{ mt: 2, borderRadius: 2 }}
      disabled={!isAgreementAccepted}
    >
      Подключить
    </Button>
    </Box>
  );
};
