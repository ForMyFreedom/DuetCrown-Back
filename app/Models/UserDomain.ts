/* eslint-disable prettier/prettier */
export type Signal = '+' | '-' | ''
export type HigherSignals = '++' | '+++' | '+🌎' | '+🌎+' | '+🌎++' | '+🌎+++' | '+🌎🌎'
export type LowerSignals = '--' | '---' | '-🌎' | '-🌎-' | '-🌎--' | '-🌎---' | '-🌎🌎'
export type ExtendedSignal = Signal | HigherSignals | LowerSignals
export type Gliph = `${string}${Signal}`

function isWord(str: string): boolean {
  return /^[a-zA-Z]+$/.test(str);
}

export function isGliph(str: string): boolean {
  const signalCount = (str.match(/[+-]/g) || []).length;
  if (signalCount > 1) {
    return false
  }

  if (signalCount === 1) {
    const lastChar = str[str.length - 1];
    if (lastChar !== '+' && lastChar !== '-') {
      return false
    }
  }

  const strWithoutLast = str.slice(0, -1);

  if (!isWord(strWithoutLast)) {
    return false
  }

  return true
}


export const SignalsConst: ExtendedSignal[] = ['-🌎🌎', '-🌎---', '-🌎--', '-🌎-', '-🌎', '---', '--', '-', '', '+', '++', '+++', '+🌎', '+🌎+', '+🌎++', '+🌎+++', '+🌎🌎']
export const SimpleSignalsConst: Signal[] = ['-', '', '+']


export type Capacities<Specials extends string[]> = {
  basics: {
    strength: Gliph
    agility: Gliph
    body: Gliph
    mind: Gliph
    senses: Gliph
    charisma: Gliph
  }
  specials: { [key in Specials[number]]: Gliph },
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
  description: string
  relativeCapacity?: string
  gliph?: Gliph
}

export type Minucie = {
  // Desing: NAME [EXTRANAME?]: DESCRIPTION
  name: string
  extraName?: string
  description: string
}

export type ImagePlayerData = {
  url: string,
  xDesloc: number
  yDesloc: number
  scale: number
}

export type StringRelation = {[key: string]: string}

export type Character = {
  name: string
  nickname: string
  primaryColor: string
  image: ImagePlayerData,
  identity: StringRelation
  sumary: StringRelation
  capacities: Capacities<[]>
  stats: Stat[]
  toShowStats: {[kind in Stat['kind']]?: string[] } // string[] -> capacityName[]
  evolutions: Evolutions
  extensions: Extension[]
  moviments: Moviment[]
  things: Thing[]
  minucies: Minucie[]
  anotations: string
}
