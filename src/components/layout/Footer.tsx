import { Link } from 'react-router-dom';
import '../../styles/Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <div className="footer-brand">
            <h2>DentifyStore</h2>
            <p>Your trusted source for quality dental supplies and equipment.</p>
            <div className="social-links">
              <a href="#" aria-label="Facebook">
                <i className="fab fa-facebook"></i>
              </a>
              <a href="#" aria-label="Instagram">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" aria-label="Twitter">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" aria-label="LinkedIn">
                <i className="fab fa-linkedin"></i>
              </a>
            </div>
          </div>
        </div>

        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/shop">Shop</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            <li><Link to="/faq">FAQ</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Categories</h3>
          <ul>
            <li><Link to="/shop?category=clinic">Clinic Equipment</Link></li>
            <li><Link to="/shop?category=university">University Supplies</Link></li>
            <li><Link to="/shop?category=disposable">Disposable Items</Link></li>
            <li><Link to="/shop?category=instruments">Instruments</Link></li>
            <li><Link to="/shop?category=materials">Materials</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Contact Info</h3>
          <ul className="contact-info">
            <li>
              <i className="fas fa-map-marker-alt"></i>
              <span>123 Dental Street, Medical District<br />Cairo, Egypt</span>
            </li>
            <li>
              <i className="fas fa-phone"></i>
              <span>+1234567890</span>
            </li>
            <li>
              <i className="fas fa-envelope"></i>
              <span>info@dentify.com</span>
            </li>
            <li>
              <i className="fas fa-clock"></i>
              <span>Mon - Fri: 9:00 AM - 6:00 PM<br />Sat: 10:00 AM - 4:00 PM</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-bottom-content">
          <p>&copy; {new Date().getFullYear()} DentifyStore. All rights reserved.</p>
          <div className="footer-links">
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms of Service</Link>
            <Link to="/shipping">Shipping Policy</Link>
          </div>
          <div className="payment-methods">
            <i className="fab fa-cc-visa"></i>
            <i className="fab fa-cc-mastercard"></i>
            <i className="fab fa-cc-paypal"></i>
            <i className="fab fa-cc-amex"></i>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 