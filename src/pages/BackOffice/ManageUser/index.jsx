import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../../../components/Sidebar";

export default function UserBackoffice() {
  return (
    <>
      <Sidebar>
        <Outlet />
      </Sidebar>
    </>
  );
}
