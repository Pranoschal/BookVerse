import { motion } from "framer-motion";

const FooterSection = () =>{
    return (<footer className="bg-gradient-to-r from-gray-900 via-purple-900/50 to-blue-900/50 text-white py-12 mt-4">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-6"
            >
              <h3 className="text-3xl font-bold mb-2 relative">
                <span className="bg-gradient-to-r from-purple-300 via-blue-300 to-purple-300 bg-clip-text text-transparent bg-[length:200%_100%] animate-[shimmer_3s_ease-in-out_infinite]">
                  BookVerse
                </span>
              </h3>
              <p className="text-xl text-white font-medium">
                Your Reading Universe
              </p>
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-gray-100 mb-4 text-lg"
            >
              Discover, organize, and enjoy your literary journey
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-base text-gray-200 font-medium"
            >
              Happy Reading! 📚 ✨
            </motion.div>
          </div>
        </div>
      </footer>)
}

export default FooterSection