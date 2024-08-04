export type RGB = `rgb(${number}, ${number}, ${number})`;
export type RGBA = `rgba(${number}, ${number}, ${number}, ${number})`;
export type HEX = `#${string}`;
export type Theme = `var(--${string})`;
export type PX = `${number}px`;
export type CSSPercentage = `${number}%`;

export type SizeValue =
  | `${number}px`
  | `${number}em`
  | `${number}%`
  | `${number}rem`
  | `${number}vw`
  | `${number}vh`
  | `${number}vmin`
  | `${number}vmax`
  | `${number}ch`
  | number
  | Theme;

export type Color = RGB | RGBA | HEX | Theme;

export type JustifyContent =
  | 'flex-start'
  | 'flex-end'
  | 'center'
  | 'space-between'
  | 'space-around'
  | 'space-evenly'
  | 'start'
  | 'end'
  | 'left'
  | 'right';