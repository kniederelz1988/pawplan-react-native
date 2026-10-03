import { useMemo } from "react";

import { useResponsiveLayout } from "./useResponsiveLayout";

import { globalStyleCollection } from "../GlobalStyles";

import { StylesheetCollection } from "@/styles/StylesheetCollection";
import { dialogStyleCollection } from "@/styles/DialogStyles";
import { menuStylesCollection } from "@/styles/MenuStyles";
import { cardStylesCollection } from "@/styles/CardStyles";
import { buttonStylesCollection } from "@/styles/ButtonStyles";
import { layoutStylesCollection } from "@/styles/LayoutStyles";

export default function useResponsiveStyles() {
  const { size } = useResponsiveLayout()

  const globalStyles  = useMemo(() => StylesheetCollection.applyLayout(size, globalStyleCollection), [size])
  const dialogStyles  = useMemo(() => StylesheetCollection.applyLayout(size, dialogStyleCollection), [size])
  const menuStyles    = useMemo(() => StylesheetCollection.applyLayout(size, menuStylesCollection), [size])
  const cardStyles    = useMemo(() => StylesheetCollection.applyLayout(size, cardStylesCollection), [size])
  const buttonStyles  = useMemo(() => StylesheetCollection.applyLayout(size, buttonStylesCollection), [size])
  const layoutStyles  = useMemo(() => StylesheetCollection.applyLayout(size, layoutStylesCollection), [size])

  return { globalStyles, dialogStyles, menuStyles, cardStyles, buttonStyles, layoutStyles }
}