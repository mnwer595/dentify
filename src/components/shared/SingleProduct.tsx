import { Link } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import '../../styles/SingleProduct.css';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  imageUrl: string;
  rating?: number;
  inStock?: boolean;
  category?: string;
}

interface SingleProductProps {
  product: Product;
  onAddToCart?: () => void;
}

const SingleProduct = ({ product, onAddToCart }: SingleProductProps) => {
  const { addToCart } = useCart();

  const handleAddToCart = async () => {
    try {
      await addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        discountPrice: product.discountPrice
      });
      if (onAddToCart) {
        onAddToCart();
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const discount = product.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  return (
    <div className="product-card">
      <div className="product-badges">
        {discount > 0 && (
          <span className="badge discount">
            {discount}% OFF
          </span>
        )}
        {product.rating && product.rating >= 4.5 && (
          <span className="badge featured">Featured</span>
        )}
        {product.inStock === false && (
          <span className="badge out-of-stock">Out of Stock</span>
        )}
      </div>
      
      <div className="product-image-wrapper">
        <img 
          src={product.imageUrl} 
          alt={product.name} 
          className="product-image"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'https://via.placeholder.com/300x300?text=Dental+Product';
          }}
        />
        <div className="product-overlay">
          <Link to={`/shop/product/${product.id}`} className="quick-view-btn">
            Quick View
          </Link>
        </div>
      </div>

      <div className="product-info">
        <Link to={`/shop/product/${product.id}`} className="product-name">
          <h3>{product.name}</h3>
        </Link>
        {product.category && (
          <div className="product-category">{product.category}</div>
        )}
        <p className="product-description">{product.description}</p>
        
        <div className="price-section">
          <div className="price-container">
            {product.discountPrice ? (
              <>
                <span className="price original">${product.price.toFixed(2)}</span>
                <span className="price discounted">${product.discountPrice.toFixed(2)}</span>
              </>
            ) : (
              <span className="price">${product.price.toFixed(2)}</span>
            )}
          </div>
          {discount > 0 && (
            <div className="savings">
              Save ${(product.price - (product.discountPrice || 0)).toFixed(2)}
            </div>
          )}
        </div>

        {product.inStock !== false && (
          <button className="add-to-cart" onClick={handleAddToCart}>
            <i className="fas fa-shopping-cart"></i>
            Add to Cart
          </button>
        )}
        
        {product.inStock === false && (
          <button className="add-to-cart out-of-stock" disabled>
            <i className="fas fa-times"></i>
            Out of Stock
          </button>
        )}
      </div>
    </div>
  );
};

export default SingleProduct; 