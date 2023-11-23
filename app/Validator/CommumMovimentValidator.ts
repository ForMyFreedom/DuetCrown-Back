import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CommumMovimentValidator {
  constructor(protected ctx: HttpContextContract) {}

  public async validate(isRequired: boolean = true) {
    return await this.ctx.request.validate({
      schema: CommumMovimentValidator.schema(isRequired),
      messages: this.messages,
    })
  }

  public static schema = (isRequired: boolean) =>
    schema.create({
      name: schema.string.optional({ trim: true }, isRequired ? [rules.required()] : []),
      description: schema.string.optional({ trim: true }, isRequired ? [rules.required()] : []),
    })

  public messages: CustomMessages = {
    'name.required': 'O nome é obrigatório',
    'name.string': 'O nome deve ser uma string',
    'description.required': 'A descrição é obrigatória',
    'description.string': 'A descrição deve ser uma string',
  }
}
