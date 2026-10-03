import { AccessibilityInfo } from "react-native"
import Toast from "react-native-toast-message"

import type { ToastAdapter, ToastData } from "./toastTypes"

function createAccessibilityMessage({
  title,
  message,
  accessibilityMessage,
}: ToastData): string {
  return accessibilityMessage ?? [title, message].filter(Boolean).join(". ")
}

export const toastAdapter: ToastAdapter = {
  show(data) {
    Toast.show({
      type: data.type,
      text1: data.title,
      text2: data.message,
      position: "bottom",
    })

    AccessibilityInfo.announceForAccessibility(
      createAccessibilityMessage(data),
    )
  },

  hide() {
    Toast.hide()
  },
}