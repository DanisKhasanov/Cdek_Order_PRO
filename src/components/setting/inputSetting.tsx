import {
  FormControl,
  OutlinedInput,
  InputAdornment,
  Typography,
  TextField,
  TextFieldProps,
} from "@mui/material";

type CustomInputProps = TextFieldProps & {
  label: string;
};

interface InputSettingProps {
  value: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
}

export const CustomInput = ({ label, ...props }: CustomInputProps) => {
  return (
    <TextField
      fullWidth
      label={label}
      size="small"
      margin="dense"
      InputLabelProps={{ sx: { fontSize: "1.6vh",  } }}
      inputProps={{
        style: {
          height: "2.3vh",
          fontSize: "1.6vh",
        },
      }}
      sx={{
        "& .MuiInputBase-input": {
          fontSize: "1.6vh",
          height: "2.3vh",
        },
      }}
      {...props}
    />
  );
};

export const CustomInputBox = ({
  value,
  onChange,
  placeholder,
}: InputSettingProps) => (
  <FormControl variant="outlined">
    <OutlinedInput
      size="small"
      type="number"
      placeholder={placeholder}
      value={value || ""}
      onChange={onChange}
      sx={{
        "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button":
          {
            display: "none",
          },
        "& input[type=number]": {
          MozAppearance: "textfield",
        },
        "& input::placeholder": {
          fontSize: "1.6vh",
        },
        "& .MuiInputBase-input": {
          fontSize: "1.6vh",
        },
      }}
      endAdornment={
        <InputAdornment position="end">
          <Typography sx={{ fontSize: 12, color: "gray" }}>см.</Typography>
        </InputAdornment>
      }
    />
  </FormControl>
);
