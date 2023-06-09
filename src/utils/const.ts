import { generateUUID } from './tool'

export enum THEME {
  WHITE = '#fff'
}

export const DEFAULT_THEME = THEME.WHITE

export const DEFAULT_EDITOR = {
  id: generateUUID("note"),
  shape: {
    x: 40,
    y: 40,
    w: 260,
    h: 340
  },
  content: 'write your stroy..',
  theme: DEFAULT_THEME,
  zIndex: 1
}