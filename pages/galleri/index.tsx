import Layout, { Metadata } from '../../components/Layout';
import styled from 'styled-components';
import { useState } from 'react';
import Image from 'next/image';

// alle scr url's må være i form av /static/...
// for some fucking reason
const images = [
  '/galleri/DSC_1043.jpg',
  '/galleri/DSC_1003.jpg',
  '/galleri/DSC_1053.jpg',
  '/galleri/DSC_1105.jpg',
  '/galleri/DSC_1128.jpg',
  '/galleri/DSC_1137.jpg',
  '/galleri/DSC_1141.jpg',
  '/galleri/DSC_1145.jpg',
];

const GalleryWrap = styled('div')`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
  justify-content: center;
  max-width: 1120px;
  margin: 0 auto;
`;

const Single = styled('div')`
  width: 350px;
  cursor: pointer;
`;

const SingleImg = styled(Image)`
  max-width: 100%;
  transform: scale(1);
  transition: transform 0.2s ease-in-out;

  width: 100%;
  height: 100%;
  object-fit: cover;

  &:hover {
    transform: scale(1.06);

    transition: transform 0.2s ease-in-out;
  }
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
`;

const FullScreenImageDiv = styled('div')`
  width: cals(100%-40px);
  height: cals(100%-40px);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const FullScreenImage = styled('img')`
  max-width: 960px;
  max-height: 100%;
  pointer-events: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  user-select: none;
`;

export default function Test() {
  const [slideNumber, setSlideNumber] = useState(0);
  const [openModal, setOpenModal] = useState(false);

  const handleOpenModal = (index: number) => {
    setSlideNumber(index);
    setOpenModal(true);
  };

  // Close Modal
  const handleCloseModal = () => {
    setOpenModal(false);
  };

  // Previous Image
  const prevSlide = () => {
    slideNumber === 0
      ? setSlideNumber(images.length - 1)
      : setSlideNumber(slideNumber - 1);
  };

  // Next Image
  const nextSlide = () => {
    slideNumber + 1 === images.length
      ? setSlideNumber(0)
      : setSlideNumber(slideNumber + 1);
  };

  const style = {
    position: 'fixed',
    top: '50%',
    right: '40px',
    color: '#52bfe3',
    fontSize: '65px',
  };

  const style1 = {
    position: 'fixed',

    top: '50%',
    color: '#52bfe3',
    left: '40px',
    fontSize: '65px',
  };

  const style2 = {
    position: 'fixed',

    top: '40px',
    right: '40px',

    color: '#52bfe3',

    fontSize: '65px',
  };

  return (
    <>
      <Layout noLoading>
        {openModal && (
          <SliderWrap>
            {/* eslint-disable-next-line*/}
            {/* @ts-ignore*/}
            <ion-icon
              onClick={handleCloseModal}
              style={style2}
              name="close-circle-outline"
            />
            {/* eslint-disable-next-line*/}
            {/* @ts-ignore*/}
            <ion-icon
              onClick={prevSlide}
              style={style1}
              name="arrow-back-outline"
            />
            {/* eslint-disable-next-line*/}
            {/* @ts-ignore*/}
            <ion-icon
              onClick={nextSlide}
              style={style}
              name="arrow-forward-outline"
            />
            <FullScreenImageDiv onClick={handleCloseModal}>
              <FullScreenImage src={images[slideNumber]} alt="" />
            </FullScreenImageDiv>
          </SliderWrap>
        )}
        <GalleryWrap>
          {images.map((slide, index) => {
            return (
              <Single key={index} onClick={() => handleOpenModal(index)}>
                <SingleImg
                  src={slide}
                  alt=""
                  width={450}
                  height={230}
                  quality={100}
                />
              </Single>
            );
          })}
        </GalleryWrap>
      </Layout>
    </>
  );
}
