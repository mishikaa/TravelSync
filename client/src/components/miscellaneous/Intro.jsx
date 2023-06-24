import './intro.css'
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: {
    opacity: 0
  },
  show: {
    opacity: 1,
    // transition is embedded in here so we do not need to call it explicitly
    transition: {
      type: 'spring', 
      delay: 0.5,
      duration: 1.5
    }
  },
}

const textVariant = {
    hidden: {
      y: -50,
      opacity: 0,
    },
    show: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        duration: 3,
      },
    },
  };

const Intro = () => {
  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className='intro'
    >
      <motion.h1 variants={textVariant}>Welcome to TravelSync!</motion.h1>
      <motion.span className='tagline'>"Unlock the Power of TravelSync, Unforgettable Journeys Await."</motion.span>
      <img className="homeImg" src="/assets/homepage.png" alt="image" />
    </motion.div>
  )
}

export default Intro;
