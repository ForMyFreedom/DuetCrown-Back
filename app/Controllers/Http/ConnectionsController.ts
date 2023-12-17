import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import ApiToken from 'App/Models/ApiToken'
import { DateTime } from 'luxon'

export default class ConnectionsController {
  public async verify(ctx: HttpContextContract) {
    const { auth } = ctx
    const token = await ApiToken.findByOrFail('token', auth.use('api').token?.tokenHash)
    if (!token) {
      return ctx.response.unauthorized({ message: 'Token not found' })
    }
    token.extraTimestamp = DateTime.now()
    await token.save()

    const bleedMarginTime = DateTime.now().minus({ minutes: 2 }).toString()

    const allCurrentTokens = await ApiToken.query()
      .where('extra_timestamp', '>', bleedMarginTime)
      .join('users', 'users.id', '=', 'api_tokens.user_id')

    const allCurrentTokensPerUser = allCurrentTokens
      .map((token) => {
        return {
          id: token.userId,
          name: token.name,
          amount: allCurrentTokens.filter((token2) => token2.userId === token.userId).length,
        }
      })
      .filter((value, index, self) => {
        return self.findIndex((v) => v.name === value.name) === index
      })

    ctx.response.ok(allCurrentTokensPerUser)
  }

  public async destroy(ctx: HttpContextContract) {
    const { auth } = ctx
    const token = await ApiToken.findByOrFail('token', auth.use('api').token?.tokenHash)
    if (!token) {
      return ctx.response.unauthorized({ message: 'Token not found' })
    }
    await token.delete()
  }
}
