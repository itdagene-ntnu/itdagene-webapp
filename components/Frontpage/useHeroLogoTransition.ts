import React from 'react';
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

type HeroExperienceMode = 'cinematic' | 'static';

const HERO_VIDEO = 'https://cdn.itdagene.no/itdagene.mp4';
const FAIR_SEQUENCE_START = 22;
const FAIR_SEQUENCE_END = 36;

export const useHeroLogoTransition = (
  refs: HeroTransitionRefs,
  interestForm?: string | null
): void => {
  const [experienceMode, setExperienceMode] =
    React.useState<HeroExperienceMode>('static');
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
    const saveData = (navigator as NavigatorWithConnection).connection
      ?.saveData;
    const updateExperienceMode = (): void => {
      setExperienceMode(
        reducedMotion.matches || mobileLayout.matches || saveData
          ? 'static'
          : 'cinematic'
      );
    };

    updateExperienceMode();
    reducedMotion.addEventListener('change', updateExperienceMode);
    mobileLayout.addEventListener('change', updateExperienceMode);

    return (): void => {
      reducedMotion.removeEventListener('change', updateExperienceMode);
      mobileLayout.removeEventListener('change', updateExperienceMode);
    };
  }, []);

  React.useEffect(() => {
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

    story.dataset.heroMode = staticExperience ? 'static' : 'cinematic';
    document.documentElement.dataset.heroMode = staticExperience
      ? 'static'
      : 'cinematic';

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
      };
    }

    let cancelled = false;
    let gsapContext: { revert: () => void } | undefined;
    let cleanupFallbackHeaderAction: (() => void) | undefined;

    const beginFairSequence = (): void => {
      if (
        Number.isFinite(video.duration) &&
        video.duration > FAIR_SEQUENCE_START
      ) {
        video.currentTime = FAIR_SEQUENCE_START;
      }
    };
    const keepFairSequence = (): void => {
      if (video.currentTime >= FAIR_SEQUENCE_END) {
        video.currentTime = FAIR_SEQUENCE_START;
      }
    };
    const handlePlaying = (): void => {
      story.dataset.videoState = 'playing';
    };
    const handleVideoFailure = (): void => {
      story.dataset.videoState = 'poster';
    };

    video.addEventListener('loadedmetadata', beginFairSequence);
    video.addEventListener('timeupdate', keepFairSequence);
    video.addEventListener('playing', handlePlaying);
    video.addEventListener('error', handleVideoFailure);
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
      const headerLogo = document.querySelector<HTMLElement>('.site-logo img');
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

      if (!header || !headerLogo) {
        throw new Error('The hero transition requires the shared site header.');
      }

      const anchorRect = (): DOMRect => logoAnchor.getBoundingClientRect();
      const headerLogoRect = (): DOMRect => headerLogo.getBoundingClientRect();
      const assembledWidth = (): number => assembledLogo.offsetWidth;
      const assembledHeight = (): number => assembledLogo.offsetHeight;
      const assembledStartX = (): number =>
        anchorRect().left - anchorRect().width / 2 - assembledHeight() / 2;
      const assembledStartY = (): number =>
        anchorRect().top - anchorRect().height / 2 - assembledHeight() / 2;

      gsapContext = gsap.context(() => {
        gsap.set(compact, { autoAlpha: 0, y: 28 });
        gsap.set(assembledLogo, {
          autoAlpha: 0,
          clipPath: 'inset(0 77.36% 0 0)',
          transformOrigin: 'left top',
          x: assembledStartX,
          y: assembledStartY,
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

        timeline
          .to(arrivalCopy, { autoAlpha: 0, duration: 0.12 }, 0.04)
          .to(countdownContent, { autoAlpha: 0, duration: 0.12 }, 0.08)
          .to(scrollCue, { autoAlpha: 0, duration: 0.1 }, 0.04);

        countdownTiles.forEach((tile) => {
          timeline.to(
            tile,
            {
              backgroundColor: '#007ab1',
              duration: 0.34,
              scale: (): number =>
                anchorRect().width / tile.getBoundingClientRect().width,
              x: (): number => {
                const tileRect = tile.getBoundingClientRect();
                return (
                  anchorRect().left +
                  anchorRect().width / 2 -
                  (tileRect.left + tileRect.width / 2)
                );
              },
              y: (): number => {
                const tileRect = tile.getBoundingClientRect();
                return (
                  anchorRect().top +
                  anchorRect().height / 2 -
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
    };

    setupMotion().catch(() => {
      if (cancelled) return;
      gsapContext?.revert();
      story.dataset.heroMode = 'static';
      document.documentElement.dataset.heroMode = 'static';
      handleVideoFailure();
      video.pause();
      video.removeAttribute('src');
      video.load();
      cleanupFallbackHeaderAction = setupStaticHeaderAction();
    });

    return (): void => {
      cancelled = true;
      gsapContext?.revert();
      cleanupFallbackHeaderAction?.();
      video.removeEventListener('loadedmetadata', beginFairSequence);
      video.removeEventListener('timeupdate', keepFairSequence);
      video.removeEventListener('playing', handlePlaying);
      video.removeEventListener('error', handleVideoFailure);
      video.pause();
      video.removeAttribute('src');
      video.load();
      announceHeaderActionVisibility(false, headerAction);
      delete document.documentElement.dataset.heroMode;
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
