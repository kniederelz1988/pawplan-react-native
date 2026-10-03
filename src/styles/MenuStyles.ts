import { StylesheetCollection } from "./StylesheetCollection";

export const menuStylesCollection = StylesheetCollection.create({
  menu: {
    minWidth: 180,
    backgroundColor: "white",
    borderRadius: 8,
    paddingVertical: 8,
  },

  menuItem: {
    paddingHorizontal: 12,
    paddingVertical: 6,

    height: 32,

    display: "flex",
    flexDirection: "column",
    flex: 1,

    justifyContent: "center",

    backgroundColor: "beige",
  },
  menuItemHover: {
    backgroundColor: "white"
  },

  menuButton: {
    marginEnd: 16,
    paddingHorizontal: 8,

    width: 16,
    height: 16,

    fontSize: 28,
    textTransform: "capitalize"
  },
});
