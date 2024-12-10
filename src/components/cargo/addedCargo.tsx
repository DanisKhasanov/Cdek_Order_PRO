import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import EditAddedACargo from "./editAddedCargo";
import { Box, Typography } from "@mui/material";
import { ProductInfo } from "./productInfo";
import { HeaderAddedCargo } from "./headerAddedCargo";
import CashOnDelivery from "./cashOnDelivery";

const AddedCargo = () => {
  const packages = useSelector((state: RootState) => state.orderForm.packages);
  const [editId, setEditId] = useState<number | null>(null);

  const handleEdit = (id: number) => {
    setEditId(id);
  };

  const handleCancelEdit = () => {
    setEditId(null);
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
            <HeaderAddedCargo index={index} handleEdit={handleEdit} />

            {editId === index ? (
              <EditAddedACargo
                id={index}
                weight={cargo.weight}
                size={`${cargo.length}x${cargo.width}x${cargo.height}`}
                onCancel={handleCancelEdit}
              />
            ) : (
              <CashOnDelivery />
            )}
            <ProductInfo cargo={cargo} index={index} />
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
