'use client';

import { ConnectKitButton } from "connectkit";

export default function ConnectButton({avatar, balance}) {
    return (
        <div>
           <ConnectKitButton mode='dark'/>
        </div>
    );
}