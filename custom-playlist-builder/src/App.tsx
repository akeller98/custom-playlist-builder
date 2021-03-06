import React from 'react';
import DesktopLayout from './desktop/DesktopLayout';
import MobileLayout from './mobile/MobileLayout';
import { useMediaQuery } from 'react-responsive';

export default function App() {
  const isDesktopOrLaptop = useMediaQuery({
    query: '(min-device-width: 1224px)'
  })
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1223px)' });
  
  return (
    <React.Fragment>
      {isDesktopOrLaptop ? 
        <DesktopLayout/> :
        <MobileLayout/>
      }
    </React.Fragment>
  )
}