import { APIRequestContext, expect, request } from '@playwright/test'
import { settings, roles } from '../settings'

  export async function createAuthorizedAPIContext(username: string, password: string) {
    const context = await request.newContext()
    const login = await context.post(`${settings.baseURL}/token`, {
      form: {
        username: username,
        password: password,
      },
    })
    await expect(login, `Login request is failed`).toBeOK()

    const token = (await login.json()).access_token

    const authorizedAPIContext = await request.newContext({
      extraHTTPHeaders: {
        Authorization: `Bearer ${token}`,
      },
    })

    return authorizedAPIContext
  }

  export async function createRandomString(start: number, end: number) {
    const randomString = Math.random().toString(36).substring(start, end)

    return randomString
  }

  export async function selectAuthorizedAPIContext(authRole = roles.admin) {
    expect(settings.adminAPIContext, `adminAPIContext is null`).not.toBeNull()
    expect(settings.customerAPIContext, `customerAPIContext is null`).not.toBeNull()
    
    let authorizedAPIContext = await request.newContext()

    if (authRole === roles.admin) {
      authorizedAPIContext = settings.adminAPIContext as APIRequestContext
      return authorizedAPIContext
    } else if (authRole === roles.customer) {
      authorizedAPIContext = settings.customerAPIContext as APIRequestContext
      return authorizedAPIContext
    } console.log(`The user isn't authorized (invalid authRole is provided)`)
    
    return authorizedAPIContext
  }

