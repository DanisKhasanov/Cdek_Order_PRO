import CloseIcon from "@mui/icons-material/Close";
import { Box, Typography, List, ListItem } from "@mui/material";

const UncreatedWaybill = ({
  response,
  errors,
}: {
  response: any;
  errors: any;
}) => {
  return (
    <Box
      sx={{
        padding: 3,
        borderRadius: 2,
        boxShadow: 3,
        backgroundColor: "background.paper",
      }}
    >
      <Box sx={{ textAlign: "center", mb: 3 }}>
        <CloseIcon sx={{ fontSize: 60, color: "red" }} />
        <Typography variant="h6" sx={{ color: "red", mt: 2 }}>
          Не удалось создать заказ!
        </Typography>
      </Box>

      {response?.requests?.[0]?.errors?.length > 0 && (
        <Box sx={{ mt: 2,  borderBottom: "1px solid", borderColor: "divider", pb: 2}}>
          <List>
            {response.requests[0].errors.map((err: any) => (
              <ListItem key={err.code} sx={{ color: "red" }}>
                {err.message}
              </ListItem>
            ))}
          </List>
        </Box>
      )}

      {errors.length > 0 && (
        <Box sx={{ mt: 2,  borderBottom: "1px solid", borderColor: "divider", pb: 2 }}>
          <List>
            {errors.map((error:any, index:any) => (
              <ListItem key={index} sx={{ color: "red" }}>
                {error}
              </ListItem>
            ))}
          </List>
        </Box>
      )}
    </Box>
  );
};

export default UncreatedWaybill;
