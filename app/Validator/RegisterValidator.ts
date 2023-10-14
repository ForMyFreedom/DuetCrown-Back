import { schema, rules, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { passwordRegex } from './Definitions'

export default class RegisterValidator {
  constructor(protected ctx: HttpContextContract) {}

  public async validate() {
    return await this.ctx.request.validate({
      schema: RegisterValidator.schema,
      messages: this.messages,
    })
  }

  public static schema = schema.create({
    name: schema.string({ trim: true }),
    nickname: schema.string({ trim: true }),
    primaryColor: schema.string([rules.regex(/\#[0-9a-f]{6}/)]),
    password: schema.string({ trim: true }, [rules.regex(passwordRegex)]),
    repeatPassword: schema.string({ trim: true }, [rules.confirmed('password')]),
    image: schema.string({ trim: true }, [rules.url()]),
  })

  public messages: CustomMessages = {
    'name.required': 'O nome é obrigatório',
    'name.string': 'O nome deve ser uma string',
    'name.trim': 'O nome não pode ter espaços no começo ou no fim',
    'nickname.required': 'O apelido é obrigatório',
    'nickname.string': 'O apelido deve ser uma string',
    'nickname.trim': 'O apelido não pode ter espaços no começo ou no fim',
    'primaryColor.required': 'A cor primária é obrigatória',
    'primaryColor.string': 'A cor primária deve ser uma string',
    'primaryColor.regex': 'A cor primária deve ser uma cor hexadecimal',
    'password.required': 'A senha é obrigatória',
    'password.string': 'A senha deve ser uma string',
    'password.trim': 'A senha não pode ter espaços no começo ou no fim',
    'password.regex': 'A senha deve ter no mínimo 8 caracteres, sendo 1 letra e 1 número',
    'repeatPassword.required': 'A confirmação de senha é obrigatória',
    'repeatPassword.string': 'A confirmação de senha deve ser uma string',
    'repeatPassword.trim': 'A confirmação de senha não pode ter espaços no começo ou no fim',
    'repeatPassword.confirmed': 'A confirmação de senha deve ser igual à senha',
    'image.required': 'A imagem é obrigatória',
    'image.string': 'A imagem deve ser uma string',
    'image.trim': 'A imagem não pode ter espaços no começo ou no fim',
    'image.url': 'A imagem deve ser uma URL válida',
  }
}
