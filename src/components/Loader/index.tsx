import './styles.scss';

// Inspired on: https://dribbble.com/shots/2150230-Loader-Gooey-effect
export function Loader() {
  return (
    <div className="loader-container">
      <div className="wrapper">
        <div className="ball ball-1"></div>
        <div className="ball ball-2"></div>
        <div className="ball ball-3"></div>
      </div>
    </div>
  );
}
