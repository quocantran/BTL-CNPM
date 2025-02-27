"use client";
import { useAppDispatch } from "@/lib/redux/hooks";
import { fetchAccount } from "@/lib/redux/slice/auth.slice";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

interface IProps {
  children: React.ReactNode;
}

const LayoutApp = (props: IProps) => {
  const { children } = props;
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  useEffect(() => {
    dispatch(fetchAccount());
  }, [pathname]);

  return <>{children}</>;
};

export default LayoutApp;
