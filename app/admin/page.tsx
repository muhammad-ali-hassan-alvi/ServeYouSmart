'use client';
import React from "react";
import Navbar from "../components/Navbar";
import AdminProductsTable from "../components/AdminProductsTable";
import AdminGadgetsTable from "../components/AdminGadgetsTable";
import AdminFragranceTable from "../components/AdminFragnanceTable";
import AdminOrdersTable from "../components/AdminOrdersTable";
import AdminContactMessagesTable from "../components/AdminContactMessagesTable";

const page = () => {
  return (
    <>
      <div>
        <Navbar />
      </div>
      <div className="mt-28">
        <AdminProductsTable />
      </div>
      <div>
        <AdminGadgetsTable />
      </div>
      <div>
        <AdminFragranceTable />
      </div>
      <div>
        <AdminOrdersTable />
      </div>
      <div>
        <AdminContactMessagesTable />
      </div>
    </>
  );
};

export default page;
