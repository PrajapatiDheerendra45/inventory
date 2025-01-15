import React from 'react';
import { FaClipboardList, FaChartLine, FaExpandArrowsAlt, FaMoneyBillWave, FaPuzzlePiece, FaLightbulb } from 'react-icons/fa';
import { motion } from 'framer-motion';

const benefits = [
  {
    icon: <FaClipboardList className="text-4xl text-[#C41E3A]" />,
    title: 'Real-Time Inventory Tracking',
    description: 'Keep an eye on your stock levels in real-time. Our system provides up-to-date information so you can make informed decisions quickly.'
  },
  {
    icon: <FaChartLine className="text-4xl text-[#C41E3A]" />,
    title: 'Enhanced Productivity',
    description: 'Automate routine tasks and free up your team to focus on more important activities. Improve overall productivity and efficiency.'
  },
  {
    icon: <FaExpandArrowsAlt className="text-4xl text-[#C41E3A]" />,
    title: 'Scalability',
    description: 'Our system grows with your business. Whether you expand to new locations or add more products, our solution is designed to scale with you.'
  },
  {
    icon: <FaMoneyBillWave className="text-4xl text-[#C41E3A]" />,
    title: 'Cost Efficiency',
    description: 'Reduce excess inventory and minimize stockouts. Save money by optimizing your stock levels and preventing unnecessary purchases.'
  },
  {
    icon: <FaPuzzlePiece className="text-4xl text-[#C41E3A]" />,
    title: 'Seamless Integration',
    description: 'Integrate with your existing systems effortlessly. Our inventory management system works with your POS, e-commerce, and accounting tools.'
  },
  {
    icon: <FaLightbulb className="text-4xl text-[#C41E3A]" />,
    title: 'Data-Driven Insights',
    description: 'Make better decisions with detailed reports and analytics. Our system provides valuable insights into your inventory trends and performance.'
  }
];

const Benefits = () => {
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
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <section className="py-20 bg-gray-50" id="benefits">
      <motion.div 
        className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <motion.div className="mb-16 text-center" variants={itemVariants}>
          
          <h3 className="mt-2 text-3xl font-bold leading-8 tracking-tight text-gray-700 sm:text-5xl">
            Benefits of Our 
          </h3>
          <h3 className="mt-2 text-3xl font-bold leading-8 tracking-tight text-gray-700 sm:text-5xl">
          Inventory Management System
          </h3>
          <p className="max-w-2xl mx-auto mt-4 text-xl text-gray-500">
            Discover how our inventory management system can transform your business operations
          </p>
        </motion.div>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              className="p-6 bg-white rounded-lg shadow-lg"
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center justify-center w-14 p-4 h-14 rounded-full bg-[#F7E9E9] text-[#C41E3A] mb-4">
                {benefit.icon}
              </div>
              <h4 className="mb-2 text-lg font-semibold">{benefit.title}</h4>
              <p className="text-gray-600">{benefit.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default Benefits;