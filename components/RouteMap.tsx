"use client";

import { motion, Variants } from "framer-motion";

export default function RouteMap() {
  const lineVariants: Variants = {
    hidden: { pathLength: 0 },
    visible: { 
      pathLength: 1,
      transition: { duration: 1.5, ease: "easeInOut", delay: 0.2 }
    }
  };

  const nodeVariants: Variants = {
    hidden: { scale: 0, opacity: 0 },
    visible: (custom: number) => ({
      scale: 1, 
      opacity: 1,
      transition: { delay: 0.2 + custom * 0.4, type: "spring", stiffness: 200 }
    })
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto h-48 md:h-64 flex items-center justify-center">
      <svg 
        viewBox="0 0 600 200" 
        className="w-full h-full drop-shadow-sm"
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Background track */}
        <path 
          d="M 50,100 L 250,100 L 300,50 L 550,50" 
          stroke="#CBE7D6" 
          strokeWidth="12"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {/* Animated track */}
        <motion.path 
          d="M 50,100 L 250,100 L 300,50 L 550,50" 
          stroke="#F9482F" 
          strokeWidth="12"
          strokeLinecap="round"
          strokeLinejoin="round"
          variants={lineVariants}
          initial="hidden"
          animate="visible"
        />

        {/* Nodes */}
        <g>
          <motion.circle cx="50" cy="100" r="16" fill="#16302A" custom={0} variants={nodeVariants} initial="hidden" animate="visible" />
          <motion.circle cx="50" cy="100" r="6" fill="#EEF1EA" custom={0} variants={nodeVariants} initial="hidden" animate="visible" />
          
          <motion.circle cx="200" cy="100" r="12" fill="#16302A" custom={1} variants={nodeVariants} initial="hidden" animate="visible" />
          <motion.circle cx="200" cy="100" r="4" fill="#EEF1EA" custom={1} variants={nodeVariants} initial="hidden" animate="visible" />
          
          <motion.circle cx="350" cy="50" r="12" fill="#16302A" custom={2} variants={nodeVariants} initial="hidden" animate="visible" />
          <motion.circle cx="350" cy="50" r="4" fill="#EEF1EA" custom={2} variants={nodeVariants} initial="hidden" animate="visible" />
          
          <motion.circle cx="550" cy="50" r="20" fill="#16302A" custom={3} variants={nodeVariants} initial="hidden" animate="visible" />
          <motion.circle cx="550" cy="50" r="8" fill="#F9482F" custom={3} variants={nodeVariants} initial="hidden" animate="visible" />
        </g>
        
        {/* Text Labels */}
        <motion.text x="50" y="140" fill="#16302A" fontSize="14" fontWeight="bold" textAnchor="middle" custom={0} variants={nodeVariants} initial="hidden" animate="visible">Arrival</motion.text>
        <motion.text x="200" y="140" fill="#16302A" fontSize="14" fontWeight="bold" textAnchor="middle" custom={1} variants={nodeVariants} initial="hidden" animate="visible">Apps</motion.text>
        <motion.text x="350" y="25" fill="#16302A" fontSize="14" fontWeight="bold" textAnchor="middle" custom={2} variants={nodeVariants} initial="hidden" animate="visible">SIM / eSIM</motion.text>
        <motion.text x="550" y="95" fill="#F9482F" fontSize="16" fontWeight="bold" textAnchor="middle" custom={3} variants={nodeVariants} initial="hidden" animate="visible">Connected!</motion.text>
      </svg>
    </div>
  );
}
