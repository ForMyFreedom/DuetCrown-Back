import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import { ProgessInCapacities } from 'App/Models/UserDomain'

export default class Characters extends BaseSchema {
  protected tableName = 'characters'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.json('progress').notNullable().defaultTo(JSON.stringify(defaultProgress))
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('progress')
    })
  }
}

const defaultProgress: ProgessInCapacities = {
  basics: {
    strength: 0,
    agility: 0,
    body: 0,
    mind: 0,
    senses: 0,
    charisma: 0,
  },
  peculiars: {},
  specials: {
    ambition: 0,
    judge: 0,
    wish: 0,
    will: 0,
  },
}
