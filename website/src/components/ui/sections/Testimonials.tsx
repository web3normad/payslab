"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const Testimonials = () => {
  const testimonials = [
    {
      name: "Emmanuel Doji",
      role: "Logistics Manager",
      feedback:
        "With Payslab, managing international shipments is seamless. Payments are processed instantly, and our partners overseas trust the system.",
      img: "/images/premium_photo-1689539137236-b68e436248de.avif",
    },
    {
      name: "Chinemerem Ubaja",
      role: "Freight Forwarder",
      feedback:
        "Payslab makes cross-border transactions fast and transparent. I can handle multiple clients without worrying about payment delays.",
      img: "/images/download1.jpeg",
    },
    {
      name: "Peter Abahim",
      role: "Export Business Owner",
      feedback:
        "International clients pay without hassle, and my shipments move without delays. Payslab keeps my business running smoothly.",
      img: "/images/pexels-photo-2379004.jpeg",
    },
    {
      name: "Nanbam Luka",
      role: "E-commerce Seller",
      feedback:
        "Selling to customers abroad is now easy. Payslab ensures my shipping fees and product payments are settled on time every time.",
      img: "/images/download2.jpeg",
    },
    {
      name: "Aisha Bello",
      role: "Import Agent",
      feedback:
        "Currency conversions and international payments used to be a nightmare. Payslab simplified everything and improved my workflow.",
      img: "/images/images3.jpeg",
    },
    {
      name: "David Johnson",
      role: "Fleet Coordinator",
      feedback:
        "Managing payments for multiple shippers and drivers used to take hours. With Payslab, everything is automated and instant.",
      img: "/images/premium.avif",
    },
    {
      name: "Grace Oyeniyi",
      role: "Small Business Owner",
      feedback:
        "Payslab helps me ship products to customers worldwide and get paid quickly. It’s reliable, secure, and easy to use.",
      img: "/images/images4.jpeg",
    },
  ];

  return (
    <div className="flex flex-col justify-center items-center py-12 px-4 overflow-hidden sm:px-6 -mt-20">
      <h2 className="text-2xl lg:text-lg sm:text-3xl font-bold mb-2 text-center">
        Testimonials
      </h2>
      <p className="text-gray-600 mb-8 text-center text-sm lg:text-4xl font-bold max-w-3xl sm:text-base">
        Trusted by businesses moving goods across the globe
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
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-gray-100 cursor-pointer min-w-[250px] sm:min-w-[300px] lg:min-w-[350px] rounded-2xl p-8 shadow-sm hover:shadow-2xl flex flex-col justify-center items-center text-center"
            >
              <Image
                src={testimonial.img}
                alt={testimonial.name}
                width={100}
                height={100}
                className="object-cover rounded-full mb-4 w-20 h-20 sm:w-24 sm:h-24"
              />
              <p className="text-lg sm:text-xl font-semibold">{testimonial.name}</p>
              <p className="text-gray-500 mb-2 sm:mb-4 text-sm sm:text-base">
                {testimonial.role}
              </p>
              <p className="text-gray-700 italic text-sm sm:text-base">
                "{testimonial.feedback}"
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Testimonials;
