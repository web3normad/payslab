"use client";
import Image from "next/image";
import React from "react";
import { motion } from "framer-motion";

const Hero = () => {
  return (
    <section className="">
      <div className="  sm:px-5 lg:px-20  text-[#2E2E2E] text-[70px] sm:text-[80px] md:text-[148px]  2xl:text-[212px] tracking-tighter font-bold  max-w-[1920px] grid place-items-center 2xl:place-items-start  py-0  mx-auto 2xl:-mt-10">
        <div>
          {/* make */}
        <div className="flex gap-4 md:gap-8 items-center  mt-28 md:mt-20 ">
          <motion.h1
            initial={{ y: -50, opacity: 0 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            viewport={{ once: false }}
          >
            Make
          </motion.h1>
          <motion.div
            className=" w-40 sm:w-48 h-14 md:w-52 md:h-20 2xl:w-76 2xl:h-28 mt-4 md:mt-10 relative"
            initial={{ opacity: 0, y: -50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            viewport={{ once: false }}
          >
            <div className="w-full h-full bg-[#2E2E2E] rounded-[160px]"></div>
            <motion.div
              className="bg-white shadow-2xl p-3 2xl:p-4 rounded-2xl rotate-[20deg] absolute -left-18 -top-32  md:-top-48 2xl:-top-50 2xl:-left-30"
              initial={{ top: -120, left: -80 }}
              whileInView={{ left: -100, top: -165 }}
              transition={{ duration: 2, ease: "easeInOut" }}
              viewport={{ once: false }}
            >
              <Image
                src="/images/usdt.png"
                alt="usdt coin icon"
                width={40}
                height={40}
                className="md:size-14 2xl:size-18"
              />
            </motion.div>
            <motion.div
              className="bg-white shadow-2xl  p-3 2xl:p-4 rounded-2xl rotate-[50deg]  absolute -top-16 left-4 md:-top-20"
              initial={{ top: -4, left: 50 }}
              whileInView={{ left: 50, top: -90 }}
              transition={{ duration: 2, ease: "easeInOut" }}
              viewport={{ once: false }}
            >
              <Image
                src="/images/usdc.png"
                alt="usdc coin icon"
                width={40}
                height={40}
                className="md:size-14 2xl:size-18"
              />
            </motion.div>
            <div className="w-full h-full absolute top-0 bottom-0 overflow-hidden ">
              <motion.div
                className="bg-white shadow-2xl p-3 w-fit 2xl:p-4 opacity-70 rounded-2xl rotate-[20deg]  absolute -bottom-5 left-24 md:-bottom-10 2xl:left-38"
                initial={{ bottom: -80 }}
                whileInView={{ bottom: -30 }}
                transition={{ duration: 2, ease: "easeInOut" }}
                viewport={{ once: false }}
              >
                <Image
                  src="/images/eth.png"
                  alt="ethereum coin icon"
                  width={40}
                  height={40}
                  className="md:size-14 2xl:size-18"
                />
              </motion.div>
            </div>
          </motion.div>
        </div>
        {/* second */}
        <div className="flex gap-8 items-center 2xl:pl-30 -mt-10 md:-mt-24 xl:-mt-28">
          <motion.div
            className="hidden lg:flex items-center justify-center p-4 size-24 rounded-2xl bg-white shadow-2xl "
            initial={{ opacity: 0, x: -200 }}
            whileInView={{ opacity: 1, rotate: -20, x: 0 }}
            transition={{ duration: 2, ease: "easeInOut" }}
            viewport={{ once: false }}
          >
            <p className="text-[80px] text-[#1A191CCC] font-bold ">$</p>
          </motion.div>
          <motion.h1
            className="-tracking-widest lg:text-[130px] xl:text-[172px] 2xl:text-[212px]"
            initial={{ y: -50, opacity: 0 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            viewport={{ once: false }}
          >
            your money
          </motion.h1>
          <motion.div
            className="hidden lg:flex items-center justify-center p-4  size-24 rounded-2xl bg-white shadow-2xl rotate-[20deg]"
            initial={{ opacity: 0, x: 200 }}
            whileInView={{ opacity: 1, rotate: 20, x: 0 }}
            transition={{ duration: 2, ease: "easeInOut" }}
            viewport={{ once: false }}
          >
            <p className="text-[80px] text-[#1A191CCC] font-bold">€</p>
          </motion.div>
        </div>

        {/* third */}
        <div className="flex gap-4 md:gap-8 items-center xl:pl-60  2xl:pl-180  -mt-10 md:-mt-24  xl:-mt-28 mb-28 ">
          <motion.div
            className="w-40 sm:w-48 h-14 md:w-52 md:h-20 2xl:w-76 2xl:h-28  mt-4 md:mt-10 relative "
            initial={{ opacity: 0, y: -50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            viewport={{ once: false }}
          >
            <div className="w-full h-full bg-[#2E2E2E] rounded-[160px] shrink-0"></div>
            <div className="w-full h-full absolute top-0 bottom-0 overflow-hidden ">
              <motion.div
                className=" bg-white shadow-xl p-3 2xl:p-4 rounded-2xl opacity-50 -rotate-[20deg] absolute -top-8 left-4"
                initial={{ top: -80 }}
                whileInView={{ top: -25 }}
                transition={{ duration: 2, ease: "easeInOut" }}
                viewport={{ once: false }}
              >
                <Image
                  src="/images/optimism.png"
                  alt="optimism coin icon"
                  width={40}
                  height={40}
                  className="md:size-14 2xl:size-18"
                />
              </motion.div>
            </div>
            <motion.div
              className="  bg-white shadow-2xl p-3 2xl:p-4 rounded-2xl -rotate-[10deg] absolute right-4 top-8 md:top-16 md:right-8"
              initial={{ top: 20 }}
              whileInView={{ top: 60 }}
              transition={{ duration: 2, ease: "easeInOut" }}
              viewport={{ once: false }}
            >
              <Image
                src="/images/base.png"
                alt="base coin icon"
                width={40}
                height={40}
                className="md:size-14 2xl:size-18 "
              />
            </motion.div>
            <motion.div
              className="bg-white w-fit shadow-2xl  p-3 2xl:p-4 rounded-2xl rotate-[30deg] absolute -bottom-20 -right-20 md:-bottom-28 2xl:-right-30 -z-10"
              initial={{ bottom: -140, left: 250 }}
              whileInView={{ bottom: -150, left: 300 }}
              transition={{ duration: 2, ease: "easeInOut" }}
              viewport={{ once: false }}
            >
              <Image
                src="/images/arbi.png"
                alt="arbitrium coin icon"
                width={40}
                height={40}
                className="md:size-14 2xl:size-18 "
              />
            </motion.div>
          </motion.div>
          <motion.h1
            className=""
            initial={{ y: -50, opacity: 0 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut", repeat: 1 }}
            viewport={{ once: false }}
          >
            move
          </motion.h1>
        </div>
        </div>
      </div>
      {/* for waitlist */}
      <div className="px-5 lg:px-20  xl:text-2xl mx-auto md:mx-0 flex flex-col items-center md:items-start gap-6 md:-mt-26 xl:-mt-20 2xl:-mt-60">
        <p className="text-[#898D91E6]  w-[300px] xl:w-[400px] text-center md:text-left 2xl:leading-relaxed">
          Experience a new affordable and efficient way to send and receive
          digital payments worldwide
        </p>
        <button className="px-10 py-5 text-white font-medium hero-waitlist-btn ">
          Join our waitlist
        </button>
      </div>
    </section>
  );
};

export default Hero;
