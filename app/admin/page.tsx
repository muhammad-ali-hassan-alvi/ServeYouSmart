import React from "react";
import Navbar from "../components/Navbar";
import AdminProductsTable from "../components/AdminProductsTable";
import AdminGadgetsTable from "../components/AdminGadgetsTable";
import AdminFragranceTable from "../components/AdminFragnanceTable";
import AdminOrdersTable from "../components/AdminOrdersTable";

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
    </>
  );
};

export default page;
