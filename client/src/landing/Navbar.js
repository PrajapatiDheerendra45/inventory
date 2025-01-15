// import React, { useState, useEffect } from "react";
// import PropTypes from "prop-types";
// import {
//   AppBar,
//   Box,
//   CssBaseline,
//   Divider,
//   Drawer,
//   IconButton,
//   List,
//   ListItemButton,
//   ListItemText,
//   Toolbar,
//   Button,
//   Typography,
//   MenuItem,
//   Modal,
// } from "@mui/material";
// import MenuIcon from "@mui/icons-material/Menu";
// import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
// import mLogo from "./assets/manasvilogo.png";
// import DemoForm from "./DemoForm"; // Import your DemoForm component

// // Include the Oswald font from Google Fonts
// const oswaldFont =
//   "https://fonts.googleapis.com/css2?family=Oswald:wght@400;700&display=swap";

// const drawerWidth = 170;

// const navItems = [
//   { label: "Home", id: "home" },
//   { label: "About", id: "about" },
//   { label: "Client", id: "client" },
//   { label: "Pricing", id: "pricing" },
//   { label: "Benefits", id: "benefits" },
//   { label: "Contact", id: "contact" },
//   { label: "Free Trial", href: "/registration" },
//   { label: "Login", href: "/login" },
// ];

// const Navbar = (props) => {
//   const { window } = props;
//   const [mobileOpen, setMobileOpen] = useState(false);
//   const [showScrollTop, setShowScrollTop] = useState(false);
//   const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility

//   const handleDrawerToggle = () => {
//     setMobileOpen(!mobileOpen);
//   };

//   const handleScroll = () => {
//     if (window.scrollY > 300) {
//       setShowScrollTop(true);
//     } else {
//       setShowScrollTop(false);
//     }
//   };

//   const scrollToTop = () => {
//     window.scrollTo({
//       top: 0,
//       behavior: "smooth",
//     });
//   };

//   const handleOpenModal = () => {
//     setIsModalOpen(true);
//   };

//   const handleCloseModal = () => {
//     setIsModalOpen(false);
//   };

//   useEffect(() => {
//     // Ensure window is defined before adding event listener
//     if (typeof window !== "undefined") {
//       window.addEventListener("scroll", handleScroll);
//       return () => window.removeEventListener("scroll", handleScroll);
//     }
//   }, []);

//   const drawer = (
//     <Box onClick={handleDrawerToggle} sx={{ textAlign: "center", p: 2 }}>
//       <Box
//         component="img"
//         src={mLogo}
//         alt="Logo"
//         sx={{ width: "50%", my: 2 }}
//       />
//       <Divider />
//       <List>
//         {navItems.map((item) => (
//           <MenuItem key={item.label} disablePadding>
//             <ListItemButton
//               // href={`${item.id}`}
//               href={item.href ? item.href : `#${item.id}`}
//               sx={{
//                 textAlign: "left",
//                 fontSize: "14px",
//                 fontFamily: "Oswald, sans-serif",
//                 fontWeight: "bold",
//                 color: "#333333",
//                 mx: 0.5,
//                 "&:hover": {
//                   backgroundColor: "#f5f5f5",
//                 },
//               }}
//             >
//               <ListItemText primary={item.label} />
//             </ListItemButton>
//           </MenuItem>
//         ))}
//         <Button
//           variant="contained"
//           onClick={handleOpenModal} // Open modal on button click
//           sx={{
//             mt: 2,
//             backgroundColor: "#007BFF",
//             color: "#FFFFFF",
//             borderRadius: "20px",
//             textTransform: "none",
//             "&:hover": {
//               backgroundColor: "#0056b3",
//             },
//           }}
//         >
//           Book a Demo
//         </Button>
//       </List>
//     </Box>
//   );

//   const container =
//     window !== undefined ? () => window().document.body : undefined;

//   return (
//     <Box sx={{ display: "flex" }}>
//       <CssBaseline />
//       <AppBar
//         component="nav"
//         // position="fixed"
//         sx={{
//           backgroundColor: "#FFFFFF",
//           color: "#000000",
//           boxShadow: "2px 4px 8px rgba(0, 0, 0, 0.2)",
//           fontFamily: "Roboto, sans-serif",
//           height: "70px",
//           top: 0,
//           left: 0,
//           right: 0,
//           zIndex: 1300,
//           padding: 0,
//           marginBottom: { xs: 0, md: "20px" },
//         }}
//       >
//         <link href={oswaldFont} rel="stylesheet" />
//         <Toolbar
//           sx={{ justifyContent: "space-between", minHeight: "70px", px: 1 }}
//         >
//           <Box
//             sx={{
//               display: { xs: "flex", md: "none" },
//               alignItems: "center",
//               justifyContent: "space-between",
//               width: "100%",
//             }}
//           >
//             <Box
//               component="img"
//               src={mLogo}
//               alt="Logo"
//               sx={{ width: 200, height: "auto", mr: 1 }}
//             />
//             <IconButton
//               color="inherit"
//               aria-label="open drawer"
//               edge="end"
//               onClick={handleDrawerToggle}
//               sx={{
//                 mr: 1,
//                 backgroundColor: "transparent",
//                 "&:hover": {
//                   backgroundColor: "transparent",
//                 },
//               }}
//             >
//               <MenuIcon />
//             </IconButton>
//           </Box>

//           <Box sx={{ display: "flex", alignItems: "center" }}>
//             <Box
//               component="img"
//               src={mLogo}
//               alt="Logo"
//               sx={{
//                 width: 270,
//                 height: "auto",
//                 display: { xs: "none", md: "block" },
//                 mr: 2,
//               }}
//             />
//           </Box>

//           <Box
//             sx={{
//               flexGrow: 1,
//               display: { xs: "none", md: "flex" },
//               justifyContent: "center",
//               px: { lg: 1 }, // Apply px:2 only on medium screens and above
//               gap: { lg: 1 }, // Apply gap:2 only on medium screens and above,
//               position: "relative",
//             }}
//           >
//             {navItems.map((item) => (
//               <Button
//                 key={item.label}
//                 // href={`#${item.id}`}
//                 href={item.href ? item.href : `#${item.id}`}
//                 sx={{
//                   fontFamily: "Oswald, sans-serif",
//                   fontSize: "21px",
//                   fontWeight: "700",
//                   color: "#9001BA",
//                   position: "relative",
//                   textTransform: "none",
//                   "&:before": {
//                     content: '""',
//                     position: "absolute",
//                     bottom: 0,
//                     left: 0,
//                     width: "0%",
//                     height: "2px",
//                     backgroundColor: "red",
//                     boxShadow: "0 2px 4px rgba(255, 0, 0, 0.5)",
//                     transition: "width 0.2s ease, box-shadow 0.2s ease",
//                   },
//                   "&:hover:before": {
//                     width: "100%",
//                   },
//                   "&:hover": {
//                     boxShadow: "none",
//                     color: "#007BFF",
//                   },
//                 }}
//               >
//                 <span className="text-nowrap"> {item.label}</span>
//               </Button>
//             ))}
//           </Box>

//           <Button
//             onClick={handleOpenModal} // Open modal on button click
//             sx={{
//               backgroundColor: "#6A1B9A",
//               color: "#FFFFFF",
//               borderRadius: "10px",
//               textTransform: "none",
//               paddingX: { xs: "10px", md: "20px", lg: "40px" },
//               fontSize: { xs: "10px", md: "14px", lg: "14px" }, // Responsive font size
//               display: { xs: "none", md: "block" },
//               "&:hover": {
//                 backgroundColor: "#0056b3",
//               },
//             }}
//           >
//             <span className="text-nowrap "> Book Demo</span>
//           </Button>
//         </Toolbar>
//       </AppBar>

//       <nav>
//         <Drawer
//           container={container}
//           variant="temporary"
//           open={mobileOpen}
//           onClose={handleDrawerToggle}
//           ModalProps={{
//             keepMounted: true,
//           }}
//           sx={{
//             display: { xs: "block", sm: "block", md: "none" },
//             "& .MuiDrawer-paper": {
//               boxSizing: "border-box",
//               width: drawerWidth,
//             },
//           }}
//         >
//           {drawer}
//         </Drawer>
//       </nav>

//       <Box component="main" sx={{ flexGrow: 1, ml: 2 }}>
//         <Toolbar />
//         <Typography>
//           <Box>{/* Content will be rendered here based on the route */}</Box>
//         </Typography>
//       </Box>

//       {/* Modal with DemoForm */}
//       <Modal open={isModalOpen} onClose={handleCloseModal}>
//         <DemoForm />
//       </Modal>
//     </Box>
//   );
// };

// Navbar.propTypes = {
//   window: PropTypes.func,
// };

// export default Navbar;
import React, { useState, useEffect } from "react";
import { Link } from "react-scroll";
import { FaBars, FaGreaterThan, FaTimes } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import DemoForm from "./DemoForm";

const Navbar = () => {
  const [nav, setNav] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showDemoModal, setShowDemoModal] = useState(false); // state for modal
  const navigate = useNavigate();

  const handleClick = () => setNav(!nav);

  const openDemoModal = () => {
    setShowDemoModal(true);
  };

  const closeDemoModal = () => {
    setShowDemoModal(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > -5;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    document.addEventListener("scroll", handleScroll);
    return () => {
      document.removeEventListener("scroll", handleScroll);
    };
  }, [scrolled]);

  const navVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  const menuItemVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <>
      <motion.nav
        className={`fixed w-full h-[65px] flex justify-between items-center md:px-20 lg:px-20 sm:px-4 ${
          scrolled
            ? "bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 shadow-md"
            : "bg-transparent"
        } text-gray-800 z-50 transition-all duration-300`}
        initial="hidden"
        animate="visible"
        variants={navVariants}
      > 
        <div>
          <h1 className="text-3xl font-bold text-red-600  px-3 p-1">VYAPAAY</h1>
        </div>

        {/* menu */}
        <ul className="hidden md:flex">
          {[
            "Home",
            "About",
            "subscriptions",
            "Pricing",
            "Benefits",
            "Contacts",
          ].map((item, index) => (
            <motion.li key={item} variants={menuItemVariants} custom={index}>
              <Link
                to={item.toLowerCase()}
                smooth={true}
                duration={500}
                spy={true}
                exact="true"
                offset={-80}
                className="px-4 cursor-pointer capitalize font-medium text-white hover:text-[#FFD700] transition-colors duration-300"
              >
                {item}
              </Link>
            </motion.li>
          ))}
        </ul>

        <div className="items-center hidden md:flex">
          {/* Free Trial Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mr-4 px-4 py-2 bg-yellow-400 text-white rounded hover:opacity-90 transition duration-300"
            onClick={() => navigate("/registration")}
          >
            Free Trial
          </motion.button>

          {/* Login Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mr-4 px-4 py-2 text-[#FFD700] border border-[#FFD700] rounded hover:bg-[#FFD700] hover:text-white transition duration-300"
            onClick={() => navigate("/login")}
          >
            Login
          </motion.button>

          {/* Schedule a Demo Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-gradient-to-r from-green-400 to-blue-500 text-white rounded hover:opacity-90 transition duration-300"
            onClick={openDemoModal} // Open demo modal
          >
            Schedule a Demo
          </motion.button>
        </div>

        {/* Hamburger */}
        <div className="flex">
          <div></div>
          <div
            onClick={handleClick}
            className="z-10 mr-2 cursor-pointer md:hidden bg-white shadow rounded p-1"
          >
            {!nav ? <FaBars /> : <FaTimes />}
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {nav && (
            <motion.ul
              className="absolute top-0 left-0 flex flex-col p-9  w-full h-screen bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 shadow-md text"
              initial={{ opacity: 0, x: "-100%" }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: "-100%" }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              {/* Menu Items */}
              {[
                "Home",
                "About",
                "Subscriptions",
                "Pricing",
                "Benefits",
                "Contacts",
              ].map((item, index) => (
                <motion.li
                  key={item}
                  className="py-2 text-2xl"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <Link
                    onClick={handleClick}
                    to={item.toLowerCase()}
                    smooth={true}
                    duration={500}
                    spy={true}
                    exact="true"
                    offset={-80}
                  >
                    <div className="flex justify-between hover:bg-pink-500 bg-pink-800 p-1 px-3 rounded">
                      <div className="text-white">{item}</div>
                      <div className="text-white mt-1">
                        <FaGreaterThan />
                      </div>
                    </div>
                  </Link>
                </motion.li>
              ))}

              {/* Buttons for Mobile Menu */}
              <div className="flex flex-col items-center mt-6">
                {/* Free Trial Button */}
                <div className="flex justify-between gap-5 ">
                  {" "}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="mb-4 px-4 py-2 bg-yellow-400 text-white rounded hover:opacity-90 transition duration-300"
                    onClick={() => navigate("/registration")}
                  >
                    Free Trial
                  </motion.button>
                  {/* Login Button */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="mb-4 px-4 py-2 text-[#FFD700] border border-[#FFD700] rounded hover:bg-[#FFD700] hover:text-white transition duration-300"
                    onClick={() => navigate("/login")}
                  >
                    Login
                  </motion.button>
                </div>
                {/* Schedule a Demo Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 bg-gradient-to-r from-green-400 to-blue-500 text-white rounded hover:opacity-90 transition duration-300"
                  onClick={openDemoModal} // Open demo modal
                >
                  Schedule a Demo
                </motion.button>
              </div>
            </motion.ul>
          )}
        </AnimatePresence>
      </motion.nav>
      {/* Demo Modal */}
      {showDemoModal && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <DemoForm />
        </motion.div>
      )}
    </>
  );
};

export default Navbar;
