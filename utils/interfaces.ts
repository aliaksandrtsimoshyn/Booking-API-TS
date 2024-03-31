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

export interface Departure {
  city: string
  airport: string
  airport_name: string
  time: string
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
