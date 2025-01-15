// import React from 'react';
// import { Box, Typography, Container, useTheme } from '@mui/material';

// const About = () => {
//   const theme = useTheme();

//   return (
//     <Container
//       maxWidth={false}
//       sx={{
//         backgroundColor: '#f5f5f5',
//         mt: 0,
//         overflowX: 'hidden',
//         padding: theme.spacing(8, 4),
//         [theme.breakpoints.up('md')]: {
//           padding: theme.spacing(12, 8),
//         },
//       }}
//     >
//       <Box 
//         sx={{ 
//           textAlign: 'center', 
//           mb: 8,
//           '& > *': {
//             animation: 'fadeIn 0.8s ease-out',
//             '@keyframes fadeIn': {
//               from: { opacity: 0, transform: 'translateY(20px)' },
//               to: { opacity: 1, transform: 'translateY(0)' },
//             },
//           },
//         }}
//       >
//         <Typography 
//           variant="h2" 
//           component="h1" 
//           sx={{ 
//             fontWeight: 900, 
//             mb: 2, 
//             background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
//             WebkitBackgroundClip: 'text',
//             WebkitTextFillColor: 'transparent',
//           }}
//         >
//           ABOUT <span style={{ fontSize: '0.6em',fontColor:'#6a1b9a' }}>US</span>
//         </Typography>
//         <Typography 
//           variant="h4" 
//           component="h2" 
//           sx={{ 
//             fontWeight: 700, 
//             mb: 3, 
//             textTransform: 'uppercase',
//             color: theme.palette.text.primary,
//           }}
//         >
//           Our Inventory Management System
//         </Typography>
//         <Typography 
//           variant="h6" 
//           sx={{ 
//             maxWidth: '800px', 
//             margin: '0 auto',
//             color: theme.palette.text.secondary,
//           }}
//         >
//           Streamline your business operations with our advanced, user-friendly inventory management system.
//         </Typography>
//       </Box>

//       {['Efficient Inventory Tracking', 'Seamless Integration and Scalability', 'User-Friendly Interface'].map((title, index) => (
//         <Box 
//           key={index} 
//           sx={{ 
//             mb: 6,
//             padding: theme.spacing(4),
//             borderRadius: theme.shape.borderRadius,
//             boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
//             transition: 'all 0.3s ease',
//             '&:hover': {
//               transform: 'translateY(-5px)',
//               boxShadow: '0 6px 25px rgba(0,0,0,0.15)',
//             },
//             animation: `fadeIn 0.8s ease-out ${index * 0.2}s`,
//             '@keyframes fadeIn': {
//               from: { opacity: 0, transform: 'translateY(20px)' },
//               to: { opacity: 1, transform: 'translateY(0)' },
//             },
//             animationFillMode: 'both',
//           }}
//         >
//           <Typography 
//             variant="h4" 
//             component="h3" 
//             sx={{ 
//               fontWeight: 700, 
//               mb: 2,
//               color: theme.palette.primary.main,
//             }}
//           >
//             {title}
//           </Typography>
//           <Typography variant="body1" sx={{ color: theme.palette.text.secondary }}>
//             {index === 0 && (
//               <>
//                 Our system allows you to track your inventory in real-time, giving you complete visibility into your stock levels.
//                 Whether you're managing a small retail shop or a large warehouse, our tools are designed to meet your needs.
//                 With automated reordering and detailed reporting, you can prevent stockouts and reduce excess inventory, saving both time and money.
//               </>
//             )}
//             {index === 1 && (
//               <>
//                 Our inventory management system seamlessly integrates with your existing tools and platforms, including POS systems, e-commerce platforms, and accounting software.
//                 It's scalable to grow with your business, whether you have one location or multiple stores. Our cloud-based solution ensures that your data is secure and accessible from anywhere.
//               </>
//             )}
//             {index === 2 && (
//               <>
//                 We understand that not everyone is tech-savvy. That's why we've designed our inventory management system with a user-friendly interface that is easy to navigate.
//                 With intuitive dashboards and simple workflows, you can manage your inventory without a steep learning curve.
//               </>
//             )}
//           </Typography>
//         </Box>
//       ))}

//       <Box 
//         sx={{ 
//           textAlign: 'center', 
//           mt: 8,
//           animation: 'fadeIn 0.8s ease-out 0.6s',
//           animationFillMode: 'both',
//         }}
//       >
//         <Typography 
//           variant="h4" 
//           component="p" 
//           sx={{ 
//             fontWeight: 700, 
//             color: theme.palette.primary.main,
//             mb: 2,
//           }}
//         >
//           Transform the way you manage your inventory.
//         </Typography>
//         <Typography 
//           variant="h5" 
//           component="p" 
//           sx={{ 
//             fontWeight: 700,
//             background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
//             WebkitBackgroundClip: 'text',
//             WebkitTextFillColor: 'transparent',
//           }}
//         >
//           Experience the difference with our system today!
//         </Typography>
//       </Box>
//     </Container>
//   );
// };

// export default About;
import React from 'react';
import { FaCheck } from 'react-icons/fa';
import { motion } from 'framer-motion';
import Image2 from '../assets/image2.jpg'
import { IoIosCheckmarkCircle } from "react-icons/io";

const AboutPage = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.5, 
        when: "beforeChildren",
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5 } }
  };

  return (
    <section className="py-20 bg-white" id="about">
      <motion.div 
        className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="lg:flex lg:items-center lg:justify-between">
          <motion.div 
            className="mb-8 lg:w-1/2 lg:mb-0"
            variants={itemVariants}
          >
            <motion.img 
              src={Image2}
              alt="Team working together" 
              className="rounded-lg shadow-xl"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            />
          </motion.div>
          <motion.div 
            className="lg:w-1/2 lg:pl-12"
            variants={itemVariants}
          >
            <h3 className="mt-2 text-3xl font-bold leading-8 tracking-tight text-gray-700 sm:text-4xl">
              We provide best inventory tracking services
            </h3>
            <p className="mt-4 text-gray-500 text-md">
              At Mansvi technology, we are dedicated to revolutionizing how businesses manage their inventory. Our user-friendly inventory management system is designed to simplify stock tracking, optimize operations, and enhance decision-making. With a focus on innovation and customer satisfaction, we empower businesses of all sizes to streamline their inventory processes and achieve greater efficiency.
            </p>
            <motion.div className="mt-8">
              <ul className="space-y-4">
                {[
                  'We uphold honesty in all interactions',
                  'We achieve success through teamwork',
                  'We continuously improve through creativity',
                  "Our customers' needs guide our actions."
                ].map((item, index) => (
                  <motion.li 
                    key={index} 
                    className="flex items-center"
                    variants={itemVariants}
                    whileHover={{ scale: 1.05, originX: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <IoIosCheckmarkCircle className="mr-2 text-xl text-green-700" />
                    <span>{item}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
            <motion.div 
              className="mt-8"
              variants={itemVariants}
            >
              <motion.button 
                className="px-6 py-3  bg-[#FFD700] text-gray-800 rounded hover:bg-yellow-400 transition duration-300  font-semibold"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Learn More
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default AboutPage;