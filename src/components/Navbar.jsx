import React from 'react'
import { Wallet } from './NavButtons/Wallet'

export const Navbar = ({
    setToast,
    setToastMessage
}) => {
    return (
        <div
            className='navbar'
        >
            <Wallet
                setToast={setToast}
                setToastMessage={setToastMessage}
            />
            <div>
                <img
                    src="/icons/list.svg"
                    alt=""
                    height={24}
                    width={24}
                />
            </div>
            <div>
                <img
                    src="/icons/ai-agent.svg"
                    alt=""
                    height={80}
                    width={80}
                />
            </div>
            <div>
                <img
                    src="/icons/explorer.svg"
                    alt=""
                    height={24}
                    width={24}
                />
            </div>
            <div>
                <img
                    src="/icons/group.svg"
                    alt=""
                    height={24}
                    width={24}
                />                
            </div>
        </div>
    )
}
