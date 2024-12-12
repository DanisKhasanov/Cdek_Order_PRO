import { forwardRef } from "react";
import { AddressSuggestions } from "react-dadata";
import { Box, OutlinedInput, InputLabel, FormControl } from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";

const apiKey = import.meta.env.VITE_DADATA_API_KEY;

interface CustomInputProps {
  label?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}

const CustomInputAddress = forwardRef<HTMLInputElement, CustomInputProps>((props, ref) => {
  const { label, ...other } = props;
  
  return (
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
        {label}
      </InputLabel>
      <OutlinedInput
        {...other}
        inputRef={ref}
        sx={{
          fontSize: "14px",
          padding: "0px",
          border: "none",
          backgroundColor: "#fff",
        }}
        fullWidth
        label={label}
        size="small"
      />
    </FormControl>
  );
});

CustomInputAddress.displayName = 'CustomInputAddress';

interface AutocompleteProps {
  onChange: (value: string) => void;
  label?: string;
}

export default function AutocompleteAddress({ onChange, label }: AutocompleteProps) {
  const { cityShipment } = useSelector((state: RootState) => state.setting);

  return (
    <Box sx={{ mt: 1 }}>
      <AddressSuggestions
        token={apiKey}
        onChange={(suggestion) => {
          onChange(suggestion?.unrestricted_value || "");
        }}
        defaultQuery={cityShipment}
        inputProps={{
          label: label,
          placeholder: "Введите адрес"
        }}
        customInput={CustomInputAddress}
      />
    </Box>
  );
}