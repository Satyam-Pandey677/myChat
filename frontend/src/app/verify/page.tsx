"use client"

import { ArrowRight, Loader2, Mail } from 'lucide-react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect, useRef, useState } from 'react'


const VerifyPage = () => {
    const [verifyemail, setEmail] = useState<string>("");
    const[loading, setLoading] = useState<boolean>(false);
    const[otp, setOTP] = useState<string[]>(["","","","","",""])
    const[error, setError] = useState<string>("");
    const[resendLoading, setResendLoading] = useState(false);
    const[timer, setTimer] = useState(60);
    const inputRef = useRef<Array<HTMLInputElement>|null>([]);

    const router = useRouter()
    
    const searchParams = useSearchParams();
    const email:string = searchParams.get("email") || "";

    useEffect(() => {
        if(timer>0){
            const interval = setInterval(() => {
                setTimer((prev) => prev-1)
            },1000);
            return () => clearInterval(interval)
        }
    },[timer])

    const handleInputChange = (index:number, value:string): void => {
        if(value.length){}

    }

    const handleSubmit = () => {
        
    }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-gray-800 border-gray-700 rounded-lg p-8">
          <div className="text-center mb-8">
            <div className="mx-auto w-20 h-20 bg-blue-600 rounded-lg flex items-center justify-center mb-6">
              <Mail size={40} className="text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-3 ">
              Verify Your Email
            </h1>

            <p className="text-gray-300 text-lg">
              We have send six digit code to 
            </p>
            <p className='text-blue-400 font-medium'>{email}</p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                // value={email}
                // onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-4 bg-gray-700 border-gray-700 rounded-lg text-white"
                placeholder="Enter you email address"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed "
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                    <Loader2 className="w-5 h-5"/>
                    Verifying..
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <span>Verify</span>
                  <ArrowRight className="w-5 h-5" />
                </div>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default VerifyPage