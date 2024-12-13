import { useState, useEffect } from 'react';
import { collection, getDocs, query, limit } from 'firebase/firestore';
import { db } from '../../firebase';
import SingleProduct from '../shared/SingleProduct';
import '../../styles/FeaturedProducts.css';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  imageUrl: string;
  rating?: number;
  inStock?: boolean;
}

interface FeaturedProductsProps {
  onAddToCart: () => void;
}

const FeaturedProducts = ({ onAddToCart }: FeaturedProductsProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const q = query(collection(db, 'products'), limit(4));
        const querySnapshot = await getDocs(q);
        const productsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Product[];
        setProducts(productsData);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <div className="featured-loading">Loading featured products...</div>;
  }

  return (
    <section className="featured-products">
      <div className="featured-products-container">
        <div className="section-title">
          <h2>Featured Products</h2>
          <p>Discover our most popular dental supplies and equipment</p>
        </div>
        <div className="products-grid">
          {products.map(product => (
            <SingleProduct
              key={product.id}
              product={product}
              onAddToCart={onAddToCart}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts; 