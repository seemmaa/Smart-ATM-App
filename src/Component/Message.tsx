import { AlertCircle } from "lucide-react";

function Message({ content }: { content: string }) {
  {
    console.log(content);
  }
  return (
    <div className="flex items-center gap-3 mt-4 bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-xl shadow-sm transition-all duration-200 animate-fadeIn">
      <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
      <p className="text-sm font-medium">{content}</p>
    </div>
  );
}

export default Message;
