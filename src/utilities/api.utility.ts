export function useApiUrl(): string {
  return import.meta.env.VITE_API_URL || "http://localhost:8080"
}
