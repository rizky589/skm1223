import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl text-sm font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-orange-500 text-white shadow-lg shadow-orange-500/25 hover:-translate-y-0.5 hover:bg-orange-400 hover:shadow-xl hover:shadow-orange-500/30",
        navy: "bg-[#0b2a5b] text-white shadow-lg shadow-sky-950/30 hover:bg-[#123b78]",
        secure: "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 hover:bg-emerald-400",
        outline: "border border-white/45 bg-white/70 text-[#0b2a5b] shadow-sm backdrop-blur hover:-translate-y-0.5 hover:border-orange-300 hover:bg-white hover:shadow-md",
        ghost: "text-[#0b2a5b] hover:bg-white/70"
      },
      size: {
        default: "h-11 px-5 py-2",
        sm: "h-11 px-4",
        lg: "h-13 px-7 text-base",
        icon: "h-11 w-11"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
