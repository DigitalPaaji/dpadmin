// app/admin/page.jsx
"use client";

import { useEffect } from "react";
import { useGlobalContext } from "./components/context/GlobalContext";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  DollarSign,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  // const { allUsers, orders, fetchOrders, loadingOrders, allProducts, user } =
  //   useGlobalContext();
  const router = useRouter();
  // Fetch orders when dashboard loads
  // useEffect(() => {
  //   fetchOrders();
  // }, [fetchOrders]);

  // ✅ calculate summary values
  // const totalProducts = allProducts?.length || 0;
// const totalUsers = allUsers?.length || 0;
//   const totalOrders = orders?.length || 0;
//   const totalSales = orders?.reduce((sum, o) => sum + (o.amount || 0), 0) || 0;

  return (
    <div className="flex min-h-screen font-mosetta">
      {/* Main Content */}
      <main className="flex-1 p-3 xl:p-6">
        <h1 className="text-2xl font-bold text-[#99571d] mb-6">
          Dashboard Overview
        </h1>

        {/* Summary Cards */}
        {/* <div className="flex items-center gap-6 justify-start flex-wrap lg:flex-nowrap  mb-8">
          <SummaryCard
            icon={<Package className="w-6 h-6 text-[#99571d]" />}
            title="Total Products"
            value={totalProducts}
          />
          <SummaryCard
            icon={<Users className="w-6 h-6 text-[#99571d]" />}
            title="Total Users"
            value={totalUsers}
          />
          <SummaryCard
            icon={<ShoppingCart className="w-6 h-6 text-[#99571d]" />}
            title="Total Orders"
            value={totalOrders}
          />
          <SummaryCard
            icon={<DollarSign className="w-6 h-6 text-[#99571d]" />}
            title="Total Sales"
            value={`₹${totalSales}`}
          />
        </div> */}

        {/* Orders Table */}
        <div className="bg-white shadow-md rounded-lg p-3 xl:p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Orders</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 text-left text-sm">
                  <th className="p-3 border-b">Order ID</th>
                  <th className="p-3 border-b">Customer</th>
                  <th className="p-3 border-b">Date</th>
                  <th className="p-3 border-b">Total</th>
                  <th className="p-3 border-b">Status</th>
                </tr>
              </thead>
              <tbody>
                {/* {loadingOrders ? (
                  <tr>
                    <td colSpan="5" className="text-center py-4 text-gray-500">
                      Loading orders...
                    </td>
                  </tr>
                ) : orders?.length > 0 ? (
                  orders.slice(0, 5).map((order) => (
                    <tr key={order._id} 
                        onClick={() => router.push(`/admin/orders/${order._id}`)}
                    className="text-sm hover:bg-gray-50 cursor-pointer">
                      <td className="p-3 border-b">{order._id}</td>
                      <td className="p-3 border-b">
                        {order.shippingAddress?.name || "N/A"}
                      </td>
                      <td className="p-3 border-b">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-3 border-b">₹{order.amount}</td>
                      <td className="p-3 border-b">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            order.orderStatus === "placed"
                              ? "bg-yellow-100 text-yellow-600"
                              : order.orderStatus === "completed"
                              ? "bg-green-100 text-green-600"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {order.orderStatus}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-4 text-gray-500">
                      No orders found
                    </td>
                  </tr>
                )} */}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

// Summary Card Component
function SummaryCard({ icon, title, value }) {
  return (
    <div className="w-full bg-white p-4 rounded-xl shadow-md flex items-center gap-4 ">
      <div className="p-3 bg-[#f3e7dc] rounded-full">{icon}</div>
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <h3 className="text-xl font-bold text-gray-800">{value}</h3>
      </div>
    </div>
  );
}