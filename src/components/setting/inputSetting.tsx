import {
  FormControl,
  OutlinedInput,
  InputAdornment,
  Typography,
  TextField,
  TextFieldProps,
  InputLabel,
} from "@mui/material";

interface InputSettingProps {
  value: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label: string;
}

// TODO: переделать на OutlinedInput
export const CustomInput = ({ label, ...props }: TextFieldProps) => {
  return (
    <TextField
      fullWidth
      label={label}
      size="small"
      margin="dense"
      InputLabelProps={{
        sx: {
          fontSize: "14px",
          color: "#a2a2a2",
        },
      }}
      sx={{
        "& .MuiInputBase-input": {
          fontSize: "14px",
        },
      }}
      {...props}
    />
  );
};

export const CustomInputBox = ({
  value,
  onChange,
  label,
}: InputSettingProps) => (
  <FormControl variant="outlined">
    <InputLabel
      sx={{
        fontSize: "14px",
        color: "#a2a2a2",
        "&.MuiInputLabel-root": { mt: 0 },
      }}
    >
      {label}
    </InputLabel>
    <OutlinedInput
      size="small"
      type="number"
      label={label}
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
          fontSize: "14px",
        },
        "& .MuiInputBase-input": {
          fontSize: "14px",
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
