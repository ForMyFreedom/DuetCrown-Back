// validator.ts
import { validator } from '@ioc:Adonis/Core/Validator'
import { SignalsConst, SimpleSignalsConst, isGliph } from 'App/Models/UserDomain'

const isPercentage = (value: any) => typeof value === 'number' && value >= 0 && value <= 100

function validateWith(fn: (value: any) => any, errorKey: string) {
  return (value: any, _, options: any) => {
    if (!fn(value)) {
      options.errorReporter.report(
        options.pointer,
        errorKey,
        `${errorKey} validation failed`,
        options.arrayExpressionPointer
      )
    }
  }
}

validator.rule('percentage', validateWith(isPercentage, 'percentage'))

validator.rule(
  'gliph',
  validateWith((v) => isGliph(v), 'gliph')
)

validator.rule(
  'gliphOrSignal',
  validateWith((v: any) => SimpleSignalsConst.includes(v) || isGliph(v), 'gliphOrSignal')
)

validator.rule(
  'extendedSignal',
  validateWith((v) => SignalsConst.includes(v), 'extendedSignal')
)
