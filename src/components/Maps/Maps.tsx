"use client";

import { GeoCoordinates } from "@/app/page";
import { useSearchContext } from "@/contexts/SearchContext";
import { Loader } from "@googlemaps/js-api-loader";
import { useEffect, useRef } from "react";

interface MapProps {
  coordinatesArray: GeoCoordinates[];
}

export function Map({ coordinatesArray }: MapProps) {
  const mapRef = useRef(null);

  const { selectedProperty } = useSearchContext();

  useEffect(() => {
    const initMap = async () => {
      const loader = new Loader({
        apiKey: "AIzaSyDndsHMUBYFq8mG9b3DiExOXsuYTM-dY3U", //TODO: try to change this to env later
        version: "weekly",
      });

      const { Map } = await loader.importLibrary("maps");

      const { AdvancedMarkerElement } = await loader.importLibrary("marker");

      const positions = coordinatesArray;

      // map options
      const mapOptions: google.maps.MapOptions = {
        center: coordinatesArray[0],
        zoom: 10,
        mapId: "NEXT_MAP",
      };

      //   setup the new map
      const map = new Map(mapRef.current!, mapOptions);

      //add a marker for each position
      positions.forEach((position) => {
        new AdvancedMarkerElement({
          map,
          position: position,
        });
      });
    };

    initMap();
  }, [coordinatesArray]);

  return <div style={{ height: "600px" }} ref={mapRef} />;
}
