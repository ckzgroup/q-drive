// "use client";
//
// import React, { Component } from "react";
// import dynamic from "next/dynamic";
// import Image from "next/image";
//
//
//
// // @ts-ignore
// const LazyMap = dynamic(() => import("@/components/Map"), {
//     ssr: false,
//     loading: () => <p>Loading...</p>,
// });
//
// /* global wialon */
// declare var wialon: any;
//
// function msg(msg: string) {
//     console.log(msg);
// }
//
// const defaultProps = {
//     center: {
//         lat: 10.99835602,
//         lng: 77.01502627
//     },
//     zoom: 11
// };
//
// export default class WialonIntegration extends Component<{}, { token: string, isAuthorized: boolean, units: any[], selectedUnitId: string | null }> {
//     constructor(props: {}) {
//         super(props);
//
//         this.state = {
//             token: "5c3a2b4ff918ce208fe5e165f6d58e30B38F270BCDC40AD1D93206B7A86164F1D5A91449",
//             isAuthorized: false,
//             units: [],
//             selectedUnitId: null
//         };
//     }
//
//     componentDidMount() {
//         const token = this.state.token;
//
//         wialon.core.Session.getInstance().initSession("https://hst-api.wialon.com");
//
//         wialon.core.Session.getInstance().loginToken(token, "", (code: any) => {
//             if (code) {
//                 msg(wialon.core.Errors.getErrorText(code));
//                 return;
//             }
//             msg("Logged successfully");
//             this.setState({ isAuthorized: true }, this.init);
//         });
//     }
//
//     updateUnitState = (event: any) => {
//         const eventedUnit = event.getTarget();
//         let unitsState = this.state.units.map(item => {
//             if (item.id !== eventedUnit.getId()) {
//                 return item;
//             }
//             return {
//                 ...item,
//                 position: eventedUnit.getPosition(),
//                 lastMessageTime: eventedUnit.getLastMessage() ? eventedUnit.getLastMessage().t : 0,
//                 raw: eventedUnit,
//                 icon: eventedUnit.getIconUrl(32),
//             };
//         });
//         this.setState({ units: unitsState });
//     };
//
//     init = () => {
//         const sess = wialon.core.Session.getInstance();
//         const flags = wialon.item.Item.dataFlag.base | wialon.item.Unit.dataFlag.lastMessage;
//
//         sess.loadLibrary("itemIcon");
//         sess.updateDataFlags([{ type: "type", data: "avl_unit", flags: flags, mode: 0 }], (code: any) => {
//             if (code) {
//                 msg(wialon.core.Errors.getErrorText(code));
//                 return;
//             }
//
//             const units = sess.getItems("avl_unit");
//             if (!units || !units.length) {
//                 msg("Units not found");
//                 return;
//             }
//
//             let unitsState = units.map((unit: any) => ({
//                 id: unit.getId(),
//                 name: unit.getName(),
//                 position: unit.getPosition(),
//                 lastMessageTime: unit.getLastMessage() ? unit.getLastMessage().t : null,
//                 iconUrl: unit.getIconUrl(32),
//                 raw: unit,
//             }));
//
//             units.forEach((unit: any) => {
//                 unit.addListener("messageRegistered", this.updateUnitState);
//             });
//
//             this.setState({ units: unitsState });
//         });
//     };
//
//     handleUnitSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
//         this.setState({ selectedUnitId: event.target.value });
//     };
//
//     render() {
//         const { isAuthorized, units, selectedUnitId } = this.state;
//         const selectedUnit = units.find(unit => unit.id.toString() === selectedUnitId);
//         const position = selectedUnit ? [selectedUnit.position.y, selectedUnit.position.x] : defaultProps.center;
//         const icon = selectedUnit && selectedUnit.iconUrl ? selectedUnit.iconUrl : "";
//         const positionDetails = selectedUnit && selectedUnit.position ? selectedUnit.position : null;
//
//         return (
//             <div className="App">
//                 {!isAuthorized ? (
//                     <h5> Loading... </h5>
//                 ) : (
//                     <div className="w-full grid grid-cols-1 md:grid-cols-5 gap-6">
//                         <div className="col-span-2 space-x-2">
//                             <label htmlFor="unit-select">Select a Vehicle:</label>
//                             <select id="unit-select" onChange={this.handleUnitSelect} value={selectedUnitId || ""}>
//                                 <option value="">--Select a Vehicle--</option>
//                                 {units.map(u => (
//                                     <option key={u.id} value={u.id}>
//                                         <span>{u.name}</span>
//                                     </option>
//                                 ))}
//                             </select>
//
//                             {selectedUnit && (
//                                 <div className="list mt-12">
//                                     <div className="row space-y-4">
//                                         <div>
//                                             <b>Name:</b> {selectedUnit.name}
//                                         </div>
//                                         <div>
//                                             <b>Last message time:</b>
//                                             {selectedUnit.lastMessageTime} {" or "}
//                                             {wialon.util.DateTime.formatTime(selectedUnit.lastMessageTime, 0)}
//                                         </div>
//                                         {selectedUnit.icon && (
//                                             <div>
//                                                 {/* Optionally render icon here */}
//                                             </div>
//                                         )}
//                                         <div>
//                                             <b>Last position:</b>
//                                             {!selectedUnit.raw.getPosition()
//                                                 ? "-"
//                                                 : " x: " +
//                                                 selectedUnit.raw.getPosition().x +
//                                                 " y: " +
//                                                 selectedUnit.raw.getPosition().y}
//                                         </div>
//
//                                         <div>
//                                             {selectedUnit.raw.getPosition() && (
//                                                 <div className="space-y-4">
//                                                     <p>
//                                                         Longitude: {selectedUnit.raw.getPosition().x}
//                                                     </p>
//                                                     <p>
//                                                         Latitude : {selectedUnit.raw.getPosition().y}
//                                                     </p>
//                                                     <p>
//                                                         Speed: {selectedUnit.raw.getPosition().s} Km/h
//                                                     </p>
//                                                     <p>
//                                                         Message Time (UTC): {selectedUnit.raw.getPosition().t}
//                                                     </p>
//                                                     <p>
//                                                         Flags: {selectedUnit.raw.getPosition().f}
//                                                     </p>
//                                                     <p>
//                                                         lbs message checksum: {selectedUnit.raw.getPosition().lc}
//                                                     </p>
//                                                     <p>
//                                                         course: {selectedUnit.raw.getPosition().c}
//                                                     </p>
//                                                     <p>
//                                                         Altitude: {selectedUnit.raw.getPosition().z}
//                                                     </p>
//                                                     <p>
//                                                         Satellites Count: {selectedUnit.raw.getPosition().sc}
//                                                     </p>
//                                                 </div>
//                                             )}
//                                         </div>
//                                     </div>
//                                 </div>
//                             )}
//                         </div>
//
//                         <div className="map-container col-span-3" style={{height: '400px', width: '100%'}}>
//                             {/* Pass the selected vehicle's position to the map */}
//                             {/* @ts-ignore */}
//                             <LazyMap position={position}
//                                      name={selectedUnit ? selectedUnit.name : "Select a vehicle"}
//                                      image={icon}
//                                      positionDetails={positionDetails}
//                             />
//                         </div>
//                     </div>
//                 )}
//             </div>
//         );
//     }
// }
