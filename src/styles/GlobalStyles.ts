import { StylesheetCollection } from "./StylesheetCollection";

export const globalStyleCollection = StylesheetCollection.create({
  app: {
    width: "100%"
  },
  appContentContainer: {
    padding: 16,
    alignItems: "center",

    large: { padding: 32 }
  },

  image: {},

  contentContainer: {
    width: "100%",
    margin: "auto",

    large: {
      width: "80%"
    }
  },

  header1: {
    fontFamily: "serif",
    fontSize: 18,
    fontWeight: "semibold"
  },
  subHeader1: {
    fontFamily: "sans-serif",
    fontSize: 14,
    fontWeight: "regular",

    textTransform: "capitalize"
  },

  header2: {
    fontFamily: "serif",
    fontSize: 16,
    fontWeight: "semibold"
  },
  subHeader2: {
    fontFamily: "sans-serif",
    fontSize: 12,
    fontWeight: "regular",

    textTransform: "capitalize"
  },

  textSmall: {
    fontSize: 10
  },
  textMedium: {
    fontSize: 12
  },
  textLarge: {
    fontSize: 14
  },

  dividerViewStyle: {
    marginBlockStart: 6,
    marginBlockEnd: 4,

    flexDirection: 'row',
    alignItems: 'center'
  },
  dividerLineStyle: {
    marginStart: 16,
    marginEnd: 16,

    height: 1,
    flex: 1,

    backgroundColor: "black"
  },

  dividerLineStyleStart: {
    paddingEnd: 32
  },
  dividerLineStyleEnd: {
    paddingStart: 32
  },

  space: {
    padding: 4,
  },
  spacer: {
    flex: 1
  },

  textLeft: {
    textAlign: "left"
  },
  textCenter: {
    textAlign: "center"
  },
  textRight: {
    textAlign: "right"
  },

  alignStart: {
    alignItems: "flex-start"
  },
  alignCenter: {
    alignItems: "center"
  },
  alignEnd: {
    alignItems: "flex-end"
  }
});
