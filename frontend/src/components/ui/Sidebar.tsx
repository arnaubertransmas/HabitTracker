import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faLock,
  faCalendarCheck,
  faCircleUser,
  faTable,
  faChartLine,
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
  const [isMobile, setIsMobile] = useState(false);
  const primaryColor = '#007bff';
  const user = `/user/${localStorage.getItem('user_name')}`;

  // Control the screen size
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);

      if (window.innerWidth < 768) {
        // Only icons on tablet
        setCollapsed(true);
      } else {
        // Icons + text on desktop
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
  const hoverLinkEnter = (e: any) => {
    if (isMobile) return; // Skip hover effects on mobile

    const menuItem = e.currentTarget.querySelector('.sidebar-menu-item');
    if (menuItem) {
      menuItem.style.backgroundColor = '#EEEEEE';
      menuItem.style.color = '#333';
    }
  };

  const hoverLinkLeave = (e: any, isActive: any) => {
    if (isMobile) return; // Skip hover effects on mobile

    const menuItem = e.currentTarget.querySelector('.sidebar-menu-item');
    if (menuItem) {
      // Check if this link has the activeClicked class
      const hasActiveClass =
        e.currentTarget.classList.contains('activeClicked');

      // If it's active, keep the primary color background, otherwise transparent
      menuItem.style.backgroundColor = hasActiveClass
        ? primaryColor
        : 'transparent';

      // If it's active, keep text white, otherwise revert to #333
      menuItem.style.color = hasActiveClass ? 'white' : '#333';
    }
  };

  // Navigation links data
  const navLinks = [
    { to: user, icon: faCircleUser, label: 'Dashboard' },
    { to: '/non-negotiables', icon: faLock, label: 'Non-negotiables' },
    { to: '/habits', icon: faCalendarCheck, label: 'Habits' },
    { to: '/schedule', icon: faTable, label: 'Schedule' },
    { to: '/progress', icon: faChartLine, label: 'Progress' },
  ];

  // Render a horizontal mobile navigation bar
  if (isMobile) {
    return (
      <div className="mobile-navbar">
        <nav className="mobile-nav">
          {navLinks.map((link, index) => (
            <NavLink
              key={index}
              to={link.to}
              className={({ isActive }) =>
                `mobile-nav-link ${isActive ? 'mobile-nav-active' : ''}`
              }
            >
              <FontAwesomeIcon icon={link.icon} />
              <span className="mobile-nav-label">{link.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    );
  }

  // Render the regular sidebar for desktop/tablet
  return (
    <div className="sidebar-container">
      <CDBSidebar
        textColor="#333"
        backgroundColor="transparent"
        className={collapsed ? 'collapsed-sidebar' : 'expanded-sidebar'}
        toggled={collapsed}
        breakpoint={768}
        minWidth={'80'}
        maxWidth={'275'}
      >
        <CDBSidebarContent className="sidebar-content">
          <CDBSidebarHeader prefix={<></>}>Features</CDBSidebarHeader>
          <CDBSidebarMenu>
            {navLinks.map((link, index) => (
              <NavLink
                key={index}
                to={link.to}
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
                    icon={link.icon}
                    style={{ ...iconMargin, color: 'inherit' }}
                  />
                  {!collapsed && link.label}
                </CDBSidebarMenuItem>
              </NavLink>
            ))}
          </CDBSidebarMenu>
        </CDBSidebarContent>
      </CDBSidebar>
    </div>
  );
};

export default Sidebar;
