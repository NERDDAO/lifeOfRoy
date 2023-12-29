import type { ApiResponses } from "../types/appTypes";

export function stringToHex(str: string): string {
    let hex = "ALLIANCEOFTHEINFINITEUNIVERSE";
    for (let i = 0; i < str?.length; i++) {
        hex += str.charCodeAt(i).toString(16);
    }
    return hex;
}

export const getColor = (travelStatus: any) => {
    switch (travelStatus) {
        case "NoTarget":
            return "rgb(42, 252, 221, 0.25)";
        case "AcquiringTarget":
            return "rgb(242, 152, 47 , 0.41)";
        case "TargetAcquired":
            return "rgb(132,222,2, 0.51)";
        default: ""
    }
};
/*
      function stringifyMetadata(): string {
          const { Level, Power1, Power2, Power3, Power4, Alignment1, Alignment2, Side } =
              travels[currentTravelIndex].metadata;
          const selectedDescription = travels[currentTravelIndex].metadata.interplanetaryStatusReport;
          return `"REPORT FROM\n ${Level} ${Power1} ${Power2} ${Power3 !== undefined ? Power3 : "||||||||| |||||||||"} ${Power4 !== undefined ? Power4 : "|||| ||||| |||| |||||"
              } ||||||||| STATUS REPORT|||||||||||:\n ${selectedDescription} METADATA Alignment1: ${Alignment1}; Alignment2: ${Alignment2}; Side: ${Side};`;
      }
  */
/*
   async function handleSendTweet() {
       playHolographicDisplay();
       const formattedMetadata = stringifyMetadata();
       const collageUrl = (await createWebcomic(testImage, reportFrame, formattedMetadata, imageSrc)) as string;
       setCollageUrplanetData
   }
*/
export async function handleReallySendTweet(selectedLog: string, selectedImage: string) {
    // Host the collage image on your server or a third-party service and get its URL

    const tweetText = `🔭 Discovering the Cosmos with AI-U 🌌
    #AIU_SIGNAL 
    ${selectedLog} ${selectedImage}
    🚀 Join the adventure: https://xn--0civ138ml7ayzbx3f.y.at
    # #SpaceExploration`;

    const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;

    window.open(tweetUrl, "_blank");
}
/*
export async function createWebcomic(
  testImageUrl: string,
  reportFrameUrl: string,
  metadata: string,
  extraImage: string,
) {
  return new Promise((resolve, reject) => {
    const canvas: fabric.Canvas = new fabric.Canvas(null, {
      width: 800,
      height: 1000,
    });

    // Create a black rectangle as background
    const background = new fabric.Rect({
      width: canvas.width,
      height: canvas.height,
      fill: "black",
      originX: "left",
      originY: "top",
    });

    // Add the background to the canvas
    canvas.add(background);
    fabric.Image.fromURL(testImageUrl, img => {
      img.scaleToWidth((canvas.width ?? 800) / 2);
      img.scaleToHeight((canvas.height ?? 1000) / 2.3);
      img.set({ left: 200, top: 200 });
      img.opacity = 0.2;
      canvas.add(img);

      // Add metadata text as a square
      const maxLineLength = 58; // Adjust this value to change the max line length
      const formattedMetadata = metadata
        .split(" ") // Split metadata by spaces
        .reduce(
          (accumulator, word) => {
            const lastLine = accumulator[accumulator.length - 1];
            const newLine = `${lastLine}${word} `;
            return newLine.length < maxLineLength
              ? [...accumulator.slice(0, -1), newLine]
              : [...accumulator, `${word} `];
          },
          [""],
        )
        .join("\n"); // Join lines with a line break

      const metadataText = new fabric.Text(formattedMetadata, {
        left: 145,
        top: 240,
        fontFamily: "Orbitron",
        fontSize: 16,
        fill: "#f2982f",
        fontWeight: "bold",
        textAlign: "left",
        originX: "left",
        originY: "top",
      });

      // Add the metadata text to the canvas
      canvas.add(metadataText);
      const borderWidth = 2;
      const borderColor = "#f2982f";
      const textBorder = new fabric.Rect({
        top: metadataText.top ?? 0 - borderWidth,
        left: metadataText.left ?? 0 - borderWidth,
        width: metadataText.getScaledWidth() + 2 * borderWidth,
        height: metadataText.getScaledHeight() - 80 * borderWidth,
        fill: "transparent",
        strokeWidth: borderWidth,
        stroke: borderColor,
      });

      // Add glow effect to the metadata text
      metadataText.set({
        shadow: new fabric.Shadow({
          color: borderColor,
          blur: 15,
          offsetX: 0,
          offsetY: 0,
        }),
      });

      // Add glow effect to the extra image
      img.set({
        shadow: new fabric.Shadow({
          color: borderColor,
          blur: 15,
          offsetX: 0,
          offsetY: 0,
        }),
      });

      // Add border and glow effect to the extra image
      const imageBorder = new fabric.Rect({
        top: img.top ?? 0 - borderWidth,
        left: img.left ?? 0 + borderWidth - 25 * borderWidth,
        width: img.getScaledWidth() + 30 * borderWidth,
        height: img.getScaledHeight() - 23 * borderWidth,
        fill: "transparent",
        strokeWidth: borderWidth,
        stroke: borderColor,
      });

      // Add the text border and image border to the canvas
      canvas.add(textBorder);

      // Create a glossy transparent screen
      const glossyScreen = new fabric.Rect({
        top: 195,
        left: 100,
        width: (canvas.width ?? 800) / 1.35,
        height: (canvas.height ?? 1000) / 2.7,
        fill: new fabric.Gradient({
          type: "linear",
          coords: {
            x1: 0,
            y1: 0,
            x2: 0,
            y2: canvas.height,
          },
          colorStops: [
            { offset: 0, color: "rgba(255, 255, 255, 0.2)" },
            { offset: 0.5, color: "rgba(255, 255, 255, 0)" },
            { offset: 1, color: "rgba(255, 255, 255, 0.2)" },
          ],
        }),
        originX: "left",
        originY: "top",
      });

      // Add the glossy transparent screen to the canvas
      canvas.add(glossyScreen);

      fabric.Image.fromURL(reportFrameUrl, img => {
        img.scaleToWidth(canvas.width ?? 800);

        canvas.add(img);

        const webcomicDataUrl = canvas.toDataURL({ format: "png" });
        resolve(webcomicDataUrl);
      });
    });
  });
}
*/

export const generatePrompt = (type: "character" | "background", metadata: ApiResponses): string => {
    const APP_URL = "";
    const niji = metadata.midjourneyConfig?.nijiFlag ? "--niji 5" : "";
    const v = metadata.midjourneyConfig?.vFlag ? "--v 5" : "";
    const keyword = type === "background" ? "The Planet Of" : "A portrait of";
    const {
        Level: level,
        Power1: power1,
        Power2: power2,
        Power3: power3,
        Power4: power4,
        Alignment1: alignment1,
        Alignment2: alignment2,
        Side: side,
    } = metadata.nftData || {};
    const { currentEquipmentAndVehicle, currentMissionBrief, abilities, powerLevel, funFact, biometricReading } =
        metadata.metaScanData || {};
    const { url: srcUrl, selectedDescription } = metadata.midjourneyConfig || {};
    const { locationCoordinates, Scan } = metadata.planetData || {};
    const randomPlanet =
        "https://discovery.sndimg.com/content/dam/images/discovery/fullset/2022/9/alien%20planet%20GettyImages-913058614.jpg.rend.hgtvcom.406.406.suffix/1664497398007.jpeg";
    let result;
    if (type === "background")
        result = `${randomPlanet} ${keyword} 
                    ${JSON.stringify(Scan)} ${JSON.stringify(locationCoordinates)}
                    ${niji} ${v} viewed from space`.trim();

    result = `${srcUrl} ${keyword}  ${level} ${power1} 
                ${power2} ${power3} ${power4} ${currentMissionBrief} 
                Power Level: ${powerLevel}${biometricReading?.health} 
                ${currentEquipmentAndVehicle} ${abilities} ${funFact} 
                ${alignment1} ${alignment2} ${side} ${selectedDescription} 
                ${niji} ${v}`;

    result = result.replace(/undefined/g, "");
    // Truncate if length exceeds 14,000 characters

    return result;
};
// Initial cleanup to remove 'undefined'
