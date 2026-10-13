import { NavLink } from "react-router-dom";
import { LogOut, Plane } from "lucide-react";
import { MENU } from "../../config/menu.js";
import { useAuth } from "../../hooks/useAuth.js";

function MenuLink({ item }) {
  const Icon = item.icon;
  return (
    <NavLink
      to={item.to}
      className={({ isActive }) =>
        `flex items-center gap-3 rounded-control px-3 py-2.5 text-[14px] font-semibold transition-colors ${
          isActive
            ? "bg-white/10 text-white"
            : "text-white/65 hover:bg-white/5 hover:text-white"
        }`
      }
    >
      <Icon size={18} />
      {item.label}
    </NavLink>
  );
}

export default function Sidebar() {
  const { user, logout } = useAuth();
  const allowed = MENU.filter((item) => item.roles.includes(user.role));
  const mainItems = allowed.filter((item) => !item.section);
  const adminItems = allowed.filter((item) => item.section === "admin");

  return (
    <aside className="flex h-full w-[216px] shrink-0 flex-col bg-ink p-3 text-white">
      <div className="mb-6 flex items-center gap-3 px-2 pt-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-control bg-brand">
          <Plane size={18} />
        </span>
        <div>
          <p className="font-bold leading-tight">Travel Empire</p>
          <p className="text-[12px] text-white/60">CRM</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1">
        {mainItems.map((item) => (
          <MenuLink key={item.to} item={item} />
        ))}

        {adminItems.length > 0 && (
          <>
            <p className="px-3 pb-1 pt-5 text-[12px] font-semibold text-white/45">
              Admin
            </p>
            {adminItems.map((item) => (
              <MenuLink key={item.to} item={item} />
            ))}
          </>
        )}
      </nav>

      <button
        onClick={logout}
        className="flex items-center gap-3 border-t border-white/10 px-3 pt-4 text-[14px] font-semibold text-white/65 hover:text-white"
      >
        <LogOut size={18} />
        Sign out
      </button>
    </aside>
  );
}
