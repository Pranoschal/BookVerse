"use client"

import type React from "react"

import { motion } from "framer-motion"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card } from "@/components/ui/card"
import { User } from "lucide-react"
import { UserMessageProps } from "@copilotkit/react-ui"

export function UserMessage({ message, rawData, subComponent }: UserMessageProps) {
  const timestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  const userName = "You"

  return (
    <motion.div
      initial={{ opacity: 0, x: 20, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={{
        duration: 0.3,
        ease: [0.25, 0.46, 0.45, 0.94],
        delay: 0.1,
      }}
      className="flex justify-end items-start gap-2 sm:gap-3 mb-6 group w-full overflow-hidden"
    >
      <div className="flex flex-col items-end max-w-[85%] sm:max-w-[75%] lg:max-w-[65%] min-w-0">
        {/* Add label */}
        <span className="text-xs text-muted-foreground mb-1 mr-1 font-medium">You</span>

        <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
          <Card className="relative overflow-hidden border-0 shadow-lg">
            {/* Gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500" />

            {/* Content */}
            <div className="relative p-3 sm:p-4">
              {message && <p className="text-white text-sm sm:text-base leading-relaxed font-medium">{message}</p>}
              {subComponent && <div className="text-white">{subComponent}</div>}
            </div>

            {/* Subtle shine effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full"
              animate={{ translateX: "200%" }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                repeatDelay: 3,
                ease: "linear",
              }}
            />
          </Card>
        </motion.div>

        {/* Fix timestamp positioning with proper margin */}
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-xs text-muted-foreground mt-2 mr-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        >
          {timestamp}
        </motion.span>
      </div>

      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
      >
        <Avatar className="w-8 h-8 sm:w-10 sm:h-10 ring-2 ring-violet-200 ring-offset-2">
          <AvatarFallback className="bg-gradient-to-br from-violet-400 to-purple-500 text-white text-xs sm:text-sm font-semibold">
            <User className="w-4 h-4 sm:w-5 sm:h-5" />
          </AvatarFallback>
        </Avatar>
      </motion.div>
    </motion.div>
  )
}
