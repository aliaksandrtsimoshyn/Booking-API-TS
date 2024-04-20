import { settings, testUsers } from '../utils/settings'
import { test } from '../utils/fixtures'
import { createAuthorizedAPIContext } from '../utils/helpers/functions'
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

test.describe(`FLIGHTS`, () => {
  test(`Get Flights`, async ({ flightService }) => {
    const flightsData = await flightService.getFlights(flightStatuses.scheduled)

    console.log(`The flights:`, flightsData)
  })

  test(`Get Specific Flight`, async ({ flightService }) => {
    const flightID = await flightService.getFlightIDByStatus(flightStatuses.scheduled)
    const specificFlightData = await flightService.getSpecificFlight(flightID)

    console.log(`The flight:`, specificFlightData)
  })

  test(`Get Free Seats`, async ({ flightService }) => {
    const flightID = await flightService.getFlightIDByStatus(flightStatuses.scheduled)
    const freeSeatsData = await flightService.getFreeSeats(flightID)

    console.log(`Free seats:`, freeSeatsData)
  })

  // Test data for Book Tickets test (with different fare conditions) and 
  // Negative Book Tickets test (with unavailable free seats)
  const testData1 = [
    { fareConditions: `economy`, fare_conditions: fareConditions.economy },
    { fareConditions: `comfort`, fare_conditions: fareConditions.comfort },
    { fareConditions: `business`, fare_conditions: fareConditions.business },
  ]

  for (const data of testData1) {
    test(`Book ${data.fare_conditions} Tickets`, async ({ flightService, newCustomer }) => {
      const flightID = await flightService.getFlightIDWithFreeSeats(
        data.fareConditions,
        flightStatuses.scheduled
      )

      const requestData = {
        account_id: newCustomer.user_id,
        tickets: [
          {
            amount: 1,
            fare_conditions: data.fare_conditions,
            passenger_name: newCustomer.username,
            phone: newCustomer.phone_number,
            email: newCustomer.email,
          },
        ],
      }
      const bookingData = await flightService.bookTickets(flightID, requestData, 201)

      console.log(`Booking data:`, bookingData)
    })
  }
  
  for (const data of testData1) {
    test(`Book Unavailable ${data.fare_conditions} Tickets`, async ({ flightService, newCustomer }) => {
      const flightID = await flightService.getFlightIDWithoutFreeSeats(
        data.fareConditions,
        flightStatuses.scheduled
      )

      const requestData = {
        account_id: newCustomer.user_id,
        tickets: [
          {
            amount: 1,
            fare_conditions: data.fare_conditions,
            passenger_name: newCustomer.username,
            phone: newCustomer.phone_number,
            email: newCustomer.email,
          },
        ],
      }
      const bookingData = await flightService.bookTickets(flightID, requestData, 400)

      console.log(`Booking data:`, bookingData)
    })
  }

  // Test data for Negative Book Tickets test (with inappropriate flight statuses)
  const testData2 = [
    { flightStatus: flightStatuses.arrived },
    { flightStatus: flightStatuses.cancelled },
    { flightStatus: flightStatuses.delayed },
    { flightStatus: flightStatuses.departed },
    { flightStatus: flightStatuses.on_time },
  ]

  for (const data of testData2) {
    test(`Book Tickets For ${data.flightStatus} Flight`, async ({ flightService, newCustomer }) => {
      const flightID = await flightService.getFlightIDWithFreeSeats(fareConditions.economy, data.flightStatus)

      const requestData = {
        account_id: newCustomer.user_id,
        tickets: [
          {
            amount: 1,
            fare_conditions: 'Economy',
            passenger_name: newCustomer.username,
            phone: newCustomer.phone_number,
            email: newCustomer.email,
          },
        ],
      }
      const bookTicketsData = await flightService.bookTickets(flightID, requestData, 403)

      console.log(`Booking data:`, bookTicketsData)
    })
  }
})
