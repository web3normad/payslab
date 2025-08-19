"use client";
import Image from "next/image";
import React from "react";
import { motion } from "framer-motion";

const CTA = () => {
  return (
    <section className="w-full px-5 lg:px-20 pt-20">
      <div className=" w-full max-w-[1440px] mx-auto sm:pl-10 pb-10  flex  items-center justify-between border-3  border-[#4A4A4A08] rounded-4xl relative overflow-hidden">
        <div className="w-full md:w-3/5 grid place-items-center md:place-items-start ">
          <div className="  text-[#2E2E2E] text-[70px] 2xl:text-[148px]  tracking-tighter font-bold">
            <div className="flex gap-4 md:gap-8 items-center ">
              <h1 className="">Make</h1>
              <div className=" w-48 h-14 xl:w-52 xl:h-20  mt-4 md:mt-10 relative">
                <div className="w-full h-full bg-[#2E2E2E] rounded-[160px] shrink-0"></div>
                <div className="bg-white shadow-2xl p-3  rounded-2xl rotate-[20deg] absolute -left-18 -top-28 2xl:-top-48  ">
                  <Image
                    src="/images/usdt.png"
                    alt="usdt coin icon"
                    width={40}
                    height={40}
                    className="2xl:size-14 "
                  />
                </div>
                <div className="bg-white shadow-2xl  p-3  rounded-2xl -rotate-[20deg] absolute -top-16 left-4 2xl:-top-20">
                  <Image
                    src="/images/usdc.png"
                    alt="usdc coin icon"
                    width={40}
                    height={40}
                    className="2xl:size-14"
                  />
                </div>
                <div className="w-full h-full absolute top-0 bottom-0 overflow-hidden ">
                  <div className="bg-white shadow-2xl p-3  rounded-2xl rotate-[20deg] absolute -bottom-5 left-24 2xl:-bottom-10 ">
                    <Image
                      src="/images/eth.png"
                      alt="ethereum coin icon"
                      width={40}
                      height={40}
                      className="2xl:size-14 "
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="-mt-10 md:-mt-5 2xl:-mt-24">
              <h1 className=" ">your money</h1>
            </div>

            <div className="-mt-10 md:-mt-8 2xl:-mt-24  flex gap-4 md:gap-8 items-center mb-28 ">
              <div className="w-48 h-14 xl:w-52 xl:h-20   mt-4 md:mt-10 relative ">
                <div className="w-full h-full bg-[#2E2E2E] rounded-[160px] shrink-0"></div>
                <div className="w-full h-full absolute top-0 bottom-0 overflow-hidden ">
                  <div className="bg-white shadow-2xl p-3 rounded-2xl opacity-60 -rotate-[20deg] absolute -top-8 left-4">
                    <Image
                      src="/images/optimism.png"
                      alt="optimism coin icon"
                      width={40}
                      height={40}
                      className="2xl:size-14"
                    />
                  </div>
                </div>
                <div className="bg-white shadow-2xl p-3  rounded-2xl -rotate-[10deg] absolute right-4 top-8 m2xl:top-16 2xl:right-8 ">
                  <Image
                    src="/images/base.png"
                    alt="base coin icon"
                    width={40}
                    height={40}
                    className="2xl:size-14 "
                  />
                </div>
                <div className="bg-white shadow-2xl  p-3  rounded-2xl rotate-[30deg] absolute -bottom-20 -right-20  2xl:-right-30 ">
                  <Image
                    src="/images/arbi.png"
                    alt="arbitrium coin icon"
                    width={40}
                    height={40}
                    className="2xl:size-14  "
                  />
                </div>
              </div>
              <h1 className="">move</h1>
            </div>
          </div>

          <div className="flex flex-col gap-6 ">
            <p className="text-[#898D91E6] xl:text-2xl  w-[300px] xl:w-[400px] t 2xl:leading-relaxed">
              Experience a new affordable and efficient way to send and receive
              digital payments worldwide
            </p>
            <div className="flex items-center w-full">
              <input
                type="text"
                placeholder="email"
                className="py-4 px-5 outline-none rounded-[160px] bg-[#EBEBEB69] "
              />
              <button className="px-5  py-3 text text-white font-medium hero-waitlist-btn -ml-30 md:-ml-8  ">
                Join our waitlist
              </button>
            </div>
          </div>
        </div>

        <motion.div
          className="hidden md:block md:w-1/2  absolute -right-40 "
          initial={{ x: 100 }}
          whileInView={{ x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: false }}
        >
          <img src="/images/make-mobile.png" alt="mobile phone " />
        </motion.div>
      </div>
    </section>
  );
};

export default CTA;
