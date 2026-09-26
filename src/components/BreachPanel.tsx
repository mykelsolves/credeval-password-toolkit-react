import type { BreachResult } from "../lib/types";

const ICONS = {
  check: (
    <svg
      className="h-4 w-4 stroke-(--strong)"
      viewBox="0 0 24 24"
      fill="none"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  ),
  alert: (
    <svg
      className="h-4 w-4 stroke-(--breach)"
      viewBox="0 0 24 24"
      fill="none"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 9v4M12 17h.01M10.3 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L14.7 3.86a2 2 0 0 0-3.4 0Z" />
    </svg>
  ),
  spinner: (
    <svg
      className="h-4 w-4 animate-spin stroke-(--safe)"
      viewBox="0 0 24 24"
      fill="none"
      strokeWidth="2.5"
      strokeLinecap="round"
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  ),
  dash: (
    <svg
      className="h-4 w-4 stroke-(--text-faint)"
      viewBox="0 0 24 24"
      fill="none"
      strokeWidth="2.5"
      strokeLinecap="round"
    >
      <path d="M5 12h14" />
    </svg>
  ),
};

interface BreachPanelProps {
  breach: BreachResult;
}

export function BreachPanel({ breach }: BreachPanelProps) {
  const { status, count } = breach;

  let icon = ICONS.dash;
  let message = "Start typing to check against known breaches.";

  if (status === "idle") {
    icon = ICONS.dash;
    message = "Start typing to check against known breaches.";
  } else if (status === "checking") {
    icon = ICONS.spinner;
    message = "Checking against known breaches...";
  } else if (status === "safe") {
    icon = ICONS.check;
    message = "Not found in any known breach.";
  } else if (status === "breached") {
    icon = ICONS.alert;
    message = `Found in ${count.toLocaleString()} known breach${count === 1 ? "" : "es"}. Avoid using this password.`;
  } else if (status === "error") {
    icon = ICONS.dash;
    message = "Could not reach the breach database.";
  }

  return (
    <div className="h-42.5 rounded-xl border border-(--border) bg-(--panel) px-4.5 pb-5 pt-4.5">
      <div className="mb-3.5">
        <div className="text-sm font-semibold uppercase tracking-widest text-(--text-dim)">
          Breach check
        </div>
      </div>

      {status === "idle" ? (
        <div className="px-0 py-7.5 text-center text-[13.5px] text-(--text-dim)">
          {message}
        </div>
      ) : (
        <div className="mb-1.5 flex items-center gap-2.5">
          <div className="flex h-5 w-5 shrink-0 items-center justify-center">
            {icon}
          </div>
          <div
            className={`flex items-center text-[13.5px] leading-normal ${
              status === "safe"
                ? "text-(--strong)"
                : status === "breached"
                  ? "text-(--breach)"
                  : "text-(--text-dim)"
            }`}
          >
            {message}
          </div>
        </div>
      )}
    </div>
  );
}
