const VARIANTS = {
  primary: "bg-brand text-white border border-transparent hover:bg-brand-dark",
  secondary: "bg-white text-body border border-line hover:bg-page",
  danger: "bg-white text-danger border border-danger/30 hover:bg-danger/5",
};

const SIZES = {
  md: "h-10 px-4 text-sm",
  sm: "h-8 px-3 text-[13px]",
};

export default function Button({
  variant = "primary",
  size = "md",
  className = "",
  ...props
}) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-control font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...props}
    />
  );
}
