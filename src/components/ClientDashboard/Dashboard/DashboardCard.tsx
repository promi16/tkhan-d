import { FaArrowUp } from "react-icons/fa";

import activestaff from "@/assets/Logo/activestaff.svg";
import totalpatients from "@/assets/Logo/totalpatients.svg";
import warningerror from "@/assets/Logo/warningerror.svg";
import success from "@/assets/Logo/success.svg";

const DashboardCard = () => {
  const statusData = [
    {
      title: "Active Staff",
      amount: "23",
      change: "30",
      unit: "Total",
      icon: activestaff,
    },
    {
      title: "Total Patients",
      amount: "148",
      change: "",
      unit: "Patients",
      icon: totalpatients,
    },
    {
      title: "CRITICAL: Unsigned Notes",
      amount: "7",
      change: "",
      unit: "Notes Pending Signature",
      icon: warningerror,
    },
    {
      title: "Last Audit",
      amount: "Successful",
      change: "2",
      unit: "hours ago",
      icon: success,
    },
  ];

  const colors = ["#767676", "#767676", "#F3AA4B", "#4CAF50"];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5 w-full">
      {statusData.map((single, index) => {
        const isNegative = single.change.includes("-");
        const changeColor = isNegative ? "#E35A5F" : "#12CC1E";

        let amountColor = "#000000";
        if (single.amount === "Successful") amountColor = "#4CAF50";
        if (single.amount === "7") amountColor = "#F3AA4B";

        return (
          <div
            key={single.title}
            className="w-full h-[198px] p-5 sm:p-6 bg-white rounded-[16px] flex flex-col justify-between shadow-sm space-y-4"
          >
            <div className="space-y-2">
              <div className="bg-[#F9F8F6] border-[#F6F4F2] w-[48px] h-[48px] rounded-[12px] p-[12px] flex items-center justify-center">
                <img
                  src={single.icon}
                  alt={single.title}
                  className="w-6 h-6 object-contain"
                />
              </div>

              <h1
                className="text-[18px] leading-[160%] font-sans font-medium"
                style={{ color: colors[index] }}
              >
                {single.title}
              </h1>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-start">
                <h2
                  className="text-xl sm:text-2xl md:text-3xl font-semibold font-Robot tracking-[-0.68px]"
                  style={{ color: amountColor }}
                >
                  {single.amount}
                </h2>
              </div>

              <div className="flex items-center justify-start gap-1 text-sm font-Robot">
                {single.change && (
                  <>
                    <FaArrowUp
                      style={{
                        color: changeColor,
                        transform: isNegative ? "rotate(180deg)" : "none",
                      }}
                    />
                    <span style={{ color: changeColor }}>{single.change}</span>
                  </>
                )}
                <span className="text-[#767676] ml-1">{single.unit}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DashboardCard;
