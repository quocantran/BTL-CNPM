"use server";
import React from "react";
import classNames from "classnames/bind";
import styles from "../../../styles/Dashboard.module.scss";
import DashboardCard from "@/components/admin/Dashboard/Dashboard.card";
import { countUsers } from "@/config/api";
import DashboardChart from "@/components/admin/Dashboard/Dashboard.chart";

const cx = classNames.bind(styles);

const Admin = async () => {
  return <div className={cx("wrapper")}>DashBoard</div>;
};

export default Admin;
