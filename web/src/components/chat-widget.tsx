"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "assistant" | "user";
  content: string;
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: "1",
    role: "assistant",
    content:
      "Hey! I'm your KohlCorp AI assistant. Ask me anything about your positions, market alerts, or how the platform works.",
  },
];

const QUICK_REPLIES = [
  "How do alerts work?",
  "What stocks should I watch?",
  "How do I add positions?",
];

// Simple response logic — replace with real AI endpoint later
function getResponse(input: string): string {
  const lower = input.toLowerCase();
  if (lower.includes("alert") || lower.includes("notification")) {
    return "We monitor the market 24/7 and send you alerts like \"Go sell TSLA on Robinhood now\" when our AI detects an opportunity. You can customize which stocks trigger alerts in Settings.";
  }
  if (lower.includes("add") || lower.includes("position") || lower.includes("portfolio")) {
    return "Head to My Positions in the sidebar, click \"Add Position\", and enter the stock symbol, how many shares you own on your broker, and what you paid. We'll track the live price from there.";
  }
  if (lower.includes("watch") || lower.includes("stock") || lower.includes("recommend")) {
    return "Check out the AI Signals page — we analyze thousands of stocks and surface the strongest buy/sell/hold signals. You can also add any stock to your watchlist from the dashboard.";
  }
  if (lower.includes("price") || lower.includes("cost") || lower.includes("free")) {
    return "The Free plan tracks up to 5 positions with daily alerts. Pro ($19/mo) gives you unlimited positions, real-time alerts, and advanced profit estimates. No money is ever invested through this app.";
  }
  if (lower.includes("robinhood") || lower.includes("broker") || lower.includes("webull")) {
    return "We never connect to your broker. You just tell us what you own, and we send alerts telling you when to open Robinhood (or Webull, Fidelity, etc.) and act. You can set your broker in Settings.";
  }
  if (lower.includes("hello") || lower.includes("hi") || lower.includes("hey")) {
    return "Hey there! How can I help you today? Ask me about alerts, positions, or anything else.";
  }
  return "Great question! You can explore AI Signals for buy/sell recommendations, check Alert History to see our track record, or go to My Positions to log your broker holdings. Anything else I can help with?";
}

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, typing]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text.trim(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setTyping(true);

    setTimeout(() => {
      const response: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: getResponse(text),
      };
      setMessages((prev) => [...prev, response]);
      setTyping(false);
    }, 800 + Math.random() * 600);
  };

  return (
    <>
      {/* Chat bubble button */}
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full px-5 py-3 font-medium text-white shadow-lg shadow-emerald-500/20 transition-all duration-300 hover:scale-105",
          open
            ? "bg-zinc-800 hover:bg-zinc-700"
            : "bg-emerald-600 hover:bg-emerald-700"
        )}
      >
        {open ? (
          <X className="h-5 w-5" />
        ) : (
          <>
            <MessageCircle className="h-5 w-5" />
            <span className="text-sm hidden sm:inline">AI Assistant</span>
          </>
        )}
      </button>

      {/* Chat window */}
      {open && (
        <div className="fixed bottom-20 right-6 z-50 w-[380px] max-w-[calc(100vw-3rem)] overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 shadow-2xl shadow-black/50 animate-in slide-in-from-bottom-4 fade-in duration-200">
          {/* Header */}
          <div className="flex items-center gap-3 border-b border-zinc-800 bg-zinc-900/50 px-4 py-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/10">
              <Bot className="h-4 w-4 text-emerald-500" />
            </div>
            <div>
              <div className="text-sm font-semibold text-white">
                AI Assistant
              </div>
              <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Online
              </div>
            </div>
          </div>

          {/* Messages */}
          <div
            ref={scrollRef}
            className="flex flex-col gap-3 overflow-y-auto p-4"
            style={{ maxHeight: "360px", minHeight: "200px" }}
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  "flex gap-2",
                  msg.role === "user" ? "flex-row-reverse" : "flex-row"
                )}
              >
                <div
                  className={cn(
                    "flex h-6 w-6 shrink-0 items-center justify-center rounded-full",
                    msg.role === "user"
                      ? "bg-zinc-700"
                      : "bg-emerald-500/10"
                  )}
                >
                  {msg.role === "user" ? (
                    <User className="h-3 w-3 text-zinc-300" />
                  ) : (
                    <Bot className="h-3 w-3 text-emerald-500" />
                  )}
                </div>
                <div
                  className={cn(
                    "max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed",
                    msg.role === "user"
                      ? "bg-emerald-600 text-white rounded-br-md"
                      : "bg-zinc-800 text-zinc-200 rounded-bl-md"
                  )}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex gap-2">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/10">
                  <Bot className="h-3 w-3 text-emerald-500" />
                </div>
                <div className="rounded-2xl rounded-bl-md bg-zinc-800 px-4 py-3">
                  <div className="flex gap-1">
                    <div className="h-2 w-2 animate-bounce rounded-full bg-zinc-500" style={{ animationDelay: "0ms" }} />
                    <div className="h-2 w-2 animate-bounce rounded-full bg-zinc-500" style={{ animationDelay: "150ms" }} />
                    <div className="h-2 w-2 animate-bounce rounded-full bg-zinc-500" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick replies */}
          {messages.length <= 1 && (
            <div className="flex flex-wrap gap-2 border-t border-zinc-800/50 px-4 py-2">
              {QUICK_REPLIES.map((reply) => (
                <button
                  key={reply}
                  onClick={() => sendMessage(reply)}
                  className="rounded-full border border-zinc-700 px-3 py-1 text-xs text-zinc-400 hover:border-emerald-500 hover:text-emerald-400 transition-colors"
                >
                  {reply}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="border-t border-zinc-800 p-3">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage(input);
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask anything..."
                className="flex-1 rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white placeholder-zinc-500 focus:border-emerald-500 focus:outline-none"
              />
              <button
                type="submit"
                disabled={!input.trim()}
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-40 transition-colors"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
