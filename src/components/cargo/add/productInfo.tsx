import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { useState } from "react";
import { ExpandLessTwoTone, ExpandMoreTwoTone } from "@mui/icons-material";

export const ProductInfo = ({
  cargo,
  index,
}: {
  cargo: any;
  index: number;
}) => {
  const [showItemInfoId, setShowItemInfoId] = useState<number | null>(null);

  const handleToggleItemInfo = (id: number) => {
    setShowItemInfoId(showItemInfoId === id ? null : id);
  };

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
        <Typography variant="caption">
          Вес: {parseFloat(cargo.weight).toFixed(4)} кг.
        </Typography>

        <Typography variant="caption">
          Размер коробки: {cargo.length}x{cargo.width}x{cargo.height}
        </Typography>

        <Typography variant="caption">
          Количество товаров: {cargo.items.length}
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
          Показать товары
          {showItemInfoId === index ? (
            <ExpandLessTwoTone fontSize="small" />
          ) : (
            <ExpandMoreTwoTone fontSize="small" />
          )}
        </Typography>
      </Box>

      {showItemInfoId === index && (
        <Table sx={{ mt: 2 }}>
          <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
            <TableRow>
              <TableCell
                sx={{
                  fontSize: "0.75rem",
                  fontWeight: "bold",
                  p: "2px 5px 0px 5px",
                }}
              >
                Название товара
              </TableCell>
              <TableCell
                align="right"
                sx={{
                  fontSize: "0.75rem",
                  fontWeight: "bold",
                  p: "2px 5px 0px 5px",
                }}
              >
                Кол-во
              </TableCell>
              <TableCell
                align="right"
                sx={{
                  fontSize: "0.75rem",
                  fontWeight: "bold",
                  p: "2px 5px 0px 5px",
                }}
              >
                Вес
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cargo.items.map((item: any, itemIndex: number) => (
              <TableRow key={itemIndex}>
                <TableCell sx={{ fontSize: "0.75rem", p: "2px 5px 0px 5px" }}>
                  {item.name}
                </TableCell>
                <TableCell
                  align="right"
                  sx={{ fontSize: "0.75rem", p: "2px 5px 0px 5px" }}
                >
                  {item.amount}
                </TableCell>
                <TableCell
                  align="right"
                  sx={{ fontSize: "0.75rem", p: "2px 5px 0px 5px" }}
                >
                  {(item.weight * item.amount).toFixed(3)} кг
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Box>
  );
};
