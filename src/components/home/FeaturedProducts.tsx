import '../../styles/FeaturedProducts.css'

interface FeaturedProductsProps {
  onAddToCart: () => void;
}

const FeaturedProducts = ({ onAddToCart }: FeaturedProductsProps) => {
  const products = [
    {
      id: 1,
      name: 'Dental Mirror Set',
      description: 'Professional stainless steel dental mirrors with ergonomic handles',
      price: '$29.99',
      image: 'https://img.medicalexpo.com/images_me/photo-mg/70896-16845685.jpg'
    },
    {
      id: 2,
      name: 'Extraction Forceps Kit',
      description: 'High-grade surgical steel extraction forceps set',
      price: '$149.99',
      image: 'https://img.medicalexpo.com/images_me/photo-mg/70896-16417493.jpg'
    },
    {
      id: 3,
      name: 'Dental Explorer Probe',
      description: 'Premium quality diagnostic explorer with double-ended design',
      price: '$34.99',
      image: 'https://img.medicalexpo.com/images_me/photo-mg/70896-16417669.jpg'
    },
    {
      id: 4,
      name: 'Ultrasonic Scaler',
      description: 'Advanced ultrasonic dental scaler with LED light',
      price: '$299.99',
      image: 'https://img.medicalexpo.com/images_me/photo-mg/70896-16139751.jpg'
    }
  ]

  return (
    <section className="featured-products">
      <h2>Featured Products</h2>
      <div className="product-grid">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <div className="product-image" style={{ backgroundImage: `url(${product.image})` }}>
              <div className="product-overlay">
                <button className="quick-view">Quick View</button>
              </div>
            </div>
            <div className="product-info">
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <span className="price">{product.price}</span>
              <button onClick={onAddToCart} className="add-to-cart">
                <i className="fas fa-shopping-cart"></i> Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default FeaturedProducts 