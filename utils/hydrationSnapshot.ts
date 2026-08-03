export const selectHydrationQueryProps = <T>({
  hasHydrated,
  initialQueryProps,
  liveQueryProps,
}: {
  hasHydrated: boolean;
  initialQueryProps?: T;
  liveQueryProps: T | null;
}): T | null =>
  !hasHydrated && initialQueryProps !== undefined
    ? initialQueryProps
    : liveQueryProps;
