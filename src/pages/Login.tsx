import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { login } from "@/features/authentication/authentication.service"
import { Box, Button, Container, TextField, Typography, Alert, Paper } from "@mui/material"

const Login = () => {
  const navigate = useNavigate()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await login({ username, password })
      localStorage.setItem("token", res.token)
      navigate("/dashboard")
    } catch {
      setError("Invalid username or password")
    }
  }

  return (
    <Container maxWidth="xs">
      <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
        <Typography variant="h5" mb={2}>
          Login
        </Typography>
        {error && <Alert severity="error">{error}</Alert>}
        <Box component="form" onSubmit={handleSubmit} mt={2}>
          <TextField
            defaultValue="test"
            label="Username"
            fullWidth
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            defaultValue="password"
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
            Login
          </Button>
          <Button onClick={() => navigate("/register")} fullWidth sx={{ mt: 1 }}>
            Don't have an account? Register
          </Button>
        </Box>
      </Paper>
    </Container>
  )
}

export default Login
