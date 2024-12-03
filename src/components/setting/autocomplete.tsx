import { forwardRef } from "react";
import { AddressSuggestions } from "react-dadata";
import { Box, OutlinedInput, InputLabel, FormControl } from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";

const apiKey = import.meta.env.VITE_DADATA_API_KEY;

const CustomInput = forwardRef((props: any, ref) => (
  <FormControl sx={{ width: "100%", mt: 1, mb: 1 }}>
    <InputLabel
      sx={{
        fontSize: "14px",
        color: "#a2a2a2",
        mt: "-7px",
        "&.MuiInputLabel-shrink": {
          transform: "translate(14px, -3px) scale(0.75)",
        },
      }}
    >
     {props.label}
    </InputLabel>
    <OutlinedInput
      {...props}
      ref={ref} 
      sx={{
        fontSize: "14px",
        padding: "0px",
        border: "none",
        backgroundColor: "#fff",
      }}
      fullWidth
      label={props.label}
      size="small"
    />
  </FormControl>
));

interface AutocompleteProps {
  onChange: (value: string) => void;
  label?: string;
}

export default function Autocomplete({ onChange, label }: AutocompleteProps) {
  const { city_shipment } = useSelector((state: RootState) => state.setting);
  return (
    <Box sx={{ mt: 1 }}>
      <AddressSuggestions
        token={apiKey}
        onChange={(suggestion) => {
          onChange(suggestion?.unrestricted_value || "");
        }}
        defaultQuery={city_shipment}
        customInput={(inputProps) => <CustomInput {...inputProps} label={label} />}
      />
    </Box>
  );
}
