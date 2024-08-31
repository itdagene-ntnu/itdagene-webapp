import styled from 'styled-components';
import {
  ChangeEvent,
  ReactElement,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { itdageneBlue } from '../../utils/colors';
import {
  withDataAndLayout,
  WithDataAndLayoutProps,
  WithDataDataProps,
} from '../../lib/withData';
import { galleri_QueryResponse } from '../../__generated__/galleri_Query.graphql';
import { graphql } from 'react-relay';
import LazyImage from '../../components/LazyImage';

const GalleryWrap = styled('div')`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
  justify-content: center;
  max-width: 1120px;
  margin: 0 auto 60px;
`;

const SliderWrap = styled('div')`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 999;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  @media only screen and (max-width: 767px) {
    display: none;
  }
`;

const Title = styled('h1')`
  font-weight: bold;
  font-smoothing: antialiased;
  font-size: 3rem;
  margin-bottom: 1rem;
`;

const StyledButton = ({
  name,
  top = '50%',
  right = '40px',
  left,
  rotate,
  onClick,
}: {
  name: string;
  top?: string;
  right?: string;
  left?: string;
  rotate?: string;
  onClick: (e: React.ChangeEvent<HTMLInputElement>) => void;
}): ReactElement => {
  return (
    <>
      {/* eslint-disable-next-line*/}
      {/* @ts-ignore*/}
      <ion-icon
        onClick={(event: ChangeEvent<HTMLInputElement>): void => {
          event.stopPropagation();
          onClick(event);
        }}
        style={{
          position: 'fixed',
          fontSize: '65px',
          color: itdageneBlue,
          top: top,
          right: right,
          left: left,
          cursor: 'pointer',
          transform: rotate ? `rotate(${rotate})` : 'none',
        }}
        name={name}
      />
    </>
  );
};

const Galleri = ({
  error,
  props,
}: WithDataAndLayoutProps<galleri_QueryResponse>): JSX.Element => {
  const [slideNumber, setSlideNumber] = useState(0);
  const [openModal, setOpenModal] = useState(false);

  const handleOpenModal = (index: number): void => {
    setSlideNumber(index);
    setOpenModal(true);
  };

  // Close Modal
  const handleCloseModal = (): void => {
    setOpenModal(false);
  };

  // Previous Image
  const prevSlide = (): void => {
    if (!props.photos) return;
    slideNumber === 0
      ? setSlideNumber(props.photos.length - 1)
      : setSlideNumber(slideNumber - 1);
  };

  // Next Image
  const nextSlide = (): void => {
    if (!props.photos) return;
    slideNumber + 1 === props.photos.length
      ? setSlideNumber(0)
      : setSlideNumber(slideNumber + 1);
  };

  const changeImageOnKey = useCallback(
    (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        handleCloseModal();
      }
      if (event.key === 'ArrowRight') nextSlide();
      if (event.key === 'ArrowLeft') prevSlide();
    },
    [slideNumber]
  );

  useEffect(() => {
    document.addEventListener('keydown', changeImageOnKey);
    return function cleanup(): void {
      document.removeEventListener('keydown', changeImageOnKey);
    };
  });

  return (
    <>
      <Title>Galleri</Title>
      {props.photos ? (
        <>
          {openModal && (
            <SliderWrap onClick={(): void => handleCloseModal()}>
              <StyledButton
                name="add-outline"
                top="40px"
                rotate="45deg"
                onClick={handleCloseModal}
              />
              <StyledButton
                name="arrow-back-outline"
                left="40px"
                onClick={prevSlide}
              />
              <StyledButton name="arrow-forward-outline" onClick={nextSlide} />
              <LazyImage
                src={`https://itdagene.no/uploads/${props.photos[slideNumber].photo}`}
                alt={props.photos[slideNumber].photo}
                width={350 * 3}
                height={230 * 3}
              />
            </SliderWrap>
          )}

          <GalleryWrap>
            {props.photos.map((photo, index) => (
              <LazyImage
                src={`https://itdagene.no/uploads/${photo.photo}`}
                alt={photo.photo}
                key={photo.photo}
                width={350}
                height={230}
                onClick={(): void => handleOpenModal(index)}
                cursor="pointer"
                hover
              />
            ))}
          </GalleryWrap>
        </>
      ) : (
        <p>Kunne ikke hente bilder :/</p>
      )}
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
  layout: ({ props, error }: WithDataDataProps<galleri_QueryResponse>) => ({
    responsive: true,
  }),
});
