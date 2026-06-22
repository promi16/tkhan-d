import { useState } from "react";
import { motion } from "framer-motion";
import { X, CheckCircle, XCircle, Loader2, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import {
  useApproveWithdrawalRequestMutation,
  useRejectWithdrawalRequestMutation,
  useMarkWithdrawalRequestPaidMutation,
} from "@/redux/features/payout/payoutApi";
import { WithdrawalRequest } from "@/redux/features/payout/payoutTypes";

type WithdrawalStatus = "REQUESTED" | "APPROVED" | "REJECTED" | "PAID";

interface PayoutRequestDetailsProps {
  onBack: () => void;
  data: WithdrawalRequest;
}

const statusConfig: Record<
  WithdrawalStatus,
  { bg: string; text: string; label: string }
> = {
  REQUESTED: { bg: "bg-[#FFF0EA]", text: "text-[#FF6A39]", label: "Pending" },
  APPROVED: { bg: "bg-green-100", text: "text-green-700", label: "Approved" },
  REJECTED: { bg: "bg-red-100", text: "text-red-700", label: "Rejected" },
  PAID: { bg: "bg-blue-100", text: "text-blue-700", label: "Paid" },
};

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[12px] md:text-[13px] font-medium text-[#6B7280] mb-3">
      {children}
    </p>
  );
}

function InfoGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-[#F9FAFB] rounded-xl p-4 md:p-5 grid grid-cols-2 gap-x-4 md:gap-x-12 gap-y-4 md:gap-y-5">
      {children}
    </div>
  );
}

function InfoCell({
  label,
  value,
  valueClass = "text-[#111827] font-medium text-[14px] md:text-[15px]",
}: {
  label: string;
  value: React.ReactNode;
  valueClass?: string;
}) {
  return (
    <div className="flex flex-col gap-1 min-w-0 break-words">
      <span className="text-[11px] md:text-[13px] text-[#9CA3AF] font-medium">
        {label}
      </span>
      <span className={valueClass}>{value ?? "—"}</span>
    </div>
  );
}

export const PayoutRequestDetails = ({
  onBack,
  data,
}: PayoutRequestDetailsProps) => {
  const [noteInput, setNoteInput] = useState("");
  const [reasonInput, setReasonInput] = useState("");
  const [transferRef, setTransferRef] = useState("");
  const [activeAction, setActiveAction] = useState<
    "approve" | "reject" | "mark-paid" | null
  >(null);

  const [approve, { isLoading: approving }] =
    useApproveWithdrawalRequestMutation();
  const [reject, { isLoading: rejecting }] =
    useRejectWithdrawalRequestMutation();
  const [markPaid, { isLoading: markingPaid }] =
    useMarkWithdrawalRequestPaidMutation();

  const isActionable = data.status === "REQUESTED";
  const isApprovable = data.status === "APPROVED";
  const statusStyle = statusConfig[data.status] ?? statusConfig.REQUESTED;

  const groomerUnknown = data.groomer as unknown as Record<string, unknown>;
  const dataUnknown = data as unknown as Record<string, unknown>;

  const groomerName =
    data.groomer?.user?.fullName ?? data.groomer?.legalFullName ?? "—";
  const groomerId =
    (groomerUnknown?.groomerId as string) ?? data.groomer?.id ?? "—";
  const completedBookings =
    (groomerUnknown?.completedBookingsCount as number) ??
    data.items?.length ??
    0;
  const totalEarnings =
    (groomerUnknown?.totalEarnings as number | string) ??
    Number(data.amountRequested) * 2;

  const handleApprove = async () => {
    try {
      await approve({
        id: data.id,
        note: noteInput || undefined,
      }).unwrap();
      toast.success("Withdrawal request approved!");
      setActiveAction(null);
      onBack();
    } catch {
      toast.error("Failed to approve request.");
    }
  };

  const handleReject = async () => {
    if (!reasonInput.trim()) {
      toast.error("Please provide a rejection reason.");
      return;
    }
    try {
      await reject({
        id: data.id,
        reason: reasonInput,
      }).unwrap();
      toast.error("Withdrawal request rejected.");
      setActiveAction(null);
      onBack();
    } catch {
      toast.error("Failed to reject request.");
    }
  };

  const handleMarkPaid = async () => {
    if (!transferRef.trim()) {
      toast.error("Please provide a transfer reference.");
      return;
    }
    try {
      await markPaid({
        id: data.id,
        transferReference: transferRef,
        note: noteInput || undefined,
      }).unwrap();
      toast.success("Marked as paid!");
      setActiveAction(null);
      onBack();
    } catch {
      toast.error("Failed to mark as paid.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.25 }}
      className="font-['Inter',_sans-serif] w-full max-w-[896px] mx-auto lg:mx-0 lg:ml-5 py-6 px-4"
    >
      <div className="mb-6">
        <button
          onClick={onBack}
          className="text-[#9CA3AF] cursor-pointer hover:text-[#111827] transition-colors mb-3 p-1 -ml-1 inline-flex items-center"
        >
          <ArrowLeft className="cursor-pointer" size={20} />
        </button>
        <h1 className="text-[16px] md:text-[18px] font-medium text-[#111827]">
          Payout Request Details
        </h1>
      </div>

      <div className="bg-white rounded-2xl border border-[#EDF0F4] shadow-[0_4px_20px_rgba(0,0,0,0.02)] overflow-hidden w-full">
        <div className="flex items-center justify-between px-4 md:px-6 py-4 md:py-5 bg-white">
          <span className="text-[14px] md:text-[16px] font-medium text-[#111827]">
            Payout Request Details
          </span>
          <button
            onClick={onBack}
            className="text-[#9CA3AF] hover:text-[#111827] transition-colors p-1"
          >
            <X size={18} />
          </button>
        </div>

        <hr className="border-[#EDF0F4] mx-4 md:mx-6" />

        <div className="p-4 md:p-6 space-y-5 md:space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] md:text-[13px] text-[#9CA3AF] font-medium mb-1">
                Request ID
              </p>
              <p className="text-[14px] md:text-[16px] font-medium text-[#111827]">
                {data.id.startsWith("PR")
                  ? data.id
                  : `PR-${data.id.slice(0, 6).toUpperCase()}`}
              </p>
            </div>
            <span
              className={`text-[11px] md:text-[12px] font-medium px-2.5 md:px-3 py-1 rounded-full ${statusStyle.bg} ${statusStyle.text}`}
            >
              {statusStyle.label}
            </span>
          </div>

          <div>
            <SectionLabel>Groomer Profile</SectionLabel>
            <InfoGrid>
              <InfoCell label="Name" value={groomerName} />
              <InfoCell label="Groomer ID" value={groomerId} />
              <InfoCell label="Completed Bookings" value={completedBookings} />
              <InfoCell
                label="Total Earnings"
                value={`$${Number(totalEarnings).toLocaleString()}`}
                valueClass="text-[#22C55E] font-medium text-[14px] md:text-[15px]"
              />
            </InfoGrid>
          </div>

          <div className="space-y-4">
            <SectionLabel>Payout Information</SectionLabel>

            <div className="bg-[#FFF2EE] rounded-xl p-4 md:p-5">
              <p className="text-[11px] md:text-[13px] text-[#9CA3AF] font-medium mb-1">
                Requested Amount
              </p>
              <p className="text-[26px] md:text-[32px] font-medium text-[#FF6A39]">
                ${Number(data.amountRequested).toLocaleString()}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-x-4 md:gap-x-12 px-1">
              <InfoCell
                label="Payment Method"
                value={
                  (dataUnknown?.paymentMethod as string) ?? "Bank Transfer"
                }
              />
              <InfoCell
                label="Request Date"
                value={
                  data.requestedAt
                    ? new Date(data.requestedAt).toLocaleDateString("en-CA")
                    : "—"
                }
              />
            </div>
          </div>

          <div>
            <SectionLabel>Account Details</SectionLabel>
            <div className="bg-[#F9FAFB] rounded-xl p-4 md:p-5">
              <div className="grid grid-cols-1 gap-4">
                <InfoCell
                  label="Account Holder"
                  value={data.bankAccount?.accountHolderName ?? "—"}
                />
                <InfoCell
                  label="Bank Name"
                  value={data.bankAccount?.bankName ?? "—"}
                />
                <InfoCell
                  label="Account Number"
                  value={
                    data.bankAccount?.accountNumber
                      ? `****${data.bankAccount.accountNumber.slice(-4)}`
                      : "—"
                  }
                />
              </div>
            </div>
          </div>

          {(activeAction === "approve" || activeAction === "mark-paid") && (
            <div className="pt-2">
              <label className="text-[11px] md:text-[12px] text-[#9CA3AF] font-medium mb-1.5 block">
                Admin Note (optional)
              </label>
              <input
                type="text"
                value={noteInput}
                onChange={(e) => setNoteInput(e.target.value)}
                placeholder="Add a note..."
                className="w-full border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-[13px] md:text-[14px] focus:outline-none focus:ring-2 focus:ring-orange-200 bg-white"
              />
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-end gap-2 md:gap-3 px-4 md:px-6 py-4 md:py-5 bg-white">
          {isActionable && !activeAction && (
            <>
              <button
                onClick={() => setActiveAction("approve")}
                className="flex items-center gap-1.5 md:gap-2 px-4 md:px-5 py-2 md:py-2.5 bg-[#00B074] hover:bg-[#009662] text-white cursor-pointer rounded-xl font-medium text-[13px] md:text-[14px] transition-colors shadow-sm"
              >
                <CheckCircle size={15} />
                Approve Payout
              </button>
              <button
                onClick={() => setActiveAction("reject")}
                className="flex items-center gap-1.5 md:gap-2 px-4 md:px-5 py-2 md:py-2.5 bg-[#E11D48] hover:bg-[#BE123C] text-white rounded-xl cursor-pointer font-medium text-[13px] md:text-[14px] transition-colors shadow-sm"
              >
                <XCircle size={15} />
                Reject Payout
              </button>
            </>
          )}

          {activeAction === "approve" && (
            <>
              <button
                onClick={handleApprove}
                disabled={approving}
                className="flex items-center gap-1.5 md:gap-2 px-4 md:px-5 py-2 md:py-2.5 bg-[#00B074] hover:bg-[#009662] disabled:opacity-60 text-white rounded-xl font-medium text-[13px] md:text-[14px] transition-colors"
              >
                {approving && <Loader2 size={13} className="animate-spin" />}
                Confirm Approve
              </button>
              <button
                onClick={() => {
                  setActiveAction(null);
                  setNoteInput("");
                }}
                className="px-4 md:px-5 py-2 md:py-2.5 border border-[#E5E7EB] text-[#6B7280] rounded-xl font-medium text-[13px] md:text-[14px] hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </>
          )}

          {activeAction === "reject" && (
            <div className="flex flex-col sm:flex-row items-center gap-2 w-full">
              <input
                type="text"
                value={reasonInput}
                onChange={(e) => setReasonInput(e.target.value)}
                placeholder="Rejection reason (required)"
                className="w-full sm:flex-1 border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-[13px] md:text-[14px] focus:outline-none focus:ring-2 focus:ring-red-300 bg-white"
              />
              <div className="flex items-center gap-2 w-full sm:w-auto justify-end shrink-0">
                <button
                  onClick={handleReject}
                  disabled={rejecting}
                  className="flex items-center gap-1.5 md:gap-2 px-4 md:px-5 py-2 md:py-2.5 bg-[#E11D48] hover:bg-[#BE123C] disabled:opacity-60 text-white rounded-xl font-medium text-[13px] md:text-[14px] transition-colors shrink-0"
                >
                  {rejecting && <Loader2 size={13} className="animate-spin" />}
                  Confirm
                </button>
                <button
                  onClick={() => {
                    setActiveAction(null);
                    setReasonInput("");
                  }}
                  className="px-4 py-2 md:py-2.5 border border-[#E5E7EB] text-[#6B7280] rounded-xl font-medium text-[13px] md:text-[14px] hover:bg-gray-50 transition-colors shrink-0"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {isApprovable && !activeAction && (
            <button
              onClick={() => setActiveAction("mark-paid")}
              className="flex items-center gap-1.5 md:gap-2 px-4 md:px-5 py-2 md:py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium text-[13px] md:text-[14px] transition-colors shadow-sm"
            >
              Mark as Paid
            </button>
          )}

          {activeAction === "mark-paid" && (
            <div className="flex flex-col sm:flex-row items-center gap-2 w-full">
              <input
                type="text"
                value={transferRef}
                onChange={(e) => setTransferRef(e.target.value)}
                placeholder="Transfer reference (required)"
                className="w-full sm:flex-1 border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-[13px] md:text-[14px] focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white"
              />
              <div className="flex items-center gap-2 w-full sm:w-auto justify-end shrink-0">
                <button
                  onClick={handleMarkPaid}
                  disabled={markingPaid}
                  className="flex items-center gap-1.5 md:gap-2 px-4 md:px-5 py-2 md:py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white rounded-xl font-medium text-[13px] md:text-[14px] transition-colors"
                >
                  {markingPaid && (
                    <Loader2 size={13} className="animate-spin" />
                  )}
                  Confirm
                </button>
                <button
                  onClick={() => {
                    setActiveAction(null);
                    setTransferRef("");
                    setNoteInput("");
                  }}
                  className="px-4 py-2 md:py-2.5 border border-[#E5E7EB] text-[#6B7280] rounded-xl font-medium text-[13px] md:text-[14px] hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {!isActionable && !isApprovable && !activeAction && (
            <span className="text-[13px] md:text-[14px] text-[#9CA3AF] italic">
              No actions available for this request.
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};
