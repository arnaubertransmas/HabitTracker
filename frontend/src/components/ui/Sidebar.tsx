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
import '../../assets/css/sidebar.css';

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const primaryColor = '#007bff';
  const user = `/user/${localStorage.getItem('user_name')}`;

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
      // Check if this link has the activeClicked class
      const hasActiveClass =
        e.currentTarget.classList.contains('activeClicked');

      // If it's active, keep the primary color background, otherwise transparent
      (menuItem as HTMLElement).style.backgroundColor = hasActiveClass
        ? primaryColor
        : 'transparent';

      // If it's active, keep text white, otherwise revert to #333
      (menuItem as HTMLElement).style.color = hasActiveClass ? 'white' : '#333';
    }
  };

  return (
    <div className="sidebar-container">
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
              onMouseLeave={(e) =>
                hoverLinkLeave(
                  e,
                  e.currentTarget.classList.contains('activeClicked'),
                )
              }
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
              onMouseLeave={(e) =>
                hoverLinkLeave(
                  e,
                  e.currentTarget.classList.contains('activeClicked'),
                )
              }
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
              onMouseLeave={(e) =>
                hoverLinkLeave(
                  e,
                  e.currentTarget.classList.contains('activeClicked'),
                )
              }
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
              onMouseLeave={(e) =>
                hoverLinkLeave(
                  e,
                  e.currentTarget.classList.contains('activeClicked'),
                )
              }
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
              onMouseLeave={(e) =>
                hoverLinkLeave(
                  e,
                  e.currentTarget.classList.contains('activeClicked'),
                )
              }
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
