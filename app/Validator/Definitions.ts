import { ExtendedSignal, Gliph, Signal } from 'App/Models/UserDomain'
import { SchemaLiteral } from '@ioc:Adonis/Core/Validator'
export const passwordRegex = /^(?=.*([a-z]|[A-Z]))(?=.*\d)[A-Za-z\d@$!%*?&_]{8,}$/

export type GliphProp = {
  t: Gliph
  getTree(): SchemaLiteral
}

export type GliphOrSignalProp = {
  t: Gliph | Signal
  getTree(): SchemaLiteral
}

export type SignalProp = {
  t: ExtendedSignal
  getTree(): SchemaLiteral
}
