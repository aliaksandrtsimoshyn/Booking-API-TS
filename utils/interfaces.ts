export interface Flights {
  objects: [Flight]
}

export interface Flight {
  flight_id: number
  flight_no: string
  aircraft_code: string
  departure: Departure
  arrival: Departure
  status: string
}

export interface Seats {
  economy: [string]
  comfort: [string]
  business: [string]
}

export interface SpecificFlight {
  flight_info: Flight
  available_bookings_count: {
    economy: number
    comfort: number
    business: number
  }
}

export interface Departure {
  city: string
  airport: string
  airport_name: string
  time: string
}

export interface Ticket {
  ticket_no: string
  amount: number
  fare_conditions: string
  passenger_name: string
  phone: string
  email: string
}

export interface Booking {
  book_ref: string
  scheduled_departure: string
  departure_airport: string
  scheduled_arrival: string
  arrival_airport: string
  tickets: [Ticket]
  account_id: number
}

export interface User {
  full_name: string
  email: string
  role: string
  username: string
  password?: string
  phone_number: string
  user_id?: string
}
