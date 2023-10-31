import { schema, rules, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import {
  GliphOrSignalProp,
  GliphProp,
  ModificationsKindProp,
  SignalProp,
  passwordRegex,
} from './Definitions'

const ModificationsSchema = {
  kind: schema.enum(['capacity', 'stat'] as const) as ModificationsKindProp,
  value: schema.string([rules.extendedSignal()]) as SignalProp,
  origin: schema.string(),
  keywords: schema.array().members(schema.string()),
}

export default class UserValidator {
  constructor(protected ctx: HttpContextContract) {}

  public async validate(isUpdate: boolean) {
    const schema: any = UserValidator.schema
    if (isUpdate) {
      delete schema.tree.password
      delete schema.tree.registerToken
    }
    return await this.ctx.request.validate({ schema: schema, messages: this.messages })
  }

  private static capacitySchema = schema.object().members({
    basics: schema.object().members({
      strength: schema.string([rules.gliph()]) as GliphProp,
      agility: schema.string([rules.gliph()]) as GliphProp,
      body: schema.string([rules.gliph()]) as GliphProp,
      mind: schema.string([rules.gliph()]) as GliphProp,
      senses: schema.string([rules.gliph()]) as GliphProp,
      charisma: schema.string([rules.gliph()]) as GliphProp,
    }),
    peculiars: schema.object().anyMembers(),
    specials: schema.object().members({
      ambition: schema.string([rules.gliph()]) as GliphProp,
      judge: schema.string([rules.gliph()]) as GliphProp,
      wish: schema.string([rules.gliph()]) as GliphProp,
      will: schema.string([rules.gliph()]) as GliphProp,
    }),
    primal: schema.object().members({
      kind: schema.enum(['Hope', 'Despair'] as const),
      value: schema.number([rules.percentage()]),
    }),
  })

  private static statsSchema = schema.array.optional().members(
    schema.object().members({
      kind: schema.enum(['VIT', 'DMG', 'DEF', 'ATK'] as const),
      naturalMod: schema.string.optional([rules.extendedSignal()]) as SignalProp,
      relativeCapacity: schema.string(),
      actual: schema.number.optional([rules.percentage()]),
    })
  )

  private static evolutionSchema = schema.object.optional().members({
    physical: schema.number([rules.percentage()]),
    espiritual: schema.number([rules.percentage()]),
  })

  private static extensionsSchema = schema.array.optional().members(
    schema.object().members({
      name: schema.string(),
      kind: schema.string(),
      progress: schema.number([rules.percentage()]),
      value: schema.string.optional([rules.optionalGliphOrSignal()]) as GliphOrSignalProp,
    })
  )

  private static movimentsSchema = schema.array.optional().members(
    schema.object().members({
      kind: schema.enum(['Peculiar', 'Combined'] as const),
      relativeCapacity: schema.string(),
      agregated: schema.string.optional([rules.extendedSignal()]) as SignalProp,
      name: schema.string(),
      description: schema.string(),
      codes: schema.array.optional().members(
        schema.object().members({
          key: schema.string(),
          props: schema.object().anyMembers(),
        })
      ),
    })
  )

  private static thingsSchema = schema.array.optional().members(
    schema.object().members({
      name: schema.string(),
      description: schema.string(),
      relativeCapacity: schema.string.optional(),
      gliph: schema.string.optional([rules.optionalGliph()]) as GliphProp,
      applicated: schema.boolean(),
      modifications: schema.array.optional().members(schema.object().members(ModificationsSchema)),
    })
  )

  private static minucesSchema = schema.array.optional().members(
    schema.object().members({
      name: schema.string(),
      relative: schema.string.optional(),
      description: schema.string(),
      applicated: schema.boolean(),
      modifications: schema.array.optional().members(schema.object().members(ModificationsSchema)),
    })
  )

  private static toShowStatsSchema = schema.object.optional().members({
    ATK: schema.array.optional().members(schema.string()),
    DEF: schema.array.optional().members(schema.string()),
    DMG: schema.array.optional().members(schema.string()),
    VIT: schema.array.optional().members(schema.string()),
  })

  private static imageSchema = schema.object().members({
    url: schema.string([rules.url()]),
    xDesloc: schema.number(),
    yDesloc: schema.number(),
    scale: schema.number(),
  })

  private static modificationsSchema = schema.array
    .optional()
    .members(schema.object().members(ModificationsSchema))

  /* // @
  private static vantageSchema = schema.object.optional().members({
    capacities: schema.object().anyMembers() as any, // @
    stats: schema.object().anyMembers() as any, // @
  })
  */

  public static schema = schema.create({
    name: schema.string({ trim: true }),
    registerToken: schema.string({ trim: true }, [
      rules.exists({ table: 'api_tokens', column: 'token' }),
    ]),
    password: schema.string({ trim: true }, [rules.regex(passwordRegex)]),
    nickname: schema.string({ trim: true }),
    primaryColor: schema.string([rules.regex(/\#[0-9a-f]{6}/)]),
    image: this.imageSchema,
    anotations: schema.string.optional({ trim: true }),
    identity: schema.object.optional().anyMembers(),
    sumary: schema.object.optional().anyMembers(),
    capacities: this.capacitySchema,
    stats: this.statsSchema,
    toShowStats: this.toShowStatsSchema,
    evolutions: this.evolutionSchema,
    extensions: this.extensionsSchema,
    moviments: this.movimentsSchema,
    things: this.thingsSchema,
    minucies: this.minucesSchema,
    currentMods: this.modificationsSchema,
    // @vantage: this.vantageSchema,
  })

  public messages: CustomMessages = {
    'name.required': 'O nome é obrigatório',
    'name.string': 'O nome deve ser uma string',
    'name.trim': 'O nome não pode ter espaços no começo ou no fim',
    'password.required': 'A senha é obrigatória',
    'password.string': 'A senha deve ser uma string',
    'password.trim': 'A senha não pode ter espaços no começo ou no fim',
    'password.regex': 'A senha deve ter no mínimo 8 caracteres, sendo 1 letra e 1 número',
    'nickname.required': 'O apelido é obrigatório',
    'nickname.string': 'O apelido deve ser uma string',
    'nickname.trim': 'O apelido não pode ter espaços no começo ou no fim',
    'primaryColor.required': 'A cor primária é obrigatória',
    'primaryColor.string': 'A cor primária deve ser uma string',
    'primaryColor.regex': 'A cor primária deve ser uma cor hexadecimal',
    'image.required': 'A imagem é obrigatória',
    'image.string': 'A imagem deve ser uma string',
    'image.trim': 'A imagem não pode ter espaços no começo ou no fim',
    'image.url': 'A imagem deve ser uma URL válida',
    'anotations.string': 'As anotações devem ser uma string',
    'anotations.trim': 'As anotações não podem ter espaços no começo ou no fim',
    'identity.anyMembers': 'A identidade deve ser um objeto',
    'sumary.anyMembers': 'O sumário deve ser um objeto',
    'capacities.object': 'As capacidades devem ser um objeto',
    'capacities.basics.object': 'As capacidades básicas devem ser um objeto',
    'capacities.basics.strength.string': 'A força deve ser uma string',
    'capacities.basics.strength.gliph': 'A força deve ser um glifo',
    'capacities.basics.agility.string': 'A agilidade deve ser uma string',
    'capacities.basics.agility.gliph': 'A agilidade deve ser um glifo',
    'capacities.basics.body.string': 'O corpo deve ser uma string',
    'capacities.basics.body.gliph': 'O corpo deve ser um glifo',
    'capacities.basics.mind.string': 'A mente deve ser uma string',
    'capacities.basics.mind.gliph': 'A mente deve ser um glifo',
    'capacities.basics.senses.string': 'Os sentidos devem ser uma string',
    'capacities.basics.senses.gliph': 'Os sentidos devem ser um glifo',
    'capacities.basics.charisma.string': 'O carisma deve ser uma string',
    'capacities.basics.charisma.gliph': 'O carisma deve ser um glifo',
    'capacities.specials.object': 'As capacidades especiais devem ser um objeto',
    'capacities.specials.ambition.string': 'A ambição deve ser uma string',
    'capacities.specials.ambition.gliph': 'A ambição deve ser um glifo',
    'capacities.specials.judge.string': 'O julgamento deve ser uma string',
    'capacities.specials.judge.gliph': 'O julgamento deve ser um glifo',
    'capacities.specials.wish.string': 'O desejo deve ser uma string',
    'capacities.specials.wish.gliph': 'O desejo deve ser um glifo',
    'capacities.specials.will.string': 'A vontade deve ser uma string',
    'capacities.specials.will.gliph': 'A vontade deve ser um glifo',
    'capacities.primal.object': 'A capacidade primária deve ser um objeto',
    'capacities.primal.kind.enum': 'A capacidade primária deve ser "Hope" ou "Despair"',
    'capacities.primal.value.number': 'O valor da capacidade primária deve ser um número',
    'stats.array': 'Os status devem ser um array',
    'stats.members': 'Os status devem ser objetos',
    'stats.kind.enum': 'O tipo do status deve ser "VIT", "DMG", "DEF" ou "ATK"',
    'stats.naturalMod.string': 'O modificador natural do status deve ser uma string',
    'stats.naturalMod.extendedSignal': 'O modificador natural do status deve ser um sinal',
    'stats.relativeCapacity.string': 'A capacidade relativa do status deve ser uma string',
    'stats.actual.number': 'O valor atual do status deve ser um número',
    'evolutions.object': 'As evoluções devem ser um objeto',
    'evolutions.physical.number': 'A evolução física deve ser um número',
    'evolutions.espiritual.number': 'A evolução espiritual deve ser um número',
    'extensions.array': 'As extensões devem ser um array',
    'extensions.members': 'As extensões devem ser objetos',
    'extensions.name.string': 'O nome da extensão deve ser uma string',
    'extensions.kind.string': 'O tipo da extensão deve ser uma string',
    'extensions.progress.number': 'O progresso da extensão deve ser um número',
    'extensions.value.string': 'O valor da extensão deve ser uma string',
    'moviments.array': 'Os movimentos devem ser um array',
    'moviments.members': 'Os movimentos devem ser objetos',
    'moviments.kind.enum': 'O tipo do movimento deve ser "Peculiar" ou "Combined"',
    'moviments.relativeCapacity.string': 'A capacidade relativa do movimento deve ser uma string',
    'moviments.agregated.string': 'O agregado do movimento deve ser uma string',
    'moviments.agregated.extendedSignal': 'O agregado do movimento deve ser um sinal',
    'moviments.name.string': 'O nome do movimento deve ser uma string',
    'moviments.description.string': 'A descrição do movimento deve ser uma string',
    'moviments.codes.array': 'Os códigos do movimento devem ser um array',
    'moviments.codes.members': 'Os códigos do movimento devem ser objetos',
    'moviments.codes.key.string': 'A chave do código do movimento deve ser uma string',
    'moviments.codes.props.object': 'As propriedades do código do movimento devem ser um objeto',
    'things.array': 'As coisas devem ser um array',
    'things.members': 'As coisas devem ser objetos',
    'registerToken.exists': 'Token de registro inválido',
  }
}
