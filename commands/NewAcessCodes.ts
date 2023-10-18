import { BaseCommand, args } from '@adonisjs/core/build/standalone'
import { DateTime } from 'luxon'

export default class NewAcessCodes extends BaseCommand {
  public static commandName = 'new:acess_codes'

  public static description = 'Create new registration codes'

  @args.string({ description: 'Amount of tokens', name: 'amount' })
  public amount: string

  public static settings = {
    loadApp: true,
    stayAlive: false,
  }

  public async run() {
    const { default: ApiToken } = await import('App/Models/ApiToken')
    const expiresAt = DateTime.now()
    expiresAt.set({ month: expiresAt.month + 1 })

    const numberAmount = Number(this.amount)
    if (Number.isNaN(numberAmount)) {
      return
    }

    const codes: string[] = []

    for (let i = 0; i < numberAmount; i++) {
      const newCode = getRandomToken()
      codes.push(newCode)
      await ApiToken.create({
        name: 'Register Acess Token',
        type: 'register',
        token: newCode,
        expiresAt: expiresAt,
      })
    }

    console.log(`New codes!\n${codes.join('\n')}`)
  }
}

function getRandomToken(): string {
  const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789⁰¹²³⁴⁵⁶⁷⁸⁹₀₁₂₃₄₅₆₇₈₉ₐₑₒₓ'
  let token = ''
  for (let i = 0; i < 8; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return token
}
