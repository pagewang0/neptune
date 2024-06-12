import { useState } from 'react';
import { useLocation, Link } from "wouter";
import { AlertCircle } from "lucide-react"
import _ from 'lodash'


import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "./Alert.tsx"
import { Checkbox } from "./Checkbox.tsx"


import { joi } from '../../../../common/index.js'
import remote from '../remote/index'

export const CheckboxWithText = () => { // todo: remember feature
  return (
    <div className="items-top flex space-x-2">
      <Checkbox id="terms1" />
      <div className="grid gap-1.5 leading-none">
        <label
          htmlFor="terms1"
          className="text-sm leading-none peer-disabled:cursor-not-allowed"
        >
          Remember me
        </label>
      </div>
    </div>
  )
}

export const ShowAlertMessage = (message) => {
  const style = {
    'paddingTop': '0rem',
    'paddingBottom': '0rem',
  }

  return (
    <div className="flex flex-col p-6 space-y-1" style={style}>
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          {message}
        </AlertDescription>
      </Alert>
    </div>
  )
}

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [alert, setAlert] = useState('')
  const [, setLocation] = useLocation()

  const HandleSubmit = (e) => {
    e.preventDefault();

    const schema = joi.login();

    const { error } = schema.validate({ email, password })

    if (error) {
      return setAlert(error.message)
    }

    return remote.users.login({ email, password })
      .then(() => {
        alert && setAlert('')
        setLocation('/')
      })
      .catch(err => {
        setAlert(_.get(err, 'response.data.error', ''))
      })
  };

  return (
    <main className="flex h-screen w-full items-center justify-center bg-gray-100 px-4 dark:bg-gray-950">
      <div
        className="rounded-lg border bg-card text-card-foreground shadow-sm w-full max-w-md"
        data-v0-t="card"
      >
        <div className="flex flex-col p-6 space-y-1">
          <h3 className="whitespace-nowrap tracking-tight text-2xl font-bold">
            Welcome Back
          </h3>
          <p className="text-sm text-muted-foreground">
            Enter your email and password to login to your account.
          </p>
        </div>
        {alert && ShowAlertMessage(alert)}
        <form onSubmit={HandleSubmit}>
          <div className="p-6 space-y-4">
            <div className="space-y-2">
              <label
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                htmlFor="email"
              >
                Email
              </label>
              <input
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                id="email"
                placeholder="m@example.com"
                type="email"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center">
                <label
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  htmlFor="password"
                >
                  Password
                </label>
                <a className="ml-auto inline-block text-sm" href="#">
                  Forgot Password?
                </a>
              </div>
              <input
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                id="password"
                type="password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="flex items-center justify-between">
              {CheckboxWithText()}
              <div className="text-sm">
                <Link
                  href="/register"
                >
                  Create an account
                </Link>
              </div>
            </div>
            <button
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full"
              type="submit"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}