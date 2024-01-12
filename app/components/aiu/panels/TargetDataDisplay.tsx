import LogViewer from "./LogViewer";

import { useAppStore, useGlobalState, useImageStore, useQuipuxStore } from "@/app/store/store";

import React, { useState, useEffect } from "react";



const TargetDataDisplay = () => {

    // Database Name
    const imageStore = useImageStore(state => state);
    const store = useGlobalState(state => state);
    const app = useAppStore(state => state);
    const quipux = useQuipuxStore(state => state);
    const myPilots = store.myPilots;

    const [indexCount, setIndexCount] = useState(1);

    const db = store.myData
    const heroCodexes = db.myHeroCodex;

    const heroCodex = heroCodexes?.length >= 1 ? heroCodexes[indexCount] : "";
    const handleDataIndexChange = () => {

        setIndexCount(indexCount + 1);
        if (indexCount >= heroCodexes.length - 1) {
            setIndexCount(0); // Wrap around to the beginning
        }// Wrap around to the end
        console.log("indexCount");
    };
    //

    const [pilotIndex, setPilotIndex] = useState(0);




    //const heroCodex = heroCodexes[1]


    const parsedMetadata = useGlobalState(state => state.nftData);




    const displayTypes = ["inputData", "logData", "SwitchBoard"];


    const renderCustomInterface = () => {
        switch (displayTypes[0]) {
            case "inputData":
                // Custom interface for image data
                return (
                    <>
                        <ul
                            className=" w-[100%] h-[50%]"
                            onClick={() => handleDataIndexChange()}
                        >
                            stuff
                            <LogViewer scannerOptions={[]} scannerOutput={{
                                beaconData: {
                                    quadrantId: "",
                                    coordinates: [0, 0, 0],
                                    locationName: "",
                                    locationFunFact: "",
                                    nearestLocationId: "",
                                    navigationNotes: "",
                                    imageUrl: ""
                                },
                                blockNumber: "",
                                imageUrl: "",
                                heroCodex: {
                                    heroId: "",
                                    historyBrief: "",
                                    questBrief: "",
                                    inventory: [],
                                    powerLevel: 0,
                                    funFact: "",
                                    locationBeacon0: {
                                        quadrantId: "",
                                        coordinates: [0, 0, 0],
                                        locationName: "",
                                        locationFunFact: "",
                                        nearestLocationId: "",
                                        navigationNotes: "",
                                        imageUrl: ""
                                    }
                                }
                            }} />


                        </ul>
                    </>


                );
            default:
                // Default interface if no specific one is found
                return <></>;
        }
    };

    return (<> {renderCustomInterface()}</>);
};
export default TargetDataDisplay;
