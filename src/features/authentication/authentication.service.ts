import type { LoginRequest } from "@/features/authentication/loginRequest.type"
import type { RegisterRequest } from "@/features/authentication/reqisterRequest.type"
import type { AuthenticationResponse } from "@/features/authentication/authenticationResponse.type"

const serviceUrl = import.meta.env.VITE_API_URL || "http://localhost:8080"
const baseUrl = `${serviceUrl}/api/v1/authentication`

export async function logout(): Promise<void> {
  const token = localStorage.getItem("token")
  if (!token) return

  const response = await fetch(`${baseUrl}/logout`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  if (!response.ok) {
    console.warn("Logout failed:", response.statusText)
  }
}

export async function login(request: LoginRequest): Promise<AuthenticationResponse> {
  const response = await fetch(`${baseUrl}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request)
  })

  if (!response.ok) {
    throw new Error("Login failed")
  }

  return await response.json()
}

export async function register(request: RegisterRequest): Promise<void> {
  const response = await fetch(`${baseUrl}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request)
  })

  if (!response.ok) {
    throw new Error("Registration failed")
  }
}
