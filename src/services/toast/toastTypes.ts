export type ToastType = "success" | "error" | "info"

export interface ToastData {
  type: ToastType
  title: string
  message?: string
  accessibilityMessage?: string
}

export interface ToastAdapter {
  show(data: ToastData): void
  hide(): void
}