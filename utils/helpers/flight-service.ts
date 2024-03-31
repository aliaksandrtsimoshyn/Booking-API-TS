import { expect } from '@playwright/test'
import { roles, settings } from '../settings'
import { Flights } from '../interfaces'
import { selectAuthorizedAPIContext } from './functions'

export class FlightService {
  async getAllFlights(statusCode: number, authRole = roles.admin) {
    const context = await selectAuthorizedAPIContext(authRole)

    const flights = await context.get(`${settings.baseURL}/flights`)
    await expect(flights.status(), `Get all flights request is failed`).toBe(statusCode)

    const flightsData = (await flights.json()) as Flights

    return flightsData
  }

  async getUserBookings(userID: string, statusCode: number, authRole = roles.admin) {
    const context = await selectAuthorizedAPIContext(authRole)
    
    const bookings = await context.get(`${settings.baseURL}/users/${userID}/bookings`)
    await expect(bookings.status(), `Get user bookings request is failed`).toBe(statusCode)

    const bookingsData = await bookings.json()

    return bookingsData
  }
}
