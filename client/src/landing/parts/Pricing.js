
import React from 'react';
import { FaCheck } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { IoStarSharp } from "react-icons/io5";
import { RiThumbUpLine } from "react-icons/ri";
import { MdOutlineWorkspacePremium } from "react-icons/md";

const plans = [
  {
    name: 'Basic',
    price: 'Rs. 500',
    icon: <IoStarSharp className="text-2xl text-white" />,
    features: [
      'Basic Inventory for small teams',
      'Supports 1 user',
      '100 products',
      'With essential stock alerts'
    ],
    highlighted: false
  },
  {
    name: 'Standard',
    price: 'Rs. 500',
    icon: <RiThumbUpLine className="text-2xl text-[red]" />,
    features: [
      'Basic Inventory for small teams',
      'Supports 1 user',
      '100 products',
      'With essential stock alerts'
    ],
    highlighted: true
  },
  {
    name: 'Premium',
    price: 'Rs. 500',
    icon: <MdOutlineWorkspacePremium className="text-2xl text-white" />,
    features: [
      'Basic Inventory for small teams',
      'Supports 1 user',
      '100 products',
      'With essential stock alerts'
    ],
    highlighted: false
  }
];

const Pricing = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.5, 
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <section className="py-20 bg-[#F7E9E9]" id="pricing">
      <motion.div 
        className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div className="mb-12 text-start " variants={itemVariants}>
          <h3 className="mt-2 text-3xl font-bold leading-8 tracking-tight text-black sm:text-4xl">
            Flexible Pricing Options to Fit Your Needs
          </h3>
          <p className="max-w-2xl mt-4 text-xl text-black text-start">
            Select from our range of plans to find the perfect fit for your inventory management needs
          </p>
        </motion.div>
        <div className="grid gap-8 mt-16 md:grid-cols-2 lg:grid-cols-3 lg:gap-x-8">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
              className={`relative p-8 bg-white border rounded-2xl shadow-lg flex flex-col ${
                plan.highlighted ? 'border-[#C41E3A] border-2' : 'border-gray-200'
              } ${plan.name === 'Standard' ? 'bg-[#B91C1C]' : 'bg-white'}`}
            >
              <div className="flex-1">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3  ${plan.name === 'Standard' ? 'bg-white text-black' : 'bg-[#C41E3A]'} rounded-md`}>
                    {plan.icon}
                  </div>
                  <h3 className={`text-xl font-semibold ${plan.name === 'Standard' ? 'text-black' : 'text-gray-900'}`}>{plan.name}</h3>
                </div>
                <p className={`flex items-baseline mt-4 ${plan.name === 'Standard' ? 'text-black' : 'text-gray-900'}`}>
                  <span className={`text-4xl font-bold tracking-tight ${plan.name === 'Standard' ? 'text-black' : 'text-gray-900'}`}>{plan.price}</span>
                  <span className="ml-1 text-xl font-semibold">/month</span>
                </p>
                <p className={`mt-6 ${plan.name === 'Standard' ? 'text-black' : 'text-black'}`}>
                  Essential features to help small businesses manage inventory effortlessly
                </p>
                <ul className="mt-6 space-y-4">
                  {plan.features.map((feature, featureIndex) => (
                    <motion.li 
                      key={featureIndex} 
                      className="flex items-start"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + featureIndex * 0.1 }}
                    >
                      <div className={`flex-shrink-0 p-1 ${plan.name === 'Standard' ? 'bg-[#FAFAFA]' : 'bg-[#C41E3A]'} rounded-full`}>
                        <FaCheck className={`w-3 h-3 ${plan.name === 'Standard' ? 'text-[#C41E3A]' : 'text-black'}`} />
                      </div>
                      <span className={`ml-3 ${plan.name === 'Standard' ? 'text-black' : 'text-black'}`}>{feature}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`mt-8 block w-full py-3 px-6 border border-transparent rounded-md text-center font-medium ${
                  plan.highlighted
                    ? 'bg-[#FFD700] text-gray-900 hover:bg-yellow-400'
                    : 'bg-[#C41E3A] text-black hover:bg-red-700'
                } transition duration-300`}
              >
                Get Started
              </motion.button>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default Pricing;

