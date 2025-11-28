import React, { useEffect, useState } from "react";
import { ArrowLeft, Menu, PartyPopperIcon, Search, Youtube } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchCurrentUser } from "../../../redux/features/userdetailsslice";
import { setSearchQuery } from "../../../redux/features/fetchvideoslice";

function Navbar({ onToggleSidebar, onToggleMobile }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { data } = useSelector((state) => state.user);
  const [searchValue, setSearchValue] = useState("");
const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [isMobile639, setIsMobile639] = useState(false);
const [isTabletRange, setIsTabletRange] = useState(false);
  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  // useEffect(() => {
  //   const handler = setTimeout(() => {
  //     dispatch(setSearchQuery(searchValue));
  //   }, 500);
  //   return () => clearTimeout(handler);
  // }, [searchValue, data, dispatch]);

  const handleSearch = () => {
    dispatch(setSearchQuery(searchValue));
  };
  useEffect(() => {
  const handleResize = () => {
    if (window.innerWidth >= 569) {
      setMobileSearchOpen(false);
    }
  };



  window.addEventListener("resize", handleResize);
  return () => window.removeEventListener("resize", handleResize);
}, []);
useEffect(() => {
  const handleResize = () => {
    const w = window.innerWidth;

    setIsMobile639(w <= 639);
    setIsTabletRange(w <= 1310 && w > 768);
  };

  handleResize();
  window.addEventListener("resize", handleResize);
  return () => window.removeEventListener("resize", handleResize);
}, []);

  const handleUploadClick = () => {
    setShowDropdown(false);
    if (data) navigate("/upload");
    else navigate("/signup");
  };

  return (
<>
 <header
        className={`fixed top-0 left-0 w-full z-50 bg-black px-6 py-3 shadow-lg transition-all duration-300 
        ${mobileSearchOpen ? "hidden" : "flex"}
        items-center justify-between`}
      >
      <div className="flex items-center gap-3 cursor-pointer">
    <Menu
  className={`
    text-white mr-3 w-7 h-7
    ${isMobile639 ? "hidden" : ""} 
    ${isTabletRange ? "hidden" : "block"}
  `}
  onClick={() => {
    if (isMobile639) return; // no menu on mobile
    if (window.innerWidth <= 768) {
      onToggleMobile();
    } else {
      onToggleSidebar();
    }
  }}
/>

        <Youtube className="text-red-600 w-8 h-8" />
        <h1 className="text-2xl font-bold text-white tracking-wide">
          Tube<span className="text-red-600">Hub</span>
        </h1>
        <PartyPopperIcon className="text-yellow-400 w-5 h-5 animate-bounce" />
      </div>
 <div className="relative w-150 hidden md:block">
          <Search
            onClick={handleSearch}
            className="absolute right-0 top-1/2 bg-[#252525] rounded-r-full -translate-y-1/2 text-gray-400 w-16 h-10 cursor-pointer"
          />

          <input
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            type="search"
            placeholder="Search videos..."
            className="w-full border border-gray-700 text-white placeholder-gray-500 rounded-full pl-5 pr-10 py-2 outline-none focus:ring-2 focus:ring-white transition"
          />
        </div>
<div className="flex items-center justify-between ">
  
     {/* CREATE button - hide on <= 569px */}
<div className="relative max-[569px]:hidden">
  <button
    onClick={() => setShowDropdown((prev) => !prev)}
    className="bg-gray-900 mr-5 hover:bg-red-700 text-white font-semibold px-5 py-2 rounded-full transition-all duration-200 shadow-md"
  >
    Create +
  </button>

  {showDropdown && (
    <div className="absolute right-0 top-12 w-44 bg-gray-900 border border-gray-700 rounded-xl shadow-lg overflow-hidden z-50">
      <button
        onClick={handleUploadClick}
        className="block w-full text-left px-5 py-3 text-white hover:bg-red-700 transition"
      >
        Upload Video
      </button>
    </div>
  )}
</div>

<div
  onClick={() => navigate("/profile")}
  className="w-10 h-10 flex items-center justify-end rounded-full bg-red-600 
             text-white font-bold text-lg cursor-pointer hover:bg-red-700 max-[640px]:mr-4 transition 
             overflow-hidden"
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
   <Search
          className="text-white w-7 h-7 cursor-pointer md:hidden"
          onClick={() => setMobileSearchOpen(true)}
        />
</div>
     
    </header>
     {mobileSearchOpen && (
        <div className="fixed top-0 left-0 w-full h-16 bg-black flex items-center justify-between px-4 z-50">
          {/* BACK BUTTON */}
          <ArrowLeft
            className="text-white w-7 h-7 cursor-pointer"
onClick={() => {
  setMobileSearchOpen(false);
  setSearchValue("");              // clear input
  dispatch(setSearchQuery(""));    // reset search
  navigate("/");                   // go to dashboard
}}
          />

          {/* SEARCH INPUT */}
          <input
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            autoFocus
            type="search"
            placeholder="Search videos..."
            className="flex-1 mx-3 border border-gray-700 bg-black text-white placeholder-gray-500 rounded-full px-4 py-2 outline-none"
          />

          {/* SEARCH ICON */}
          <Search
            className="text-white w-7 h-7 cursor-pointer"
            onClick={handleSearch}
          />
        </div>
      )}
</>
  );
}

export default Navbar;
