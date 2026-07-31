import Link from 'next/link';
import React from 'react';
import { ContentState } from '../../config/edition';
import {
  CompanyMarqueeItem,
  splitCompanyMarqueeLanes,
} from '../../utils/companyMarquee';
import { CompanyLogo } from './CompanyLogo';

const joinClassNames = (...names: Array<string | undefined | false>): string =>
  names.filter(Boolean).join(' ');

export const SiteContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}): JSX.Element => (
  <div className={joinClassNames('site-container', className)}>{children}</div>
);

export const SiteSection = ({
  children,
  className,
  id,
  tone = 'default',
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
  tone?: 'default' | 'muted' | 'warm' | 'brand' | 'dark';
}): JSX.Element => (
  <section
    className={joinClassNames(
      'site-section',
      tone !== 'default' && `site-section--${tone}`,
      className
    )}
    id={id}
  >
    <SiteContainer>{children}</SiteContainer>
  </section>
);

const MarqueeItem = ({
  item,
  loading,
}: {
  item: CompanyMarqueeItem;
  loading: 'eager' | 'lazy';
}): JSX.Element => (
  <li
    className={`event-marquee__item event-marquee__item--${
      item.logo ? 'logo' : 'name'
    }`}
  >
    <CompanyLogo
      className="event-marquee__asset"
      company={item}
      fallbackClassName="event-marquee__name"
      height={72}
      imageClassName="event-marquee__logo"
      link={false}
      loading={loading}
      width={192}
    />
  </li>
);

const MarqueeGroup = ({
  items,
  hidden = false,
}: {
  items: ReadonlyArray<CompanyMarqueeItem>;
  hidden?: boolean;
}): JSX.Element => (
  <ul
    aria-hidden={hidden || undefined}
    className="event-marquee__group"
    data-marquee-copy={hidden ? 'duplicate' : 'primary'}
  >
    {items.map((item, index) => (
      <MarqueeItem
        item={item}
        key={`${item.id}-${index}`}
        loading={hidden ? 'lazy' : 'eager'}
      />
    ))}
  </ul>
);

export const EventMarquee = ({
  items,
  label,
}: {
  items: CompanyMarqueeItem[];
  label: string;
}): JSX.Element => {
  const marqueeRef = React.useRef<HTMLElement>(null);
  const lanes = splitCompanyMarqueeLanes(items);
  const duration = Math.max(38, Math.min(items.length * 2.1, 118));
  const marqueeStyle = {
    '--marquee-duration': `${duration}s`,
  } as React.CSSProperties;
  const updatePlaybackRate = (rate: number): void => {
    const tracks = marqueeRef.current?.querySelectorAll<HTMLElement>(
      '.event-marquee__track'
    );

    tracks?.forEach((track) => {
      track
        .getAnimations()
        .forEach((animation) => animation.updatePlaybackRate(rate));
    });

    if (marqueeRef.current) {
      marqueeRef.current.dataset.speed = rate < 1 ? 'slow' : 'normal';
    }
  };

  return (
    <aside
      aria-label={`${label}. To bedriftsløp i motsatt retning.`}
      className="event-marquee"
      data-testid="event-marquee"
      onBlur={(): void => updatePlaybackRate(1)}
      onFocus={(): void => updatePlaybackRate(0.35)}
      onMouseEnter={(): void => updatePlaybackRate(0.35)}
      onMouseLeave={(): void => updatePlaybackRate(1)}
      ref={marqueeRef}
      tabIndex={0}
    >
      <div className="event-marquee__meta">
        <p className="event-marquee__label" data-marquee-label>
          {label}
        </p>
      </div>
      {lanes.map((lane, index) => {
        const direction = index === 0 ? 'left' : 'right';

        return (
          <div
            className="event-marquee__lane"
            data-direction={direction}
            data-testid="company-marquee-lane"
            key={direction}
          >
            <div
              className="event-marquee__track"
              data-direction={direction}
              style={marqueeStyle}
            >
              <MarqueeGroup items={lane} />
              <MarqueeGroup hidden items={lane} />
            </div>
          </div>
        );
      })}
    </aside>
  );
};

export const SectionHeading = ({
  title,
  description,
  eyebrow,
  action,
}: {
  title: string;
  description?: string;
  eyebrow?: string;
  action?: { href: string; label: string };
}): JSX.Element => (
  <div className="section-heading">
    <div className="section-heading__copy">
      {eyebrow && <p className="site-eyebrow">{eyebrow}</p>}
      <h2>{title}</h2>
      {description && <p>{description}</p>}
    </div>
    {action && (
      <ActionLink href={action.href} variant="text">
        {action.label}
      </ActionLink>
    )}
  </div>
);

export const PageHeader = ({
  title,
  description,
  eyebrow,
  children,
}: {
  title: string;
  description?: string;
  eyebrow?: string;
  children?: React.ReactNode;
}): JSX.Element => (
  <header className="page-header">
    <div className="page-header__copy">
      {eyebrow && <p className="site-eyebrow">{eyebrow}</p>}
      <h1>{title}</h1>
      {description && <p>{description}</p>}
    </div>
    {children && <div className="page-header__aside">{children}</div>}
  </header>
);

export const SegmentedControl = ({
  options,
  activeValue,
  onChange,
  label,
}: {
  options: Array<{ value: string; label: string }>;
  activeValue: string;
  onChange: (value: string) => void;
  label: string;
}): JSX.Element => (
  <div aria-label={label} className="segmented-control" role="group">
    {options.map((option) => (
      <button
        aria-pressed={option.value === activeValue}
        className="segmented-control__item"
        data-active={option.value === activeValue}
        key={option.value}
        onClick={(): void => onChange(option.value)}
        type="button"
      >
        {option.label}
      </button>
    ))}
  </div>
);

export const ActionLink = ({
  children,
  href,
  variant = 'primary',
  external = false,
}: {
  children: React.ReactNode;
  href: string;
  variant?: 'primary' | 'secondary' | 'text' | 'accent';
  external?: boolean;
}): JSX.Element => {
  const className = joinClassNames(
    'site-action',
    variant !== 'primary' && `site-action--${variant}`
  );
  const usesDocumentNavigation =
    external ||
    href.startsWith('http://') ||
    href.startsWith('https://') ||
    href.startsWith('mailto:') ||
    href.startsWith('tel:');

  if (usesDocumentNavigation) {
    const opensNewWindow =
      external || href.startsWith('http://') || href.startsWith('https://');
    return (
      <a
        className={className}
        href={href}
        rel={opensNewWindow ? 'noreferrer' : undefined}
        target={opensNewWindow ? '_blank' : undefined}
      >
        {children}
      </a>
    );
  }

  return (
    <Link className={className} href={href}>
      {children}
    </Link>
  );
};

const stateContent: Record<
  Exclude<ContentState, 'published'>,
  { label: string; title: string }
> = {
  unavailable: {
    label: 'Ikke tilgjengelig',
    title: 'Dette innholdet er ikke tilgjengelig ennå.',
  },
  unpublished: {
    label: 'Kommer senere',
    title: 'Innholdet publiseres når det er klart.',
  },
  empty: {
    label: 'Ingen treff',
    title: 'Det finnes ikke noe innhold her akkurat nå.',
  },
  stale: {
    label: 'Tidligere utgave',
    title: 'Dette innholdet tilhører en tidligere utgave.',
  },
  error: {
    label: 'Kunne ikke lastes',
    title: 'Vi fikk ikke hentet innholdet.',
  },
};

export const ContentStatePanel = ({
  state,
  title,
  description,
  action,
  compact = false,
}: {
  state: Exclude<ContentState, 'published'>;
  title?: string;
  description?: string;
  action?: { href: string; label: string };
  compact?: boolean;
}): JSX.Element => {
  const defaults = stateContent[state];
  return (
    <div
      className={joinClassNames(
        'content-state',
        compact && 'content-state--compact'
      )}
      data-state={state}
      role={state === 'error' ? 'alert' : 'status'}
    >
      <p className="content-state__label">{defaults.label}</p>
      <h3>{title || defaults.title}</h3>
      {description && <p>{description}</p>}
      {action && (
        <ActionLink href={action.href} variant="text">
          {action.label}
        </ActionLink>
      )}
    </div>
  );
};

export const MetadataList = ({
  items,
}: {
  items: Array<{ label: string; value: React.ReactNode }>;
}): JSX.Element => (
  <dl className="metadata-list">
    {items.map(({ label, value }) => (
      <div className="metadata-list__item" key={label}>
        <dt>{label}</dt>
        <dd>{value}</dd>
      </div>
    ))}
  </dl>
);
