import { useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
import type { TestVerdict, VariantsState } from "../lib/types";

interface GenerationPanelProps {
  verdict: TestVerdict;
  variants: VariantsState;
  onRequestVariants: () => void;
  onUsePassword: (password: string) => void;
  credentialCopied: boolean;
}

export function GenerationPanel({
  verdict,
  variants,
  onRequestVariants,
  onUsePassword,
  credentialCopied,
}: GenerationPanelProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [notificationVisible, setNotificationVisible] =
    useState(credentialCopied);

  useEffect(() => {
    if (credentialCopied) {
      const notificationTimer = window.setTimeout(() => {
        setNotificationVisible(true);
      }, 0);

      return () => window.clearTimeout(notificationTimer);
    }

    const notificationTimer = window.setTimeout(() => {
      setNotificationVisible(false);
    }, 500);

    return () => window.clearTimeout(notificationTimer);
  }, [credentialCopied]);

  async function handleCopy(password: string, index: number) {
    onUsePassword(password);
    await navigator.clipboard.writeText(password);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 1500);
  }

  if (variants.status === "idle") {
    const message =
      verdict === "pass"
        ? "Entered password is strong and not found in any known breach."
        : verdict === "fail"
          ? "Generate a stronger verified alternative."
          : "Enter a password to generate verified alternatives.";

    return (
      <div className="h-full overflow-y-auto rounded-lg border border-(--border) bg-(--panel) p-4 text-center">
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-(--text-dim)">
          Password generation
        </h2>
        <p className="mb-3 text-sm text-(--text-dim)">{message}</p>
        {verdict === "pass" && (
          <button
            type="button"
            onClick={onRequestVariants}
            className="rounded-full border border-(--border) bg-(--base) px-4 py-2 text-sm font-semibold text-(--text-dim) transition hover:border-(--safe) hover:text-(--safe)"
          >
            Show me alternatives anyway
          </button>
        )}
        {notificationVisible && (
          <p
            className={`mt-6 text-center text-md font-semibold text-(--safe) transition-opacity duration-500 ease-out ${
              credentialCopied ? "opacity-100" : "opacity-0"
            }`}
            role="status"
            aria-live="polite"
          >
            Credential copied
          </p>
        )}
      </div>
    );
  }

  if (variants.status === "generating") {
    return (
      <div className="h-full overflow-y-auto rounded-lg border border-(--border) bg-(--panel) p-4 text-center text-sm text-(--text-dim)">
        <div className="flex items-center justify-center gap-2 text-center text-sm text-(--text-dim)">
          <svg
            className="h-4 w-4 animate-spin stroke-(--safe)"
            viewBox="0 0 24 24"
            fill="none"
            strokeWidth="2.5"
            strokeLinecap="round"
          >
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
          </svg>
          <span>Generating verified alternatives...</span>
        </div>
      </div>
    );
  }

  if (variants.status === "error") {
    return (
      <div className="h-full overflow-y-auto rounded-lg border border-(--border) bg-(--panel) p-4 text-center text-sm text-(--text-dim)">
        Could not generate a verified alternative right now. Try again.
      </div>
    );
  }

  // status === 'ready'
  return (
    <div className="h-full overflow-y-auto rounded-lg border border-(--border) bg-(--panel) p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-(--text-dim)">
          Suggested alternatives
        </h2>
        <button
          type="button"
          onClick={onRequestVariants}
          aria-label="Generate a new set of suggestions"
          className="flex shrink-0 items-center gap-1.5 rounded-full border border-(--border) px-3 py-1.5 text-xs text-(--text-dim) transition hover:border-(--safe) hover:text-(--safe)"
        >
          <RefreshCw aria-hidden="true" className="h-4 w-4" />
          Generate New
        </button>
      </div>
      <div className="flex flex-col gap-2">
        {variants.variants.map((v, i) => (
          <div
            key={v.type}
            className="flex items-center justify-between rounded-md border border-(--border-soft) bg-(--base) px-3 py-2.5"
          >
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-(--text-faint)">
                {v.label}
              </p>
              <p className="truncate text-sm text-(--text)">{v.password}</p>
              {v.entropyBits !== undefined && (
                <p className="mt-0.5 text-[11px] text-(--text-faint)">
                  {/* {v.entropyBits.toFixed(1)} bits (analytic) */}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={() => handleCopy(v.password, i)}
              className="ml-3 shrink-0 rounded-full border border-(--border) px-3 py-1.5 text-xs text-(--text-dim) transition hover:border-(--safe) hover:text-(--safe)"
            >
              {copiedIndex === i ? "Copied" : "Copy"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
