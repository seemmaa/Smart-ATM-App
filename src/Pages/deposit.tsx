import { useEffect } from "react";
import { useBalanceStore } from "../Context/balanceContext";
import { useAuthStore } from "../Context/authSContext";
import { BanknoteArrowUp } from "lucide-react";
import TransactionForm from "../Component/TransactionForm";

function Deposit() {
  const { balance, getUserBalance, setBalance } = useBalanceStore();
  const { user } = useAuthStore();
  const userId = user?.id;

  useEffect(function () {
    getUserBalance();
  }, []);

  async function handleDeposit(amount: number) {
    const balanceAfterDeposit = Number(balance) + amount;
    const res = await fetch(
      `https://69060c47ee3d0d14c134982d.mockapi.io/users/${userId}/transactions`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "deposit",
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
    setBalance(balanceAfterDeposit);
  }

  return (
    <TransactionForm
      processType="Deposit"
      onConfirm={handleDeposit}
      icon={BanknoteArrowUp}
    />
  );
}

export default Deposit;
