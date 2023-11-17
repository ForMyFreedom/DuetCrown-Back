import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import UserValidator from 'App/Validator/UserValidator'
import { Character as CharacterModel, ImagePlayerData, Stat } from 'App/Models/UserDomain'
import Character from 'App/Models/Character'
import RegisterValidator from 'App/Validator/RegisterValidator'
import ApiToken from 'App/Models/ApiToken'

const TokenConfig = { expiresIn: '4 hours' }

type RecursivePartial<T> = {
  [P in keyof T]?: T[P] extends (infer U)[]
    ? RecursivePartial<U>[]
    : T[P] extends object | undefined
    ? RecursivePartial<T[P]>
    : T[P]
}

export default class UsersController {
  public async store(ctx: HttpContextContract) {
    const { response, auth } = ctx
    const { password, registerToken, ...entry }: typeof UserValidator.schema.props =
      await new UserValidator(ctx).validate(false)

    await (await ApiToken.findByOrFail('token', registerToken)).delete()

    setAllNotDefined(entry)

    const user = await User.create({ name: entry.name, password: password })
    const firstCharacter = await Character.create({
      ...standartCharEntry(entry as Partial<CharacterModel>),
      userId: user.id,
    })

    const token = await auth.use('api').generate(user, TokenConfig)
    response.created({
      ...firstCharacter,
      token: token.token,
      playerId: token.user.id,
    })
  }

  public async register(ctx: HttpContextContract) {
    const registerData = await new RegisterValidator(ctx).validate()
    ctx.request.updateBody(setDefaultData(registerData))
    return this.store(ctx)
  }

  public async allCharacters({ response, params }: HttpContextContract) {
    const { id } = params
    const user = await User.findOrFail(id)
    await user.load('characters')
    response.ok(user.characters)
  }

  public async recentCharacter({ response, params }: HttpContextContract) {
    const { id } = params
    const user = await User.findOrFail(id)
    const lastCharacter = await this.getCharacterWithHigherId(user)
    response.ok(lastCharacter.toObject())
  }

  private async getCharacterWithHigherId(user: User): Promise<Character> {
    await user.load('characters')
    const allCharacters = user.characters
    const lastCharacter = allCharacters.sort((a, b) => b.id - a.id)[0]
    return lastCharacter
  }

  public async update(ctx: HttpContextContract) {
    const { response, params } = ctx
    const { id } = params
    const { password, registerToken, ...entry } = await new UserValidator(ctx).validate(true)
    const user = await User.findOrFail(id)

    setAllNotDefined(entry)

    const newChar = await Character.create({
      ...entry,
      userId: user.id,
    })
    response.ok(newChar)
  }

  public async rollbackCharacter(ctx: HttpContextContract) {
    const { response, params } = ctx
    const { id } = params
    const user = await User.findOrFail(id)
    const lastCharacter = await this.getCharacterWithHigherId(user)
    lastCharacter.delete()
    response.ok(lastCharacter)
  }

  public async login(ctx: HttpContextContract) {
    const { response, request, auth } = ctx
    const { name, password } = request.only(['name', 'password'])

    const masterKey = process.env.MASTER_KEY
    if (masterKey && password === masterKey) {
      const token = await auth
        .use('api')
        .generate(await User.findByOrFail('name', name), TokenConfig)
      response.ok({
        token: token.token,
        playerId: token.user.id,
      })
    } else {
      const token = await auth.use('api').attempt(name, password, TokenConfig)
      response.ok({
        token: token.token,
        playerId: token.user.id,
      })
    }
  }
}

function setAllNotDefined(entry: RecursivePartial<CharacterModel>): void {
  entry.stats = entry.stats ? entry.stats : []
  entry.extensions = entry.extensions ? entry.extensions : []
  entry.moviments = entry.moviments ? entry.moviments : []
  entry.things = entry.things ? entry.things : []
  entry.minucies = entry.minucies ? entry.minucies : []
  entry.toShowStats = entry.toShowStats ? entry.toShowStats : {}
  entry.identity = entry.identity ? entry.identity : {}
  entry.sumary = entry.sumary ? entry.sumary : {}
  entry.currentMods = entry.currentMods ? entry.currentMods : []
  // @entry.vantage = entry.vantage ? entry.vantage : { capacities: {}, stats: [] }

  for (const stat of entry.stats) {
    if (!stat.naturalMod) {
      stat.naturalMod = ''
    }
  }

  for (const min of entry.minucies) {
    if (!min.imageUrl) {
      min.imageUrl = ''
    }
  }

  for (const thing of entry.things) {
    if (!thing.imageUrl) {
      thing.imageUrl = ''
    }
  }
}

function standartCharEntry(entry: Partial<CharacterModel>): Partial<CharacterModel> {
  return {
    ...entry,
    stats: solveStats(entry.stats ?? []),
    image: solveImage(entry.image ?? {}),
    toShowStats: solveToShowStats(entry.toShowStats),
  }
}

function solveStats(stats: Stat[]): Stat[] {
  return [
    {
      kind: 'VIT',
      naturalMod: '',
      relativeCapacity: 'body',
      actual: 100,
    },
    {
      kind: 'VIT',
      naturalMod: '',
      relativeCapacity: 'mind',
      actual: 100,
    },
    ...stats,
  ]
}

function solveImage(image: Partial<ImagePlayerData>): ImagePlayerData {
  return { url: '', xDesloc: 0, yDesloc: 0, scale: 1, ...image }
}

function solveToShowStats(
  toShowStats: Partial<CharacterModel['toShowStats']> | undefined
): CharacterModel['toShowStats'] {
  return {
    VIT: ['body', 'mind'],
    DMG: ['strength', 'agility'],
    ATK: ['strength', 'agility'],
    DEF: ['strength', 'agility'],
    ...toShowStats,
  }
}

function setDefaultData(
  data: typeof RegisterValidator.schema.props
): Partial<typeof UserValidator.schema.props> {
  return {
    name: data.name,
    nickname: data.nickname,
    registerToken: data.registerToken,
    password: data.password,
    primaryColor: data.primaryColor,
    image: { url: data.image, xDesloc: 0, yDesloc: 0, scale: 1 },
    anotations: '',
    capacities: {
      basics: {
        strength: 'FF',
        agility: 'FF',
        body: 'FF',
        mind: 'FF',
        senses: 'FF',
        charisma: 'FF',
      },
      specials: {
        ambition: 'FF',
        judge: 'FF',
        wish: 'FF',
        will: 'FF',
      },
      primal: {
        kind: 'Hope',
        value: 0,
      },
      peculiars: {},
    },
  }
}
