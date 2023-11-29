import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import ComumMoviment from 'App/Models/ComumMoviment'
import CommumMovimentValidator from 'App/Validator/CommumMovimentValidator'

export default class CommumMovimentsController {
  public async index({ response }: HttpContextContract) {
    response.ok(await ComumMoviment.all())
  }

  public async show({ params, response }: HttpContextContract) {
    const { id } = params
    response.ok(await ComumMoviment.findOrFail(id))
  }

  public async store(ctx: HttpContextContract) {
    const body = await new CommumMovimentValidator(ctx).validate(true)
    const commumMoviment = await ComumMoviment.create(body)
    ctx.response.created(commumMoviment)
  }

  public async update(ctx: HttpContextContract) {
    const { id } = ctx.params
    const body = await new CommumMovimentValidator(ctx).validate(false)
    const commumMoviment = await ComumMoviment.findOrFail(id)
    commumMoviment.merge(body)
    await commumMoviment.save()
    ctx.response.ok(commumMoviment)
  }

  public async destroy(ctx: HttpContextContract) {
    const { id } = ctx.params
    const commumMoviment = await ComumMoviment.findOrFail(id)
    await commumMoviment.delete()
    ctx.response.noContent()
  }
}
