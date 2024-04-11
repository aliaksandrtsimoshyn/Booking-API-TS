import { APIRequestContext } from '@playwright/test'
import { User } from '../utils/interfaces'
import { roles } from './enums'

type Settings = {
  baseURL: string
  adminAPIContext: APIRequestContext | null
  customerAPIContext: APIRequestContext | null
}

type TestUsers = {
  admin: User
  customer: User
}

export const settings: Settings = {
  baseURL: process.env.URL || '',
  adminAPIContext: null,
  customerAPIContext: null,
}

export const testUsers: TestUsers = {
  admin: {
    full_name: 'ALEX',
    email: 'alex@gmail.com',
    role: roles.admin,
    username: process.env.ADMINNAME || '',
    password: process.env.ADMINPASSWORD || '',
    phone_number: '1111111',
    user_id: '347',
  },
  customer: {
    full_name: 'ALEXCUST',
    email: 'alexcust@gmail.com',
    role: roles.customer,
    username: process.env.CUSTOMERNAME || '',
    password: process.env.CUSTOMERPASSWORD || '',
    phone_number: '3333333',
    user_id: '593',
  },
}

// {
//   "full_name": "ALEX",
//   "email": "alex@gmail.com",
//   "role": "admin",
//   "username": "alex",
//   "password": 7777777,
//   "phone_number": "1111111",
//   "user_id": 347
// }

// {
//   "full_name": "ALEXCUST",
//   "email": "alexcust@gmail.com",
//   "role": "customer",
//   "username": "alexcust",
//   "password": 7777777,
//   "phone_number": "3333333",
//   "user_id": 593
// }
