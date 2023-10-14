import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'characters'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table
        .integer('user_id')
        .unsigned()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
        .notNullable()

      table.string('name', 20).notNullable()
      table.string('nickname', 30).notNullable()
      table.string('primary_color', 7).defaultTo('#000000')
      table.json('image').notNullable()

      table.json('identity').notNullable().defaultTo('{}')
      table.json('sumary').notNullable().defaultTo('{}')
      table.json('capacities').notNullable()
      table.json('evolutions').notNullable().defaultTo('{"physical": 0, "espiritual": 0}')
      table.text('anotations').defaultTo('')
      table.json('to_show_stats').notNullable()
      table.specificType('stats', 'json[]').nullable()
      table.specificType('extensions', 'json[]').nullable()
      table.specificType('moviments', 'json[]').nullable()
      table.specificType('things', 'json[]').nullable()
      table.specificType('minucies', 'json[]').nullable()

      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
