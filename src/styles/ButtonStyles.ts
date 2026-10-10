import colors from "./Colors";
import { StylesheetCollection } from "./StylesheetCollection";

export const buttonStylesCollection = StylesheetCollection.create({
  defaultButton: {
    margin: 4,
    padding: 8,

    borderRadius: 4,
    borderWidth: 0,
  },
  dateButton: {
    padding: 4,
    large: { padding: 8 },

    borderRadius: 8,
    borderColor: "#FFFFFF",
    borderStyle: "solid",
    borderWidth: 4,

    alignItems: "center",
    justifyContent: "center",
  },

  defaultColors: {
    backgroundColor: colors.defaultButtonBackground,
  },
  defaultColors_onHover: {
    backgroundColor: colors.defaultButtonBackground_onHover
  },
  defaultColors_onSelected: {
    borderColor: colors.defaultButtonBackground_onSelected,
  },
  defaultColors_onDisabled: {
    cursor: "auto",

    backgroundColor: colors.defaultButtonBackground_onDisabled,
  },

  cancelButton: {
    backgroundColor: colors.cancelButtonBackground,
  },
  cancelButton_onHover: {
    backgroundColor: colors.cancelButtonBackground_onHover
  },
  cancelButton_onSelected: {
    borderColor: colors.cancelButtonBackground_onSelected,
  },
  cancelButton_onDisabled: {
    backgroundColor: colors.cancelButtonBackground_onDisabled,
  },

  defaultText: {
    color: colors.defaultButtonText
  },
  defaultText_onHover: {
    color: colors.defaultButtonText_onHover
  },
  defaultText_onSelected: {
    color: colors.defaulButtonText_onSelected
  },
  defaultText_onDisabled: {
    color: colors.defaultButtonText_onDisabled
  },

  plainButton: {
    backgroundColor: colors.plainButtonBackground
  },
  plainButtonText: {
    color: colors.plainButtonText
  }
});
