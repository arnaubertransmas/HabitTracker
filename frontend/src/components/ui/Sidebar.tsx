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
// import './Sidebar.css'; // Add a custom CSS file

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  // control the screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        // only icons
        setCollapsed(true);
      } else {
        // icons + text
        setCollapsed(false);
      }
    };

    // Initial check
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const iconMargin = { marginRight: '15px' };

  const hoverLinkEnter = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Use type assertion to tell TypeScript e.target is an HTMLAnchorElement
    (e.target as HTMLElement).style.color = 'black';
    (e.target as HTMLElement).style.backgroundColor = '#EEEEEE';
  };

  const hoverLinkLeave = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Use type assertion to tell TypeScript e.target is an HTMLAnchorElement
    (e.target as HTMLElement).style.color = '#333';
    (e.target as HTMLElement).style.backgroundColor = 'transparent';
  };

  return (
    <CDBSidebar
      textColor="#333"
      backgroundColor="transparent"
      className={collapsed ? 'collapsed-sidebar' : 'expanded-sidebar'}
      toggled={collapsed} // You must include the toggled prop
      breakpoint={768} // Define a breakpoint to trigger the collapse
      minWidth={'80'} // Define the minimum width
      maxWidth={'275'} // Define the maximum width
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
