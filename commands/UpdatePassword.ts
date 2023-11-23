import { BaseCommand, args } from '@adonisjs/core/build/standalone'

export default class UpdatePassword extends BaseCommand {
  public static commandName = 'update:password'

  public static description = 'Update the password of a user'

  @args.string({ description: 'Username', name: 'name' })
  public name: string

  public static settings = {
    loadApp: true,
    stayAlive: false,
  }

  public async run() {
    const { default: User } = await import('App/Models/User')
    const password = await this.prompt.secure('New password:')
    const user = await User.findByOrFail('name', this.name)
    user.password = password.replace(/\|/g, '') // Temporary: Due to Discord secret
    await user.save()
  }
}
