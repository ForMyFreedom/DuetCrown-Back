// validator.ts
import { validator } from '@ioc:Adonis/Core/Validator'
import { GliphConst, SignalsConst } from 'App/Models/UserDomain'

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
  validateWith((v) => GliphConst.includes(v), 'gliph')
)

validator.rule(
  'optionalGliph',
  validateWith((v) => GliphConst.includes(v) || v === '', 'optionalGliph')
)

validator.rule(
  'optionalGliphOrSignal',
  validateWith(
    (v: any) => SignalsConst.includes(v) || GliphConst.includes(v) || v === '',
    'optionalGliphOrSignal'
  )
)

validator.rule(
  'extendedSignal',
  validateWith((v) => SignalsConst.includes(v), 'extendedSignal')
)
