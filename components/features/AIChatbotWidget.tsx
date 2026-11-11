"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { MessageSquare, X, Send, Sparkles, Bot, Crown, ArrowRight } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function AIChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "✨ Namaste! Welcome to BEEM (Beauty Empire). I am your AI Beauty Concierge. Ask me about our haircut styles, bridal packages, organic mehendi, prices, or today's offers!",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async (userText?: string) => {
    const textToSend = userText || input;
    if (!textToSend.trim() || isLoading) return;

    const newMessages: Message[] = [...messages, { role: "user", content: textToSend }];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      const data = await res.json();
      if (data.reply) {
        setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "I apologize, could you please rephrase your request? Or tap 'Book Now' above to reserve your slot directly!",
          },
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "You can reach our salon concierge on WhatsApp at +91 98765 43210 or tap 'Book Now' to view available slots.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickPrompts = [
    "Bridal Packages",
    "Haircut Prices",
    "Mehendi Designs",
    "Today's Discounts",
    "Salon Location & Hours",
  ];

  return (
    <aside aria-label="AI Beauty Concierge assistant" className="fixed bottom-6 right-6 z-40 print:hidden">
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          aria-label="Open AI Beauty Concierge Chat"
          className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-tr from-brand-deep via-brand-royal to-brand-violet text-white shadow-glow hover:scale-105 active:scale-95 transition-all"
        >
          <div className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-softgold opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-brand-softgold"></span>
          </div>
          <Sparkles className="h-6 w-6 text-brand-softgold" />
          <span className="pointer-events-none absolute right-16 whitespace-nowrap rounded-xl bg-gray-900/90 px-3 py-1.5 text-xs font-semibold text-white opacity-0 shadow-lg group-hover:opacity-100 transition-opacity">
            Ask AI Beauty Concierge
          </span>
        </button>
      )}

      {isOpen && (
        <div className="flex h-[520px] w-[360px] sm:w-[400px] flex-col rounded-3xl bg-white shadow-2xl border border-purple-200/80 dark:bg-[#150D27] dark:border-purple-900 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between bg-gradient-to-r from-brand-deep via-brand-royal to-brand-violet px-5 py-4 text-white">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-white/10 flex items-center justify-center text-brand-softgold border border-white/20">
                <Crown className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-heading text-lg font-bold leading-tight flex items-center gap-1.5">
                  BEEM Concierge
                  <span className="text-[10px] bg-brand-softgold text-brand-ink px-1.5 py-0.2 rounded-full font-bold">
                    AI
                  </span>
                </h3>
                <p className="text-[11px] text-purple-200">Online • Instant Beauty Advisory</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              aria-label="Close Chat"
              className="rounded-full p-1.5 text-white/80 hover:bg-white/10 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Quick Booking Ribbon inside chat */}
          <div className="bg-purple-50 dark:bg-purple-950/60 px-4 py-2 border-b border-purple-100 dark:border-purple-900 flex items-center justify-between text-xs">
            <span className="text-brand-deep dark:text-purple-200 font-medium">Ready to pamper yourself?</span>
            <Link
              href="/book"
              onClick={() => setIsOpen(false)}
              className="text-brand-violet dark:text-brand-orchid font-bold flex items-center gap-1 hover:underline"
            >
              Book Slot <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 text-sm">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 leading-relaxed whitespace-pre-line text-xs sm:text-sm ${
                    m.role === "user"
                      ? "bg-brand-violet text-white rounded-br-xs"
                      : "bg-purple-50 text-brand-ink border border-purple-100/80 rounded-bl-xs dark:bg-purple-900/30 dark:text-purple-100 dark:border-purple-800/50"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex items-center gap-2 rounded-2xl bg-purple-50 border border-purple-100 px-4 py-2 text-xs text-brand-muted dark:bg-purple-900/30 dark:border-purple-800">
                  <Bot className="h-3.5 w-3.5 animate-spin text-brand-violet" />
                  Stylist typing recommendation...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          <div className="px-3 py-1.5 border-t border-purple-50 dark:border-purple-900/40 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {quickPrompts.map((qp) => (
              <button
                key={qp}
                onClick={() => handleSend(qp)}
                className="whitespace-nowrap rounded-full bg-purple-50 px-2.5 py-1 text-[11px] font-medium text-brand-royal hover:bg-brand-lavender dark:bg-purple-950 dark:text-purple-200 transition-colors shrink-0"
              >
                {qp}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <div className="p-3 border-t border-purple-100 bg-white dark:bg-[#150D27] dark:border-purple-900">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about cuts, facials, bridal packages..."
                className="flex-1 rounded-full border border-purple-200 px-4 py-2 text-xs sm:text-sm text-brand-ink placeholder-brand-muted focus:border-brand-violet focus:outline-none dark:border-purple-800 dark:bg-purple-950/40 dark:text-white"
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                aria-label="Send Message"
                className="rounded-full bg-brand-violet p-2.5 text-white hover:bg-brand-royal disabled:opacity-50 transition-colors"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </aside>
  );
}
