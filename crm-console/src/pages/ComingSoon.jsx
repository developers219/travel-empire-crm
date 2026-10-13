export default function ComingSoon({ title }) {
  return (
    <div className="mx-auto max-w-6xl p-6">
      <h1 className="text-[26px] font-bold">{title}</h1>
      <div className="mt-6 rounded-card border border-line bg-white p-10 text-center text-muted">
        This screen is coming soon.
      </div>
    </div>
  );
}
