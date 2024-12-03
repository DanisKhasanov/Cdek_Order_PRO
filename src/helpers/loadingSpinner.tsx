import { Box, CircularProgress } from "@mui/material";

export const LoadingSpinner = () => (
  <Box display="flex" flexDirection="column" alignItems="center">
    <CircularProgress size={25} />
    <p>Загрузка...</p>
  </Box>
);
