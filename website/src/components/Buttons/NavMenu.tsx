'use client'

import { TbMenu } from "react-icons/tb";
import { IoMdClose } from "react-icons/io";
import { useState } from 'react';

const NavMenu = () => {
  const [IsOpenedMenu, setIsOpenedMenu] = useState(false);

  const handleIsOpenedMenu = () => {
    setIsOpenedMenu(!IsOpenedMenu);
  };

  return (
    <div className="lg:relative-none relative lg:hidden">
      {/* Menu button (always on top) */}
      <div
        onClick={handleIsOpenedMenu}
        className={`sticky top-5 left-1 lg:hidden text-xl rounded-full p-3 z-50 ${IsOpenedMenu ? 'bg-white' : 'bg-black text-white'}`}
      >
        {IsOpenedMenu ? <IoMdClose /> : <TbMenu />}
      </div>

      {/* Overlay menu */}
      {IsOpenedMenu && (
        <div className="fixed top-0 right-0 w-full h-full bg-black/80 backdrop-blur-sm z-40">
          <ul className="lg:hidden flex flex-col gap-4 my-16 px-16">
            {/* <li className="cursor-pointer mt-5 bg-white py-2 font-medium px-4 rounded-full w-fit">Personal</li> */}
            <li className=" cursor-pointer bg-white py-2 font-medium px-4 rounded-full w-fit">
              Business
              {/* <p className="text-[7px] text-center">Coming soon!</p> */}
            </li>
            <li className="cursor-pointer bg-white py-2 font-medium px-4 rounded-full w-fit">About us</li>
            <li className="cursor-pointer  bg-white py-2 font-medium px-4 rounded-full w-fit">Join waitlist</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default NavMenu;
