import { FunctionComponent, useEffect, useState } from "react";
import IntergalacticReportDisplay from "./IntergalacticReportDisplay";
import MetadataDisplay from "./MetadataDisplay";
import { Faucet } from "./scaffold-eth/Faucet";
import { useGlobalState, useImageStore, useAppStore, useQuipuxStore, useSoundController } from "@/app/store/store";
import { stringToHex } from "@/app/utils/nerdUtils";


const ReadAIU = () => {
    const travelStatus = useAppStore(state => state.travelStatus);
    const selectedTokenId = useGlobalState(state => state.selectedTokenId);
    const setSelectedTokenId = useGlobalState(state => state.setSelectedTokenId);
    const buttonMessageId = useGlobalState(state => state.buttonMessageId);
    const tevents = useAppStore(state => state.transferEvents);
    const [mouseTrigger, setMouseTrigger] = useState<boolean>(false);
    const scannerOptions = ["abilities", "currentEquipmentAndVehicle", "funFact", "powerLevel", "currentMissionBrief"];
    const parsedMetadata = useGlobalState(state => state.apiResponses);
    const scannerOutput = useQuipuxStore(state => state.metaScanData);
    const scanning = useAppStore(state => state.scanning);
    const setScanning = useAppStore(state => state.setScanning);
    const setTravelStatus = useAppStore(state => state.setTravelStatus);
    const setEngaged = useGlobalState(state => state.setEngaged);

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
    const handleScanning = (scanning: boolean) => {
        if (scanning === true) {
        }
        setScanning(!scanning);
        console.log("SCANNING", { scanning });
    };

    const handleEngaged = (engaged: boolean) => {
        if (engaged === true && selectedTokenId !== "") {
        }
    };



    function playSpaceshipHum() {
        if (sounds.spaceshipHum) {
            sounds.audioController?.playSound(sounds.spaceshipHum, false, 0.6);
        }
    }



    //the important function
    const handleButton = () => {
        playHolographicDisplay();
        if (travelStatus === "AcquiringTarget") {
            try {
                setTimeout(() => {
                    setTravelStatus("TargetAcquired");
                }, 2100);
            } catch (error) {
                setTravelStatus("NoTarget");
                console.log(error);
            }
        } else if (travelStatus === "TargetAcquired") {
            try {
                setTimeout(() => {
                    // handleButtonClick("U1", "background");
                    console.log("clicked");
                }, 2100);
            } catch (error) {
                setTravelStatus("NoTarget");
                console.log(error);
            }
        } else {
            if (selectedTokenId && travelStatus === "NoTarget") {
                setTravelStatus("AcquiringTarget");
                handleScanning(true);
                // playSpaceshipHum();
                setEngaged(true);
            } else {
                setTravelStatus("NoTarget");
                setEngaged(false);
            }
        }
    };

    const AvailableButtons = () => {
        const buttons = ["U1", "U2", "U3", "U4", "🔄", "V1", "V2", "V3", "V4"];



        return (
            <div
                style={{
                    display: "flexbox",

                    flexDirection: "column",
                    columns: 2,
                    justifyContent: "space-between",
                    height: "116%",
                    width: "300%",
                    left: "-100%",
                    position: "absolute",
                    top: "-10%",
                    paddingLeft: "3%",
                    right: "-20%",
                    marginTop: "10%",
                    paddingRight: "-30%",
                    flexWrap: "wrap",
                    whiteSpace: "nowrap",
                    zIndex: 1000,
                    columnGap: "100px",
                }}
                className="spaceship-button-container spaceship-display-screen"
            >
                {buttons.map(button => (
                    <button
                        key={button}
                        className={`spaceship-button ${buttonMessageId !== "" ? "active" : "pointer-events-none"
                            } display-text screen-border`}
                        style={{
                            marginTop: "15%",
                            marginBottom: "15%",
                            marginLeft: "15%",
                            marginRight: "5%",
                            padding: button === "🔄" ? "0.5rem" : ".5rem",
                            backgroundColor: button === "🔄" ? "black" : "black",
                            position: "relative",
                            display: "flex",
                            fontSize: "1.5rem",
                            width: "3.5rem",
                        }}
                        onClick={() => {
                            try {
                                setTimeout(() => {
                                    // handleButtonClick(button, "background");
                                }, 2100);
                            } catch (error) {
                                console.log(error);
                            }
                        }}
                    >
                        {button}
                    </button>
                ))}
            </div>
        );
    };
    useEffect(() => {
        const button = document.getElementById("spaceshipButton");

        if (travelStatus === "AcquiringTarget") {
            button?.classList.add("active");
            button?.classList.remove("loading");
        } else if (travelStatus === "TargetAcquired") {
            button?.classList.add("loading");
            button?.classList.remove("active");
        } else {
            button?.classList.remove("active");
            button?.classList.remove("loading");
        }
    }, [travelStatus]);


    return (
        <>
            {
                <div
                    onMouseEnter={() => setMouseTrigger(true)}
                    className="toggle-minimize-button spaceship-display-screen 
                    opacity-90 p-1 top-1/2 mt-28
                    "
                >
                    <div
                        onMouseEnter={() => setEngaged(true)}
                        onMouseLeave={() => setEngaged(false)}
                        className="spaceship-display-screen z-[500000000000000000000]"
                    >
                        <div className="screen-border h-full text-black bg-black">
                            {!selectedTokenId && travelStatus == "NoTarget" ? (
                                <div
                                    className="description-text hex-prompt font-bold text-[1rem] 
                                    absolute top-[0%] h-[60%] w-full p-[0.1rem] pt-[2rem] text-white"
                                    onClick={() => {
                                        handleButton();
                                    }}
                                >
                                    ENGAGE WARP DRIVE <br />
                                </div>
                            ) : (
                                travelStatus == "AcquiringTarget" && (
                                    <div
                                        className="description-text hex-prompt font-bold text-[1rem] 
                                    absolute top-[0%] h-[60%] w-full p-[0.1rem] pt-[2rem] text-white"
                                        onClick={() => handleButton()}
                                    >
                                        READY
                                    </div>
                                )
                            )}
                            {selectedTokenId && (
                                <div
                                    className="description-text hex-prompt font-bold text-[1rem] 
                                    absolute top-[0%] h-full w-full  mt-[-2rem] text-white"
                                >
                                    SELECT ID
                                </div>
                            )}
                            <br />
                            <select
                                id="tokenIdSelector"
                                value={selectedTokenId}
                                onChange={e => { setSelectedTokenId(e.target.value) }}
                                className="dropdown-container hex-prompt 
                                dropdown-option text-green content-center pl-3 top-[80%]"
                            >
                                <option>ID</option>

                                {tevents && Object.entries(tevents).map(([key, value], tokenId) => (
                                    <option
                                        key={key}
                                        className="dropdown-option hex-prompt 
                                        dropdown-option  content-center"
                                    >
                                        {tevents[tokenId].args.tokenId.toString()}
                                    </option>
                                ))}
                            </select>
                            <button
                                id="spaceshipButton"
                                className="spaceship-display-screen hex-data master-button"
                                onClick={() => {
                                    handleButton();
                                }}
                            >
                                {stringToHex(parsedMetadata ? JSON.stringify(parsedMetadata.nftData) : "No Metadata")}
                            </button>
                        </div>
                    </div>
                    <AvailableButtons />
                </div>
            }

            <Faucet
                handleScanning={handleScanning}
                metadata={parsedMetadata}
                selectedTokenId={selectedTokenId}
                travelStatus={travelStatus}
                scannerOutput={scannerOutput}
                scannerOptions={scannerOptions}
            />

            <div className={`spaceship-display-screen token-selection-panel${selectedTokenId! == "" ? "-focused" : "-focused"}`}>
                <div className="text-black relative opacity-100 h-full w-full overflow-hidden">
                    <MetadataDisplay
                    />
                </div>
            </div>
        </>
    );
};

export default ReadAIU;
