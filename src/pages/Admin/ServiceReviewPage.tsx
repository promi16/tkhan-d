import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ServiceReviewHeader from "@/components/AdminDashboard/ServiceReview/ServiceReviewHeader";
import ServiceReviewList from "@/components/AdminDashboard/ServiceReview/ServiceReviewList";
import ReviewDetails from "@/components/AdminDashboard/ServiceReview/ReviewDetails";

export interface Review {
  id: string;
  groomer: string;
  service: string;
  beforeImg: string;
  afterImg: string;
  reviewText: string;
  status: "pending" | "accepted" | "rejected";
}

const initialReviews: Review[] = [
  {
    id: "r1",
    groomer: "Groomer A",
    service: "Full Grooming",
    beforeImg: "https://via.placeholder.com/400x300?text=Before+1",
    afterImg: "https://via.placeholder.com/400x300?text=After+1",
    reviewText: "Nice neat grooming, customer satisfied.",
    status: "pending",
  },
  {
    id: "r2",
    groomer: "Groomer B",
    service: "Bath & Trim",
    beforeImg: "https://via.placeholder.com/400x300?text=Before+2",
    afterImg: "https://via.placeholder.com/400x300?text=After+2",
    reviewText: "Good job, punctual and careful.",
    status: "pending",
  },
];

const ServiceReviewPage: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [selected, setSelected] = useState<Review | null>(null);

  const handleAccept = (id: string) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "accepted" } : r)),
    );
    setSelected((s) => (s && s.id === id ? { ...s, status: "accepted" } : s));
  };

  const handleReject = (id: string) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "rejected" } : r)),
    );
    setSelected((s) => (s && s.id === id ? { ...s, status: "rejected" } : s));
  };

  return (
    <div className="w-full min-h-screen bg-[#F9FAFB] font-inter pt-4">
      <div className="w-full px-4 md:px-6 lg:px-8">
        <ServiceReviewHeader />

        <div className="w-full mt-6">
          <AnimatePresence>
            {!selected ? (
              <motion.div
                key="list"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <ServiceReviewList
                  reviews={reviews}
                  onSelect={(r) => setSelected(r)}
                  onAccept={handleAccept}
                  onReject={handleReject}
                />
              </motion.div>
            ) : (
              <motion.div
                key="details"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="w-full lg:w-[min(1090px,100%)]">
                  <ReviewDetails
                    review={selected}
                    onBack={() => setSelected(null)}
                    onAccept={handleAccept}
                    onReject={handleReject}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default ServiceReviewPage;
