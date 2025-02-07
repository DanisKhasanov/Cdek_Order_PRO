import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  Paper,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { login } from "../api/api";

//  username = "danis_widget";
//  password = "FLX_cdekWidget5";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setServerError("");
    try {
      const response = await login(username, password);
      if (response.status === 200) navigate("/");
    } catch (error: any) {
      let errorMessage = "Произошла ошибка при входе, обновите страницу";
      if (error.response.data.message) {
        errorMessage = "Введите правильный логин и пароль";
      } else if (typeof error === "string") {
        errorMessage = error;
      } else {
        errorMessage = "Неизвестная ошибка";
      }
      setServerError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = username.trim() !== "" && password.trim() !== "";

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Paper
        elevation={5}
        sx={{
          p: 8,
          borderRadius: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          backgroundColor: "#f5f5f5",
        }}
      >
        <Typography variant="h4">Вход</Typography>
        <Box
          component="form"
          onSubmit={handleLogin}
          sx={{ width: "100%", mt: 2 }}
        >
          <TextField
            label="Логин"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            sx={{ mb: 2, width: "100%", backgroundColor: "#ffffff" }}
          />
          <TextField
            label="Пароль"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ mb: 2, width: "100%", backgroundColor: "#ffffff" }}
          />
          {serverError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {serverError}
            </Alert>
          )}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <Button
              variant="contained"
              type="submit"
              disabled={!isFormValid || loading}
              fullWidth
              size="large"
              sx={{
                mt: 1,
                textTransform: "none",
                backgroundColor: "#1ab248",
                "&:hover": {
                  backgroundColor: "#1ab248",
                },
              }}
            >
              {loading ? <CircularProgress size={24} /> : "Войти"}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default LoginPage;
