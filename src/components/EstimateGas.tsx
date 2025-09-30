import {WHEEL_ABI} from "@/constants/abis";
import {
  API_KEY,
  BUNDLER_ENDPOINT,
  LUCKY_WHEEL_CONTRACT,
  LUCKY_WHEEL_CONTRACT_A8_TESTNET,
  SECRET_KEY,
} from "@/constants/constant";
import {buildContractCallRequest} from "@layerg-ua-sdk/aa-sdk";
import { useWallet } from "@/contexts/WalletContext";

export default function EstimateGas() {
  const { getAPIEndpoint } = useWallet();
  async function estimateGas() {
    const chainId = 2484;
    const wheel_contract =
      chainId === 2484 ? LUCKY_WHEEL_CONTRACT : LUCKY_WHEEL_CONTRACT_A8_TESTNET;
    const txRequest = buildContractCallRequest({
      sender: "0x5da884e2602089AAc923E897b298282a40287C89",
      contractAddress: wheel_contract,
      abi: WHEEL_ABI,
      method: "spin",
      params: [],
    });
    const response = await fetch(
      `${BUNDLER_ENDPOINT}${getAPIEndpoint()}/estimate-user-op-gas`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "x-api-key": API_KEY,
          "x-secret-key": SECRET_KEY,
        },
        body: JSON.stringify({
          chainId: chainId,
          sponsor: true,
          transactionReq: {
            to: txRequest.to,
            value: "0",
            data: txRequest.data,
            maxPriorityFeePerGas: "1800000000",
          },
        }),
      }
    );
    console.log(response);
  }
  return (
    <button
      className="bg-blue-500 text-white px-4 py-2 rounded-md"
      onClick={estimateGas}
    >
      Estimate Gas
    </button>
  );
}
