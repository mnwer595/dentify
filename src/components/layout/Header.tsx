import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import '../../styles/Header.css'

interface HeaderProps {
  cartCount: number;
}

const Header = ({ cartCount }: HeaderProps) => {
  const [showUniversitySubmenu, setShowUniversitySubmenu] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { currentUser, signOut } = useAuth()
  const navigate = useNavigate()

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
        <div className="logo">
          <h1>DentifyStore</h1>
          <span>Dental Supplies</span>
        </div>
        <button 
          className="mobile-menu-button"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
        </button>
        <nav className={`nav ${isMenuOpen ? 'active' : ''}`}>
          <a href="#home" onClick={() => setIsMenuOpen(false)}>Home</a>
          <div 
            className="dropdown"
            onMouseEnter={() => setShowUniversitySubmenu(true)}
            onMouseLeave={() => setShowUniversitySubmenu(false)}
          >
            <a href="#university">University</a>
            {showUniversitySubmenu && (
              <div className="submenu">
                <a href="#stage1" onClick={() => setIsMenuOpen(false)}>Stage 1</a>
                <a href="#stage2" onClick={() => setIsMenuOpen(false)}>Stage 2</a>
                <a href="#stage3" onClick={() => setIsMenuOpen(false)}>Stage 3</a>
                <a href="#stage4" onClick={() => setIsMenuOpen(false)}>Stage 4</a>
                <a href="#stage5" onClick={() => setIsMenuOpen(false)}>Stage 5</a>
              </div>
            )}
          </div>
          <a href="#clinic" onClick={() => setIsMenuOpen(false)}>Clinic</a>
          <a href="#disposable" onClick={() => setIsMenuOpen(false)}>Disposable</a>
          <a href="#about" onClick={() => setIsMenuOpen(false)}>About Us</a>
          <a href="#contact" onClick={() => setIsMenuOpen(false)}>Contact</a>
        </nav>
        <div className="header-actions">
          <button className="search-btn">
            <i className="fas fa-search"></i>
          </button>
          <div className="cart">
            <span className="cart-count">{cartCount}</span>
            <i className="fas fa-shopping-cart"></i>
          </div>
          {currentUser ? (
            <div className="auth-actions">
              <span className="user-name">مرحباً {currentUser.displayName}</span>
              <button className="auth-btn" onClick={handleSignOut}>
                تسجيل خروج
              </button>
            </div>
          ) : (
            <Link to="/signin" className="auth-btn">
              تسجيل دخول
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header 