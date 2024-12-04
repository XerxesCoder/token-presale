import {
  useWriteContract,
  useWaitForTransactionReceipt,
  useAccount,
  useSimulateContract,
} from "wagmi";
import { parseEther } from "viem";
import { toast } from "sonner";
import { useEffect } from "react";
import { saleInfo } from "@/lib/presaleInfo";
import { useContractInfo } from "./ReadContract";

export function useBuyUSDT() {
  const { userUSDTBalanceRefetch } = useContractInfo();

  const {
    data: hashUSDT,
    isPending: isPendingUSDT,
    writeContract,
    error: errorUSDT,
  } = useWriteContract();

  const { isLoading: isConfirmingUSDT, isSuccess: isConfirmedUSDT } =
    useWaitForTransactionReceipt({
      hashUSDT,
    });

  async function buyUSDT() {
    writeContract({
      address: saleInfo.usdtAddress,
      abi: saleInfo.abi,
      functionName: "mint",
      args: [100 * 1e6],
    });
  }

  useEffect(() => {
    if (isPendingUSDT) {
      toast.dismiss();
      toast.loading("Confirming transaction...");
    }

    if (isConfirmedUSDT) {
      userUSDTBalanceRefetch();
      toast.dismiss();
      toast.success("Transaction confirmed!");
    }

    if (errorUSDT) {
      toast.dismiss();
      toast.error(errorUSDT.shortMessage);
    }
  }, [isConfirmedUSDT, isPendingUSDT, errorUSDT]);

  return {
    buyUSDT,
    hashUSDT,
    isPendingUSDT,
    isConfirmingUSDT,
    isConfirmedUSDT,
    errorUSDT,
  };
}

export function useBuy(amount, currency) {
  const { refetchUserInfo, userUSDTBalance } = useContractInfo();

  const { address } = useAccount();
  const { data: hash, isPending, writeContract, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  async function buy() {
    if (currency !== "S" && Number(userUSDTBalance) / 1e6 < amount) {
      toast.error("Insufficient USDT balance");
      return;
    }
    if (currency == "S") {
      writeContract({
        address: saleInfo.contractAddress,
        abi: saleInfo.abi,
        functionName: "buyWithETH",
        value: parseEther(String(amount)),
      });
    } else {
      writeContract({
        address: saleInfo.contractAddress,
        abi: saleInfo.abi,
        functionName: "buyWithUSDT",
        args: [amount * 1e6],
      });
    }
  }

  useEffect(() => {
    if (isPending) {
      toast.dismiss();
      toast.loading("Confirming transaction...");
    }

    if (isConfirmed) {
      refetchUserInfo();
      toast.dismiss();
      toast.success("Transaction confirmed!");
    }

    if (error) {
      toast.dismiss();
      toast.error(error.shortMessage);
    }
  }, [isConfirmed, isPending, error]);

  return {
    buy,
    hash,
    isPending,
    isConfirming,
    isConfirmed,
    error,
  };
}

export function useApprove(amount) {
  const { refetchuserAllowance } = useContractInfo();
  const {
    data: hashApprove,
    isPending: isPendingApprove,
    writeContract,
    error: errorApprove,
  } = useWriteContract();

  const { isLoading: isConfirmingApprove, isSuccess: isConfirmedApprove } =
    useWaitForTransactionReceipt({
      hashApprove,
    });

  async function approve() {
    writeContract({
      address: saleInfo.usdtAddress,
      abi: saleInfo.abi,
      functionName: "approve",
      args: [saleInfo.contractAddress, amount * 1e6],
    });
  }

  useEffect(() => {
    if (isPendingApprove) {
      toast.dismiss();
      toast.loading("Approving...");
    }

    if (isConfirmedApprove) {
      refetchuserAllowance();
      toast.dismiss();
      toast.success("Approved!");
    }

    if (errorApprove) {
      toast.dismiss();
      toast.error(errorApprove.shortMessage);
    }
  }, [isConfirmedApprove, isPendingApprove, errorApprove]);

  return {
    approve,
    hashApprove,
    isPendingApprove,
    isConfirmingApprove,
    isConfirmedApprove,
    errorApprove,
  };
}
