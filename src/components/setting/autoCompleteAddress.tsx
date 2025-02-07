// import { forwardRef } from "react";
// import { AddressSuggestions } from "react-dadata";
// import { Box, OutlinedInput, InputLabel, FormControl } from "@mui/material";
// import { useDispatch, useSelector } from "react-redux";
// import { RootState } from "../../store/store";
// import { setCityShipment } from "../../store/reducers/SettingReducer";

// const apiKey = import.meta.env.VITE_DADATA_API_KEY;

// interface CustomInputProps {
//   label?: string;
//   value?: string;
//   onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
//   placeholder?: string;
// }

// const CustomInputAddress = forwardRef<HTMLInputElement, CustomInputProps>(
//   (props, ref) => {
//     const { label, ...other } = props;

//     return (
//       <FormControl sx={{ width: "100%", mt: 1, mb: 1 }}>
//         <InputLabel
//           sx={{
//             fontSize: "14px",
//             color: "#a2a2a2",
//             mt: "-7px",
//             "&.MuiInputLabel-shrink": {
//               transform: "translate(14px, -3px) scale(0.75)",
//             },
//           }}
//         >
//           {label}
//         </InputLabel>
//         <OutlinedInput
//           {...other}
//           inputRef={ref}
//           sx={{
//             fontSize: "14px",
//             padding: "0px",
//             border: "none",
//             backgroundColor: "#fff",
//           }}
//           fullWidth
//           label={label}
//           size="small"
//         />
//       </FormControl>
//     );
//   }
// );

// CustomInputAddress.displayName = "CustomInputAddress";

// interface AutocompleteProps {
//   label?: string;
// }

// export default function AutocompleteAddress({
//   label,
// }: AutocompleteProps) {
//   const { fromLocation } = useSelector((state: RootState) => state.setting);
//   const dispatch = useDispatch();
//   return (
//     <Box sx={{ mt: 1 }}>
//       <AddressSuggestions
//         token={apiKey}
//         onChange={(suggestion) => {
//           if (suggestion?.data) {
//             dispatch(
//               setCityShipment({
//                 city: suggestion.data.city || "",
//                 postalCode: suggestion.data.postal_code || "",
//               })
//             );
//           }
//         }}
//         defaultQuery={fromLocation.city}
//         inputProps={{
//           label: label,
//           placeholder: "Введите адрес",
//         }}
//         customInput={CustomInputAddress}
//         filterFromBound="city"
//         filterToBound="city"
//       />
//     </Box>
//   );
// }
