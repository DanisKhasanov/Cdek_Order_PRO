import { useEffect, useState } from "react";
import { Box, Tabs, Tab } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import HelpIcon from "@mui/icons-material/Help";
import { SettingAccount } from "./settingAccount";
import { Help } from "./help";

const NotFoundPage = () => {
  const [activeTab, setActiveTab] = useState(0);
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  useEffect(() => {
    const currentUrl = window.parent.location.href; // Получаем URL родительского окна
    console.log("Текущий URL родительского окна:", currentUrl);


    const handleMessage = (event: any) => {
      console.log("Event", event);
    };
    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);
  return (
    <Box sx={{ width: "30%", pl: 2 }}>
      <Tabs value={activeTab} onChange={handleTabChange} sx={{ height: "7vh" }}>
        <Tab
          icon={<SettingsIcon />}
          iconPosition="start"
          label="Настройки"
          sx={{ textTransform: "none", fontSize: "1.5vh" }}
        />
        <Tab
          icon={<HelpIcon />}
          iconPosition="start"
          label="Помощь"
          sx={{ textTransform: "none", fontSize: "1.5vh" }}
        />
      </Tabs>
      {activeTab === 0 && <SettingAccount />}
      {activeTab === 1 && <Help />}
    </Box>
  );
};

export default NotFoundPage;
