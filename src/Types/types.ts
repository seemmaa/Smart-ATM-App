export type UserInfo = {
  id: number;
  user_name: string;
  first_name: string;
  last_name: string;
  pin: string;
  balance: number;
  birthday: Date;
  profile_img: string;
};

export interface AuthState {
  user: UserInfo | null;
  isAuth: boolean;
  login: (userData: UserInfo) => void;
  logout: () => void;
}

export type balanceStore = {
  balance: number | string;
  isLoadingBalance: boolean;
  errorMsg: string;
  getUserBalance: () => void;
  setBalance: (b: number) => void;
};

export interface TransactionType {
  processType: "Deposit" | "Withdraw";
  onConfirm: (amount: number) => Promise<void>;
  icon: React.ElementType;
}

export interface ToastProps {
  type?: "success" | "error";
  children: React.ReactNode;
  duration?: number;
  onClose?: () => void;
}

export type popUpType = {
  amount: number;
  onConfirm: () => void;
  onClose: () => void;
  processType: string;
  isLoading: boolean;
};
