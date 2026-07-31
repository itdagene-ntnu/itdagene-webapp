import React from 'react';

export type CompanyLogoData = {
  readonly name: string;
  readonly logo?: string | null;
  readonly url?: string | null;
};

const joinClassNames = (...names: Array<string | undefined | false>): string =>
  names.filter(Boolean).join(' ');

export const CompanyLogo = ({
  className,
  company,
  fallbackClassName,
  height,
  imageClassName,
  link = Boolean(company.url),
  loading = 'lazy',
  width,
}: {
  className?: string;
  company: CompanyLogoData;
  fallbackClassName?: string;
  height: number;
  imageClassName?: string;
  link?: boolean;
  loading?: 'eager' | 'lazy';
  width: number;
}): JSX.Element => {
  const [failedLogo, setFailedLogo] = React.useState<string | null>(null);
  const logo = company.logo || null;
  const showsLogo = Boolean(logo) && failedLogo !== logo;
  const handleImageRef = React.useCallback(
    (image: HTMLImageElement | null): void => {
      if (image?.complete && image.naturalWidth === 0) {
        setFailedLogo(logo);
      }
    },
    [logo]
  );
  const content = showsLogo ? (
    <img
      alt={`${company.name} logo`}
      className={imageClassName}
      decoding="async"
      height={height}
      loading={loading}
      onError={(): void => setFailedLogo(logo)}
      ref={handleImageRef}
      src={logo || undefined}
      width={width}
    />
  ) : (
    <span
      className={joinClassNames('company-logo__fallback', fallbackClassName)}
    >
      {company.name}
    </span>
  );
  const rootClassName = joinClassNames('company-logo', className);

  if (link && company.url) {
    return (
      <a
        className={rootClassName}
        data-logo-state={showsLogo ? 'image' : 'fallback'}
        href={company.url}
        rel="noreferrer"
        target="_blank"
      >
        {content}
      </a>
    );
  }

  return (
    <span
      className={rootClassName}
      data-logo-state={showsLogo ? 'image' : 'fallback'}
    >
      {content}
    </span>
  );
};
