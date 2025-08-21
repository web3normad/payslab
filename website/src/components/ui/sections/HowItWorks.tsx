"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

const words: string[] = ["Pay", "Send", "Receive", "Ship", "Get Paid"];

const HowItWorks: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center mt-20 sm:mt-40 relative px-4 lg:px-20 sm:px-8">
      <div className="text-center">
        <h1 className="font-bold uppercase text-4xl sm:text-6xl lg:text-8xl">
          A smarter way <br /> to
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
            className="font-bold uppercase text-4xl sm:text-6xl lg:text-8xl text-blue-700"
          >
            {word}
          </motion.h1>
        ))}
      </div>

      <div className="mt-20 sm:mt-40 flex flex-col">
        {/* Borderless Accounts */}
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
            Open multi-currency accounts for your shipping or trading business.
            Send, receive, hold, and exchange funds globally — without high bank
            fees or hidden charges.
          </p>
        </div>

        {/* Accept Payments */}
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
        <div className="flex flex-col mt-6 sm:mt-10 sm:mb-20">
          <h2 className="text-2xl sm:text-3xl font-medium text-gray-900 mb-4">
            Accept payments everywhere
          </h2>
          <p className="text-lg sm:text-2xl max-w-2xl text-neutral-700 mb-4">
            Get paid instantly by clients, suppliers, or logistics partners.
            From digital wallets to bank transfers, receive payments in 80+
            markets and settle in your preferred currency.
          </p>
        </div>

        {/* Global Transfers */}
        <div className="flex flex-col sm:mt-10">
          <h2 className="text-2xl sm:text-3xl font-medium text-gray-900 mb-4">
            Move money globally in seconds
          </h2>
          <p className="text-lg sm:text-2xl max-w-xl text-neutral-700 mb-4">
            Pay carriers, vendors, and partners worldwide in seconds. Our
            low-cost, real-time transfers keep your shipping operations smooth
            and your cash flow predictable.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
