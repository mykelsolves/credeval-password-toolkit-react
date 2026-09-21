import type { EntropyResult } from "../lib/types";

const SCORE_LABELS = ["Very weak", "Weak", "Fair", "Good", "Strong"];
const SCORE_TEXT_CLASSES = [
  "text-(--weak)",
  "text-(--weak)",
  "text-(--fair)",
  "text-(--good)",
  "text-(--strong)",
];
const SCORE_BACKGROUND_CLASSES = [
  "bg-(--weak)",
  "bg-(--weak)",
  "bg-(--fair)",
  "bg-(--good)",
  "bg-(--strong)",
];

interface EntropyPanelProps {
  entropy: EntropyResult | null;
}

export function EntropyPanel({ entropy }: EntropyPanelProps) {
  return (
    <div className="h-42.5 rounded-xl border border-(--border) bg-(--panel) px-4.5 pb-5 pt-4.5">
      <div className="mb-3.5">
        <div className="text-sm font-semibold uppercase tracking-widest text-slate-300">
          Strength
        </div>
      </div>

      {!entropy ? (
        <div className="text-center text-[13.5px] text-(--text-dim)">
          <div className="mb-3.5 flex gap-1" aria-hidden="true">
            {[0, 1, 2, 3, 4].map((segment) => (
              <div
                key={segment}
                className="h-1.5 flex-1 rounded-full bg-(--border)"
              />
            ))}
          </div>
          <p>Start typing to see an analysis.</p>
        </div>
      ) : (
        <EntropyDetails entropy={entropy} />
      )}
    </div>
  );
}

function EntropyDetails({ entropy }: { entropy: EntropyResult }) {
  const { score, guesses, crackTimeDisplay } = entropy;
  const scoreIndex = Math.max(0, Math.min(score, SCORE_LABELS.length - 1));

  return (
    <>
      <div className="mb-3.5 flex gap-1">
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-colors duration-250 ${i <= scoreIndex ? SCORE_BACKGROUND_CLASSES[scoreIndex] : "bg-(--border)"}`}
          />
        ))}
      </div>

      <div
        className={`mb-2.5 text-[17px] font-semibold ${SCORE_TEXT_CLASSES[scoreIndex]}`}
      >
        {SCORE_LABELS[scoreIndex]}
      </div>
      <div className="mb-1 flex justify-between text-[12.5px] text-(--text-dim)">
        <span>Estimated guesses:</span>
        <span className="font-mono text-(--text)">
          {guesses.toLocaleString()}
        </span>
      </div>
      <div className="mb-3 flex justify-between text-[12.5px] text-(--text-dim)">
        <span>Crack time (online, throttled):</span>
        <span className="font-mono text-(--text)">{crackTimeDisplay}</span>
      </div>
    </>
  );
}
