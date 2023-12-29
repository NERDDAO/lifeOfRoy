"use client"
import { useGlobalState, useQuipuxStore } from "@/app/store/store";
import type { Location } from "@/app/types/appTypes";

interface PromptPanelProps {
    loadingProgress: number;
    error: string;
    buttonMessageId: string | "";
    imageUrl: string;
    srcUrl: string | null;
    loading: boolean;
    onSubmitPrompt: (type: "character" | "background") => Promise<void>;
    onSubmit: (type: "character" | "background") => Promise<void>;
    handleButtonClick: (button: string, type: "character" | "background") => void;
}

export const MarqueePanel: React.FC<PromptPanelProps> = ({ imageUrl, loadingProgress, error }) => {
    const interplanetaryStatusReport = useQuipuxStore(state => state.questData);
    const nftData = useGlobalState(state => state.nftData);
    //const myData = useGlobalState(state => state.myData);
    const myData = useQuipuxStore(state => state.database);
    const gstate = useGlobalState(state => state);

    const { ships: myShip, planetData: myLocations, quipux: myQuipuxs, pilotData: myPilot } = myData;

    const pilot = myPilot ? myPilot[0] : ""
    const ship = myShip ? myShip[0] : ""
    const location: Location = myLocations ? myLocations[0] : {};
    const quipux = myQuipuxs ? myQuipuxs[0] : ""
    return (
        <>

            <div className="absolute marquee-container spaceship-display-screen max-h-[9%] mb-20 left-[30%]">
                <h2 className="font-bold marquee-title -bottom-1.5 description-text">AI-U BROADCAST</h2>
                <strong className="marquee-title left-6">BROADCAST ID: <span className=" text-white right-2 text-right">
                    {location.quadrantId}</span></strong>
                <strong className="marquee-title left-10 -bottom-3 p-2"> Loading:{loadingProgress}</strong>
                <div
                    className="screen-border">

                    <div
                        className="spaceship-screen-display"
                    >
                        <ul className="hex-prompt">

                            <li className="w-max relative top-7 spaceship-screen-display marquee-content"
                                style={{ width: "max-content" }}
                                id="mc">
                                {gstate.selectedDescription}
                                MANIFEST:{JSON.stringify(ship.shipData?.state)}
                            </li>
                        </ul>
                    </div>
                    <br />


                </div>

            </div>

        </>
    );
};
