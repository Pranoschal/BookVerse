"use client"

import { motion } from "framer-motion"
import { MessageCircle, Sparkles } from "lucide-react"
import { useState } from "react"

interface ChatButtonProps {
  onClick?: () => void;
}

export function ChatButton({ onClick }: ChatButtonProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.5,
        type: "spring",
        stiffness: 200,
        delay: 0.2,
      }}
      className="relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Outer glow ring */}
      <motion.div
        className="absolute inset-0 rounded-full bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 opacity-0 blur-md"
        animate={
          isHovered
            ? {
                opacity: [0, 0.6, 0.4],
                scale: [1, 1.2, 1.1],
              }
            : {
                opacity: 0,
                scale: 1,
              }
        }
        transition={{ duration: 0.3 }}
      />

      {/* Pulsing ring animation */}
      <motion.div
        className="absolute inset-0 rounded-full border-2 border-violet-400/30"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.5, 0, 0.5],
        }}
        transition={{
          duration: 2,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />

      {/* Tooltip - positioned at left-top */}
      <motion.div
        initial={{ opacity: 0, x: 10, y: 5, scale: 0.8 }}
        animate={
          isHovered
            ? {
                opacity: 1,
                x: 0,
                y: 0,
                scale: 1,
              }
            : {
                opacity: 0,
                x: 10,
                y: 5,
                scale: 0.8,
              }
        }
        transition={{ duration: 0.2 }}
        className="absolute right-full top-0 transform -translate-y-2 mr-2 xs:mr-2.5 sm:mr-3 md:mr-3.5 lg:mr-4 px-2 xs:px-2.5 sm:px-3 py-1 xs:py-1.5 bg-slate-800 text-white rounded-md shadow-lg whitespace-nowrap pointer-events-none z-10"
      >
        <span className="text-xs xs:text-xs sm:text-sm md:text-sm lg:text-sm font-medium">
          <span className="inline xs:hidden sm:inline">Chat</span>
          <span className="hidden xs:inline sm:hidden">💬</span>
        </span>

        {/* Arrow pointing to button */}
        <div className="absolute left-full top-1/2 transform -translate-y-1/2 w-0 h-0 border-t-[6px] border-b-[6px] border-l-[6px] border-transparent border-l-slate-800" />
      </motion.div>

      {/* Main button */}
      <motion.button
        onClick={onClick}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="relative w-10 h-10 xs:w-11 xs:h-11 sm:w-12 sm:h-12 md:w-13 md:h-13 lg:w-14 lg:h-14 bg-gradient-to-br from-slate-800 via-slate-900 to-black rounded-full shadow-2xl overflow-hidden focus:outline-none focus:ring-4 focus:ring-violet-500/50 transition-all duration-300"
      >
        {/* Animated background gradient */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-violet-600/20 via-purple-600/10 to-fuchsia-600/20"
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />

        {/* Floating particles */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-0.5 h-0.5 xs:w-0.5 xs:h-0.5 sm:w-1 sm:h-1 md:w-1 md:h-1 lg:w-1 lg:h-1 bg-white/40 rounded-full"
            style={{
              left: `${25 + i * 20}%`,
              top: `${30 + (i % 2) * 40}%`,
            }}
            animate={{
              y: [0, -6, 0],
              opacity: [0.4, 0.8, 0.4],
              scale: [1, 1.3, 1],
            }}
            transition={{
              duration: 2 + i * 0.3,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay: i * 0.4,
            }}
          />
        ))}

        {/* Icon container */}
        <div className="relative flex items-center justify-center w-full h-full">
          <motion.div
            animate={
              isHovered
                ? {
                    rotate: [0, -10, 10, 0],
                    scale: [1, 1.1, 1],
                  }
                : {}
            }
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <MessageCircle className="w-4 h-4 xs:w-4.5 xs:h-4.5 sm:w-5 sm:h-5 md:w-5.5 md:h-5.5 lg:w-6 lg:h-6 text-white drop-shadow-lg" />

            {/* Sparkle effect on hover */}
            <motion.div
              className="absolute -top-1 -right-1"
              animate={
                isHovered
                  ? {
                      scale: [0, 1, 0],
                      rotate: [0, 180, 360],
                    }
                  : { scale: 0 }
              }
              transition={{ duration: 0.6 }}
            >
              <Sparkles className="w-2 h-2 xs:w-2.5 xs:h-2.5 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 lg:w-3 lg:h-3 text-yellow-300" />
            </motion.div>
          </motion.div>
        </div>

        {/* Shine effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full rotate-45"
          animate={{ translateX: "200%" }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            repeatDelay: 3,
            ease: "linear",
          }}
        />

        {/* Inner highlight */}
        <div className="absolute inset-1 rounded-full bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
      </motion.button>
    </motion.div>
  )
}