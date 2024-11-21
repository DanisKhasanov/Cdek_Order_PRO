import { forwardRef } from "react";
import { AddressSuggestions } from "react-dadata";
import { Box, OutlinedInput, styled, InputLabel } from "@mui/material";

const apiKey = import.meta.env.VITE_DADATA_API_KEY;

const StyledInput = styled(OutlinedInput)({
  fontSize: "14px",
  padding: "0px",
  border: "none",
});

const Address = forwardRef<
  HTMLInputElement,
  { onChange: (event: { target: { value: string } }) => void }
>(({ onChange }, ref) => {
  return (
    <AddressSuggestions
      token={apiKey}
      onChange={(suggestion) =>
        onChange({ target: { value: suggestion?.value || "" } })
      }
      inputProps={{
        placeholder: "Город отгрузки",
        required: true,
      }}
      customInput={StyledInput}
    />
  );
});

export default function Autocomplete() {
  const handleAddressChange = (event: { target: { value: string } }) => {
    console.log("город:", event.target.value);
  };

  return (
    <Box sx={{ mt: 1 }}>
      <Address onChange={handleAddressChange} />
    </Box>
  );
}
