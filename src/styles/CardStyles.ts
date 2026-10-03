import colors from "./Colors";
import { StylesheetCollection } from "./StylesheetCollection";

export const cardStylesCollection = StylesheetCollection.create({
  item: {
    borderRadius: 12,
    borderColor: "#D8D8D8",
    borderWidth: 1,
    borderStyle: "solid",

    backgroundColor: "#FEFFFF",

    flex: 1,
  },

  itemWrapper: {
    width: "100%",
    aspectRatio: 1,

    flexDirection: "column"
  },

  itemHeader: {
    flex: 1
  },

  overlayContainer: {
    display: "flex",
    flex: 1,
    flexDirection: "row",

    gap: 16,

    zIndex: 1
  },
  overlayItem: {
    backgroundColor: "#ffffff80",

    borderRadius: "50%",
    borderColor: "black",
    borderWidth: 1,

    position: "absolute",
    zIndex: 1
  },
  overlayItemContent: {
    width: "100%",
    height: "100%",

    alignItems: "center",
    justifyContent: "center"
  },

  itemImageContainer: {
    height: "100%",
  },

  itemImage: {
    width: "100%",
    height: "100%",

    resizeMode: "cover",

    backgroundColor: colors.highlightColor,

    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },

  itemContent: {
    padding: 16,
  },

  itemButtons: {
    marginBlockStart: "auto"
  }
});
