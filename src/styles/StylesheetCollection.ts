import { ImageStyle, StyleProp as RNStyleProp, StyleSheet } from "react-native";
import { TextStyle, ViewStyle } from "react-native/Libraries/StyleSheet/StyleSheetTypes";
import { LayoutSize } from "./hooks/useResponsiveLayout";

export namespace StylesheetCollection {
  type Styles = TextStyle & ImageStyle & ViewStyle;
  type StyleProps<T> = {
    [N in keyof T]: RNStyleProp<Styles>;
  };

  type Style<T> = {
    [N in keyof T]: Styles;
  };
  type LayoutStyle<T> = {
    [K in LayoutSize]: Style<T>;
  };

  type Stylesheet<T> = {
    baseStyles: Style<T>;
    layoutStyles: LayoutStyle<T>;
  };

  type InputStyles = TextStyle | ImageStyle | ViewStyle;

  type InputStyle<T> = {
    [N in keyof T]: InputStyles & Partial<Record<LayoutSize, InputStyles>>
  }
  type Input<T> = InputStyle<T> | Style<any>;

  function split<T extends Input<T>>(size: LayoutSize | "base", style: Input<T>): Style<T> {
    const result = {} as Style<T>;

    Object.entries(style).forEach(([name, value]) => {
      const entry = value as Style<T> &
        Partial<Record<LayoutSize, Style<T>>>;

      const { compact, medium, large, ...baseStyle } = entry;

      result[name as keyof T] =
        (size === "base" ? baseStyle : { compact, medium, large }[size] ?? {});
    });

    return StyleSheet.create(result);
  }

  export function create<T extends Input<T>>(style: Input<T>): Stylesheet<T> {
    return {
      baseStyles: split("base", style),
      layoutStyles: {
        compact: split("compact", style),
        medium: split("medium", style),
        large: split("large", style)
      }
    };
  }

  export function applyLayout<T extends Input<T>>(size: LayoutSize, styles: Stylesheet<T>): StyleProps<T> {
    const result = {} as StyleProps<T>;

    Object.entries(styles.baseStyles).forEach(([name, value]) => {
      const key = name as keyof T;
      const base = StyleSheet.flatten<Styles>([value as Style<T>]);
      const override = StyleSheet.flatten<Styles>(styles.layoutStyles[size][key] as Style<T>);

      result[key] = StyleSheet.compose(base, override);
    });

    return result;
  }
}
