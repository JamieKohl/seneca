"use client";

import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Marcus T.",
    role: "Small Business Owner",
    avatar: "MT",
    color: "bg-blue-600/20 text-blue-500",
    rating: 5,
    text: "Shield caught a phishing email that my spam filter missed — it looked exactly like a real invoice from my vendor. Could have lost $8,000.",
  },
  {
    name: "Sarah K.",
    role: "Working Mom",
    avatar: "SK",
    color: "bg-blue-500/20 text-blue-400",
    rating: 5,
    text: "I had no idea I was paying for 6 subscriptions I never use. Shield found them all and helped me cancel. Saving $87/month now.",
  },
  {
    name: "David R.",
    role: "Privacy Advocate",
    avatar: "DR",
    color: "bg-purple-500/20 text-purple-400",
    rating: 5,
    text: "The Privacy Autopilot is incredible. It found my info on 23 data broker sites and walked me through opting out of every single one.",
  },
  {
    name: "Jennifer L.",
    role: "Online Shopper",
    avatar: "JL",
    color: "bg-amber-500/20 text-amber-400",
    rating: 4,
    text: "Price Watch showed me that the same laptop was $200 cheaper in an incognito window. Companies really do charge different prices based on your data.",
  },
  {
    name: "Chris W.",
    role: "Retired Teacher",
    avatar: "CW",
    color: "bg-red-500/20 text-red-400",
    rating: 5,
    text: "My parents were getting scam calls daily. Shield analyzes every suspicious call and text — they feel so much safer now. Worth every penny.",
  },
  {
    name: "Amy P.",
    role: "College Student",
    avatar: "AP",
    color: "bg-cyan-500/20 text-cyan-400",
    rating: 5,
    text: "As a student I can't afford to waste money. Shield found 3 free trials I forgot to cancel and a sketchy phishing text. Already saved more than the subscription costs.",
  },
];

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="relative overflow-hidden border-t border-zinc-800/50 py-20 scroll-mt-16">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center mb-12">
          <p className="text-sm font-semibold text-blue-600 mb-2">
            TESTIMONIALS
          </p>
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Trusted by Thousands
          </h2>
          <p className="mt-3 text-zinc-400 max-w-xl mx-auto">
            See how Shield is protecting people&apos;s money and privacy every day
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.name}
              className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 transition-colors hover:border-zinc-700"
            >
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

              <p className="text-sm text-zinc-300 leading-relaxed mb-4">
                &ldquo;{testimonial.text}&rdquo;
              </p>

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
