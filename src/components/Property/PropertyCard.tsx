"use client";
import React, { useEffect, useRef, useState } from "react";
import { Property } from "@/types/property";
import Image from "next/image";
import { Edit, XIcon } from "lucide-react";
import db from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { usePropertiesContext } from "@/contexts/PropertiesContext";

interface PropertyCardProps {
  property: Property;
  isHighlited: boolean;
}

const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  isHighlited,
}) => {
  // Local state for editing mode and address value
  const [isEditing, setIsEditing] = useState(false);
  const [currentAddress, setCurrentAddress] = useState(property.address);
  const [editedAddress, setEditedAddress] = useState(property.address);

  // Ref for the container that holds the input & save button
  const editContainerRef = useRef<HTMLDivElement>(null);

  const { fetchProperties } = usePropertiesContext();

  // Outside click handler to cancel editing if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isEditing &&
        editContainerRef.current &&
        !editContainerRef.current.contains(event.target as Node)
      ) {
        // Reset the edited address back to the current address and exit editing mode
        setEditedAddress(currentAddress);
        setIsEditing(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isEditing, currentAddress]);

  // Function to handle save action and update the data
  const handleSave = async () => {
    setCurrentAddress(editedAddress);
    setIsEditing(false);

    await lookupAndEditAddress(editedAddress);
    // TODO: If needed, update the data externally via a callback or API call here.
  };

  const lookupAndEditAddress = async (address: string) => {
    // call the coordinates API and check if valid location
    const apiKey = "AIzaSyDndsHMUBYFq8mG9b3DiExOXsuYTM-dY3U";

    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        address
      )}&key=${apiKey}`
    );

    //if valid
    if (response.ok || response.status === 200 || response.status === 201) {
      try {
        //look it up in db and update
        const id: string = property.id;
        await setDoc(
          doc(db, "Property", id),
          { ...property, address: editedAddress },
          { merge: true }
        );

        console.log("updated doc");

        // refetch the data after updating it
        await fetchProperties();
      } catch (err) {
        // reset address on failure to update
        setEditedAddress(property.address);
        console.error(err);
        return;
      }
    }
  };

  return (
    <div className="max-w-sm rounded overflow-hidden shadow-lg">
      <Image
        className="w-full h-48 object-cover"
        width={100}
        height={100}
        src={property.imageUrl}
        alt={currentAddress} // Using currentAddress for alt text
      />
      <div className={`${isHighlited?"bg-blue-200":""} px-6 py-4`}>
        <div className={`flex justify-between font-bold text-lg mb-1`}>
          ₹{property.price.toLocaleString()}
          <span
            className="p-1 hover:bg-slate-200 rounded-lg cursor-pointer tooltip"
            data-tip="Edit"
            onClick={(e) => {
              e.stopPropagation();
              // Activate editing mode when clicking the edit icon
              setIsEditing(true);
              setEditedAddress(currentAddress);
            }}
          >
            {!isEditing ? <Edit /> : <XIcon />}
          </span>
        </div>
        {/* If editing, display the input field and save button; otherwise show the address */}
        <div ref={editContainerRef}>
          {isEditing ? (
            <div className="flex flex-col gap-1">
              <input
                type="text"
                value={editedAddress}
                onChange={(e) => setEditedAddress(e.target.value)}
                className="border bg-white border-gray-300 rounded p-1"
              />
              <button
                onClick={handleSave}
                className="mt-2 w-1/4 mx-auto bg-blue-500 text-white rounded px-2 py-1"
              >
                Save
              </button>
            </div>
          ) : (
            <p className="text-black/40 text-base min-h-20">{currentAddress}</p>
          )}
        </div>
        <ul className="">
          <li>{property.bedrooms} Beds</li>
          <li>{property.bathrooms} Baths</li>
          <li>{property.size.toLocaleString()} Sq.Ft.</li>
        </ul>
      </div>
    </div>
  );
};

export default PropertyCard;
