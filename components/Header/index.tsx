import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react';
import {
  HERO_HEADER_ACTION_EVENT,
  HeroHeaderAction,
  HeroHeaderActionEvent,
} from '../../utils/heroHeaderHandoff';
import { resolveEmployerAction } from '../../utils/homepageActions';
import { requestMainFocusAfterNavigation } from '../../utils/navigationFocus';
import { SiteContainer } from '../DesignSystem';

type MenuItem = {
  key: string;
  name: string;
  to: string;
};

const items: MenuItem[] = [
  { key: 'program', name: 'Program', to: '/program' },
  { key: 'stands', name: 'Stands', to: '/stands' },
  { key: 'joblistings', name: 'Jobb', to: '/jobb' },
  { key: 'galleri', name: 'Galleri', to: '/galleri' },
  { key: 'faq', name: 'FAQ', to: '/faq' },
  { key: 'about-us', name: 'Om oss', to: '/om-itdagene' },
];

const isActiveRoute = (pathname: string, target: string): boolean =>
  pathname === target || pathname.startsWith(`${target}/`);

export const HeaderMenu = (): JSX.Element => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [cinematicHome, setCinematicHome] = useState(false);
  const [interestForm, setInterestForm] = useState<string | null | undefined>(
    undefined
  );
  const [showEmployerAction, setShowEmployerAction] = useState(
    router.pathname !== '/'
  );
  const [heroEmployerAction, setHeroEmployerAction] =
    useState<HeroHeaderAction>();
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setIsOpen(false);
  }, [router.asPath]);

  useEffect(() => {
    if (router.pathname !== '/') {
      setShowEmployerAction(true);
      return;
    }

    setShowEmployerAction(false);
    const handleHandoff = (event: Event): void => {
      const handoff = event as CustomEvent<HeroHeaderActionEvent>;
      setHeroEmployerAction(handoff.detail.action);
      setShowEmployerAction(handoff.detail.visible);
    };

    window.addEventListener(HERO_HEADER_ACTION_EVENT, handleHandoff);
    return (): void => {
      window.removeEventListener(HERO_HEADER_ACTION_EVENT, handleHandoff);
    };
  }, [router.pathname]);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent): void => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    document.addEventListener('keydown', closeOnEscape);
    return (): void => document.removeEventListener('keydown', closeOnEscape);
  }, [isOpen]);

  useEffect(() => {
    const updateHeaderMode = (): void => {
      const supportsCinematic =
        router.pathname === '/' &&
        window.matchMedia('(min-width: 801px)').matches &&
        !window.matchMedia('(prefers-reduced-motion: reduce)').matches &&
        !(
          navigator as Navigator & {
            connection?: { saveData?: boolean };
          }
        ).connection?.saveData;

      setCinematicHome(supportsCinematic);
    };

    updateHeaderMode();
    window.addEventListener('resize', updateHeaderMode);
    return (): void => {
      window.removeEventListener('resize', updateHeaderMode);
    };
  }, [router.pathname]);

  useEffect(() => {
    const controller = new AbortController();

    fetch('/api/graphql', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: '{ currentMetaData { interestForm } }',
      }),
      signal: controller.signal,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Could not load interest registration state.');
        }
        return response.json() as Promise<{
          data?: { currentMetaData?: { interestForm?: string | null } | null };
        }>;
      })
      .then((response) =>
        setInterestForm(response.data?.currentMetaData?.interestForm || null)
      )
      .catch(() => {
        if (!controller.signal.aborted) {
          setInterestForm(undefined);
        }
      });

    return (): void => controller.abort();
  }, []);

  const resolvedEmployerAction =
    interestForm === undefined
      ? { href: '/faq', label: 'For bedrifter' }
      : resolveEmployerAction(interestForm);
  const employerAction =
    router.pathname === '/' && heroEmployerAction
      ? heroEmployerAction
      : resolvedEmployerAction;

  const navigateAndFocus = (
    event: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ): void => {
    if (
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

    event.preventDefault();
    setIsOpen(false);
    requestMainFocusAfterNavigation();
    router.push(href);
  };

  return (
    <header
      className={['site-header', cinematicHome && 'site-header--cinematic']
        .filter(Boolean)
        .join(' ')}
    >
      <SiteContainer className="site-header__inner">
        <Link aria-label="itDAGENE - forsiden" className="site-logo" href="/">
          <img
            alt=""
            data-hero-logo-target
            height="114"
            src="https://cdn.itdagene.no/itdagene.svg"
            width="503"
          />
        </Link>

        <button
          aria-controls="primary-navigation"
          aria-expanded={isOpen}
          aria-label={isOpen ? 'Lukk meny' : 'Åpne meny'}
          className="menu-toggle"
          onClick={(): void => setIsOpen((open) => !open)}
          ref={menuButtonRef}
          type="button"
        >
          <span />
          <span />
          <span />
        </button>

        <nav
          aria-label="Hovedmeny"
          className={`site-navigation${isOpen ? ' is-open' : ''}`}
          id="primary-navigation"
        >
          <ul>
            {items.map((item) => (
              <li key={item.key}>
                <Link
                  aria-current={
                    isActiveRoute(router.pathname, item.to) ? 'page' : undefined
                  }
                  className={`site-navigation__link site-navigation__link--${item.key}`}
                  href={item.to}
                  onClick={(event): void => navigateAndFocus(event, item.to)}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
          <a
            className={`site-navigation__employer${
              interestForm ? ' site-navigation__employer--open' : ''
            }${
              showEmployerAction
                ? ' site-navigation__employer--visible'
                : ' site-navigation__employer--hidden'
            }`}
            href={employerAction.href}
            aria-hidden={!showEmployerAction}
            rel={interestForm ? 'noreferrer' : undefined}
            tabIndex={showEmployerAction ? undefined : -1}
            target={interestForm ? '_blank' : undefined}
          >
            {employerAction.label}
          </a>
        </nav>
      </SiteContainer>
    </header>
  );
};

export default HeaderMenu;
