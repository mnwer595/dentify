import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../../firebase';
import AdminOrders from './AdminOrders';
import '../../styles/Admin.css';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  imageUrl: string;
  category: string;
  stage?: string;
  createdAt?: string;
}

interface Offer {
  id: string;
  title: string;
  description: string;
  label: string;
  buttonText: string;
  buttonUrl: string;
  imageUrl: string;
  type: 'main' | 'secondary';
  createdAt?: string;
}

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<'products' | 'offers' | 'orders'>('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const isAuthenticated = sessionStorage.getItem('isAdminAuthenticated');
    if (!isAuthenticated) {
      navigate('/admin');
      return;
    }
    fetchProducts();
    fetchOffers();
  }, [navigate]);

  useEffect(() => {
    filterProducts();
  }, [searchTerm, selectedCategory, products]);

  const filterProducts = () => {
    let filtered = [...products];
    
    if (searchTerm) {
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedCategory) {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }
    
    setFilteredProducts(filtered);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const uploadImage = async (file: File) => {
    const storageRef = ref(storage, `products/${Date.now()}_${file.name}`);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, 'products'));
      const productsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Product[];
      setProducts(productsData);
      setFilteredProducts(productsData);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;

    try {
      setLoading(true);
      setError('');

      if (selectedProduct.discountPrice && selectedProduct.discountPrice >= selectedProduct.price) {
        setError('Discount price must be less than original price');
        return;
      }

      let imageUrl = selectedProduct.imageUrl;

      if (selectedImage) {
        if (selectedProduct.imageUrl) {
          try {
            const oldImageRef = ref(storage, selectedProduct.imageUrl);
            await deleteObject(oldImageRef);
          } catch (error) {
            console.error('Error deleting old image:', error);
          }
        }
        imageUrl = await uploadImage(selectedImage);
      }

      const productData = {
        name: selectedProduct.name,
        description: selectedProduct.description,
        price: selectedProduct.price,
        discountPrice: selectedProduct.discountPrice || null,
        imageUrl,
        category: selectedProduct.category,
        stage: selectedProduct.category === 'university' ? selectedProduct.stage : null,
        updatedAt: new Date().toISOString()
      };

      if (selectedProduct.id) {
        await updateDoc(doc(db, 'products', selectedProduct.id), productData);
      } else {
        await addDoc(collection(db, 'products'), {
          ...productData,
          createdAt: new Date().toISOString()
        });
      }

      setShowModal(false);
      setSelectedProduct(null);
      setSelectedImage(null);
      setPreviewUrl('');
      fetchProducts();
      alert(selectedProduct.id ? 'Product updated successfully!' : 'Product added successfully!');
    } catch (error) {
      console.error('Error saving product:', error);
      setError('Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (productId: string, imageUrl: string) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      setLoading(true);
      setError('');
      
      if (imageUrl) {
        try {
          const imageRef = ref(storage, imageUrl);
          await deleteObject(imageRef);
        } catch (error) {
          console.error('Error deleting image:', error);
        }
      }

      await deleteDoc(doc(db, 'products', productId));
      fetchProducts();
      alert('Product deleted successfully!');
    } catch (error) {
      console.error('Error deleting product:', error);
      setError('Failed to delete product');
    } finally {
      setLoading(false);
    }
  };

  const handleAddNew = () => {
    setSelectedProduct({
      id: '',
      name: '',
      description: '',
      price: 0,
      imageUrl: '',
      category: ''
    });
    setPreviewUrl('');
    setShowModal(true);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('isAdminAuthenticated');
    navigate('/admin');
  };

  const fetchOffers = async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, 'offers'));
      const offersData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Offer[];
      setOffers(offersData);
    } catch (error) {
      console.error('Error fetching offers:', error);
      setError('Failed to fetch offers');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOffer) return;

    try {
      setLoading(true);
      setError('');

      let imageUrl = selectedOffer.imageUrl;

      if (selectedImage) {
        if (selectedOffer.imageUrl) {
          try {
            const oldImageRef = ref(storage, selectedOffer.imageUrl);
            await deleteObject(oldImageRef);
          } catch (error) {
            console.error('Error deleting old image:', error);
          }
        }
        imageUrl = await uploadImage(selectedImage);
      }

      const offerData = {
        title: selectedOffer.title,
        description: selectedOffer.description,
        label: selectedOffer.label,
        buttonText: selectedOffer.buttonText,
        buttonUrl: selectedOffer.buttonUrl,
        imageUrl,
        type: selectedOffer.type,
        updatedAt: new Date().toISOString()
      };

      if (selectedOffer.id) {
        await updateDoc(doc(db, 'offers', selectedOffer.id), offerData);
      } else {
        await addDoc(collection(db, 'offers'), {
          ...offerData,
          createdAt: new Date().toISOString()
        });
      }

      setShowModal(false);
      setSelectedOffer(null);
      setSelectedImage(null);
      setPreviewUrl('');
      fetchOffers();
      alert(selectedOffer.id ? 'Offer updated successfully!' : 'Offer added successfully!');
    } catch (error) {
      console.error('Error saving offer:', error);
      setError('Failed to save offer');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteOffer = async (offerId: string, imageUrl: string) => {
    if (!window.confirm('Are you sure you want to delete this offer?')) return;

    try {
      setLoading(true);
      setError('');
      
      if (imageUrl) {
        try {
          const imageRef = ref(storage, imageUrl);
          await deleteObject(imageRef);
        } catch (error) {
          console.error('Error deleting image:', error);
        }
      }

      await deleteDoc(doc(db, 'offers', offerId));
      fetchOffers();
      alert('Offer deleted successfully!');
    } catch (error) {
      console.error('Error deleting offer:', error);
      setError('Failed to delete offer');
    } finally {
      setLoading(false);
    }
  };

  const handleAddNewOffer = () => {
    setSelectedOffer({
      id: '',
      title: '',
      description: '',
      label: '',
      buttonText: '',
      buttonUrl: '',
      imageUrl: '',
      type: 'secondary'
    });
    setPreviewUrl('');
    setShowModal(true);
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h2>Admin Dashboard</h2>
        <div className="header-actions">
          <button onClick={handleAddNew} className="add-button">
            Add New Product <i className="fas fa-plus"></i>
          </button>
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'products' ? 'active' : ''}`}
          onClick={() => setActiveTab('products')}
        >
          Products
        </button>
        <button 
          className={`tab ${activeTab === 'offers' ? 'active' : ''}`}
          onClick={() => setActiveTab('offers')}
        >
          Offers
        </button>
        <button 
          className={`tab ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          Orders
        </button>
      </div>

      {activeTab === 'orders' ? (
        <AdminOrders />
      ) : activeTab === 'products' ? (
        <>
          <div className="filters-section">
            <div className="search-box">
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <i className="fas fa-search"></i>
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="category-filter"
            >
              <option value="">All Categories</option>
              <option value="university">University</option>
              <option value="clinic">Clinic</option>
              <option value="disposable">Disposable</option>
            </select>
          </div>

          <div className="products-table">
            {loading && <div className="loading">Loading...</div>}
            <table>
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Product Name</th>
                  <th>Category</th>
                  <th>Stage</th>
                  <th>Price</th>
                  <th>Discount Price</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map(product => (
                  <tr key={product.id}>
                    <td>
                      <img src={product.imageUrl} alt={product.name} className="product-thumbnail" />
                    </td>
                    <td>{product.name}</td>
                    <td>{product.category}</td>
                    <td>{product.category === 'university' ? product.stage : '-'}</td>
                    <td>${product.price}</td>
                    <td>{product.discountPrice ? `$${product.discountPrice}` : '-'}</td>
                    <td>
                      <div className="table-actions">
                        <button
                          onClick={() => {
                            setSelectedProduct(product);
                            setPreviewUrl(product.imageUrl);
                            setShowModal(true);
                          }}
                          className="edit-button"
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id, product.imageUrl)}
                          className="delete-button"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <>
          <div className="section-header">
            <h3>Manage Offers</h3>
            <button onClick={handleAddNewOffer} className="add-button">
              Add New Offer <i className="fas fa-plus"></i>
            </button>
          </div>

          <div className="offers-grid">
            {loading && <div className="loading">Loading...</div>}
            {offers.map(offer => (
              <div key={offer.id} className={`offer-card ${offer.type}`}>
                <img src={offer.imageUrl} alt={offer.title} />
                <div className="offer-content">
                  <span className="label">{offer.label}</span>
                  <h4>{offer.title}</h4>
                  <p>{offer.description}</p>
                  <p className="button-preview">
                    <span>Button URL:</span> {offer.buttonUrl}
                  </p>
                  <div className="offer-actions">
                    <button
                      onClick={() => {
                        setSelectedOffer(offer);
                        setPreviewUrl(offer.imageUrl);
                        setShowModal(true);
                      }}
                      className="edit-button"
                    >
                      <i className="fas fa-edit"></i> Edit
                    </button>
                    <button
                      onClick={() => handleDeleteOffer(offer.id, offer.imageUrl)}
                      className="delete-button"
                    >
                      <i className="fas fa-trash"></i> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {showModal && (selectedProduct || selectedOffer) && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>
                {selectedProduct 
                  ? (selectedProduct.id ? 'Edit Product' : 'Add New Product')
                  : (selectedOffer?.id ? 'Edit Offer' : 'Add New Offer')
                }
              </h3>
              <button onClick={() => setShowModal(false)} className="close-button">
                <i className="fas fa-times"></i>
              </button>
            </div>
            <form onSubmit={selectedProduct ? handleSaveProduct : handleSaveOffer}>
              {selectedProduct ? (
                <>
                  <div className="form-group">
                    <label>Product Name</label>
                    <input
                      type="text"
                      value={selectedProduct.name}
                      onChange={(e) => setSelectedProduct({...selectedProduct, name: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      value={selectedProduct.description}
                      onChange={(e) => setSelectedProduct({...selectedProduct, description: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Original Price</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={selectedProduct.price}
                      onChange={(e) => setSelectedProduct({...selectedProduct, price: parseFloat(e.target.value)})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Discount Price (Optional)</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={selectedProduct.discountPrice || ''}
                      onChange={(e) => setSelectedProduct({
                        ...selectedProduct, 
                        discountPrice: e.target.value ? parseFloat(e.target.value) : undefined
                      })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Product Image</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="file-input"
                    />
                    {(previewUrl || selectedProduct.imageUrl) && (
                      <div className="image-preview">
                        <img src={previewUrl || selectedProduct.imageUrl} alt="Preview" />
                      </div>
                    )}
                  </div>
                  <div className="form-group">
                    <label>Category</label>
                    <select
                      value={selectedProduct.category}
                      onChange={(e) => setSelectedProduct({...selectedProduct, category: e.target.value})}
                      required
                    >
                      <option value="">Select Category</option>
                      <option value="university">University</option>
                      <option value="clinic">Clinic</option>
                      <option value="disposable">Disposable</option>
                    </select>
                  </div>
                  {selectedProduct.category === 'university' && (
                    <div className="form-group">
                      <label>Academic Stage</label>
                      <select
                        value={selectedProduct.stage || ''}
                        onChange={(e) => setSelectedProduct({...selectedProduct, stage: e.target.value})}
                        required
                      >
                        <option value="">Select Stage</option>
                        <option value="stage1">First Year</option>
                        <option value="stage2">Second Year</option>
                        <option value="stage3">Third Year</option>
                        <option value="stage4">Fourth Year</option>
                        <option value="stage5">Fifth Year</option>
                      </select>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div className="form-group">
                    <label>Offer Title</label>
                    <input
                      type="text"
                      value={selectedOffer?.title}
                      onChange={(e) => setSelectedOffer(prev => prev ? {...prev, title: e.target.value} : null)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      value={selectedOffer?.description}
                      onChange={(e) => setSelectedOffer(prev => prev ? {...prev, description: e.target.value} : null)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Label Text</label>
                    <input
                      type="text"
                      value={selectedOffer?.label}
                      onChange={(e) => setSelectedOffer(prev => prev ? {...prev, label: e.target.value} : null)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Button Text</label>
                    <input
                      type="text"
                      value={selectedOffer?.buttonText}
                      onChange={(e) => setSelectedOffer(prev => prev ? {...prev, buttonText: e.target.value} : null)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Button URL</label>
                    <input
                      type="text"
                      value={selectedOffer?.buttonUrl}
                      onChange={(e) => setSelectedOffer(prev => prev ? {...prev, buttonUrl: e.target.value} : null)}
                      required
                      placeholder="Example: /products/category/university"
                    />
                  </div>
                  <div className="form-group">
                    <label>Offer Type</label>
                    <select
                      value={selectedOffer?.type}
                      onChange={(e) => setSelectedOffer(prev => prev ? {...prev, type: e.target.value as 'main' | 'secondary'} : null)}
                      required
                    >
                      <option value="main">Main</option>
                      <option value="secondary">Secondary</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Offer Image</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="file-input"
                    />
                    {(previewUrl || selectedOffer?.imageUrl) && (
                      <div className="image-preview">
                        <img src={previewUrl || selectedOffer?.imageUrl} alt="Preview" />
                      </div>
                    )}
                  </div>
                </>
              )}
              <div className="modal-actions">
                <button type="submit" className="save-button" disabled={loading}>
                  {loading ? 'Saving...' : 'Save'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="cancel-button"
                  disabled={loading}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard; 