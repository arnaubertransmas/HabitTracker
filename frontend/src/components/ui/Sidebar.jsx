import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faCalendarCheck } from '@fortawesome/free-solid-svg-icons';
import { NavLink } from 'react-router-dom';
import {
  CDBSidebar,
  CDBSidebarContent,
  CDBSidebarMenu,
  CDBSidebarMenuItem,
  CDBSidebarHeader,
} from 'cdbreact';

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  // controlem la mida de la pantalla
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        // només icones
        setCollapsed(true);
      } else {
        // icones + text
        setCollapsed(false);
      }
    };

    // Initial check
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const iconMargin = { marginRight: '15px' };

  const hoverLinkEnter = (e) => {
    e.target.style.color = 'black';
    e.target.style.backgroundColor = '#EEEEEE';
  };

  const hoverLinkLeave = (e) => {
    e.target.style.color = '#333';
    e.target.style.backgroundColor = 'transparent';
  };

  return (
    <CDBSidebar
      textColor="#333"
      backgroundColor="transparent"
      style={{ width: collapsed ? '80px' : '275px' }}
      toggled={collapsed} // toggled true = only icons
    >
      <CDBSidebarContent className="sidebar-content">
        <CDBSidebarHeader prefix={<></>}>Features</CDBSidebarHeader>

        <CDBSidebarMenu>
          <NavLink
            to="/non-negotiables"
            className={({ isActive }) => (isActive ? 'activeClicked' : '')}
            onMouseEnter={hoverLinkEnter}
            onMouseLeave={hoverLinkLeave}
          >
            <CDBSidebarMenuItem>
              <FontAwesomeIcon icon={faLock} style={iconMargin} />
              {!collapsed && 'Non-negotiables'}
            </CDBSidebarMenuItem>
          </NavLink>

          <NavLink
            to="/habits"
            className={({ isActive }) => (isActive ? 'activeClicked' : '')}
            onMouseEnter={hoverLinkEnter}
            onMouseLeave={hoverLinkLeave}
          >
            <CDBSidebarMenuItem>
              <FontAwesomeIcon icon={faCalendarCheck} style={iconMargin} />
              {!collapsed && 'Habits'}
            </CDBSidebarMenuItem>
          </NavLink>

          <NavLink
            to="/schedule"
            className={({ isActive }) => (isActive ? 'activeClicked' : '')}
            onMouseEnter={hoverLinkEnter}
            onMouseLeave={hoverLinkLeave}
          >
            <CDBSidebarMenuItem>
              <i className="fa fa-table" style={iconMargin} />
              {!collapsed && 'Schedule'}
            </CDBSidebarMenuItem>
          </NavLink>

          <NavLink
            to="/progress"
            className={({ isActive }) => (isActive ? 'activeClicked' : '')}
            onMouseEnter={hoverLinkEnter}
            onMouseLeave={hoverLinkLeave}
          >
            <CDBSidebarMenuItem>
              <i className="fa fa-chart-line" style={iconMargin} />
              {!collapsed && 'Progress'}
            </CDBSidebarMenuItem>
          </NavLink>
        </CDBSidebarMenu>
      </CDBSidebarContent>
    </CDBSidebar>
  );
};

export default Sidebar;
