import React from "react";
import {
  FaMoneyBillWave,
  FaGlobe,
  FaLock,
  FaTruckMoving,
  FaClock,
  FaFileInvoiceDollar,
} from "react-icons/fa";

interface CardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const Problem = () => {
  const problems: CardProps[] = [
    {
      title: "High Transaction Fees",
      description:
        "Cross-border shipping and payments often involve banks, intermediaries, and hidden fees that cut into profits.",
      icon: <FaMoneyBillWave />,
    },
    {
      title: "Limited Global Access",
      description:
        "Many regions lack seamless access to international payment and shipping systems, restricting global trade opportunities.",
      icon: <FaGlobe />,
    },
    {
      title: "Security & Fraud Risks",
      description:
        "Traditional methods expose businesses to fraud, unverified suppliers, and lack of real-time tracking.",
      icon: <FaLock />,
    },
    {
      title: "Slow Delivery & Settlements",
      description:
        "International shipments and payments can take days or weeks, delaying supply chains and cash flow.",
      icon: <FaClock />,
    },
    {
      title: "Complex Documentation",
      description:
        "Cross-border trade requires multiple forms, customs papers, and manual approvals — slowing down operations.",
      icon: <FaFileInvoiceDollar />,
    },
    {
      title: "Logistics Challenges",
      description:
        "From unreliable couriers to poor shipment visibility, businesses often struggle with cross-border logistics management.",
      icon: <FaTruckMoving />,
    },
  ];

  return (
    <>
      {/* Heading */}
      <div className="mt-32 lg:mt-44 text-center">
        <h2 className="font-semibold text-lg lg:text-2xl text-neutral-600 mt-4 max-w-3xl mx-auto">
          Businesses face high costs, slow delivery times, complex paperwork,
          and unreliable systems when managing cross-border shipping and
          transactions.
        </h2>
      </div>

      {/* Problem Cards */}
      <div className="mt-16 lg:mt-32 p-4 lg:px-22 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {problems.map((problem, index) => (
          <div
            key={index}
            className="p-8 bg-gray-100 rounded-md shadow-md  cursor-pointer flex flex-col"
          >
            <div className="flex items-start gap-4">
              <div className="text-2xl text-[#444444]">{problem.icon}</div>
              <div>
                <h3 className="font-bold text-xl mb-2">{problem.title}</h3>
                <p className="text-md">{problem.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Problem;
