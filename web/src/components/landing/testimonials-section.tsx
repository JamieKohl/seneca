"use client";

import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Marcus T.",
    role: "Swing Trader",
    avatar: "MT",
    color: "bg-emerald-500/20 text-emerald-400",
    rating: 5,
    text: "Got a sell alert on TSLA right before it dropped 8%. Opened Robinhood and closed my position in under a minute. This app literally saved me thousands.",
  },
  {
    name: "Sarah K.",
    role: "Part-time Investor",
    avatar: "SK",
    color: "bg-blue-500/20 text-blue-400",
    rating: 5,
    text: "I don't have time to watch the market all day. KohlCorp tells me exactly when to open my broker and what to do. It's like having a financial advisor in my pocket.",
  },
  {
    name: "David R.",
    role: "Day Trader",
    avatar: "DR",
    color: "bg-purple-500/20 text-purple-400",
    rating: 5,
    text: "The AI signals have an insane hit rate. I was skeptical at first but after 3 months of tracking, the accuracy speaks for itself. Pro plan is worth every penny.",
  },
  {
    name: "Jennifer L.",
    role: "Casual Investor",
    avatar: "JL",
    color: "bg-amber-500/20 text-amber-400",
    rating: 4,
    text: "Love that it doesn't connect to my broker. I just log what I own and get alerts. Simple, safe, and the predictions are surprisingly accurate.",
  },
  {
    name: "Chris W.",
    role: "Portfolio Manager",
    avatar: "CW",
    color: "bg-red-500/20 text-red-400",
    rating: 5,
    text: "Managing 30+ positions across Fidelity and Webull. KohlCorp's alerts help me stay on top of everything. The confidence scores and technical data are a great addition.",
  },
  {
    name: "Amy P.",
    role: "Beginner Investor",
    avatar: "AP",
    color: "bg-cyan-500/20 text-cyan-400",
    rating: 5,
    text: "Started investing 6 months ago and was overwhelmed. KohlCorp breaks everything down into simple buy/sell/hold alerts. It's made investing so much less scary.",
  },
];

export function TestimonialsSection() {
  return (
    <section className="relative overflow-hidden border-t border-zinc-800/50 py-20">
      <div className="mx-auto max-w-6xl px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-sm font-semibold text-emerald-500 mb-2">
            TESTIMONIALS
          </p>
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Trusted by Traders Everywhere
          </h2>
          <p className="mt-3 text-zinc-400 max-w-xl mx-auto">
            See what our users are saying about KohlCorp&apos;s AI-powered alerts
          </p>
        </div>

        {/* Testimonial Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.name}
              className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 transition-colors hover:border-zinc-700"
            >
              {/* Stars */}
              <div className="flex items-center gap-0.5 mb-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < testimonial.rating
                        ? "fill-amber-400 text-amber-400"
                        : "text-zinc-700"
                    }`}
                  />
                ))}
              </div>

              {/* Quote */}
              <p className="text-sm text-zinc-300 leading-relaxed mb-4">
                &ldquo;{testimonial.text}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold ${testimonial.color}`}
                >
                  {testimonial.avatar}
                </div>
                <div>
                  <p className="text-sm font-medium text-white">
                    {testimonial.name}
                  </p>
                  <p className="text-xs text-zinc-500">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
