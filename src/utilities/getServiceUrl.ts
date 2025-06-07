/**
 * Copyright (c) Tomasz Wnuk
 */

export default function getServiceUrl(module: string): string | undefined {
  if (import.meta.env.VITE_APP_MODE === "monolith") {
    return import.meta.env.VITE_BACKEND_URL
  }

  if (import.meta.env.VITE_APP_MODE === "microservices") {
    if (["calendars", "categories"].includes(module)) {
      return import.meta.env.VITE_CC_URL
    }

    if (["events", "tasks", "notes"].includes(module)) {
      return import.meta.env.VITE_TEN_URL
    }
  }
  return undefined
}
