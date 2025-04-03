import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faLock,
  faCalendarCheck,
  faCircleUser,
} from '@fortawesome/free-solid-svg-icons';
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
  const primaryColor = '#007bff';
  const username = localStorage.getItem('user_name') || '';
  const user = `/user/${username}`;

  // Control the screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        // Only icons
        setCollapsed(true);
      } else {
        // Icons + text
        setCollapsed(false);
      }
    };

    // Initial check
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const iconMargin = { marginRight: '15px' };

  // Apply hover effect only to the specific element, not the whole page
  const hoverLinkEnter = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const menuItem = e.currentTarget.querySelector('.sidebar-menu-item');
    if (menuItem) {
      (menuItem as HTMLElement).style.backgroundColor = '#EEEEEE';
      (menuItem as HTMLElement).style.color = '#333';
    }
  };

  const hoverLinkLeave = (
    e: React.MouseEvent<HTMLAnchorElement>,
    isActive: boolean,
  ) => {
    const menuItem = e.currentTarget.querySelector('.sidebar-menu-item');
    if (menuItem) {
      (menuItem as HTMLElement).style.backgroundColor = 'transparent';
      // If it's active, maintain the primary color, otherwise revert to #333
      (menuItem as HTMLElement).style.color = isActive ? primaryColor : '#333';
    }
  };

  return (
    <div
      className="sidebar-container"
      style={{
        height: '100%',
        position: 'fixed',
        zIndex: 1000,
        overflowX: 'hidden',
        transition: '0.3s',
      }}
    >
      <style>
        {`
          .activeClicked {
            background-color: #007bff;
            color: white;
          }
          .sidebar-container {
            height: 100%;
            position: fixed;
            z-index: 1000;
            overflow-x: hidden;
            transition: 0.3s;
          }
          .sidebar-menu-item {
            transition: background-color 0.3s, color 0.3s;
          }
        `}
      </style>

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
            {/*Dashboard Menu Item */}
            <NavLink
              to={user}
              className={({ isActive }) => (isActive ? 'activeClicked' : '')}
              onMouseEnter={hoverLinkEnter}
              onMouseLeave={(e) => hoverLinkLeave(e, false)}
              style={{
                color: 'inherit',
              }}
            >
              <CDBSidebarMenuItem className="sidebar-menu-item">
                <FontAwesomeIcon
                  icon={faCircleUser}
                  style={{ ...iconMargin, color: 'inherit' }}
                />
                {!collapsed && 'Dashboard'}
              </CDBSidebarMenuItem>
            </NavLink>

            {/* Non-negotiables Menu Item */}
            <NavLink
              to="/non-negotiables"
              className={({ isActive }) => (isActive ? 'activeClicked' : '')}
              onMouseEnter={hoverLinkEnter}
              onMouseLeave={(e) => hoverLinkLeave(e, false)}
              style={{
                color: 'inherit',
              }}
            >
              <CDBSidebarMenuItem className="sidebar-menu-item">
                <FontAwesomeIcon
                  icon={faLock}
                  style={{ ...iconMargin, color: 'inherit' }}
                />
                {!collapsed && 'Non-negotiables'}
              </CDBSidebarMenuItem>
            </NavLink>

            {/* Habits Menu Item */}
            <NavLink
              to="/habits"
              className={({ isActive }) => (isActive ? 'activeClicked' : '')}
              onMouseEnter={hoverLinkEnter}
              onMouseLeave={(e) => hoverLinkLeave(e, false)}
              style={{
                color: 'inherit',
              }}
            >
              <CDBSidebarMenuItem className="sidebar-menu-item">
                <FontAwesomeIcon
                  icon={faCalendarCheck}
                  style={{ ...iconMargin, color: 'inherit' }}
                />
                {!collapsed && 'Habits'}
              </CDBSidebarMenuItem>
            </NavLink>

            {/* Schedule Menu Item */}
            <NavLink
              to="/schedule"
              className={({ isActive }) => (isActive ? 'activeClicked' : '')}
              onMouseEnter={hoverLinkEnter}
              onMouseLeave={(e) => hoverLinkLeave(e, false)}
              style={{
                color: 'inherit',
              }}
            >
              <CDBSidebarMenuItem className="sidebar-menu-item">
                <i
                  className="fa fa-table"
                  style={{ ...iconMargin, color: 'inherit' }}
                />
                {!collapsed && 'Schedule'}
              </CDBSidebarMenuItem>
            </NavLink>

            {/* Progress Menu Item */}
            <NavLink
              to="/progress"
              className={({ isActive }) => (isActive ? 'activeClicked' : '')}
              onMouseEnter={hoverLinkEnter}
              onMouseLeave={(e) => hoverLinkLeave(e, false)}
              style={{
                color: 'inherit',
              }}
            >
              <CDBSidebarMenuItem className="sidebar-menu-item">
                <i
                  className="fa fa-chart-line"
                  style={{ ...iconMargin, color: 'inherit' }}
                />
                {!collapsed && 'Progress'}
              </CDBSidebarMenuItem>
            </NavLink>
          </CDBSidebarMenu>
        </CDBSidebarContent>
      </CDBSidebar>
    </div>
  );
};

export default Sidebar;
