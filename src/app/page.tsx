"use client";
import PropertyList from "@/components/Property/PropertyList";
import { useEffect, useState } from "react";
import { Property } from "@/types/property";
import Search from "@/components/Search/Search";
// import { Settings } from "lucide-react";
// import FilterModal from "@/components/Filter/FilterModal";
import { Map } from "@/components/Maps/Maps";
import { usePropertiesContext } from "@/contexts/PropertiesContext";
import { useSearchContext } from "@/contexts/SearchContext";
export interface GeoCoordinates {
  lat: number;
  lng: number;
}

export default function Home() {
  // const [properties, setProperties] = useState<Property[] | undefined>();
  // const [filtersApplied, setFiltersApplied] = useState<string[]>();
  // const [showFilterModal, setShowFilterModal] = useState<boolean>(false);
  const [coordinatesArray, setCoordinatesArray] = useState<GeoCoordinates[]>();

  const [showMap, setShowMap] = useState<boolean>();

  // context
  const { properties, fetchProperties } = usePropertiesContext();
  const { selectedProperty } = useSearchContext();

  //get the coordinates of all our addresses
  const getSingleCoordinate = async (
    location: Property
  ): Promise<GeoCoordinates> => {
    const apiKey = "AIzaSyDndsHMUBYFq8mG9b3DiExOXsuYTM-dY3U";
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        location.address
      )}&key=${apiKey}`
    );

    const { results } = await response.json();
    return results[0].geometry.location as GeoCoordinates;
  };

  const fetchCoordinates = async (properties: Property[]) => {
    const results = await Promise.all(
      properties.map((property) => getSingleCoordinate(property))
    );

    setCoordinatesArray(results);
  };

  const toggleMapState = () => {
    setShowMap((prev) => !prev);
  };

  useEffect(() => {
    // get all property data
    fetchProperties();
  }, []);

  useEffect(() => {
    // dont run for empty properties
    if (!properties || properties.length === 0) {
      return;
    }

    fetchCoordinates(properties);

    console.log("refetched coordinates for map");
  }, [properties]);

  useEffect(() => {
    if (selectedProperty !== null && selectedProperty !== undefined) {
      const x = [selectedProperty];
      fetchCoordinates(x);

      console.log("Property delected and map refetched");
    }else{
      fetchCoordinates(properties);
    }
  }, [selectedProperty]);

  return (
    <div className="flex flex-col gap-2 md:p-10 py-3">
      <button
        onClick={toggleMapState}
        className="btn md:hidden text-white border w-1/2 mx-auto"
      >
        {!showMap ? "Show Map" : "Show Places"}
      </button>
      {/* Search bar ----- filters */}
      <div className="flex flex-row gap-2 items-center">
        <Search />
        {/* <div
          onClick={() => setShowFilterModal(true)}
          className="cursor-pointer hover:bg-slate-300/35 hover:rounded-full p-1"
        >
          <Settings />
        </div> */}
      </div>

      {/* left property section ----- right map view section */}

      <div className="flex w-full" style={{ height: "calc(100vh - 160px)" }}>
        {/* Left property section */}
        {
          <div className="md:w-3/5 w-full h-full md:pr-4 overflow-y-auto">
            {" "}
            {!showMap
              ? properties && <PropertyList properties={properties} />
              : coordinatesArray && (
                  <div className="px-4">
                    <Map coordinatesArray={coordinatesArray} />
                  </div>
                )}
          </div>
        }

        {/* Right map section */}
        <div className="md:w-2/5 hidden md:block w-full h-full">
          {" "}
          {/* Added h-full */}
          {coordinatesArray && <Map coordinatesArray={coordinatesArray} />}
        </div>
      </div>

      {/* {showFilterModal && (
        <FilterModal
          setFilters={setFiltersApplied}
          setShowFilterModal={setShowFilterModal}
          filters={filtersApplied}
        />
      )} */}
    </div>
  );
}
