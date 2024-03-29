import React, {useMemo} from 'react';
import styled from 'styled-components';
import {Link} from 'react-router-dom';
import {useAuth} from '../hooks/useAuth';
import {ADMIN_RESOURCES, USER_RESOURCES, SUBGROUPS_RESOURCE,} from '../constants/resources';
import {ADMIN, TEACHER} from '../constants/roles';
import {t} from '../static/text';
import {getCurrentAcademicYear} from '../utils/academicDate';

const MenuItemWrapper = styled.div`
  text-align: left;
  display: flex;
  width: 100%;
  background-color: #f4f7f6;
  border-bottom: 1px solid #e6eaea;
  cursor: pointer;
  height: 78px;
  flex-direction: row;
  justify-content: space-between;

  &:hover {
    background-color: white;
  }
`;

const MenuItemText = styled.p`
  margin: 0;
  padding-left: 20px;
  font-size: 1rem;
`;

const MenuItemLink = styled(Link)`
  text-decoration: none;
  color: inherit;
  width: 100%;
`;

const MenuItem = ({path, onClose, title}) => {
    return (
        <MenuItemWrapper key={path}>
            <MenuItemLink to={path} onClick={onClose}>
                <MenuItemText>{title}</MenuItemText>
            </MenuItemLink>
        </MenuItemWrapper>
    );
};

const MenuWrapper = styled.div`
  width: 20vw;
  height: 100%;
  background-color: #f4f7f6;
  box-shadow: 4px 5px 5px lightgray;
  line-height: 78px;
  transform: ${(props) =>
          props.isOpen ? 'translateX(0vw)' : 'translateX(-21vw)'};
  transition: transform 0.5s;
  margin: 0;
  font-family: 'IBM Plex Serif', serif;
  user-select: none;
`;

const MenuCloseButton = styled.div`
  float: right;
  padding-right: 20px;
  cursor: pointer;

  &:hover {
    color: rgb(58, 58, 58);
    transition: color 0.5s;
  }
`;

const resourceMap = {
    [ADMIN]: ADMIN_RESOURCES,
    [TEACHER]: USER_RESOURCES,
};

export default function Menu({onClose, isOpen}) {
    const auth = useAuth();

    const resources = useMemo(() => {
        const res = resourceMap[auth.user?.role];

        if (auth.user?.versions[getCurrentAcademicYear()]?.courses.some((course) => course.group)) {
            res.subgroups = SUBGROUPS_RESOURCE;
        }

        return res;
    }, [auth.user]);

    if (!resources) return null;

    return (
        <MenuWrapper isOpen={isOpen}>
            <MenuItemWrapper>
                <MenuItemText>МЕНЮ</MenuItemText>
                <MenuCloseButton onClick={onClose}>{t('close')}</MenuCloseButton>
            </MenuItemWrapper>
            {Object.keys(resources).map((key) => (
                <MenuItem {...resources[key]} key={key} onClose={onClose}/>
            ))}
        </MenuWrapper>
    );
}
