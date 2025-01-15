import React from 'react';
import { motion } from 'framer-motion';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaHeart } from 'react-icons/fa';
import { Link } from 'react-scroll';
import { SiIndeed } from "react-icons/si";
const Footer = () => {
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
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <motion.footer 
      className="text-white bg-[#C41E3A]"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="px-4 py-12 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <motion.div variants={itemVariants} className="md:col-span-2">
            <h2 className="mb-4 text-3xl font-bold">VYAPAAY</h2>
            <p className="mb-4 text-zinc-200">
              Empowering businesses with smart inventory solutions. Simplify, streamline, and succeed with Vyapaay.
            </p>
            <div className="flex space-x-4">
              <motion.a href="https://www.facebook.com/p/Manasvi-Technologies-OPC-Pvt-Ltd-61555158365754/?locale=tr_TR" className="transition-colors duration-300 text-zinc-200 hover:text-white" whileHover={{ scale: 1.2 }}><FaFacebook size={24} /></motion.a>
              <motion.a href="https://in.indeed.com/cmp/Manasvi-Technologies-Opc-Private-Limited/jobs" className="transition-colors duration-300 text-zinc-200 hover:text-white" whileHover={{ scale: 1.2 }}><SiIndeed   size={24} /></motion.a>
              <motion.a href="https://www.instagram.com/manasvi.technologies/" className="transition-colors duration-300 text-zinc-200 hover:text-white" whileHover={{ scale: 1.2 }}><FaInstagram size={24} /></motion.a>
              <motion.a href="https://www.linkedin.com/company/manasvi-technologies-opc-pvt-ltd/" className="transition-colors duration-300 text-zinc-200 hover:text-white" whileHover={{ scale: 1.2 }}><FaLinkedin size={24} /></motion.a>
            </div>
          </motion.div>
          <motion.div variants={itemVariants}>
            <h3 className="mb-4 text-xl font-semibold">Quick Links</h3>
            <ul className="space-y-2">
              {['Home', 'About', 'Benefits', 'Pricing', 'Contact'].map((item) => (
                <li key={item}>
                  <Link 
                    to={item.toLowerCase()} 
                    smooth={true} 
                    duration={500} 
                    className="transition-colors duration-300 cursor-pointer text-zinc-200 hover:text-white"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
          <motion.div variants={itemVariants}>
            <h3 className="mb-4 text-xl font-semibold">Contact</h3>
            <p className="mb-2 text-zinc-200">Email: manasvitect01@email.com</p>
            <p className="mb-2 text-zinc-200">Phone: +91-8319955741</p>
            <p className="text-zinc-200">Address: Corporate Office : 111B,80 Feet Road, Old Ashoka Garden Bhopal</p>
          </motion.div>
        </div>
        <motion.div 
          className="pt-8 mt-8 text-center border-t border-zinc-200"
          variants={itemVariants}
        >
          <p className="text-zinc-200">
            &copy; {new Date().getFullYear()} Vyapaay. All rights reserved.
          </p>
          <p className="flex items-center justify-center mt-2 text-zinc-200">
            Made with <FaHeart className="mx-1 text-red-500" /> in India
          </p>
        </motion.div>
      </div>
    </motion.footer>
  );
};

export default Footer;