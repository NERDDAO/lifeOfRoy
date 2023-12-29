// components/Dashboard/Dashboard.tsx
import React from "react";
import Image from "next/image";
import Background from "./Background";



interface DashboardProps {
    children: React.ReactNode;
}
const Dashboard: React.FC<DashboardProps> = ({
    children,
}) => {
    return (
        <>
            <div className="dashboard">
                <Image className="staticOverlay w-full h-full" src="/assets/view.png" alt="Static Image Overlay" fill />

                <Background
                ></Background>

                {children}
            </div>
        </>
    );
};

export default Dashboard;
