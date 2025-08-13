import { XCircle, CheckCircle, AlertTriangle } from "lucide-react";

interface CustomDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  type?: "warning" | "success" | "error";
  mode?: "confirm" | "alert"; // confirm= two buttons, alert= one button
  onConfirm?: () => void; // function to perform when user presses confirm
  onCancel: () => void; // function to perform when user presses cancel
}

export default function CustomDialog({
  isOpen,
  title,
  message,
  type = "warning",
  mode = "confirm",
  onConfirm,
  onCancel,
}: CustomDialogProps) {
  // Do not render anything if the dialog is closed
  if (!isOpen) return null;

  // Map dialog type to its corresponding icon
  const iconMap = {
    success: <CheckCircle className="w-8 h-8 text-green-600" />,
    error: <XCircle className="w-8 h-8 text-red-600" />,
    warning: <AlertTriangle className="w-8 h-8 text-yellow-500" />,
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      {/* Dialog box */}
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 space-y-4">
        {/* Header with icon and title */}
        <div className="flex items-center gap-4">
          {iconMap[type]}
          <h2 className="text-xl font-semibold">{title}</h2>
        </div>
        {/* Message content */}
        <p className="text-gray-700">{message}</p>
         {/* Buttons based on mode */}
        <div className="flex justify-end gap-4 mt-6">
          {mode === "confirm" && (
            <>
              <button
                onClick={onCancel}
                className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition cursor-pointer"
              >
                Confirm
              </button>
            </>
          )}

          {mode === "alert" && (
            <button
              onClick={onCancel}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition cursor-pointer"
            >
              OK
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
