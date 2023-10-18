import { BaseCommand } from '@adonisjs/core/build/standalone'

export default class RefreshTokens extends BaseCommand {
  public static commandName = 'refresh:acess_codes'

  public static description = 'Remove all registration tokens'

  public static settings = {
    loadApp: true,
    stayAlive: false,
  }

  public async run() {
    const { default: ApiToken } = await import('App/Models/ApiToken')
    await ApiToken.query().where('type', 'register').delete()
  }
}
