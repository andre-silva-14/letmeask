import React, { ReactNode, useState } from 'react';

import './styles.scss';

type SideDrawerProps = {
  children: ReactNode;
  footerLastCount?: number;
};

export function SideDrawer({ children, footerLastCount = 0 }: SideDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);

  function handleOpenNav() {
    setIsOpen(!isOpen);
  }

  const childrenArray = React.Children.toArray(children);
  const mainChildren = childrenArray.slice(
    0,
    childrenArray.length - footerLastCount
  );
  const footerChildren = childrenArray.slice(
    childrenArray.length - footerLastCount
  );

  return (
    <div className="side-drawer">
      <div
        className={`burger ${isOpen ? 'toggle' : ''}`}
        onClick={handleOpenNav}
      >
        <div className="line1" />
        <div className="line2" />
        <div className="line3" />
      </div>
      <aside className={`tabs ${isOpen ? 'nav-active' : ''}`}>
        <ul>
          {React.Children.map(mainChildren, (elem, index) => {
            const element = elem as React.ReactElement<any>;
            return React.cloneElement(element, {
              style: {
                ...element.props.style,
                animation: isOpen
                  ? `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`
                  : ''
              }
            });
          })}
        </ul>
        <footer>
          {React.Children.map(footerChildren, (elem, index) => {
            const element = elem as React.ReactElement<any>;
            return React.cloneElement(element, {
              style: {
                ...element.props.style,
                animation: isOpen
                  ? `navLinkFadeFooter 0.5s ease-out forwards ${
                      (mainChildren.length / 2 + index) / 7 + 0.3
                    }s`
                  : ''
              }
            });
          })}
        </footer>
      </aside>
    </div>
  );
}
