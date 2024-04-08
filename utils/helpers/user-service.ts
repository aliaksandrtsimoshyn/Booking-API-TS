import { expect } from '@playwright/test'
import { settings, roles } from '../settings'
import { User } from '../interfaces'
import { selectAuthorizedAPIContext, createRandomString } from './functions'

export class UserService {
  async createUser(role: string, responseStatus: number) {
    const context = await selectAuthorizedAPIContext()

    const createUser = await context.post(`${settings.baseURL}/users`, {
      data: {
        full_name: await createRandomString(2, 7),
        email: await createRandomString(2, 8),
        role: role,
        username: await createRandomString(2, 9),
        phone_number: await createRandomString(2, 10),
        password: await createRandomString(2, 11),
      },
    })
    await expect(createUser.status(), `The user isn't created`).toBe(responseStatus)

    const userData = (await createUser.json()) as User
    
    return userData
  }

  async getUser(userID: string, responseStatus: number, authRole = roles.admin) {
    const context = await selectAuthorizedAPIContext(authRole)

    const getUser = await context.get(`${settings.baseURL}/users/${userID}`)
    await expect(getUser.status(), `Get user request is failed`).toBe(responseStatus)

    const userData = (await getUser.json()) as User

    return userData
  }

  async patchUser(userID: string, newData: {}, responseStatus: number, authRole = roles.admin) {
    const context = await selectAuthorizedAPIContext(authRole)

    const patchUser = await context.patch(`${settings.baseURL}/users/${userID}`, {
      data: newData,
    })
    await expect(patchUser.status(), `The user isn't updated`).toBe(responseStatus)

    const newUserData = (await patchUser.json()) as User

    return newUserData
  }

  async putUser(userID: string, newData: {}, responseStatus: number, authRole = roles.admin) {
    const context = await selectAuthorizedAPIContext(authRole)

    const putUser = await context.put(`${settings.baseURL}/users/${userID}`, {
      data: newData,
    })
    await expect(putUser.status(), `The user isn't updated`).toBe(responseStatus)

    const newUserData = (await putUser.json()) as User

    return newUserData
  }

  async deleteUser(userID: string, responseStatus: number, authRole = roles.admin) {
    const context = await selectAuthorizedAPIContext(authRole)

    const deleteUser = await context.delete(`${settings.baseURL}/users/${userID}`)
    expect(deleteUser.status(), `The user isn't deleted`).toBe(responseStatus)
  }
}
