"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { FaPlus, FaEye, FaEdit, FaTrash } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import PopupModal from "../../components/ConfirmPopup";
import Image from "next/image";

const BlogsList = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState("");
  const [slugToDelete, setSlugToDelete] = useState("");
  const router = useRouter();

  // ✅ Fetch all blogs
  const fetchAllBlogs = useCallback(async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_LOCAL_PORT}/blogs/company`);
      const data = await res.json();

      if (Array.isArray(data)) {
        setBlogs(data);
      } else if (data.blogs && Array.isArray(data.blogs)) {
        setBlogs(data.blogs);
      } else {
        console.error("Unexpected response format:", data);
        setBlogs([]);
      }
    } catch (err) {
      console.error("Error fetching blogs:", err);
      setBlogs([]);
    }
  }, []);

  // ✅ On page load
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchAllBlogs();
      setLoading(false);
    };
    loadData();
  }, [fetchAllBlogs]);

  // ✅ Handle delete popup
  const handleDelete = (blog) => {
    setShowDeletePopup(true);
    setSlugToDelete(blog.slug);
    setBlogToDelete(blog.title);
  };

  // ✅ Delete blog function
  const deleteBlog = useCallback(async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_LOCAL_PORT}/blogs/${slugToDelete}`,
        { method: "DELETE" }
      );

      if (res.ok) {
        toast.success("Blog deleted successfully!");
        await fetchAllBlogs();
      } else {
        const data = await res.json();
        toast.error(data.message || "Failed to delete blog.");
      }
    } catch (err) {
      console.error("Error deleting blog:", err);
      toast.error("Something went wrong.");
    }
    setShowDeletePopup(false);
  }, [slugToDelete]);

  return (
    <div className="w-full min-h-screen bg-ede7db/30 p-6">
      <style jsx global>{`
        :root {
          --cc5f4d: #cc5f4d;
          --6db19b: #6db19b;
          --ede7db: #ede7db;
        }
        .bg-cc5f4d { background-color: #cc5f4d; }
        .bg-6db19b { background-color: #6db19b; }
        .bg-ede7db { background-color: #ede7db; }
        .text-cc5f4d { color: #cc5f4d; }
        .text-6db19b { color: #6db19b; }
        .border-cc5f4d { border-color: #cc5f4d; }
        .border-6db19b { border-color: #6db19b; }
        .hover\\:bg-cc5f4d:hover { background-color: #cc5f4d; }
        .hover\\:bg-6db19b:hover { background-color: #6db19b; }
        .hover\\:text-cc5f4d:hover { color: #cc5f4d; }
        .hover\\:text-6db19b:hover { color: #6db19b; }
        .focus\\:ring-cc5f4d:focus { --tw-ring-color: #cc5f4d; }
      `}</style>

      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
          <div>
            <h2 className="text-3xl font-bold text-cc5f4d mb-2 drop-shadow-sm">
              Blog Management
            </h2>
            <p className="text-gray-600">
              Manage and organize all your blog posts in one place
            </p>
          </div>
          <Link
            href="/blogs/add"
            className="bg-cc5f4d hover:bg-cc5f4d/90 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 font-semibold group"
          >
            <FaPlus className="transition-transform duration-300 group-hover:scale-110" />
            Add New Blog
          </Link>
        </div>

        {/* Stats Cards */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
              <div className="text-2xl font-bold text-cc5f4d">{blogs.length}</div>
              <div className="text-sm text-gray-600">Total Blogs</div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
              <div className="text-2xl font-bold text-6db19b">
                {new Set(blogs.map(blog => blog.service)).size}
              </div>
              <div className="text-sm text-gray-600">Services</div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
              <div className="text-2xl font-bold text-cc5f4d">
                {new Set(blogs.map(blog => blog.city)).size}
              </div>
              <div className="text-sm text-gray-600">Cities</div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
              <div className="text-2xl font-bold text-6db19b">
                {blogs.filter(blog => blog.images?.length > 0).length}
              </div>
              <div className="text-sm text-gray-600">With Images</div>
            </div>
          </div>
        )}

        {/* Table Container */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Table */}
          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-6">
                <Skeleton count={5} height={60} className="mb-3 rounded-lg" />
              </div>
            ) : (
              <table className="min-w-full">
                <thead className="bg-6db19b text-white">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                      #
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                      Image
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                      Service
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                      City
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200">
                  {blogs.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center">
                        <div className="text-gray-500 mb-2">
                          <svg className="w-16 h-16 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </div>
                        <p className="text-lg font-medium text-gray-600 mb-4">No blogs found</p>
                        <Link
                          href="/blogs/add"
                          className="inline-flex items-center gap-2 bg-cc5f4d text-white px-4 py-2 rounded-lg hover:bg-cc5f4d/90 transition-colors duration-200"
                        >
                          <FaPlus />
                          Create Your First Blog
                        </Link>
                      </td>
                    </tr>
                  ) : (
                    blogs.map((blog, idx) => (
                      <tr
                        key={blog._id}
                        className="hover:bg-ede7db/50 transition-all duration-200 group"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 bg-ede7db rounded-full w-8 h-8 flex items-center justify-center">
                            {idx + 1}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="w-12 h-12 rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                            <img
                              alt={blog.title}
                              width={48}
                              height={48}
                              src={`${process.env.NEXT_PUBLIC_LOCAL_PORT_IMG}/uploads/${blog.images?.[0]}` || "/Images/default-blog.jpg"}
                              className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                            />
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="max-w-xs">
                            <div className="text-sm font-semibold text-gray-900 group-hover:text-cc5f4d transition-colors duration-200 line-clamp-2">
                              {blog.type}
                            </div>
                            {blog.tag && (
                              <span className="inline-block bg-ede7db text-cc5f4d text-xs px-2 py-1 rounded-full mt-1">
                                {blog.tag}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-6db19b/10 text-6db19b capitalize">
                            {blog.service || "—"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-cc5f4d/10 text-cc5f4d capitalize">
                            {blog.city || "—"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {blog.date || "—"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <Link
                              href={`/blogs/view/${blog.slug}`}
                              className="p-2 text-gray-600 hover:text-6db19b hover:bg-6db19b/10 rounded-lg transition-all duration-200 group/btn"
                              title="View Blog"
                            >
                              <FaEye className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                            </Link>
                            <Link
                              href={`/blogs/edit/${blog.slug}`}
                              className="p-2 text-gray-600 hover:text-cc5f4d hover:bg-cc5f4d/10 rounded-lg transition-all duration-200 group/btn"
                              title="Edit Blog"
                            >
                              <FaEdit className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                            </Link>
                            <button
                              onClick={() => handleDelete(blog)}
                              className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 group/btn"
                              title="Delete Blog"
                            >
                              <FaTrash className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Footer Info */}
        {!loading && blogs.length > 0 && (
          <div className="mt-4 text-center text-sm text-gray-500">
            Showing {blogs.length} blog{blogs.length !== 1 ? 's' : ''}
          </div>
        )}
      </div>

      {/* Popup */}
      {showDeletePopup && (
        <PopupModal
          title={`Delete Blog`}
          message={`Are you sure you want to delete "${blogToDelete}"? This action cannot be undone.`}
          onCancel={() => setShowDeletePopup(false)}
          onConfirm={deleteBlog}
          confirmText="Delete"
          cancelText="Cancel"
          type="delete"
          showCancel={true}
        />
      )}
    </div>
  );
};

export default BlogsList;