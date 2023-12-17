import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'api_tokens'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.timestamp('extra_timestamp', { useTz: true }).nullable()
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('extra_timestamp')
    })
  }
}
