"use client";
import { Property } from "@/types/property";
import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  // useEffect,
} from "react";
import { collection, getDocs } from "firebase/firestore";
import db from "../lib/firebase";
import { JSX } from "react";
import { Dispatch, SetStateAction } from "react";

interface Filter {
  type: string;
  value: string;
}

interface PropertyContextType {
  properties: Property[];
  fetchProperties: () => Promise<void>;
  setProperties: Dispatch<SetStateAction<Property[]>>;
  filters: Filter[] | undefined;
  setFilters: Dispatch<SetStateAction<Filter[] | undefined>>;
}

export const PropertiesContext = createContext<PropertyContextType | undefined>(
  undefined
);

export const usePropertiesContext = () => {
  const context = useContext(PropertiesContext);
  if (!context) {
    throw new Error(
      "usePropertiesContext must be used within a PropertiesProvider"
    );
  }
  return context;
};

interface PropertiesProviderProps {
  children: ReactNode;
}

export function PropertiesProvider({
  children,
}: PropertiesProviderProps): JSX.Element {
  const [properties, setProperties] = useState<Property[]>([]);
  const [filters, setFilters] = useState<Filter[]>();

  const fetchProperties = async (): Promise<void> => {
    const querySnapshot = await getDocs(collection(db, "Property"));
    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    console.log(data);

    setProperties(data as Property[]);
  };

  // useEffect(() => {
  //   // You can add filter logic here when filters change
  //   if (filters && filters.length > 0) {
  //     // Example of how you might filter properties based on the new filter structure
  //   }
  // }, [filters]);

  return (
    <PropertiesContext.Provider
      value={{
        properties,
        filters,
        setFilters,
        setProperties,
        fetchProperties,
      }}
    >
      {children}
    </PropertiesContext.Provider>
  );
}