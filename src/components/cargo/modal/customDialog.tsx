import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { CustomDialogProps } from "../../../props/CustomDialogProps";

export const CustomDialog = ({
  open,
  onClose,
  title,
  content,
  actions,
  maxWidth = "sm",
  showCloseIcon = false,
  showWarningIcon = false,
}: CustomDialogProps) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth={maxWidth} >
      <DialogTitle sx={{ display: "flex", alignItems: "center" }}>
        {showWarningIcon && <WarningAmberIcon sx={{ mr: 1 }} color="warning" />}
        {title}
        {showCloseIcon && (
          <IconButton
            color="inherit"
            onClick={onClose}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: "gray",
            }}
          >
            <CloseIcon />
          </IconButton>
        )}
      </DialogTitle>

      <DialogContent>
        {typeof content === "string" ? (
          <Typography>{content}</Typography>
        ) : (
          content
        )}
      </DialogContent>

      {actions && <DialogActions>{actions}</DialogActions>}
    </Dialog>
  );
};
