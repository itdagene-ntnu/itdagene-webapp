import { ReactNode, useEffect, useState } from 'react';

interface ClientOnlyProps {
  children: ReactNode;
  [key: string]: any;
}

/**
 * ClientOnly component renders its children only after the component has mounted client-side.
 * This prevents hydration errors when server and client renders might differ due to dynamic content that depends on client-side state
 */
export function ClientOnly({ children, ...delegated }: ClientOnlyProps) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return null;
  }

  return <div {...delegated}>{children}</div>;
}

export default ClientOnly;
