"use client";

import Image from "next/image";
import { useState } from "react";
import { Bomb, Loader2 } from "lucide-react";
import ConnectButton from "@/components/ConnectButton";
import { formatEther, parseAbi, parseEther } from "viem";
import {
  useWaitForTransactionReceipt,
  useWriteContract,
  useReadContract,
  useAccount,
} from "wagmi";
import { saleInfo } from "@/lib/presaleInfo";
import { useApprove, useBuy, useBuyUSDT } from "@/hooks/WriteContract";
import { useContractInfo } from "@/hooks/ReadContract";

export default function Home() {
  const { address } = useAccount();
  const [amount, setAmount] = useState(1);
  const [loading, setLoading] = useState(false);
  const [activeCurreny, setActiveCurrency] = useState("S");

  const {
    priceSonic,
    priceUSDT,
    saleState,
    claimState,
    balance,
    bought,
    userAllowance,
    userInfo,
    userSBalance,
    userUSDTBalance,
  } = useContractInfo();

  const userS = address
    ? Number(Number(userSBalance?.data?.value) / 1e18).toFixed(2)
    : 0;

  const { buy, isPending, isConfirming } = useBuy(amount, activeCurreny);
  const { approve, isPendingApprove, isConfirmingApprove } = useApprove(amount);
  const { buyUSDT, isPendingUSDT, isConfirmingUSDT } = useBuyUSDT();

  return (
    <main className="flex flex-col justify-center items-center min-h-screen w-full max-w-7xl mx-auto px-4">
      <div className="max-w-[700px] w-full gap-5 border-2 border-slate-400  rounded-lg flex flex-col justify-start items-start p-4">
        <div className="w-full flex justify-between items-center">
          <h1 className="text-[#FFCB67] text-sm sm:text-xl font-bold tracking-wide">
            BOOM Presale
          </h1>
          <div className="flex justify-center items-center gap-3">
            <button
              disabled={activeCurreny == "S"}
              onClick={() => setActiveCurrency("S")}
              className={`flex justify-center items-center gap-2 text-xs sm:text-sm p-2 rounded-lg text-white disabled:text-slate-950 hover:text-slate-800 bg-cyan-800 hover:bg-cyan-600 disabled:bg-cyan-400  transition-colors ease-in-out `}
            >
              <Image
                src={"/assets/sonic.png"}
                width={30}
                height={30}
                alt="sonic"
              />{" "}
              Sonic
            </button>
            <button
              disabled={activeCurreny == "usdt"}
              onClick={() => setActiveCurrency("usdt")}
              className={`flex justify-center items-center gap-2 text-xs sm:text-sm p-2 rounded-lg text-white disabled:text-slate-950 hover:text-slate-800 bg-cyan-800 hover:bg-cyan-600 disabled:bg-cyan-400 transition-colors ease-in-out `}
            >
              <Image
                src={"/assets/usdt.png"}
                width={28}
                height={28}
                alt="usdt"
              />{" "}
              USDT
            </button>
          </div>
        </div>
        <div className="w-full h-full flex flex-col justify-center items-center gap-3">
          <div className="bg-orange-950 rounded-2xl p-4 flex justify-between items-center gap-5 w-full sm:w-[70%]">
            {activeCurreny == "S" ? (
              <div className="flex flex-col justify-start items-start p-2">
                <div className="flex justify-center items-center gap-2 p-1">
                  <Image
                    src={"/assets/sonic.png"}
                    width={30}
                    height={30}
                    alt="sonic"
                  />
                  <h1 className="text-white uppercase text-sm sm:text-xl font-bold tracking-wide">
                    {activeCurreny}
                  </h1>
                </div>
                <p className="text-xs">Balance: {userS}</p>
              </div>
            ) : (
              <div className="flex flex-col justify-start items-start p-2">
                <div className="flex justify-center items-center gap-2 p-1">
                  <Image
                    src={"/assets/usdt.png"}
                    width={28}
                    height={28}
                    alt="usdt"
                  />
                  <h1 className="text-white uppercase text-sm sm:text-xl font-bold tracking-wide">
                    {activeCurreny}
                  </h1>
                </div>
                <p className="text-xs">
                  Balance: {address ? Number(userUSDTBalance) / 1e6 : 0}
                </p>
              </div>
            )}
            <input
              type="number"
              value={amount}
              placeholder="1"
              className="bg-orange-900 rounded-xl placeholder:text-slate-400 py-2 px-4 outline-none sm:w-[12rem] w-36"
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          <p className="text-sm uppercase tracking-widest">You Will Recieve:</p>
          <div className="bg-orange-950 rounded-2xl p-4 flex justify-between items-center gap-5 w-full sm:w-[70%]">
            <div className="flex justify-center items-center gap-2 p-2">
              <Bomb className="w-8 h-8 stroke-slate-50" />
              <h1 className="text-white uppercase text-sm sm:text-xl font-bold tracking-wide">
                BOOM
              </h1>
            </div>
            <input
              type="number"
              value={amount}
              readOnly
              placeholder="1"
              className="bg-orange-900 rounded-xl placeholder:text-slate-400 p-2 outline-none pointer-events-none sm:w-[12rem] w-36"
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          <p className="text-sm uppercase tracking-wide font-bold">
            1 {activeCurreny} = 1 BOOM{" "}
          </p>
        </div>
        <div className="flex flex-col justify-center items-center w-full gap-3">
          {address ? (
            <>
              {activeCurreny !== "S" &&
              Number(userAllowance) < Number(amount * 1e6) ? (
                <button
                  disabled={isPendingApprove || isConfirmingApprove}
                  className="uppercase flex justify-center items-center text-sm sm:text-xl  font-bold tracking-wider w-full rounded-lg p-2 bg-purple-500 hover:bg-purple-600 active:bg-purple-600 disabled:bg-purple-900  transition-colors ease-in-out"
                  onClick={approve}
                >
                  {isPendingApprove || isConfirmingApprove ? (
                    <Loader2 className="text-white animate-spin text-center" />
                  ) : (
                    "Approve USDT"
                  )}
                </button>
              ) : (
                <button
                  disabled={isPending || isConfirming}
                  className="uppercase flex justify-center items-center text-sm sm:text-xl  font-bold tracking-wider w-full rounded-lg p-2 bg-purple-500 hover:bg-purple-600 active:bg-purple-600 disabled:bg-purple-900 transition-colors ease-in-out"
                  onClick={buy}
                >
                  {isPending || isConfirming ? (
                    <Loader2 className="text-white animate-spin text-center" />
                  ) : (
                    "Buy"
                  )}
                </button>
              )}

              <button
                disabled={!claimState}
                className="uppercase text-sm sm:text-xl font-bold tracking-wider w-full rounded-lg p-2 bg-lime-400 hover:bg-lime-500 active:bg-lime-600 disabled:bg-lime-800 text-slate-950 transition-colors ease-in-out"
              >
                Claim {userInfo ? formatEther(userInfo[0]) : 0} BOOM
              </button>
              <p className="text-sm  tracking-wide font-bold">
                Your Share: {userInfo ? formatEther(userInfo[0]) : 0} BOOM
              </p>
              <ConnectButton />
              <div className="flex justify-center items-center gap-5 w-full">
                <button
                  className="uppercase flex justify-center items-center text-sm sm:text-base font-bold tracking-wider w-full rounded-lg p-2 bg-lime-400 hover:bg-lime-500 active:bg-lime-600 disabled:bg-lime-800 text-slate-950 transition-colors ease-in-out"
                  disabled={isPendingUSDT || isConfirmingUSDT}
                  onClick={buyUSDT}
                >
                  {isPendingUSDT || isConfirmingUSDT ? (
                    <Loader2 className="text-white animate-spin text-center" />
                  ) : (
                    "Get 100 Mock USDT"
                  )}
                </button>
                <a
                  target="_blank"
                  href="https://testnet.soniclabs.com/"
                  className="flex justify-center items-center hover:bg-lime-500 active:bg-lime-600 uppercase text-sm sm:text-base font-bold tracking-wider w-full rounded-lg p-2 bg-lime-400  text-slate-950 "
                >
                  Get S Token
                </a>
              </div>
            </>
          ) : (
            <ConnectButton />
          )}
        </div>
      </div>
    </main>
  );
}
