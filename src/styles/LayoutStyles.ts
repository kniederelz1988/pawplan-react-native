import { StylesheetCollection } from "./StylesheetCollection";

export const layoutStylesCollection = StylesheetCollection.create({
  list: { },

  listContainer: { },
  listWrapper: { },

  flex1: {
    flex: 1
  },

  gapNone: {
    gap: 0
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

  paddingNone: {
    padding: 0
  },
  paddingSmall: {
    padding: 4,

    large: { padding: 8 }
  },
  paddingMid: {
    padding: 8,

    large: { padding: 16 }
  },
  paddingLarge: {
    padding: 16,

    large: { padding: 32 }
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
