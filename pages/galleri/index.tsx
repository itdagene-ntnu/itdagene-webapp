import { useCallback, useEffect, useRef, useState } from 'react';
import { withDataAndLayout, WithDataAndLayoutProps } from '../../lib/withData';
import { galleri_QueryResponse } from '../../__generated__/galleri_Query.graphql';
import { graphql } from 'react-relay';
import LazyImage from '../../components/LazyImage';
import ClientOnly from '../../components/ClientOnly';
import Modal from 'react-modal';
import {
  ContentStatePanel,
  MetadataList,
  PageHeader,
} from '../../components/DesignSystem';
import { editionConfig } from '../../config/edition';

const Galleri = ({
  props,
}: WithDataAndLayoutProps<galleri_QueryResponse>): JSX.Element => {
  const photos = props.photos || [];
  const [slideNumber, setSlideNumber] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const activePhoto = photos[slideNumber];
  const isHistoricalArchive =
    editionConfig.modules.gallery.configuredState !== 'published';
  const galleryEdition =
    (isHistoricalArchive && editionConfig.modules.gallery.historicalEdition) ||
    editionConfig.edition;

  const closeModal = useCallback((): void => setOpenModal(false), []);
  const previousPhoto = useCallback((): void => {
    setSlideNumber((current) =>
      current === 0 ? photos.length - 1 : current - 1
    );
  }, [photos.length]);
  const nextPhoto = useCallback((): void => {
    setSlideNumber((current) =>
      current + 1 === photos.length ? 0 : current + 1
    );
  }, [photos.length]);

  useEffect(() => {
    Modal.setAppElement('#__next');
  }, []);

  useEffect(() => {
    if (!openModal) {
      return;
    }
    const handleArrowKeys = (event: KeyboardEvent): void => {
      if (event.key === 'ArrowRight') {
        nextPhoto();
      }
      if (event.key === 'ArrowLeft') {
        previousPhoto();
      }
    };
    document.addEventListener('keydown', handleArrowKeys);
    return (): void => document.removeEventListener('keydown', handleArrowKeys);
  }, [nextPhoto, openModal, previousPhoto]);

  const openPhoto = (index: number): void => {
    setSlideNumber(index);
    setOpenModal(true);
  };

  return (
    <>
      <PageHeader
        description={
          isHistoricalArchive
            ? 'Dokumentariske glimt fra tidligere itDAGENE-arrangementer på NTNU.'
            : `Dokumentariske glimt fra itDAGENE ${galleryEdition} på NTNU.`
        }
        title="Galleri"
      >
        {photos.length > 0 && (
          <MetadataList
            items={[
              { label: 'Utgave', value: galleryEdition },
              { label: 'Bilder', value: photos.length },
            ]}
          />
        )}
      </PageHeader>

      {photos.length > 0 ? (
        <ClientOnly>
          <div className="gallery-grid">
            {photos.map((photo, index) => (
              <button
                aria-label={`Åpne bilde ${index + 1} av ${photos.length}`}
                key={photo.photo}
                onClick={(): void => openPhoto(index)}
                type="button"
              >
                <LazyImage
                  alt={`Foto fra itDAGENE, bilde ${index + 1}`}
                  height={460}
                  hover
                  src={`https://itdagene.no/uploads/${photo.photo}`}
                  width={700}
                />
              </button>
            ))}
          </div>
        </ClientOnly>
      ) : (
        <div className="gallery-empty">
          <ContentStatePanel
            description="Vi publiserer et kuratert utvalg når bildene er klare."
            state="unpublished"
            title="Galleriet er ikke publisert ennå."
          />
        </div>
      )}

      <Modal
        className="gallery-modal"
        contentLabel={
          activePhoto
            ? `Bilde ${slideNumber + 1} av ${photos.length}`
            : 'Galleri'
        }
        isOpen={openModal}
        onAfterOpen={(): void => closeButtonRef.current?.focus()}
        onRequestClose={closeModal}
        overlayClassName="gallery-modal-overlay"
      >
        <div className="gallery-modal__toolbar">
          <p>
            {slideNumber + 1} / {photos.length}
          </p>
          <button onClick={closeModal} ref={closeButtonRef} type="button">
            Lukk
          </button>
        </div>
        {activePhoto && (
          <img
            alt={`Foto fra itDAGENE, bilde ${slideNumber + 1}`}
            src={`https://itdagene.no/uploads/${activePhoto.photo}`}
          />
        )}
        <div className="gallery-modal__navigation">
          <button onClick={previousPhoto} type="button">
            ← Forrige
          </button>
          <button onClick={nextPhoto} type="button">
            Neste →
          </button>
        </div>
      </Modal>
    </>
  );
};

export default withDataAndLayout(Galleri, {
  query: graphql`
    query galleri_Query {
      photos {
        photo
      }
    }
  `,
  variables: {},
  layout: {
    responsive: true,
    customOpengraphMetadata: (): { title: string; description: string } => ({
      title: 'Galleri',
      description: 'Bilder fra itDAGENE på NTNU.',
    }),
  },
});
