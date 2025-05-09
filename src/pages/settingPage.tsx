// import { useState } from "react";
// import { Box, Tabs, Tab } from "@mui/material";
// import SettingsIcon from "@mui/icons-material/Settings";
// import HelpIcon from "@mui/icons-material/Help";
// import { SettingAccount } from "../components/setting/settingAccount";
// import { Help } from "../components/setting/help";

// const SettingPage = () => {
//   const [activeTab, setActiveTab] = useState(0);
//   const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
//     setActiveTab(newValue);
//   };

//   return (
//     <Box sx={{ bgcolor: "#fff", height: "100vh" }}>
//       <Box sx={{ width: "30%", pl: 2 }}>
//         <Tabs
//           value={activeTab}
//           onChange={handleTabChange}
//           sx={{ height: "7vh" }}
//         >
//           <Tab
//             icon={<SettingsIcon />}
//             iconPosition="start"
//             label="Настройки"
//             sx={{ textTransform: "none", fontSize: "1.5vh" }}
//           />
//           <Tab
//             icon={<HelpIcon />}
//             iconPosition="start"
//             label="Помощь"
//             sx={{ textTransform: "none", fontSize: "1.5vh" }}
//           />
//         </Tabs>
//         {activeTab === 0 && <SettingAccount />}
//         {activeTab === 1 && <Help />}
//       </Box>
//     </Box>
//   );
// };

// export default SettingPage;
