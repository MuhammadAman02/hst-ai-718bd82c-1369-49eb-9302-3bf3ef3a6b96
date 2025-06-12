import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useAuthStore } from '../store/authStore'
import { LoginCredentials } from '../types'
import LoadingSpinner from '../components/LoadingSpinner'

const LoginPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, isLoading } = useAuthStore()
  
  const from = location.state?.from?.pathname || '/'

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginCredentials>()

  const onSubmit = async (data: LoginCredentials) => {
    const success = await login(data)
    if (success) {
      navigate(from, { replace: true })
    }
  }

  return (
    <div className="min-h-screen bg-nike-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="text-center">
            <h1 className="text-3xl font-black text-nike-black mb-2">NIKE</h1>
            <h2 className="text-2xl font-bold text-nike-black">Sign in to your account</h2>
            <p className="mt-2 text-sm text-nike-gray-600">
              Or{' '}
              <Link to="/register" className="font-medium text-nike-red hover:text-nike-orange">
                create a new account
              </Link>
            </p>
          </div>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-nike-gray-700">
                Username
              </label>
              <input
                {...register('username', { required: 'Username is required' })}
                type="text"
                className="input-field mt-1"
                placeholder="Enter your username"
              />
              {errors.username && (
                <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-nike-gray-700">
                Password
              </label>
              <input
                {...register('password', { required: 'Password is required' })}
                type="password"
                className="input-field mt-1"
                placeholder="Enter your password"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-nike-red focus:ring-nike-red border-nike-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-nike-gray-900">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <a href="#" className="font-medium text-nike-red hover:text-nike-orange">
                Forgot your password?
              </a>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary py-3 flex items-center justify-center"
            >
              {isLoading ? <LoadingSpinner size="sm" className="mr-2" /> : null}
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default LoginPage