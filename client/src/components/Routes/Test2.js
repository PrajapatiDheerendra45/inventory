import React from 'react'
import { useNavigate } from 'react-router-dom'
import { FaExclamationTriangle } from 'react-icons/fa'

const AccessDenied1 = () => {
  const navigate = useNavigate()

  const handleGoBack = () => {
    navigate('/')
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 responsive-container">
      <div className="p-16 rounded-lg shadow-xl bg-red-600 text-white shadow-2xl shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] max-w-4xl">
        {/* Warning Icon */}
        <div className="flex justify-center mb-6">
          <FaExclamationTriangle className="text-6xl text-yellow-400" />
        </div>
        <h1 className="text-5xl font-bold mb-8 text-center">Access Denied</h1>
        <p className="text-2xl text-center mb-8">
          Sorry, you cannot login (admin's subscription has been expired).
        </p>
        <button
          className="bg-white text-red-600 px-8 py-4 text-2xl rounded font-semibold hover:bg-gray-200 transition duration-300 w-full"
          onClick={handleGoBack}
        >
          Go Back to Home
        </button>
      </div>
    </div>
  )
}

export default AccessDenied1
