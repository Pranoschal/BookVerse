"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { X, Sparkles } from "lucide-react"
import { useState } from "react"
import { HeaderProps } from "@copilotkit/react-ui"

export function ChatHeader({}: HeaderProps) {
  const [isCloseHovered, setIsCloseHovered] = useState(false)

  const handleClose = () => {
    console.log("Close chat")
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="relative overflow-hidden px-3 py-4 sm:px-4 sm:py-5 md:px-6 md:py-6"
    >
      {/* Beautiful gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600" />
      <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/20 via-transparent to-cyan-400/30" />
      <div className="absolute inset-0 bg-gradient-to-bl from-transparent via-pink-500/10 to-rose-400/20" />

      {/* Animated mesh gradient overlay */}
      <motion.div
        className="absolute inset-0 opacity-30"
        animate={{
          background: [
            "radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.3) 0%, transparent 50%)",
            "radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%)",
            "radial-gradient(circle at 40% 80%, rgba(119, 255, 198, 0.3) 0%, transparent 50%)",
            "radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.3) 0%, transparent 50%)",
          ],
        }}
        transition={{
          duration: 8,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />

      {/* Floating particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-white/40 rounded-full"
          style={{
            left: `${20 + i * 15}%`,
            top: `${30 + (i % 2) * 40}%`,
          }}
          animate={{
            y: [0, -10, 0],
            opacity: [0.4, 0.8, 0.4],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 3 + i * 0.5,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: i * 0.3,
          }}
        />
      ))}

      {/* Subtle shine effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full"
        animate={{ translateX: "200%" }}
        transition={{
          duration: 3,
          repeat: Number.POSITIVE_INFINITY,
          repeatDelay: 4,
          ease: "linear",
        }}
      />

      <div className="relative flex items-center justify-between">
        {/* Left spacer for centering */}
        <div className="w-8 sm:w-10" />

        {/* Centered Title Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5, type: "spring", stiffness: 200 }}
          className="flex flex-col items-center text-center flex-1"
        >
          <div className="flex items-center gap-2 sm:gap-3 mb-1">
            <motion.div
              animate={{
                rotate: [0, 360],
                scale: [1, 1.1, 1],
              }}
              transition={{
                rotate: { duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "linear" },
                scale: { duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" },
              }}
              className="w-6 h-6 sm:w-8 sm:h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30"
            >
              <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.4 }}
              className="text-lg sm:text-xl md:text-2xl font-bold text-white drop-shadow-sm"
            >
              Popup Assistant
            </motion.h1>
          </div>

          <motion.div
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "auto" }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="h-0.5 bg-gradient-to-r from-transparent via-white/60 to-transparent rounded-full"
            style={{ width: "60px" }}
          />

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.4 }}
            className="text-xs sm:text-sm text-white/90 mt-1 font-medium tracking-wide hidden sm:block"
          >
            AI-Powered Chat Experience
          </motion.p>
        </motion.div>

        {/* Close Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.4, type: "spring", stiffness: 300 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            onMouseEnter={() => setIsCloseHovered(true)}
            onMouseLeave={() => setIsCloseHovered(false)}
            className="h-8 w-8 sm:h-10 sm:w-10 p-0 text-white/80 hover:text-white hover:bg-white/20 backdrop-blur-sm transition-all duration-300 rounded-full border border-white/20 hover:border-white/40"
          >
            <motion.div
              animate={isCloseHovered ? { rotate: 90, scale: 1.1 } : { rotate: 0, scale: 1 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </motion.div>
          </Button>
        </motion.div>
      </div>

      {/* Bottom glow effect */}
      <motion.div
        initial={{ opacity: 0, scaleX: 0 }}
        animate={{ opacity: 1, scaleX: 1 }}
        transition={{ delay: 0.8, duration: 1 }}
        className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent"
      />

      {/* Corner accents */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="absolute top-0 left-0 w-8 h-8 bg-gradient-to-br from-white/10 to-transparent rounded-br-full"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1, duration: 0.5 }}
        className="absolute top-0 right-0 w-8 h-8 bg-gradient-to-bl from-white/10 to-transparent rounded-bl-full"
      />
    </motion.div>
  )
}
