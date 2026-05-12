import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast, ToastContainer } from "../../../components/admin/Toast";
import { ConfirmDialog } from "../../../components/admin/ConfirmDialog";
import { AdminButton } from "../../../components/admin/AdminButton";
import { sortNewestFirst } from "../utils/sortNewestFirst";
import "./Product.css";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5149";
const ITEMS_PER_PAGE = 8;

function ProductIndex() {
  const navigate = useNavigate();
  const { toasts, showToast, removeToast } = useToast();
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState({ open: false, id: null });

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/ProductGetAll`);
      if (!res.ok) throw new Error("Failed to fetch products");
      
      const data = await res.json();
      setProducts(sortNewestFirst(data));
    } catch (error) {
      console.error(error);
      showToast("Failed to load products", "error");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDeleteClick = (id) => {
    setDeleteConfirm({ open: true, id });
  };

  const handleConfirmDelete = async () => {
    const id = deleteConfirm.id;
    setDeleteConfirm({ open: false, id: null });

    try {
      const res = await fetch(`${API_BASE}/api/ProductDelete/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete product");

      showToast("Product deleted successfully!", "success");
      fetchProducts();
    } catch (error) {
      console.error(error);
      showToast("Error deleting product", "error");
    }
  };

  const getProductId = (p) => p.id || p.Id || p.ID;
  const getProductName = (p) => p.name || p.Name;
  const getProductAddress = (p) => p.address || p.Address;
  const getProductStartDate = (p) => p.startDate || p.StartDate;
  const getProductAge = (p) => (p.ageRestriction ?? p.AgeRestriction ?? 0);
  const getProductImage = (p) => p.image || p.Image;

  const filteredProducts = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return products;

    return products.filter((p) => {
      const name = String(getProductName(p) || "").toLowerCase();
      const address = String(getProductAddress(p) || "").toLowerCase();
      return name.includes(q) || address.includes(q);
    });
  }, [products, searchTerm]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, products.length]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / ITEMS_PER_PAGE));

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  const goToPrevPage = () => setCurrentPage((prev) => Math.max(1, prev - 1));
  const goToNextPage = () => setCurrentPage((prev) => Math.min(totalPages, prev + 1));

  if (loading) {
    return <div className="loading-box">Loading products...</div>;
  }

  return (
    <div className="product-container">
      <ToastContainer toasts={toasts} onRemoveToast={removeToast} />

      <div className="page-header">
        <h2>Products</h2>
        <div className="product-header-actions">
          <input
            type="text"
            className="product-search"
            placeholder="Search by name or address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <AdminButton
            variant="primary"
            onClick={() => navigate("/admin/product/createProductForm")}
          >
            + Create Product
          </AdminButton>
        </div>
      </div>

      <table className="product-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Address</th>
            <th>Start Date</th>
            <th>Age Rating</th>
            <th>Image</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {filteredProducts.length === 0 ? (
            <tr>
              <td colSpan="6" className="empty-state">No products found</td>
            </tr>
          ) : (
            paginatedProducts.map((p) => {
              const id = getProductId(p);
              return (
                <tr key={id}>
                  <td className="name-cell">{getProductName(p) ?? "-"}</td>
                  <td>{getProductAddress(p) ?? "-"}</td>
                  <td>
                    {getProductStartDate(p)
                      ? new Date(getProductStartDate(p)).toLocaleString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "-"}
                  </td>
                  <td className="age-rating">{getProductAge(p)}+</td>
                  <td className="media">
                    {getProductImage(p) ? (
                      <img
                        src={`${API_BASE}${getProductImage(p)}`}
                        alt={getProductName(p)}
                      />
                    ) : (
                      <span className="no-media">No image</span>
                    )}
                  </td>
                  <td className="actions">
                    <AdminButton
                      variant="primary"
                      size="sm"
                      onClick={() => navigate(`/admin/product/detailProduct/${id}`)}
                    >
                      Detail
                    </AdminButton>
                    <AdminButton
                      variant="secondary"
                      size="sm"
                      onClick={() => navigate(`/admin/product/editProductForm/${id}`)}
                    >
                      Edit
                    </AdminButton>
                    <AdminButton
                      variant="danger"
                      size="sm"
                      onClick={() => handleDeleteClick(id)}
                    >
                      Delete
                    </AdminButton>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>

      {filteredProducts.length > 0 && (
        <div className="product-pagination">
          <button
            type="button"
            className="product-page-btn"
            onClick={goToPrevPage}
            disabled={currentPage === 1}
          >
            Prev
          </button>
          <span className="product-page-info">
            Page {currentPage} / {totalPages}
          </span>
          <button
            type="button"
            className="product-page-btn"
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}

      <ConfirmDialog
        isOpen={deleteConfirm.open}
        title="Delete Product"
        message="Are you sure you want to delete this product? This action cannot be undone."
        confirmText="Delete Permanently"
        cancelText="Cancel"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteConfirm({ open: false, id: null })}
        isDangerous={true}
      />
    </div>
  );
}

export default ProductIndex;