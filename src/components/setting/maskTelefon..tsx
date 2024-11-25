import { forwardRef } from "react";
import { IMaskInput } from "react-imask";
import { FormControl, OutlinedInput, InputLabel } from "@mui/material";
import { useDispatch } from "react-redux";
import { setPhone } from "../../store/reducers/SettingReducer";

const TextMaskCustom = forwardRef<HTMLInputElement>(function TextMaskCustom(
  props,
  ref
) {
  const { ...other } = props;
  const dispatch = useDispatch();
  return (
    <IMaskInput
      {...other}
      mask="+7 (000) 000-00-00"
      definitions={{
        "#": /[0-9]/,
      }}
      inputRef={ref}
      onAccept={(value: any) => dispatch(setPhone(value))}
    />
  );
});

export default function InputMaskTelefon() {
  return (
    <FormControl sx={{ mt: 1, width: "100%" }}>
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
          },
        }}
      />
    </FormControl>
  );
}
