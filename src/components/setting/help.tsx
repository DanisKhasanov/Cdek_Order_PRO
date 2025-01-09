import { Typography, Box } from "@mui/material";
import TelegramIcon from "@mui/icons-material/Telegram";
import IconButton from "@mui/material/IconButton";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
export const Help = () => {
  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6" sx={{ mt: 1 }}>
        Обратиться в службу поддержки
      </Typography>
      <Typography sx={{ mt: 1 }}>
        Если у вас есть вопросы, нужна помощь в настройке или вы обнаружили
        ошибку в работе приложения, то напишите нам в удобном для вас
        мессенджере. Специалист свяжется с вами в рабочее время.
      </Typography>
      <Box sx={{ mt: 2 }}>
        <IconButton
          onClick={() => window.open("https://t.me/flakonyrf", "_blank")}
        >
          <Typography>Напишите в Telegram</Typography>
          <TelegramIcon color="primary" />
        </IconButton>

        <IconButton
          onClick={() => window.open("https://api.whatsapp.com/send?phone=79393932577", "_blank")}
        >
          <Typography>Напишите в WhatsApp</Typography>
          <WhatsAppIcon color="success" />
        </IconButton>
      </Box>
    </Box>
  );
};
