import { defineConfig } from '@playwright/test'
import dotenv from 'dotenv'

dotenv.config({
  path: `.env`,
  //path: `./envs/.env.${process.env.ENV || 'qa'}`
  //path: `./envs/.env${process.env.ENV ? '.' + process.env.ENV : ''}`
  //path: './envs/.env' + (process.env.ENV ? '.' + process.env.ENV : '')
  //terminal: $env:ENV="prod"
})

export default defineConfig({
  testDir: './tests',

  retries: 0,

  workers: 5,

  timeout: 40 * 1000,

  expect: {
    timeout: 30 * 1000,
  },

  reporter: 'html',
})
