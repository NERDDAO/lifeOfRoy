import Link from "next/link";
import type { NextPage } from "next";
import { BugAntIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { BotScreen } from "./components/AppComponent";
import Image from "next/image";
import houseBackground from "../public/house-background.png";

const Home: NextPage = () => {
  return (
    <div className="relative min-h-screen">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={houseBackground}
          alt="Cartoony Universe House"
          layout="fill"
          objectFit="cover"
          priority
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center flex-grow pt-10">
        <div className="px-5">
          <h1 className="text-center mb-8">
            <span className="block text-2xl mb-2">Welcome to</span>
            <span className="block text-4xl font-bold">
              Roy: A Life Well Lived
            </span>
          </h1>
          <BotScreen />
        </div>

        <div className="flex-grow w-full mt-16 px-8 py-12">
          {/* Other content */}
        </div>
      </div>

      {/* Play Button */}
      <div className="fixed bottom-10 left-1/2 transform -translate-x-1/2 z-10">
        <Link href="/play" passHref>
          <span className="text-2xl font-bold bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-full animate-bounce cursor-pointer">
            Play Roy
          </span>
        </Link>
      </div>
    </div>
  );
};

export default Home;
