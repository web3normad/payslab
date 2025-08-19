import React from 'react'
import Image from 'next/image'
import logo from "@/public/images/logo-removebg-preview(1).png"
import google from "@/public/images/search.png"
import facebook from "@/public/images/facebook.png"
import telegram from "@/public/images/telegram.png"
import { FaRegEnvelope } from "react-icons/fa6";
import { FiUnlock } from "react-icons/fi";

// bg-[#f3f3f3]

const Signin = () => {
  return (
    <div className='pt-10 '>

        {/* MAIN DIV HOLDING EVERYTHING  */}

        <div className='flex justify-center gap-32 items-center '>
        
        {/* DIV HOLDING THE LEFT */}

            <div>

                <div>
                    <Image src={logo} alt='Logo Image'/>
                    <h1 className='font-bold'>PaySlab</h1>
                </div>

                <h1 className='text-5xl font-medium pt-10 pb-10'>sign In</h1>
                    

                <form action="">

                         <div>
                        <label className='font-medium' htmlFor="">Email Address</label><br />
                        <FaRegEnvelope className='absolute mt-5 ml-3' />
                        <input type="email" className='bg-gray-200 p-3 px-10 rounded-md mt-1 outline-none' placeholder='Johndoe@gmail.com' />
                    </div>

                     <div className='pt-5'>
                        <label className='font-medium' htmlFor="">Password</label><br />
                        <FiUnlock className='absolute mt-5 ml-3' />
                        <input type="password" className='bg-gray-200 p-3 px-10 rounded-md mt-1 outline-none' placeholder='• • • • • •'/>
                    </div>

                    <div className='flex gap-4 pt-4'>
                        <input className=' w-5 border-2 border-black rounded focus:ring-1 focus:ring-gray-900 outline-none' type="checkbox" />
                        <p className='font-medium '>Remember me</p>
                    </div>

                    <button className= 'hover:bg-[#797979] cursor-pointer bg-black text-white font-medium w-full p-2 rounded-xl mt-7'>
                        Sign in
                    </button>
                    

                    <div className='pt-4'>
                        <p className='cursor-pointer text-sm text-gray-500 '>Don't have an account?<span className='cursor-pointer text-black ml-1'>Sign up</span></p>
                        <h1 className='cursor-pointer text-sm'>Forgot Password</h1>
                    </div>


                    <div className='flex gap-7 pt-7 justify-center lg:justify-start'>
                        <div className='bg-white cursor-pointer rounded-full p-3'>
                            <Image className='w-10' src={google} alt='Logo Image'/>
                        </div>
                        
                        <div className='bg-white cursor-pointer rounded-full p-3'>
                            <Image className='w-10' src={telegram} alt='Logo Image'/>
                        </div>
                        
                        <div className='bg-white cursor-pointer rounded-full p-3'>
                            <Image className='w-10' src={facebook} alt='Logo Image'/>
                        </div>
                    </div>

                </form>

            </div>


            {/* DIV HOLDING THE RIGHT */}

                <div className='hidden lg:flex card w-[35%] text-white pb-20'>

                    <div className='px-20'>
                        
                        <div>
                            <Image src={logo} alt='Logo Image' className='w-[200px] pt-10'/>
                        </div>

                        <h1 className='font-medium ml-5 pt-3'>PaySlab</h1>

                        <div>
                            <h1 className='text-4xl font-semibold ml-5 pt-10'>Welcome to PaySlab</h1>

                           <div className='ml-6 pt-7'>
                             <p>Your Trusted Cross-Border Trade Payment Automation Platform</p>

                            <p className='pt-5'>

                                At PaySlab, we empower international traders to transact with confidence. Our platform is designed to streamline and automate cross-border payments, ensuring every transaction is safe, efficient, and transparent. Whether you're importing goods or managing global partners, PaySlab takes the complexity out of international trade payments.</p>

                            <p className='pt-5 font-semibold'>Join us today and experience the smarter, safer way to transact across borders.</p>
                           </div>
                        </div>
                    </div>

                </div>

        </div>
    </div>
  )
}

export default Signin
