declare module 'react-native' {
  import * as React from 'react';

  export interface ViewStyle {
    [key: string]: any;
  }
  export interface TextStyle {
    [key: string]: any;
  }
  export interface ImageStyle {
    [key: string]: any;
  }

  export type StyleProp<T> = T | Array<T | Falsy | RegisteredStyle<T>> | RecursiveArray<T | Falsy | RegisteredStyle<T>> | readonly (T | Falsy | RegisteredStyle<T>)[];
  type Falsy = undefined | null | false;
  type RegisteredStyle<T> = number & { __registeredStyleBrand: T };
  type RecursiveArray<T> = Array<T | RecursiveArray<T>>;

  export const View: React.ComponentType<any>;
  export const Text: React.ComponentType<any>;
  export const Image: React.ComponentType<any>;
  export const ScrollView: React.ComponentType<any>;
  export const TouchableOpacity: React.ComponentType<any>;
  export const TextInput: React.ComponentType<any>;
  export const SafeAreaView: React.ComponentType<any>;
  export const StatusBar: React.ComponentType<any> & {
    setBarStyle?: (style: any) => void;
    setBackgroundColor?: (color: string) => void;
  };
  export const Modal: React.ComponentType<any>;
  export const ActivityIndicator: React.ComponentType<any>;
  export const FlatList: React.ComponentType<any>;
  export const SectionList: React.ComponentType<any>;
  export const Pressable: React.ComponentType<any>;
  export const Switch: React.ComponentType<any>;

  export namespace StyleSheet {
    export function create<T extends Record<string, ViewStyle | TextStyle | ImageStyle>>(styles: T): T;
    export const hairlineWidth: number;
    export function absoluteFillObject(): ViewStyle;
    export const absoluteFill: ViewStyle;
  }

  export const Dimensions: {
    get(dim: 'window' | 'screen'): { width: number; height: number; scale: number; fontScale: number };
    addEventListener(type: string, handler: any): { remove: () => void };
  };

  export const Platform: {
    OS: 'web' | 'ios' | 'android';
    select: <T>(specifics: { [platform in 'web' | 'ios' | 'android' | 'default']?: T }) => T;
  };
}
