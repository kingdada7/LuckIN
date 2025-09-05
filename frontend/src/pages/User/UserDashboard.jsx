import React from 'react'
import { useUserAuth } from '../../hooks/useUserAuth'


const UserDashboard = () => {
  useUserAuth()
  return (
    <div>
      <h1>User Dashboard</h1>
    </div>
  )
}

export default UserDashboard
