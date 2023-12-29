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
                        some data
                        {heroCodex &&
                            <ul
                                className=" w-[100%] h-[50%]"
                                onClick={() => handleDataIndexChange()}
                            >

                                <span className="cursor-pointer text-white text-sm font-bold text-center -ml-10">SIGNAL{indexCount}/{heroCodexes.length - 1}</span>

                                <h2 className="text-lg -mt-4 pl-14"><strong className="text-lg">{heroCodex?.data.parsed.heroCodex?.metaScanData?.heroId}</strong><br />{heroCodex?.data.parsed.heroCodex?.locationData?.nearestPlanetId}</h2>


                                <li className="text-xs pl-20">{heroCodex?.data?.parsed.heroCodex?.locationData?.locationName}</li>

                                <li className="text-xs pl-20">@{heroCodex?.data.parsed.heroCodex?.metaScanData?.locationBeacon0.locationId}</li>
                                <div className="cursor-scroll text-white font-bold text-sm pl-20 pr-12 relative h-[70%] w-[140%] overflow-auto">
                                    <div className="">{heroCodex?.data.parsed.heroCodex?.metaScanData?.questBrief}</div></div>


                            </ul>}



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
