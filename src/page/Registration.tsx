// src/page/Register.tsx
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { register } from "@/service/authentication.service"
import { Box, Button, Container, TextField, Typography, Alert, Paper } from "@mui/material"

const Register = () => {
  const navigate = useNavigate()
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await register({ username, email, password })
      navigate("/login")
    } catch {
      setError("Registration failed")
    }
  }

  return (
    <Container maxWidth="xs">
      <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
        <Typography variant="h5" mb={2}>
          Register
        </Typography>
        {error && <Alert severity="error">{error}</Alert>}
        <Box component="form" onSubmit={handleSubmit} mt={2}>
          <TextField
            label="Name"
            fullWidth
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField label="Email" fullWidth margin="normal" value={email} onChange={(e) => setEmail(e.target.value)} />
          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
            Register
          </Button>
          <Button onClick={() => navigate("/login")} fullWidth sx={{ mt: 1 }}>
            Already have an account? Login
          </Button>
        </Box>
      </Paper>
    </Container>
  )
}

export default Register
