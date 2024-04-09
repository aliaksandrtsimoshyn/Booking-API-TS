import { settings, testUsers, roles, flightStatuses, fareConditions } from '../utils/settings'
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
  test(`Get Flights`, async ({ flightService }) => {
    const flightsData = await flightService.getFlights(flightStatuses.scheduled, 200)

    console.log(`The flights:`, flightsData)
  })

  test(`Get Specific Flight`, async ({ flightService }) => {
    const specificFlightData = await flightService.getSpecificFlight(flightStatuses.scheduled, 200)

    console.log(`The flight:`, specificFlightData)
  })

  test(`Get Free Seats`, async ({ flightService }) => {
    const freeSeatsData = await flightService.getFreeSeats(flightStatuses.scheduled, 200)

    console.log(`Free seats:`, freeSeatsData)
  })

  // Test data for Book Tickets test
  const testData1 = [
    { flightStatus: flightStatuses.scheduled, responseStatus: 201 },
    { flightStatus: flightStatuses.arrived, responseStatus: 403 },
    { flightStatus: flightStatuses.cancelled, responseStatus: 403 },
    { flightStatus: flightStatuses.delayed, responseStatus: 403 },
    { flightStatus: flightStatuses.departed, responseStatus: 403 },
    { flightStatus: flightStatuses.on_time, responseStatus: 403 },
  ]

  for (const data of testData1) {
    test(`Book Tickets For ${data.flightStatus} Flight`, async ({ flightService, newCustomer }) => {
      const requestData = {
        account_id: newCustomer.user_id,
        tickets: [
          {
            amount: 10,
            fare_conditions: fareConditions.economy,
            passenger_name: newCustomer.username,
            phone: newCustomer.phone_number,
            email: newCustomer.email,
          },
        ],
      }
      const bookTicketsData = await flightService.bookTickets(
        requestData,
        data.flightStatus,
        data.responseStatus
      )

      console.log(`Booking data:`, bookTicketsData)
    })
  }

  // Test data for Get User Bookings test
  const testData2 = [
    { responseStatus: 200, authRole: roles.admin },
    { responseStatus: 403, authRole: roles.customer },
  ]

  for (const data of testData2) {
    test(`Get User Bookings By ${data.authRole}`, async ({ flightService, newCustomer }) => {
      const bookingsData = await flightService.getUserBookings(
        newCustomer.user_id as string,
        data.responseStatus,
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
