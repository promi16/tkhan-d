import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star } from "lucide-react";
import { User, Review } from "../../../redux/features/users/usersType";

interface RatingDistribution {
  star: number;
  count: number;
  percentage: number;
}

interface UserFeedbackProps {
  user?: User;
  userId?: string;
  // Parent থেকে সরাসরি reviews pass করা হবে
  reviews?: Review[];
}

export const UserFeedback: React.FC<UserFeedbackProps> = ({
  user,
  userId,
  reviews = [],
}) => {
  const finalReviews: Review[] = reviews;

  const averageRating =
    finalReviews.length > 0
      ? (
          finalReviews.reduce((acc, review) => acc + (review.rating ?? 0), 0) /
          finalReviews.length
        ).toFixed(1)
      : "0.0";

  const ratingDistribution: RatingDistribution[] = [5, 4, 3, 2, 1].map(
    (star) => {
      const count = finalReviews.filter(
        (r) => Math.round(r.rating ?? 0) === star,
      ).length;
      return {
        star,
        count,
        percentage:
          finalReviews.length > 0 ? (count / finalReviews.length) * 100 : 0,
      };
    },
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        // userId key দিলে user switch হলে animation reset হবে
        key={userId}
        initial="hidden"
        animate="visible"
        exit={{ opacity: 0, y: -10, transition: { duration: 0.15 } }}
        variants={containerVariants}
        className="space-y-4 sm:space-y-5 md:space-y-6 max-w-4xl mx-auto md:mx-0"
      >
        {/* Blocked user warning */}
        {user?.isBlocked && (
          <motion.div
            variants={itemVariants}
            className="bg-red-50 border border-red-200 rounded-xl p-3 sm:p-4"
          >
            <p className="text-red-600 text-xs sm:text-sm flex items-center gap-2">
              ⚠️ This user is currently{" "}
              <span className="font-semibold">BLOCKED</span>
            </p>
          </motion.div>
        )}

        {/* Rating summary card */}
        <motion.div
          variants={itemVariants}
          className="bg-white p-4 sm:p-6 md:p-8 lg:p-10 rounded-3xl border border-gray-100 shadow-sm flex flex-col md:flex-row items-center gap-4 sm:gap-6 md:gap-8 lg:gap-12"
        >
          <div className="text-center shrink-0">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-[#FF6B35]">
              {averageRating}
            </h1>
            <div className="flex text-[#FF6B35] justify-center my-1.5 sm:my-2 gap-0.5 sm:gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="w-3 h-3 sm:w-4 sm:h-4"
                  fill={
                    i < Math.round(Number(averageRating))
                      ? "currentColor"
                      : "none"
                  }
                  stroke="currentColor"
                />
              ))}
            </div>
            <p className="text-[10px] sm:text-xs md:text-xs text-gray-400 font-light">
              {finalReviews.length}{" "}
              {finalReviews.length === 1 ? "review" : "reviews"}
            </p>
          </div>

          {/* Rating distribution bars */}
          <div className="flex-1 w-full space-y-2 sm:space-y-3">
            {ratingDistribution.map((dist) => (
              <div
                key={dist.star}
                className="flex items-center gap-2 sm:gap-3 md:gap-4 text-[9px] sm:text-[10px] md:text-xs font-bold text-black"
              >
                <span className="w-4 sm:w-5">{dist.star}★</span>
                <div className="flex-1 h-1.5 sm:h-2 bg-gray-50 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${dist.percentage}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="h-full bg-[#FF6B35]"
                  />
                </div>
                <span className="w-3 sm:w-4 text-right font-medium">
                  {dist.count}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Individual reviews */}
        <div className="space-y-3 sm:space-y-4">
          {finalReviews.length === 0 ? (
            <motion.div
              variants={itemVariants}
              className="bg-white p-8 sm:p-12 rounded-3xl border border-gray-100 text-center"
            >
              <p className="text-gray-500 text-sm sm:text-base">
                No reviews yet
              </p>
            </motion.div>
          ) : (
            finalReviews.map((review, idx) => (
              <motion.div
                key={review.id ?? `review-${userId}-${idx}`}
                variants={itemVariants}
                whileHover={{ scale: 1.005 }}
                className="bg-white p-3 sm:p-4 md:p-5 lg:p-6 rounded-[20px] md:rounded-3xl border border-gray-50 shadow-sm flex gap-2.5 sm:gap-3 md:gap-4 items-start"
              >
                <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full bg-slate-50 shrink-0 flex items-center justify-center text-base sm:text-lg md:text-xl border border-gray-100">
                  👤
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-row items-center justify-between gap-1 flex-wrap">
                    <p className="font-semibold text-black text-xs sm:text-sm md:text-base">
                      {review.reviewerName ??
                        review.reviewer?.fullName ??
                        "Anonymous"}
                      {(review.revieweeName ?? review.reviewee?.fullName) && (
                        <span className="text-gray-400 font-normal text-[10px] sm:text-xs md:text-sm">
                          {" → "}
                          {review.revieweeName ?? review.reviewee?.fullName}
                        </span>
                      )}
                    </p>
                    <div className="flex text-[#FF6B35] gap-0.5">
                      {[...Array(5)].map((_, j) => (
                        <Star
                          key={j}
                          className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4"
                          fill={
                            j < Math.round(review.rating ?? 0)
                              ? "currentColor"
                              : "none"
                          }
                          stroke="currentColor"
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-[11px] sm:text-xs md:text-sm text-gray-600 font-light mt-1.5 sm:mt-2 leading-relaxed">
                    {review.comment ?? review.review ?? "No comment provided"}
                  </p>
                  <p className="text-[10px] sm:text-xs text-gray-400 mt-1">
                    {review.createdAt
                      ? new Date(review.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : "Recent"}
                  </p>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
