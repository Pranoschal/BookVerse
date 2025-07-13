import { motion } from "framer-motion";
import React from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Link from "next/link";

const Banner = () => {
  return (
    <div className="relative container mx-auto px-4 py-20 lg:py-32">
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        className="text-center max-w-4xl mx-auto"
      >
        <motion.h1
          className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <span className="text-2xl md:text-3xl lg:text-4xl block mb-2 text-blue-200">
            Welcome to
          </span>
          BookVerse
          <br />
          <span className="text-yellow-300">Your Reading Universe</span>
        </motion.h1>
        <motion.p
          className="text-xl md:text-2xl mb-8 text-blue-100"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          Curate your personal library, track your reading journey, and explore
          endless stories in your own BookVerse
        </motion.p>
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Link
            href="/bookRecommendation"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              variant="outline"
              size="lg"
              className="
        relative 
        overflow-hidden 
        bg-gradient-to-r 
        from-blue-600/30 
        via-indigo-600/30 
        to-purple-600/30
        border-2 
        border-blue-300/50 
        backdrop-blur-md
        px-8 
        py-4 
        rounded-xl 
        font-semibold 
        text-lg
        text-purple-600
        transition-all 
        duration-300 
        ease-in-out
        hover:border-blue-200/70
        hover:bg-gradient-to-r
        hover:from-blue-500/40
        hover:via-indigo-500/40
        hover:to-purple-500/40
        hover:scale-105
        hover:shadow-xl
        hover:shadow-blue-400/40
        active:scale-95
        group
        before:absolute
        before:inset-0
        before:bg-gradient-to-r
        before:from-transparent
        before:via-white/40
        before:to-transparent
        before:translate-x-[-100%]
        before:skew-x-12
        before:transition-transform
        before:duration-1000
        before:ease-out
        hover:before:translate-x-[100%]
        after:absolute
        after:inset-0
        after:bg-gradient-to-r
        after:from-cyan-300/0
        after:via-blue-200/20
        after:to-cyan-300/0
        after:opacity-0
        after:transition-opacity
        after:duration-300
        hover:after:opacity-100
      "
            >
              Get Recommended Books
            </Button>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Banner;
