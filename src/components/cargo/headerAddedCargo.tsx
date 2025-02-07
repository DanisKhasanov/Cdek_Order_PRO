import { Box, Typography } from "@mui/material";
import { EditOutlined, ContentCopy, DeleteForeverOutlined } from "@mui/icons-material";
import BoxIcon from "@mui/icons-material/ArchiveTwoTone";
import { useDispatch } from "react-redux";
import { copyCargoSpace, removeCargoSpace } from "../../store/reducers/OrderReducer";

export const HeaderAddedCargo = ({ index, handleEdit }: { index: number, handleEdit: (index: number) => void }) => {
  const dispatch = useDispatch();
  return (
    <Box display="flex" alignItems="center" gap={2}>
      <BoxIcon fontSize="large" sx={{ color: "#9c6125" }} />
      <Typography fontWeight={500} fontSize={20} flex={1}>
        Грузовое место №{index + 1}
      </Typography>

      {/* <EditOutlined
        color="success"
        fontSize="medium"
        onClick={() => handleEdit(index)}
        sx={{ cursor: "pointer" }}
      />
      <ContentCopy
        color="success"
        fontSize="medium"
        onClick={() => dispatch(copyCargoSpace(index))}
        sx={{ cursor: "pointer" }}
      /> */}
      {/* <DeleteForeverOutlined
        color="error"
        fontSize="medium"
        onClick={() => dispatch(removeCargoSpace(index))}
        sx={{ cursor: "pointer" }}
      /> */}
    </Box>
  );
};
