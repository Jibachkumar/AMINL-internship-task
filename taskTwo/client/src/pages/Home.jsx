import { useEffect, useState } from "react";
import Input from "../components/Button";
import { useNavigate } from "react-router-dom";
import { ChevronDownIcon } from "lucide-react";

function Home() {
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  const button = ["electronics", "clothes"];

  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(10);
  const [error, setError] = useState("");
  const [openCategories, setOpenCategories] = useState(false);

  const [order, setOrder] = useState("DESc");
  const [sortedByPrice, setSortedByPrice] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [category, setCategory] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleCategory = (btn) => {
    setCategory(btn);
    setPage(1);
    setSearchInput("");
    setError("");
    setSearch("");
  };

  const handleSearch = () => {
    setError("");
    setCategory("");
    setSearch(searchInput);
  };

  useEffect(() => {
    const fetchProduct = async () => {
      setError("");

      try {
        const response = await fetch(
          `${API_URL}/api/v1/products/view-product?page=${page}&limit=${limit}&search=${search}&category=${category}&sortBy=${sortedByPrice}&order=${order}&minPrice=${minPrice}&maxPrice=${maxPrice}&startDate=${startDate}&endDate=${endDate}`
        );

        const data = await response.json();
        console.log(data);

        if (!response.ok) {
          throw new Error(data.message);
        }

        setProducts(data.products);
        setTotalPages(data.totalPages);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchProduct();
  }, [
    page,
    limit,
    order,
    minPrice,
    maxPrice,
    search,
    category,
    sortedByPrice,
    startDate,
    endDate,
  ]);

  const handleAddTOCard = (product) => {
    navigate("/addtocard", { state: { product } });
  };

  return (
    <div className="text-black">
      <h2 className="font-bold font-serif text-xl text-center pt-10">
        The leading ecommerce platform for global trade
      </h2>

      {/*search  */}
      <div className="max-w-5xl flex mx-auto">
        {/* filter by category */}
        <div className="relative inline-block text-left">
          {/* Export Button */}
          <button
            onClick={() => setOpenCategories((prev) => !prev)}
            className="px-2 py-2 text-sm font-medium text-black border border-black/35 rounded-sm flex items-center gap-2"
          >
            Categories
            <ChevronDownIcon size={16} />
          </button>

          {/* Dropdown Menu */}
          {openCategories && (
            <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-10 flex flex-col">
              {button.map((btn, i) => (
                <button
                  onClick={() => {
                    setOpenCategories(false);
                    handleCategory(btn);
                  }}
                  key={i}
                  className="font-semibold text-sm border-b last:border-b-0 border-gray-200 px-4 py-2 text-gray-700 hover:bg-orange-100 hover:text-orange-700 cursor-pointer transition"
                >
                  {btn}
                </button>
              ))}
            </div>
          )}
        </div>

        <Input
          value={searchInput}
          placeholder="Search e-commerce"
          onChange={setSearchInput}
          className="w-full border border-black/35 rounded-md placeholder:pl-2"
        />
        <button
          onClick={handleSearch}
          className="bg-black text-white px-2 rounded-sm shadow-sm"
        >
          search
        </button>
      </div>

      {/* Price / Date / Sort Inputs */}
      <div className="max-w-6xl mx-auto mt-5 flex gap-3 flex-wrap justify-center">
        <input
          type="number"
          placeholder="Min Price"
          value={minPrice}
          onChange={(e) => setMinPrice(+e.target.value)}
          className="border px-2 py-1 rounded-md"
        />
        <input
          type="number"
          placeholder="Max Price"
          value={maxPrice}
          onChange={(e) => setMaxPrice(+e.target.value)}
          className="border px-2 py-1 rounded-md"
        />
        <input
          type="date"
          placeholder="Start Date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="border px-2 py-1 rounded-md"
        />
        <input
          type="date"
          placeholder="End Date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="border px-2 py-1 rounded-md"
        />
        <select
          value={sortedByPrice}
          onChange={(e) => setSortedByPrice(e.target.value)}
          className="border px-2 py-1 rounded-md"
        >
          <option value="createdAt">Newest</option>
          <option value="price">Price</option>
        </select>
        <select
          value={order}
          onChange={(e) => setOrder(e.target.value)}
          className="border px-2 py-1 rounded-md"
        >
          <option value="DESC">DESC</option>
          <option value="ASC">ASC</option>
        </select>
      </div>

      {/* cards  */}
      <div className="max-w-6xl mx-auto pl-8">
        {error && <p className="text-red-500 text-center mt-5">{error}</p>}
        <div className="grid grid-cols-5 mt-10 gap-5">
          {products.map((product) => (
            <div
              key={product.id}
              className="w-[170px] overflow-hidden border border-slate-300"
              onClick={() => handleAddTOCard(product)}
            >
              {" "}
              <img
                src={product.productImage.url}
                alt={product.productImage.public_id}
                className="object-cover w-[170px] h-[230px]"
              />{" "}
              <h3 className="mt-2 text-sm font-medium text-center line-clamp-2">
                {product.name}
              </h3>
              <div className="text-center">
                <span className="text-orange-600 font-semibold">
                  Price: Rs.{product.price}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination button */}
        {totalPages > 1 && (
          <div className="w-2xl flex mx-auto justify-between">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className={`px-3 py-1 rounded-md shadow-md transition-all duration-300 bg-white
                  ${
                    page === 1
                      ? "cursor-not-allowed opacity-50"
                      : " hover:scale-105"
                  }`}
            >
              Prev
            </button>

            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
              className={`px-3 py-1 rounded-md shadow-md transition-all duration-300 bg-white
                  ${
                    page === totalPages
                      ? "cursor-not-allowed opacity-50"
                      : " hover:scale-105"
                  }`}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
