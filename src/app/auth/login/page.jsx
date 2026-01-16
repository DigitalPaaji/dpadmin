"use client"
import React, { useRef, useState } from 'react'
import { Lock, Mail, Eye, EyeOff, LogIn, X, Shield } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'

const AdminLoginPage = () => {
  const router = useRouter()
  

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  
  // Forgot password state
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [newPassword, setNewPassword] = useState('')
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false)
  const [verificationStep, setVerificationStep] = useState('email')
  
  const otpInputs  = useRef([]);


  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

 
    if (!email || !password) {
      setError("Please fill in all fields")
      return
    }

    if (!email.includes("@")) {
      setError("Please enter a valid email address")
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_LOCAL_PORT}/admin/login`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      )

      if (!response.ok) {
        const errorData = await response.json()
        setError(errorData.message || "Login failed. Please check your credentials.")
        return
      }

      const data = await response.json()
      
      if (data.success) {
        toast.success("Login successful!")
        router.push("/blogs")
      } else {
        setError(data.message || "Invalid credentials")
      }

    } catch (err) {
      console.error("Login error:", err)
      setError("Unable to connect to server. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // Handle forgot password - email submission
  const handleForgotPasswordEmail = async () => {
    if (!email) {
      setError("Please enter your email address")
      return
    }

    if (!email.includes("@")) {
      setError("Please enter a valid email address")
      return
    }

    setForgotPasswordLoading(true)
    setError("")

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_LOCAL_PORT}/admin/sendotp`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email })
        }
      )

      const data = await response.json()
      
      if (data.success) {
        toast.success("Verification code sent to your email")
        setVerificationStep('otp')
      } else {
        setError(data.message || "Failed to send verification code")
      }
    } catch (error) {
      toast.error("Failed to send verification code")
    } finally {
      setForgotPasswordLoading(false)
    }
  }

  // Handle OTP verification
  const handleVerifyOtp = async () => {
    const otpString = otp.join('')
    
    if (otpString.length !== 6) {
      setError("Please enter the complete 6-digit verification code")
      return
    }
    if(!newPassword || newPassword.length <4){
       setError("Please enter the Password more the 6 characters ")
      return
    }

 setForgotPasswordLoading(true)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_LOCAL_PORT}/admin/verifyotp`,{
          method: "POST",
       
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, newPassword,otp:otpString }),
      })
      const data = await response.json();
if(data.success){
  toast.success(data.message)
  setShowForgotPassword(false)
} else{
  
  toast.error(data.message)
}
   } catch (error) {
      toast.error("Verification failed")
    }
   
    // setForgotPasswordLoading(true)
    // setError("")

    // try {
    //   const response = await fetch(
    //     `${process.env.NEXT_PUBLIC_LOCAL_PORT}/admin/verify-otp`,
    //     {
    //       method: "POST",
    //       headers: { "Content-Type": "application/json" },
    //       body: JSON.stringify({ email, otp: otpString })
    //     }
    //   )

    //   const data = await response.json()
      
    //   if (data.success) {
    //     toast.success("Verification successful!")
    //     setVerificationStep('newPassword')
    //   } else {
    //     setError(data.message || "Invalid verification code")
    //   }
    // } catch (error) {
    //   toast.error("Verification failed")
    // }
     finally {
      setForgotPasswordLoading(false)
    }
  }


  // OTP input handlers
  const handleOtpChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return
    
    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    if (value && index < 5) {
      otpInputs.current[index + 1]?.focus()
    }
  }

  const handleOtpKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpInputs.current[index - 1]?.focus()
    }
  }

  const handleOtpPaste = (e) => {
    e.preventDefault()
    const text = e.clipboardData.getData("text").trim()
    
    if (/^\d{6}$/.test(text)) {
      const newOtp = text.split("")
      setOtp(newOtp)
      otpInputs.current[5]?.focus()
    }
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-2xl mb-4">
              <Lock className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Admin Portal
            </h1>
            <p className="text-gray-600">
              Sign in to access the dashboard
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <div className="w-5 h-5 bg-red-500 rounded-full flex-shrink-0 mt-0.5"></div>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  placeholder="admin@example.com"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  placeholder="••••••••"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 transition" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 transition" />
                  )}
                </button>
              </div>
            </div>

            {/* Forgot Password Link */}
            <div className="text-end">
              <button
                type="button"
                onClick={() => setShowForgotPassword(true)}
                className="text-sm text-blue-600 hover:text-blue-800 transition font-medium"
                disabled={isLoading}
              >
                Forgot password?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  <span>Sign In</span>
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-600">
              Contact your system administrator for support
            </p>
            <p className="text-xs text-gray-400 mt-4">
              © {new Date().getFullYear()} Admin Portal • v2.1.0
            </p>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Shield className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      Reset Password
                    </h2>
                    <p className="text-sm text-gray-600">
                      {verificationStep === 'email' && 'Enter your email to receive a verification code'}
                      {verificationStep === 'otp' && 'Enter the 6-digit code sent to your email'}
                     
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowForgotPassword(false)
                    setVerificationStep('email')
                    setError('')
                  }}
                  className="text-gray-400 hover:text-gray-600 transition"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {verificationStep === 'email' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                      placeholder="admin@example.com"
                      disabled={forgotPasswordLoading}
                    />
                  </div>
                </div>
              )}

              {verificationStep === 'otp' && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-4 text-center">
                      Enter the 6-digit verification code
                    </label>
                    <div
                      className="flex justify-center gap-2"
                      onPaste={handleOtpPaste}
                    >
                      {otp.map((digit, index) => (
                        <input
                          key={index}
                          ref={(el) => (otpInputs.current[index] = el)}
                          type="text"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleOtpChange(e.target.value, index)}
                          onKeyDown={(e) => handleOtpKeyDown(e, index)}
                          className="w-12 h-12 text-xl text-center border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition disabled:bg-gray-100"
                          disabled={forgotPasswordLoading}
                        />
                      ))}
                    </div>
<div className='my-5 mx-8 '>
  <input type="password" onChange={(e)=>setNewPassword(e.target.value)} value={newPassword}  placeholder='New Password' className='border border-gray-300 focus:ring-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500  rounded-2xl p-1 px-3 text-xl w-full' />
</div>

                  </div>
                </div>
              )}

             

              {/* Action Buttons */}
              <div className="mt-8 flex gap-3">
                {verificationStep !== 'email' && (
                  <button
                    onClick={() => setVerificationStep(prev => 
                      prev === 'otp' ? 'email' : 'otp'
                    )}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition flex-1"
                    disabled={forgotPasswordLoading}
                  >
                    Back
                  </button>
                )}
                <button
                  onClick={() => {
                    if (verificationStep === 'email') handleForgotPasswordEmail()
                    if (verificationStep === 'otp') handleVerifyOtp()
                 
                  }}
                  disabled={forgotPasswordLoading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex-1 disabled:bg-blue-400 disabled:cursor-not-allowed"
                >
                  {forgotPasswordLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Processing...</span>
                    </div>
                  ) : (
                    verificationStep === 'email' ? 'Send Code' :
                    verificationStep === 'otp' ? 'Verify Code' :
                    'Reset Password'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminLoginPage