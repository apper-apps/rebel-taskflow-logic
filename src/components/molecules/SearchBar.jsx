import React, { useState } from "react";
import { motion } from "framer-motion";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";

const SearchBar = ({ 
  placeholder = "Search...", 
  onSearch, 
  onClear,
  className = "",
  showClearButton = true 
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchTerm);
    }
  };

  const handleClear = () => {
    setSearchTerm("");
    if (onClear) {
      onClear();
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className={`flex items-center space-x-2 ${className}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex-1">
        <Input
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          icon="Search"
          iconPosition="left"
          className="w-full"
        />
      </div>
      
      {showClearButton && searchTerm && (
        <Button
          type="button"
          variant="ghost"
          onClick={handleClear}
          icon="X"
          size="sm"
        />
      )}
    </motion.form>
  );
};

export default SearchBar;