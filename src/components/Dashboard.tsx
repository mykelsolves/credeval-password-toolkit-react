import type {
  PasswordAnalysis,
  TestVerdict,
  VariantsState,
} from "../lib/types";
import { EntropyPanel } from "./EntropyPanel";
import { BreachPanel } from "./BreachPanel";
import { GenerationPanel } from "./GenerationPanel";

interface DashboardProps extends PasswordAnalysis {
  verdict: TestVerdict;
  variants: VariantsState;
  onRequestVariants: () => void;
}

export function Dashboard({
  entropy,
  breach,
  verdict,
  variants,
  onRequestVariants,
}: DashboardProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="grid h-[356px] grid-rows-[170px_170px] gap-4">
        <EntropyPanel entropy={entropy} />
        <BreachPanel breach={breach} />
      </div>

      <div className="h-[356px] min-h-0">
        <GenerationPanel
          verdict={verdict}
          variants={variants}
          onRequestVariants={onRequestVariants}
        />{" "}
      </div>
    </div>
  );
}
