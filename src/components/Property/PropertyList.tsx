import React, { useEffect, useRef } from "react";
import PropertyCard from "./PropertyCard";
import { Property } from "@/types/property";
import { useSearchContext } from "@/contexts/SearchContext";

interface PropertyListProps {
  properties: Property[] | undefined;
}

const PropertyList: React.FC<PropertyListProps> = ({ properties }) => {
  const { selectedProperty } = useSearchContext();
  const selectedRef = useRef<HTMLDivElement>(null);

  // Scroll to the selected property when it changes
  useEffect(() => {
    if (selectedProperty && selectedRef.current) {
      selectedRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [selectedProperty]);

  return (
    <div className="container mx-auto px-4">
      <div className="flex flex-wrap -mx-4">
        {properties ? (
          properties.map((property) => (
            <div
              key={property.id}
              // Attach the ref only if this is the selected property
              ref={
                selectedProperty && property.id === selectedProperty.id
                  ? selectedRef
                  : null
              }
              className="w-full sm:w-full md:w-1/2 px-4 mb-8"
            >
              <PropertyCard
                isHighlited={
                  selectedProperty && property.id === selectedProperty.id
                }
                property={property}
              />
            </div>
          ))
        ) : (
          <div>Loading...</div>
        )}
      </div>
    </div>
  );
};

export default PropertyList;
