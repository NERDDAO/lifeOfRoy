import { FunctionComponent, useEffect, useState } from "react";
import IntergalacticReportDisplay from "./IntergalacticReportDisplay";
import MetadataDisplay from "./MetadataDisplay";
import { Faucet } from "./scaffold-eth/Faucet";
import { useGlobalState, useImageStore, useAppStore, useQuipuxStore } from "@/app/store/store";
import { stringToHex } from "@/app/utils/nerdUtils";

interface ReadAIUProps {
    warping: boolean;
    scannerOutput: any;
    playSpaceshipOn: () => void;
    handleScanning: (scanning: boolean) => void;
    scanning: boolean;
    handleButtonClick: (button: string, type: "character" | "background") => Promise<void>;
    buttonMessageId: string | "";
    engaged: boolean;
    modifiedPrompt: string;
    playWarpSpeed: () => void;
    playHolographicDisplay: () => void;
    playSpaceshipHum: () => void;
    setTravelStatus: (type: "NoTarget" | "AcquiringTarget" | "TargetAcquired") => void;
    handleEngaged: (engaged: boolean) => void;
    onSelectedTokenIdRecieved: (selectedTokenId: string) => void;
    onImageSrcReceived: (imageSrc: string) => void;
    onTokenIdsReceived: (tokenIds: string[]) => void;
    onToggleMinimize: () => void; // Add this prop
    onSubmit: (type: "character" | "background") => Promise<void>;
    travelStatus: string | undefined;
    setEngaged: (engaged: boolean) => void;
    selectedTokenId: string;
}

export const ReadAIU: FunctionComponent<ReadAIUProps> = ({
    playWarpSpeed,
    playHolographicDisplay,
    playSpaceshipHum,
    handleScanning,
    selectedTokenId,
    scanning,
    handleButtonClick,
    buttonMessageId,
    engaged,
    setTravelStatus,
    travelStatus,
    onSubmit,
    onSelectedTokenIdRecieved,
    onToggleMinimize,
    setEngaged, // Destructure the onToggleMinimize prop
}) => {
    const tevents = useAppStore(state => state.transferEvents);
    const [mouseTrigger, setMouseTrigger] = useState<boolean>(false);

    const scannerOptions = ["abilities", "currentEquipmentAndVehicle", "funFact", "powerLevel", "currentMissionBrief"];
    const parsedMetadata = useGlobalState(state => state.apiResponses);
    const scannerOutput = useQuipuxStore(state => state.metaScanData);

    const imageState = useImageStore(state => ({
        srcUrl: state.srcUrl,
        imageUrl: state.imageUrl,
        backgroundImageUrl: state.backgroundImageUrl,
        displayImageUrl: state.displayImageUrl,
    }));

    const handleTokenIdChange = (e: string) => {
        playHolographicDisplay();
        onSelectedTokenIdRecieved(e); // Add this line
    };

    //the important function
    const handleButton = () => {
        playHolographicDisplay();
        if (travelStatus === "AcquiringTarget") {
            playWarpSpeed();
            try {
                setTimeout(() => {
                    onSubmit("background");
                    setTravelStatus("TargetAcquired");
                }, 2100);
            } catch (error) {
                setTravelStatus("NoTarget");
                console.log(error);
            }
        } else if (travelStatus === "TargetAcquired") {
            playWarpSpeed();
            try {
                setTimeout(() => {
                    handleButtonClick("U1", "background");
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
                playSpaceshipHum();
                setEngaged(true);
            } else {
                setTravelStatus("NoTarget");
                setEngaged(false);
            }
        }
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
                            playWarpSpeed();
                            try {
                                setTimeout(() => {
                                    handleButtonClick(button, "background");
                                }, 2100);
                            } catch (error) {
                                setTravelStatus("NoTarget");
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
                            {selectedTokenId && travelStatus == "NoTarget" ? (
                                <div
                                    className="description-text hex-prompt font-bold text-[1rem] 
                                    absolute top-[0%] h-[60%] w-full p-[0.1rem] pt-[2rem] text-white"
                                    onClick={() => {
                                        playHolographicDisplay();
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
                            {!selectedTokenId && (
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
                                onChange={e => handleTokenIdChange(e.target.value)}
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
                                        {tokenId}
                                    </option>
                                ))}
                            </select>
                            <button
                                id="spaceshipButton"
                                className="spaceship-display-screen hex-data master-button"
                                onClick={() => {
                                    playHolographicDisplay();
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
                engaged={engaged}
                selectedTokenId={selectedTokenId}
                travelStatus={travelStatus}
                setEngaged={setEngaged}
                playHolographicDisplay={playHolographicDisplay}
                scannerOutput={scannerOutput}
                scannerOptions={scannerOptions}
            />

            <div className={`spaceship-display-screen token-selection-panel${selectedTokenId! == "" ? "-focused" : "-focused"}`}>
                <div className="text-black relative opacity-100 h-full w-full overflow-hidden">
                    <MetadataDisplay
                        imageState={imageState}
                        engaged={engaged}
                        setEngaged={setEngaged}
                        playHolographicDisplay={playHolographicDisplay}
                        scannerOutput={scannerOutput}
                        scannerOptions={scannerOptions}
                    />
                </div>
            </div>
        </>
    );
};

export default ReadAIU;
