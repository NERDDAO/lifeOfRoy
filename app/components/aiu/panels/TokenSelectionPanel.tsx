import React, { useState } from "react";
import ReadAIU from "../ReadAIU";
import type { HeroCodex } from "~~/types/appTypes"

interface TokenSelectionPanelProps {
    warping: boolean;
    scannerOutput: HeroCodex;
    playSpaceshipOn: () => void;
    handleScanning: (scanning: boolean) => void;
    scanning: boolean;
    handleButtonClick: (button: string, type: "character" | "background") => Promise<void>;
    buttonMessageId: string | "";
    modifiedPrompt: string;
    setTravelStatus: (type: "NoTarget" | "AcquiringTarget" | "TargetAcquired") => void;
    handleEngaged: (engaged: boolean) => void;
    onImageSrcReceived: (imageSrc: string) => void;
    onTokenIdsReceived: (tokenIds: string[]) => void;
    onSelectedTokenIdRecieved: (selectedTokenId: string) => void;
    onSubmit: (type: "character" | "background") => Promise<void>;
    engaged: boolean;
    travelStatus: string | undefined;
    playHolographicDisplay: () => void;
    playSpaceshipHum: () => void;
    playWarpSpeed: () => void;
    setEngaged: (engaged: boolean) => void;
    selectedTokenId: string;
}

const TokenSelectionPanel: React.FC<TokenSelectionPanelProps> = ({
    warping,
    scannerOutput,
    playSpaceshipOn,
    playHolographicDisplay,
    playSpaceshipHum,
    playWarpSpeed,
    scanning,
    handleScanning,
    handleButtonClick,
    buttonMessageId,
    engaged,
    modifiedPrompt,
    setTravelStatus,
    handleEngaged,
    onImageSrcReceived,
    onTokenIdsReceived,
    onSelectedTokenIdRecieved,
    onSubmit,
    travelStatus,
    setEngaged,
    selectedTokenId,
}) => {
    const handleClick = () => {
        if (engaged === true) {
            setEngaged(false);
            return;
        }
        setEngaged(true);
    };

    return (
        <>
            <ReadAIU
                selectedTokenId={selectedTokenId}
                setEngaged={setEngaged}
                warping={warping}
                scannerOutput={scannerOutput}
                playSpaceshipOn={playSpaceshipOn}
                playHolographicDisplay={playHolographicDisplay}
                playSpaceshipHum={playSpaceshipHum}
                playWarpSpeed={playWarpSpeed}
                handleScanning={handleScanning}
                scanning={scanning}
                handleButtonClick={handleButtonClick}
                buttonMessageId={buttonMessageId}
                engaged={engaged}
                modifiedPrompt={modifiedPrompt}
                setTravelStatus={setTravelStatus}
                handleEngaged={handleEngaged}
                travelStatus={travelStatus}
                onImageSrcReceived={onImageSrcReceived}
                onTokenIdsReceived={onTokenIdsReceived}
                onSelectedTokenIdRecieved={onSelectedTokenIdRecieved}
                onToggleMinimize={handleClick} // Pass handleClick as a prop
                onSubmit={onSubmit}
            />
        </>
    );
};

export default TokenSelectionPanel;
