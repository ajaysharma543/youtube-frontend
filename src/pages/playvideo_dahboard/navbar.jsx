import React, { useEffect, useState } from "react";
import { Menu, PartyPopperIcon, Search, Youtube } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchCurrentUser } from "../../redux/features/userdetailsslice";
import { setSearchQuery } from "../../redux/features/fetchvideoslice";

function Navbar({ setCollapse }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { data } = useSelector((state) => state.user);
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  useEffect(() => {
    const handler = setTimeout(() => {
      dispatch(setSearchQuery(searchValue));
    }, 500);
    return () => clearTimeout(handler);
  }, [searchValue, data, dispatch]);

  const handleUploadClick = () => {
    setShowDropdown(false);
    if (data) navigate("/upload");
    else navigate("/signup");
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 flex items-center justify-between bg-gradient-to-r from-black via-gray-900 to-black px-6 py-3 shadow-lg border-b border-gray-800">
      <div className="relative flex items-center gap-3">
        <Menu
          className="text-white w-7 h-7 cursor-pointer absolute left-0 top-1/2 -translate-y-1/2 z-50"
          onClick={() => setCollapse((prev) => !prev)}
        />

        <div className="flex items-center gap-3 pl-12">
          <Youtube className="text-red-600 w-8 h-8" />
          <h1 className="text-2xl font-bold text-white tracking-wide">
            Tube<span className="text-red-600">Hub</span>
          </h1>
          <PartyPopperIcon className="text-yellow-400 w-5 h-5 animate-bounce" />
        </div>
      </div>
      <div className="relative w-72 hidden md:block">
        <Search className="absolute right-3 top-2.5 text-gray-400 w-5 h-5" />
        <input
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          type="search"
          placeholder="Search videos..."
          className="w-full bg-gray-900 text-white placeholder-gray-500 rounded-full pl-5 pr-10 py-2 outline-none focus:ring-2 focus:ring-red-600 transition"
        />
      </div>

      <div className="flex items-center gap-4 relative">
        <button
          onClick={() => setShowDropdown((prev) => !prev)}
          className="bg-gray-900 max-[640px]:hidden hover:bg-red-700 text-white font-semibold px-5 py-2 rounded-full transition-all duration-200 shadow-md"
        >
          Create +
        </button>

        {showDropdown && (
          <div className="absolute right-0 top-12 w-44 bg-gray-900 border border-gray-700 rounded-xl shadow-lg overflow-hidden animate-fadeIn z-50">
            <button
              onClick={handleUploadClick}
              className="block w-full text-left px-5 py-3 text-white hover:bg-red-700 transition"
            >
              Upload Video
            </button>
          </div>
        )}

        {/* Avatar */}
        <div
          onClick={() => navigate("/profile")}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-red-600 text-white font-bold text-lg cursor-pointer hover:bg-red-700 transition overflow-hidden"
        >
          {data?.avatar?.url ? (
            <img
              src={data.avatar.url}
              alt="Profile"
              className="w-full h-full object-cover rounded-full"
            />
          ) : (
            <span>
              {data?.fullname ? data.fullname.charAt(0).toUpperCase() : "?"}
            </span>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
