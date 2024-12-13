import '../../styles/Categories.css'

const Categories = () => {
  return (
    <section className="categories">
      <h2>Product Categories</h2>
      <div className="categories-grid">
        <div className="category-card university">
          <h3>University</h3>
          <div className="stages">
            <a href="#stage1">Stage 1</a>
            <a href="#stage2">Stage 2</a>
            <a href="#stage3">Stage 3</a>
            <a href="#stage4">Stage 4</a>
            <a href="#stage5">Stage 5</a>
          </div>
        </div>
        <div className="category-card clinic">
          <h3>Clinic</h3>
          <p>Professional dental clinic supplies and equipment</p>
          <div className="category-image clinic-image"></div>
        </div>
        <div className="category-card disposable">
          <h3>Disposable</h3>
          <p>High-quality disposable dental supplies</p>
          <div className="category-image disposable-image"></div>
        </div>
      </div>
    </section>
  )
}

export default Categories 