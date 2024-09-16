import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import { ProgessInCapacities } from 'App/Models/UserDomain'
import {
  DEPRECATEDdefaultProgress,
  DEPRECATEDProgessInCapacities,
} from './1700665355026_add_progress_to_characters'

export default class extends BaseSchema {
  protected tableName = 'characters'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.json('progress').alter().notNullable().defaultTo(JSON.stringify(defaultProgress))
    })

    this.defer(async (db) => {
      const characters = await db.from(this.tableName).select('id', 'progress')
      for (const character of characters) {
        const progress: DEPRECATEDProgessInCapacities = character.progress
        const newProgress: ProgessInCapacities = defaultProgress
        for (const key in progress) {
          for (const x in progress[key]) {
            newProgress[key][x] = { evo: progress[key][x], glyph: 'FF' }
          }
        }
        await db
          .from(this.tableName)
          .where('id', character.id)
          .update('progress', JSON.stringify(newProgress))
      }
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table
        .json('progress')
        .alter()
        .notNullable()
        .defaultTo(JSON.stringify(DEPRECATEDdefaultProgress))
    })

    this.defer(async (db) => {
      const characters = await db.from(this.tableName).select('id', 'progress')
      for (const character of characters) {
        const progress: ProgessInCapacities = character.progress
        const newProgress: DEPRECATEDProgessInCapacities = DEPRECATEDdefaultProgress
        for (const key in progress) {
          for (const x in progress[key]) {
            newProgress[key][x] = progress[key][x].evo
          }
        }
        await db
          .from(this.tableName)
          .where('id', character.id)
          .update('progress', JSON.stringify(newProgress))
      }
    })
  }
}

const defaultProgress: ProgessInCapacities = {
  basics: {
    strength: { evo: 0, glyph: 'FF' },
    agility: { evo: 0, glyph: 'FF' },
    body: { evo: 0, glyph: 'FF' },
    mind: { evo: 0, glyph: 'FF' },
    senses: { evo: 0, glyph: 'FF' },
    charisma: { evo: 0, glyph: 'FF' },
  },
  peculiars: {},
  specials: {
    ambition: { evo: 0, glyph: 'FF' },
    judge: { evo: 0, glyph: 'FF' },
    wish: { evo: 0, glyph: 'FF' },
    will: { evo: 0, glyph: 'FF' },
  },
}
