const TONES = {
  warning: "bg-warn-bg text-warn-text",
  success: "bg-st-won/10 text-st-won",
  info: "bg-st-new/10 text-st-new",
  neutral: "bg-line/60 text-muted",
};

export default function Badge({ tone = "neutral", children }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${TONES[tone]}`}
    >
      {children}
    </span>
  );
}
