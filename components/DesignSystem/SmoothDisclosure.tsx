import React from 'react';

type Props = {
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
  contentId: string;
  defaultOpen?: boolean;
  /**
   * The shared "+ turns into ×" affordance. Every disclosure on the site uses
   * it, so it lives here rather than being restyled per feature. Placement is
   * the caller's job: the marker is a plain child of the trigger.
   */
  marker?: 'cross' | 'none';
  onOpenChange?: (open: boolean) => void;
  /** Pass to drive the open state from outside; omit to let it manage itself. */
  open?: boolean;
  summary: React.ReactNode;
  triggerClassName?: string;
  /** data-* hooks for the trigger, kept separate so the props above stay typed. */
  triggerData?: Record<string, string>;
  triggerProps?: Omit<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    'aria-controls' | 'aria-expanded' | 'className' | 'onClick' | 'type'
  >;
};

const joinClassNames = (...names: Array<string | undefined>): string =>
  names.filter(Boolean).join(' ');

export const SmoothDisclosure = ({
  children,
  className,
  contentClassName,
  contentId,
  defaultOpen = false,
  marker = 'cross',
  onOpenChange,
  open,
  summary,
  triggerClassName,
  triggerData,
  triggerProps,
}: Props): JSX.Element => {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : uncontrolledOpen;
  const inertAttributes = isOpen
    ? {}
    : ({ inert: '' } as React.HTMLAttributes<HTMLDivElement>);

  const toggle = (): void => {
    if (!isControlled) setUncontrolledOpen(!isOpen);
    onOpenChange?.(!isOpen);
  };

  return (
    <div
      className={joinClassNames('smooth-disclosure', className)}
      data-open={isOpen}
    >
      <button
        {...triggerProps}
        {...triggerData}
        aria-controls={contentId}
        aria-expanded={isOpen}
        className={joinClassNames(
          'smooth-disclosure__trigger',
          triggerClassName
        )}
        onClick={toggle}
        type="button"
      >
        {summary}
        {marker === 'cross' && (
          <span aria-hidden="true" className="smooth-disclosure__marker" />
        )}
      </button>
      <div
        {...inertAttributes}
        aria-hidden={!isOpen}
        className="smooth-disclosure__motion"
        data-disclosure-motion
        id={contentId}
      >
        <div className="smooth-disclosure__clip">
          <div
            className={joinClassNames(
              'smooth-disclosure__content',
              contentClassName
            )}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
