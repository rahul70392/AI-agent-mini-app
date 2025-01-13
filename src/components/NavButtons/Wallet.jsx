import { useState, useCallback, useEffect } from 'react'
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import { useTonConnectUI } from '@tonconnect/ui-react';
import { Address } from '@ton/core';
import { Copy } from 'lucide-react';

export const Wallet = ({
    setToast,
    setToastMessage
}) => {
    const [open, setOpen] = useState(false);
    const [tonConnectUI] = useTonConnectUI();
    const [tonWalletAddress, setTonWalletAddress] = useState(null);

    const toggleDrawer = (newOpen) => () => {
        setOpen(newOpen);
    };

    const handleWalletConnection = useCallback((address) => {
        setToast(true);
        setToastMessage("Wallet Connected Successfully!");
        setTonWalletAddress(address);
        setTimeout(() => {
            setToast(false)
        }, 5000);
    }, [])

    const handleWalletDisconnection = useCallback(() => {
        setToast(true);
        setToastMessage("Wallet Disconnected Successfully!");
        setTonWalletAddress(null);
        setTimeout(() => {
            setToast(false)
        }, 5000);
    }, []);

    const handleWalletAction = async () => {
        if (tonConnectUI.connected) {
            await tonConnectUI.disconnect();
        } else {
            await tonConnectUI.openModal();
        }
    }

    const formatAddress = (address) => {
        const tempAddress = Address.parse(address).toString();
        return `${tempAddress.slice(0, 4)}...${tempAddress.slice(-4)}`;
    }

    useEffect(() => {
        const checkWalletConnection = async () => {
            if (tonConnectUI.account?.address) {
                handleWalletConnection(tonConnectUI.account?.address);
            } else {
                handleWalletDisconnection();
            }
        };
        checkWalletConnection();

        const unsubscribe = tonConnectUI.onStatusChange((wallet) => {
            if (wallet) {
                handleWalletConnection(wallet.account.address)
            } else {
                handleWalletDisconnection();
            }
        });

        return (() => {
            try {
                unsubscribe();
            } catch (error) {
                console.error("Error cleaning up onStatusChange:", error);
            }
        });

    }, [tonConnectUI, handleWalletConnection, handleWalletDisconnection]);

    const handleCopy = () => {
        setToastMessage("Address Copied!");
        setToast(true);
        window.navigator.clipboard.writeText(tonWalletAddress);
        setTimeout(() => {
            setToast(false)
        }, 5000);
    };

    const DrawerList = (
        <Box sx={{ width: 250, backgroundColor: "#151519", height: "100vh" }} role="presentation" onClick={toggleDrawer(false)} >
            <List>
                <div className='wallet-container'>
                    {
                        tonWalletAddress ?
                            <div className='wallet-button-contatiner'>
                                <div
                                    className='wallet-address-container'
                                >
                                    <p>{formatAddress(tonWalletAddress)}</p>
                                    <button
                                        className='copy-button'
                                        onClick={handleCopy}
                                    >
                                        <Copy
                                            size={16}
                                            color='white'
                                        />
                                    </button>
                                </div>
                                <button
                                    onClick={handleWalletAction}
                                    className='wallet-button'
                                >
                                    Disconnect Wallet
                                </button>
                            </div>
                            : <div
                                className='wallet-button-contatiner'
                            >
                                <button
                                    onClick={handleWalletAction}
                                    className='wallet-button'
                                >
                                    Connect Ton Wallet
                                </button>
                            </div>
                    }
                </div>
            </List>
        </Box>
    );

    return (
        <div>
            <Button onClick={toggleDrawer(true)}><img
                src="/icons/wallet.svg"
                alt=''
                height={18}
                width={20}
            /></Button>
            <Drawer open={open} onClose={toggleDrawer(false)}>
                {DrawerList}
            </Drawer>
        </div>
    );
}