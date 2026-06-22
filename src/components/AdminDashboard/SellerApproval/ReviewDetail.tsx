import React from "react";
import {
  ArrowLeft,
  MapPin,
  Briefcase,
  FileText,
  ChevronDown,
  XCircle,
} from "lucide-react";
import { motion } from "framer-motion";
import { GroomerProfile } from "@/redux/features/groomers/groomersType";
import ApproveButton from "./ApproveButton";

interface Props {
  groomer: GroomerProfile | null;
  onBack: () => void;
  onRejectClick: () => void;
  onApprove: () => Promise<void>;
  isApproving?: boolean;
  isRejecting?: boolean;
  onRefresh?: () => void;
}

const ReviewDetail: React.FC<Props> = ({
  groomer,
  onBack,
  onRejectClick,
  onApprove,
  isApproving = false,
  isRejecting = false,
}) => {
  if (!groomer) {
    return (
      <motion.div
        initial={{ x: 20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="max-w-4xl font-['Inter'] px-4 sm:px-6 md:px-0"
      >
        <div className="flex justify-between items-center mb-6 sm:mb-7 md:mb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 sm:gap-2 text-gray-700 font-medium hover:gap-2 sm:hover:gap-3 transition-all cursor-pointer"
          >
            <ArrowLeft className="text-gray-400" size={18} strokeWidth={3} />
            <span className="text-base sm:text-lg md:text-xl tracking-tight">
              Groomer Application Review
            </span>
          </button>
        </div>
        <div className="bg-white p-6 sm:p-8 md:p-10 rounded-[15px] border border-gray-100 shadow-sm text-center">
          <p className="text-gray-500 text-sm sm:text-base">
            No groomer data available
          </p>
          <button
            onClick={onBack}
            className="mt-4 text-[#E25822] hover:underline cursor-pointer text-sm sm:text-base"
          >
            Go Back
          </button>
        </div>
      </motion.div>
    );
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return "Invalid Date";
    }
  };

  const handleViewFile = (fileUrl: string | null, fileName: string) => {
    if (
      fileUrl &&
      fileUrl !== "" &&
      fileUrl !== "string" &&
      fileUrl.startsWith("http")
    ) {
      window.open(fileUrl, "_blank");
    } else {
      alert(`No valid file available for ${fileName}`);
    }
  };

  const getStatusColor = () => {
    switch (groomer.approvalStatus) {
      case "APPROVED":
        return "bg-green-50 text-green-600 border-green-100";
      case "REJECTED":
        return "bg-red-50 text-red-600 border-red-100";
      default:
        return "bg-orange-50 text-[#E25822] border-orange-100";
    }
  };

  const getFileName = (url: string | null, defaultName: string) => {
    if (!url || url === "" || url === "string") return defaultName;
    return url.split("/").pop() || defaultName;
  };

  const handleRejectClick = () => {
    onRejectClick();
  };

  return (
    <motion.div
      initial={{ x: 20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="max-w-4xl font-['Inter'] px-3 sm:px-4 md:px-0"
    >
      <div className="flex justify-between items-center mb-6 sm:mb-7 md:mb-8">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 sm:gap-2 text-gray-700 font-medium hover:gap-2 sm:hover:gap-3 transition-all cursor-pointer"
        >
          <ArrowLeft className="text-gray-400" size={18} strokeWidth={3} />
          <span className="text-base sm:text-lg md:text-xl tracking-tight">
            Groomer Application Review
          </span>
        </button>
      </div>

      <div className="bg-white p-5 sm:p-7 md:p-10 rounded-[15px] border border-gray-100 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 md:mb-10 gap-3 sm:gap-4">
          <div>
            <p className="text-[12px] sm:text-[13px] md:text-[15px] text-gray-500 font-light mb-1">
              Application ID
            </p>
            <h3 className="text-xl sm:text-2xl md:text-2xl font-medium tracking-tighter text-gray-900">
              {groomer.id?.slice(0, 8).toUpperCase() || "N/A"}
            </h3>
          </div>
          <span
            className={`${getStatusColor()} px-4 sm:px-5 md:px-6 py-1.5 sm:py-2 rounded-full text-[11px] sm:text-[12px] md:text-[13px] font-medium border`}
          >
            {groomer.approvalStatus || "PENDING"}
          </span>
        </div>

        <hr className="border-gray-200 mb-6 sm:mb-8 md:mb-10" />

        <div className="rounded-4xl mb-6 sm:mb-8 md:mb-10">
          <div className="text-[14px] sm:text-[15px] md:text-[16px] text-gray-500 font-medium mb-4 sm:mb-5 md:mb-6">
            Groomer Information
          </div>
          <div className="bg-[#F9FAFB] rounded-lg flex flex-wrap gap-x-12 sm:gap-x-16 md:gap-x-20 gap-y-3 sm:gap-y-4 pl-4 sm:pl-5 md:pl-6 pt-4 sm:pt-5 md:pt-6 pb-2 sm:pb-2.5 md:pb-3 border border-gray-100">
            <div>
              <InfoBox
                label="Full Name"
                value={groomer.legalFullName || groomer.user?.fullName || "N/A"}
              />
              <InfoBox label="Email" value={groomer.user?.email || "N/A"} />
              <InfoBox
                label="Service Area"
                value={groomer.serviceArea || "N/A"}
                icon={<MapPin size={14} className="text-[#E25822]" />}
              />
              <InfoBox label="ID Number" value={groomer.idNumber || "N/A"} />
              <InfoBox label="ID Type" value={groomer.idType || "N/A"} />
            </div>
            <div>
              <InfoBox
                label="Experience"
                value={`${groomer.experienceYears || 0} ${
                  groomer.experienceYears === 1 ? "year" : "years"
                }`}
                icon={<Briefcase size={14} className="text-[#E25822]" />}
              />
              <InfoBox label="Phone" value={groomer.user?.phone || "N/A"} />
              <InfoBox
                label="Business Name"
                value={groomer.businessName || "N/A"}
              />
              <InfoBox
                label="Submitted On"
                value={formatDate(groomer.createdAt)}
              />
            </div>
          </div>
        </div>

        <hr className="text-gray-200 mb-5 sm:mb-6 md:mb-7" />

        <div className="space-y-3 sm:space-y-4">
          <p className="text-[14px] sm:text-[15px] md:text-[15px] text-gray-500 font-medium mb-3 sm:mb-4 md:mb-5">
            KYC Documents
          </p>

          <DocItem
            label="ID Front Image"
            file={getFileName(groomer.idFrontImage, "id-front.jpg")}
            onView={() =>
              handleViewFile(groomer.idFrontImage, "ID Front Image")
            }
          />

          <DocItem
            label="ID Back Image"
            file={getFileName(groomer.idBackImage, "id-back.jpg")}
            onView={() => handleViewFile(groomer.idBackImage, "ID Back Image")}
          />

          {groomer.selfieWithId &&
            groomer.selfieWithId !== "" &&
            groomer.selfieWithId !== "string" && (
              <DocItem
                label="Selfie with ID"
                file={getFileName(groomer.selfieWithId, "selfie.jpg")}
                onView={() =>
                  handleViewFile(groomer.selfieWithId!, "Selfie with ID")
                }
              />
            )}

          <div className="mt-5 sm:mt-6 md:mt-6 pt-3 sm:pt-4 md:pt-4 border-t border-gray-100">
            <p className="text-[14px] sm:text-[15px] md:text-[15px] text-gray-500 font-medium mb-3 sm:mb-4">
              Business Information
            </p>
            <InfoBox
              label="Business Address"
              value={groomer.businessAddress || "N/A"}
            />
            {groomer.shortBio && (
              <InfoBox label="Short Bio" value={groomer.shortBio} />
            )}
            {groomer.about && <InfoBox label="About" value={groomer.about} />}
          </div>
        </div>

        {groomer.rejectionReason && (
          <div className="mt-5 sm:mt-6 p-3 sm:p-4 bg-red-50 rounded-lg border border-red-100">
            <p className="text-xs sm:text-sm text-red-600 font-medium">
              Rejection Reason:
            </p>
            <p className="text-xs sm:text-sm text-red-500 mt-1">
              {groomer.rejectionReason}
            </p>
          </div>
        )}

        {groomer.approvalStatus === "PENDING" && (
          <div className="flex flex-col sm:flex-row gap-3 mt-10 sm:mt-12 md:mt-14 justify-start">
            <ApproveButton onApprove={onApprove} isLoading={isApproving} />

            <button
              onClick={handleRejectClick}
              disabled={isRejecting}
              className={`flex items-center justify-center sm:justify-start gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl font-medium text-xs sm:text-sm transition-all shadow-sm active:scale-95 w-full sm:w-auto text-white ${
                isRejecting
                  ? "bg-red-300 cursor-not-allowed"
                  : "bg-red-500 hover:bg-red-700 cursor-pointer"
              }`}
            >
              {isRejecting ? (
                <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white" />
              ) : (
                <XCircle size={17} className="text-white" strokeWidth={2} />
              )}
              <span className="tracking-tight">
                {isRejecting ? "Rejecting..." : "Reject Application"}
              </span>
            </button>
          </div>
        )}

        {(groomer.approvalStatus === "APPROVED" ||
          groomer.approvalStatus === "REJECTED") && (
          <div className="mt-6 sm:mt-7 md:mt-8 p-3 sm:p-4 bg-gray-50 rounded-lg text-center">
            <p className="text-gray-600 text-sm sm:text-base">
              This application has been{" "}
              <span className="font-semibold">
                {groomer.approvalStatus.toLowerCase()}
              </span>
              {groomer.approvedAt && ` on ${formatDate(groomer.approvedAt)}`}
            </p>
            <button
              onClick={onBack}
              className="mt-2 sm:mt-3 text-[#E25822] hover:underline text-xs sm:text-sm cursor-pointer"
            >
              Back to List
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

const InfoBox: React.FC<{
  label: string;
  value: string;
  icon?: React.ReactNode;
}> = ({ label, value, icon }) => (
  <div className="mb-4 sm:mb-5">
    <p className="text-gray-600 font-light text-[10px] sm:text-[11px] md:text-[13px] tracking-tight mb-1 uppercase">
      {label}
    </p>
    <p className="text-[13px] sm:text-[14px] md:text-[15px] font-medium text-black flex items-center gap-1.5 sm:gap-2 tracking-normal">
      {icon}
      {value}
    </p>
  </div>
);

const DocItem: React.FC<{
  label: string;
  file: string;
  onView: () => void;
}> = ({ label, file, onView }) => (
  <div
    onClick={onView}
    className="flex items-center justify-between p-3 sm:p-4 md:p-5 bg-white rounded-lg cursor-pointer shadow-sm border border-transparent hover:border-[#E25822]/20 hover:bg-gray-50 transition-all active:scale-[0.99]"
  >
    <div className="flex items-center gap-3 sm:gap-4">
      <div className="p-2 sm:p-3 bg-gray-50 rounded-md text-gray-400">
        <FileText size={18} className="sm:w-5 sm:h-5 md:w-[22px] md:h-[22px]" />
      </div>
      <div>
        <p className="text-[13px] sm:text-[14px] md:text-[15px] text-black font-medium mb-0.5">
          {label}
        </p>
        <p className="text-[11px] sm:text-xs md:text-sm font-light text-gray-500">
          {file}
        </p>
      </div>
    </div>
    <button className="text-[12px] sm:text-[13px] md:text-[14px] font-light text-black flex items-center gap-1 hover:text-[#E25822] cursor-pointer">
      View <ChevronDown size={15} className="sm:w-4 sm:h-4" />
    </button>
  </div>
);

export default ReviewDetail;
