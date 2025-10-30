import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import config from "../../../config/apiconfig";
import styles from "./Item.module.css";
import { toast } from "react-toastify";

const Items = () => {
  const navigate = useNavigate();
  const ebillingData = JSON.parse(localStorage.getItem("eBilling")) || {};
  const companyId = ebillingData?.selectedCompany?.id;
  const token = ebillingData?.accessToken;

  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showProducts, setShowProducts] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          `${config.BASE_URL}/company/${companyId}/categories`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        setCategories(response.data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
        toast.error("Failed to fetch categories.");
      }
    };
    fetchCategories();
  }, [companyId, token]);

  // Fetch items
  useEffect(() => {
    if (!token || !companyId) {
      navigate("/login");
      return;
    }
    const fetchItems = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          `${config.BASE_URL}/company/${companyId}/items`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        setItems(response.data);
        console.log("Fetched items:", response.data);
      } catch (error) {
        console.error("Error fetching items:", error);
        setError(error.response?.data?.message || "Failed to fetch items.");
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, [companyId, token, navigate]);

  // Handle delete item
  const handleDeleteItem = async (itemId) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    try {
      setLoading(true);
      await axios.delete(`${config.BASE_URL}/item/${itemId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      toast.success("Item deleted successfully");
      setItems((prev) => prev.filter((item) => item.itemId !== itemId));
    } catch (error) {
      console.error("Error deleting item:", error);
      toast.error("Failed to delete item.");
    } finally {
      setLoading(false);
    }
  };

  // Navigate to Add_Items for create/edit
  const handleAddItem = (itemType) => {
    navigate("/Add_items", { state: { companyId, token, categories, itemType } });
  };

  const handleEditItem = (item) => {
    navigate("/Add_items", { state: { item, companyId, token, categories } });
  };

  // Filter items based on search term
  const filteredItems = items.filter((item) =>
    [item.itemName, item.itemHsn, item.itemCode, item.description]
      .filter(Boolean)
      .some((field) => field.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className={styles["company-form-container"]}>
      <div className={styles["form-header"]}>
        <div>
          <h1 className={styles["company-form-title"]}>Items</h1>
          <p className={styles["form-subtitle"]}>
            Manage your {showProducts ? "products" : "services"}
          </p>
        </div>
        <button
          onClick={() => handleAddItem(showProducts ? "PRODUCT" : "SERVICE")}
          className={styles["submit-button"]}
          disabled={loading}
        >
          <i className="fas fa-plus-circle"></i> Add {showProducts ? "Product" : "Service"}
        </button>
      </div>

      {loading && (
        <div className={styles["loading-message"]}>
          <div className={styles.spinner}></div>
          <p>Loading items...</p>
        </div>
      )}
      {error && <div className={styles["error-message"]}>{error}</div>}

      <div className={styles.actions}>
        <div className={styles["search-wrapper"]}>
          <i className="fas fa-search"></i>
          <input
            type="search"
            placeholder="Search by name, HSN, code, or description..."
            className={styles["search-input"]}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            disabled={loading}
          />
        </div>
        <div className={styles["filter-buttons"]}>
          <button
            onClick={() => setShowProducts(true)}
            className={`${styles["filter-button"]} ${showProducts ? styles.active : ""}`}
            disabled={loading}
          >
            Products
          </button>
          <button
            onClick={() => setShowProducts(false)}
            className={`${styles["filter-button"]} ${!showProducts ? styles.active : ""}`}
            disabled={loading}
          >
            Services
          </button>
        </div>
      </div>

      {filteredItems.length > 0 ? (
        <>
          {/* Desktop Table View */}
          <div className={styles["table-wrapper"]}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>HSN</th>
                  <th>Code</th>
                  <th>Description</th>
                  <th>Categories</th>
                  <th>Base Unit</th>
                  <th>Secondary Unit</th>
                  <th>Base to Secondary</th>
                  <th>Sale Price</th>
                  <th>Sale Tax Type</th>
                  {showProducts && <th>Purchase Price</th>}
                  {showProducts && <th>Purchase Tax Type</th>}
                  <th>Tax Rate</th>
                  <th>Discount Price</th>
                  <th>Discount Type</th>
                  {showProducts && <th>Stock Qty</th>}
                  {showProducts && <th>Stock Price</th>}
                  {showProducts && <th>Stock Date</th>}
                  {showProducts && <th>Min Stock</th>}
                  {showProducts && <th>Location</th>}
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems
                  .filter((item) => item.itemType === (showProducts ? "PRODUCT" : "SERVICE"))
                  .map((item) => (
                    <tr key={item.itemId}>
                      <td>{item.itemId}</td>
                      <td>{item.itemName || "N/A"}</td>
                      <td>{item.itemHsn || "N/A"}</td>
                      <td>{item.itemCode || "N/A"}</td>
                      <td>{item.description || "N/A"}</td>
                      <td>
                        {item.categories?.map((cat) => cat.categoryName).join(", ") || "None"}
                      </td>
                      <td>{item.baseUnit || "N/A"}</td>
                      <td>{item.secondaryUnit || "N/A"}</td>
                      <td>{item.baseUnitToSecondaryUnit || "N/A"}</td>
                      <td>{item.salePrice || "N/A"}</td>
                      <td>{item.saleTaxType || "N/A"}</td>
                      {showProducts && <td>{item.purchasePrice || "N/A"}</td>}
                      {showProducts && <td>{item.purchaseTaxType || "N/A"}</td>}
                      <td>{item.taxRate || "N/A"}</td>
                      <td>{item.saleDiscountPrice || "N/A"}</td>
                      <td>{item.saleDiscountType || "N/A"}</td>
                      {showProducts && <td>{item.stockOpeningQty || "N/A"}</td>}
                      {showProducts && <td>{item.stockPrice || "N/A"}</td>}
                      {showProducts && (
                        <td>
                          {item.stockOpeningDate
                            ? new Date(item.stockOpeningDate).toLocaleDateString()
                            : "N/A"}
                        </td>
                      )}
                      {showProducts && <td>{item.minimumStockToMaintain || "N/A"}</td>}
                      {showProducts && <td>{item.openingStockLocation || "N/A"}</td>}
                      <td className={styles["actions-cell"]}>
                        <button
                          onClick={() => handleEditItem(item)}
                          className={`${styles["action-button"]} ${styles["edit-button"]}`}
                          disabled={loading}
                        >
                          <i className="fas fa-edit"></i> Edit
                        </button>
                        <button
                          onClick={() => handleDeleteItem(item.itemId)}
                          className={`${styles["action-button"]} ${styles["delete-button"]}`}
                          disabled={loading}
                        >
                          <i className="fas fa-trash-alt"></i> Delete
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className={styles["cards-container"]}>
            {filteredItems
              .filter((item) => item.itemType === (showProducts ? "PRODUCT" : "SERVICE"))
              .map((item) => (
                <div key={item.itemId} className={styles.card}>
                  <div className={styles["card-header"]}>
                    <h3 className={styles["card-title"]}>{item.itemName || "N/A"}</h3>
                    <p className={styles["card-type"]}>
                      {item.itemType
                        ?.replace(/_/g, " ")
                        .toLowerCase()
                        .replace(/\b\w/g, (c) => c.toUpperCase()) || "N/A"}
                    </p>
                  </div>
                  <div className={styles["card-content"]}>
                    <div className={styles["card-detail"]}>
                      <i className="fas fa-id-card"></i>
                      <span>ID: {item.itemId}</span>
                    </div>
                    <div className={styles["card-detail"]}>
                      <i className="fas fa-barcode"></i>
                      <span>HSN: {item.itemHsn || "N/A"}</span>
                    </div>
                    <div className={styles["card-detail"]}>
                      <i className="fas fa-code"></i>
                      <span>Code: {item.itemCode || "N/A"}</span>
                    </div>
                    <div className={styles["card-detail"]}>
                      <i className="fas fa-info-circle"></i>
                      <span>Description: {item.description || "N/A"}</span>
                    </div>
                    <div className={styles["card-detail"]}>
                      <i className="fas fa-tags"></i>
                      <span>
                        Categories: {item.categories?.map((cat) => cat.categoryName).join(", ") || "None"}
                      </span>
                    </div>
                    <div className={styles["card-detail"]}>
                      <i className="fas fa-box"></i>
                      <span>Base Unit: {item.baseUnit || "N/A"}</span>
                    </div>
                    <div className={styles["card-detail"]}>
                      <i className="fas fa-boxes"></i>
                      <span>Secondary Unit: {item.secondaryUnit || "N/A"}</span>
                    </div>
                    <div className={styles["card-detail"]}>
                      <i className="fas fa-exchange-alt"></i>
                      <span>Base to Secondary: {item.baseUnitToSecondaryUnit || "N/A"}</span>
                    </div>
                    <div className={styles["card-detail"]}>
                      <i className="fas fa-dollar-sign"></i>
                      <span>Sale Price: {item.salePrice || "N/A"}</span>
                    </div>
                    <div className={styles["card-detail"]}>
                      <i className="fas fa-percent"></i>
                      <span>Sale Tax Type: {item.saleTaxType || "N/A"}</span>
                    </div>
                    {showProducts && (
                      <>
                        <div className={styles["card-detail"]}>
                          <i className="fas fa-shopping-cart"></i>
                          <span>Purchase Price: {item.purchasePrice || "N/A"}</span>
                        </div>
                        <div className={styles["card-detail"]}>
                          <i className="fas fa-percent"></i>
                          <span>Purchase Tax Type: {item.purchaseTaxType || "N/A"}</span>
                        </div>
                      </>
                    )}
                    <div className={styles["card-detail"]}>
                      <i className="fas fa-tags"></i>
                      <span>Tax Rate: {item.taxRate || "N/A"}</span>
                    </div>
                    <div className={styles["card-detail"]}>
                      <i className="fas fa-tag"></i>
                      <span>Discount Price: {item.saleDiscountPrice || "N/A"}</span>
                    </div>
                    <div className={styles["card-detail"]}>
                      <i className="fas fa-percentage"></i>
                      <span>Discount Type: {item.saleDiscountType || "N/A"}</span>
                    </div>
                    {showProducts && (
                      <>
                        <div className={styles["card-detail"]}>
                          <i className="fas fa-warehouse"></i>
                          <span>Stock Qty: {item.stockOpeningQty || "N/A"}</span>
                        </div>
                        <div className={styles["card-detail"]}>
                          <i className="fas fa-dollar-sign"></i>
                          <span>Stock Price: {item.stockPrice || "N/A"}</span>
                        </div>
                        <div className={styles["card-detail"]}>
                          <i className="fas fa-calendar-alt"></i>
                          <span>
                            Stock Date: {item.stockOpeningDate
                              ? new Date(item.stockOpeningDate).toLocaleDateString()
                              : "N/A"}
                          </span>
                        </div>
                        <div className={styles["card-detail"]}>
                          <i className="fas fa-exclamation-circle"></i>
                          <span>Min Stock: {item.minimumStockToMaintain || "N/A"}</span>
                        </div>
                        <div className={styles["card-detail"]}>
                          <i className="fas fa-map-marker-alt"></i>
                          <span>Location: {item.openingStockLocation || "N/A"}</span>
                        </div>
                      </>
                    )}
                  </div>
                  <div className={styles["card-actions"]}>
                    <button
                      onClick={() => handleEditItem(item)}
                      className={`${styles["card-action-button"]} ${styles["edit-button"]}`}
                      disabled={loading}
                    >
                      <i className="fas fa-edit"></i> Edit
                    </button>
                    <button
                      onClick={() => handleDeleteItem(item.itemId)}
                      className={`${styles["card-action-button"]} ${styles["delete-button"]}`}
                      disabled={loading}
                    >
                      <i className="fas fa-trash-alt"></i> Delete
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </>
      ) : (
        <div className={styles["no-data"]}>
          <i className="fas fa-inbox"></i>
          <p>No {showProducts ? "products" : "services"} found.</p>
          <p className={styles["no-data-subtitle"]}>
            Click "Add {showProducts ? "Product" : "Service"}" to create one!
          </p>
        </div>
      )}
    </div>
  );
};

export default Items;







