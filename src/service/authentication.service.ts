const serviceUrl = import.meta.env.VITE_API_URL || "http://localhost:8080"
const baseUrl = `${serviceUrl}/api/v1/authentication`

export interface LoginRequest {
  username: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  username: string
}

export interface AuthResponse {
  token: string
}

export async function logout(): Promise<void> {
  const token = localStorage.getItem("token")
  if (!token) return

  const res = await fetch(`${baseUrl}/logout`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  if (!res.ok) {
    console.warn("Logout failed:", res.statusText)
  }
}

export async function login(request: LoginRequest): Promise<AuthResponse> {
  const res = await fetch(`${baseUrl}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request)
  })

  if (!res.ok) {
    throw new Error("Login failed")
  }

  return await res.json()
}

export async function register(request: RegisterRequest): Promise<void> {
  const res = await fetch(`${baseUrl}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request)
  })

  if (!res.ok) {
    throw new Error("Registration failed")
  }

}
