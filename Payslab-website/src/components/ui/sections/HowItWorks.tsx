"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

const words: string[] = ["Pay", "Send", "Receive", "Exchange", "Get paid"];

const HowItWorks: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center mt-20 sm:mt-40 relative px-4 lg:px-20 sm:px-8">
      {/* <div className="mb-20 mt-10">
        <h1 className="text-2xl font-semibold lg:text-[80px]">How it works</h1>
        <h1 className="text-2xl relative bottom-2 lg:bottom-14 font-semibold opacity-20 rotate-180 lg:text-[80px]">How it works</h1>
      </div> */}
      <div className="text-center">
        <h1 className="font-bold uppercase text-4xl sm:text-6xl lg:text-9xl">
          A new way to
        </h1>
        {words.map((word, i) => (
          <motion.h1
            key={word}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              delay: i * 0.3,
            }}
            viewport={{ once: false, amount: 0.8 }}
            className="font-bold uppercase text-4xl sm:text-6xl lg:text-9xl text-blue-700"
          >
            {word}
          </motion.h1>
        ))}
      </div>

      <div className="mt-20 sm:mt-40 flex flex-col">
        <div className="py-2 w-full flex items-center justify-center">
          <Image
            src="/images/f95372c9-ca69-4e53-85fb-65b2ad89b8ec.jpeg"
            alt="borderless image"
            width={1980}
            height={800}
            className="w-full h-auto rounded-2xl object-cover"
            priority
          />
        </div>
        <div className="flex flex-col mt-6 sm:mt-10">
          <h2 className="text-2xl sm:text-3xl font-medium text-gray-900 mb-4">
            Borderless multi-currency accounts
          </h2>
          <p className="text-lg sm:text-2xl max-w-2xl text-neutral-700 mb-4">
            Open multi-currency accounts from anywhere. Send, receive, hold and
            exchange digital currencies instantly at the real exchange rate.
          </p>
          <Link href="#" className="text-blue-700 text-lg sm:text-2xl hover:underline">
            Learn about Global Accounts →
          </Link>
        </div>
        <div className="flex justify-center items-center flex-col mt-8 sm:mt-12">
          <video
            src="/images/accept-payments-new-loop.mp4"
            autoPlay
            muted
            loop
            playsInline
            className="rounded-2xl w-full h-auto object-cover"
          />
        </div>

        <div className="flex flex-col mt-6 sm:mt-10 mb-10 sm:mb-20">
          <h2 className="text-2xl sm:text-3xl font-medium text-gray-900 mb-4">
            Accept payments everywhere
          </h2>
          <p className="text-lg sm:text-2xl max-w-2xl text-neutral-700 mb-4">
            Get paid anywhere - bank transfers, mobile money, digital wallets
            and more in 80+ markets. Receive stablecoins instantly or settle
            into your local currency. Near-zero fees.
          </p>
          <Link href="#" className="text-blue-700 text-lg sm:text-2xl hover:underline">
            Learn about Payments →
          </Link>
        </div>
      </div>
      <div className="flex flex-col bg-blue-600 w-full lg:py-14  sm:py-8  sm:px-8">
        <video
          src="/images/transfers-desktop-new.mp4"
          autoPlay
          muted
          loop
          playsInline
          className="object-cover w-full  sm:h-[800px]"
        />
        <div className="flex flex-col mt-6 sm:mt-10 p-4">
          <h2 className="text-2xl sm:text-3xl font-medium text-gray-50 mb-4">
            Move money globally in seconds
          </h2>
          <p className="text-lg sm:text-2xl max-w-2xl text-gray-300 mb-4">
            Transfer funds faster to and from your digital accounts via bank
            transfers or mobile wallets in 80+ countries. Enjoy real-time
            payments at a fraction of the cost of bank wires.
          </p>
          <Link href="#" className="text-gray-50 text-lg sm:text-2xl hover:underline">
            Learn about Transfers →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
