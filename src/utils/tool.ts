export function generateUUID(prefix: string) {
  return prefix + "_" + "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0; var v = c === "x" ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}; 

export function getMax(arr: any, key: string) {
  return Math.max.apply(Math, arr.map((a) => a[key]))
}