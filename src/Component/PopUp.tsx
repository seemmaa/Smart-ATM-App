import type { popUpType } from "../Types/types";

function PopUp({
  amount,
  onConfirm,
  onClose,
  processType,
  isLoading,
}: popUpType) {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-gray-900/40 backdrop-blur-sm z-50"
      onClick={onClose}
    >
      <div
        className="bg-white w-[90%] max-w-md p-6 rounded-2xl shadow-xl border border-gray-100 animate-fadeIn text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-xl font-semibold text-gray-800 mb-3">
          Confirm {processType}
        </h3>

        <p className="text-gray-600 mb-6">
          Are you sure you want to{" "}
          <span className="font-medium text-blue-600">{processType}</span>{" "}
          <span className="font-semibold text-blue-600">{amount} ILS</span> into
          your account?
        </p>

        <div className="flex justify-center gap-4">
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-6 py-2.5 rounded-lg font-medium transition-all duration-300 shadow-sm
              ${
                isLoading
                  ? "bg-blue-300 text-white cursor-not-allowed animate-pulse"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
          >
            {isLoading ? `${processType} ${amount} ILS...` : "OK"}
          </button>

          <button
            onClick={onClose}
            disabled={isLoading}
            className={`px-6 py-2.5 rounded-lg font-medium border transition-all duration-300
              ${
                isLoading
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-rose-50 text-rose-600 border-rose-200 hover:bg-rose-100"
              }`}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default PopUp;
