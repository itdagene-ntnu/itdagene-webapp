import styled from 'styled-components';
import {
  ChangeEvent,
  ReactElement,
  useCallback,
  useEffect,
  useState,
} from 'react';
import Image from 'next/image';
import { itdageneBlue } from '../../utils/colors';
import {
  withDataAndLayout,
  WithDataAndLayoutProps,
  WithDataDataProps,
} from '../../lib/withData';
import { omItdagene_QueryResponse } from '../../__generated__/omItdagene_Query.graphql';
import { graphql } from 'react-relay';

const images = [
  'DSC_1043.jpg',
  'DSC_1003.jpg',
  'DSC_1053.jpg',
  'DSC_1105.jpg',
  'DSC_1128.jpg',
  'DSC_1137.jpg',
  'DSC_1141.jpg',
  'DSC_1145.jpg',
];

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

const Single = styled('div')`
  width: 350px;
  cursor: pointer;
`;

const SingleImg = styled(Image)`
  object-fit: cover;
  transform: scale(1);
  transition: transform 0.2s ease-in-out;

  &:hover {
    position: relative;
    transform: scale(1.025);
    z-index: 99;
    transition: transform 0.2s ease-in-out;
  }
`;

const FullScreenImage = styled(Image)`
  width: 100%;
  height: 100%;
  object-fit: cover;

  max-width: 100%;
  max-height: 100%;
  pointer-events: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  user-select: none;
`;

const Title = styled('h1')`
  font-weight: bold;
  font-smoothing: antialiased;
  font-size: 3rem;
  margin-bottom: 1rem;
`;

const Galleri = ({
  error,
  props,
}: WithDataAndLayoutProps<omItdagene_QueryResponse>): JSX.Element => {
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
    slideNumber === 0
      ? setSlideNumber(images.length - 1)
      : setSlideNumber(slideNumber - 1);
  };

  // Next Image
  const nextSlide = (): void => {
    slideNumber + 1 === images.length
      ? setSlideNumber(0)
      : setSlideNumber(slideNumber + 1);
  };

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

  const changeImageOnKey = useCallback(
    (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        handleCloseModal();
      }
      if (event.key === 'ArrowRight') {
        nextSlide();
      }
      if (event.key === 'ArrowLeft') {
        prevSlide();
      }
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
          <div>
            <FullScreenImage
              src={`https://cdn.itdagene.no/${images[slideNumber]}`}
              alt={images[slideNumber]}
              width={850}
              height={330}
            />
          </div>
        </SliderWrap>
      )}

      <Title>Galleri</Title>
      <GalleryWrap>
        {images.map((slide, index) => (
          <Single key={slide} onClick={(): void => handleOpenModal(index)}>
            <SingleImg
              src={`https://cdn.itdagene.no/${slide}`}
              alt={slide}
              width={450}
              height={230}
              quality={100}
            />
          </Single>
        ))}
      </GalleryWrap>
    </>
  );
};

export default withDataAndLayout(Galleri, {
  query: graphql`
    query galleri_Query {
      currentMetaData {
        year
        id
        boardMembers {
          ...BoardMember_user
          id
          role
          fullName
        }
      }

      omItdagene: page(slug: "om-itdagene") {
        ...PageView_page
        ...metadata_metadata
      }
    }
  `,
  variables: {},
  layout: ({ props, error }: WithDataDataProps<omItdagene_QueryResponse>) => ({
    responsive: true,
    metadata: props ? props.omItdagene : undefined,
  }),
});
