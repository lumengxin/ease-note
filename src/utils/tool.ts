import { shapeSize, Shape, THEME } from './const'

export function generateUUID(prefix: string) {
  return prefix + "_" + "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0; var v = c === "x" ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}; 

export function getMax(arr: any, key: string) {
  return Math.max.apply(Math, arr.map((a) => a[key]))
}

export function generateCenterShape(type: string, offsetY: number = 0): Shape {
  const { w, h } = shapeSize[type]
  // const { clientHeight, clientWidth } = document.body
  return {
    x: (window.innerWidth - w) / 2,
    y: (window.innerHeight - h) / 2 - offsetY,
    w,
    h
  }
}

export function randomNum(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

export function getRandomTheme() {
  const themes = []
  for (let t in THEME) {
    themes.push(THEME[t])
  }
  debugger
  const num = randomNum(0, 5)
  return themes[num]
}