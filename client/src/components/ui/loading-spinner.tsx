import * as React from "react";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "default" | "dots" | "pulse";
}

const LoadingSpinner = React.forwardRef<HTMLDivElement, LoadingSpinnerProps>(
  ({ className, size = "md", variant = "default", ...props }, ref) => {
    const sizeClasses = {
      sm: "h-4 w-4",
      md: "h-8 w-8",
      lg: "h-12 w-12",
      xl: "h-16 w-16",
    };

    if (variant === "dots") {
      return (
        <div ref={ref} className={cn("flex space-x-1", className)} {...props}>
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={cn(
                "rounded-full bg-purple-500 animate-bounce",
                size === "sm"
                  ? "h-1 w-1"
                  : size === "md"
                  ? "h-2 w-2"
                  : "h-3 w-3"
              )}
              style={{ animationDelay: `${i * 0.1}s` }}
            />
          ))}
        </div>
      );
    }

    if (variant === "pulse") {
      return (
        <div
          ref={ref}
          className={cn(
            "rounded-full bg-gradient-to-r from-purple-500 to-pink-500 animate-pulse",
            sizeClasses[size],
            className
          )}
          {...props}
        />
      );
    }

    return (
      <div ref={ref} className={cn("relative", className)} {...props}>
        <div
          className={cn(
            "animate-spin rounded-full border-4 border-purple-200 border-t-purple-600",
            sizeClasses[size]
          )}
        />
        <div
          className={cn(
            "absolute inset-0 animate-ping rounded-full border-4 border-purple-300 opacity-20",
            sizeClasses[size]
          )}
        />
      </div>
    );
  }
);
LoadingSpinner.displayName = "LoadingSpinner";

export { LoadingSpinner };
