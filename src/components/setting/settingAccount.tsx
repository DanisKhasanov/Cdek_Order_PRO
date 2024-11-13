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
  const [boxes, setBoxes] = useState([
    {  length: "", width: "", height: "" },
  ]);

  const handleBoxChange = (event: React.ChangeEvent<HTMLInputElement>, index: number, field: string) => {
    const updatedBoxes = [...boxes];
    updatedBoxes[index][field] = event.target.value;
    setBoxes(updatedBoxes);
  };

  const saveBoxes = () => {
    setBoxes([...boxes, { length: "", width: "", height: "" }]);
    console.log(boxes);
  };

  const addBox = () => {
    setBoxes([
      ...boxes,
      { length: "", width: "", height: "" },
    ]);
  };

  const agreement = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsAgreementAccepted(event.target.checked);
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ mt: 1 }}>
        Подключение аккаунта
      </Typography>

      <TextField fullWidth label="Ключ API" size="small" />

      <TextField
        fullWidth
        margin="dense"
        label="Пароль API"
        size="small"
        type="password"
      />

      <TextField
        fullWidth
        select
        size="small"
        margin="dense"
        label="Тип заказа СДЭК"
      >
        <MenuItem value="1">Интернет-магазин</MenuItem>
        <MenuItem value="2">Доставка</MenuItem>
      </TextField>

      <Typography variant="h6" sx={{ mt: 1 }}>
        Параметры доставки
      </Typography>

      <TextField fullWidth select label="Тип отгрузки" size="small">
        <MenuItem value="1">От склада</MenuItem>
        <MenuItem value="2">От двери</MenuItem>
      </TextField>

      <TextField fullWidth margin="dense" label="Город отгрузки" size="small" />

      <TextField fullWidth margin="dense" label="Адрес отгрузки" size="small" />

      <Typography variant="h6" sx={{ mt: 1 }}>
        Размеры и описание упаковки
      </Typography>

      <Box>
        {boxes.map((box, index) => (
          <Box
            key={index}
            sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}
          >
            <TextField
              margin="dense"
              label="Длина"
              size="small"
              type="number"
              value={box.length || ""}
              onChange={(e) => handleBoxChange(e, index, "length")}
            />
            <Typography variant="body1">x</Typography>
            <TextField
              margin="dense"
              label="Ширина"
              size="small"
              type="number"
              value={box.width || ""}
              onChange={(e) => handleBoxChange(e, index, "width")}
            />
            <Typography variant="body1">x</Typography>
            <TextField
              margin="dense"
              label="Высота"
              size="small"
              type="number"
              value={box.height || ""}
              onChange={(e) => handleBoxChange(e, index, "height")}
            />
          </Box>
        ))}
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button variant="contained" color="success" onClick={saveBoxes}>
            Сохранить размеры
          </Button>

          <Button variant="contained" onClick={addBox}>
            Добавить коробку
          </Button>
        </Box>
      </Box>

      <FormControlLabel
        control={
          <Checkbox checked={isAgreementAccepted} onChange={agreement} />
        }
        label="Согласен с условиями пользовательского соглашения и обработки персональных данных"
        sx={{ mt: 2 }}
      />
      <Button
        variant="contained"
        sx={{ mt: 2, borderRadius: 1, textTransform: "none" }}
        disabled={!isAgreementAccepted}
      >
        Подключить
      </Button>
    </Box>
  );
};
