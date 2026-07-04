import { useEffect, useState, type ReactNode } from "react";

/**
 * Renders children only after client mount. Use to wrap libraries whose
 * default export shape breaks under TanStack Start SSR (e.g. react-slick).
 */
export function ClientOnly({ children, fallback = null }: { children: ReactNode; fallback?: ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <>{fallback}</>;
  return <>{children}</>;
}
