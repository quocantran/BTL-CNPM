"use client";
import React, { useEffect, useRef, useState } from "react";
import classnames from "classnames/bind";
import styles from "../../../styles/Header.module.scss";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import {
  Avatar,
  Dropdown,
  Skeleton,
  Space,
  message,
  Button,
  notification,
} from "antd";
import {
  ContactsOutlined,
  DashOutlined,
  FileWordOutlined,
  InsertRowLeftOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { setLogoutAction } from "@/lib/redux/slice/auth.slice";
import { logout } from "@/config/api";
const cx = classnames.bind(styles);

interface IMessageFromServer {
  message: string;
  companyName: string;
  jobId: string;
  type: string;
}

const Header: React.FC = () => {
  const isAuth = useAppSelector((state) => state?.auth.isAuthenticated);
  const user = useAppSelector((state) => state?.auth.user);
  const loading = useAppSelector((state) => state?.auth.isLoading);
  const userRole = user?.role.name;

  const dispatch = useAppDispatch();
  const handleLogout = async () => {
    const data = await logout();

    dispatch(setLogoutAction({}));
    window.location.reload();
  };

  const itemsDropdown = [
    userRole !== "NORMAL_USER" && {
      label: <Link href={"/admin"}>Trang Quản Trị</Link>,
      key: "admin",
      icon: <DashOutlined />,
    },
    {
      label: <Link href={"/"}>Tìm Phim</Link>,
      key: "movies",
      icon: <FileWordOutlined />,
    },
    {
      label: <Link href={"/"}>Danh sách ...</Link>,
      key: "companies",
      icon: <InsertRowLeftOutlined />,
    },
    {
      label: (
        <label style={{ cursor: "pointer" }} onClick={() => handleLogout()}>
          Đăng xuất
        </label>
      ),
      key: "logout",
      icon: <LogoutOutlined />,
    },
  ];

  return (
    <div className={cx("wrapper")}>
      <div className={cx("container")}>
        <Link href="/">
          <img className={cx("logo")} src="/images/logo.png" alt="logo" />
        </Link>
        <div className={cx("header-left")}>
          <div className={cx("header-item")}>
            <Link href="/">TÌM Phim</Link>
          </div>
          <div className={cx("header-item")}>
            <Link href="/">DANH SÁCH PHIM</Link>
          </div>
        </div>

        {loading ? (
          <Skeleton.Avatar style={{ width: "50px", height: "50px" }} active />
        ) : (
          <div className={cx("header-right")}>
            {isAuth ? (
              <div className={cx("right-items")}>
                <Dropdown
                  menu={{ items: itemsDropdown as any }}
                  trigger={["click"]}
                  arrow={true}
                >
                  <Space style={{ cursor: "pointer" }}>
                    <span>Xin chào {user?.name}</span>
                    <Avatar>
                      {" "}
                      {user?.name?.substring(0, 2)?.toUpperCase()}{" "}
                    </Avatar>
                  </Space>
                </Dropdown>
              </div>
            ) : (
              <>
                <div className={cx("header-item")}>
                  <Link href="/login">ĐĂNG NHẬP</Link>
                </div>
                <div className={cx("header-item")}>
                  <Link href="/register">ĐĂNG KÝ</Link>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
