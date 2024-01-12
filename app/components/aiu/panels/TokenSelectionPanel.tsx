import React, { useState } from "react";
import ReadAIU from "../ReadAIU";
import type { HeroCodex } from "~~/types/appTypes"

interface TokenSelectionPanelProps {
}

const TokenSelectionPanel: React.FC<TokenSelectionPanelProps> = ({
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
