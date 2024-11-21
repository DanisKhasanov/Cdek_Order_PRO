import { forwardRef } from "react";
import { IMaskInput } from "react-imask";
import { FormControl, OutlinedInput, InputLabel } from "@mui/material";

interface CustomProps {
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string;
}

const TextMaskCustom = forwardRef<HTMLInputElement, CustomProps>(
  function TextMaskCustom(props, ref) {
    const { onChange, ...other } = props;
    return (
      <IMaskInput
        {...other}
        mask="+7 (000) 000-00-00"
        definitions={{
          "#": /[0-9]/,
        }}
        // inputRef={ref}
        onAccept={(value: any) =>
          onChange({ target: { name: props.name, value } })
        }
        // overwrite
      />
    );
  }
);

export default function InputMaskTelefon() {
  return (
    <FormControl
      variant="outlined"
      sx={{ mt: 1, width: "100%", textAlign: "center" }}
    >
      <InputLabel sx={{ fontSize: "14px", color: "#a2a2a2" }}>
        Телефон отправителя
      </InputLabel>
      <OutlinedInput
        fullWidth
        label="Телефон отправителя"
        size="small"
        inputComponent={TextMaskCustom as any}
        sx={{
          "& .MuiInputBase-input": {
            fontSize: "14px",
            height: "15px",
          },
        }}
      />
    </FormControl>
  );
}
