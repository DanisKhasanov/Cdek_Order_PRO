import { useState } from "react";
import {
  TextField,
  Button,
  MenuItem,
  Typography,
  Box,
  Checkbox,
  FormControlLabel,
  Tabs,
  Tab,
} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import HelpIcon from "@mui/icons-material/Help";

const NotFoundPage = () => {
  const [isAgreementAccepted, setIsAgreementAccepted] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  const handleAgreementChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setIsAgreementAccepted(event.target.checked);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };
  return (
    <Box sx={{ maxWidth: 500, p: 2 }}>
      <Tabs value={activeTab} onChange={handleTabChange}>
        <Tab icon={<SettingsIcon />} iconPosition="start" label="Настройки" />
        <Tab icon={<HelpIcon />} iconPosition="start" label="Помощь" />
      </Tabs>

      {activeTab === 0 && (
        <Box>
          <Typography variant="h5" sx={{ mt: 1 }}>
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

          <Typography variant="h5" sx={{ mt: 1 }}>
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
      )}

      {activeTab === 1 && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="body1" sx={{ mt: 1 }}>
            Здесь вы можете найти ответы на часто задаваемые вопросы и получить
            поддержку.
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default NotFoundPage;
