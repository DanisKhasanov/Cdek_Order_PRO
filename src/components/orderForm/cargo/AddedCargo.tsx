import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import EditIcon from "@mui/icons-material/EditOutlined";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DeleteIcon from "@mui/icons-material/DeleteForeverOutlined";
import BoxIcon from "@mui/icons-material/ArchiveTwoTone";
import ExpandLessTwoToneIcon from "@mui/icons-material/ExpandLessTwoTone";
import ExpandMoreTwoToneIcon from "@mui/icons-material/ExpandMoreTwoTone";
import { RootState } from "../../../store/store";
import {
  removeCargoSpace,
  copyCargoSpace,
} from "../../../store/reducers/OrderReducer";
import EditAddedACargo from "./EditAddedCargo";
import CashOnDelivery from "./CashOnDelivery";
import { Box, Typography, TextField } from "@mui/material";

const AddedCargo = () => {
  const dispatch = useDispatch();
  const packages = useSelector((state: RootState) => state.orderForm.packages);
  const [editId, setEditId] = useState<number | null>(null);
  const [showItemInfoId, setShowItemInfoId] = useState<number | null>(null);
  const { name_product, declared_cost } = JSON.parse(
    localStorage.getItem("settingAccount") || "{}"
  );
  const handleEdit = (id: number) => {
    setEditId(id);
  };

  const handleCancelEdit = () => {
    setEditId(null);
  };

  const handleToggleItemInfo = (id: number) => {
    setShowItemInfoId(showItemInfoId === id ? null : id);
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
                  <Box
                    display="flex"
                    flexDirection="column"
                    mt={1}
                    sx={{
                      padding: "5px 10px 0px 10px",
                      gap: 1,
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{ display: "flex", alignItems: "center" }}
                    >
                      Наименование товара:
                      <TextField
                        value={name_product}
                        variant="standard"
                    />
                    </Typography>
                    <Typography variant="caption">
                      Код товара/артикул: 1
                    </Typography>
                    <Typography variant="caption">
                      Маркировка: {index + 1}
                    </Typography>
                    <Typography variant="caption">
                      Физический вес ед. товара: {cargo.weight} кг
                    </Typography>
                    <Typography variant="caption">
                      Количество: 1
                    </Typography>
                    <Typography variant="caption">
                      Объявленная стоимость за ед. товара:{" "}
                      {(declared_cost / packages.length).toFixed(2)} руб.
                    </Typography>
                  </Box>
                )}
              </>
            )}
          </Box>
        ))
      ) : (
        <p style={{ textAlign: "center", fontSize: "20px" }}>
          Добавьте грузовое место
        </p>
      )}
    </Box>
  );
};

export default AddedCargo;
