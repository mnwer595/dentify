import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useCart } from '../../contexts/CartContext'
import '../../styles/Header.css'

const Header = () => {
  const [showUniversitySubmenu, setShowUniversitySubmenu] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { currentUser, signOut } = useAuth()
  const { getItemsCount } = useCart()
  const navigate = useNavigate()

  const universityCategories = [
    {
      name: 'First Year',
      subcategories: [
        { name: 'Dental Anatomy', link: '/shop?category=university&stage=first&sub=anatomy' },
        { name: 'Histology', link: '/shop?category=university&stage=first&sub=histology' },
        { name: 'Physiology', link: '/shop?category=university&stage=first&sub=physiology' }
      ]
    },
    {
      name: 'Second Year',
      subcategories: [
        { name: 'Microbiology', link: '/shop?category=university&stage=second&sub=microbiology' },
        { name: 'Pathology', link: '/shop?category=university&stage=second&sub=pathology' },
        { name: 'Pharmacology', link: '/shop?category=university&stage=second&sub=pharmacology' }
      ]
    },
    {
      name: 'Third Year',
      subcategories: [
        { name: 'Conservative', link: '/shop?category=university&stage=third&sub=conservative' },
        { name: 'Prosthodontics', link: '/shop?category=university&stage=third&sub=prosthodontics' },
        { name: 'Surgery', link: '/shop?category=university&stage=third&sub=surgery' }
      ]
    },
    {
      name: 'Fourth Year',
      subcategories: [
        { name: 'Endodontics', link: '/shop?category=university&stage=fourth&sub=endodontics' },
        { name: 'Orthodontics', link: '/shop?category=university&stage=fourth&sub=orthodontics' },
        { name: 'Periodontics', link: '/shop?category=university&stage=fourth&sub=periodontics' }
      ]
    },
    {
      name: 'Fifth Year',
      subcategories: [
        { name: 'Implantology', link: '/shop?category=university&stage=fifth&sub=implantology' },
        { name: 'Pediatric Dentistry', link: '/shop?category=university&stage=fifth&sub=pediatric' },
        { name: 'Oral Medicine', link: '/shop?category=university&stage=fifth&sub=oral-medicine' }
      ]
    }
  ];

  const handleSignOut = async () => {
    try {
      await signOut()
      navigate('/')
    } catch (error) {
      console.error('Failed to sign out:', error)
    }
  }

  return (
    <header className="header">
      <div className="header-top">
        <div className="header-top-content">
          <div className="contact-info">
            <a href="tel:+1234567890"><i className="fas fa-phone"></i> +1234567890</a>
            <a href="mailto:info@dentify.com"><i className="fas fa-envelope"></i> info@dentify.com</a>
          </div>
          <div className="social-links">
            <a href="#"><i className="fab fa-facebook"></i></a>
            <a href="#"><i className="fab fa-instagram"></i></a>
            <a href="#"><i className="fab fa-twitter"></i></a>
          </div>
        </div>
      </div>
      <div className="header-main">
        <div className="header-main-content">
          <Link to="/" className="logo">
            <h1>DentifyStore</h1>
            <span>Dental Supplies</span>
          </Link>
          <button 
            className="mobile-menu-button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
          </button>
          <nav className={`nav ${isMenuOpen ? 'active' : ''}`}>
            <Link to="/" className="nav-link">Home</Link>
            <div 
              className="dropdown"
              onMouseEnter={() => setShowUniversitySubmenu(true)}
              onMouseLeave={() => setShowUniversitySubmenu(false)}
            >
              <Link to="/shop?category=university" className="nav-link">University</Link>
              {showUniversitySubmenu && (
                <div className="submenu">
                  {universityCategories.map((year, index) => (
                    <div key={index} className="submenu-group">
                      <div className="submenu-title">{year.name}</div>
                      <div className="submenu-items">
                        {year.subcategories.map((sub, subIndex) => (
                          <Link 
                            key={subIndex}
                            to={sub.link}
                            onClick={() => setIsMenuOpen(false)}
                          >
                            {sub.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <Link to="/shop?category=clinic" className="nav-link">Clinic</Link>
            <Link to="/shop?category=disposable" className="nav-link">Disposable</Link>
            <Link to="/shop" className="nav-link">Shop</Link>
            {currentUser && <Link to="/orders" className="nav-link">My Orders</Link>}
          </nav>
          <div className="header-actions">
            <button className="search-btn">
              <i className="fas fa-search"></i>
            </button>
            <Link to="/cart" className="cart">
              <i className="fas fa-shopping-cart"></i>
              {getItemsCount() > 0 && (
                <span className="cart-count">{getItemsCount()}</span>
              )}
            </Link>
            {currentUser ? (
              <div className="auth-actions">
                <span className="user-name">Hello, {currentUser.displayName}</span>
                <button className="auth-btn" onClick={handleSignOut}>
                  Sign Out
                </button>
              </div>
            ) : (
              <Link to="/signin" className="auth-btn">
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header 