import { test as base } from '@playwright/test'
import { UserService } from './helpers/user-service'
import { FlightService } from './helpers/flight-service'
import { User } from './interfaces'
import { fareConditions, flightStatuses, roles } from './enums'

type MyFixtures = {
  userService: UserService
  flightService: FlightService
  newCustomer: User
  newCustomerWithTicket: User
  newAdmin: User
}

export const test = base.extend<MyFixtures>({
  userService: async ({}, use) => {
    await use(new UserService())
  },

  flightService: async ({}, use) => {
    await use(new FlightService())
  },

  newCustomer: async ({ userService }, use) => {
    const newCustomer = await userService.createUser(roles.customer, 201)
    console.log(`Temporary customer with user_id ${newCustomer.user_id} is created:`, newCustomer)
    await use(newCustomer)
    await userService.deleteUser(newCustomer.user_id as string, 204)
    console.log(`Temporary customer with user_id ${newCustomer.user_id} is deleted`)
  },

  newCustomerWithTicket: async ({ userService, flightService }, use) => {
    const newCustomer = await userService.createUser(roles.customer, 201)
    console.log(`Temporary customer with user_id ${newCustomer.user_id} is created:`, newCustomer)
    const flightID = await flightService.getFlightIDWithFreeSeats(
      'economy',
      flightStatuses.scheduled
    )
    const requestData = {
      account_id: newCustomer.user_id,
      tickets: [
        {
          amount: 1,
          fare_conditions: fareConditions.economy,
          passenger_name: newCustomer.username,
          phone: newCustomer.phone_number,
          email: newCustomer.email,
        },
      ],
    }
    await flightService.bookTickets(flightID, requestData, 201)
    await use(newCustomer)
    await userService.deleteUser(newCustomer.user_id as string, 204)
    console.log(`Temporary customer with user_id ${newCustomer.user_id} is deleted`)
  },

  newAdmin: async ({ userService }, use) => {
    const newAdmin = await userService.createUser(roles.admin, 201)
    console.log(`Temporary admin with user_id ${newAdmin.user_id} is created:`, newAdmin)
    await use(newAdmin)
    await userService.deleteUser(newAdmin.user_id as string, 204)
    console.log(`Temporary admin with user_id ${newAdmin.user_id} is deleted`)
  },
})
