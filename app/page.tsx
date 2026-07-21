"use client";

import { useMemo, useState } from "react";
import medicines from "@/data/medicines.json";
import { getExpiryInfo, formatExpiry, ExpiryStatus } from "@/lib/expiry";

interface Medicine {
  id: number;
  name: string;
  weight: string;
  expiryDate: string;
  price: string;
}

const STATUS_STYLES: Record<
  ExpiryStatus,
  { badge: string; dot: string }
> = {
  expired: { badge: "bg-clinic-red-bg text-clinic-red", dot: "bg-clinic-red" },
  soon: { badge: "bg-clinic-red-bg text-clinic-red", dot: "bg-clinic-red" },
  watch: { badge: "bg-clinic-amber-bg text-clinic-amber", dot: "bg-clinic-amber" },
  ok: { badge: "bg-clinic-green-bg text-clinic-green", dot: "bg-clinic-green" },
};

export default function Home() {
  const [query, setQuery] = useState("");
  const [expiryFilter, setExpiryFilter] = useState(""); // "YYYY-MM" from <input type="month">
  const [expiringSoonOnly, setExpiringSoonOnly] = useState(false);

  const data = medicines as Medicine[];

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();

    return data
      .filter((item) => {
        const matchesName = q === "" || item.name.toLowerCase().includes(q);

        const matchesExpiry =
          expiryFilter === "" || item.expiryDate.startsWith(expiryFilter);

        const info = getExpiryInfo(item.expiryDate);
        const matchesSoon =
          !expiringSoonOnly || info.status === "soon" || info.status === "expired";

        return matchesName && matchesExpiry && matchesSoon;
      })
      .sort((a, b) => a.expiryDate.localeCompare(b.expiryDate));
  }, [data, query, expiryFilter, expiringSoonOnly]);

  return (
    <main className="flex h-dvh flex-col bg-clinic-bg font-body">
      {/* Fixed header */}
      <header className="sticky top-0 z-10 border-b border-clinic-border bg-clinic-surface/95 backdrop-blur px-4 pt-[max(1rem,env(safe-area-inset-top))] pb-3 shadow-card">
        <div className="mb-3 flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-clinic-teal">
            <CrossIcon />
          </div>
          <div>
            <h1 className="font-display text-lg font-semibold leading-tight text-clinic-ink">
              Divine Care Pharmacy
            </h1>
            <p className="text-xs text-clinic-muted">
              {data.length} items in inventory
            </p>
          </div>
        </div>

        {/* Name search */}
        <div className="relative mb-2">
          <SearchIcon className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-clinic-muted" />
          <input
            type="text"
            inputMode="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search medicine name…"
            aria-label="Search medicine name"
            className="h-12 w-full rounded-xl border border-clinic-border bg-clinic-bg pl-10 pr-10 text-base text-clinic-ink placeholder:text-clinic-muted focus:border-clinic-teal focus:outline-none focus:ring-2 focus:ring-clinic-teal/30"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-clinic-muted active:bg-clinic-border"
            >
              <ClearIcon />
            </button>
          )}
        </div>

        {/* Expiry filter row */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="month"
              value={expiryFilter}
              onChange={(e) => setExpiryFilter(e.target.value)}
              aria-label="Filter by expiry month and year"
              className="h-11 w-full rounded-xl border border-clinic-border bg-clinic-bg px-3 text-sm text-clinic-ink focus:border-clinic-teal focus:outline-none focus:ring-2 focus:ring-clinic-teal/30"
            />
          </div>
          <button
            type="button"
            onClick={() => setExpiringSoonOnly((v) => !v)}
            aria-pressed={expiringSoonOnly}
            className={`h-11 shrink-0 whitespace-nowrap rounded-xl border px-3.5 text-sm font-medium transition-colors ${
              expiringSoonOnly
                ? "border-clinic-red bg-clinic-red-bg text-clinic-red"
                : "border-clinic-border bg-clinic-bg text-clinic-muted"
            }`}
          >
            ⚠ Expiring soon
          </button>
        </div>

        {(query || expiryFilter || expiringSoonOnly) && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setExpiryFilter("");
              setExpiringSoonOnly(false);
            }}
            className="mt-2 text-xs font-medium text-clinic-teal"
          >
            Clear all filters
          </button>
        )}
      </header>

      {/* Scrollable results */}
      <div className="no-scrollbar flex-1 overflow-y-auto px-4 py-3 pb-[max(1rem,env(safe-area-inset-bottom))]">
        {results.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-20 text-center">
            <SearchIcon className="text-clinic-border" size={40} />
            <p className="font-medium text-clinic-ink">No matches found</p>
            <p className="text-sm text-clinic-muted">
              Try a different name or expiry month.
            </p>
          </div>
        ) : (
          <ul className="flex flex-col gap-2.5">
            {results.map((item) => {
              const info = getExpiryInfo(item.expiryDate);
              const styles = STATUS_STYLES[info.status];
              return (
                <li
                  key={item.id}
                  className="flex items-center justify-between gap-3 rounded-2xl border border-clinic-border bg-clinic-surface px-4 py-3.5 shadow-card"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline gap-1.5">
                      <span className="truncate font-display text-base font-semibold text-clinic-ink">
                        {item.name}
                      </span>
                      <span className="shrink-0 font-mono text-sm text-clinic-muted">
                        {item.weight}
                      </span>
                    </div>
                    <div className="mt-1.5 flex items-center gap-1.5">
                      <span className={`h-1.5 w-1.5 rounded-full ${styles.dot}`} />
                      <span
                        className={`rounded-md px-1.5 py-0.5 text-xs font-medium ${styles.badge}`}
                      >
                        {info.label !== "OK" ? `${info.label} · ` : ""}
                        {formatExpiry(item.expiryDate)}
                      </span>
                    </div>
                  </div>

                  <div className="shrink-0 text-right">
                    <p className="font-mono text-xl font-bold text-clinic-teal-dark">
                      Rs {item.price.toLocaleString()}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </main>
  );
}

function SearchIcon({
  className = "",
  size = 18,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="11" cy="11" r="7" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function ClearIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function CrossIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FAFBFA" strokeWidth="3" strokeLinecap="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}
