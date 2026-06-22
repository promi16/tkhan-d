import React from "react";
import { motion } from "framer-motion";

const ServiceReviewHeader: React.FC = () => (
  <motion.div
    initial={{ opacity: 0, y: -6 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.45 }}
    className="mb-5 -mt-3"
  >
    <h1 className="text-xl md:text-2xl font-bold text-[#1A1A1A]">
      Service Reviews
    </h1>
    <p className="text-md text-gray-500">
      Review groomer services with before and after photos
    </p>

    <div className="mt-3 w-full max-w-[420px]">
      <div className="h-2 rounded-full bg-gradient-to-r from-[#FF6B35] via-[#FFA57A] to-[#FFD7C0] shadow-sm" />
    </div>
  </motion.div>
);

export default ServiceReviewHeader;
