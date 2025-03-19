"use client"

import { motion } from "framer-motion"

export default function InteractiveLogoMarquee() {
  // Example logos - replace with your actual logos
  const logos = ["Nike", "Adidas", "Puma", "Reebok", "Under Armour", "New Balance", "Asics", "Fila", "Converse", "Vans"]

  // Duplicate logos to create a seamless loop
  const extendedLogos = [...logos, ...logos, ...logos]

  return (
    <div className="overflow-hidden bg-[#CC2B52] py-6 relative">
      <motion.div
        className="flex whitespace-nowrap"
        animate={{
          x: [0, "-100%"],
        }}
        transition={{
          duration: 20,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
          repeatType: "loop",
        }}
      >
        {extendedLogos.map((logo, index) => (
          <motion.span key={index} className="text-white text-2xl font-bold inline-block mx-8">
            {logo}
          </motion.span>
        ))}
      </motion.div>
    </div>
  )
}

