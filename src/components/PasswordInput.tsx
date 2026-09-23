import { useState } from "react";
import { Info } from "lucide-react";

interface PasswordInputProps {
  value: string;
  feedback?: string;
  onChange: (value: string) => void;
}

export function PasswordInput({
  value,
  feedback,
  onChange,
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="mb-7">
      <div className="relative">
        <input
          id="password"
          type={showPassword ? "text" : "password"}
          autoComplete="off"
          spellCheck={false}
          value={value}
          // make sure space is not accepted
          onChange={(e) => onChange(e.target.value.replace(/\s/g, ""))}
          placeholder="Type a password..."
          className="w-full rounded-[10px] border border-(--border) bg-(--panel) py-3.75 pr-11.5 pl-4 text-base text-(--text) outline-none transition duration-150 ease-in-out placeholder:text-(--text-faint) focus:border-(--safe) focus:ring-[3px] focus:ring-[rgba(56,189,248,0.14)]"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute top-1/2 right-3 flex -translate-y-1/2 items-center justify-center rounded-md border-none bg-transparent p-1.5 text-(--text-faint) transition hover:bg-(--panel-2) hover:text-(--text-dim)"
          aria-label="Toggle password visibility"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {showPassword ? (
              <>
                <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a21.6 21.6 0 0 1 5.06-6.06M9.9 4.24A10.4 10.4 0 0 1 12 4c7 0 11 8 11 8a21.6 21.6 0 0 1-3.22 4.44M14.12 14.12a3 3 0 1 1-4.24-4.24" />
                <path d="M1 1l22 22" />
              </>
            ) : (
              <>
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z" />
                <circle cx="12" cy="12" r="3" />
              </>
            )}
          </svg>
        </button>
      </div>
      <label
        htmlFor="password"
        aria-live="polite"
        className="mt-2 flex items-start gap-2 text-[12.5px] font-semibold tracking-wide text-white"
      >
        <Info
          aria-hidden="true"
          className="mt-0.5 h-4 w-4 shrink-0 animate-pulse"
          strokeWidth={3}
        />
        <span>{value ? feedback : "Enter a password to analyse"}</span>
      </label>
    </div>
  );
}
