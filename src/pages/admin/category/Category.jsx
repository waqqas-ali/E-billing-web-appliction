import React, { useEffect, useState } from "react";
import config from "../../../config/apiconfig";
import axios from "axios";
import "./category.css";
function Category() {
  const ebillingData = JSON.parse(localStorage.getItem("eBilling")) || {};
  const companyId = ebillingData?.selectedCompany?.id;
  const token = ebillingData?.accessToken;

  const [categoryForm, setCategoryForm] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [loading, setLoading] = useState(false);
  const [categoryData, setCategoryData] = useState([]);
  const [editingCategoryId, setEditingCategoryId] = useState(null);

  async function handleSubmitCategory(e) {
    e.preventDefault();
    try {
      setLoading(true);

      if (editingCategoryId) {
        // UPDATE with query param
        await axios.put(
          `${
            config.BASE_URL
          }/category/${editingCategoryId}?categoryName=${encodeURIComponent(
            categoryName
          )}`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        alert("Category updated successfully");
      } else {
        // CREATE with query param
        await axios.post(
          `${
            config.BASE_URL
          }/company/${companyId}/create/category?categoryName=${encodeURIComponent(
            categoryName
          )}`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        alert("Category created successfully");
      }

      // Reset form
      setCategoryName("");
      setCategoryForm(false);
      setEditingCategoryId(null);
      getAllCategory();
    } catch (error) {
      console.error("Error saving category:", error);
    } finally {
      setLoading(false);
    }
  }

  // ✅ Delete Category
  async function handleDeleteCategory(categoryId) {
    if (!window.confirm("Are you sure you want to delete this category?"))
      return;
    try {
      setLoading(true);
      await axios.delete(`${config.BASE_URL}/category/${categoryId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Category deleted successfully");
      getAllCategory();
    } catch (error) {
      console.log("Error deleting category:", error);
    } finally {
      setLoading(false);
    }
  }

  // ✅ Fetch All Categories
  async function getAllCategory() {
    setLoading(true);
    try {
      const response = await axios.get(
        `${config.BASE_URL}/company/${companyId}/categories`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log(response.data);
      setCategoryData(response.data);
    } catch (error) {
      console.log("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getAllCategory();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <>
      <p>Category Page</p>

      <div>
        <div>
          <input type="search" />
        </div>
        <div>
          <button
            onClick={() => {
              setCategoryForm(!categoryForm);
              setEditingCategoryId(null);
              setCategoryName("");
            }}
          >
            {editingCategoryId ? "Edit Category" : "Add Category"}
          </button>
        </div>
      </div>

      {categoryForm && (
        <div>
          <button
            onClick={() => {
              setCategoryForm(false);
              setEditingCategoryId(null);
              setCategoryName("");
            }}
          >
            X
          </button>

          <form onSubmit={handleSubmitCategory}>
            <label htmlFor="categoryName">
              {editingCategoryId ? "Edit Category Name:" : "Category Name:"}
            </label>
            <input
              type="text"
              id="categoryName"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              required
            />
            <button type="submit">
              {editingCategoryId ? "Update" : "Submit"}
            </button>
          </form>
        </div>
      )}

      <h2>All Categories</h2>
      {categoryData.length > 0 ? (
        <table border="1" cellPadding="8" style={{ marginTop: "10px" }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Category Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categoryData.map((cat) => (
              <tr key={cat.categoryId}>
                <td>{cat.categoryId}</td>
                <td>{cat.categoryName}</td>
                <td>
                  <button
                    onClick={() => {
                      setEditingCategoryId(cat.categoryId);
                      setCategoryName(cat.categoryName);
                      setCategoryForm(true);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(cat.categoryId)}
                    style={{ marginLeft: "8px", color: "red" }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No categories found</p>
      )}
    </>
  );
}

export default Category;
