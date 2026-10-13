import { X } from "lucide-react";

export default function Modal({
  title,
  subtitle,
  onClose,
  wide = false,
  children,
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        className={`max-h-[90vh] w-full overflow-y-auto rounded-card bg-white shadow-xl ${
          wide ? "max-w-2xl" : "max-w-md"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between border-b border-line p-5">
          <div>
            <h2 className="text-[20px] font-bold">{title}</h2>
            {subtitle && <p className="text-[13px] text-muted">{subtitle}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-muted hover:text-body"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}
