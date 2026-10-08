import { Trash } from "lucide-react";

type DeleteModalProps = {
  isOpen: boolean;
  monitorName: string;
  onClose: () => void;
  onConfirm: () => void;
};

const DeleteModal = ({ isOpen, monitorName, onClose, onConfirm }: DeleteModalProps) => {
  // If the modal shouldn't be open, don't render anything
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#111111] text-[#F5F3EE] border border-[#FF5A5F]/30 rounded-[24px] max-w-md w-full p-6 sm:p-8 shadow-2xl space-y-5">
        <div>
          <div className="w-10 h-10 rounded-xl bg-[#FF5A5F]/15 border border-[#FF5A5F]/30 flex items-center justify-center text-[#FF5A5F] mb-3">
            <Trash size={16} strokeWidth={1.5} />
          </div>
          <h3 className="text-xl font-bold font-display text-[#F5F3EE]">
            Delete monitor?
          </h3>
          <p className="text-xs text-[#999999] mt-2 leading-relaxed">
            Are you sure you want to delete{" "}
            {/* Make the name dynamic based on props */}
            <strong className="text-[#F5F3EE]">{monitorName}</strong>? This
            action cannot be undone.
          </p>
        </div>
        <div className="pt-2 flex items-center justify-end gap-3 border-t border-white/[0.06]">
          {/* Attach the onClose function to the Cancel button */}
          <button 
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-[#888888] hover:text-white transition-colors"
          >
            Cancel
          </button>
          
          {/* Attach the onConfirm function to the Delete button */}
          <button 
            onClick={onConfirm}
            className="px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#FF5A5F] hover:bg-[#ff4349] text-white transition-all shadow-md shadow-[#FF5A5F]/20"
          >
            Delete Monitor
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;