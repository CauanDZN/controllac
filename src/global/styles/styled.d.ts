import 'styled-components';
import 'styled-components/native';
import theme from './theme';

type ThemeType = typeof theme;

declare module 'styled-components' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type -- declaration merging pattern
  export interface DefaultTheme extends ThemeType {}
}

declare module 'styled-components/native' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type -- declaration merging pattern
  export interface DefaultTheme extends ThemeType {}
}
