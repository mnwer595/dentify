import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useCart } from '../../contexts/CartContext'
import '../../styles/Header.css'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const { currentUser, signOut } = useAuth()
  const { getItemsCount } = useCart()
  const navigate = useNavigate()
  const menuRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const searchRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isMenuOpen && 
          menuRef.current && 
          buttonRef.current && 
          !menuRef.current.contains(event.target as Node) && 
          !buttonRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false)
      }

      if (isSearchOpen &&
          searchRef.current &&
          !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false)
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false)
        setIsSearchOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isMenuOpen, isSearchOpen])

  useEffect(() => {
    if (window.innerWidth > 768) {
      setIsMenuOpen(false)
    }
  }, [])

  const handleSignOut = async () => {
    try {
      await signOut()
      navigate('/')
    } catch (error) {
      console.error('Failed to sign out:', error)
    }
  }

  const handleNavClick = () => {
    setIsMenuOpen(false)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchTerm.trim())}`)
      setIsSearchOpen(false)
      setSearchTerm('')
    }
  }

  return (
    <header className="header">
      <div className="header-main">
        <div className="header-main-content">
          <Link to="/" className="logo">
            <h1>DentifyStore</h1>
            <span>Dental Supplies</span>
          </Link>
          <button 
            ref={buttonRef}
            className="mobile-menu-button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-expanded={isMenuOpen}
          >
            <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
          </button>
          <div className={`overlay ${isMenuOpen ? 'active' : ''}`} onClick={() => setIsMenuOpen(false)}></div>
          <nav ref={menuRef} className={`nav ${isMenuOpen ? 'active' : ''}`}>
            <Link to="/" className="nav-link" onClick={handleNavClick}>Home</Link>
            <Link to="/shop?category=university" className="nav-link" onClick={handleNavClick}>University</Link>
            <Link to="/shop?category=clinic" className="nav-link" onClick={handleNavClick}>Clinic</Link>
            <Link to="/shop?category=disposable" className="nav-link" onClick={handleNavClick}>Disposable</Link>
            <Link to="/shop" className="nav-link" onClick={handleNavClick}>Shop</Link>
            {currentUser && <Link to="/orders" className="nav-link" onClick={handleNavClick}>My Orders</Link>}
            {currentUser ? (
              <button className="nav-link sign-out-btn" onClick={handleSignOut}>
                <i className="fas fa-sign-out-alt"></i>
                Sign Out
              </button>
            ) : (
              <Link to="/signin" className="nav-link sign-in-btn" onClick={handleNavClick}>
                <i className="fas fa-sign-in-alt"></i>
                Sign In
              </Link>
            )}
          </nav>
          <div ref={searchRef} className="search-container">
            <div className="search-form desktop-search">
              <form onSubmit={handleSearch}>
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button type="submit" aria-label="Search">
                  <i className="fas fa-search"></i>
                </button>
              </form>
            </div>
            <button 
              className="search-btn"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              aria-label="Toggle search"
            >
              <i className={`fas ${isSearchOpen ? 'fa-times' : 'fa-search'}`}></i>
            </button>
            {isSearchOpen && (
              <div className="search-form mobile-search">
                <form onSubmit={handleSearch}>
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    autoFocus
                  />
                  <button type="submit" aria-label="Search">
                    <i className="fas fa-search"></i>
                  </button>
                  <button 
                    type="button" 
                    className="close-search"
                    onClick={() => setIsSearchOpen(false)}
                    aria-label="Close search"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </form>
              </div>
            )}
          </div>
          <div className="header-actions">
            <Link to="/cart" className="cart">
              <i className="fas fa-shopping-cart"></i>
              {getItemsCount() > 0 && (
                <span className="cart-count">{getItemsCount()}</span>
              )}
            </Link>
            {!currentUser && (
              <Link to="/signin" className="auth-btn desktop-only">
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