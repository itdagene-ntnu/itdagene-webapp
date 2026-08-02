import React from 'react';
import { itdageneWordmark } from '../../config/brand';
import { announceHeaderActionVisibility } from '../../utils/heroHeaderHandoff';
import { resolveEmployerAction } from '../../utils/homepageActions';

type HeroTransitionRefs = {
  story: React.RefObject<HTMLElement>;
  scene: React.RefObject<HTMLDivElement>;
  media: React.RefObject<HTMLElement>;
  video: React.RefObject<HTMLVideoElement>;
  arrival: React.RefObject<HTMLDivElement>;
  compact: React.RefObject<HTMLDivElement>;
  interestAction: React.RefObject<HTMLDivElement>;
  scrollCue: React.RefObject<HTMLParagraphElement>;
  logoAnchor: React.RefObject<HTMLDivElement>;
  assembledLogo: React.RefObject<HTMLDivElement>;
};

type NavigatorWithConnection = Navigator & {
  connection?: {
    saveData?: boolean;
  };
};

type DocumentWithFonts = Document & {
  fonts?: {
    ready: Promise<unknown>;
  };
};

type HeroExperienceMode = 'cinematic' | 'static';
type HeroPreparationState = 'scrolled' | 'top';

const HERO_VIDEO = 'https://cdn.itdagene.no/itdagene.mp4';
const COUNTDOWN_MERGE_DURATION = 0.3;
const WORDMARK_CLOSED_CLIP = `${
  100 - (itdageneWordmark.markWidth / itdageneWordmark.width) * 100
}%`;
const useIsomorphicLayoutEffect =
  typeof window === 'undefined' ? React.useEffect : React.useLayoutEffect;

const resolveExperienceMode = (): HeroExperienceMode => {
  if (typeof window === 'undefined') {
    return 'static';
  }

  const reducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;
  const mobileLayout = window.matchMedia('(max-width: 800px)').matches;
  const saveData = (navigator as NavigatorWithConnection).connection?.saveData;

  return reducedMotion || mobileLayout || saveData ? 'static' : 'cinematic';
};

const waitForImage = async (image: HTMLImageElement): Promise<void> => {
  if (!image.complete) {
    try {
      await image.decode();
    } catch {
      // The natural-width check below selects the static fallback if needed.
    }
  }

  if (image.naturalWidth === 0) {
    throw new Error('The hero identity image could not be loaded.');
  }
};

const waitForLayout = (): Promise<void> =>
  new Promise((resolve) => {
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => resolve());
    });
  });

const getLayoutRect = (
  element: HTMLElement
): Pick<DOMRect, 'height' | 'left' | 'top' | 'width'> => {
  const offsetParent = element.offsetParent;

  if (!(offsetParent instanceof HTMLElement)) {
    return element.getBoundingClientRect();
  }

  const parentRect = offsetParent.getBoundingClientRect();
  return {
    height: element.offsetHeight,
    left:
      parentRect.left +
      offsetParent.clientLeft +
      element.offsetLeft -
      offsetParent.scrollLeft,
    top:
      parentRect.top +
      offsetParent.clientTop +
      element.offsetTop -
      offsetParent.scrollTop,
    width: element.offsetWidth,
  };
};

export const useHeroLogoTransition = (
  refs: HeroTransitionRefs,
  interestForm?: string | null
): void => {
  const [experienceMode, setExperienceMode] =
    React.useState<HeroExperienceMode>(resolveExperienceMode);
  const headerAction = React.useMemo(() => {
    const employerAction = resolveEmployerAction(interestForm);
    return {
      external: Boolean(interestForm),
      href: employerAction.href,
      label: employerAction.label,
    };
  }, [interestForm]);

  React.useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const mobileLayout = window.matchMedia('(max-width: 800px)');
    const updateExperienceMode = (): void => {
      setExperienceMode(resolveExperienceMode());
    };

    updateExperienceMode();
    reducedMotion.addEventListener('change', updateExperienceMode);
    mobileLayout.addEventListener('change', updateExperienceMode);

    return (): void => {
      reducedMotion.removeEventListener('change', updateExperienceMode);
      mobileLayout.removeEventListener('change', updateExperienceMode);
    };
  }, []);

  useIsomorphicLayoutEffect(() => {
    const story = refs.story.current;
    const scene = refs.scene.current;
    const media = refs.media.current;
    const video = refs.video.current;
    const arrival = refs.arrival.current;
    const compact = refs.compact.current;
    const interestAction = refs.interestAction.current;
    const scrollCue = refs.scrollCue.current;
    const logoAnchor = refs.logoAnchor.current;
    const assembledLogo = refs.assembledLogo.current;

    if (
      !story ||
      !scene ||
      !media ||
      !video ||
      !arrival ||
      !compact ||
      !interestAction ||
      !scrollCue ||
      !logoAnchor ||
      !assembledLogo
    ) {
      return;
    }

    const staticExperience = experienceMode === 'static';

    const setHeroMode = (
      mode: HeroExperienceMode | 'preparing',
      preparation?: HeroPreparationState
    ): void => {
      story.dataset.heroMode = mode;
      document.documentElement.dataset.heroMode = mode;

      if (preparation) {
        document.documentElement.dataset.heroPreparation = preparation;
      } else {
        delete document.documentElement.dataset.heroPreparation;
      }
    };
    const resolvePreparationState = (): HeroPreparationState =>
      window.scrollY > story.offsetTop + 1 ? 'scrolled' : 'top';
    const syncPreparationIdentity = (): void => {
      if (story.dataset.heroMode !== 'preparing') return;
      document.documentElement.dataset.heroPreparation =
        resolvePreparationState();
    };

    // Keep one complete identity visible while asynchronous motion is rebuilt.
    setHeroMode(
      staticExperience ? 'static' : 'preparing',
      staticExperience ? undefined : resolvePreparationState()
    );

    const setupStaticHeaderAction = (): (() => void) => {
      const updateHeaderAction = (): void => {
        const header = document.querySelector<HTMLElement>('.site-header');
        const actionRect = interestAction.getBoundingClientRect();
        const headerBottom = header?.getBoundingClientRect().bottom || 0;
        announceHeaderActionVisibility(
          actionRect.bottom <= headerBottom,
          headerAction
        );
      };

      updateHeaderAction();
      window.addEventListener('scroll', updateHeaderAction, { passive: true });
      window.addEventListener('resize', updateHeaderAction);

      return (): void => {
        window.removeEventListener('scroll', updateHeaderAction);
        window.removeEventListener('resize', updateHeaderAction);
        announceHeaderActionVisibility(false, headerAction);
      };
    };

    announceHeaderActionVisibility(false, headerAction);

    if (staticExperience) {
      const cleanupHeaderAction = setupStaticHeaderAction();
      return (): void => {
        cleanupHeaderAction();
        delete document.documentElement.dataset.heroMode;
        delete document.documentElement.dataset.heroPreparation;
      };
    }

    let cancelled = false;
    let gsapContext: { revert: () => void } | undefined;
    let heroTimeline:
      | { progress: (value: number, suppressEvents?: boolean) => unknown }
      | undefined;
    let cleanupFallbackHeaderAction: (() => void) | undefined;
    let cleanupMotionResize: (() => void) | undefined;

    window.addEventListener('scroll', syncPreparationIdentity, {
      passive: true,
    });

    const handleVideoFailure = (): void => {
      story.dataset.videoState = 'poster';
    };
    const enforceNaturalPlaybackRate = (): void => {
      video.defaultPlaybackRate = 1;
      if (video.playbackRate !== 1) video.playbackRate = 1;
    };
    const handlePlaying = (): void => {
      enforceNaturalPlaybackRate();
      story.dataset.videoState = 'playing';
    };

    video.addEventListener('playing', handlePlaying);
    video.addEventListener('ratechange', enforceNaturalPlaybackRate);
    video.addEventListener('error', handleVideoFailure);
    enforceNaturalPlaybackRate();
    video.src = HERO_VIDEO;
    video.load();
    video.play().catch(handleVideoFailure);

    const setupMotion = async (): Promise<void> => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import('gsap'),
        import('gsap/ScrollTrigger'),
      ]);

      if (cancelled) return;

      gsap.registerPlugin(ScrollTrigger);
      const header = document.querySelector<HTMLElement>('.site-header');
      const headerLogo =
        document.querySelector<HTMLImageElement>('.site-logo img');
      const assembledLogoImage =
        assembledLogo.querySelector<HTMLImageElement>('img');
      const navigationLinks = Array.from(
        document.querySelectorAll<HTMLElement>('.site-navigation li a')
      );
      const countdownTiles = Array.from(
        arrival.querySelectorAll<HTMLElement>('[data-countdown-tile]')
      );
      const countdownContent = Array.from(
        arrival.querySelectorAll<HTMLElement>('[data-countdown-content]')
      );
      const arrivalCopy = Array.from(
        arrival.querySelectorAll<HTMLElement>('[data-arrival-copy]')
      );

      if (!header || !headerLogo || !assembledLogoImage) {
        throw new Error('The hero transition requires the shared site header.');
      }

      await Promise.all([
        (document as DocumentWithFonts).fonts?.ready || Promise.resolve(),
        waitForImage(assembledLogoImage),
        waitForImage(headerLogo),
      ]);
      await waitForLayout();

      if (cancelled) return;

      const anchorRect = (): DOMRect => logoAnchor.getBoundingClientRect();
      const headerLogoRect = (): DOMRect => headerLogo.getBoundingClientRect();
      const assembledWidth = (): number => assembledLogo.offsetWidth;
      const assembledHeight = (): number => assembledLogo.offsetHeight;
      const assembledStartScale = (): number =>
        anchorRect().height / assembledHeight();

      gsapContext = gsap.context(() => {
        gsap.set(compact, { autoAlpha: 0, y: 28 });
        gsap.set(assembledLogo, {
          autoAlpha: 0,
          clipPath: `inset(0 ${WORDMARK_CLOSED_CLIP} 0 0)`,
          transformOrigin: 'left top',
        });
        gsap.set(headerLogo, { autoAlpha: 0 });

        const timeline = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: story,
            start: 'top top',
            end: 'bottom bottom',
            invalidateOnRefresh: true,
            onUpdate: ({ progress }): void => {
              announceHeaderActionVisibility(progress >= 0.18, headerAction);
            },
            scrub: 0.7,
          },
        });
        heroTimeline = timeline;

        timeline
          .set(
            assembledLogo,
            {
              scale: assembledStartScale,
              x: (): number => anchorRect().left,
              y: (): number => anchorRect().top,
            },
            0
          )
          .to(arrivalCopy, { autoAlpha: 0, duration: 0.12 }, 0.04)
          .to(countdownContent, { autoAlpha: 0, duration: 0.12 }, 0.08)
          .to(scrollCue, { autoAlpha: 0, duration: 0.1 }, 0.04);

        countdownTiles.forEach((tile) => {
          timeline.to(
            tile,
            {
              backgroundColor: '#007ab1',
              duration: COUNTDOWN_MERGE_DURATION,
              scale: (): number => {
                const tileRect = getLayoutRect(tile);
                return anchorRect().width / tileRect.width;
              },
              x: (): number => {
                const tileRect = getLayoutRect(tile);
                const targetRect = anchorRect();
                return (
                  targetRect.left +
                  targetRect.width / 2 -
                  (tileRect.left + tileRect.width / 2)
                );
              },
              y: (): number => {
                const tileRect = getLayoutRect(tile);
                const targetRect = anchorRect();
                return (
                  targetRect.top +
                  targetRect.height / 2 -
                  (tileRect.top + tileRect.height / 2)
                );
              },
            },
            0.14
          );
        });

        timeline
          .set(assembledLogo, { autoAlpha: 1 }, 0.46)
          .to(countdownTiles, { autoAlpha: 0, duration: 0.08 }, 0.46)
          .to(
            assembledLogo,
            {
              clipPath: 'inset(0 0% 0 0)',
              duration: 0.18,
            },
            0.5
          )
          .to(
            media,
            {
              clipPath: 'inset(0 0 0 50%)',
              duration: 0.36,
              scale: 0.985,
            },
            0.57
          )
          .to(compact, { autoAlpha: 1, duration: 0.24, y: 0 }, 0.62)
          .to(
            assembledLogo,
            {
              duration: 0.28,
              scale: (): number => headerLogoRect().width / assembledWidth(),
              x: (): number => headerLogoRect().left,
              y: (): number => headerLogoRect().top,
            },
            0.68
          )
          .to(
            header,
            {
              backgroundColor: 'rgba(255, 255, 255, 0.97)',
              borderBottomColor: 'rgba(216, 226, 232, 0.9)',
              duration: 0.24,
            },
            0.7
          )
          .to(
            navigationLinks,
            {
              color: '#586976',
              duration: 0.2,
            },
            0.72
          )
          .to(headerLogo, { autoAlpha: 1, duration: 0.05 }, 0.94)
          .to(assembledLogo, { autoAlpha: 0, duration: 0.05 }, 0.95);
      }, story);

      const synchronizeMotion = (): void => {
        ScrollTrigger.refresh();
        const scrollRange = Math.max(
          1,
          story.offsetHeight - window.innerHeight
        );
        const currentProgress = Math.max(
          0,
          Math.min(1, (window.scrollY - story.offsetTop) / scrollRange)
        );
        heroTimeline?.progress(currentProgress, false);
        ScrollTrigger.update();
      };
      let resizeFrame = 0;
      const handleMotionResize = (): void => {
        window.cancelAnimationFrame(resizeFrame);
        resizeFrame = window.requestAnimationFrame(() => {
          resizeFrame = window.requestAnimationFrame(synchronizeMotion);
        });
      };

      synchronizeMotion();
      window.addEventListener('resize', handleMotionResize);
      cleanupMotionResize = (): void => {
        window.removeEventListener('resize', handleMotionResize);
        window.cancelAnimationFrame(resizeFrame);
      };
      story.dataset.heroTransition = 'ready';
      setHeroMode('cinematic');
      window.removeEventListener('scroll', syncPreparationIdentity);
    };

    setupMotion().catch(() => {
      if (cancelled) return;
      cleanupMotionResize?.();
      gsapContext?.revert();
      delete story.dataset.heroTransition;
      setHeroMode('static');
      window.removeEventListener('scroll', syncPreparationIdentity);
      handleVideoFailure();
      video.pause();
      video.removeAttribute('src');
      video.load();
      cleanupFallbackHeaderAction = setupStaticHeaderAction();
    });

    return (): void => {
      cancelled = true;
      setHeroMode('preparing', resolvePreparationState());
      cleanupMotionResize?.();
      gsapContext?.revert();
      delete story.dataset.heroTransition;
      cleanupFallbackHeaderAction?.();
      window.removeEventListener('scroll', syncPreparationIdentity);
      video.removeEventListener('playing', handlePlaying);
      video.removeEventListener('ratechange', enforceNaturalPlaybackRate);
      video.removeEventListener('error', handleVideoFailure);
      video.pause();
      video.removeAttribute('src');
      video.load();
      announceHeaderActionVisibility(false, headerAction);
      window.requestAnimationFrame(() => {
        if (!document.querySelector('.event-hero-story')) {
          delete document.documentElement.dataset.heroMode;
          delete document.documentElement.dataset.heroPreparation;
        }
      });
    };
  }, [
    experienceMode,
    headerAction,
    refs.arrival,
    refs.assembledLogo,
    refs.compact,
    refs.interestAction,
    refs.logoAnchor,
    refs.media,
    refs.scene,
    refs.scrollCue,
    refs.story,
    refs.video,
  ]);
};
