import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { useSearchParams } from 'react-router-dom';
import { db } from '../firebase';
import SingleProduct from '../components/shared/SingleProduct';
import '../styles/Shop.css';

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
  inStock?: boolean;
}

const Shop = () => {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [selectedStage, setSelectedStage] = useState(searchParams.get('stage') || '');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const category = searchParams.get('category');
    const stage = searchParams.get('stage');
    const search = searchParams.get('search');
    if (category) setSelectedCategory(category);
    if (stage) setSelectedStage(stage);
    if (search) setSearchTerm(search);
  }, [searchParams]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'products'));
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

  const filteredProducts = products.filter(product => {
    const matchesSearch = searchTerm ? (
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
    ) : true;
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    const matchesStage = !selectedStage || product.stage === selectedStage;
    const matchesPrice = (!minPrice || product.price >= Number(minPrice)) &&
                        (!maxPrice || product.price <= Number(maxPrice));

    return matchesSearch && matchesCategory && matchesStage && matchesPrice;
  });

  if (loading) {
    return <div className="shop-loading">Loading products...</div>;
  }

  return (
    <div className="shop-page">
      <div className="filters-section">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-group">
          <h3>Category</h3>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            <option value="clinic">Clinic Equipment</option>
            <option value="university">University Supplies</option>
            <option value="disposable">Disposable Items</option>
          </select>
        </div>
        {selectedCategory === 'university' && (
          <div className="filter-group">
            <h3>Stage</h3>
            <select
              value={selectedStage}
              onChange={(e) => setSelectedStage(e.target.value)}
            >
              <option value="">All Stages</option>
              <option value="stage1">First Year</option>
              <option value="stage2">Second Year</option>
              <option value="stage3">Third Year</option>
              <option value="stage4">Fourth Year</option>
              <option value="stage5">Fifth Year</option>
            </select>
          </div>
        )}
        <div className="price-inputs">
          <input
            type="number"
            placeholder="Min Price"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
          />
          <input
            type="number"
            placeholder="Max Price"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
        </div>
      </div>

      <div className="products-grid">
        {filteredProducts.length > 0 ? (
          filteredProducts.map(product => (
            <SingleProduct
              key={product.id}
              product={product}
              onAddToCart={() => {}}
            />
          ))
        ) : (
          <div className="no-products">No products found matching your criteria.</div>
        )}
      </div>
    </div>
  );
};

export default Shop; 