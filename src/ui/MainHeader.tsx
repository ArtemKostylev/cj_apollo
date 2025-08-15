import React, { MouseEventHandler, RefObject } from "react";
import "../styles/Header.css";
import { useUserData } from "../hooks/useUserData";
import { useHistory, useLocation } from "react-router-dom";
import {
    ADMIN_RESOURCES,
    SUBGROUPS_RESOURCE,
    USER_RESOURCES,
} from "../constants/resources";

function getHeaderFromRoute(pathname: string) {
    const key = pathname.replace("/", "");

    const route =
        USER_RESOURCES[key] || ADMIN_RESOURCES[key] || SUBGROUPS_RESOURCE;
    return route.title.toUpperCase() || "КЛАССНЫЙ ЖУРНАЛ";
}

type Props = {
    onMenuClick: MouseEventHandler<HTMLDivElement>;
    menuRef: RefObject<any>;
};

export default function MainHeader({ onMenuClick, menuRef }: Props) {
    let history = useHistory();
    const auth = useUserData();
    const location = useLocation();

    const logout = () => {
        auth.signOut(() => {
            history.push("/login");
        });
    };
    return (
        <div className="header noselect">
            <div onClick={onMenuClick} className="menu_button" ref={menuRef}>
                МЕНЮ
            </div>
            <div className="header_title">
                <h1>{getHeaderFromRoute(location.pathname)}</h1>
            </div>
            <div className="exit_button" onClick={logout}>
                Выйти
            </div>
        </div>
    );
}
