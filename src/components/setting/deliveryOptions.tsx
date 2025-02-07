// import { useState } from "react";
// import {
//   Box,
//   Typography,
//   Tooltip,
//   MenuItem,
//   FormHelperText,
//   OutlinedInput,
// } from "@mui/material";
// import HelpOutlineTwoToneIcon from "@mui/icons-material/HelpOutlineTwoTone";
// import { CustomInput } from "./inputSetting";
// import { textDelivery } from "../../helpers/textTooltip";
// import InputMaskTelefon from "./maskTelefon.";
// import AutocompleteAddress from "./autoCompleteAddress";
// import { useDispatch, useSelector } from "react-redux";
// import { RootState } from "../../store/store";
// import {
//   setNameSender,
//   setTypeShipment,
//   setCityShipment,
//   setAddressShipment,
//   setDateShipment,
//   setComment,
//   setTimeShipter,
// } from "../../store/reducers/SettingReducer";

// export const DeliveryOptions = () => {
//   const { typeShipment, sender, dateShipment } = useSelector(
//     (state: RootState) => state.setting
//   );
//   const dispatch = useDispatch();
//   const [startTime, setStartTime] = useState<string>("");
//   const [endTime, setEndTime] = useState<string>("");

//   const timeChange = (start: string, end: string) => {
//     const time = `${start}-${end}`;
//     dispatch(setTimeShipter(time));
//   };

//   return (
//     <Box>
//       <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 3 }}>
//         <Tooltip title={textDelivery} placement="right">
//           <HelpOutlineTwoToneIcon color="primary" />
//         </Tooltip>
//         <Typography variant="subtitle1">2. Параметры доставки</Typography>
//       </Box>

//       <CustomInput
//         label="Название отправителя"
//         value={sender.name}
//         onChange={(e) => dispatch(setNameSender(e.target.value))}
//       />

//       <InputMaskTelefon />

//       <AutocompleteAddress
//         label="Город отправления"
        
//       />

//       <CustomInput
//         select
//         label="Тип отгрузки"
//         value={typeShipment || ""}
//         // onChange={(e) => dispatch(setTypeShipment(e.target.value))}
//       >
//         <MenuItem value="1" sx={{ fontSize: "14px" }}>
//           От склада
//         </MenuItem>
//       </CustomInput>

//       {/* {typeShipment === "door" && (
//         <>
//           <Typography variant="subtitle2" sx={{ mt: 1, ml: 1 }}>
//             2.1. Настройки вызова курьера
//           </Typography>

//           <Autocomplete
//             label="Адрес отправления"
//             onChange={(address) => dispatch(setAddressShipment(address))}
//           />

//           <CustomInput
//             select
//             label="Дата отгрузки"
//             value={dateShipment || ""}
//             onChange={(e) => dispatch(setDateShipment(e.target.value))}
//           >
//             <MenuItem value="next" sx={{ fontSize: "14px" }}>
//               На следующий день
//             </MenuItem>
//             <MenuItem value="today" sx={{ fontSize: "14px" }}>
//               В этот же день (при заказе до 15:00)
//             </MenuItem>
//           </CustomInput>

//           <FormHelperText>
//             Время вызова курьера (c 09:00 до 22:00)
//           </FormHelperText>
//           <Box
//             sx={{
//               display: "flex",
//               gap: 1,
//               flexDirection: "row",
//               alignItems: "center",
//               "& .MuiInputBase-input": {
//                 fontSize: "1.6vh",
//               },
//             }}
//           >
//             <OutlinedInput
//               fullWidth
//               size="small"
//               type="time"
//               value={startTime}
//               onChange={(e) => {
//                 setStartTime(e.target.value);
//                 timeChange(e.target.value, endTime);
//               }}
//             />
//             {"-"}
//             <OutlinedInput
//               fullWidth
//               size="small"
//               type="time"
//               value={endTime}
//               onChange={(e) => {
//                 setEndTime(e.target.value);
//                 timeChange(startTime, e.target.value);
//               }}
//             />
//           </Box>
//           <CustomInput
//             label="Комментарий к заказу"
//             multiline
//             sx={{ mt: 2 }}
//             onChange={(e) => dispatch(setComment(e.target.value))}
//           />
//         </>
//       )} */}
//     </Box>
//   );
// };
