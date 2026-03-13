import Link from "next/link";
import { type ReactNode } from "react";

type ButtonVariant = "outline" | "filled" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface BaseProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: ReactNode;
  disabled?: boolean;
}

interface ButtonAsButton extends BaseProps {
  as?: "button";
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  href?: never;
}

interface ButtonAsLink extends BaseProps {
  as: "link";
  href: string;
  onClick?: never;
  type?: never;
}

type ButtonProps = ButtonAsButton | ButtonAsLink;

const variantClasses: Record<ButtonVariant, string> = {
  outline:
    "btn-sweep border border-sapling text-sapling hover:text-lunar transition-colors duration-300",
  filled:
    "bg-sapling text-lunar hover:bg-sapling/90 transition-colors duration-200",
  ghost:
    "text-sapling hover:text-white border-b border-sapling/0 hover:border-sapling transition-all duration-200",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "font-heading text-xs tracking-nav px-4 py-2",
  md: "font-heading text-xs tracking-nav px-6 py-3",
  lg: "font-heading text-sm tracking-nav px-8 py-4",
};

/**
 * Universal Button primitive.
 * Renders as <button> by default, or as <Link> with as="link".
 * Variant "outline" includes the Sapling sweep effect from globals.css.
 */
export default function Button({
  variant = "outline",
  size = "md",
  className = "",
  children,
  disabled,
  ...props
}: ButtonProps) {
  const base = `inline-flex items-center justify-center ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  if (props.as === "link") {
    return (
      <Link href={props.href} className={base}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={props.type ?? "button"}
      onClick={props.onClick}
      disabled={disabled}
      className={`${base} disabled:opacity-40 disabled:cursor-not-allowed`}
    >
      {children}
    </button>
  );
}
