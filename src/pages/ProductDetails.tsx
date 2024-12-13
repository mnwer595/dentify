import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useCart } from '../contexts/CartContext';
import '../styles/ProductDetails.css';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  imageUrl: string;
  category: string;
  stage?: string;
  rating?: number;
}

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      try {
        const docRef = doc(db, 'products', id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setProduct({ id: docSnap.id, ...docSnap.data() } as Product);
        } else {
          navigate('/shop');
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, navigate]);

  const handleAddToCart = async () => {
    if (!product) return;
    
    try {
      await addToCart({
        id: product.id,
        name: product.name,
        price: product.discountPrice || product.price,
        imageUrl: product.imageUrl,
        quantity: quantity
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  if (loading) {
    return <div className="product-details-loading">Loading...</div>;
  }

  if (!product) {
    return <div className="product-details-error">Product not found</div>;
  }

  const discount = product.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  return (
    <div className="product-details-container">
      <button className="back-button" onClick={() => navigate('/shop')}>
        ← Back to Shop
      </button>
      
      <div className="product-details">
        <div className="product-image">
          <img 
            src={product.imageUrl} 
            alt={product.name}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'https://via.placeholder.com/300x300?text=Dental+Product';
            }}
          />
          {discount > 0 && (
            <div className="discount-badge">
              {discount}% OFF
            </div>
          )}
        </div>
        
        <div className="product-info">
          <h1>{product.name}</h1>
          
          <div className="product-meta">
            <span className="category">Category: {product.category}</span>
            {product.stage && <span className="stage">Stage: {product.stage}</span>}
            {product.rating && (
              <span className="rating">
                Rating: {product.rating} ★
              </span>
            )}
          </div>
          
          <div className="product-pricing">
            {product.discountPrice ? (
              <>
                <span className="original-price">${product.price.toFixed(2)}</span>
                <span className="discount-price">${product.discountPrice.toFixed(2)}</span>
                <span className="savings">
                  Save ${(product.price - product.discountPrice).toFixed(2)}
                </span>
              </>
            ) : (
              <span className="price">${product.price.toFixed(2)}</span>
            )}
          </div>

          <p className="description">{product.description}</p>
          
          <div className="purchase-controls">
            <div className="quantity-selector">
              <button 
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                disabled={quantity <= 1}
                className="quantity-btn minus"
              >
                -
              </button>
              <span>{quantity}</span>
              <button 
                onClick={() => setQuantity(q => q + 1)}
                className="quantity-btn plus"
              >
                +
              </button>
            </div>

            <button 
              className="add-to-cart"
              onClick={handleAddToCart}
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails; 