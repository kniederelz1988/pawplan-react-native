import Toast from "react-native-toast-message";

import type { ToastAdapter } from "./toastTypes"

export const toastAdapter: ToastAdapter = {
  show(data) {
    Toast.show({
      type: data.type,
      text1: data.title,
      text2: data.message,
      position: "bottom",
    });
  },

  hide() {
    Toast.hide();
  },
}