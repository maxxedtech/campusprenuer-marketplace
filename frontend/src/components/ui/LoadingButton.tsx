import * as React from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ButtonProps } from "@/components/ui/button";

type LoadingButtonProps = ButtonProps & {
  loading?: boolean;
  loadingText?: string; // optional (if you still want “Signing in…”)
  showDots?: boolean;   // animated dots
};

export function LoadingButton({
  loading = false,
  loadingText,
  showDots = true,
  disabled,
  children,
  className,
  ...props
}: LoadingButtonProps) {
  return (
    <Button
      {...props}
      disabled={disabled || loading}
      className={`relative ${className ?? ""}`}
    >
      {/* spinner */}
      <Loader2 className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : "hidden"}`} />

      {/* keep main label stable */}
      <span className={loading ? "opacity-80" : ""}>
        {loading && loadingText ? loadingText : children}
      </span>

      {/* optional animated dots */}
      {showDots && (
        <span className={loading ? "ml-1 inline-flex" : "hidden"}>
          <span className="animate-bounce [animation-delay:-0.2s]">.</span>
          <span className="animate-bounce [animation-delay:-0.1s]">.</span>
          <span className="animate-bounce">.</span>
        </span>
      )}
    </Button>
  );
}
