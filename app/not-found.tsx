"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FileText } from "lucide-react"; // Icon similar to your image
export default function NotFound() {
  const pathName = usePathname();
  const router = useRouter();
  const navigate = (path: string) => {
    router.push(path);
  };

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      pathName
    );
  }, [pathName]);
  return (
    <div className="flex flex-col min-h-screen bg-linear-to-b from-blue-50 to-white">
      {/* Header */}

      {/* Main Content */}
      <main className="grow flex items-center justify-center px-4 mt-12 mb-12">
        <motion.div
          className="bg-white rounded-xl shadow-xl p-10 flex flex-col items-center text-center max-w-sm w-full"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Icon */}
          <motion.div
            className="text-blue-500 mb-6"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <FileText size={60} />
          </motion.div>

          {/* Title */}
          <h1 className="text-4xl font-bold text-gray-800 mb-2">404</h1>

          {/* Subtitle */}
          <p className="text-gray-600 mb-6">
            Page Not Found
            <br />
            The page you are looking for might be removed or does not exist.
          </p>

          {/* Button */}
          <motion.button
            className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg shadow-lg hover:bg-blue-700 transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/")}
          >
            GO HOME
          </motion.button>
        </motion.div>
      </main>

      {/* Footer */}
      <div className="mt-12"></div>
    </div>
  );
}
