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
          <Button
            size="lg"
            className="bg-white text-purple-600 hover:bg-blue-50 px-8 py-3 text-lg font-semibold"
          >
            Start Reading
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-white text-white hover:bg-white/10 px-8 py-3 text-lg bg-transparent"
          >
            <Link
              href="/bookRecommendation"
              target="_blank"
              rel="noopener noreferrer"
            >
              Get Recommended Books
            </Link>
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Banner;
