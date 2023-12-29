import React, { useState } from "react";
import { useAppStore, useGlobalState, useImageStore, useQuipuxStore } from "@/app/store/store";
import type { ApiResponses, ChatData, HeroCodex as MetaScanData, PlanetData, Quipux } from "@/app/types/appTypes";
import axios from "axios";
// Dummy data for demonstration purposes

interface LogViewerProps {
    playHolographicDisplay: () => void;
    scannerOptions: string[];
    scannerOutput: MetaScanData;
}
const LogViewer: React.FC<LogViewerProps> = ({ playHolographicDisplay, scannerOptions, scannerOutput }) => {
    const {
        chatData,
        planetData,
        ipsr,
        metaScanData,
        nftData,
        shipState,
    } = useGlobalState(state => ({
        setMetadata: state.setApiResponses,
        travels: state.travels,
        setTravels: state.setTravels,
        ipsr: state.myData,
        metaScanData: state.nftData,
        shipState: state.myPilots,
        nftData: state.nftData,
        handleApiResponse: state.setApiResponses,
        planetData: state.description,
        chatData: state.chatData,
        setChatData: state.setChatData,
    }));

    const quipux = useQuipuxStore(state => state);

    const { srcUrl, imageUrl, displayImageUrl } = useImageStore(state => state);
    const imageState = { srcUrl, imageUrl, displayImageUrl };


    const [dataIndex, setDataIndex] = useState(0);
    const [dataCategory, setDataCategory] = useState("navigator")
    const dataCategories = [
        "navigator",
        "metaData",
        "questLog",
        "manifest"
    ];

    const metaData = { metaScanData, nftData };
    const questLog = { encounters: quipux.encounterData, ipsr, imageState };
    const manifest = { state: shipState, pilot: quipux.pilotData, ship: quipux.shipData }
    const navigator = { log: quipux.routeLog, location: quipux.location }

    const dataCategoryOptions = {
        metaData: Object.keys(metaData || {}),
        questLog: Object.keys(questLog || {}),
        manifest: Object.keys(manifest || {}),
        navigator: Object.keys(navigator || {}),
    };

    const apiResponses = {
        metaData,
        questLog,
        manifest,
        navigator
    };
    const currentData = apiResponses[dataCategory as keyof typeof apiResponses];
    const currentOption = dataCategoryOptions[dataCategory as keyof typeof dataCategoryOptions][dataIndex];

    const [displayData, setDisplayData] = useState<any>(null);
    const fetchAlienEncounter = async () => {
        try {
            const response = await axios.post("/api/alienEncoder", {
                apiResponses,
            });
            const s = JSON.parse(response.data.newShipStatus);
            console.log(s, apiResponses)

            quipux.setEncounterData(s)


        } catch (error) {
            console.error("Error fetching target planet:", error);
        }
    };


    const handleDataCategoryChange = (category: string) => {
        playHolographicDisplay();
        setDataCategory(category);
        setDataIndex(0); // Reset index when changing category
    };

    const handleDataIndexChange = (change: number) => {
        const options = dataCategoryOptions[dataCategory as keyof typeof dataCategoryOptions];
        let newIndex = dataIndex + change;
        if (newIndex >= options.length) {
            newIndex = 0; // Wrap around to the beginning
        } else if (newIndex < 0) {
            newIndex = options.length - 1; // Wrap around to the end
        }
        setDataIndex(newIndex);
        playHolographicDisplay();
    };

    const handleOptionClick = (option: any) => {
        if (Array.isArray(option) || typeof option === "object") {
            setDisplayData(option);
        } else {
            playHolographicDisplay();
        }
    };

    const renderOutput = (output: any) => {
        if (Array.isArray(output)) {
            return (
                <ul>
                    {output.map((item, index) => (
                        <li key={`item-${index}`} onClick={() => handleOptionClick(item)}>
                            {index}{" "}
                            <span className="hover:text-green-500">
                                {typeof item === "object" ? JSON.stringify(item, null, 2) : item}
                            </span>
                        </li>
                    ))}
                </ul>
            );
        } else if (typeof output === "object" && output !== null) {
            return (
                <div>
                    {Object.entries(output).map(([key, value], index) => (
                        <div
                            className=""
                            key={`entry-${key}-${index}`}
                            onClick={() => {
                                playHolographicDisplay();
                                handleOptionClick(value);
                            }}
                        >
                            <strong>{key}:</strong>
                            <span className="hover:text-green-500 cursor-pointer"> {JSON.stringify(value, null, 2)}</span>
                        </div>
                    ))}
                </div>
            );
        } else {
            return <span>{output}</span>;
        }
    };

    const currentOutput =
        displayData || (currentData ? currentData[currentOption as keyof typeof currentData] : "Loading...");

    return (
        <div className="absolute spaceship-screen-display top-20 flex flex-col hex-prompt p-5 h-[85%]">
            <div className="flex-wrap  p-1 w-[100%]">
                <div className="relative spaceship-screen-display">
                    {dataCategories.map(category => (
                        <button
                            key={category}
                            onClick={() => {
                                handleDataCategoryChange(category);
                                setDisplayData(null); // Reset display data when changing category
                            }}
                            className={`m-1 p-1 overflow-hidden text-center text-xs hex-prompt w-[26%] ${dataCategory === category ? "active " : ""
                                } ${!dataCategoryOptions[category as keyof typeof dataCategoryOptions].length
                                    ? "hover:text-red opacity-50 pointer-events-none"
                                    : "hover:text-green-700"
                                }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>
            </div>
            <strong className="text-xl text-white">{dataCategory} :</strong>
            Current Output:
            {renderOutput(currentOption)}


            <div className="hex-prompt text-white   overflow-y-auto overflow-x-hidden p-2.5">                <button className="" onClick={() => handleDataIndexChange(1)}>
                Previous
            </button>{" "}
                || <button onClick={() => handleDataIndexChange(-1)}>Next</button>


                <br />
                <div className="text-left mt-1">{renderOutput(currentOutput)}</div>

            </div>

            <label className="p-2 cursor-pointer hover:text-white">scan<button onClick={() => {
                playHolographicDisplay();
                fetchAlienEncounter();
            }}></button></label>
        </div>
    );
};
export default LogViewer;


