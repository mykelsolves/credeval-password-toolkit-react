import { useCallback, useEffect, useRef, useState } from "react";
import { PasswordInput } from "./components/PasswordInput";
import { Dashboard } from "./components/Dashboard";
import { usePasswordAnalysis } from "./hooks/usePasswordAnalysis";
import { generateAllVariants } from "./lib/variants/generateVerifiedVariants";
import type { TestVerdict, VariantsState } from "./lib/types";

export default function App() {
  const [password, setPassword] = useState("");
  const [credentialCopied, setCredentialCopied] = useState(false);
  const [variants, setVariants] = useState<VariantsState>({ status: "idle" });
  const generationRequestRef = useRef(0);
  const credentialNotificationTimerRef = useRef<number | undefined>(undefined);
  const skipNextAutomaticGenerationRef = useRef(false);
  const analysis = usePasswordAnalysis(password);

  function handlePasswordChange(value: string) {
    generationRequestRef.current += 1;
    setPassword(value);
    setVariants({ status: "idle" });
  }

  function handleUseGeneratedPassword(value: string) {
    skipNextAutomaticGenerationRef.current = true;
    handlePasswordChange(value);
    setCredentialCopied(true);
    window.clearTimeout(credentialNotificationTimerRef.current);
    credentialNotificationTimerRef.current = window.setTimeout(() => {
      setCredentialCopied(false);
    }, 2000);
  }

  const verdict: TestVerdict =
    !password ||
    !analysis.entropy ||
    analysis.breach.status === "idle" ||
    analysis.breach.status === "checking"
      ? "pending"
      : analysis.entropy.score === 4 && analysis.breach.status === "safe"
        ? "pass"
        : "fail";

  const inputFeedback =
    analysis.entropy?.score === 4 && analysis.breach.status === "breached"
      ? "This password is strong but has been leaked in a breach."
      : analysis.entropy?.feedback;

  const handleRequestVariants = useCallback(async () => {
    if (!password) return;

    const requestId = ++generationRequestRef.current;
    setVariants({ status: "generating" });
    try {
      const generated = await generateAllVariants(password);
      if (requestId !== generationRequestRef.current) return;
      setVariants({ status: "ready", variants: generated });
    } catch {
      if (requestId !== generationRequestRef.current) return;
      setVariants({ status: "error" });
    }
  }, [password]);

  useEffect(() => {
    if (verdict !== "fail") return;
    if (skipNextAutomaticGenerationRef.current) {
      skipNextAutomaticGenerationRef.current = false;
      return;
    }

    const generationTimer = window.setTimeout(() => {
      void handleRequestVariants();
    }, 0);

    return () => window.clearTimeout(generationTimer);
  }, [handleRequestVariants, verdict]);

  const displayedVariants = !password ? { status: "idle" as const } : variants;

  return (
    <div className="min-h-screen bg-(--base) flex items-center text-(--text) p-5">
      <div className="mx-auto w-270">
        <h1 className="mb-2 text-2xl font-bold tracking-[-0.01em]">CredEval</h1>
        {/* <p className="mt-2 flex items-start gap-2 text-[12.5px] font-semibold tracking-wide text-(--text-faint)">
          Password Evaluator
        </p> */}
        <PasswordInput
          value={password}
          feedback={inputFeedback}
          onChange={handlePasswordChange}
        />

        <div className="mt-6">
          <Dashboard
            entropy={analysis.entropy}
            breach={analysis.breach}
            verdict={verdict}
            variants={displayedVariants}
            onRequestVariants={handleRequestVariants}
            onUsePassword={handleUseGeneratedPassword}
            credentialCopied={credentialCopied}
          />
        </div>
      </div>
    </div>
  );
}
