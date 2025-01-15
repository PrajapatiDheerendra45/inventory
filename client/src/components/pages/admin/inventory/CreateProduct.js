import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../../../context/Auth";
const CreateProduct = () => {
  const [isChecked, setIsChecked] = useState(false);
  const [gstRate, setGstRate] = useState("0%");
  const [landingCost, setLandingCost] = useState(0);
  const [options, setOptions] = useState([{ name: "", values: [] }]);
  const [auth] = useAuth();
  const [userId, setUserId] = useState("");
  const initialItemsState = [
    {
      items: "",
      productCode: "",
      productName: "",
      purchasePrice: "",
      landingCost: "",
      mrp: "",
      retailDiscount: "",
      retailPrice: "",
      retailMargin: "",
      wholesalerDiscount: "",
      wholesalerPrice: "",
      wholesaleMargin: "",
      minimumStock: "",
      maximumStock: "",
      openingQty: "",
    },
  ];

  const [Items, setItems] = useState(initialItemsState);
  const [Quantity, setQuantity] = useState(0);
  const [Rate, setRate] = useState(0);
  const [Amount, setAmount] = useState("");
  const [addvarints, setVarints] = useState(false);
  const [categories, setCategories] = useState([]);
  const [units, setUnits] = useState([]);
  const [subCategory, setSubCategories] = useState([]);
  const [manufacturers, setManufacturer] = useState([]);

  const [brand, setBrand] = useState([]);
  const [subbrand, setSubBrand] = useState([]);
  const initialFormDataState = {
    itemCode: "",
    productName: "",
    category: "",
    subCategory: "",
    manufacturer: "",

    brand: "",
    subBrand: "",
    unit: "",
    hsnCode: "",
    gstRate: "0%",
    cess: false,

    description: "",
    newWeight: "",
    purchaseTaxInclude: false,
    salesTaxInclude: false,
    description: "",
    netWeight: "",
    batchNo: "",
    expiryDate: "",
    feature: "",
    minimumStock: 0,
    maximumStock: 0,
    img: [],
    purchasePriceExGst: 0,
    purchasePriceInGst: 0,
    maxmimunRetailPrice: 0,
    retailDiscount: 0,
    retailPrice: 0,
    retailMargin: 0,
    wholesalerDiscount: 0,
    wholesalerPrice: 0,
    wholesaleMargin: 0,
    quantity: 0,
    rate: 0,
    units: "",
    amount: 0,
    Items: [],
  };

  const [formData, setFormData] = useState(initialFormDataState);

  const [imgs, setimgs] = useState([]);
  const fileInputRef = useRef(null);

  // calculation
  const [margin, setMargin] = useState(0);

  // const calculateProfitAndMargin = () => {
  //   const retailDiscount = parseFloat(formData.retailDiscount) || 0;
  //   const maxmimunRetailPrice = parseFloat(formData.maxmimunRetailPrice) || 0;
  //   const landingCost = parseFloat(formData.purchasePriceInGst) || 0;
  //   const gstRate = parseFloat(formData.gstRate) || 0;
  //   const salesTaxInclude = formData.salesTaxInclude;

  //   // Calculate retail price based on MRP and discount
  //   const retailPrice =
  //     maxmimunRetailPrice - maxmimunRetailPrice * (retailDiscount / 100);

  //   let retailPriceExTax, calculatedProfit, calculatedMargin;

  //   if (salesTaxInclude) {
  //     retailPriceExTax = retailPrice / (1 + gstRate / 100);
  //     calculatedProfit = retailPriceExTax - landingCost;
  //     calculatedMargin = (calculatedProfit / retailPriceExTax) * 100;
  //   } else {
  //     calculatedProfit = retailPrice - landingCost;
  //     calculatedMargin = (calculatedProfit / retailPrice) * 100;
  //   }

  //   // Update form data with calculated values
  //   setFormData({
  //     ...formData,
  //     retailPrice: retailPrice.toFixed(2),
  //     retailMargin: calculatedMargin.toFixed(2),
  //   });
  // };

  // useEffect(() => {
  //   handleChange();
  // }, [
  //   formData.retailPrice,
  //   formData.purchasePriceInGst,
  //   formData.gstRate,
  //   formData.salesTaxInclude,
  // ]);



  useEffect(() => {
    
    if (auth.user.role === 1) {
      setUserId(auth.user._id);
    }
    if (auth.user.role === 0) {
      setUserId(auth.user.admin);
    }

    fetchManufecturer();
    fetchUnit();
    fetchCategories();
    fetchSubCategories();
    fetchBrand();
    fetchSubBrand()
  }, [auth,userId]);

  
  const fetchManufecturer = async () => {
    try {
      const response = await axios.get(`/api/v1/auth/manageManufacturer/${userId}`);
      setManufacturer(response.data.data);
    } catch (error) {
      console.error("Error fetching manufacturer:", error);
      // toast.error("Failed to fetch manufacturer");
    }
  };

  const fetchUnit = async () => {
    try {
      const response = await axios.get(`/api/v1/auth/getStockUnit/${userId}`);
      setUnits(response.data.data);
    } catch (error) {
      console.error("Error fetching manufacturer:", error);
      // toast.error("Failed to fetch manufacturer");
    }
  };
  // category
  
  const fetchCategories = async () => {
    try {
      const response = await axios.get(`/api/v1/auth/getcategory/${userId}`);
      setCategories(response.data.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      // toast.error("Failed to fetch categories");
    }
  };
  // Sub category
 
  const fetchSubCategories = async () => {
    try {
      const response = await axios.get(`/api/v1/auth/getSubCategory/${userId}`);
      setSubCategories(response.data.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      // toast.error("Failed to fetch categories");
    }
  };

  //  Brand
  const fetchBrand = async () => {
    try {
      const response = await axios.get(`/api/v1/auth/getBrand/${userId}`);
      setBrand(response.data.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      // toast.error("Failed to fetch categories");
    }
  };
 
  const fetchSubBrand = async () => {
    try {
      const response = await axios.get(`/api/v1/auth/getSubBrand/${userId}`);
      setSubBrand(response.data.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      // toast.error("Failed to fetch categories");
    }
  };
  const formatExpiryDate = (dateString) => {
    const [year, month] = dateString.split("-"); // Get the year and month
    return `${month} ${year}`; // Create MM YYYY format
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
   
    const formattedValue = formatExpiryDate(value); // Format the date
    setFormData((prev) => ({
      ...prev,
      expiryDate: formattedValue, // Set MM YYYY to the form data
    }));
    // Update form data first
    const updatedFormData = {
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    };

    // Now calculate retail price if MRP or discount is updated
    const retailDiscount = parseFloat(updatedFormData.retailDiscount) || 0;
    const maxmimunRetailPrice =
      parseFloat(updatedFormData.maxmimunRetailPrice) || 0;
    const landingCost = parseFloat(updatedFormData.purchasePriceInGst) || 0;
    const gstRate = parseFloat(updatedFormData.gstRate) || 0;
    const salesTaxInclude = updatedFormData.salesTaxInclude;

    // Calculate the retail price
    const retailPrice =
      maxmimunRetailPrice - maxmimunRetailPrice * (retailDiscount / 100);

    let retailPriceExTax, calculatedRetailProfit, calculatedRetailMargin;

    if (salesTaxInclude) {
      retailPriceExTax = retailPrice / (1 + gstRate / 100);
      calculatedRetailProfit = retailPriceExTax - landingCost;
      calculatedRetailMargin =
        (calculatedRetailProfit / retailPriceExTax) * 100;
    } else {
      calculatedRetailProfit = retailPrice - landingCost;
      calculatedRetailMargin = (calculatedRetailProfit / retailPrice) * 100;
    }

    // Now calculate wholesaler price and margin
    const wholesalerDiscount =
      parseFloat(updatedFormData.wholesalerDiscount) || 0;
    const wholesalerPrice =
      maxmimunRetailPrice - maxmimunRetailPrice * (wholesalerDiscount / 100);

    let wholesalerPriceExTax,
      calculatedWholesalerProfit,
      calculatedWholesalerMargin;

    if (salesTaxInclude) {
      wholesalerPriceExTax = wholesalerPrice / (1 + gstRate / 100);
      calculatedWholesalerProfit = wholesalerPriceExTax - landingCost;
      calculatedWholesalerMargin =
        (calculatedWholesalerProfit / wholesalerPriceExTax) * 100;
    } else {
      calculatedWholesalerProfit = wholesalerPrice - landingCost;
      calculatedWholesalerMargin =
        (calculatedWholesalerProfit / wholesalerPrice) * 100;
    }

    // Update formData with calculated retail and wholesaler values
    setFormData({
      ...updatedFormData,
      retailPrice: retailPrice.toFixed(2),
      retailMargin: calculatedRetailMargin.toFixed(2),
      wholesalerPrice: wholesalerPrice.toFixed(2),
      wholesaleMargin: calculatedWholesalerMargin.toFixed(2),
    });
  };

  useEffect(() => {
    updateTable(options);
  }, [options]);

  const handleProductChange = (index, event) => {
    const { name, value } = event.target;
    const newItems = [...Items];
    newItems[index][name] = value;
    setItems(newItems);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();

    for (const key in formData) {
      form.append(key, formData[key]);
     
    }
    for (let i = 0; i < imgs.length; i++) {
      form.append("img", imgs[i]);
    }

    form.append("items", JSON.stringify(Items));
    form.append("userId",userId)
    try {
     
      const response = await axios.post("/api/v1/auth/createProduct", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response) {
        toast.success("Product Created Successfully...");
      }
      clearData();
    } catch (error) {
      toast.error(
        `There was an error creating the product: ${
          error.response ? error.response.data.message : error.message
        }`
      );
    }
  };

  const clearData = () => {
    setFormData(initialFormDataState);
    setLandingCost(0);
    setItems(initialItemsState);
    setimgs([]);
    setOptions([{ name: "", values: [] }]);
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  };

  const handleQuantityChange = (e) => {
    const quantity = parseFloat(e.target.value) || 0;
    setFormData((prevFormData) => ({
      ...prevFormData,
      quantity,
      amount: quantity * prevFormData.rate,
    }));
  };

  const handleRateChange = (e) => {
    const rate = parseFloat(e.target.value) || 0;
    setFormData((prevFormData) => ({
      ...prevFormData,
      rate,
      amount: rate * prevFormData.quantity,
    }));
  };

  const handleGstRateChange = (e) => {
    const gstRate = e.target.value;
    setGstRate(gstRate);
    const parsedGstRate = parseFloat(gstRate.replace("%", "")) || 0;
    setFormData((prevFormData) => ({
      ...prevFormData,
      gstRate: parsedGstRate,
    }));
  };

  useEffect(() => {
    updateTable(options);
  }, [options]);

  const handleOptionChange = (index, field, value) => {
    const newOptions = [...options];
    newOptions[index][field] = value;
    setOptions(newOptions);
  };

  const handleAddOption = () => {
    setOptions([...options, { name: "", values: [] }]);
  };

  const handleRemoveOption = (index) => {
    const newOptions = options.filter((_, i) => i !== index);
    setOptions(newOptions);
  };

  const updateTable = (newOptions) => {
    const existingVariants = Items?.map((item) => item.variant);
    const newVariants = newOptions
      ?.filter((option) => option.values.length > 0)
      ?.flatMap((option) => option.values);
    const tableVariants = newVariants
      ?.filter((variant) => !existingVariants.includes(variant))
      ?.map((variant) => ({
        variant: variant,
        productCode: "",
        productName: "",
        purchasePrice: "",
        landingCost: "",
        mrp: "",
        retailDiscount: "",
        retailPrice: "",
        retailMargin: "",
        wholesalerDiscount: "",
        wholesalerPrice: "",
        wholesaleMargin: "",
        minimumStock: "",
        maximumStock: "",
        openingQty: "",
      }));
    const updatedItems = Items?.filter((item) =>
      newVariants.includes(item.variant)
    );
    setItems([...updatedItems, ...tableVariants]);
  };

  const calculateOpeningBalance = () => {
    const quantity = parseFloat(Quantity) || 0;
    const rate = parseFloat(Rate) || 0;
    const total = quantity * rate;
    setAmount(total.toFixed(2));
  };

  useEffect(() => {
    calculateOpeningBalance();
  }, [Quantity, Rate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Set the new value in the form data
    setFormData((prevData) => {
      const updatedFormData = { ...prevData, [name]: value };

      // Check if Purchase Price Ex GST and GST Rate are available
      const purchasePriceExGst =
        parseFloat(updatedFormData.purchasePriceExGst) || 0;
      const gstRate = parseFloat(updatedFormData.gstRate) || 0;

      // Calculate the Purchase Price Including GST
      const purchasePriceInGst =
        purchasePriceExGst + (purchasePriceExGst * gstRate) / 100;

      return {
        ...updatedFormData,
        purchasePriceInGst: purchasePriceInGst.toFixed(2), // Show with two decimal points
      };
    });
  };

  const handleTagInputChange = (index, newTags) => {
    const newOptions = [...options];
    newOptions[index].values = newTags;
    setOptions(newOptions);
    updateTable(newOptions);
  };

  const TagInput = ({ index, value }) => {
    const [tags, setTags] = useState(value || []);
    const [inputValue, setInputValue] = useState("");

    const addTag = (e) => {
      if (e.key === " " && inputValue.trim() !== "") {
        const newTags = [...tags, inputValue.trim()];
        setTags(newTags);
        setInputValue("");
        handleTagInputChange(index, newTags);
      }
    };

    const removeTag = (indexToRemove) => {
      const newTags = tags.filter((_, index) => index !== indexToRemove);
      setTags(newTags);
      handleTagInputChange(index, newTags);
    };

    return (
      <div className="flex flex-col w-full ">
        <label className="font-bold ml-3">items Value </label>
        <div className="flex flex-wrap items-center border border-gray-300 rounded ml-3">
          {tags?.map((tag, index) => (
            <div
              key={index}
              className="flex items-center bg-red-500 text-white px-3 py-1 m-1 rounded"
            >
              {tag}
              <button
                className="ml-2 bg-red-700 text-white rounded-full w-5 h-5 flex items-center justify-center"
                onClick={() => removeTag(index)}
              >
                x
              </button>
            </div>
          ))}
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={addTag}
            placeholder="Enter Option Value"
            className="flex-grow p-1 outline-none"
          />
        </div>
      </div>
    );
  };

  return (
    <div className="justify-center p-8 responsive-container">
      <h4 className="text-3xl font-bold mb-4 text-center bg-gray-300">
        Create Product
      </h4>
      <div className="bg-gray-200 p-4 rounded mb-4">
        <h2 className="font-bold mb-2 text-xl">Product Information</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-3">
          {/* Product Information Fields */}
          <div>
            <label className="block font-bold">Product Code</label>
            <input
              type="text"
              name="itemCode"
              className="w-full p-1 border rounded"
              value={formData.itemCode}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block font-bold">Product Name</label>
            <input
              type="text"
              name="productName"
              className="w-full p-1 border rounded"
              value={formData.productName}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block font-bold">Category</label>
            <select
              name="category"
              className="w-full p-1 border rounded"
              value={formData.category}
              onChange={handleChange}
            >
              <option value="">Select categories </option>

              {categories?.map((category, index) => (
                <option key={index} value={category.CategoryName}>
                  {category.CategoryName}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-bold">Sub Category</label>
            <select
              className="w-full p-1 border rounded"
              name="subCategory"
              value={formData.subCategory}
              onChange={handleChange}
            >
              <option value="">Select Sub Categories </option>

              {subCategory?.map((subCategory, index) => (
                <option key={index} value={subCategory.subCategoryName}>
                  {subCategory.subCategoryName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-bold">Manufacturer</label>
            <select
              name="manufacturer"
              className="w-full p-1 border rounded"
              value={formData.manufacturer}
              onChange={handleChange}
            >
              <option value="">Select manufacturer </option>

              {manufacturers?.map((manufacturer, index) => (
                <option key={index} value={manufacturer.name}>
                  {manufacturer.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-bold">Brand</label>
            <select
              className="w-full p-1 border rounded"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
            >
              <option value="">Select Brand </option>

              {brand?.map((brand, index) => (
                <option key={index} value={brand.BrandName}>
                  {brand.BrandName}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-bold">Sub Brand</label>
            <select
              className="w-full p-1 border rounded"
              name="subBrand"
              value={formData.subBrand}
              onChange={handleChange}
            >
              <option value="">Select Sub Brand </option>
              {subbrand?.map((subbrand, index) => (
                <option key={index} value={subbrand.SubBrandName}>
                  {subbrand.SubBrandName}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-bold">Units</label>
            <select
              className="w-full p-1 border rounded"
              name="unit"
              value={formData.unit}
              onChange={handleChange}
            >
              <option value="">select Units </option>
              {units?.map((unit, index) => (
                <option key={index} value={unit.unitofquantity}>
                  {unit.unitofquantity}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-bold">HSN Code</label>
            <input
              type="text"
              className="w-full p-1 border rounded"
              name="hsnCode"
              value={formData.hsnCode}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block font-bold">GST Rate</label>
            <select
              className="w-full p-1 border rounded"
              name="gstRate"
              value={formData.gstRate}
              onChange={handleInputChange}
            >
              <option value="0">0%</option>
              <option value="5">5%</option>
              <option value="12">12%</option>
              <option value="18">18%</option>
              <option value="28">28%</option>
            </select>
          </div>

          <div>
            <label className="font-bold px-2">Cess</label>
            <input
              type="checkbox"
              checked={isChecked}
              onChange={() => setIsChecked(!isChecked)}
              className=" border rounded"
            />
            {isChecked && (
              <input
                type="text"
                className="w-full p-1 border rounded"
                name="cess"
                checked={formData.cess}
                onChange={handleChange}
              />
            )}
          </div>

          <div>
            <label className="font-bold">Purchase Tax Include</label>
            <input
              type="checkbox"
              className="p-1 m-4 border rounded"
              name="purchaseTaxInclude"
              checked={formData.purchaseTaxInclude}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="font-bold">Sales Tax Include</label>
            <input
              type="checkbox"
              className="p-1 m-4 border rounded"
              name="salesTaxInclude"
              checked={formData.salesTaxInclude}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="font-bold">Description</label>
            <textarea
              type="text"
              className="w-full p-1 border rounded"
              name="description"
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block font-bold">Net Weight</label>
            <input
              type="text"
              name="newWeight"
              className="w-full p-1 border rounded"
              value={formData.newWeight}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block font-bold">Batch No.</label>
            <input
              type="text"
              name="batchNo"
              className="w-full p-1 border rounded"
              value={formData.batchNo}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block font-bold">Expiry Date</label>
            <input
              type="month"
              name="expiryDate"
              className="w-full p-1 border rounded"
              value={formData.expiryDate}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block font-bold">Features</label>
            <textarea
              type="text"
              name="feature"
              className="w-full p-1 border rounded"
              value={formData.feature}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block font-bold">Product image</label>

            <input
              type="file"
              name="img"
              accept="image/*"
              className="w-full p-1 border rounded"
              multiple
              onChange={(e) => setimgs(Array.from(e.target.files))}
              ref={fileInputRef}
            />
          </div>
        </div>
      </div>
      <div className="bg-gray-200 p-4 rounded mb-4">
        <h2 className="font-bold mb-2 text-xl">Pricing Information</h2>
        <div className="grid grid-cols-1 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-4  gap-4">
          <div>
            <label className="block font-bold">Purchase Price</label>

            <input
              type="number"
              name="purchasePriceExGst"
              className="w-full p-1 border rounded"
              value={formData.purchasePriceExGst}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label className="block font-bold">Landing cost</label>
            {/* // change   purches price to landing cost */}
            <input
              type="number"
              name="purchasePriceInGst"
              className="w-full p-1 border rounded"
              value={formData.purchasePriceInGst}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block font-bold">
              Maximum Retail Price <span className="text-xs">(MRP)</span>{" "}
            </label>

            <input
              type="number"
              name="maxmimunRetailPrice"
              className="w-full p-1 border rounded"
              value={formData.maxmimunRetailPrice}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block font-bold">
              Retail Discount <span className="text-xs">(in %)</span>
            </label>
            <input
              type="number"
              name="retailDiscount"
              className="w-full p-1 border rounded"
              value={formData.retailDiscount}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block font-bold">
              Retail Price <span className="text-xs">(in RS)</span>
            </label>
            {/* <p>(in Rs)</p> */}
            <input
              type="number"
              name="retailPrice"
              className="w-full p-1 border rounded"
              value={formData.retailPrice}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block font-bold">
              Retail Margin <span className="text-xs">(in %)</span>
            </label>
            {/* <p>(in %)</p> */}
            <input
              type="number"
              name="retailMargin"
              className="w-full p-1 border rounded"
              value={formData.retailMargin}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block font-bold">
              Wholesaler Discount <span className="text-xs">(in %)</span>
            </label>
            {/* <p>(in %)</p> */}
            <input
              type="number"
              name="wholesalerDiscount"
              className="w-full p-1 border rounded"
              value={formData.wholesalerDiscount}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block font-bold">
              Wholesaler Price <span className="text-xs">(in RS)</span>
            </label>
            {/* <p>(in Rs)</p> */}
            <input
              type="number"
              name="wholesalerPrice"
              className="w-full p-1 border rounded"
              value={formData.wholesalerPrice}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block font-bold">
              Wholesale Margin <span className="text-xs">(in %)</span>
            </label>
            {/* <p>(in %)</p> */}
            <input
              type="number"
              name="wholesaleMargin"
              className="w-full p-1 border rounded"
              value={formData.wholesaleMargin}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      <div className="bg-gray-200 p-4 rounded mb-4">
        <h2 className="font-bold mb-2 text-xl">Stock Information</h2>
        <div className="grid grid-cols-5 gap-4">
          <div>
            <label className="block font-bold">Minimum Stock</label>
            <input
              type="number"
              name="minimumStock"
              className="w-full p-1 border rounded"
              value={formData.minimumStock}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block font-bold">Maximum Stock</label>
            <input
              type="number"
              name="maximumStock"
              className="w-full p-1 border rounded"
              value={formData.maximumStock}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      <div className="bg-gray-200 p-4 rounded mb-4">
        <h2 className="font-bold mb-2 text-xl">Opening Stock Information</h2>
        <div className="grid grid-cols-5 gap-4">
          <div>
            <label className="block font-bold">Quantity</label>
            <input
              type="number"
              name="quantity"
              className="w-full p-1 border rounded"
              value={formData.quantity}
              onChange={handleQuantityChange}
            />
          </div>
          <div>
            <label className="block font-bold">Rate</label>
            <input
              type="number"
              name="rate"
              className="w-full p-1 border rounded"
              value={formData.rate}
              onChange={handleRateChange}
            />
          </div>
          <div>
            <label className="block font-bold">UOM</label>
            <input
              type="text"
              name="units"
              className="w-full p-1 border rounded"
              value={formData.units}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block font-bold">Amount</label>
            <input
              type="text"
              name="amount"
              className="w-full p-1 border rounded"
              readOnly
              value={formData.amount}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-start mt-8 px-1">
        <button
          onClick={() => setVarints(!addvarints)}
          className="bg-gray-400 text-black px-4 py-2 rounded-md mb-4 "
        >
          Add Variant
        </button>
      </div>
      {addvarints && (
        <>
          <div className="bg-gray-200 p-4 rounded mb-4">
            {options?.map((option, index) => (
              <div key={index} className="flex justify-between mb-2">
                <div className="mb-2">
                  <label className="block font-bold">items Name</label>

                  <input
                    type="text"
                    placeholder="Option Name"
                    value={option.name}
                    onChange={(e) =>
                      handleOptionChange(index, "name", e.target.value)
                    }
                    className="border rounded w-full  p-1"
                  />
                </div>
                <TagInput index={index} value={option.values} />
                <button
                  className="ml-2 mt-7 text-red-400 bg-gray-300 text-center rounded-full border border-red-400 text-3xl w-9 h-8 flex items-center justify-center"
                  onClick={() => handleRemoveOption(index)}
                >
                  <span className="mt-[-5px]">&times;</span>
                </button>
              </div>
            ))}
            <button
              onClick={handleAddOption}
              className="bg-blue-500 text-white px-3 py-1 rounded"
            >
              Add More
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full mt-4 border-collapse border border-gray-300 mb-8">
              <thead>
                <tr>
                  <th className="border border-gray-300 p-2">items</th>
                  <th className="border border-gray-300 p-2">Product Code</th>
                  <th className="border border-gray-300 p-2">Product Name</th>
                  <th className="border border-gray-300 p-2">Purchase Price</th>
                  <th className="border border-gray-300 p-2">Landing Cost</th>
                  <th className="border border-gray-300 p-2">MRP</th>
                  <th className="border border-gray-300 p-2">
                    Retail Discount
                  </th>
                  <th className="border border-gray-300 p-2">Retail Price</th>
                  <th className="border border-gray-300 p-2">Retail Margin</th>
                  <th className="border border-gray-300 p-2">
                    Wholesaler Discount
                  </th>
                  <th className="border border-gray-300 p-2">
                    Wholesaler Price
                  </th>
                  <th className="border border-gray-300 p-2">
                    Wholesaler Margin
                  </th>
                  <th className="border border-gray-300 p-2">Minimum stock</th>
                  <th className="border border-gray-300 p-2">Maximum stock</th>
                  <th className="border border-gray-300 p-2">Opening Qty</th>
                </tr>
              </thead>
              <tbody>
                {Items?.map((item, index) => (
                  <tr key={index} className="mt-1">
                    <td className="border border-gray-300 text-center pt-2 pl-1 pr-1">
                      <input
                        type="text"
                        name="variant"
                        value={item.variant}
                        className="w-full border rounded"
                        onChange={(e) => handleProductChange(index, e)}
                        readOnly
                      />
                    </td>
                    <td className="border border-gray-300">
                      <input
                        type="text"
                        className="w-full border rounded"
                        name="productCode"
                        value={item.productCode}
                        onChange={(e) => handleProductChange(index, e)}
                      />
                    </td>
                    <td className="border border-gray-300 ">
                      <input
                        type="text"
                        className="w-full border rounded"
                        name="productName"
                        value={item.productName}
                        onChange={(e) => handleProductChange(index, e)}
                      />
                    </td>
                    <td className="border border-gray-300 ">
                      <input
                        type="text"
                        className="w-full border rounded"
                        name="purchasePrice"
                        value={item.purchasePrice}
                        onChange={(e) => handleProductChange(index, e)}
                      />
                    </td>
                    <td className="border border-gray-300 ">
                      <input
                        type="text"
                        className="w-full border rounded"
                        name="landingCost"
                        value={item.landingCost}
                        onChange={(e) => handleProductChange(index, e)}
                      />
                    </td>
                    <td className="border border-gray-300">
                      <input
                        type="text"
                        className="w-full border rounded"
                        name="mrp"
                        value={item.mrp}
                        onChange={(e) => handleProductChange(index, e)}
                      />
                    </td>
                    <td className="border border-gray-300 ">
                      <input
                        type="text"
                        className="w-full border rounded"
                        name="retailDiscount"
                        value={item.retailDiscount}
                        onChange={(e) => handleProductChange(index, e)}
                      />
                    </td>
                    <td className="border border-gray-300 ">
                      <input
                        type="text"
                        className="w-full border rounded"
                        name="retailPrice"
                        value={item.retailPrice}
                        onChange={(e) => handleProductChange(index, e)}
                      />
                    </td>
                    <td className="border border-gray-300 ">
                      <input
                        type="text"
                        className="w-full border rounded"
                        name="retailMargin"
                        value={item.retailMargin}
                        onChange={(e) => handleProductChange(index, e)}
                      />
                    </td>
                    <td className="border border-gray-300 ">
                      <input
                        type="text"
                        className="w-full border rounded"
                        name="wholesalerDiscount"
                        value={item.wholesalerDiscount}
                        onChange={(e) => handleProductChange(index, e)}
                      />
                    </td>
                    <td className="border border-gray-300 ">
                      <input
                        type="text"
                        className="w-full border rounded"
                        name="wholesalerPrice"
                        value={item.wholesalerPrice}
                        onChange={(e) => handleProductChange(index, e)}
                      />
                    </td>
                    <td className="border border-gray-300 ">
                      <input
                        type="text"
                        className="w-full border rounded"
                        name="wholesaleMargin"
                        value={item.wholesaleMargin}
                        onChange={(e) => handleProductChange(index, e)}
                      />
                    </td>
                    <td className="border border-gray-300 ">
                      <input
                        type="text"
                        className="w-full border rounded"
                        name="minimumStock"
                        value={item.minimumStock}
                        onChange={(e) => handleProductChange(index, e)}
                      />
                    </td>
                    <td className="border border-gray-300 ">
                      <input
                        type="text"
                        className="w-full border rounded"
                        name="maximumStock"
                        value={item.maximumStock}
                        onChange={(e) => handleProductChange(index, e)}
                      />
                    </td>
                    <td className="border border-gray-300 ">
                      <input
                        type="text"
                        className="w-full border rounded"
                        name="openingQty"
                        value={item.openingQty}
                        onChange={(e) => handleProductChange(index, e)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
      <div className=" flex justify-end mb-5">
        <button
          className="bg-green-700 p-2 pl-10 pr-10 mt-5 text-white rounded-md flex justify-end flex-end"
          onClick={handleSubmit}
        >
          Save
        </button>
      </div>
      <ToastContainer />
    </div>
  );
};
export default CreateProduct;
