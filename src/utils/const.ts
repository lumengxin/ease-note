import { generateUUID } from './tool'

export enum THEME {
  WHITE = '#fff'
}

export interface Shape {
  x: number
  y: number
  w: number
  h: number
}

export interface Note {
  id: string
  shape: Shape
  content: string | HTMLDivElement
  theme: THEME
  zIndex: number
  visibility: boolean
}

export const DEFAULT_THEME = THEME.WHITE

export const DEFAULT_EDITOR: Note = {
  id: generateUUID("note"),
  shape: {
    x: 40,
    y: 40,
    w: 260,
    h: 340
  },
  content: 'write your stroy..',
  theme: DEFAULT_THEME,
  zIndex: 1,
  visibility: true,
}

export const shapeSize = {
  "NOTE": {
    w: 40,
    h: 40
  },
  "LIST": {
    w: 300,
    h: 540
  },
  "SETTING": {
    w: 756,
    h: 400
  }
}