/* eslint-disable prettier/prettier */
export type Signal = '+' | '-' | ''
export type HigherSignals = '++' | '+++' | '+🌎' | '+🌎+' | '+🌎++' | '+🌎+++' | '+🌎🌎'
export type LowerSignals = '--' | '---' | '-🌎' | '-🌎-' | '-🌎--' | '-🌎---' | '-🌎🌎'
export type ExtendedSignal = Signal | HigherSignals | LowerSignals
export type Letter = 'SS' | 'S' | 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'FF'
export type Gliph = `${Letter}${Signal}`

export const GliphConst: Gliph[] = ['FF-', 'FF', 'FF+', 'F-', 'F', 'F+', 'E-', 'E', 'E+', 'D-', 'D', 'D+', 'C-', 'C', 'C+', 'B-', 'B', 'B+', 'A-', 'A', 'A+', 'S-', 'S', 'S+', 'SS-', 'SS', 'SS+']
export const SignalsConst: ExtendedSignal[] = ['-🌎🌎', '-🌎---', '-🌎--', '-🌎-', '-🌎', '---', '--', '-', '', '+', '++', '+++', '+🌎', '+🌎+', '+🌎++', '+🌎+++', '+🌎🌎']
export const SimpleSignalsConst: Signal[] = ['-', '', '+']


export type Capacities = {
  basics: {
    strength: Gliph
    agility: Gliph
    body: Gliph
    mind: Gliph
    senses: Gliph
    charisma: Gliph
  }
  specials: {
    ambition: Gliph
    judge: Gliph
    wish: Gliph
    will: Gliph
  }
  peculiars: { [name: string]: Gliph }
  primal: {
    kind: 'Hope' | 'Despair'
    value: number // percentage
  }
}

export type Stat = {
  kind: 'VIT' | 'DMG' | 'DEF' | 'ATK'
  naturalMod: ExtendedSignal
  relativeCapacity: string
  actual?: number // percentage
}

export type Evolutions = {
  physical: number // percentage
  espiritual: number // percentage
}

export type Extension = {
  name: string
  kind: string
  progress: number // percentage
  value: Gliph | Signal
}

export type Moviment = {
  kind: 'Peculiar' | 'Combined'
  relativeCapacity: string
  agregated: ExtendedSignal
  name: string
  description: string
  codes?: { key: string; props: object }[]
}

export type Thing = {
  name: string
  imageUrl: string
  description: string
  relativeCapacity?: string
  gliph: Gliph | ''
  applicated: boolean
  modifications?: Modification[]
}

export type Minucie = {
  name: string
  imageUrl: string
  relative?: string
  description: string
  applicated: boolean
  modifications?: Modification[]
}

export type ImagePlayerData = {
  url: string,
  xDesloc: number
  yDesloc: number
  scale: number
}

export type Modification = {
  kind: 'capacity' | 'stat'
  value: ExtendedSignal
  origin: string // thing or minucie name
  keywords: string[] // In case of capacity, is ['name']... In case of stat, is ['kind', 'relativeCapacity']
}

export type StringRelation = {[key: string]: string}

export type Character = {
  name: string
  nickname: string
  primaryColor: string
  image: ImagePlayerData,
  identity: StringRelation
  sumary: StringRelation
  capacities: Capacities
  stats: Stat[]
  toShowStats: {[kind in Stat['kind']]?: string[] } // string[] -> capacityName[]
  evolutions: Evolutions
  extensions: Extension[]
  moviments: Moviment[]
  things: Thing[]
  minucies: Minucie[]
  anotations: string
  currentMods: Modification[]
  /*
  vantage: {
    capacities: {
      [CapGrop in keyof Omit<Partial<Capacities>, 'primal'>]: {
        [Cap in keyof Partial<Capacities[CapGrop]>]: number
      }
    }
    stats: (Omit<Stat, 'naturalMod'> & {value: number})[]
  }
  */
}
