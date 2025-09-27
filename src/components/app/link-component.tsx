import { Slot } from "@radix-ui/react-slot";
import Link from "next/link";
import { type AnchorHTMLAttributes, type ReactNode } from "react";

interface LinkComponentProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  asChild?: boolean;
  children: ReactNode;
}

/**
 * A wrapper around Next.js Link that correctly handles the asChild prop
 * using Radix UI's Slot component. This prevents passing the asChild prop
 * down to native DOM elements like <a>.
 *
 * Use `asChild` when the direct child component should receive the link props
 * (e.g., wrapping a custom button component). Omit `asChild` for a standard
 * anchor tag rendering.
 */
export function LinkComponent({ asChild = false, href, children, ...props }: LinkComponentProps) {
  // Determine the component to render: Slot if asChild is true, otherwise 'a'
  const Comp = asChild ? Slot : "a";

  return (
    // Use legacyBehavior with passHref when using Slot or a custom component
    // to ensure props are passed correctly.
    <Link href={href} passHref legacyBehavior>
      <Comp {...props}>{children}</Comp>
    </Link>
  );
}
