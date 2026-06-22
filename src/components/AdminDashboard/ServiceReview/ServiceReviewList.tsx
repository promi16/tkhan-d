import React from "react";
import { motion } from "framer-motion";
import { Eye } from "lucide-react";

interface Review {
  id: string;
  groomer: string;
  service: string;
  beforeImg: string;
  afterImg: string;
  reviewText: string;
  status: "pending" | "accepted" | "rejected";
}

interface Props {
  reviews: Review[];
  onSelect: (r: Review) => void;
  onAccept: (id: string) => void;
  onReject: (id: string) => void;
}

const ServiceReviewList: React.FC<Props> = ({
  reviews,
  onSelect,
  onAccept,
  onReject,
}) => {
  if (!reviews || reviews.length === 0) return <p>No reviews found.</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
      {reviews.map((r, i) => (
        <motion.div
          key={r.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05, duration: 0.35 }}
          whileHover={{ y: -6, boxShadow: "0 10px 30px rgba(15,23,42,0.08)" }}
          className="bg-white p-4 rounded-2xl border border-gray-100 transition-all"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h3 className="font-semibold text-gray-800 text-lg">
                {r.service}
              </h3>
              <p className="text-sm text-gray-500">by {r.groomer}</p>

              <div className="mt-3 grid grid-cols-2 gap-2">
                {[r.beforeImg, r.afterImg].map((src, idx) => (
                  <div
                    key={src}
                    className="relative overflow-hidden rounded-lg"
                  >
                    <motion.img
                      src={src}
                      alt={idx === 0 ? "before" : "after"}
                      className="w-full h-28 object-cover rounded-lg cursor-pointer"
                      whileHover={{ scale: 1.06 }}
                      onClick={() => onSelect(r)}
                    />

                    <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <div className="bg-black/30 p-2 rounded-full">
                        <Eye size={18} color="#fff" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col items-end gap-3">
              <div
                className={`text-sm font-semibold px-3 py-1 rounded-full text-white capitalize ${
                  r.status === "pending"
                    ? "bg-yellow-500"
                    : r.status === "accepted"
                      ? "bg-green-500"
                      : "bg-red-500"
                }`}
              >
                {r.status}
              </div>

              <div className="flex flex-col gap-2">
                <motion.button
                  onClick={() => onAccept(r.id)}
                  whileTap={{ scale: 0.98 }}
                  className="bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700 cursor-pointer"
                >
                  Accept
                </motion.button>

                <motion.button
                  onClick={() => onReject(r.id)}
                  whileTap={{ scale: 0.98 }}
                  className="bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700 cursor-pointer"
                >
                  Reject
                </motion.button>

                <motion.button
                  onClick={() => onSelect(r)}
                  whileTap={{ scale: 0.98 }}
                  className="text-sm text-[#FF6B35] underline hover:no-underline cursor-pointer"
                >
                  View Details
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default ServiceReviewList;
