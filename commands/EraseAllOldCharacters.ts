import { BaseCommand } from '@adonisjs/core/build/standalone'

export default class EraseAllOldCharacters extends BaseCommand {
  public static commandName = 'erase:old_characters'

  public static description = 'Remove all characters excepts from the most recent id for each user'

  public static settings = {
    loadApp: true,
    stayAlive: false,
  }

  public async run() {
    const { default: Character } = await import('App/Models/Character')
    const { default: User } = await import('App/Models/User')

    const users = await User.query().preload('characters')

    for (const user of users) {
      const characters = user.characters
      if (characters.length <= 1) {
        continue
      }
      const mostRecentCharacter = characters.reduce((prev, current) => {
        if (prev.id > current.id) {
          return prev
        }
        return current
      })
      for (const character of characters) {
        if (character.id !== mostRecentCharacter.id) {
          await Character.query().where('id', character.id).delete()
        }
      }
    }
  }
}
