import React from 'react'
import Image from 'next/image'
import logo from "@/public/images/logo.png"
import { FaXTwitter } from "react-icons/fa6";
import { FaLinkedin } from "react-icons/fa6";
import { FaMedium } from "react-icons/fa6";

const Footer = () => {
  return (
    <div className='md:mt-52'>
       <footer className="px-10 py-12 bg-white text-gray-800 font-sans">
      <div className="flex flex-col lg:flex-row  lg:mx-10">
        {/* Logo + Slogan + Icons */}
        <div className="flex-1">
          <div className="flex items-center text-2xl font-bold mb-2">
           
            <Image
              src={logo}
              alt="Logo"
              className="w-6 h-6 mr-2"
            />
            PaySlab
          </div>
          <p className=" text-[#454447] leading-relaxed mb-4">
            Enabling cost-efficient and instant<br />payments, worldwide.
          </p>
          <div className="flex gap-2">
            <button className="bg-white border border-gray-200 rounded-xl px-3 py-2 text-md shadow-sm">
              <FaXTwitter/>
            </button>
            <button className="bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm shadow-sm">
              <FaLinkedin/>
            </button>
            <button className="bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm shadow-sm">
              <FaMedium/>
            </button>
          </div>
        </div>

        {/* Link Columns */}
        {/* <div className="lg:mr-[100px] flex flex-1 flex-wrap lg:gap-32 gap-20  text-gray-400 pt-10 lg:pt-0">
          <div>
            <h4 className="text-black font-medium mb-2 cursor-pointer">Personal</h4>
            <ul className="space-y-1">
              <li className='cursor-pointer'>Wallet</li>
              <li className='cursor-pointer'>Accounts</li>
              <li className='cursor-pointer'>Transfers</li>
              <li className='cursor-pointer'>Features</li>
              <li className='cursor-pointer'>Security</li>
            </ul>
          </div>
          <div>
            <h4 className="text-black font-medium mb-2 cursor-pointer">Businesses</h4>
            <ul className="space-y-1">
              <li className='cursor-pointer'>Features</li>
              <li className='cursor-pointer'>Payments</li>
              <li className='cursor-pointer'>Transfers</li>
            </ul>
          </div>
          <div>
            <h4 className="text-black font-medium mb-2 cursor-pointer">Resources</h4>
            <ul className="space-y-1">
              <li className='cursor-pointer'>Guides</li>
              <li className='cursor-pointer'>Docs</li>
            </ul>
          </div>
          <div>
            <h4 className="text-black font-medium mb-2 cursor-pointer">About us</h4>
            <ul className="space-y-1">
              <li className='cursor-pointer'>Blog</li>
              <li className='cursor-pointer'>Contact</li>
            </ul>
          </div>
        </div> */}
      </div>

     
      
    </footer>

    <div className='lg:hidden md:hidden w-full text-gray-300 px-5'>
      <hr />

      <p className='pt-3 text-md'>&copy;2025 PaySlab Inc.</p>
    </div>

     {/* Footer Brand Name */}

    {/* <div className="hidden md:flex justify-center md:text-[200px] lg:text-[480px] font-bold text-[#454447] mt-5 leading-none text-center">
        PaySlab
      </div> */}
    </div>
  )
}

export default Footer
