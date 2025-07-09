"use client"

import type React from "react"

import { motion } from "framer-motion"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Copy, RefreshCw, Sparkles, ThumbsUp, ThumbsDown, Check } from "lucide-react"
import { useState, useEffect } from "react"
import { AssistantMessageProps } from "@copilotkit/react-ui"

// Import the actual TextMessage type and MessageRole enum from CopilotKit
import { TextMessage, MessageRole } from "@copilotkit/runtime-client-gql"

interface ComponentsMap {
  [key: string]: React.ComponentType<any>
}

export function AssistantMessage({
  message,
  isCurrentMessage,
  rawData,
  subComponent,
  isLoading,
  isGenerating,
  onRegenerate,
  onCopy,
  onThumbsUp,
  onThumbsDown,
  markdownTagRenderers,
}: AssistantMessageProps) {
  const [copied, setCopied] = useState(false)
  const [timestamp, setTimestamp] = useState('')

  // Set timestamp only on client side to avoid hydration mismatch
  useEffect(() => {
    setTimestamp(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }))
  }, [])

  const handleCopy = async () => {
    try {
      if (message) {
        // Try to copy to clipboard first
        await navigator.clipboard.writeText(message)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
        
        // Also call the onCopy callback if it exists
        if (onCopy) {
          onCopy(message)
        }
      }
    } catch (error) {
      console.error('Failed to copy text:', error)
      // Fallback for older browsers or when clipboard API fails
      try {
        const textArea = document.createElement('textarea')
        textArea.value = message || ''
        textArea.style.position = 'fixed'
        textArea.style.opacity = '0'
        document.body.appendChild(textArea)
        textArea.select()
        document.execCommand('copy')
        document.body.removeChild(textArea)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } catch (fallbackError) {
        console.error('Fallback copy also failed:', fallbackError)
      }
    }
  }

  // Fix the thumbs up/down handlers to create proper TextMessage instances
  const handleThumbsUp = () => {
    if (onThumbsUp && message) {
      // Create a proper TextMessage instance using the constructor
      const textMessage = new TextMessage({
        id: Date.now().toString(),
        content: message,
        role: MessageRole.Assistant,
        parentMessageId: undefined,
        createdAt: new Date(),
      })
      onThumbsUp(textMessage)
    }
  }

  const handleThumbsDown = () => {
    if (onThumbsDown && message) {
      // Create a proper TextMessage instance using the constructor
      const textMessage = new TextMessage({
        id: Date.now().toString(),
        content: message,
        role: MessageRole.Assistant,
        parentMessageId: undefined,
        createdAt: new Date(),
      })
      onThumbsDown(textMessage)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={{
        duration: 0.3,
        ease: [0.25, 0.46, 0.45, 0.94],
        delay: 0.1,
      }}
      className="flex justify-start items-start gap-2 sm:gap-3 mb-6 group w-full overflow-hidden"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        className="flex-shrink-0"
      >
        <Avatar className="w-8 h-8 sm:w-10 sm:h-10 ring-2 ring-emerald-200 ring-offset-2">
          <AvatarFallback className="bg-gradient-to-br from-emerald-400 via-teal-400 to-cyan-500 text-white text-xs sm:text-sm font-semibold">
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
          </AvatarFallback>
        </Avatar>
      </motion.div>

      <div className="flex flex-col max-w-[85%] sm:max-w-[75%] lg:max-w-[65%] min-w-0 flex-1">
        {/* Add label */}
        <span className="text-xs text-muted-foreground mb-1 ml-1 font-medium">Assistant</span>

        <motion.div whileHover={{ scale: 1.01 }} transition={{ duration: 0.2 }}>
          <Card className="relative overflow-hidden border border-slate-200/60 shadow-lg bg-white/80 backdrop-blur-sm">
            {/* Subtle gradient border effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-cyan-500/10 rounded-lg" />

            {/* Content */}
            <div className="relative p-3 sm:p-4">
              {isLoading || isGenerating ? (
                <div className="flex items-center gap-2">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                  >
                    <Sparkles className="w-4 h-4 text-emerald-500" />
                  </motion.div>
                  <div className="flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        className="w-2 h-2 bg-emerald-400 rounded-full"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{
                          duration: 0.8,
                          repeat: Number.POSITIVE_INFINITY,
                          delay: i * 0.2,
                        }}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  {message && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                      className="text-slate-700 text-sm sm:text-base leading-relaxed"
                    >
                      {message}
                    </motion.p>
                  )}
                  {subComponent && <div className="mt-2">{subComponent}</div>}
                </>
              )}
            </div>

            {/* Subtle shine effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full"
              animate={{ translateX: "200%" }}
              transition={{
                duration: 3,
                repeat: Number.POSITIVE_INFINITY,
                repeatDelay: 4,
                ease: "linear",
              }}
            />
          </Card>
        </motion.div>

        {/* Fixed alignment for timestamp and actions with proper spacing */}
        <div className="flex items-center justify-between mt-3 px-1 min-h-[20px]">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex-shrink-0"
          >
            {timestamp}
          </motion.span>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex-shrink-0"
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              className="h-7 w-7 p-0 hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
            >
              <motion.div 
                animate={copied ? { scale: [1, 1.2, 1] } : {}} 
                transition={{ duration: 0.3 }}
              >
                {copied ? (
                  <Check className="w-3 h-3 text-emerald-600" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
              </motion.div>
            </Button>

            {onRegenerate && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onRegenerate}
                className="h-7 w-7 p-0 hover:bg-slate-100 hover:text-slate-600 transition-colors"
              >
                <RefreshCw className="w-3 h-3" />
              </Button>
            )}

            {onThumbsUp && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleThumbsUp}
                className="h-7 w-7 p-0 hover:bg-green-50 hover:text-green-600 transition-colors"
              >
                <ThumbsUp className="w-3 h-3" />
              </Button>
            )}

            {onThumbsDown && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleThumbsDown}
                className="h-7 w-7 p-0 hover:bg-red-50 hover:text-red-600 transition-colors"
              >
                <ThumbsDown className="w-3 h-3" />
              </Button>
            )}
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}