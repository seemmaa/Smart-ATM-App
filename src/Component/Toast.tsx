import { useEffect, useState } from "react";
import { CheckCircle, XCircle } from "lucide-react";
import type { ToastProps } from "../Types/types";

const toastStyle = {
  success: "bg-green-50 text-green-800 border-green-200",
  error: "bg-red-50 text-red-800 border-red-200",
};

function Toast({
  type = "success",
  children,
  duration = 3000,
  onClose,
}: ToastProps) {
  const Icon = {
    success: CheckCircle,
    error: XCircle,
  }[type];
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onClose?.();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!visible) return null;

  return (
    <div className="fixed top-5 right-5 z-50 animate-fadeInOut">
      <div
        className={`flex items-center gap-3 px-4 py-2 rounded-lg border shadow-md ${toastStyle[type]}`}
      >
        <Icon className="w-5 h-5 flex-shrink-0" />
        <p className="text-sm font-medium">{children}</p>
      </div>
    </div>
  );
}

export default Toast;
