'use client'
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import Image from 'next/image'
import logo from "@/public/images/logo.webp"
import { useState, useRef, useEffect } from 'react';
import NavMenu from "@/src/components/Buttons/NavMenu";
import NavAcc from "@/src/components/Buttons/NavAcc";
import { PiWalletBold } from "react-icons/pi";
import { PiCalendar } from "react-icons/pi";
import { LuArrowDownUp } from "react-icons/lu";
import { IoFingerPrintSharp } from "react-icons/io5";
import { FaXTwitter } from "react-icons/fa6";
import { FaLinkedin } from "react-icons/fa6";
import { FaMedium } from "react-icons/fa6";
import {motion} from "framer-motion"
import Link from "next/link";

const Header = () => {
  // FOR THE LANGUAGE DROPDOWN
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  // State for each dropdown
  const [personalOpen, setPersonalOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [waitlistOpen, setWaitlistOpen] = useState(false);

  return (
    <motion.div 
      initial={{ opacity: 0, y: -50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 3, ease: "easeInOut" }}
      viewport={{ once: true }}
    >
      {/* NAV BAR */}
      <nav className='flex justify-between items-center lg:p-10 lg:px-20 p-5'>
        
        {/* MOBILE MENU */}
        <NavMenu/>

        {/* LOGO */}
        <div className='flex items-center'>
          <Image className='w-10' src={logo} alt="Logo" />
          <h1 className='text-2xl font-semibold'>PaySlab</h1>
        </div>

        {/* NAV NAVIGATION */}
        <div>
          <ul className="hidden lg:flex flex-col lg:flex-row font-medium space-x-10 shadow-xs border border-gray-200 lg:p-3 lg:pt-5 lg:px-10 lg:rounded-full">

            {/* Personal */}
            {/* <li 
              className="relative group cursor-pointer hover:bg-gray-300 p-1 px-4 rounded-xl"
              onClick={() => setPersonalOpen(!personalOpen)}
            >
              Personal
              {personalOpen && (
                <div className="absolute top-full -left-36 mt-4 w-max bg-white shadow-md rounded-xl p-6 z-50 flex flex-row gap-20 items-center">
                  <div className="flex-col gap-5 flex">
                    <div className="bg-gray-300 w-fit text-2xl p-3 rounded-full"><LuArrowDownUp /></div>
                    <div>
                      <h4 className="font-semibold">Stable coin <br /> conversion</h4>
                      <p className="text-sm text-gray-600">Spend globally. <br /> receive locally</p>
                    </div>
                  </div>
                  <div className="flex-col gap-5 flex">
                    <div className="bg-gray-300 w-fit text-2xl p-3 rounded-full"><PiWalletBold /></div>
                    <div>
                      <h4 className="font-semibold">Spend from <br /> your wallet</h4>
                      <p className="text-sm text-gray-600">Spend crypto like <br /> you're used to</p>
                    </div>
                  </div>
                  <div className="flex-col gap-5 flex">
                    <div className="bg-gray-300 w-fit text-2xl p-3 rounded-full"><PiCalendar /></div>
                    <div>
                      <h4 className="font-semibold">Automate your <br /> finances</h4>
                      <p className="text-sm text-gray-600">Plan recurring <br /> payments</p>
                    </div>
                  </div>
                  <div className="flex-col gap-5 flex">
                    <div className="bg-gray-300 w-fit text-2xl p-3 rounded-full"><IoFingerPrintSharp /></div>
                    <div>
                      <h4 className="font-semibold">Security and <br /> ownership</h4>
                      <p className="text-sm text-gray-600">100% non <br /> custodial control</p>
                    </div>
                  </div>
                </div>
              )}
            </li> */}

            {/* Business (Coming Soon) */}
            <li className=" cursor-pointer text-center hover:bg-gray-300 p-1 px-4 rounded-xl">
              Business
              {/* <p className="text-[7px]">Coming soon!</p> */}
            </li>

            {/* About Us */}
            <li 
              className="relative group cursor-pointer hover:bg-gray-300 p-1 px-4 rounded-xl"
              onClick={() => setAboutOpen(!aboutOpen)}
            >
              About us
              {aboutOpen && (
                <div className="absolute top-full -left-[270px] mt-4 w-[540px] bg-white shadow-md rounded-xl p-6 z-50 flex flex-col gap-5">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl bg-white shadow-xl p-2 rounded-xl"><FaXTwitter className="text-gray-500" /></div>
                    <p className="text-sm text-gray-600 bg-gray-100 p-3 rounded-r-xl">Follow us on Twitter</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-2xl bg-white shadow-xl p-2 rounded-xl"><FaLinkedin className="text-gray-500" /></div>
                    <p className="text-sm text-gray-600 bg-gray-100 p-3 rounded-r-xl">Follow us on LinkedIn</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-2xl bg-white shadow-xl p-2 rounded-xl"><FaMedium className="text-gray-500" /></div>
                    <p className="text-sm text-gray-600 bg-gray-100 p-3 rounded-r-xl">Follow us on Medium</p>
                  </div>
                </div>
              )}
            </li>

            {/* Join Waitlist */}
            <li 
              className="relative group cursor-pointer hover:bg-gray-300 p-1 px-4 rounded-xl"
              onClick={() => setWaitlistOpen(!waitlistOpen)}
            >
              Join waitlist
              {waitlistOpen && (
                <div className="absolute top-full -left-[400px] mt-4 w-[540px] bg-white shadow-md rounded-xl p-6 z-50 flex flex-col gap-5 items-center">
                  <h1 className="text-center font-semibold">Join the waitlist for our upcoming beta!</h1>
                  <div className="pt-2 flex justify-center w-full">
                    <input className="bg-gray-200 p-3 outline-none px-5 w-[300px] rounded-l-full" placeholder="email" type="email" />
                    <button className="bg-black cursor-pointer text-white p-3 relative right-4 rounded-full">Join Waitlist</button>
                  </div>
                </div>
              )}
            </li>
          </ul>
        </div>

        {/* BUTTONS AND LANGUAGE DROPDOWN */}
        <div className='flex items-center lg:gap-5 gap-2'>
          <div>
            {/* <div className="relative" ref={dropdownRef}>
              <h1
                className='flex items-center font-medium cursor-pointer select-none'
                onClick={() => setOpen((prev) => !prev)}
              >
                EN <MdOutlineKeyboardArrowDown className='text-xl font-medium'/>
              </h1>
              {open && (
                <div className="absolute right-0 lg:mt-2 mt-16 w-fit rounded-xl shadow z-10 bg-black px-2 py-3 text-white">
                  <ul className="">
                    <li className="px-4 py-2 hover:bg-gray-900 rounded-xl cursor-pointer">English</li>
                    <li className="px-4 py-2 hover:bg-gray-900 rounded-xl cursor-pointer">Español</li>
                    <li className="px-4 py-2 hover:bg-gray-900 rounded-xl cursor-pointer">Português</li>
                  </ul>
                </div>
              )}
            </div> */}
          </div>

          {/* BUTTON */}
          <div className='hidden lg:flex'>
            <button className='bg-black text-white cursor-pointer text-sm rounded-l-full font-medium lg:py-4 lg:px-12 hover:bg-gray-300 hover:text-black'>Sign Up</button>
              <Link  href={"/sign-in"}>
              <button className='bg-gray-300 text-black cursor-pointer text-sm rounded-full font-medium lg:py-4 lg:px-7 relative lg:right-8 hover:bg-white'>Sign In</button>
              </Link>
          </div>
          
          {/* MOBILE LOGIN */}
          <NavAcc/>
        </div>
      </nav>
    </motion.div>
  )
}

export default Header