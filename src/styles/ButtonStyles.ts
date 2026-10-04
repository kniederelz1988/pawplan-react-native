import { StylesheetCollection } from "./StylesheetCollection";

export const buttonStylesCollection = StylesheetCollection.create({
  dateButton: {
    padding: 16,

    borderRadius: 8,
    borderColor: "#FFFFFF",
    borderStyle: "solid",
    borderWidth: 2,

    backgroundColor: "#2196f3",

    alignItems: "center",
    justifyContent: "center",
  },

  dateButtonContent: {
    color: "white",
  },
  dateButtonSelected: {
    borderColor: "#000000",
  },

  dateButtonDisabled: {
    cursor: "auto",

    backgroundColor: "#2195f37c",
  }
});
