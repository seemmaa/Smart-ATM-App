import { create } from "zustand";
import { useAuthStore } from "./authSContext";
import type { balanceStore } from "../Types/types";

const BASE_URL = "https://69060c47ee3d0d14c134982d.mockapi.io";

export const useBalanceStore = create<balanceStore>((set) => ({
  balance: 0,
  isLoadingBalance: true,
  errorMsg  : "",
  getUserBalance: async () => {
    const userId = useAuthStore.getState().user?.id;
    if (!userId) return;
    try {
      const res = await fetch(`${BASE_URL}/users/${userId}`);
      const userData = await res.json();
      const userBalance = userData.balance;
      set({ balance: userBalance });
    } catch {
      set({ errorMsg : "There is an error in fetching Balance , try again" , balance : "-"})
    } finally {
      set({ isLoadingBalance: false });
    }
  },

  setBalance: async (newBalance: number) => {
    const user = useAuthStore.getState().user;
    set({ balance: newBalance });
    try {
      await fetch(`${BASE_URL}/users/${user?.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ balance: newBalance }),
      });
    } catch {
      set({ errorMsg : "There is an error in updating Balance , try again"})
    } finally {
      set({ isLoadingBalance: false });
    }
  },
}));
