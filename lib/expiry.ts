export type ExpiryStatus = "expired" | "soon" | "watch" | "ok";

export interface ExpiryInfo {
  status: ExpiryStatus;
  label: string;
  monthsLeft: number;
}

/**
 * expiryDate is stored as "YYYY-MM". We compare against the first day of
 * the current month so "this month" isn't incorrectly flagged as expired.
 */
export function getExpiryInfo(expiryDate: string): ExpiryInfo {
  const [year, month] = expiryDate.split("-").map(Number);
  const expiry = new Date(year, month - 1, 1);

  const now = new Date();
  const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const monthsLeft =
    (expiry.getFullYear() - currentMonthStart.getFullYear()) * 12 +
    (expiry.getMonth() - currentMonthStart.getMonth());

  if (monthsLeft < 0) {
    return { status: "expired", label: "Expired", monthsLeft };
  }
  if (monthsLeft <= 2) {
    return { status: "soon", label: "Expiring soon", monthsLeft };
  }
  if (monthsLeft <= 6) {
    return { status: "watch", label: "Watch", monthsLeft };
  }
  return { status: "ok", label: "OK", monthsLeft };
}

export function formatExpiry(expiryDate: string): string {
  const [year, month] = expiryDate.split("-").map(Number);
  const date = new Date(year, month - 1, 1);
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}
