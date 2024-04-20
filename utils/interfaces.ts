export interface Departure {
  city: string
  airport: string
  airport_name: string
  time: string
}

export interface Flight {
  flight_id: number
  flight_no: string
  aircraft_code: string
  departure: Departure
  arrival: Departure
  status: string
}

export interface Flights {
  objects: [Flight]
}

export interface SpecificFlight {
  flight_info: Flight
  available_bookings_count: {
    economy: number
    comfort: number
    business: number
  }
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

export interface Seats {
  economy: [string]
  comfort: [string]
  business: [string]
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

export interface UserBooking {
  book_ref: string
  ticket_numbers: [string]
  book_date: string
}

export interface UserBookings {
  objects: [UserBooking]
}

export interface UserTicket {
  book_ref: string
  passenger_name: string
  contact_data: {
    email: string
    phone: string
  };
  fare_condition: string
  scheduled_departure: string
  departure_airport: string
  scheduled_arrival: string
  arrival_airport: string
}
