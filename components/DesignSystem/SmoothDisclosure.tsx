import React from 'react';

type Props = {
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
  contentId: string;
  summary: React.ReactNode;
};

const joinClassNames = (...names: Array<string | undefined>): string =>
  names.filter(Boolean).join(' ');

export const SmoothDisclosure = ({
  children,
  className,
  contentClassName,
  contentId,
  summary,
}: Props): JSX.Element => {
  const [open, setOpen] = React.useState(false);
  const inertAttributes = open
    ? {}
    : ({ inert: '' } as React.HTMLAttributes<HTMLDivElement>);

  return (
    <div
      className={joinClassNames('smooth-disclosure', className)}
      data-open={open}
    >
      <button
        aria-controls={contentId}
        aria-expanded={open}
        className="smooth-disclosure__trigger"
        onClick={(): void => setOpen((current) => !current)}
        type="button"
      >
        {summary}
      </button>
      <div
        {...inertAttributes}
        aria-hidden={!open}
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
