import { useEffect, useState, type FormEvent } from "react";
import Message from "../Component/Message";
import PopUp from "../Component/PopUp";
import Toast from "../Component/Toast";
import type { TransactionType } from "../Types/types";
import { useBalanceStore } from "../Context/balanceContext";

export default function TransactionForm({
  processType,
  onConfirm,
  icon: Icon,
}: TransactionType) {
  const [amount, setAmount] = useState("");
  const [warningMsg, setWarningMsg] = useState("");
  const [showPopUp, setShowPopUp] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");
  const { getUserBalance, balance, isLoadingBalance, errorMsg } =
    useBalanceStore();

  useEffect(() => {
    getUserBalance();
  }, [getUserBalance]);

  function handleAction(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const num = Number(amount);
    if (!amount)
      return setWarningMsg(`Enter a value to ${processType.toLowerCase()}`);
    if (isNaN(num)) return setWarningMsg("Value must be a number");
    if (num <= 0) return setWarningMsg("Enter a positive value");
    if (processType === "Withdraw" && num > Number(balance))
      return setWarningMsg("Insufficient balance");

    setWarningMsg("");
    setShowPopUp(true);
  }

  async function handleConfirm() {
    setIsProcessing(true);
    try {
      await onConfirm(Number(amount));
      setToastType("success");
      setToastMsg(`${processType} completed successfully!`);
      setAmount("");
    } catch (error) {
      setToastType("error");
      if (error instanceof Error) {
        const msg = error.message || "";

        if (msg.includes("Max number of elements reached")) {
          setToastMsg(
            "⚠️ You have reached the maximum limit allowed by the mock API."
          );
        } else {
          setToastMsg(msg || "Something went wrong. Try again!");
        }
      } else {
        setToastMsg("Something went wrong. Try again!");
      }
    } finally {
      setIsProcessing(false);
      setShowPopUp(false);
    }
  }

  function HandleClosePopUp() {
    setShowPopUp(false);
    setAmount("");
    setIsProcessing(false);
  }

  return (
    <div className="h-screen text-gray-900 flex items-center justify-center px-4 overflow-hidden">
      <div className="bg-white w-full max-w-md max-h-full rounded-2xl shadow-lg p-8 border border-gray-200 overflow-auto">
        <h2 className="flex items-center justify-center gap-2 text-2xl font-semibold text-gray-800 mb-6">
          <Icon className="w-6 h-6 text-gray-800" />
          <span>{processType} Money</span>
        </h2>

        <div className="relative overflow-hidden bg-gray-100 p-4 rounded-xl mb-6 text-center border border-gray-200">
          <h3 className="text-gray-500 text-sm">Current Balance</h3>
          {isLoadingBalance ? (
            <div className="relative h-16 mt-2 rounded-xl overflow-hidden">
              <div className="absolute inset-0 bg-gray-200"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer"></div>
            </div>
          ) : (
            <p className="text-3xl font-bold text-blue-600 mt-2">
              {isNaN(Number(balance)) ? balance : Number(balance).toFixed(2)}{" "}
              ILS
            </p>
          )}
        </div>

        {!isNaN(Number(balance)) && (
          <form className="space-y-4 " onSubmit={handleAction}>
            <input
              type="text"
              placeholder="Enter the amount"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                setWarningMsg("");
              }}
              style={{
                width: "100%",
                padding: "0.5rem 1rem",
                borderRadius: "0.5rem",
                backgroundColor: "#f3f4f6",
                color: "#1f2937",
                border: "1px solid #d1d5db",
                outline: "none",
                fontSize: "1rem",
              }}
            />
            <button
              disabled={isProcessing}
              className="w-full py-2.5 rounded-lg font-semibold transition-all duration-300 bg-gray-900 text-white hover:bg-black shadow-md hover:shadow-lg disabled:opacity-50"
            >
              {processType}
            </button>
          </form>
        )}

        {warningMsg && (
          <div className="mt-4">
            <Message content={warningMsg} />
          </div>
        )}

        {showPopUp && (
          <PopUp
            amount={Number(amount)}
            onConfirm={handleConfirm}
            onClose={HandleClosePopUp}
            processType={processType}
            isLoading={isProcessing}
          />
        )}

        {toastMsg && (
          <Toast type={toastType} onClose={() => setToastMsg("")}>
            {toastMsg}
          </Toast>
        )}

        {errorMsg && <Message content={errorMsg} />}
      </div>
    </div>
  );
}
