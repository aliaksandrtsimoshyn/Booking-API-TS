import { expect } from '@playwright/test'
import { roles, settings } from '../settings'
import { Booking, Flights, Seats, SpecificFlight } from '../interfaces'
import { selectAuthorizedAPIContext } from './functions'

export class FlightService {
  async getFlights(flightStatus: string, responseStatus: number) {
    const context = await selectAuthorizedAPIContext()

    const flights = await context.get(`${settings.baseURL}/flights`, {
      params: {
        limit: 5,
        status: flightStatus
      },
    })
    await expect(flights.status(), `Get flights request is failed`).toBe(responseStatus)

    const flightsData = (await flights.json()) as Flights

    return flightsData.objects
  }

  async getSpecificFlightID(flightStatus: string, responseStatus: number) {
    const flightsData = await this.getFlights(flightStatus, 200)
    const flightID = flightsData[0].flight_id

    return flightID
  }

  async getSpecificFlight(flightStatus: string, responseStatus: number) {
    const context = await selectAuthorizedAPIContext()

    const flightID = await this.getSpecificFlightID(flightStatus, 200)

    const specificFlight = await context.get(`${settings.baseURL}/flights/${flightID}`)
    await expect(specificFlight.status(), `Get specific flight request is failed`).toBe(responseStatus)

    const specificFlightData = (await specificFlight.json()) as SpecificFlight

    return specificFlightData
  }

  async getFreeSeats(flightStatus: string, responseStatus: number) {
    const context = await selectAuthorizedAPIContext()

    const flightID = await this.getSpecificFlightID(flightStatus, 200)

    const freeSeats = await context.get(`${settings.baseURL}/flights/${flightID}/free_seats`)
    await expect(freeSeats.status(), `Get specific flight request is failed`).toBe(responseStatus)

    const freeSeatsData = (await freeSeats.json()) as Seats

    return freeSeatsData
  }

  async bookTickets(data: {}, flightStatus: string, responseStatus: number) {
    const context = await selectAuthorizedAPIContext()

    const flightID = await this.getSpecificFlightID(flightStatus, 200)

    const bookTickets = await context.post(`${settings.baseURL}/flights/${flightID}/booking`, {
      data: data,
    })
    await expect(bookTickets.status(), `Book tickets request is failed`).toBe(responseStatus)

    const bookTicketsData = (await bookTickets.json()) as Booking

    return bookTicketsData
  }

  async getUserBookings(userID: string, responseStatus: number, authRole = roles.admin) {
    const context = await selectAuthorizedAPIContext(authRole)

    const bookings = await context.get(`${settings.baseURL}/users/${userID}/bookings`)
    await expect(bookings.status(), `Get user bookings request is failed`).toBe(responseStatus)

    const bookingsData = await bookings.json()

    return bookingsData
  }
}
