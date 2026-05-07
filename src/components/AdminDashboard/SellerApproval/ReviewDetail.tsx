import React from "react";
import {
  ArrowLeft,
  MapPin,
  Briefcase,
  FileText,
  ChevronDown,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { motion } from "framer-motion";

interface Props {
  onBack: () => void;
  onRejectClick: () => void;
  onApproveSuccess: () => void;
}

const ReviewDetail: React.FC<Props> = ({
  onBack,
  onRejectClick,
  onApproveSuccess,
}) => {
  const mapSource = "/map.png";
  const googleMapsUrl = "https://www.google.com/maps?q=Manhattan,New+York";

  const handleOpenLiveLocation = () => {
    window.open(googleMapsUrl, "_blank");
  };

  const handleViewFile = (fileName: string) => {
    alert(`Opening ${fileName}...`);
    console.log(`Open file from: /assets/docs/${fileName}`);
  };

  return (
    <motion.div
      initial={{ x: 20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="max-w-4xl font-['Inter']"
    >
      <div className="flex justify-between items-center mb-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-700 font-medium hover:gap-3 transition-all cursor-pointer"
        >
          <ArrowLeft className="text-gray-400" size={22} strokeWidth={3} />
          <span className="text-xl tracking-tight">
            Groomer Application Review
          </span>
        </button>
      </div>

      <div className="bg-white p-10 rounded-[15px] border border-gray-100 shadow-sm">
        <div className="flex justify-between items-center mb-10">
          <div>
            <p className="text-[15px] text-gray-500 font-light mb-1">
              Application ID
            </p>
            <h3 className="text-2xl font-medium tracking-tighter text-gray-900">
              APP001
            </h3>
          </div>
          <span className="bg-orange-50 text-[#E25822] px-6 py-2 rounded-full text-[13px] font-medium border border-orange-100">
            Pending
          </span>
        </div>

        <hr className="border-gray-200 mb-10 shadow-2xl" />

        <div className="rounded-[32px] mb-10">
          <div className="text-[16px] text-gray-500 font-medium mb-6">
            Groomer Information
          </div>
          <div className="bg-[#F9FAFB] rounded-lg flex flex-wrap gap-x-20 gap-y-2 pl-6 pt-6 pb-3 border border-gray-100">
            <div>
              <InfoBox label="Full Name" value="Rachel Martinez" />
              <InfoBox label="Email" value="rachel.m@email.com" />
              <InfoBox
                label="Service Area"
                value="Manhattan, New York"
                icon={<MapPin size={16} className="text-[#E25822]" />}
              />
            </div>
            <div>
              <InfoBox
                label="Experience"
                value="5 years"
                icon={<Briefcase size={16} className="text-[#E25822]" />}
              />
              <InfoBox label="Phone" value="+1 555 123 4567" />
            </div>
          </div>
        </div>

        <hr className="text-gray-200 mb-7" />

        <div className="space-y-4">
          <p className="text-[15px] text-gray-500 font-medium mb-5">
            KYC Documents & Service Location
          </p>

          <DocItem
            label="ID Proof"
            file="driver_license_rachel.jpg"
            onView={() => handleViewFile("driver_license_rachel.jpg")}
          />

          <div className="relative group">
            <div
              onClick={handleOpenLiveLocation}
              className="w-full h-64 bg-gray-100 rounded-[10px] overflow-hidden border border-gray-200 relative cursor-pointer group active:scale-[0.99] transition-transform"
            >
              <img
                src={mapSource}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                alt="Service Area Map"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                <div className="bg-white/90 backdrop-blur px-4 py-2 rounded-full shadow-lg border border-gray-200 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
                  <MapPin size={16} className="text-[#E25822]" />
                  <span className="text-xs font-bold text-gray-800">
                    Open Live Location
                  </span>
                </div>
              </div>
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1.5 rounded-lg shadow-sm border border-gray-200 flex items-center gap-2">
                <MapPin size={14} className="text-[#E25822]" />
                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-700">
                  Live Service Location
                </span>
              </div>
            </div>
          </div>

          <DocItem
            label="Certifications"
            file="pet_grooming_certificate.pdf"
            onView={() => handleViewFile("pet_grooming_certificate.pdf")}
          />
          <DocItem
            label="Business License"
            file="grooming_business_license.pdf"
            onView={() => handleViewFile("grooming_business_license.pdf")}
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mt-14 justify-start">
          <button
            onClick={onApproveSuccess}
            className="flex items-center justify-center sm:justify-start gap-2.5 bg-green-500 text-white px-5 py-3 rounded-xl font-medium text-sm hover:bg-green-600 transition-all cursor-pointer shadow-sm active:scale-95 w-full sm:w-auto"
          >
            <CheckCircle size={19} className="text-white" strokeWidth={2} />
            <span className="tracking-tight">Approve Application</span>
          </button>
          <button
            onClick={onRejectClick}
            className="flex items-center justify-center sm:justify-start gap-2.5 bg-red-500 text-white px-5 py-3 rounded-xl font-medium text-sm hover:bg-red-700 transition-all cursor-pointer shadow-sm active:scale-95 w-full sm:w-auto"
          >
            <XCircle size={19} className="text-white" strokeWidth={2} />
            <span className="tracking-tight">Reject Application</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const InfoBox: React.FC<{
  label: string;
  value: string;
  icon?: React.ReactNode;
}> = ({ label, value, icon }) => (
  <div className="mb-5">
    <p className=" text-gray-600 font-light text-[15px] tracking-tight mb-1">
      {label}
    </p>
    <p className="text-[15px] font-medium text-black flex items-center gap-2 tracking-normal">
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
    className="flex items-center justify-between p-5 bg-white rounded-lg cursor-pointer shadow-sm border border-transparent hover:border-[#E25822]/20 hover:bg-gray-50 transition-all active:scale-[0.99]"
  >
    <div className="flex items-center gap-4">
      <div className="p-3 bg-gray-50 rounded-md text-gray-400 group-hover:bg-white">
        <FileText size={22} />
      </div>
      <div>
        <p className="text-[15px] text-black font-medium mb-0.5">{label}</p>
        <p className="text-md font-light text-gray-500">{file}</p>
      </div>
    </div>
    <button className="text-md font-light text-black flex items-center gap-1 hover:text-[#E25822] cursor-pointer">
      View <ChevronDown size={18} />
    </button>
  </div>
);

export default ReviewDetail;
