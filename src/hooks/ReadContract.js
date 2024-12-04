import { useReadContract, useAccount, useBalance } from "wagmi";
import { saleInfo } from "@/lib/presaleInfo";

export function useContractInfo() {
  const { address } = useAccount();
  const { data: priceSonic } = useReadContract({
    address: saleInfo.contractAddress,
    abi: saleInfo.abi,
    functionName: "tokenPriceETH",
  });

  const { data: priceUSDT } = useReadContract({
    address: saleInfo.contractAddress,
    abi: saleInfo.abi,
    functionName: "tokenPriceUSDT",
  });

  const { data: saleState } = useReadContract({
    address: saleInfo.contractAddress,
    abi: saleInfo.abi,
    functionName: "saleActive",
  });

  const { data: claimState } = useReadContract({
    address: saleInfo.contractAddress,
    abi: saleInfo.abi,
    functionName: "claimActive",
  });

  const { data: balance } = useReadContract({
    address: saleInfo.contractAddress,
    abi: saleInfo.abi,
    functionName: "maxTokenForSale",
  });

  const { data: bought } = useReadContract({
    address: saleInfo.contractAddress,
    abi: saleInfo.abi,
    functionName: "currentTokenSold",
  });

  const { data: userAllowance, refetch: refetchuserAllowance } = useReadContract({
    address: saleInfo.usdtAddress,
    abi: saleInfo.abi,
    functionName: "allowance",
    args: [address, saleInfo.contractAddress],
  });

  const { data: userInfo, refetch: refetchUserInfo} = useReadContract({
    address: saleInfo.contractAddress,
    abi: saleInfo.abi,
    functionName: "userInfo",
    args: [address],
  });

  const userSBalance = useBalance({
    address: address,
    
  })

  const { data: userUSDTBalance, refetch: userUSDTBalanceRefetch } = useReadContract({
    address: saleInfo.usdtAddress,
    abi: saleInfo.abi,
    functionName: "balanceOf",
    args: [address],
  });

  return {
    priceSonic,
    priceUSDT,
    saleState,
    claimState,
    balance,
    bought,
    userAllowance,
    refetchuserAllowance,
    userInfo,
    refetchUserInfo,
    userSBalance,
    userUSDTBalance,
    userUSDTBalanceRefetch
  };
}
