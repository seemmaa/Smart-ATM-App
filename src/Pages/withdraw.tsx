import { useBalanceStore } from "../Context/balanceContext";
import { useAuthStore } from "../Context/authSContext";
import { BanknoteArrowDown } from "lucide-react";
import TransactionForm from "../Component/TransactionForm";
import { useEffect } from "react";

function Withdraw() {
  const { getUserBalance, balance, setBalance } = useBalanceStore();
  const { user } = useAuthStore();
  const userId = user?.id;

  useEffect(() => {
    getUserBalance();
  }, [getUserBalance]);

  async function handleWithdraw(amount: number) {
    const balanceAfterWithdraw = Number(balance) - amount;

    const res = await fetch(
      `https://69060c47ee3d0d14c134982d.mockapi.io/users/${userId}/transactions`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "withdraw",
          amount: amount,
          currency: "ILS",
          date: new Date().toDateString(),
        }),
      }
    );

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText);
    }
    setBalance(balanceAfterWithdraw);
  }

  return (
    <TransactionForm
      processType="Withdraw"
      onConfirm={handleWithdraw}
      icon={BanknoteArrowDown}
    />
  );
}

export default Withdraw;
