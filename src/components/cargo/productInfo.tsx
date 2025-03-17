import { Box, Typography, Tooltip } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { useState } from "react";
import { updateOrderForm } from "../../store/reducers/OrderReducer";
import {
  ExpandLessTwoTone,
  ExpandMoreTwoTone,
  HelpOutlineTwoTone,
} from "@mui/icons-material";
import { TextField, InputAdornment, OutlinedInput } from "@mui/material";
import { textNameProductCargo } from "../../helpers/textTooltip";

const rowStyle = {
  display: "flex",
  alignItems: "center",
  mt: 1,
};

const labelStyle = {
  minWidth: 250,
};

const inputStyle = {
  width: "35%",
  "& .MuiInputBase-input": {
    fontSize: 12,
  },
  "& .MuiTypography-root": { fontSize: "12px" },
  "& .MuiFormHelperText-root": {
    fontSize: "10px",
  },
};

export const ProductInfo = ({
  cargo,
  index,
}: {
  cargo: any;
  index: number;
}) => {
  const dispatch = useDispatch();
  const orderData = useSelector((state: RootState) => state.orderForm);
  const packages = useSelector((state: RootState) => state.orderForm.packages);
  const [showItemInfoId, setShowItemInfoId] = useState<number | null>(null);
  const [nameProduct, setNameProduct] = useState<{ [key: number]: string }>({});

  const handleToggleItemInfo = (id: number) => {
    setShowItemInfoId(showItemInfoId === id ? null : id);
  };

  const changeNameProduct = (index: number, value: string) => {
    setNameProduct((prev) => ({
      ...prev,
      [index]: value,
    }));
    dispatch(
      updateOrderForm({
        ...orderData,
        packages: packages.map((pkg, i) =>
          i === index
            ? {
                ...pkg,
                items: [
                  {
                    ...pkg.items[0],
                    name: value,
                  },
                ],
              }
            : pkg
        ),
      })
    );
  };

  return (
    <Box>
      <Box display="flex" gap={10} mt={1}>
        <Typography variant="caption">Вес: {cargo.weight / 1000} кг.</Typography>

        <Typography variant="caption">
          Размер коробки: {cargo.length}x{cargo.width}x{cargo.height}
        </Typography>

        <Typography variant="caption">
          Количество товаров: {cargo.items.length}
        </Typography>

        {/* <Typography
          variant="caption"
          onClick={() => handleToggleItemInfo(index)}
          sx={{
            display: "flex",
            alignItems: "center",
            cursor: "pointer",
          }}
        >
          Информация о товаре
          {showItemInfoId === index ? (
            <ExpandLessTwoTone fontSize="small" />
          ) : (
            <ExpandMoreTwoTone fontSize="small" />
          )}
        </Typography> */}
      </Box>

      {/* {showItemInfoId === index && (
        <Box display="flex" flexDirection="column" mt={1}>
          <Box sx={rowStyle}>
            <Typography
              variant="caption"
              sx={{
                ...labelStyle,
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                mb: 2,
              }}
            >
              Наименование товара
              <Tooltip title={textNameProductCargo} placement="right">
                <HelpOutlineTwoTone color="primary" fontSize="inherit" />
              </Tooltip>
            </Typography>
            <TextField
              size="small"
              value={nameProduct[index] ?? cargo.items[0].name}
              sx={inputStyle}
              onChange={(e) => changeNameProduct(index, e.target.value)}
              autoFocus
              helperText="Вы можете изменить наименование товара"
            />
          </Box>
          <Box sx={rowStyle}>
            <Typography variant="caption" sx={labelStyle}>
              Код товара/артикул:
            </Typography>
            <TextField inputProps={{ readOnly: true }} size="small" value={1} sx={inputStyle} />
          </Box>
          <Box sx={rowStyle}>
            <Typography variant="caption" sx={labelStyle}>
              Маркировка:
            </Typography>
            <TextField inputProps={{ readOnly: true }} size="small" value={index + 1} sx={inputStyle} />
          </Box>
          <Box sx={rowStyle}>
            <Typography variant="caption" sx={labelStyle}>
              Физический вес ед. товара:
            </Typography>
            <OutlinedInput
              inputProps={{ readOnly: true }}
              size="small"
              value={cargo.weight}
              sx={inputStyle}
              endAdornment={<InputAdornment position="end">кг.</InputAdornment>}
            />
          </Box>
          <Box sx={rowStyle}>
            <Typography variant="caption" sx={labelStyle}>
              Количество:
            </Typography>
            <OutlinedInput
              inputProps={{ readOnly: true }}
              size="small"
              value={1}
              sx={inputStyle}
              endAdornment={<InputAdornment position="end">шт.</InputAdornment>}
            />
          </Box>
          <Box sx={rowStyle}>
            <Typography variant="caption" sx={labelStyle}>
              Объявленная стоимость за ед. товара:
            </Typography>
            <OutlinedInput
              inputProps={{ readOnly: true }}
              size="small"
              endAdornment={<InputAdornment position="end">₽</InputAdornment>}
              value={(cargo.items[0].cost / packages.length).toFixed(2)}
              sx={inputStyle}
            />
          </Box>
        </Box>
      )} */}
    </Box>
  );
};