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
    <div
      style={{
        display: 'flex',
        height: '100vh',
        overflow: 'scroll initial',
      }}
    >
      <CDBSidebar
        textColor="#333"
        backgroundColor="transparent"
        style={{ width: collapsed ? '80px' : '275px' }}
        toggled={collapsed} // toggled true = només icones
      >
        <CDBSidebarContent className="sidebar-content">
          <CDBSidebarHeader prefix={<i className="fa fa-bars" />}>
            Features
          </CDBSidebarHeader>
          <CDBSidebarMenu>
            <NavLink
              to="/non-negotiables"
              activeClassName="activeClicked"
              onMouseEnter={hoverLinkEnter}
              onMouseLeave={hoverLinkLeave}
            >
              <CDBSidebarMenuItem>
                <FontAwesomeIcon icon={faLock} style={iconMargin} />
                {!collapsed && 'Non-negotiables'}
              </CDBSidebarMenuItem>
            </NavLink>

            <NavLink
              exact
              to="/habits"
              activeClassName="activeClicked"
              onMouseEnter={hoverLinkEnter}
              onMouseLeave={hoverLinkLeave}
            >
              <CDBSidebarMenuItem>
                <FontAwesomeIcon icon={faCalendarCheck} style={iconMargin} />
                {!collapsed && 'Habits'}
              </CDBSidebarMenuItem>
            </NavLink>

            <NavLink
              exact
              to="/schedule"
              activeClassName="activeClicked"
              onMouseEnter={hoverLinkEnter}
              onMouseLeave={hoverLinkLeave}
            >
              <CDBSidebarMenuItem>
                <i className="fa fa-table" style={iconMargin} />
                {!collapsed && 'Schedule'}
              </CDBSidebarMenuItem>
            </NavLink>

            <NavLink
              exact
              to="/progress"
              activeClassName="activeClicked"
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
    </div>
  );
};

export default Sidebar;
