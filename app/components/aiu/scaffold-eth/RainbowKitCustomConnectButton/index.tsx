"use client"
import { Balance } from "../Balance";
import { AddressInfoDropdown } from "./AddressInfoDropdown";
import { AddressQRCodeModal } from "./AddressQRCodeModal";
import { WrongNetworkDropdown } from "./WrongNetworkDropdown";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAutoConnect, useNetworkColor } from "@/app/hooks/aiu/scaffold-eth";
import { useTargetNetwork } from "@/app/hooks/aiu/scaffold-eth/useTargetNetwork";
import { useGlobalState, useAppStore } from "@/app/store/store";
import { getBlockExplorerAddressLink } from "@/app/utils/scaffold-eth";

/**
 * Custom Wagmi Connect Button (watch balance + custom design)
 */
export const RainbowKitCustomConnectButton = () => {
    useAutoConnect();
    const networkColor = useNetworkColor();
    const { targetNetwork } = useTargetNetwork();
    const setAccount = useAppStore(state => state.setAccount);
    return (
        <ConnectButton.Custom>
            {({ account, chain, openConnectModal, mounted }) => {
                const connected = mounted && account && chain;
                setAccount(account);

                const blockExplorerAddressLink = account
                    ? getBlockExplorerAddressLink(targetNetwork, account.address)
                    : undefined;

                return (
                    <>
                        {(() => {
                            if (!connected) {
                                return (
                                    <button className="btn btn-primary btn-sm" onClick={openConnectModal} type="button">
                                        Connect Wallet
                                    </button>
                                );
                            }

                            if (chain.unsupported || chain.id !== targetNetwork.id) {
                                return <WrongNetworkDropdown />;
                            }

                            return (
                                <>
                                    <div className="flex flex-col items-center mr-1">
                                        <Balance address={account.address} className="min-h-0 h-auto" />
                                        <span className="text-xs" style={{ color: networkColor }}>
                                            {chain.name}
                                        </span>
                                    </div>
                                    <AddressInfoDropdown
                                        address={account.address}
                                        displayName={account.displayName}
                                        ensAvatar={account.ensAvatar}
                                        blockExplorerAddressLink={blockExplorerAddressLink}
                                    />
                                    <AddressQRCodeModal address={account.address} modalId="qrcode-modal" />
                                </>
                            );
                        })()}
                    </>
                );
            }}
        </ConnectButton.Custom>
    );
};
