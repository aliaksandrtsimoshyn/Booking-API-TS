import { settings, testUsers, roles } from '../utils/settings'
import { test } from '../utils/fixtures'
import { createAuthorizedAPIContext } from '../utils/helpers/functions'

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

test.describe(`FLIGHTS`, () => {
  // Test data for Get All Flights test
  const testData1 = [
    { statusCode: 200, authRole: roles.admin },
    { statusCode: 200, authRole: roles.customer },
  ]

  for (const data of testData1) {
    test(`Get All Flights By ${data.authRole}`, async ({ flightService }) => {
      const flightsData = await flightService.getAllFlights(data.statusCode, data.authRole)

      console.log(`All flights:`, flightsData.objects)
    })
  }

  // Test data for Get User Bookings test
  const testData2 = [
    { statusCode: 200, authRole: roles.admin },
    { statusCode: 403, authRole: roles.customer },
  ]

  for (const data of testData2) {
    test(`Get User Bookings By ${data.authRole}`, async ({ flightService, newCustomer }) => {
      const bookingsData = await flightService.getUserBookings(
        newCustomer.user_id as string,
        data.statusCode,
        data.authRole
      )

      if (data.authRole === roles.admin) {
        console.log(`Bookings of the user with user_id ${newCustomer.user_id}:`, bookingsData)
      } else if (data.authRole === roles.customer) {
        console.log(`Get user bookings request is forbidden for ${roles.customer}`)
      }
    })
  }
})
