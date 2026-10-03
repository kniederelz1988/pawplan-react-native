import { StylesheetCollection } from "./StylesheetCollection";


export const dialogStyleCollection = StylesheetCollection.create({
  dialogBackdrop: {
    width: "100%",
    height: "100%",

    backgroundColor: "#00003358",
  },

  dialogContainer: {
    marginVertical: "auto",
    marginHorizontal: "auto",
    
    padding: 16,

    minWidth: 180,

    borderRadius: 16,

    backgroundColor: "#FEFFFF",

    cursor: "auto"
  },
  dialogContainerButtons: {
    margin: "auto",

    padding: 4,
  },
});
