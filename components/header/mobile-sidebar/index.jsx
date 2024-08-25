"use client";
import Cookies from "js-cookie";
import Link from "next/link";
import {
  Menu,
  MenuItem,
  ProSidebarProvider,
  Sidebar,
  SubMenu,
} from "react-pro-sidebar";

import { useRouter } from "next/router";
import { useCallback, useContext } from "react";
import mobileMenuData from "../../../data/mobileMenuData";
import { UserContext } from "../../../pages/context/UserContext";
import {
  isActiveLink,
  isActiveParentChaild,
} from "../../../utils/linkActiveChecker";
import SidebarFooter from "./SidebarFooter";
import SidebarHeader from "./SidebarHeader";

const Index = () => {
  const router = useRouter();
  const user = useContext(UserContext);

  const onLogOut = useCallback(async () => {
    Cookies.remove('token');
    await router.replace('/');
    window.location.reload();
  }, [router]);

  return (
    <div
      className="offcanvas offcanvas-start mobile_menu-contnet"
      tabIndex="-1"
      id="offcanvasMenu"
      data-bs-scroll="true"
    >
      <SidebarHeader />
      {/* End pro-header */}

      <ProSidebarProvider>
        <Sidebar>
          <Menu>
            {mobileMenuData.map((item) => {
              const items = typeof item.items === 'function' ? item.items(user, onLogOut) : item.items;
              return (
                <SubMenu
                  className={
                    isActiveParentChaild(items, router.asPath)
                      ? "menu-active"
                      : ""
                  }
                  label={item.label}
                  key={item.id}
                >
                  {items.map((menuItem, i) => menuItem.routePath ? (
                    <MenuItem
                      className={
                        isActiveLink(menuItem.routePath, router.asPath)
                          ? "menu-active-link"
                          : ""
                      }
                      key={i}
                      routerLink={<Link href={menuItem.routePath} />}
                    >
                      {menuItem.name}
                    </MenuItem>
                  ) : (
                    <MenuItem
                      className="menu-active-link"
                      onClick={menuItem.onClick}
                    >
                      Logout
                    </MenuItem>
                  ))}
                </SubMenu>
              )
            })}
          </Menu>
        </Sidebar>
      </ProSidebarProvider>

      <SidebarFooter />
    </div>
  );
};

export default Index;
