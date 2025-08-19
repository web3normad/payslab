'use client'
import { TbLogin } from "react-icons/tb";
import { IoMdClose } from "react-icons/io";
import { useState } from 'react';

const NavAcc = () => {

           const [IsOpenedAcc, setIsOpenedAcc ] = useState(false)
    
          const handleIsOpenedAcc = () => {
            setIsOpenedAcc(!IsOpenedAcc)
          }

  return (
    <div className="relative lg:hidden">
      {/* Show menu button only when overlay is closed */}
      
          <div
               onClick={handleIsOpenedAcc}
               className={` relative lg:hidden text-xl rounded-full p-3 z-50 ${IsOpenedAcc ? 'bg-white' : 'bg-black text-white'}`}
             >
               {IsOpenedAcc ? <IoMdClose /> : <TbLogin />}
             </div>
      

      {/* Overlay menu */}
      {IsOpenedAcc && (
        <div className="fixed top-0 right-0 w-full h-full bg-black/80 backdrop-blur-sm z-40">
        
   <ul className="lg:hidden flex flex-col gap-3 my-16 px-8">
  <li className="cursor-pointer mt-5 bg-white py-2 text-right font-medium px-4 rounded-full w-fit self-end">
    Sign In
  </li>

     <li className="cursor-pointer mt- bg-white py-2 text-right font-medium px-4 rounded-full w-fit self-end">
    Join now
  </li>

</ul>


        </div>
      )}
    </div>
  )
}

export default NavAcc
