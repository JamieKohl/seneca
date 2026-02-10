const stats = [
  { label: "Alerts Sent", value: "1.2M+" },
  { label: "Prediction Accuracy", value: "84%" },
  { label: "Stocks Tracked", value: "5,000+" },
  { label: "Active Users", value: "10,000+" },
];

export function StatsSection() {
  return (
    <section className="border-y border-zinc-800 bg-zinc-900/30 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl font-bold text-emerald-500 sm:text-4xl">
                {stat.value}
              </div>
              <div className="mt-2 text-sm text-zinc-400">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
