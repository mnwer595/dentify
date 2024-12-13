import { useNavigate } from 'react-router-dom';
import '../../styles/Categories.css';

export const Categories = () => {
  const navigate = useNavigate();

  const handleCategoryClick = (category: string, stage?: string) => {
    const queryParams = new URLSearchParams();
    queryParams.set('category', category);
    if (stage) {
      queryParams.set('stage', stage);
    }
    navigate(`/shop?${queryParams.toString()}`);
  };

  return (
    <section className="categories">
      <h2>Shop by Category</h2>
      <div className="categories-grid">
        <div className="category-card university" onClick={() => handleCategoryClick('university')}>
          <div className="category-content">
            <h3>University</h3>
            <div className="stages">
              <div onClick={(e) => {
                e.stopPropagation();
                handleCategoryClick('university', 'stage1');
              }}>First Year</div>
              <div onClick={(e) => {
                e.stopPropagation();
                handleCategoryClick('university', 'stage2');
              }}>Second Year</div>
              <div onClick={(e) => {
                e.stopPropagation();
                handleCategoryClick('university', 'stage3');
              }}>Third Year</div>
              <div onClick={(e) => {
                e.stopPropagation();
                handleCategoryClick('university', 'stage4');
              }}>Fourth Year</div>
              <div onClick={(e) => {
                e.stopPropagation();
                handleCategoryClick('university', 'stage5');
              }}>Fifth Year</div>
            </div>
          </div>
        </div>

        <div className="category-card clinic" onClick={() => handleCategoryClick('clinic')}>
          <div className="category-content">
            <h3>Clinic</h3>
            <p>Professional dental equipment and supplies for clinics</p>
          </div>
        </div>

        <div className="category-card disposable" onClick={() => handleCategoryClick('disposable')}>
          <div className="category-content">
            <h3>Disposable</h3>
            <p>Essential disposable dental supplies</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Categories; 