import React from 'react'
import {
  FaGlobe,
  FaHotel,
  FaHardHat,
  FaGamepad,
  FaUniversity,
  FaSuitcase,
  FaLock,
   FaMoneyBillWave,
  FaTruckMoving,
  FaClock,
  FaFileInvoiceDollar,

} from "react-icons/fa";


import {
 GiCargoShip,
} from "react-icons/gi";

import { RiExchangeFill } from "react-icons/ri";

import { IoDocumentText } from "react-icons/io5";

import { MdPayments } from "react-icons/md";

interface CardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  bgColor: string;
}


const Solution = () => {
  
  const card: CardProps[] = [
  {
    title: "Transparent Low-Cost Transactions",
    description:
      "Local funding in Nigerian Naira (NGN) with automatic conversion to stablecoins minimizes hidden fees and reduces transaction costs.",
    icon: <RiExchangeFill />,
    bgColor: "bg-white",
  },
  {
    title: "Global Access & Inclusion",
    description:
      "Seamless onboarding for businesses worldwide, enabling easy participation in cross-border trade without traditional banking barriers.",
    icon: <FaGlobe />,
    bgColor: "bg-blue-500",
  },
  {
    title: "Secure, Verified Transactions",
    description:
      "Accept payments from contractors / marketplace participants anywhere in the world. Mass payouts coming soon.",
    icon: <FaLock />,
    bgColor: "bg-orange-700",
  },
  {
    title: "Real-Time Shipment & Payment Tracking",
    description:
      "Milestone-based payment releases tied directly to verified shipment progress, accelerating cash flow and improving visibility.",
    icon: <GiCargoShip />,
    bgColor: "bg-purple-200",
  },
  {
    title: "Simplified Digital Documentation",
    description:
      "Move money between entities in your organisation, bring in capital from overseas investors or repatriate funds to your domestic accounts.",
    icon: <IoDocumentText />,
    bgColor: "bg-sky-300",
  },
  {
    title: "Import & Export (International trade)",
    description:
      "Pay or get paid from your international partners instantly, no unreasonable fees.",
    icon: <MdPayments />,
    bgColor: "bg-orange-500",
  },
];
  return (
<>

     {/* <div className='mt-32 lg:mt-44 -mb-20 lg:-mb-44'>
       <h1 className='text-center font-semibold text-2xl lg:text-[80px]'>Solution</h1>
    <h1 className='text-center font-semibold text-2xl rotate-12 opacity-20 lg:text-[80px] relative lg:bottom-7'>Solution</h1>
     </div> */}

     <div className="mt-36 lg:mt-72 text-center">
        <h2 className="font-semibold text-lg lg:text-2xl text-neutral-600 mt-4 max-w-3xl mx-auto">
          PaySlab Solves the Biggest Challenges in Cross-Border Shipping: High Costs, Slow Delivery, and Complex Transactions
        </h2>
      </div>

   <div className="mt-20 lg:mt-40 p-4 lg:px-22 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    
   
      {card.map((card, index) => (
        <div
          key={index}
          className={`${card.bgColor} rounded-xl p-6 bg-transparent card text-black flex flex-col shadow-xl justify-between min-h-[200px] hover:scale-105 hover:shadow-2xl transition-transform duration-300 cursor-pointer`}
        >
          <div className='text-white'>
            <h3 className="font-bold text-2xl mb-7">{card.title}</h3>
            <p className="text-md">{card.description}</p>
          </div>
          <div className="self-end text-2xl lg:text-4xl mt-12 p-3 bg-black text-white  flex items-center justify-center rounded-full">
            {card.icon}
          </div>
        </div>
      ))}
    </div>
</>
  );
};

export default Solution