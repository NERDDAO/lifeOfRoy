import React, { useEffect, useState } from "react";
import ChatWithCaptain from "./ChatWithCaptain";
import { useGlobalState, useImageStore, useSoundController, useQuipuxStore, useAppStore } from "@/app/store/store";
import type { PlanetData, ToggleOptions } from "@/app/types/appTypes";
import { generatePrompt, stringToHex } from "@/app/utils/nerdUtils";
import { BotScreen } from "@/app/components/AppComponent"
import { Settings } from "../../settings";
import BotList from "../../bot/bot-list";
import InterGalaReportDisplay from "../IntergalacticReportDisplay";

export const DescriptionPanel: React.FC = () => {
    const sounds = useSoundController(state => state.sounds);
    const audioController = sounds.audioController;

    function playSpaceshipOn() {
        if (sounds.spaceshipOn) {
            audioController?.playSound(sounds.spaceshipOn, true, 0.02);
        }
    }

    function playHolographicDisplay() {
        if (sounds.holographicDisplay) {
            audioController?.playSound(sounds.holographicDisplay, false, 1);
        }
    }

    function playWarpSpeed() {
        if (sounds.warpSpeed) {
            audioController?.playSound(sounds.warpSpeed, false, 1.1);
        }
    }
    const [focused, setFocused] = useState(true);

    const [toggle, setToggle] = useState<boolean>(false);

    const imageState = useImageStore(state => state);
    const handleClick = () => {
        playHolographicDisplay();
        setFocused(!focused);
    };

    const handleScanClick = () => {
        playHolographicDisplay();

        setToggle(!toggle);
        handleDescribeClick();
    };

    const handleButtonClick = () => {
        playHolographicDisplay();
        handleScanning(true);
        handleSubmit("background");
        setToggle(!toggle);
    };

    const nftData = useGlobalState(state => state.nftData);
    const chatData = useGlobalState(state => state.chatData);
    const heroName = JSON.stringify(
        `${nftData.Level} ${nftData.Power1} ${nftData.Power2} ${nftData.Power3} ${nftData.Power3}`,
    ).replace(/undefined/g, "");

    const dummyData = [{ mmsg: "dummy" }]
    const [modifiedPrompt, setModifiedPrompt] = useState("ALLIANCEOFTHEINFINITEUNIVERSE");
    const myShips = dummyData;
    const myLocations = dummyData;
    const selectedTokenId = 2;
    const account = useAppStore(state => state.account);

    const [answer, setAnswer] = useState("");
    const [nickname, setNickname] = useState("");
    const [occupation, setOccupation] = useState("");
    const [guild, setGuild] = useState("");
    const intakeForm = { account: account?.address, nickname, occupation, guild, answer };

    const [pilotIndex, setPilotIndex] = useState(0);

    // ... [your state and function definitions] ...
    const currentPilot = useQuipuxStore(state => state.pilotData);
    const currentLocation = useQuipuxStore(state => state.location);
    const currentShip = useQuipuxStore(state => state.shipData);

    const [indexCount, setIndexCount] = useState(1);

    const handleDataIndexChange = (change: number) => {
        let newIndex = indexCount + change;
        if (newIndex >= displayTypes.length) {
            newIndex = 0; // Wrap around to the beginning
        } else if (newIndex < 0) {
            newIndex = displayTypes.length - 1; // Wrap around to the end
        }
        setIndexCount(newIndex);
        playHolographicDisplay();
    };


    const displayTypes = ["inputData", "logData", "SwitchBoard", "options", "botList"];


    const renderCustomInterface = () => {
        switch (displayTypes[indexCount]) {
            case "inputData":
                // Custom interface for image data
                return (
                    <>
                        <ul
                            className="cursor-pointer w-[100%] h-[100%]"
                        >
                            pilot data/account creation
                            <InterGalaReportDisplay playHolographicDisplay={playHolographicDisplay} />

                        </ul>



                    </>
                );
            case "logData":
                // Custom interface for interplanetary status report
                return <>
                    <ul
                        className=" w-[100%] h-[100%] -space-y-1"
                    >
                        location and planet data
                        <div className="text-sm flex flex-wrap spaceship-display-screen absolute top-[59%] -left-1 p-4 overflow-auto"

                            style={{ width: "100%", height: "25%" }}>
                            CARGO:
                            {/*myShip?.cargo && Object.entries(myShip.cargo).map((cargo: any, index: number) => (
                                <li key={cargo} className="text-bold">{JSON.stringify(cargo)}:<span className="text-white"></span></li>))*/}

                            <li>STATUS: {/*myShip?.currentStatus*/}</li>

                            <div className="text-white">LOCATION:
                                <ul>

                                    {/*quipux.location && (

                                        <ul>
                                            {
                                                Object.entries(quipux.location).map(([key, value], index) => (
                                                    <li key={index} className="text-bold">
                                                        {key}: <span className="text-white">{JSON.stringify(value)}</span>
                                                    </li>
                                                ))
                                            }
                                        </ul>
                                    )*/}
                                </ul>

                            </div>

                            <li>FunFact:{/*myShip?.funFact*/}</li>
                        </div>

                    </ul>

                </>;
            case "SwitchBoard":
                // Custom interface for meta scan data
                return (
                    <>

                        <ul
                            className="text-right absolute top-1/4 right-0 p-1 w-[100%]"
                        >
                            quest interaction
                        </ul>

                    </>
                );
            case "options":
                // Default interface if no specific one is found
                return <>
                    <Settings />
                </>;
            case "botList":
                // Default interface if no specific one is found
                return <>
                    <BotList />
                </>;
        }
    };


    const CustomInterface = () => {
        return renderCustomInterface();
    };


    return (
        <>
            <div
                className={`${focused ? "focused-right spaceship-display-screen" : "unfocused-right scale-100 spaceship-display-screen"
                    }  spaceship-panel screen-border`}
                style={{
                    transition: "all 0.5s ease-in-out",
                    padding: "0.4rem",
                    height: "40%",
                    width: "23%",
                    left: "70%",
                    top: "40%",
                }}
            >

                <p className="text-3xl text-white font-bold p-5">N.A.V.I. COMMS</p>
                <div

                    className="relative spaceship-display-screen"
                    style={{
                        left: "-1%",
                        color: "white",
                    }}
                >
                    <span className="relative top-0 left-0 text-white text-xl cursor-pointer"

                        onClick={e => {
                            e.stopPropagation();

                            handleDataIndexChange(1);
                        }}
                    >
                        {displayTypes[indexCount]}
                    </span>
                    <>



                        <CustomInterface />



                        <div className="hex-data">
                            {stringToHex(modifiedPrompt)}
                            {stringToHex(modifiedPrompt)}
                            {stringToHex(modifiedPrompt)}
                            {stringToHex(modifiedPrompt)}
                            {stringToHex(modifiedPrompt)}
                            {stringToHex(modifiedPrompt)}
                            {stringToHex(modifiedPrompt)}
                            {stringToHex(modifiedPrompt)}
                        </div>
                    </>
                </div>
            </div>
        </>
    );
};

export default DescriptionPanel;
function playHolographicDisplay() {
    throw new Error("Function not implemented.");
}

function handleDescribeClick() {
    throw new Error("Function not implemented.");
}

function handleScanning(arg0: boolean) {
    throw new Error("Function not implemented.");
}

function handleSubmit(arg0: string) {
    throw new Error("Function not implemented.");
}

