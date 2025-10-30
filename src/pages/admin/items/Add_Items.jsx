import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import config from "../../../config/apiconfig";
import styles from "./Item.module.css";
import { toast } from "react-toastify";

const Add_Items = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { item = {}, companyId, token, categories = [], itemType } = location.state || {};

  // Unified form state
  const [formData, setFormData] = useState({
    itemName: item.itemName || "",
    itemHsn: item.itemHsn || "",
    itemCode: item.itemCode || "",
    description: item.description || "",
    itemType: item.itemType || itemType || "PRODUCT",
    baseUnit: item.baseUnit || "",
    secondaryUnit: item.secondaryUnit || "",
    baseUnitToSecondaryUnit: item.baseUnitToSecondaryUnit || "",
    categoryIds: item.categories?.map((cat) => cat.categoryId) || [],
    salePrice: item.salePrice || "",
    saleTaxType: item.saleTaxType || "",
    purchasePrice: item.purchasePrice || "",
    purchaseTaxType: item.purchaseTaxType || "",
    taxRate: item.taxRate || "",
    stockOpeningQty: item.stockOpeningQty || "",
    stockPrice: item.stockPrice || "",
    stockOpeningDate: item.stockOpeningDate || "",
    minimumStockToMaintain: item.minimumStockToMaintain || "",
    openingStockLocation: item.openingStockLocation || "",
    saleDiscountPrice: item.saleDiscountPrice || "",
    saleDiscountType: item.saleDiscountType || "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const units = [
    "CARTONS", "KILOGRAMS", "QUINTAL", "BOTTLES", "PIECES", "ROLLS",
    "NUMBERS", "PAIRS", "TABLETS", "MILLITRE", "BUNDLES", "BOX",
    "SQUARE_METERS", "BAGS", "CANS", "SQUARE_FEET",
  ];
  const taxTypes = ["WITHTAX", "WITHOUTTAX"];
  const taxRates = [
    "NONE", "EXEMPTED", "GST0", "IGST0", "GST0POINT25", "IGST0POINT25",
    "GST3", "IGST3", "GST5", "IGST5", "GST12", "IGST12", "GST18",
    "IGST18", "GST28", "IGST28",
  ];
  const discountTypes = ["PERCENTAGE", "AMOUNT"];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (categoryId) => {
    setFormData((prev) => ({
      ...prev,
      categoryIds: prev.categoryIds.includes(categoryId)
        ? prev.categoryIds.filter((id) => id !== categoryId)
        : [...prev.categoryIds, categoryId],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload = {
      itemName: formData.itemName,
      itemHsn: formData.itemHsn,
      itemCode: formData.itemCode,
      description: formData.description,
      itemType: formData.itemType,
      baseUnit: formData.baseUnit,
      secondaryUnit: formData.secondaryUnit,
      baseUnitToSecondaryUnit: parseFloat(formData.baseUnitToSecondaryUnit) || 0,
      categoryIds: formData.categoryIds.map(Number),
      salePrice: parseFloat(formData.salePrice) || 0,
      saleTaxType: formData.saleTaxType,
      taxRate: formData.taxRate,
      saleDiscountPrice: parseFloat(formData.saleDiscountPrice) || 0,
      saleDiscountType: formData.saleDiscountType,
      ...(formData.itemType === "PRODUCT" && {
        purchasePrice: parseFloat(formData.purchasePrice) || 0,
        purchaseTaxType: formData.purchaseTaxType,
        stockOpeningQty: parseFloat(formData.stockOpeningQty) || 0,
        stockPrice: parseFloat(formData.stockPrice) || 0,
        stockOpeningDate: formData.stockOpeningDate,
        minimumStockToMaintain: parseFloat(formData.minimumStockToMaintain) || 0,
        openingStockLocation: formData.openingStockLocation,
      }),
    };

    try {
      if (item.itemId) {
        await axios.put(`${config.BASE_URL}/item/${item.itemId}`, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        toast.success("Item updated successfully");
      } else {
        const endpoint =
          formData.itemType === "PRODUCT"
            ? `${config.BASE_URL}/company/${companyId}/create/product-item`
            : `${config.BASE_URL}/company/${companyId}/create/service-item`;
        await axios.post(endpoint, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        toast.success("Item created successfully");
      }
      navigate("/items");
    } catch (error) {
      console.error("Error saving item:", error);
      setError(error.response?.data?.message || "Failed to save item.");
      toast.error("Failed to save item. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles["company-form-container"]}>
      <div className={styles["form-header"]}>
        <div>
          <h1 className={styles["company-form-title"]}>
            {item.itemId ? "Edit Item" : "Add Item"}
          </h1>
          <p className={styles["form-subtitle"]}>
            {item.itemId ? "Update item details" : "Add a new product or service"}
          </p>
        </div>
        <button
          onClick={() => navigate("/items")}
          className={styles["cancel-button"]}
          disabled={loading}
        >
          <i className="fas fa-times"></i> Close
        </button>
      </div>

      {loading && (
        <div className={styles["loading-message"]}>
          <div className={styles.spinner}></div>
          <p>{item.itemId ? "Updating..." : "Creating..."}</p>
        </div>
      )}
      {error && <div className={styles["error-message"]}>{error}</div>}

      <form onSubmit={handleSubmit} className={styles["company-form"]}>
        <div className={styles["form-section"]}>
          <h2 className={styles["section-title"]}>Basic Information</h2>
          <div className={styles["form-row"]}>
            <div className={styles["form-group"]}>
              <label htmlFor="itemType">
                Item Type <span className={styles.required}>*</span>
              </label>
              <select
                name="itemType"
                id="itemType"
                value={formData.itemType}
                onChange={handleInputChange}
                className={`${styles["form-input"]} ${styles.select}`}
                required
                disabled={item.itemId || loading}
              >
                <option value="PRODUCT">Product</option>
                <option value="SERVICE">Service</option>
              </select>
            </div>
            <div className={styles["form-group"]}>
              <label htmlFor="itemName">
                Item Name <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                id="itemName"
                name="itemName"
                value={formData.itemName}
                onChange={handleInputChange}
                className={styles["form-input"]}
                required
                disabled={loading}
              />
            </div>
          </div>
          <div className={styles["form-row"]}>
            <div className={styles["form-group"]}>
              <label htmlFor="itemHsn">Item HSN</label>
              <input
                type="text"
                id="itemHsn"
                name="itemHsn"
                value={formData.itemHsn}
                onChange={handleInputChange}
                className={styles["form-input"]}
                disabled={loading}
              />
            </div>
            <div className={styles["form-group"]}>
              <label htmlFor="itemCode">Item Code</label>
              <input
                type="text"
                id="itemCode"
                name="itemCode"
                value={formData.itemCode}
                onChange={handleInputChange}
                className={styles["form-input"]}
                disabled={loading}
              />
            </div>
          </div>
          <div className={styles["form-group"]}>
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className={`${styles["form-input"]} ${styles.textarea}`}
              disabled={loading}
            />
          </div>
          <div className={styles["form-group"]}>
            <label>Categories</label>
            <div className={styles["checkbox-container"]}>
              {categories.length > 0 ? (
                categories.map((cat) => (
                  <div key={cat.categoryId} className={styles["checkbox-item"]}>
                    <input
                      type="checkbox"
                      id={`category-${cat.categoryId}`}
                      value={cat.categoryId}
                      checked={formData.categoryIds.includes(cat.categoryId)}
                      onChange={() => handleCategoryChange(cat.categoryId)}
                      disabled={loading}
                    />
                    <label htmlFor={`category-${cat.categoryId}`}>
                      {cat.categoryName}
                    </label>
                  </div>
                ))
              ) : (
                <p className={styles["no-data"]}>No categories available</p>
              )}
            </div>
          </div>
        </div>

        <div className={styles["form-section"]}>
          <h2 className={styles["section-title"]}>Unit Details</h2>
          <div className={styles["form-row"]}>
            <div className={styles["form-group"]}>
              <label htmlFor="baseUnit">
                Base Unit <span className={styles.required}>*</span>
              </label>
              <select
                id="baseUnit"
                name="baseUnit"
                value={formData.baseUnit}
                onChange={handleInputChange}
                className={`${styles["form-input"]} ${styles.select}`}
                required
                disabled={loading}
              >
                <option value="">Select Base Unit</option>
                {units.map((u) => (
                  <option key={u} value={u}>
                    {u
                      .replace(/_/g, " ")
                      .toLowerCase()
                      .replace(/\b\w/g, (c) => c.toUpperCase())}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles["form-group"]}>
              <label htmlFor="secondaryUnit">Secondary Unit</label>
              <select
                id="secondaryUnit"
                name="secondaryUnit"
                value={formData.secondaryUnit}
                onChange={handleInputChange}
                className={`${styles["form-input"]} ${styles.select}`}
                disabled={loading}
              >
                <option value="">Select Secondary Unit</option>
                {units.map((u) => (
                  <option key={u} value={u}>
                    {u
                      .replace(/_/g, " ")
                      .toLowerCase()
                      .replace(/\b\w/g, (c) => c.toUpperCase())}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className={styles["form-group"]}>
            <label htmlFor="baseUnitToSecondaryUnit">Base Unit to Secondary Unit</label>
            <input
              type="number"
              id="baseUnitToSecondaryUnit"
              name="baseUnitToSecondaryUnit"
              value={formData.baseUnitToSecondaryUnit}
              onChange={handleInputChange}
              className={styles["form-input"]}
              min="0"
              step="0.01"
              disabled={loading}
            />
          </div>
        </div>

        <div className={styles["form-section"]}>
          <h2 className={styles["section-title"]}>Pricing & Tax</h2>
          <div className={styles["form-row"]}>
            <div className={styles["form-group"]}>
              <label htmlFor="salePrice">
                Sale Price <span className={styles.required}>*</span>
              </label>
              <input
                type="number"
                id="salePrice"
                name="salePrice"
                value={formData.salePrice}
                onChange={handleInputChange}
                className={styles["form-input"]}
                min="0"
                step="0.01"
                required
                disabled={loading}
              />
            </div>
            <div className={styles["form-group"]}>
              <label htmlFor="saleTaxType">
                Sale Tax Type <span className={styles.required}>*</span>
              </label>
              <select
                id="saleTaxType"
                name="saleTaxType"
                value={formData.saleTaxType}
                onChange={handleInputChange}
                className={`${styles["form-input"]} ${styles.select}`}
                required
                disabled={loading}
              >
                <option value="">Select Sale Tax Type</option>
                {taxTypes.map((t) => (
                  <option key={t} value={t}>
                    {t
                      .replace(/_/g, " ")
                      .toLowerCase()
                      .replace(/\b\w/g, (c) => c.toUpperCase())}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className={styles["form-row"]}>
            <div className={styles["form-group"]}>
              <label htmlFor="taxRate">
                Tax Rate <span className={styles.required}>*</span>
              </label>
              <select
                id="taxRate"
                name="taxRate"
                value={formData.taxRate}
                onChange={handleInputChange}
                className={`${styles["form-input"]} ${styles.select}`}
                required
                disabled={loading}
              >
                <option value="">Select Tax Rate</option>
                {taxRates.map((t) => (
                  <option key={t} value={t}>
                    {t
                      .replace(/_/g, " ")
                      .toLowerCase()
                      .replace(/\b\w/g, (c) => c.toUpperCase())}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles["form-group"]}>
              <label htmlFor="saleDiscountPrice">Sale Discount Price</label>
              <input
                type="number"
                id="saleDiscountPrice"
                name="saleDiscountPrice"
                value={formData.saleDiscountPrice}
                onChange={handleInputChange}
                className={styles["form-input"]}
                min="0"
                step="0.01"
                disabled={loading}
              />
            </div>
          </div>
          <div className={styles["form-group"]}>
            <label htmlFor="saleDiscountType">Sale Discount Type</label>
            <select
              id="saleDiscountType"
              name="saleDiscountType"
              value={formData.saleDiscountType}
              onChange={handleInputChange}
              className={`${styles["form-input"]} ${styles.select}`}
              disabled={loading}
            >
              <option value="">Select Discount Type</option>
              {discountTypes.map((d) => (
                <option key={d} value={d}>
                  {d
                    .replace(/_/g, " ")
                    .toLowerCase()
                    .replace(/\b\w/g, (c) => c.toUpperCase())}
                </option>
              ))}
            </select>
          </div>
        </div>

        {formData.itemType === "PRODUCT" && (
          <div className={styles["form-section"]}>
            <h2 className={styles["section-title"]}>Product Details</h2>
            <div className={styles["form-row"]}>
              <div className={styles["form-group"]}>
                <label htmlFor="purchasePrice">
                  Purchase Price <span className={styles.required}>*</span>
                </label>
                <input
                  type="number"
                  id="purchasePrice"
                  name="purchasePrice"
                  value={formData.purchasePrice}
                  onChange={handleInputChange}
                  className={styles["form-input"]}
                  min="0"
                  step="0.01"
                  required
                  disabled={loading}
                />
              </div>
              <div className={styles["form-group"]}>
                <label htmlFor="purchaseTaxType">
                  Purchase Tax Type <span className={styles.required}>*</span>
                </label>
                <select
                  id="purchaseTaxType"
                  name="purchaseTaxType"
                  value={formData.purchaseTaxType}
                  onChange={handleInputChange}
                  className={`${styles["form-input"]} ${styles.select}`}
                  required
                  disabled={loading}
                >
                  <option value="">Select Purchase Tax Type</option>
                  {taxTypes.map((t) => (
                    <option key={t} value={t}>
                      {t
                        .replace(/_/g, " ")
                        .toLowerCase()
                        .replace(/\b\w/g, (c) => c.toUpperCase())}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className={styles["form-row"]}>
              <div className={styles["form-group"]}>
                <label htmlFor="stockOpeningQty">Stock Opening Quantity</label>
                <input
                  type="number"
                  id="stockOpeningQty"
                  name="stockOpeningQty"
                  value={formData.stockOpeningQty}
                  onChange={handleInputChange}
                  className={styles["form-input"]}
                  min="0"
                  step="0.01"
                  disabled={loading}
                />
              </div>
              <div className={styles["form-group"]}>
                <label htmlFor="stockPrice">Stock Price</label>
                <input
                  type="number"
                  id="stockPrice"
                  name="stockPrice"
                  value={formData.stockPrice}
                  onChange={handleInputChange}
                  className={styles["form-input"]}
                  min="0"
                  step="0.01"
                  disabled={loading}
                />
              </div>
            </div>
            <div className={styles["form-row"]}>
              <div className={styles["form-group"]}>
                <label htmlFor="stockOpeningDate">Stock Opening Date</label>
                <input
                  type="date"
                  id="stockOpeningDate"
                  name="stockOpeningDate"
                  value={formData.stockOpeningDate}
                  onChange={handleInputChange}
                  className={styles["form-input"]}
                  disabled={loading}
                />
              </div>
              <div className={styles["form-group"]}>
                <label htmlFor="minimumStockToMaintain">Minimum Stock to Maintain</label>
                <input
                  type="number"
                  id="minimumStockToMaintain"
                  name="minimumStockToMaintain"
                  value={formData.minimumStockToMaintain}
                  onChange={handleInputChange}
                  className={styles["form-input"]}
                  min="0"
                  step="0.01"
                  disabled={loading}
                />
              </div>
            </div>
            <div className={styles["form-group"]}>
              <label htmlFor="openingStockLocation">Opening Stock Location</label>
              <input
                type="text"
                id="openingStockLocation"
                name="openingStockLocation"
                value={formData.openingStockLocation}
                onChange={handleInputChange}
                className={styles["form-input"]}
                disabled={loading}
              />
            </div>
          </div>
        )}

        <div className={styles["form-actions"]}>
          <button
            type="submit"
            className={styles["submit-button"]}
            disabled={loading}
          >
            {loading
              ? item.itemId
                ? "Updating..."
                : "Creating..."
              : item.itemId
                ? "Update Item"
                : "Create Item"}
          </button>
          <button
            type="button"
            className={styles["cancel-button"]}
            onClick={() => navigate("/items")}
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default Add_Items;