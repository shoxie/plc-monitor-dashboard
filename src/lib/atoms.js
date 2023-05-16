import { atom } from 'jotai'

export const sidebarWidth = atom(0)
export const urlAtom = atom("")
export const userAtom = atom(null)
export const selectedDeviceAtom = atom({
  voltage: "DB23,R56",
  freq: "DB23,R220",
  power: "DB23,R120",
  ampere: "DB23,R0",
  closed: "I0.1",
  tripped: "I0.2",
  device: "POM01"
},)
export const isModileAtom = atom(false)