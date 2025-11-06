import { useEffect, useState } from "react";
import { useBalanceStore } from "../Context/balanceContext";
import Message from "../Component/Message";
import { useAuthStore } from "../Context/authSContext";
import PopUp from "../Component/PopUp";
import { BanknoteArrowDown } from "lucide-react";
import Toast from "../Component/Toast";

const BASE_URL = "https://69060c47ee3d0d14c134982d.mockapi.io";

function Withdraw() {
  const { getUserBalance, balance, setBalance, isLoadingBalance, errorMsg } =
    useBalanceStore();
  const { user } = useAuthStore();
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [warningMsg, setWarningMsg] = useState("");
  const [showPopUp, setShowPopUp] = useState(false);
  const [isLoadingWithdraw, setIsLoadingWithdraw] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");
  const userId = user?.id;

  useEffect(() => {
    getUserBalance();
  }, []);

  function handleWithdraw() {
    if (withdrawAmount === "")
      return setWarningMsg("Enter a value to withdraw");
    if (isNaN(Number(withdrawAmount)))
      return setWarningMsg("value should be a number");
    if (Number(withdrawAmount) <= 0)
      return setWarningMsg("value should be a positive number");
    if (Number(withdrawAmount) > Number(balance))
      return setWarningMsg("Insufficient balance");

    setWarningMsg("");
    setShowPopUp(true);
  }

  async function UpdateBalanceWithWithdrawAmount() {
    setIsLoadingWithdraw(true);
    const balanceAfterWithdraw = Number(balance) - Number(withdrawAmount);

    try {
      const res = await fetch(`${BASE_URL}/users/${userId}/transactions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "withdraw",
          amount: Number(withdrawAmount),
          currency: "ILS",
          date: new Date().toDateString(),
        }),
      });

      if (!res.ok) throw new Error("Withdraw failed");

      setBalance(balanceAfterWithdraw);
      setToastType("success");
      setToastMsg("Withdrawal completed successfully!");
    } catch {
      setToastType("error");
      setToastMsg("Something went wrong. Try again!");
    } finally {
      setIsLoadingWithdraw(false);
      setShowPopUp(false);
    }
  }

  function HandleClosePopUp() {
    setShowPopUp(false);
    setWithdrawAmount("");
    setIsLoadingWithdraw(false);
  }

  return (
    <div className="h-screen text-gray-900 flex items-center justify-center px-4 overflow-hidden">
      <div className="bg-white w-full max-w-md max-h-full rounded-2xl shadow-lg p-8 border border-gray-200 overflow-auto">
        <h2 className="flex items-center justify-center gap-2 text-2xl font-semibold text-gray-800 mb-6">
          <BanknoteArrowDown className="w-6 h-6 text-gray-800" />
          <span>Withdraw Money</span>
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

        {isNaN(Number(balance)) ? null : (
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Enter the amount"
              value={withdrawAmount}
              onChange={(e) => {
                setWithdrawAmount(e.target.value);
                setWarningMsg("");
              }}
              className="w-full px-4 py-2 rounded-lg bg-gray-100 text-gray-800 placeholder-gray-400 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
            />

            <button
              onClick={handleWithdraw}
              className={`w-full py-2.5 rounded-lg font-semibold transition-all duration-300
         bg-gray-900 text-white hover:bg-black shadow-md hover:shadow-lg`}
            >
              {"Withdraw"}
            </button>
          </div>
        )}

        {warningMsg && (
          <div className="mt-4">
            <Message content={warningMsg} />
          </div>
        )}

        {showPopUp && (
          <PopUp
            amount={Number(withdrawAmount)}
            onConfirm={UpdateBalanceWithWithdrawAmount}
            onClose={HandleClosePopUp}
            processType={"Withdraw"}
            isLoadingDeposit={isLoadingWithdraw}
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

export default Withdraw;
