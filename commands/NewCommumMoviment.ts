import { BaseCommand } from '@adonisjs/core/build/standalone'

export default class NewCommumMoviment extends BaseCommand {
  public static commandName = 'new:commum_moviment'

  public static description = 'Create a new commum moviment'

  public static settings = {
    loadApp: true,
    stayAlive: false,
  }

  public async run() {
    const name = await this.prompt.ask('What is the name of the commum moviment?')

    const description = await this.prompt.ask('What is the description of the commum moviment?')

    const CommumMoviment = (await import('App/Models/ComumMoviment')).default

    const commumMoviment = new CommumMoviment()
    commumMoviment.name = name
    commumMoviment.description = description.replace(/\\n/g, '\n').replace(/\\t/g, '\t')

    await commumMoviment.save()

    this.logger.success('Commum moviment created successfully')
  }
}
