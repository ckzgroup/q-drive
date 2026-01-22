// "use client";
//
// import "leaflet/dist/leaflet.css";
// import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css";
// import "leaflet-defaulticon-compatibility";
//
// import { MapContainer as LeafletMap, Marker, Popup, TileLayer } from "react-leaflet";
// import ReactLeafletDriftMarker from "react-leaflet-drift-marker";
// import { useEffect, useRef, useState } from "react";
// import L from 'leaflet';
//
// import {
//     Sheet,
//     SheetContent,
//     SheetDescription,
//     SheetHeader,
//     SheetTitle,
//     SheetTrigger,
// } from "@/components/ui/sheet";
//
// interface MapProps {
//     position: any; // Vehicle position
//     name: string;  // Vehicle name
//     image?: any;   // Custom icon image URL
//     positionDetails?: any; // Additional vehicle details
// }
//
// export default function Map({ position, name, image, positionDetails }: MapProps) {
//     const mapRef = useRef<any>(null);
//     const [showSheet, setShowSheet] = useState(false); // State for sheet visibility
//
//     // Define the custom marker icon
//     const myIcon = new L.Icon({
//         iconUrl: image || "default-icon.png", // Default icon if no image is provided
//         iconRetinaUrl: image || "default-icon.png",
//         iconSize: [32, 32], // Icon size
//         popupAnchor: [-0, -0], // Adjust popup position relative to the icon
//     });
//
//     // Fly to the new position when it changes
//     useEffect(() => {
//         if (mapRef.current) {
//             const map = mapRef.current;
//             map.flyTo(position, 10, { duration: 1 }); // Smoothly move the map to the new position
//         }
//     }, [position]); // Effect runs whenever position changes
//
//     // Function to handle marker click and show the sheet
//     const handleMarkerClick = () => {
//         setShowSheet(true);
//     };
//
//     return (
//         <Sheet open={showSheet} onOpenChange={setShowSheet}>
//             <SheetTrigger>Open</SheetTrigger>
//             <LeafletMap
//                 ref={mapRef}
//                 center={position}
//                 zoom={10} // Adjust zoom level if necessary
//                 scrollWheelZoom={true}
//                 style={{ height: "600px", width: "100%" }}
//             >
//                 <TileLayer
//                     attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//                     url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//                 />
//
//                 {/* Use ReactLeafletDriftMarker with the custom myIcon */}
//                 <ReactLeafletDriftMarker
//                     keepAtCenter={true}
//                     position={position}
//                     duration={1000}
//                     icon={myIcon}
//                     eventHandlers={{
//                         click: handleMarkerClick, // Show sheet when the marker is clicked
//                     }}
//                 >
//                     <Popup>
//                         <h3>{name}</h3>
//                         {positionDetails && (
//                             <div>
//                                 <p>X: {positionDetails.x}</p>
//                                 <p>Y: {positionDetails.y}</p>
//                                 <p>Speed: {positionDetails.s} Km/h</p>
//                                 <p>Timestamp: {positionDetails.t}</p>
//                                 <p>Fuel: {positionDetails.f}</p>
//                                 <p>LC: {positionDetails.lc}</p>
//                                 <p>C: {positionDetails.c}</p>
//                                 <p>Z: {positionDetails.z}</p>
//                                 <p>SC: {positionDetails.sc}</p>
//                             </div>
//                         )}
//                     </Popup>
//                 </ReactLeafletDriftMarker>
//
//             </LeafletMap>
//
//             <SheetContent>
//                 <SheetHeader>
//                     <SheetTitle>{name}</SheetTitle>
//                     <SheetDescription>
//                         Vehicle Details:
//                     </SheetDescription>
//                 </SheetHeader>
//                 {positionDetails && (
//                     <div>
//                         <p>X: {positionDetails.x}</p>
//                         <p>Y: {positionDetails.y}</p>
//                         <p>Speed: {positionDetails.s} Km/h</p>
//                         <p>Timestamp: {positionDetails.t}</p>
//                         <p>Fuel: {positionDetails.f}</p>
//                         <p>LC: {positionDetails.lc}</p>
//                         <p>C: {positionDetails.c}</p>
//                         <p>Z: {positionDetails.z}</p>
//                         <p>SC: {positionDetails.sc}</p>
//                     </div>
//                 )}
//             </SheetContent>
//         </Sheet>
//     );
// }
