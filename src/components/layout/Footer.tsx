import '../../styles/Footer.css'

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>Contact Us</h3>
          <p><i className="fas fa-phone"></i> +1234567890</p>
          <p><i className="fas fa-envelope"></i> info@dentifystore.com</p>
        </div>
        <div className="footer-section">
          <h3>Quick Links</h3>
          <a href="#about">About Us</a>
          <a href="#products">Products</a>
          <a href="#contact">Contact</a>
        </div>
        <div className="footer-section">
          <h3>Follow Us</h3>
          <div className="social-links">
            <a href="#"><i className="fab fa-facebook"></i></a>
            <a href="#"><i className="fab fa-instagram"></i></a>
            <a href="#"><i className="fab fa-twitter"></i></a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>All Rights Reserved © 2023 DentifyStore</p>
      </div>
    </footer>
  )
}

export default Footer 