import {
  Building2,
  CalendarCheck,
  LayoutDashboard,
  ShieldCheck,
  SlidersHorizontal,
  Target,
  UserCheck,
  Users,
} from "lucide-react";

const ALL = ["admin", "sales_manager", "sales_executive"];
const ADMIN = ["admin"];

export const MENU = [
  { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard, roles: ALL },
  { label: "Leads", to: "/leads", icon: Target, roles: ALL },
  { label: "Follow-ups", to: "/followups", icon: CalendarCheck, roles: ALL },
  { label: "Customers", to: "/customers", icon: Users, roles: ALL },
  { label: "Companies", to: "/companies", icon: Building2, roles: ALL },
  {
    label: "Settings",
    to: "/settings",
    icon: SlidersHorizontal,
    roles: ADMIN,
    section: "admin",
  },
  {
    label: "User access",
    to: "/users",
    icon: UserCheck,
    roles: ADMIN,
    section: "admin",
  },
  {
    label: "Audit logs",
    to: "/audit-logs",
    icon: ShieldCheck,
    roles: ADMIN,
    section: "admin",
  },
];

export const ROLE_LABELS = {
  admin: "CRM Admin",
  sales_manager: "Sales Manager",
  sales_executive: "Sales Executive",
};
