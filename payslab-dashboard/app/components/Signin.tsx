// components/Signin.tsx (Enhanced)
'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useLoginWithEmail, usePrivy } from '@privy-io/react-auth';
import { FaRegEnvelope, FaGoogle, FaTwitter, FaTelegram } from "react-icons/fa6";
import { FiUnlock, FiBriefcase } from "react-icons/fi";

const logo = "/images/Payslab-logo.svg";

const Signin = () => {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [showBusinessForm, setShowBusinessForm] = useState(false);
  const { ready, authenticated, login } = usePrivy();
  
  const { sendCode, loginWithCode, state } = useLoginWithEmail({
    onComplete: (user, isNewUser) => {
      console.log('Email login successful:', user);
      console.log('Is new user:', isNewUser);
      
      if (isNewUser) {
        // For new users, show business name form
        setShowBusinessForm(true);
      } else {
        // For existing users, check if business name exists
        const savedBusinessName = localStorage.getItem('payslab_business_name');
        if (!savedBusinessName) {
          setShowBusinessForm(true);
        } else {
          // Redirect existing user with business name
          handleSuccessfulLogin();
        }
      }
    },
    onError: (error) => {
      console.error('Login error:', error);
      setCode('');
    }
  });

  const handleSuccessfulLogin = () => {
    setIsRedirecting(true);
    setTimeout(() => {
      window.location.href = process.env.NEXT_PUBLIC_DASHBOARD_URL || 'http://localhost:3001/dashboard';
    }, 1000);
  };

  const handleBusinessNameSubmit = () => {
    if (!businessName.trim()) return;
    
    // Save business name to localStorage
    localStorage.setItem('payslab_business_name', businessName.trim());
    
    // Also save email for navbar display
    if (email) {
      localStorage.setItem('payslab_user_email', email);
    }
    
    handleSuccessfulLogin();
  };

  // Handle successful authentication redirect
  useEffect(() => {
    if (authenticated && !isRedirecting && !showBusinessForm) {
      const savedBusinessName = localStorage.getItem('payslab_business_name');
      if (savedBusinessName) {
        setIsRedirecting(true);
        setTimeout(() => {
          window.location.href = process.env.NEXT_PUBLIC_DASHBOARD_URL || 'http://localhost:3001/dashboard';
        }, 500);
      } else {
        setShowBusinessForm(true);
      }
    }
  }, [authenticated, isRedirecting, showBusinessForm]);

  const handleEmailLogin = async () => {
    if (!email) return;
    try {
      console.log('Sending code to:', email);
      await sendCode({ email });
    } catch (error) {
      console.error('Error sending code:', error);
    }
  };

  const handleCodeSubmit = async () => {
    if (!code) return;
    try {
      console.log('Submitting code:', code);
      await loginWithCode({ code });
    } catch (error) {
      console.error('Error verifying code:', error);
      setCode('');
    }
  };

  const handleSocialLogin = () => {
    login();
  };

  const handleKeyPress = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter') {
      action();
    }
  };

  // Simple loading state while Privy initializes
  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Loading PaySlab...</p>
        </div>
      </div>
    );
  }

  // Simple success message if authenticated
  if (authenticated && isRedirecting) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-green-600 mb-4">Login Successful!</h1>
          <p className="text-gray-600">Taking you to dashboard...</p>
        </div>
      </div>
    );
  }

  // Business name collection form
  if (showBusinessForm) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-lg">
          <div className="text-center mb-8">
            <Image src={logo} alt='Logo Image' width={64} height={64} className="mx-auto mb-4"/>
            <h1 className='font-bold text-xl'>PaySlab</h1>
            <h2 className="text-2xl font-semibold mt-4 mb-2">Complete Your Profile</h2>
            <p className="text-gray-600">Please provide your business information to continue</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className='font-medium block mb-2' htmlFor="businessName">
                Business/Company Name
              </label>
              <div className="relative">
                <FiBriefcase className='absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500' />
                <input 
                  id="businessName"
                  type="text" 
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  onKeyPress={(e) => handleKeyPress(e, handleBusinessNameSubmit)}
                  className='bg-gray-200 p-3 pl-10 pr-4 rounded-md w-full outline-none focus:ring-2 focus:ring-black' 
                  placeholder='Your Company Ltd.'
                  autoFocus
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                This will be displayed in your dashboard and used for business verification
              </p>
            </div>

            <button 
              onClick={handleBusinessNameSubmit}
              disabled={!businessName.trim()}
              className='hover:bg-[#797979] disabled:bg-gray-400 disabled:cursor-not-allowed cursor-pointer bg-black text-white font-medium w-full p-3 rounded-xl transition-colors'
            >
              Complete Setup
            </button>

            <button 
              onClick={() => {
                setShowBusinessForm(false);
                setEmail('');
                setCode('');
                window.location.reload();
              }}
              className="w-full text-sm text-gray-500 hover:text-gray-700 underline"
            >
              Use different email
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isCodeInputPhase = state.status === 'awaiting-code-input';
  const isSendingCode = state.status === 'sending-code';
  const isSubmittingCode = state.status === 'submitting-code';

  return (
    <div className='pt-10'>
      {/* MAIN DIV HOLDING EVERYTHING */}
      <div className='flex justify-center gap-32 items-center'>
        
        {/* DIV HOLDING THE LEFT */}
        <div className="w-full max-w-md">
          <div>
            <Image src={logo} alt='Logo Image' width={64} height={64}/>
            <h1 className='font-bold'>PaySlab</h1>
          </div>

          <h1 className='text-5xl font-medium pt-10 pb-10'>sign In</h1>

          {/* Debug Information (remove in production) */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded text-sm">
              <p><strong>State:</strong> {state.status}</p>
              <p><strong>Authenticated:</strong> {authenticated ? 'Yes' : 'No'}</p>
              <p><strong>Ready:</strong> {ready ? 'Yes' : 'No'}</p>
            </div>
          )}

          {/* Email Input */}
          <div className="mb-4">
            <label className='font-medium block mb-2' htmlFor="email">Email Address</label>
            <div className="relative">
              <FaRegEnvelope className='absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500' />
              <input 
                id="email"
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={(e) => handleKeyPress(e, handleEmailLogin)}
                className='bg-gray-200 p-3 pl-10 pr-4 rounded-md w-full outline-none focus:ring-2 focus:ring-black' 
                placeholder='johndoe@gmail.com'
                disabled={isSendingCode || isCodeInputPhase || isSubmittingCode}
              />
            </div>
          </div>

          {/* Show code input if waiting for code */}
          {isCodeInputPhase && (
            <div className='mb-4'>
              <label className='font-medium block mb-2' htmlFor="code">Verification Code</label>
              <div className="relative">
                <FiUnlock className='absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500' />
                <input 
                  id="code"
                  type="text" 
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  onKeyPress={(e) => handleKeyPress(e, handleCodeSubmit)}
                  className='bg-gray-200 p-3 pl-10 pr-4 rounded-md w-full outline-none focus:ring-2 focus:ring-black' 
                  placeholder='Enter 6-digit code'
                  maxLength={6}
                  autoFocus
                />
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Check your email for the verification code from PaySlab
              </p>
            </div>
          )}

          {/* Error Display */}
          {state.status === 'error' && state.error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              <p className="font-medium">Authentication Error</p>
              <p className="text-sm">{String(state.error)}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="text-sm underline mt-2"
              >
                Try again
              </button>
            </div>
          )}

          {/* Action Button */}
          {!isCodeInputPhase ? (
            <button 
              onClick={handleEmailLogin}
              disabled={!email || isSendingCode}
              className='hover:bg-[#797979] disabled:bg-gray-400 disabled:cursor-not-allowed cursor-pointer bg-black text-white font-medium w-full p-3 rounded-xl transition-colors'
            >
              {isSendingCode ? 'Sending Code...' : 'Send Verification Code'}
            </button>
          ) : (
            <button 
              onClick={handleCodeSubmit}
              disabled={!code || isSubmittingCode}
              className='hover:bg-[#797979] disabled:bg-gray-400 disabled:cursor-not-allowed cursor-pointer bg-black text-white font-medium w-full p-3 rounded-xl transition-colors'
            >
              {isSubmittingCode ? 'Verifying...' : 'Verify & Sign In'}
            </button>
          )}

          {/* Reset Flow Button (for debugging) */}
          {isCodeInputPhase && (
            <button 
              onClick={() => {
                setEmail('');
                setCode('');
                window.location.reload();
              }}
              className="w-full mt-2 text-sm text-gray-500 hover:text-gray-700 underline"
            >
              Use different email
            </button>
          )}

          <div className='pt-4'>
            <p className='cursor-pointer text-sm text-gray-500'>
              Don't have an account?
              <span className='cursor-pointer text-black ml-1 hover:underline'>Sign up</span>
            </p>
            <h1 className='cursor-pointer text-sm hover:underline'>Forgot Password</h1>
          </div>

          {/* Social Login Options */}
          <div className='flex gap-4 pt-7 justify-center lg:justify-start'>
            <button 
              onClick={handleSocialLogin}
              className='bg-white hover:bg-gray-50 cursor-pointer rounded-full p-3 border border-gray-200 transition-colors'
              title="Continue with Google"
            >
              <FaGoogle className='w-6 h-6 text-red-500'/>
            </button>
            
            <button 
              onClick={handleSocialLogin}
              className='bg-white hover:bg-gray-50 cursor-pointer rounded-full p-3 border border-gray-200 transition-colors'
              title="Continue with Twitter"
            >
              <FaTwitter className='w-6 h-6 text-blue-500'/>
            </button>
            
            <button 
              onClick={handleSocialLogin}
              className='bg-white hover:bg-gray-50 cursor-pointer rounded-full p-3 border border-gray-200 transition-colors'
              title="Continue with Telegram"
            >
              <FaTelegram className='w-6 h-6 text-blue-400'/>
            </button>
          </div>
        </div>

        {/* DIV HOLDING THE RIGHT */}
        <div className='hidden lg:flex card w-[35%] text-white pb-20'>
          <div className='px-20'>
            <div>
              <Image src={logo} alt='Logo Image' className='w-[200px] pt-10' width={200} height={80}/>
            </div>

            <h1 className='font-medium ml-5 pt-3'>PaySlab</h1>

            <div>
              <h1 className='text-4xl font-semibold ml-5 pt-10'>Welcome to PaySlab</h1>

              <div className='ml-6 pt-7'>
                <p>Your Trusted Cross-Border Trade Payment Automation Platform</p>

                <p className='pt-5'>
                  At PaySlab, we empower international traders to transact with confidence. Our platform is designed to streamline and automate cross-border payments, ensuring every transaction is safe, efficient, and transparent. Whether you're importing goods or managing global partners, PaySlab takes the complexity out of international trade payments.
                </p>

                <p className='pt-5 font-semibold'>Join us today and experience the smarter, safer way to transact across borders.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signin;