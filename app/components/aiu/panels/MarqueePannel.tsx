"use client"
import { useGlobalState, useQuipuxStore, useAppStore } from "@/app/store/store";
import type { Location } from "@/app/types/appTypes";

interface PromptPanelProps {
}

export const MarqueePanel: React.FC<PromptPanelProps> = () => {
    const nftData = useGlobalState(state => state.nftData);
    //const myData = useGlobalState(state => state.myData);
    const myData = useQuipuxStore(state => state.database);
    const gstate = useGlobalState(state => state);
    const loadingProgress = useAppStore(state => state.loadingProgress);

    const { ships: myShip, planetData: myLocations, quipux: myQuipuxs, pilotData: myPilot } = myData;

    const ship = myShip ? myShip[0] : ""
    const location: Location = myLocations ? myLocations[0] : {};
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
