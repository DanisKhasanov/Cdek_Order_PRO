import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import EditIcon from "@mui/icons-material/EditOutlined";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DeleteIcon from "@mui/icons-material/DeleteForeverOutlined";
import BoxIcon from "@mui/icons-material/ArchiveTwoTone";
import ExpandLessTwoToneIcon from "@mui/icons-material/ExpandLessTwoTone";
import ExpandMoreTwoToneIcon from "@mui/icons-material/ExpandMoreTwoTone";
import { RootState } from "../../store/store";
import {
  removeCargoSpace,
  copyCargoSpace,
} from "../../store/reducers/OrderReducer";
import EditAddedACargo from "./EditAddedCargo";
import CashOnDelivery from "./CashOnDelivery";
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  OutlinedInput,
} from "@mui/material";

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
};

const AddedCargo = () => {
  const dispatch = useDispatch();
  const packages = useSelector((state: RootState) => state.orderForm.packages);
  const [editId, setEditId] = useState<number | null>(null);
  const [showItemInfoId, setShowItemInfoId] = useState<number | null>(null);

  const [nameProduct, setNameProduct] = useState<{ [key: number]: string }>({});

  const handleEdit = (id: number) => {
    setEditId(id);
  };

  const handleCancelEdit = () => {
    setEditId(null);
  };

  const handleToggleItemInfo = (id: number) => {
    setShowItemInfoId(showItemInfoId === id ? null : id);
  };

  const changeNameProduct = (index: number, value: string) => {
    setNameProduct((prev) => ({
      ...prev,
      [index]: value,
    }));
  };
  return (
    <Box
      height="65vh"
      overflow="auto"
      sx={{
        "&::-webkit-scrollbar": {
          width: "5px",
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "#999",
          borderRadius: "4px",
        },
        "&::-webkit-scrollbar-thumb:hover": {
          backgroundColor: "#555",
        },
      }}
    >
      {packages.length > 0 ? (
        packages.map((cargo, index) => (
          <Box
            key={index}
            mb={2}
            p={2}
            border="2px solid #ddd"
            borderRadius={2}
            bgcolor="#fff"
          >
            <Box display="flex" alignItems="center" gap={2}>
              <BoxIcon fontSize="large" sx={{ color: "#9c6125" }} />
              <Typography fontWeight={500} fontSize={20} flex={1}>
                Грузовое место №{index + 1}
              </Typography>

              <EditIcon
                color="success"
                fontSize="medium"
                onClick={() => handleEdit(index)}
                sx={{ cursor: "pointer" }}
              />
              <ContentCopyIcon
                color="success"
                fontSize="medium"
                onClick={() => dispatch(copyCargoSpace(index))}
                sx={{ cursor: "pointer" }}
              />
              <DeleteIcon
                color="error"
                fontSize="medium"
                onClick={() => dispatch(removeCargoSpace(index))}
                sx={{ cursor: "pointer" }}
              />
            </Box>

            {editId === index ? (
              <EditAddedACargo
                id={index}
                weight={cargo.weight}
                size={`${cargo.length}x${cargo.width}x${cargo.height}`}
                onCancel={handleCancelEdit}
              />
            ) : (
              <>
                <CashOnDelivery />

                <Box display="flex" gap={10} mt={1}>
                  <Typography variant="caption">
                    Вес: {cargo.weight} кг.{" "}
                  </Typography>

                  <Typography variant="caption">
                    Размер коробки: {cargo.length}x{cargo.width}x{cargo.height}{" "}
                  </Typography>
                  <Typography
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
                      <ExpandLessTwoToneIcon fontSize="small" />
                    ) : (
                      <ExpandMoreTwoToneIcon fontSize="small" />
                    )}
                  </Typography>
                </Box>

                {showItemInfoId === index && (
                  <Box display="flex" flexDirection="column" mt={1}>
                    <Box sx={rowStyle}>
                      <Typography variant="caption" sx={labelStyle}>
                        Наименование товара:
                      </Typography>
                      <TextField
                        size="small"
                        value={nameProduct[index] ?? cargo.items[0].name}
                        sx={inputStyle}
                        onChange={(e) => {
                          changeNameProduct(index, e.target.value);
                        }}
                      />
                    </Box>
                    <Box sx={rowStyle}>
                      <Typography variant="caption" sx={labelStyle}>
                        Код товара/артикул:
                      </Typography>
                      <TextField
                        inputProps={{ readOnly: true }}
                        size="small"
                        value={1}
                        sx={inputStyle}
                      />
                    </Box>
                    <Box sx={rowStyle}>
                      <Typography variant="caption" sx={labelStyle}>
                        Маркировка:
                      </Typography>
                      <TextField
                        inputProps={{ readOnly: true }}
                        size="small"
                        value={index + 1}
                        sx={inputStyle}
                      />
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
                        endAdornment={
                          <InputAdornment position="end">кг</InputAdornment>
                        }
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
                        endAdornment={
                          <InputAdornment position="end">шт.</InputAdornment>
                        }
                      />
                    </Box>
                    <Box sx={rowStyle}>
                      <Typography variant="caption" sx={labelStyle}>
                        Объявленная стоимость за ед. товара:
                      </Typography>
                      <OutlinedInput
                        inputProps={{ readOnly: true }}
                        size="small"
                        endAdornment={
                          <InputAdornment position="end">₽</InputAdornment>
                        }
                        value={cargo.items[0].cost}
                        sx={inputStyle}
                      />
                    </Box>
                  </Box>
                )}
              </>
            )}
          </Box>
        ))
      ) : (
        <Typography textAlign="center" fontSize={20}>
          Добавьте грузовое место
        </Typography>
      )}
    </Box>
  );
};

export default AddedCargo;
