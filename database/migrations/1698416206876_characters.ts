import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'characters'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.specificType('current_mods', 'json[]').nullable()
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('current_mods')
    })
  }
}
