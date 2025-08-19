import React from 'react'


const countries = [
  { name: "Comoros", flag: "🇰🇲" },
  { name: "Costa Rica", flag: "🇨🇷" },
  { name: "Croatia", flag: "🇭🇷" },
  { name: "Cambodia", flag: "🇰🇭" },
  { name: "Cameroon", flag: "🇨🇲" },
  { name: "Canada", flag: "🇨🇦" },
  { name: "Cape Verde", flag: "🇨🇻" },
  { name: "Chile", flag: "🇨🇱" },
  { name: "Colombia", flag: "🇨🇴", disabled: true },
];


const Features = () => {


  return (
<>
   {/* <div className='mt-20 lg:mt-44 -mb-20 lg:-mb-0'>
      <h1 className='text-center font-semibold text-2xl lg:text-[80px] -mb-10 lg:-mb-32'>Features</h1>
  <h1 className='text-center font-semibold text-2xl lg:text-[80px] rotate-180 opacity-20'>Features</h1>
   </div> */}

 <div className="flex flex-col lg:flex-row rounded-[24px] overflow-hidden h-[800px] mt-20 lg:mt-44 mb-2 font-sans bg-white lg:mx-20 ">
 <div>

 </div>
      {/* Left side */}
      <div className="flex-1 px-16 py-10 flex flex-col justify-center text-black lg:-mt-60">
        <h1 className="font-extrabold text-[36px] md:text-[60px] leading-tight m-0">
          Your transfers
          <br />
          just got global
        </h1>
        <strong className="mt-4 text-[22px]">Enter multi-currency accounts</strong>
        <p className="mt-2 text-[14px] lg:w-[400px] lg:text-[20px] text-gray-400">
          Seamlessly transfer funds to over 60 countries, with support for both fiat and digital
          currencies.
        </p>
      </div>

      {/* Right side */}
      <div
        className="flex-1 relative flex flex-col justify-between p-8 text-white font-semibold text-sm rounded-tr-[24px] rounded-br-[24px] w-[400px]"
        style={{
          backgroundImage:
            'url("https://framerusercontent.com/images/szMdJ1k7ngrAgHVj7MLZmBF0TU.png")',
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
<div className="relative overflow-hidden lg:h-[700px] h-[400px]">
  <div className="animate-[slideup_30s_linear_infinite]">
    <ul className="flex flex-col gap-3 m-0 p-0 list-none drop-shadow-lg">
      {countries.concat(countries).map(({ name, flag, disabled }, i) => (
        <li
          key={i}
          className={`flex items-center gap-2 cursor-pointer ${
            disabled ? 'opacity-30 cursor-default' : ''
          }`}
        >
          <span
            role="img"
            aria-label={`${name} flag`}
            className="lg:text-[50px] text-[20px] leading-none"
          >
            {flag}
          </span>
          <span>{name}</span>
        </li>
      ))}
    </ul>
  </div>
</div>




        <div className="relative lg:right-0 bottom-10 right-8 lg:self-end text-right font-medium text-[80px] lg:text-[250px] leading-none drop-shadow-lg">
          60
          <span className=" text-[30px] lg:text-[68px] ml-1">+</span>
          <div className=" text-[12px] lg:text-[22px] font-normal lg:mt-[-1rem]">Available Supported Countries</div>
        </div>
      </div>
    </div>

    {/* 2 */}


     <div className="flex flex-col lg:flex-row rounded-[24px] overflow-hidden h-[800px] mb-2 font-sans bg-white lg:mx-20 ">
      {/* Left side */}
      <div className="flex-1 px-16 py-10 flex flex-col justify-center text-black lg:-mt-60">
        <h1 className="font-extrabold text-[36px] lg:text-[60px] leading-tight m-0">
          Send money to loved 
          <br />
          ones in an instant
        </h1>
        <strong className="mt-4 text-[22px]">No more waiting days, just seconds</strong>
        <p className="mt-2 text-[14px] lg:w-[400px] lg:text-[20px] text-gray-400">
         Embrace instant stablecoins such 
         as USDc, or opt for same-day settlement 
         in the local currency of your choice.
        </p>
      </div>

      {/* Right side */}
      <div
        className="flex-1 relative flex flex-col justify-between p-8 text-white font-semibold text-sm rounded-tr-[24px] rounded-br-[24px] w-[400px]"
        style={{
          backgroundImage:
            'url("https://framerusercontent.com/images/QVtZ2wCPe83s1F5evGWz5HUPFzk.png")',
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >




        <div className="relative lg:right-0 top-[215px] lg:top-[450px] right-8 lg:self-end text-right font-medium text-[80px] lg:text-[250px] leading-none drop-shadow-lg">
          5
          <span className=" text-[30px] lg:text-[68px] ml-1">S</span>
          <div className=" text-[12px] lg:text-[22px] font-normal lg:mt-[-1rem]">Average Settlement time</div>
        </div>
      </div>
    </div>

    {/* 3 */}


     <div className="flex flex-col lg:flex-row rounded-[24px] overflow-hidden h-[800px]  mb-44 font-sans bg-white lg:mx-20 ">
      {/* Left side */}
      <div className="flex-1 px-16 py-10 flex flex-col justify-center text-black lg:-mt-60">
        <h1 className="font-extrabold text-[36px] lg:text-[60px] leading-tight m-0">
          Spend USDC or Fiat 
          <br />
          at your local shop
        </h1>
        <strong className="mt-4 text-[22px]">Transact like a true local</strong>
        <p className="mt-2 text-[14px] lg:w-[400px] lg:text-[20px] text-gray-400">
         Effortlessly spend USDC or any other supported
          fiat currency at your 
         local merchant, instantly at low costs. 
        </p>
      </div>

      {/* Right side */}
      <div
        className="flex-1 relative flex flex-col justify-between p-8 text-white font-semibold text-sm rounded-tr-[24px] rounded-br-[24px] w-[400px]"
        style={{
          backgroundImage:
            'url("https://framerusercontent.com/images/CWEUlbKfbmpNM4P2TeqjsQl6lI.png")',
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >




        <div className="relative lg:right-0 right-8 top-[215px] lg:top-[450px] lg:self-end text-right font-medium text-[80px] lg:text-[250px] leading-none drop-shadow-lg">
          1
          <span className=" text-[30px] lg:text-[68px] ml-1">%</span>
          <div className=" text-[12px] lg:text-[22px] font-normal lg:mt-[-1rem]">Average Processing Fees</div>
        </div>
      </div>
    </div>
</>
  );
};

export default Features