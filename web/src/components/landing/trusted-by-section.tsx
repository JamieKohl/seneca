const sources = [
  "FTC Consumer Database",
  "FBI IC3 Reports",
  "190+ Data Broker Registries",
  "Financial Institution APIs",
  "Email Security Protocols",
];

export function TrustedBySection() {
  return (
    <section className="py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-center text-xs font-bold uppercase tracking-[0.2em] text-zinc-600">
          INTELLIGENCE SOURCES
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
          {sources.map((item) => (
            <span
              key={item}
              className="text-sm font-semibold text-zinc-500 transition-colors hover:text-zinc-300 font-data"
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
