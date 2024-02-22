import React from 'react';
import Slider from 'react-slick';
import { Paper } from '@mui/material';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

const CarouselComponent = () => {
    const settings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      autoplay: true, // Enable autoplay
      autoplaySpeed: 3000, // Change slides every 3 seconds
    };
  
  const images = [
      { id: 1, url: '/noodles.jpg', alt: 'Image of Noodles'},
      { id: 2, url: '/croissant.jpg', alt: 'Image of Croissant'}
  ];
  
  return (
      <Slider {...settings}>
        {images.map((image) => (
          <div key={image.id}>
            <Paper 
              elevation={3} 
              style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                padding: '20px',
                height: '500px', // Ensuring uniform height for all carousel items
              }}
            >
              <img src={image.url} alt={image.alt} style={{ width: '100%', height: '500px', objectFit: 'cover' }} />
            </Paper>
          </div>
        ))}
      </Slider>
    );
  };
  
  export default CarouselComponent;