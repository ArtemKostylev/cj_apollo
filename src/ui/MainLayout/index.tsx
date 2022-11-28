import React, {useRef, useState} from 'react';
import {ErrorBoundary} from 'react-error-boundary';
import {ErrorScreen} from '../../Pages/ErrorScreen';
import Menu from '../Menu';
import MainHeader from '../MainHeader';
import {MainRouter} from '../../MainRouter';
import {AppWrapper} from './style/AppWrapper.styled';
import {Cover} from './style/Cover.styled';
import {Content} from './style/Content.styled';

export const MainLayout = () => {
  const [menuVisible, setMenuVisible] = useState(false);
  const menuRef = useRef();

  const onMenuClick = () => {
    setMenuVisible((prev) => !prev);
  };

  return (
    <AppWrapper>
      <ErrorBoundary FallbackComponent={ErrorScreen}>
        <Menu isOpen={menuVisible} onClose={() => setMenuVisible((prev) => !prev)}/>
        <Cover menuVisible={menuVisible} onClick={() => setMenuVisible((prev) => !prev)}/>
        <Content menuVisible={menuVisible}>
          <MainHeader onMenuClick={onMenuClick} menuRef={menuRef}/>
          <MainRouter/>
        </Content>
      </ErrorBoundary>
    </AppWrapper>
  );
}