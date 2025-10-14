import BarChart from "../components/Barchart";
import PieChart from "../components/PieChart";
import { useState, useEffect } from "react";
import { useOrderData } from "../hooks/useOrderData.js";
import { useTopSoldProduct } from "../hooks/useTopSellingProducts.js.js";
import { useTopSearchingProduct } from "../hooks/useTopSearchingProduct.js";
import { ChevronDownIcon } from "lucide-react";

function Report() {
  const API_URL = import.meta.env.VITE_API_URL;

  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState(false);
  const [dailySales, setDailySales] = useState(false);
  const [dailySalesReport, setDailySalesReport] = useState(false);

  const [startDate, setStartDate] = useState("2025-10-09");
  const [endDate, setEndDate] = useState("2025-10-15");

  const { orderData } = useOrderData(startDate, endDate);
  const { topSoldProduct } = useTopSoldProduct(startDate, endDate);
  const { searchedProduct } = useTopSearchingProduct(startDate, endDate);

  useEffect(() => {
    const fetchProduct = async () => {
      setError("");
      setData(null);

      try {
        const response = await fetch(
          `${API_URL}/api/v1/orders/order-status?startDate=${startDate}&endDate=${endDate}`
        );

        const data = await response.json();
        console.log(data);

        if (!response.ok) {
          throw new Error(data.message);
        }

        setData(data.data);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchProduct();
  }, [startDate, endDate]);

  const handleExportDailyOrdersSales = (type) => {
    setDailySalesReport(false);

    const url =
      type === "excel"
        ? `${API_URL}/api/v1/orders/order-product/export?startDate=${startDate}&endDate=${endDate}`
        : `${API_URL}/api/v1/orders/report-pdf/export?startDate=${startDate}&endDate=${endDate}`;

    window.open(url, "_blank");
  };

  const handleExportDailySelling = (type) => {
    setDailySales(false);

    const url =
      type === "excel"
        ? `${API_URL}/api/v1/orders/daily-selling/export?startDate=${startDate}&endDate=${endDate}`
        : `${API_URL}/api/v1/orders/daily-selling/export-pdf?startDate=${startDate}&endDate=${endDate}`;

    window.open(url, "_blank");
  };

  const handleExportTopSelling = (type) => {
    setOpen(false);

    const url =
      type === "excel"
        ? `${API_URL}/api/v1/orders/top-selling/export?startDate=${startDate}&endDate=${endDate}`
        : `${API_URL}/api/v1/orders/top-selling/export-pdf?startDate=${startDate}&endDate=${endDate}`;

    window.open(url, "_blank");
  };

  const handleExportTopSearch = (type) => {
    setSearch(false);

    const url =
      type === "excel"
        ? `${API_URL}/api/v1/searches/top-search/export?startDate=${startDate}&endDate=${endDate}`
        : `${API_URL}/api/v1/searches/top-search/export-pdf?startDate=${startDate}&endDate=${endDate}`;

    window.open(url, "_blank");
  };

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-wrap items-center justify-between">
          <div className="flex items-center space-x-2">
            <h1 className="text-lg font-semibold font-serif">
              Sales Analytics Dashboard
            </h1>
          </div>

          {/* Date + Button */}
          <div className="flex items-center">
            {/* Date Range */}
            <div className="flex items-center gap-x-2 px-3 py-2 ">
              <div className="flex flex-col text-xs text-gray-600">
                <label>Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="border rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>
              <span className="text-gray-400 mt-3 px-1">–</span>
              <div className="flex flex-col text-xs text-gray-600">
                <label>End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="border rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>
            </div>

            {/* Generate Report Button */}
            <div className="relative inline-block mt-4 text-left">
              {/* Export Button */}
              <button
                onClick={() => setDailySalesReport((prev) => !prev)}
                className="px-4 py-2 text-sm font-medium text-white bg-black hover:bg-blue-700 rounded-sm flex items-center gap-2"
              >
                Generate Report
                <ChevronDownIcon size={16} />
              </button>

              {/* Dropdown Menu */}
              {dailySalesReport && (
                <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                  <button
                    onClick={() => handleExportDailyOrdersSales("excel")}
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                  >
                    Export as Excel
                  </button>
                  <button
                    onClick={() => handleExportDailyOrdersSales("pdf")}
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                  >
                    Export as PDF
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* product Status */}
      <div className="max-w-7xl grid grid-cols-3  mx-auto gap-4 text-black font-serif mb-4">
        <div className="bg-white/80 shadow-md rounded-md p-4 flex flex-col justify-between">
          <div className="flex items-center mb-2 ">
            <span className="text-sm font-semibold">$</span>
          </div>
          <div className="text-right">
            <p className="font-semibold ">{data?.totalSales}</p>
            <p className="text-xs ">Total Orders</p>
          </div>
        </div>
        <div className="bg-white shadow-md rounded-md p-4 flex flex-col justify-between">
          <div className="flex items-center mb-2">
            <span className="text-sm font-semibold">$</span>
          </div>
          <div className="text-right">
            <p className="font-semibold ">
              {data?.averageOrderValue.toFixed(2)}
            </p>
            <p className="text-xs ">Average Order Value</p>
          </div>
        </div>
        <div className="bg-white shadow-md rounded-md p-4 flex flex-col justify-between">
          <div className="flex items-center mb-2">
            <span className="text-sm font-semibold">$</span>
          </div>
          <div className="text-right">
            <p className="font-semibold ">{data?.totalRevenue}</p>
            <p className="text-xs ">Total Revenue</p>
          </div>
        </div>
        {/* <div className="bg-white shadow-md rounded-md p-4 flex flex-col justify-between">
              <div className="flex items-center mb-2">
                <i className="fa-solid fa-id-card-clip"></i>
              </div>
              <div className="text-right">
                <p className="font-semibold ">{user}</p>
                <p className="text-xs ">Total User</p>
              </div>
            </div> */}
      </div>

      {/* bar chart  */}
      <div className="w-full">
        <BarChart orderData={orderData} />
      </div>

      {/* sales report */}
      <div className=" max-w-7xl gap-x-5 flex mx-auto mt-5">
        {/* daily sales report  */}
        <div className=" bg-white shadow-lg rounded-md p-4 w-[630px]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">
                Daily Sales Report
              </h2>
              <p className="text-sm text-gray-500">
                Jun 01, 2023 – Jun 07, 2023
              </p>
            </div>
            <div className="relative inline-block text-left">
              {/* Export Button */}
              <button
                onClick={() => setDailySales((prev) => !prev)}
                className="px-4 py-2 text-sm font-medium text-white bg-black hover:bg-blue-700 rounded-sm flex items-center gap-2"
              >
                Export
                <ChevronDownIcon size={16} />
              </button>

              {/* Dropdown Menu */}
              {dailySales && (
                <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                  <button
                    onClick={() => handleExportDailySelling("excel")}
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                  >
                    Export as Excel
                  </button>
                  <button
                    onClick={() => handleExportDailySelling("pdf")}
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                  >
                    Export as PDF
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200 rounded-lg">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-2 px-4 text-left text-sm font-medium text-gray-600 border-b border-gray-200">
                    Date
                  </th>
                  <th className="py-2 px-4 text-right text-sm font-medium text-gray-600 border-b border-gray-200">
                    Total Sales
                  </th>
                  <th className="py-2 px-4 text-right text-sm font-medium text-gray-600 border-b border-gray-200">
                    Revenue
                  </th>
                </tr>
              </thead>
              <tbody>
                {orderData?.data.map((item) => (
                  <tr key={item.date} className="hover:bg-gray-50">
                    <td className="py-2 px-4 text-sm text-gray-700 border-b border-gray-200">
                      {item.date}
                    </td>
                    <td className="py-2 px-4 text-sm text-right text-gray-700 border-b border-gray-200">
                      {item.totalSales}
                    </td>
                    <td className="py-2 px-4 text-sm text-right text-gray-700 border-b border-gray-200">
                      {item.totalRevenue}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary Section */}
          <div className="flex items-center justify-between mt-4 text-sm text-gray-700">
            <p>
              <span className="font-semibold">Total Sales:</span>{" "}
              {data?.totalSales}
              <br />
              <span className="text-gray-500 text-xs">For selected period</span>
            </p>
            <p className="text-right">
              <span className="font-semibold">Total Revenue:</span>
              {data?.totalRevenue.toLocaleString()}
              <br />
              <span className="text-gray-500 text-xs">For selected period</span>
            </p>
          </div>
        </div>

        {/* TODO: pie chart  */}
        <div className=" bg-white shadow-lg rounded-md p-4 w-[630px]">
          <PieChart data={topSoldProduct} />
        </div>
      </div>

      {/* top product sold */}
      <div className=" max-w-7xl gap-x-5 flex mx-auto mt-5">
        {/* top daily product sales report  */}
        <div className=" bg-white shadow-lg rounded-md p-4 w-[630px]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">
                Top 10 Selling Products
              </h2>
            </div>

            <div className="relative inline-block text-left">
              {/* Export Button */}
              <button
                onClick={() => setOpen((prev) => !prev)}
                className="px-4 py-2 text-sm font-medium text-white bg-black hover:bg-blue-700 rounded-sm flex items-center gap-2"
              >
                Export
                <ChevronDownIcon size={16} />
              </button>

              {/* Dropdown Menu */}
              {open && (
                <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                  <button
                    onClick={() => handleExportTopSelling("excel")}
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                  >
                    Export as Excel
                  </button>
                  <button
                    onClick={() => handleExportTopSelling("pdf")}
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                  >
                    Export as PDF
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200 rounded-lg">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-2 px-4 text-left text-sm font-medium text-gray-600 border-b border-gray-200">
                    Product
                  </th>
                  <th className="py-2 px-4 text-right text-sm font-medium text-gray-600 border-b border-gray-200">
                    Sales
                  </th>
                  <th className="py-2 px-4 text-right text-sm font-medium text-gray-600 border-b border-gray-200">
                    Revenue
                  </th>
                </tr>
              </thead>
              <tbody>
                {topSoldProduct?.data.map((item) => (
                  <tr key={item.productId} className="hover:bg-gray-50">
                    <td className="py-2 px-4 text-sm text-gray-700 border-b border-gray-200">
                      {item.product.name}
                    </td>
                    <td className="py-2 px-4 text-sm text-right text-gray-700 border-b border-gray-200">
                      {item.totalQuantity}
                    </td>
                    <td className="py-2 px-4 text-sm text-right text-gray-700 border-b border-gray-200">
                      {item.totalRevenue}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* top searched report  */}
        <div className=" bg-white shadow-lg rounded-md p-4 w-[630px]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">
                Top 10 Searched Products
              </h2>
            </div>
            <div className="relative inline-block text-left">
              {/* Export Button */}
              <button
                onClick={() => setSearch((prev) => !prev)}
                className="px-4 py-2 text-sm font-medium text-white bg-black hover:bg-blue-700 rounded-sm flex items-center gap-2"
              >
                Export
                <ChevronDownIcon size={16} />
              </button>

              {/* Dropdown Menu */}
              {search && (
                <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                  <button
                    onClick={() => handleExportTopSearch("excel")}
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                  >
                    Export as Excel
                  </button>
                  <button
                    onClick={() => handleExportTopSelling("pdf")}
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                  >
                    Export as PDF
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200 rounded-lg">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-2 px-4 text-left text-sm font-medium text-gray-600 border-b border-gray-200">
                    Product
                  </th>
                  <th className="py-2 px-4 text-right text-sm font-medium text-gray-600 border-b border-gray-200">
                    Searches
                  </th>
                </tr>
              </thead>
              <tbody>
                {searchedProduct?.data.map((item) => (
                  <tr key={item.productId} className="hover:bg-gray-50">
                    <td className="py-2 px-4 text-sm text-gray-700 border-b border-gray-200">
                      {item.product.name}
                    </td>
                    <td className="py-2 px-4 text-sm text-right text-gray-700 border-b border-gray-200">
                      {item.searchCount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Report;
