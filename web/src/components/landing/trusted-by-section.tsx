const brokers = [
  "Robinhood",
  "Webull",
  "Fidelity",
  "Charles Schwab",
  "TD Ameritrade",
  "E*TRADE",
  "Interactive Brokers",
];

export function TrustedBySection() {
  return (
    <section className="py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-center text-xs font-medium uppercase tracking-widest text-zinc-600">
          Works alongside any broker
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
          {brokers.map((broker) => (
            <span
              key={broker}
              className="text-sm font-semibold text-zinc-500 transition-colors hover:text-zinc-300"
            >
              {broker}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
