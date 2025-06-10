import { toast } from "react-toastify"

export const showToast = (type: "success" | "error", message: string) => {
  if (type === "success") {
    toast.success(message, { autoClose: 2000 })
  } else if (type === "error") {
    toast.error(message, { autoClose: 2000 })
  }
}
