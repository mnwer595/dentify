import { useState, useEffect, useCallback } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { db } from '../../firebase';
import '../../styles/SpecialOffers.css';

interface Offer {
  id: string;
  title: string;
  description: string;
  label: string;
  buttonText: string;
  buttonUrl: string;
  imageUrl: string;
  type: 'main' | 'secondary';
}

const defaultOffers: Offer[] = [
  {
    id: 'default-main',
    type: 'main' as const,
    label: 'Special Offer',
    title: 'Best Medical Products',
    description: 'Complete collection of medical equipment and supplies at the best prices',
    buttonText: 'Shop Now',
    buttonUrl: '/shop',
    imageUrl: 'https://img.medicalexpo.com/images_me/photo-mg/70896-16417701.jpg'
  },
  {
    id: 'default-secondary-1',
    type: 'secondary',
    label: 'New Arrival',
    title: 'Dental Chairs',
    description: 'Latest Technology',
    buttonText: 'View Collection',
    buttonUrl: '/shop?category=clinic',
    imageUrl: 'https://img.medicalexpo.com/images_me/photo-mg/70896-16139805.jpg'
  },
  {
    id: 'default-secondary-2',
    type: 'secondary',
    label: 'Student Offers',
    title: 'Complete Sets',
    description: 'Integrated Solutions',
    buttonText: 'Learn More',
    buttonUrl: '/shop?category=university',
    imageUrl: 'https://img.medicalexpo.com/images_me/photo-mg/70896-16417577.jpg'
  }
];

const AUTO_SLIDE_INTERVAL = 5000; // 5 seconds

const SpecialOffers = () => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => 
      prevIndex === offers.length - 1 ? 0 : prevIndex + 1
    );
  }, [offers.length]);

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? offers.length - 1 : prevIndex - 1
    );
  };

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'offers'));
        const offersData = querySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            title: data.title,
            description: data.description,
            label: data.label,
            buttonText: data.buttonText,
            buttonUrl: data.buttonUrl,
            imageUrl: data.imageUrl,
            type: data.type as 'main' | 'secondary'
          } satisfies Offer;
        });

        setOffers(offersData.length > 0 ? offersData : defaultOffers);
      } catch (error) {
        console.error('Error fetching offers:', error);
        setOffers(defaultOffers);
      } finally {
        setLoading(false);
      }
    };

    fetchOffers();
  }, []);

  useEffect(() => {
    const intervalId = setInterval(nextSlide, AUTO_SLIDE_INTERVAL);
    return () => clearInterval(intervalId);
  }, [nextSlide]);

  if (loading) {
    return <div className="offers-loading">Loading...</div>;
  }

  if (offers.length === 0) {
    return null;
  }

  const currentOffer = offers[currentIndex];

  return (
    <section className="special-offers">
      <div className="offers-container">
        <div className="offer-card">
          <div className="offer-content">
            <span className="label">{currentOffer.label}</span>
            {currentOffer.type === 'main' ? (
              <h2>{currentOffer.title}</h2>
            ) : (
              <h3>{currentOffer.title}</h3>
            )}
            <p>{currentOffer.description}</p>
            <Link to={currentOffer.buttonUrl} className="offer-button">
              {currentOffer.buttonText} <i className="fas fa-arrow-right"></i>
            </Link>
          </div>
          <div 
            className="offer-image"
            style={{ backgroundImage: `url(${currentOffer.imageUrl})` }}
          />
        </div>

        <button className="nav-button prev" onClick={prevSlide}>
          <i className="fas fa-chevron-left"></i>
        </button>
        <button className="nav-button next" onClick={nextSlide}>
          <i className="fas fa-chevron-right"></i>
        </button>

        <div className="offer-dots">
          {offers.map((_, index) => (
            <button
              key={index}
              className={`dot ${index === currentIndex ? 'active' : ''}`}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default SpecialOffers; 