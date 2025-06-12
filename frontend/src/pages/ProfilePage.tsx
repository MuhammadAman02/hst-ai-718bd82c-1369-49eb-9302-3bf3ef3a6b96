import { useForm } from 'react-hook-form'
import { useAuthStore } from '../store/authStore'
import { UserUpdate } from '../types'
import LoadingSpinner from '../components/LoadingSpinner'

const ProfilePage = () => {
  const { user } = useAuthStore()

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<UserUpdate>({
    defaultValues: {
      first_name: user?.first_name || '',
      last_name: user?.last_name || '',
      phone: user?.phone || '',
      address: user?.address || '',
      city: user?.city || '',
      state: user?.state || '',
      zip_code: user?.zip_code || '',
      country: user?.country || 'United States'
    }
  })

  const onSubmit = async (data: UserUpdate) => {
    // TODO: Implement profile update
    console.log('Update profile:', data)
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-nike-black mb-8">My Profile</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Info */}
          <div className="lg:col-span-1">
            <div className="card p-6">
              <div className="text-center mb-6">
                <div className="w-24 h-24 bg-nike-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl font-bold text-nike-gray-600">
                    {user.first_name[0]}{user.last_name[0]}
                  </span>
                </div>
                <h2 className="text-xl font-semibold">{user.first_name} {user.last_name}</h2>
                <p className="text-nike-gray-600">@{user.username}</p>
                <p className="text-nike-gray-600">{user.email}</p>
              </div>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-nike-gray-600">Member since:</span>
                  <span>{new Date(user.created_at).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-nike-gray-600">Account status:</span>
                  <span className={user.is_active ? 'text-green-600' : 'text-red-600'}>
                    {user.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                {user.is_admin && (
                  <div className="flex justify-between">
                    <span className="text-nike-gray-600">Role:</span>
                    <span className="text-nike-red font-medium">Administrator</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Profile Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="card p-6">
                <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-nike-gray-700 mb-1">
                      First Name
                    </label>
                    <input
                      {...register('first_name', { required: 'First name is required' })}
                      className="input-field"
                    />
                    {errors.first_name && (
                      <p className="mt-1 text-sm text-red-600">{errors.first_name.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-nike-gray-700 mb-1">
                      Last Name
                    </label>
                    <input
                      {...register('last_name', { required: 'Last name is required' })}
                      className="input-field"
                    />
                    {errors.last_name && (
                      <p className="mt-1 text-sm text-red-600">{errors.last_name.message}</p>
                    )}
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-nike-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    {...register('phone')}
                    className="input-field"
                    placeholder="Enter your phone number"
                  />
                </div>
              </div>

              <div className="card p-6">
                <h3 className="text-lg font-semibold mb-4">Address Information</h3>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-nike-gray-700 mb-1">
                    Address
                  </label>
                  <input
                    {...register('address')}
                    className="input-field"
                    placeholder="Street address"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-nike-gray-700 mb-1">
                      City
                    </label>
                    <input
                      {...register('city')}
                      className="input-field"
                      placeholder="City"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-nike-gray-700 mb-1">
                      State
                    </label>
                    <input
                      {...register('state')}
                      className="input-field"
                      placeholder="State"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-nike-gray-700 mb-1">
                      ZIP Code
                    </label>
                    <input
                      {...register('zip_code')}
                      className="input-field"
                      placeholder="ZIP code"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-nike-gray-700 mb-1">
                      Country
                    </label>
                    <input
                      {...register('country')}
                      className="input-field"
                      placeholder="Country"
                    />
                  </div>
                </div>
              </div>

              <div className="flex space-x-4">
                <button type="submit" className="btn-primary">
                  Update Profile
                </button>
                <button type="button" className="btn-secondary">
                  Change Password
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage