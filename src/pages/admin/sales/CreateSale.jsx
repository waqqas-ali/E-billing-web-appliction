"use client";

import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import config from "../../../config/apiconfig";
import styles from "./Sales.module.css";
import { toast } from "react-toastify";

const CreateSale = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const editId = query.get("edit"); // e.g., ?edit=123

    const userData = JSON.parse(localStorage.getItem("eBilling")) || {};
    const token = userData?.accessToken || "";
    const companyId = userData?.selectedCompany?.id || "";

    const [loading, setLoading] = useState(false);
    const [parties, setParties] = useState([]);
    const [items, setItems] = useState([]); // State to store items
    const [message, setMessage] = useState("");

    // -----------------------------------------------------------------
    // Form State
    // -----------------------------------------------------------------
    const [formData, setFormData] = useState({
        partyId: "",
        billingAddress: "",
        shippingAddress: "",
        invoiceNumber: "",
        invoceDate: new Date().toISOString().split("T")[0],
        dueDate: new Date().toISOString().split("T")[0],
        saleType: "CASH",
        stateOfSupply: "ANDHRA_PRADESH",
        paymentType: "CASH",
        paymentDescription: "",
        totalAmountWithoutTax: 0,
        totalTaxAmount: 0,
        deliveryCharges: 0,
        totalAmount: 0,
        receivedAmount: 0,
        balance: 0,
        overdue: false,
        paid: false,
        saleItems: [
            {
                itemId: "", // Added to link to an actual item
                itemName: "",
                itemHsnCode: "",
                itemDescription: "",
                quantity: 1,
                unit: "CARTONS",
                pricePerUnit: 0,
                pricePerUnitTaxType: "WITHTAX",
                taxRate: "NONE",
                taxAmount: 0,
                totalAmount: 0,
            },
        ],
    });

    // -----------------------------------------------------------------
    // Handlers
    // -----------------------------------------------------------------
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    // Helper to get tax rate value (e.g., "GST5" -> 0.05)
    const getTaxRateValue = (taxRateString) => {
        switch (taxRateString) {
            case "GST0POINT25":
            case "IGST0POINT25":
                return 0.0025;
            case "GST3":
            case "IGST3":
                return 0.03;
            case "GST5":
            case "IGST5":
                return 0.05;
            case "GST12":
            case "IGST12":
                return 0.12;
            case "GST18":
            case "IGST18":
                return 0.18;
            case "GST28":
            case "IGST28":
                return 0.28;
            case "GST0":
            case "IGST0":
            case "EXEMPTED":
            case "NONE":
            default:
                return 0;
        }
    };

    const calculateItemTotals = (item) => {
        const quantity = parseFloat(item.quantity) || 0;
        const pricePerUnit = parseFloat(item.pricePerUnit) || 0;
        const taxRateValue = getTaxRateValue(item.taxRate);

        let itemTotalWithoutTax = 0;
        let itemTaxAmount = 0;
        let itemTotalWithTax = 0;

        if (item.pricePerUnitTaxType === "WITHTAX") {
            // Price per unit includes tax
            itemTotalWithTax = quantity * pricePerUnit;
            if (taxRateValue > 0) {
                itemTotalWithoutTax = itemTotalWithTax / (1 + taxRateValue);
                itemTaxAmount = itemTotalWithTax - itemTotalWithoutTax;
            } else {
                itemTotalWithoutTax = itemTotalWithTax;
                itemTaxAmount = 0;
            }
        } else {
            // Price per unit is exclusive of tax
            itemTotalWithoutTax = quantity * pricePerUnit;
            itemTaxAmount = itemTotalWithoutTax * taxRateValue;
            itemTotalWithTax = itemTotalWithoutTax + itemTaxAmount;
        }

        return {
            totalAmountWithoutTax: parseFloat(itemTotalWithoutTax.toFixed(2)),
            taxAmount: parseFloat(itemTaxAmount.toFixed(2)),
            totalAmount: parseFloat(itemTotalWithTax.toFixed(2)),
        };
    };

    const handleItemChange = (idx, e) => {
        const { name, value, type, checked } = e.target;
        const itemsCopy = [...formData.saleItems];
        itemsCopy[idx] = {
            ...itemsCopy[idx],
            [name]: type === "checkbox" ? checked : value,
        };

        // Recalculate item specific totals if relevant fields change
        if (
            name === "quantity" ||
            name === "pricePerUnit" ||
            name === "pricePerUnitTaxType" ||
            name === "taxRate"
        ) {
            const itemCalculations = calculateItemTotals(itemsCopy[idx]);
            itemsCopy[idx].taxAmount = itemCalculations.taxAmount;
            itemsCopy[idx].totalAmount = itemCalculations.totalAmount;
            // The overall totals will be recalculated by the useEffect
        }

        setFormData((prev) => ({ ...prev, saleItems: itemsCopy }));
    };

    const handleItemSelect = (idx, selectedItemId) => {
        const selectedItem = items.find(item => item.itemId === parseInt(selectedItemId));

        if (selectedItem) {
            const updatedSaleItems = [...formData.saleItems];
            updatedSaleItems[idx] = {
                ...updatedSaleItems[idx],
                itemId: selectedItem.itemId, // Store the selected item's ID
                itemName: selectedItem.itemName,
                itemHsnCode: selectedItem.itemHsn,
                itemDescription: selectedItem.description,
                quantity: updatedSaleItems[idx].quantity || 1, // Keep existing quantity or set default
                unit: selectedItem.baseUnit, // Assuming baseUnit is the default unit
                pricePerUnit: selectedItem.salePrice,
                pricePerUnitTaxType: selectedItem.saleTaxType,
                taxRate: selectedItem.taxRate,
            };

            // Recalculate totals for the selected item immediately
            const itemCalculations = calculateItemTotals(updatedSaleItems[idx]);
            updatedSaleItems[idx].taxAmount = itemCalculations.taxAmount;
            updatedSaleItems[idx].totalAmount = itemCalculations.totalAmount;

            setFormData(prev => ({ ...prev, saleItems: updatedSaleItems }));
        } else {
            // Clear item-specific fields if no item is selected (e.g., user selects "Select Item")
            const updatedSaleItems = [...formData.saleItems];
            updatedSaleItems[idx] = {
                ...updatedSaleItems[idx],
                itemId: "",
                itemName: "",
                itemHsnCode: "",
                itemDescription: "",
                quantity: 1,
                unit: "CARTONS", // Default unit
                pricePerUnit: 0,
                pricePerUnitTaxType: "WITHTAX",
                taxRate: "NONE",
                taxAmount: 0,
                totalAmount: 0,
            };
            setFormData(prev => ({ ...prev, saleItems: updatedSaleItems }));
        }
    };


    const addItem = () => {
        setFormData((prev) => ({
            ...prev,
            saleItems: [
                ...prev.saleItems,
                {
                    itemId: "",
                    itemName: "",
                    itemHsnCode: "",
                    itemDescription: "",
                    quantity: 1,
                    unit: "CARTONS",
                    pricePerUnit: 0,
                    pricePerUnitTaxType: "WITHTAX",
                    taxRate: "NONE",
                    taxAmount: 0,
                    totalAmount: 0,
                },
            ],
        }));
    };

    const removeItem = (idx) => {
        setFormData((prev) => ({
            ...prev,
            saleItems: prev.saleItems.filter((_, i) => i !== idx),
        }));
    };

    // -----------------------------------------------------------------
    // Fetch Parties
    // -----------------------------------------------------------------
    const fetchParties = async () => {
        try {
            const res = await axios.get(
                `${config.BASE_URL}/company/${companyId}/parties`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            setParties(res.data);
            console.log("Fetched parties:", res.data);
        } catch (err) {
            toast.error("Failed to load parties");
        }
    };

    // -----------------------------------------------------------------
    // Fetch Items
    // -----------------------------------------------------------------
    const fetchItems = async () => {
        try {
            const res = await axios.get(
                `${config.BASE_URL}/company/${companyId}/items`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            setItems(res.data);
            console.log("Fetched items:", res.data);
        } catch (err) {
            toast.error("Failed to load items");
        }
    };

    // -----------------------------------------------------------------
    // Fetch Sale for Edit
    // -----------------------------------------------------------------
    const fetchSale = async (saleId) => {
        setLoading(true);
        try {
            const res = await axios.get(`${config.BASE_URL}/sale/${saleId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const sale = res.data;

            setFormData({
                partyId: sale.partyResponseDto?.id || "", // Assuming partyResponseDto has an 'id' field
                billingAddress: sale.billingAddress || "",
                shippingAddress: sale.shippingAddress || "",
                invoiceNumber: sale.invoiceNumber || "",
                invoceDate: sale.invoceDate?.split("T")[0] || "",
                dueDate: sale.dueDate?.split("T")[0] || "",
                saleType: sale.saleType || "CASH",
                stateOfSupply: sale.stateOfSupply || "ANDHRA_PRADESH",
                paymentType: sale.paymentType || "CASH",
                paymentDescription: sale.paymentDescription || "",
                totalAmountWithoutTax: sale.totalAmountWithoutTax || 0,
                totalTaxAmount: sale.totalTaxAmount || 0,
                deliveryCharges: sale.deliveryCharges || 0,
                totalAmount: sale.totalAmount || 0,
                receivedAmount: sale.receivedAmount || 0,
                balance: sale.balance || 0,
                overdue: sale.overdue || false,
                paid: sale.paid || false,
                saleItems:
                    sale.saleItemResponses?.map((it) => ({
                        itemId: it.itemId || "", // Populate itemId if available in response
                        itemName: it.itemName || "",
                        itemHsnCode: it.itemHsnCode || "",
                        itemDescription: it.itemDescription || "",
                        quantity: it.quantity || 1,
                        unit: it.unit || "CARTONS",
                        pricePerUnit: it.pricePerUnit || 0,
                        pricePerUnitTaxType: it.pricePerUnitTaxType || "WITHTAX",
                        taxRate: it.taxRate || "NONE",
                        taxAmount: it.taxAmount || 0,
                        totalAmount: it.totalAmount || 0,
                    })) || [],
            });
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to load sale");
            navigate("/sales");
        } finally {
            setLoading(false);
        }
    };

    // -----------------------------------------------------------------
    // Load on Mount
    // -----------------------------------------------------------------
    useEffect(() => {
        if (!token || !companyId) {
            navigate("/login");
            return;
        }
        fetchParties();
        fetchItems(); // Fetch items on mount
        if (editId) {
            fetchSale(editId);
        }
    }, [token, companyId, editId, navigate]);


    // -----------------------------------------------------------------
    // Calculate Overall Totals Effect
    // -----------------------------------------------------------------
    const calculateOverallTotals = (currentSaleItems, currentDeliveryCharges, currentReceivedAmount) => {
        let totalAmountWithoutTax = 0;
        let totalTaxAmount = 0;
        let totalAmount = 0;

        currentSaleItems.forEach(item => {
            const itemCalculations = calculateItemTotals(item);
            totalAmountWithoutTax += itemCalculations.totalAmountWithoutTax;
            totalTaxAmount += itemCalculations.taxAmount;
            totalAmount += itemCalculations.totalAmount;
        });

        // Add delivery charges to the final total
        const delivery = parseFloat(currentDeliveryCharges) || 0;
        totalAmount += delivery;

        const received = parseFloat(currentReceivedAmount) || 0;
        const balance = totalAmount - received;

        return {
            totalAmountWithoutTax: parseFloat(totalAmountWithoutTax.toFixed(2)),
            totalTaxAmount: parseFloat(totalTaxAmount.toFixed(2)),
            totalAmount: parseFloat(totalAmount.toFixed(2)),
            balance: parseFloat(balance.toFixed(2)),
        };
    };

    useEffect(() => {
        const { totalAmountWithoutTax, totalTaxAmount, totalAmount, balance } =
            calculateOverallTotals(formData.saleItems, formData.deliveryCharges, formData.receivedAmount);

        setFormData(prev => ({
            ...prev,
            totalAmountWithoutTax,
            totalTaxAmount,
            totalAmount,
            balance,
        }));
    }, [formData.saleItems, formData.deliveryCharges, formData.receivedAmount]);


    // -----------------------------------------------------------------
    // Submit (Create or Update)
    // -----------------------------------------------------------------
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!token || !companyId) {
            toast.error("Authentication required");
            return;
        }

        setLoading(true);
        setMessage("");

        // Prepare data to send (remove temporary calculated fields from top-level formData if API doesn't expect them)
        const dataToSend = { ...formData };
        // The API expects saleItems without the extra calculated fields at their top level
        // so we can clean them here, or ensure the backend handles them.
        // For simplicity, we'll send the state as is, assuming backend can pick what it needs.

        try {
            const url = editId
                ? `${config.BASE_URL}/sale/${editId}`
                : `${config.BASE_URL}/company/${companyId}/create-sale`;

            const method = editId ? axios.put : axios.post;

            await method(
                url,
                dataToSend, // Send the formData
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            toast.success(editId ? "Sale updated successfully!" : "Sale created successfully!");
            navigate("/sales");
        } catch (err) {
            const msg = err.response?.data?.message || "Operation failed";
            setMessage(`Error: ${msg}`);
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    // -----------------------------------------------------------------
    // Constants
    // -----------------------------------------------------------------
    const saleTypes = ["CASH", "CREDIT"];
    const states = [
        "ANDHRA_PRADESH", "ARUNACHAL_PRADESH", "ASSAM", "BIHAR", "CHHATTISGARH", "GOA",
        "GUJARAT", "HARYANA", "HIMACHAL_PRADESH", "JHARKHAND", "KARNATAKA", "KERALA",
        "MADHYA_PRADESH", "MAHARASHTRA", "MANIPUR", "MEGHALAYA", "MIZORAM", "NAGALAND",
        "ODISHA", "PUNJAB", "RAJASTHAN", "SIKKIM", "TAMIL_NADU", "TELANGANA", "TRIPURA",
        "UTTAR_PRADESH", "UTTARAKHAND", "WEST_BENGAL", "OTHER",
    ];
    const units = [
        "CARTONS", "KILOGRAMS", "QUINTAL", "BOTTLES", "PIECES", "ROLLS", "NUMBERS",
        "PAIRS", "TABLETS", "MILLITRE", "BUNDLES", "BOX", "SQUARE_METERS", "BAGS",
        "CANS", "SQUARE_FEET",
    ];
    const taxTypes = ["WITHTAX", "WITHOUTTAX"];
    const taxRates = [
        "NONE", "EXEMPTED", "GST0", "IGST0", "GST0POINT25", "IGST0POINT25",
        "GST3", "IGST3", "GST5", "IGST5", "GST12", "IGST12", "GST18", "IGST18",
        "GST28", "IGST28",
    ];
    const paymentTypes = [
        "CASH", "UPI", "CREDIT_CARD", "DEBIT_CARD", "NET_BANKING", "WALLET",
        "CHEQUE", "OTHER",
    ];

    // -----------------------------------------------------------------
    // Render
    // -----------------------------------------------------------------
    return (
        <div className={styles["company-form-container"]}>
            {/* Header */}
            <div className={styles["form-header"]}>
                <div>
                    <h1 className={styles["company-form-title"]}>
                        {editId ? "Edit Sale" : "Create Sale"}
                    </h1>
                    <p className={styles["form-subtitle"]}>
                        {editId ? "Update invoice details" : "Fill in the invoice details"}
                    </p>
                </div>
                <button
                    onClick={() => navigate("/sales")}
                    className={styles["cancel-button"]}
                    disabled={loading}
                >
                    Back
                </button>
            </div>

            {/* Messages */}
            {message && (
                <div
                    className={
                        message.includes("Error")
                            ? styles["error-message"]
                            : styles["success-message"]
                    }
                >
                    {message}
                </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className={styles["company-form"]}>
                {/* === BASIC INFORMATION === */}
                <section className={styles["form-section"]}>
                    <h2 className={styles["section-title"]}>Basic Information</h2>

                    <div className={styles["form-row"]}>
                        <div className={styles["form-group"]}>
                            <label>
                                Party <span className={styles.required}>*</span>
                            </label>
                            <select
                                name="partyId"
                                value={formData.partyId}
                                onChange={handleChange}
                                required
                                disabled={loading}
                                className={styles["form-input"]}
                            >
                                <option value="">Select Party</option>
                                {parties.map((p) => (
                                    <option key={p.id} value={p.id}>
                                        {p.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className={styles["form-group"]}>
                            <label>Invoice Number</label>
                            <input
                                type="text"
                                name="invoiceNumber"
                                value={formData.invoiceNumber}
                                onChange={handleChange}
                                className={styles["form-input"]}
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <div className={styles["form-row"]}>
                        <div className={styles["form-group"]}>
                            <label>
                                Invoice Date <span className={styles.required}>*</span>
                            </label>
                            <input
                                type="date"
                                name="invoceDate"
                                value={formData.invoceDate}
                                onChange={handleChange}
                                required
                                className={styles["form-input"]}
                                disabled={loading}
                            />
                        </div>

                        <div className={styles["form-group"]}>
                            <label>
                                Due Date <span className={styles.required}>*</span>
                            </label>
                            <input
                                type="date"
                                name="dueDate"
                                value={formData.dueDate}
                                onChange={handleChange}
                                required
                                className={styles["form-input"]}
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <div className={styles["form-row"]}>
                        <div className={styles["form-group"]}>
                            <label>Sale Type</label>
                            <select
                                name="saleType"
                                value={formData.saleType}
                                onChange={handleChange}
                                className={styles["form-input"]}
                                disabled={loading}
                            >
                                {saleTypes.map((t) => (
                                    <option key={t} value={t}>{t}</option>
                                ))}
                            </select>
                        </div>

                        <div className={styles["form-group"]}>
                            <label>State of Supply</label>
                            <select
                                name="stateOfSupply"
                                value={formData.stateOfSupply}
                                onChange={handleChange}
                                className={styles["form-input"]}
                                disabled={loading}
                            >
                                {states.map((s) => (
                                    <option key={s} value={s}>
                                        {s.replace(/_/g, " ")}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className={styles["form-row"]}>
                        <div className={styles["form-group"]}>
                            <label>Payment Type</label>
                            <select
                                name="paymentType"
                                value={formData.paymentType}
                                onChange={handleChange}
                                className={styles["form-input"]}
                                disabled={loading}
                            >
                                {paymentTypes.map((t) => (
                                    <option key={t} value={t}>{t}</option>
                                ))}
                            </select>
                        </div>

                        <div className={styles["form-group"]}>
                            <label>Payment Description</label>
                            <textarea
                                name="paymentDescription"
                                value={formData.paymentDescription}
                                onChange={handleChange}
                                className={`${styles["form-input"]} ${styles.textarea}`}
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <div className={styles["form-row"]}>
                        <div className={styles["form-group"]}>
                            <label>Billing Address</label>
                            <textarea
                                name="billingAddress"
                                value={formData.billingAddress}
                                onChange={handleChange}
                                className={`${styles["form-input"]} ${styles.textarea}`}
                                disabled={loading}
                            />
                        </div>

                        <div className={styles["form-group"]}>
                            <label>Shipping Address</label>
                            <textarea
                                name="shippingAddress"
                                value={formData.shippingAddress}
                                onChange={handleChange}
                                className={`${styles["form-input"]} ${styles.textarea}`}
                                disabled={loading}
                            />
                        </div>
                    </div>
                </section>

                {/* === TOTALS === */}
                <section className={styles["form-section"]}>
                    <h2 className={styles["section-title"]}>Totals</h2>

                    <div className={styles["form-row"]}>
                        <div className={styles["form-group"]}>
                            <label>Total (ex-tax)</label>
                            <input
                                type="number"
                                step="0.01"
                                name="totalAmountWithoutTax"
                                value={formData.totalAmountWithoutTax}
                                readOnly // Make readOnly as it's calculated
                                className={styles["form-input"]}
                                disabled={loading}
                            />
                        </div>
                        <div className={styles["form-group"]}>
                            <label>Tax Amount</label>
                            <input
                                type="number"
                                step="0.01"
                                name="totalTaxAmount"
                                value={formData.totalTaxAmount}
                                readOnly // Make readOnly as it's calculated
                                className={styles["form-input"]}
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <div className={styles["form-row"]}>
                        <div className={styles["form-group"]}>
                            <label>Delivery Charges</label>
                            <input
                                type="number"
                                step="0.01"
                                name="deliveryCharges"
                                value={formData.deliveryCharges}
                                onChange={handleChange} // This can be manually edited
                                className={styles["form-input"]}
                                disabled={loading}
                            />
                        </div>
                        <div className={styles["form-group"]}>
                            <label>Total Amount</label>
                            <input
                                type="number"
                                step="0.01"
                                name="totalAmount"
                                value={formData.totalAmount}
                                readOnly // Make readOnly as it's calculated
                                className={styles["form-input"]}
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <div className={styles["form-row"]}>
                        <div className={styles["form-group"]}>
                            <label>Received Amount</label>
                            <input
                                type="number"
                                step="0.01"
                                name="receivedAmount"
                                value={formData.receivedAmount}
                                onChange={handleChange} // This can be manually edited
                                className={styles["form-input"]}
                                disabled={loading}
                            />
                        </div>
                        <div className={styles["form-group"]}>
                            <label>Balance</label>
                            <input
                                type="number"
                                step="0.01"
                                name="balance"
                                value={formData.balance}
                                readOnly // Make readOnly as it's calculated
                                className={styles["form-input"]}
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <div className={styles["form-row"]}>
                        <div className={styles["form-group"]}>
                            <label>Overdue</label>
                            <input
                                type="checkbox"
                                name="overdue"
                                checked={formData.overdue}
                                onChange={handleChange}
                                disabled={loading}
                            />
                        </div>
                        <div className={styles["form-group"]}>
                            <label>Paid</label>
                            <input
                                type="checkbox"
                                name="paid"
                                checked={formData.paid}
                                onChange={handleChange}
                                disabled={loading}
                            />
                        </div>
                    </div>
                </section>

                {/* === SALE ITEMS === */}
                <section className={styles["form-section"]}>
                    <h2 className={styles["section-title"]}>Sale Items</h2>

                    {formData.saleItems.map((it, idx) => (
                        <div key={idx} className={styles["item-block"]}>
                            <div className={styles["form-row"]}>
                                <div className={styles["form-group"]}>
                                    <label>Item <span className={styles.required}>*</span></label>
                                    <select
                                        name="itemId"
                                        value={it.itemId || ""}
                                        onChange={(e) => handleItemSelect(idx, e.target.value)}
                                        required
                                        className={styles["form-input"]}
                                        disabled={loading}
                                    >
                                        <option value="">Select Item</option>
                                        {items.map((item) => (
                                            <option key={item.itemId} value={item.itemId}>
                                                {item.itemName} (HSN: {item.itemHsn})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className={styles["form-group"]}>
                                    <label>Item Name</label>
                                    <input
                                        type="text"
                                        name="itemName"
                                        value={it.itemName}
                                        readOnly // This will be autofilled
                                        className={styles["form-input"]}
                                        disabled={loading}
                                    />
                                </div>
                            </div>

                            <div className={styles["form-row"]}>
                                <div className={styles["form-group"]}>
                                    <label>HSN Code</label>
                                    <input
                                        type="text"
                                        name="itemHsnCode"
                                        value={it.itemHsnCode}
                                        readOnly // This will be autofilled
                                        className={styles["form-input"]}
                                        disabled={loading}
                                    />
                                </div>
                                <div className={styles["form-group"]}>
                                    <label>Description</label>
                                    <textarea
                                        name="itemDescription"
                                        value={it.itemDescription}
                                        readOnly // This will be autofilled
                                        className={`${styles["form-input"]} ${styles.textarea}`}
                                        disabled={loading}
                                    />
                                </div>
                            </div>

                            <div className={styles["form-row"]}>
                                <div className={styles["form-group"]}>
                                    <label>Quantity</label>
                                    <input
                                        type="number"
                                        name="quantity"
                                        value={it.quantity}
                                        onChange={(e) => handleItemChange(idx, e)}
                                        className={styles["form-input"]}
                                        min="0.01"
                                        step="0.01"
                                        disabled={loading}
                                    />
                                </div>
                                <div className={styles["form-group"]}>
                                    <label>Unit</label>
                                    <select
                                        name="unit"
                                        value={it.unit}
                                        onChange={(e) => handleItemChange(idx, e)}
                                        className={styles["form-input"]}
                                        disabled={loading}
                                    >
                                        {units.map((u) => (
                                            <option key={u} value={u}>{u}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className={styles["form-row"]}>
                                <div className={styles["form-group"]}>
                                    <label>Price / Unit</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        name="pricePerUnit"
                                        value={it.pricePerUnit}
                                        onChange={(e) => handleItemChange(idx, e)}
                                        className={styles["form-input"]}
                                        disabled={loading}
                                    />
                                </div>
                                <div className={styles["form-group"]}>
                                    <label>Tax Type</label>
                                    <select
                                        name="pricePerUnitTaxType"
                                        value={it.pricePerUnitTaxType}
                                        onChange={(e) => handleItemChange(idx, e)}
                                        className={styles["form-input"]}
                                        disabled={loading}
                                    >
                                        {taxTypes.map((t) => (
                                            <option key={t} value={t}>{t}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className={styles["form-row"]}>
                                <div className={styles["form-group"]}>
                                    <label>Tax Rate</label>
                                    <select
                                        name="taxRate"
                                        value={it.taxRate}
                                        onChange={(e) => handleItemChange(idx, e)}
                                        className={styles["form-input"]}
                                        disabled={loading}
                                    >
                                        {taxRates.map((r) => (
                                            <option key={r} value={r}>{r}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className={styles["form-group"]}>
                                    <label>Tax Amount</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        name="taxAmount"
                                        value={it.taxAmount}
                                        readOnly // This will be calculated
                                        className={styles["form-input"]}
                                        disabled={loading}
                                    />
                                </div>
                            </div>

                            <div className={styles["form-row"]}>
                                <div className={styles["form-group"]}>
                                    <label>Total Amount (Item)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        name="totalAmount"
                                        value={it.totalAmount}
                                        readOnly // This will be calculated
                                        className={styles["form-input"]}
                                        disabled={loading}
                                    />
                                </div>
                            </div>

                            {formData.saleItems.length > 1 && (
                                <button
                                    type="button"
                                    className={styles["remove-item-btn"]}
                                    onClick={() => removeItem(idx)}
                                    disabled={loading}
                                >
                                    Remove Item
                                </button>
                            )}
                        </div>
                    ))}

                    <button
                        type="button"
                        className={styles["add-item-btn"]}
                        onClick={addItem}
                        disabled={loading}
                    >
                        Add Another Item
                    </button>
                </section>

                {/* === ACTIONS === */}
                <div className={styles["form-actions"]}>
                    <button
                        type="submit"
                        className={styles["submit-button"]}
                        disabled={loading}
                    >
                        {loading
                            ? editId
                                ? "Updating..."
                                : "Creating..."
                            : editId
                                ? "Update Sale"
                                : "Create Sale"}
                    </button>
                    <button
                        type="button"
                        className={styles["cancel-button"]}
                        onClick={() => navigate("/sales")}
                        disabled={loading}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateSale;