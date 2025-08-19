import React from 'react'
import {
  FaGlobe,
  FaHotel,
  FaHardHat,
  FaGamepad,
  FaUniversity,
  FaSuitcase,
} from "react-icons/fa";

interface CardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  bgColor: string;
}


const Solution = () => {
  
  const card: CardProps[] = [
  {
    title: "Global Commerce",
    description:
      "Enable local payment methods for your customers overseas and slash processing fees by 5–10x.",
    icon: <FaGlobe />,
    bgColor: "bg-white",
  },
  {
    title: "Travel & Hospitality",
    description:
      "Let your international travellers pay hassle-free, online or at a POS. For hotels, restaurants, vacation rentals and more.",
    icon: <FaHotel />,
    bgColor: "bg-blue-500",
  },
  {
    title: "Marketplaces & Contractors",
    description:
      "Accept payments from contractors / marketplace participants anywhere in the world. Mass payouts coming soon.",
    icon: <FaHardHat />,
    bgColor: "bg-orange-700",
  },
  {
    title: "Gaming & Entertainment",
    description:
      "Accept payments from users around the world. Settle instantly and stay fraud-proof.",
    icon: <FaGamepad />,
    bgColor: "bg-purple-200",
  },
  {
    title: "Treasury Flows",
    description:
      "Move money between entities in your organisation, bring in capital from overseas investors or repatriate funds to your domestic accounts.",
    icon: <FaUniversity />,
    bgColor: "bg-sky-300",
  },
  {
    title: "Import & Export (International trade)",
    description:
      "Pay or get paid from your international partners instantly, no unreasonable fees.",
    icon: <FaSuitcase />,
    bgColor: "bg-orange-500",
  },
];
  return (
<>

     {/* <div className='mt-32 lg:mt-44 -mb-20 lg:-mb-44'>
       <h1 className='text-center font-semibold text-2xl lg:text-[80px]'>Solution</h1>
    <h1 className='text-center font-semibold text-2xl rotate-12 opacity-20 lg:text-[80px] relative lg:bottom-7'>Solution</h1>
     </div> */}

   <div className="mt-32 lg:mt-72 p-4 lg:px-22 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
   
      {card.map((card, index) => (
        <div
          key={index}
          className={`${card.bgColor} rounded-xl p-10 bg-transparent card text-black flex flex-col shadow-xl justify-between min-h-[200px]`}
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