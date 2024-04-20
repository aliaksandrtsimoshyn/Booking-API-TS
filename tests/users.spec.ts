import { expect } from '@playwright/test'
import { settings, testUsers } from '../utils/settings'
import { test } from '../utils/fixtures'
import { createAuthorizedAPIContext, createRandomString } from '../utils/helpers/functions'
import { fareConditions, flightStatuses, roles } from '../utils/enums'

test.beforeAll(async ({}) => {
  settings.adminAPIContext = await createAuthorizedAPIContext(
    testUsers.admin.username,
    testUsers.admin.password as string
  )

  settings.customerAPIContext = await createAuthorizedAPIContext(
    testUsers.customer.username,
    testUsers.customer.password as string
  )
})

test.describe(`USERS`, () => {
  // Test data for Get User, Patch User, Put User, Get User Bookings tests
  const testData1 = [
    { responseStatus: 200, authRole: roles.admin },
    { responseStatus: 403, authRole: roles.customer },
  ]

  for (const data of testData1) {
    test(`Get User By ${data.authRole}`, async ({ userService, newCustomer }) => {
      const userData = await userService.getUser(
        newCustomer.user_id as string,
        data.responseStatus,
        data.authRole
      )

      if (data.authRole === roles.admin) {
        expect(userData.full_name, `Incorrect user is got`).toBe(newCustomer.full_name)
        console.log(`The following user is got`, userData)
      } else if (data.authRole === roles.customer) {
        console.log(`Get user request is forbidden for ${roles.customer}`)
      }
    })
  }

  test(`Create User`, async ({ userService }) => {
    const userData = await userService.createUser(roles.customer, 201)
    console.log(`The user with user_id ${userData.user_id} is created:`, userData)

    await userService.deleteUser(userData.user_id as string, 204)
    console.log(`The user with user_id ${userData.user_id} is deleted`)
  })

  for (const data of testData1) {
    test(`User Partial Update By ${data.authRole}`, async ({ userService, newCustomer }) => {
      const newData = {
        full_name: await createRandomString(2, 7),
      }
      console.log(`New data:`, newData)

      const updatedUserData = await userService.patchUser(
        newCustomer.user_id as string,
        newData,
        data.responseStatus,
        data.authRole
      )

      if (data.authRole === roles.admin) {
        expect(updatedUserData.full_name, `Full name isn't updated`).toBe(newData.full_name.toUpperCase())
        console.log(`Updated user data:`, updatedUserData)
      } else if (data.authRole === roles.customer) {
        console.log(`Patch user request is forbidden for ${roles.customer}`)
      }
    })
  }

  for (const data of testData1) {
    test(`User Full Update by ${data.authRole}`, async ({ userService, newCustomer }) => {
      const newData = {
        full_name: await createRandomString(2, 7),
        email: await createRandomString(2, 8),
        role: roles.customer,
        username: await createRandomString(2, 9),
        phone_number: await createRandomString(2, 10),
      }
      console.log(`New data:`, newData)

      const updatedUserData = await userService.putUser(
        newCustomer.user_id as string,
        newData,
        data.responseStatus,
        data.authRole
      )

      if (data.authRole === roles.admin) {
        expect(updatedUserData.full_name, `Full name isn't updated`).toBe(newData.full_name.toUpperCase())
        expect(updatedUserData.email, `Email isn't updated`).toBe(newData.email)
        expect(updatedUserData.username, `Username isn't updated`).toBe(newData.username)
        expect(updatedUserData.phone_number, `Phone number isn't updated`).toBe(newData.phone_number)
        console.log(`Updated user data:`, updatedUserData)
      } else if (data.authRole === roles.customer) {
        console.log(`Put user request is forbidden for ${roles.customer}`)
      }
    })
  }

  test(`Delete User By Admin`, async ({ userService }) => {
    const userData = await userService.createUser(roles.customer, 201)
    console.log(`The user with user_id ${userData.user_id} is created:`, userData)

    await userService.deleteUser(userData.user_id as string, 204)
    await userService.getUser(userData.user_id as string, 404)
    console.log(`The user with user_id ${userData.user_id} is deleted`)
  })

  test(`Delete User By Customer`, async ({ userService, newCustomer }) => {
    await userService.deleteUser(newCustomer.user_id as string, 403, roles.customer)
    console.log(`Delete user request is forbidden for customer`)
  })

  for (const data of testData1) {
    test(`Get User Bookings By ${data.authRole}`, async ({ userService, newCustomerWithTicket }) => {
      const bookingsData = await userService.getUserBookings(
        newCustomerWithTicket.user_id as string,
        data.responseStatus,
        data.authRole
      )

      if (data.authRole === roles.admin) {
        console.log(`Bookings of the user with user_id ${newCustomerWithTicket.user_id}:`, bookingsData)
      } else if (data.authRole === roles.customer) {
        console.log(`Get user bookings request is forbidden for ${roles.customer}`)
      }
    })
  }

  for (const data of testData1) {
    test(`Get User Ticket By ${data.authRole}`, async ({ userService, newCustomerWithTicket }) => {
      const bookingsData = await userService.getUserBookings(newCustomerWithTicket.user_id as string, 200)
      const ticketNo = bookingsData[0].ticket_numbers[0]

      const userTicketData = await userService.getUserTicket(
        newCustomerWithTicket.user_id as string,
        ticketNo,
        data.responseStatus,
        data.authRole
      )

      if (data.authRole === roles.admin) {
        console.log(`Ticket of the user with user_id ${newCustomerWithTicket.user_id}:`, userTicketData)
      } else if (data.authRole === roles.customer) {
        console.log(`Get user ticket request is forbidden for ${roles.customer}`)
      }
    })
  }

  // Test data for Cancel User Ticket test
  const testData2 = [
    { responseStatus: 204, authRole: roles.admin },
    { responseStatus: 403, authRole: roles.customer },
  ]

  for (const data of testData2) {
    test(`Cancel User Ticket By ${data.authRole}`, async ({ userService, newCustomerWithTicket }) => {
      const bookingsData = await userService.getUserBookings(newCustomerWithTicket.user_id as string, 200)
      const ticketNo = bookingsData[0].ticket_numbers[0]

      const cancelUserTicket = await userService.cancelUserTicket(
        newCustomerWithTicket.user_id as string,
        ticketNo,
        data.responseStatus,
        data.authRole
      )

      if (data.authRole === roles.admin) {
        console.log(`Ticket with ticketNo ${ticketNo} is canceled`, cancelUserTicket)
      } else if (data.authRole === roles.customer) {
        console.log(`Cancel user ticket request is forbidden for ${roles.customer}`)
      }
    })
  }
})
