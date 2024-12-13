import '../../styles/SpecialOffers.css'

const SpecialOffers = () => {
  const offers = [
    {
      id: 1,
      type: 'main',
      label: 'Special Offer',
      title: '30% Off',
      description: 'On Dental Equipment',
      buttonText: 'Shop Now',
      image: 'https://img.medicalexpo.com/images_me/photo-mg/70896-16417701.jpg'
    },
    {
      id: 2,
      type: 'secondary',
      label: 'New Arrival',
      title: 'Dental Chairs',
      description: 'Latest Technology',
      buttonText: 'View Collection',
      image: 'https://img.medicalexpo.com/images_me/photo-mg/70896-16139805.jpg'
    },
    {
      id: 3,
      type: 'secondary',
      label: 'Student Special',
      title: 'Complete Kits',
      description: 'All-in-One Solutions',
      buttonText: 'Learn More',
      image: 'https://img.medicalexpo.com/images_me/photo-mg/70896-16417577.jpg'
    }
  ]

  return (
    <section className="special-offers">
      <div className="offers-grid">
        {offers.map((offer) => (
          <div key={offer.id} className={`offer-card ${offer.type === 'main' ? 'main-offer' : 'secondary-offer'}`}>
            <div className="offer-content">
              <span className="label">{offer.label}</span>
              {offer.type === 'main' ? (
                <h2>{offer.title}</h2>
              ) : (
                <h3>{offer.title}</h3>
              )}
              <p>{offer.description}</p>
              <button className="offer-button">
                {offer.buttonText} <i className="fas fa-arrow-right"></i>
              </button>
            </div>
            <div 
              className="offer-image"
              style={{ backgroundImage: `url(${offer.image})` }}
            ></div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default SpecialOffers 