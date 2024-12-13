import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import SignIn from './components/auth/SignIn'
import SignUp from './components/auth/SignUp'
import AdminLogin from './components/admin/AdminLogin'
import AdminDashboard from './components/admin/AdminDashboard'
import { SpecialOffers, Categories, FeaturedProducts } from './components/home'
import Shop from './pages/Shop'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Orders from './pages/Orders.tsx'
import ProductDetails from './pages/ProductDetails'
import { AuthProvider } from './contexts/AuthContext'
import { CartProvider } from './contexts/CartContext'
import './styles/App.css'

function App() {
  const [cartCount, setCartCount] = useState(0)

  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="app">
            <Header />
            <Routes>
              <Route path="/signin" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/admin" element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/shop/product/:id" element={<ProductDetails />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/" element={
                <main className="main">
                  <SpecialOffers />
                  <section className="hero">
                    <h1>Premium Dental Supplies</h1>
                    <p>Complete range of dental equipment and supplies at the best prices</p>
                    <Link to="/shop" className="cta-button">Shop Now</Link>
                  </section>
                  <Categories />
                  <FeaturedProducts onAddToCart={() => setCartCount(prev => prev + 1)} />
                </main>
              } />
            </Routes>
            <Footer />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  )
}

export default App
