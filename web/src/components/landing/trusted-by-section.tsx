const protections = [
  "Gmail & Outlook",
  "iPhone & Android",
  "Chrome & Safari",
  "Amazon & eBay",
  "190+ Data Brokers",
  "All Major Banks",
];

export function TrustedBySection() {
  return (
    <section className="py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-center text-xs font-medium uppercase tracking-widest text-zinc-600">
          Monitors threats across your digital life
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
          {protections.map((item) => (
            <span
              key={item}
              className="text-sm font-semibold text-zinc-500 transition-colors hover:text-zinc-300"
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
