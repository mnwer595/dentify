import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import SignIn from './components/auth/SignIn'
import SignUp from './components/auth/SignUp'
import { SpecialOffers, Categories, FeaturedProducts } from './components/home'
import './styles/App.css'

function App() {
  const [cartCount, setCartCount] = useState(0)

  return (
    <Router>
      <div className="app">
        <Header cartCount={cartCount} />
        <Routes>
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/" element={
            <main className="main">
              <SpecialOffers />
              <section className="hero">
                <h1>Premium Dental Supplies</h1>
                <p>Complete range of dental equipment and supplies at the best prices</p>
                <button className="cta-button">Shop Now</button>
              </section>
              <Categories />
              <FeaturedProducts onAddToCart={() => setCartCount(prev => prev + 1)} />
            </main>
          } />
        </Routes>
        <Footer />
      </div>
    </Router>
  )
}

export default App
