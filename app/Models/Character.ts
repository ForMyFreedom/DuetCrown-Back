import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'
import {
  ImagePlayerData,
  Character as CharacterModel,
  StringRelation,
  Modification,
} from './UserDomain'
import {
  Capacities,
  Evolutions,
  Extension,
  Minucie,
  Moviment,
  Stat,
  Thing,
} from 'App/Models/UserDomain'

export default class Character extends BaseModel implements CharacterModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public userId: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column()
  public name: string

  @column()
  public nickname: string

  @column()
  public primaryColor: string

  @column()
  public image: ImagePlayerData

  @column()
  public identity: StringRelation

  @column()
  public sumary: StringRelation

  @column()
  public capacities: Capacities

  @column()
  public stats: Stat[]

  @column()
  public toShowStats: { [kind in Stat['kind']]?: string[] }

  @column()
  public evolutions: Evolutions

  @column()
  public extensions: Extension[]

  @column()
  public moviments: Moviment[]

  @column()
  public things: Thing[]

  @column()
  public minucies: Minucie[]

  @column()
  public anotations: string

  @column()
  public currentMods: Modification[]
}
