"use client"

import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastTitle,
} from "./toast"
import { useToast, ToasterToast } from "./use-toast"

export function Toaster() {
  const { toasts, dismiss } = useToast()

  return (
    <div className="fixed top-0 z-[100] flex flex-col items-end gap-2 p-4 max-h-screen w-full overflow-hidden">
      {toasts.map(function ({ id, title, description, variant, ...props }: ToasterToast) {
        return (
          <Toast key={id} id={id} variant={variant} {...props}>
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            <ToastClose onClick={() => dismiss(id)} />
          </Toast>
        )
      })}
    </div>
  )
}
