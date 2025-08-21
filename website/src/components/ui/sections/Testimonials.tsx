"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const Testimonials = () => {
  return (
    <div className="flex flex-col justify-center items-center py-12 px-4 overflow-hidden sm:px-6 -mt-20">
      <h2 className="text-2xl lg:text-lg sm:text-3xl font-bold mb-2 text-center">
        Testimonials
      </h2>
      <p className="text-gray-600 mb-8 text-center text-sm lg:text-5xl font-bold max-w-3xl sm:text-base">
        We care about our customers too
      </p>

      <div className="relative w-full">
        <motion.div
          className="flex gap-6"
          animate={{ x: ["0%", "-100%"] }}
          transition={{
            repeat: Infinity,
            duration: 20,
            ease: "linear",
          }}
        >
          <div className="bg-gray-100 min-w-[250px] sm:min-w-[300px] lg:min-w-[350px] rounded-2xl p-6 shadow-sm hover:shadow-2xl flex flex-col justify-center items-center text-center">
            <Image
              src="/images/base.png"
              alt="Emmanuel Doji"
              width={100}
              height={100}
              className="object-cover rounded-full mb-4 w-20 h-20 sm:w-24 sm:h-24"
            />
            <p className="text-lg sm:text-xl font-semibold">Emmanuel Doji</p>
            <p className="text-gray-500 mb-2 sm:mb-4 text-sm sm:text-base">
              Technical Adviser
            </p>
            <p className="text-gray-700 italic text-sm sm:text-base">
              "Payslab has been amazing — the UI/UX is smooth and super easy to
              use!"
            </p>
          </div>

          <div className="bg-gray-100 min-w-[250px] sm:min-w-[300px] lg:min-w-[350px] rounded-2xl p-6 shadow-sm hover:shadow-2xl flex flex-col justify-center items-center text-center">
            <Image
              src="/images/base.png"
              alt="Chinemerem Ubaja"
              width={100}
              height={100}
              className="object-cover rounded-full mb-4 w-20 h-20 sm:w-24 sm:h-24"
            />
            <p className="text-lg sm:text-xl font-semibold">Chinemerem Ubaja</p>
            <p className="text-gray-500 mb-2 sm:mb-4 text-sm sm:text-base">
              Freelancer
            </p>
            <p className="text-gray-700 italic text-sm sm:text-base">
              "Getting paid has never been easier — fast, secure and
              stress-free!"
            </p>
          </div>

          <div className="bg-gray-100 min-w-[250px] sm:min-w-[300px] lg:min-w-[350px] rounded-2xl p-6 shadow-sm hover:shadow-2xl flex flex-col justify-center items-center text-center">
            <Image
              src="/images/base.png"
              alt="Peter Abaham"
              width={100}
              height={100}
              className="object-cover rounded-full mb-4 w-20 h-20 sm:w-24 sm:h-24"
            />
            <p className="text-lg sm:text-xl font-semibold">Peter Abahim</p>
            <p className="text-gray-500 mb-2 sm:mb-4 text-sm sm:text-base">
              Entrepreneur
            </p>
            <p className="text-gray-700 italic text-sm sm:text-base">
              "Payslab keeps my business moving — transactions are instant and
              reliable."
            </p>
          </div>

          <div className="bg-gray-100 min-w-[250px] sm:min-w-[300px] lg:min-w-[350px] rounded-2xl p-6 shadow-sm hover:shadow-2xl flex flex-col justify-center items-center text-center">
            <Image
              src="/images/base.png"
              alt="Nanbam Luka"
              width={100}
              height={100}
              className="object-cover rounded-full mb-4 w-20 h-20 sm:w-24 sm:h-24"
            />
            <p className="text-lg sm:text-xl font-semibold">Nanbam Luka</p>
            <p className="text-gray-500 mb-2 sm:mb-4 text-sm sm:text-base">
              Designer
            </p>
            <p className="text-gray-700 italic text-sm sm:text-base">
              "I love how seamless the payments are — no delays, no worries!"
            </p>
          </div>

          <div className="bg-gray-100 min-w-[250px] sm:min-w-[300px] lg:min-w-[350px] rounded-2xl p-6 shadow-sm hover:shadow-2xl flex flex-col justify-center items-center text-center">
            <Image
              src="/images/base.png"
              alt="Emmanuel Doji"
              width={100}
              height={100}
              className="object-cover rounded-full mb-4 w-20 h-20 sm:w-24 sm:h-24"
            />
            <p className="text-lg sm:text-xl font-semibold">Emmanuel Doji</p>
            <p className="text-gray-500 mb-2 sm:mb-4 text-sm sm:text-base">
              Technical Adviser
            </p>
            <p className="text-gray-700 italic text-sm sm:text-base">
              "Payslab has been amazing — the UI/UX is smooth and super easy to
              use!"
            </p>
          </div>
          <div className="bg-gray-100 min-w-[250px] sm:min-w-[300px] lg:min-w-[350px] rounded-2xl p-6 shadow-sm hover:shadow-2xl flex flex-col justify-center items-center text-center">
            <Image
              src="/images/base.png"
              alt="Emmanuel Doji"
              width={100}
              height={100}
              className="object-cover rounded-full mb-4 w-20 h-20 sm:w-24 sm:h-24"
            />
            <p className="text-lg sm:text-xl font-semibold">Emmanuel Doji</p>
            <p className="text-gray-500 mb-2 sm:mb-4 text-sm sm:text-base">
              Technical Adviser
            </p>
            <p className="text-gray-700 italic text-sm sm:text-base">
              "Payslab has been amazing — the UI/UX is smooth and super easy to
              use!"
            </p>
          </div>

          <div className="bg-gray-100 min-w-[250px] sm:min-w-[300px] lg:min-w-[350px] rounded-2xl p-6 shadow-sm hover:shadow-2xl flex flex-col justify-center items-center text-center">
            <Image
              src="/images/base.png"
              alt="Emmanuel Doji"
              width={100}
              height={100}
              className="object-cover rounded-full mb-4 w-20 h-20 sm:w-24 sm:h-24"
            />
            <p className="text-lg sm:text-xl font-semibold">Emmanuel Doji</p>
            <p className="text-gray-500 mb-2 sm:mb-4 text-sm sm:text-base">
              Technical Adviser
            </p>
            <p className="text-gray-700 italic text-sm sm:text-base">
              "Payslab has been amazing — the UI/UX is smooth and super easy to
              use!"
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Testimonials;
