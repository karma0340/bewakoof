import './Loader.css';

const Loader = ({ fullPage = false }) => {
  return (
    <div className={`bewakoof-loader-container ${fullPage ? 'full-page' : ''}`}>
      <div className="bewakoof-spinner-wrap">
        <img 
          src="/bwkf-loader.gif" 
          alt="Loading..." 
          className="bewakoof-loader-gif" 
        />
        <div className="loader-text">Loading...</div>
      </div>
    </div>
  );
};

export default Loader;

