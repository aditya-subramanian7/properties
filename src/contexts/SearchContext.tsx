"use client";
import { Property } from "@/types/property";
import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
} from "react";
import { JSX } from "react";
import { Dispatch, SetStateAction } from "react";

interface SearchContextType {
  selectedProperty: Property | undefined;
  setSelectedProperty: Dispatch<SetStateAction<Property | undefined>>;
}

export const SearchContext = createContext<SearchContextType | undefined>(
  undefined
);

export const useSearchContext = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error(
      "usePropertiesContext must be used within a PropertiesProvider"
    );
  }
  return context;
};

interface SearchProviderProps {
  children: ReactNode;
}

export function SearchProvider({ children }: SearchProviderProps): JSX.Element {
  const [selectedProperty, setSelectedProperty] = useState<
    Property | undefined
  >();

  return (
    <>
      <SearchContext.Provider value={{ selectedProperty, setSelectedProperty }}>
        {children}
      </SearchContext.Provider>
    </>
  );
}
