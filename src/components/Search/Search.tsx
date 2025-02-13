import React, { useState, useRef, useEffect } from "react";
import { Property } from "@/types/property";
import { usePropertiesContext } from "@/contexts/PropertiesContext";
import { useSearchContext } from "@/contexts/SearchContext";
import { Search as SearchIcon } from "lucide-react";

const Search = () => {
  const { properties: data } = usePropertiesContext();
  const { setSelectedProperty } = useSearchContext();
  const [query, setQuery] = useState("");
  const [filteredResults, setFilteredResults] = useState<
    Property[] | undefined
  >();
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setSelectedProperty(undefined);
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setQuery(value);
    setIsOpen(true);

    if (value.trim() === "") {
      setSelectedProperty(undefined);
      setFilteredResults([]);
      return;
    }

    const results = data?.filter((property) =>
      property.address.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredResults(results);
  };

  const handlePropertySelect = (property: Property) => {
    setSelectedProperty(property);
    setIsOpen(false);
  };

  return (
    <div className="p-4 w-full max-w-md relative" ref={searchRef}>
      <div className="relative">
        <input
          type="text"
          placeholder="Search by address..."
          value={query}
          onChange={handleSearch}
          className="w-full p-2 pr-10 bg-white border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          onFocus={() => setIsOpen(true)}
        />
        <SearchIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
      </div>
      {query && isOpen && (
        <div className="absolute top-full left-0 right-0 z-10 bg-white border rounded-md shadow-md max-h-48 overflow-y-auto">
          {filteredResults && filteredResults.length > 0 ? (
            <ul>
              {filteredResults.map((property, index) => (
                <li
                  key={index}
                  className="p-2 border-b last:border-none hover:bg-gray-100 cursor-pointer"
                  onClick={() => handlePropertySelect(property)}
                >
                  <div className="text-sm font-medium">{property.address}</div>
                  <div className="text-xs text-gray-500">
                    {property.price} USD - {property.bedrooms} Beds,{" "}
                    {property.bathrooms} Baths
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-2 text-sm text-gray-500">
              No search results found
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Search;
