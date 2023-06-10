import { generateUUID } from './tool'

export enum THEME {
  WHITE = '#fff'
}

interface Shape {
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
    x: 40,
    y: 40
  },
  "SET": {
    x: 40,
    y: 40
  },
  "CONFIG": {
    x: 40,
    y: 40
  }
}