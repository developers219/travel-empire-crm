import { Bell } from "lucide-react";
import { ROLE_LABELS } from "../../config/menu.js";
import { useAuth } from "../../hooks/useAuth.js";

const getInitials = (name = "") =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join("");

export default function Topbar() {
  const { user } = useAuth();

  return (
    <header className="flex h-16 shrink-0 items-center justify-end gap-4 border-b border-line bg-white px-6">
      <button
        className="flex h-10 w-10 items-center justify-center rounded-control border border-line text-muted"
        aria-label="Notifications"
      >
        <Bell size={18} />
      </button>

      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-tint text-xs font-bold text-brand-dark">
          {getInitials(user.fullName)}
        </span>
        <div>
          <p className="text-[14px] font-semibold leading-tight">
            {user.fullName}
          </p>
          <p className="text-[12px] text-muted">{ROLE_LABELS[user.role]}</p>
        </div>
      </div>
    </header>
  );
}
