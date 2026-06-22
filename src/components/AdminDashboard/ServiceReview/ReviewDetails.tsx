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
  review: Review;
  onBack: () => void;
  onAccept: (id: string) => void;
  onReject: (id: string) => void;
}

const ReviewDetails: React.FC<Props> = ({
  review,
  onBack,
  onAccept,
  onReject,
}) => {
  if (!review) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.35 }}
      className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">
            {review.service}
          </h2>
          <p className="text-sm text-gray-500">by {review.groomer}</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="text-gray-600 hover:text-gray-800 cursor-pointer"
          >
            Back
          </button>

          <div
            className={`text-sm font-semibold px-3 py-1 rounded-full text-white capitalize ${
              review.status === "pending"
                ? "bg-yellow-500"
                : review.status === "accepted"
                  ? "bg-green-500"
                  : "bg-red-500"
            }`}
          >
            {review.status}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Before</h4>
          <div className="relative overflow-hidden rounded-lg">
            <motion.img
              src={review.beforeImg}
              alt="before"
              className="w-full h-[360px] object-cover rounded-lg cursor-pointer"
              whileHover={{ scale: 1.03 }}
            />

            <div className="absolute top-3 right-3 bg-black/30 p-2 rounded-full">
              <Eye size={18} color="#fff" />
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">After</h4>
          <div className="relative overflow-hidden rounded-lg">
            <motion.img
              src={review.afterImg}
              alt="after"
              className="w-full h-[360px] object-cover rounded-lg cursor-pointer"
              whileHover={{ scale: 1.03 }}
            />

            <div className="absolute top-3 right-3 bg-black/30 p-2 rounded-full">
              <Eye size={18} color="#fff" />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <h4 className="text-sm font-medium text-gray-700">Review</h4>
        <p className="text-gray-600 mt-2">{review.reviewText}</p>
      </div>

      <div className="mt-6 flex items-center gap-3">
        <motion.button
          onClick={() => onAccept(review.id)}
          whileTap={{ scale: 0.98 }}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 cursor-pointer"
        >
          Accept
        </motion.button>

        <motion.button
          onClick={() => onReject(review.id)}
          whileTap={{ scale: 0.98 }}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 cursor-pointer"
        >
          Reject
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ReviewDetails;
