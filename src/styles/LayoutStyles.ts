import { StylesheetCollection } from "./StylesheetCollection";

export const layoutStylesCollection = StylesheetCollection.create({
  list: { },

  listContainer: { },
  listWrapper: { },

  flex1: {
    flex: 1
  },

  gapSmall: {
    gap: 4,

    large: { gap: 8 }
  },
  gapMid: {
    gap: 8,

    large: { gap: 16 }
  },
  gapLarge: {
    gap: 16,

    large: { gap: 32 }
  },


  defaultColumnContainer: {
    flexDirection: "column"
  },
  compactColumnContainer: {
    compact: { flexDirection: "column" },
  },
  mediumColumnContainer: {
    medium: { flexDirection: "column" },
  },
  largetColumnContainer: {
    large: { flexDirection: "column" }
  },

  defaultRowContainer: {
    flexDirection: "row"
  },
  compactRowContainer: {
    compact: { flexDirection: "row" },
  },
  mediumRowContainer: {
    medium: { flexDirection: "row" },
  },
  largeRowContainer: {
    large: { flexDirection: "row" }
  },

  rowContent: {
    flex: undefined,

    medium: { flex: 3 },
    large: { flex: 2 }
  },
  rowSidebar: {
    flex: 1,

    medium: { flex: 2 }
  }
});
