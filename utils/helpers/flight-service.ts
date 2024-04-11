import { expect } from '@playwright/test'
import { settings } from '../settings'
import { Booking, Flights, Seats, SpecificFlight } from '../interfaces'
import { selectAuthorizedAPIContext } from './functions'
import { roles } from '../enums'

export class FlightService {
  async getFlights(flightStatus: string, limit = 5) {
    const context = await selectAuthorizedAPIContext()

    const flights = await context.get(`${settings.baseURL}/flights`, {
      params: {
        limit: limit,
        status: flightStatus,
      },
    })
    await expect(flights.status(), `Get flights request is failed`).toBe(200)

    const flightsData = (await flights.json()) as Flights

    return flightsData.objects
  }

  async getFlightIDByStatus(flightStatus: string) {
    const flightsData = await this.getFlights(flightStatus)
    const flightID = flightsData[0].flight_id

    return flightID
  }

  async getFlightIDWithFreeSeats(fareCondition: string, flightStatus: string) {
    const flightsData = await this.getFlights(flightStatus, 50)

    for (const flight of flightsData) {
      const specificFlightData = await this.getSpecificFlight(flight.flight_id)

      if (specificFlightData.available_bookings_count[fareCondition] !== 0) {
        const flightID = flight.flight_id
        return flightID
      }
    }
    throw new Error(`The flights don't contain free ${fareCondition} seats`)
  }

  async getFlightIDWithoutFreeSeats(fareCondition: string, flightStatus: string) {
    const flightsData = await this.getFlights(flightStatus)

    for (const flight of flightsData) {
      const specificFlightData = await this.getSpecificFlight(flight.flight_id)

      if (specificFlightData.available_bookings_count[fareCondition] === 0) {
        const flightID = flight.flight_id
        return flightID
      }
    }
    throw new Error(`All flights contain free ${fareCondition} seats`)
  }

  async getSpecificFlight(flightID: number) {
    const context = await selectAuthorizedAPIContext()

    const specificFlight = await context.get(`${settings.baseURL}/flights/${flightID}`)
    await expect(specificFlight.status(), `Get specific flight request is failed`).toBe(200)

    const specificFlightData = (await specificFlight.json()) as SpecificFlight

    return specificFlightData
  }

  async getFreeSeats(flightID: number) {
    const context = await selectAuthorizedAPIContext()

    const freeSeats = await context.get(`${settings.baseURL}/flights/${flightID}/free_seats`)
    await expect(freeSeats.status(), `Get free seats request is failed`).toBe(200)

    const freeSeatsData = (await freeSeats.json()) as Seats

    return freeSeatsData
  }

  async bookTickets(flightID: number, data: {}, responseStatus: number) {
    const context = await selectAuthorizedAPIContext()

    const booking = await context.post(`${settings.baseURL}/flights/${flightID}/booking`, {
      data: data,
    })
    await expect(booking.status(), `Booking request is failed`).toBe(responseStatus)

    const bookingData = (await booking.json()) as Booking

    return bookingData
  }

  async getUserBookings(userID: string, responseStatus: number, authRole = roles.admin) {
    const context = await selectAuthorizedAPIContext(authRole)

    const bookings = await context.get(`${settings.baseURL}/users/${userID}/bookings`)
    await expect(bookings.status(), `Get user bookings request is failed`).toBe(responseStatus)

    const bookingsData = await bookings.json()

    return bookingsData
  }
}
