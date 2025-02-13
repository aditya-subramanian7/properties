"use client";

import { GeoCoordinates } from "@/app/page";
import { Loader } from "@googlemaps/js-api-loader";
import { useEffect, useRef } from "react";

interface MapProps {
  coordinatesArray: GeoCoordinates[];
}

export function Map({ coordinatesArray }: MapProps) {
  const mapRef = useRef(null);

  console.log(coordinatesArray,"coordinates")

  useEffect(() => {
    const initMap = async () => {
      const loader = new Loader({
        apiKey: "AIzaSyDndsHMUBYFq8mG9b3DiExOXsuYTM-dY3U", //TODO: try to change this to env later
        version: "weekly",
      });

      const { Map } = await loader.importLibrary("maps");

      const { AdvancedMarkerElement } = await loader.importLibrary("marker");

      const positions = coordinatesArray;

      const centerPosition:GeoCoordinates = {
        lat: 34.1540,
        lng:-118.6474
      }

      // map options
      const mapOptions: google.maps.MapOptions = {
        center: centerPosition,
        zoom: 10,
        mapId: "NEXT_MAP",
      };

      //   setup the new map
      const map = new Map(mapRef.current!, mapOptions);

      //add a marker for each position
      positions.forEach((position) => {
        const marker = new AdvancedMarkerElement({
          map,
          position: position,
        });
      });
    };

    initMap();
  }, [coordinatesArray]);

  return <div style={{ height: "600px" }} ref={mapRef} />;
}
