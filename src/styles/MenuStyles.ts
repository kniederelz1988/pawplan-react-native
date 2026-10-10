import { StylesheetCollection } from "./StylesheetCollection";

export const menuStylesCollection = StylesheetCollection.create({
  menuDialogue: {
    marginLeft: "auto",
    marginTop: 64,
    marginRight: 16,
    marginBottom: "auto",

    compact: { margin: 32 },
  },

  menuContainer: {
    minWidth: 240,

    padding: 8,

    borderRadius: 8,

    backgroundColor: "white",
  },

  headerMenuButton: {
    margin: 16,

    justifyContent: "center",
    alignContent: "center"
  },
  headerMenuButtonText: {
    fontSize: 28,
    fontFamily: "serif",
    textTransform: "capitalize"
  },

  menuButton: {
    margin: 4,
    padding: 8,

    borderRadius: 2
  }
});
