import {API_KEY, BUNDLER_ENDPOINT, SECRET_KEY} from "@/constants/constant";
import { useWallet } from "@/contexts/WalletContext";
import { WalletType } from "@/types/wallet";

export default function SignMessage() {
  const { selectedWallet, getAPIEndpoint } = useWallet();
  async function signMessage() {
    const chainId = 2484;
    const apiEndpoint = getAPIEndpoint();
    const response = await fetch(
      `${BUNDLER_ENDPOINT}${apiEndpoint}/sign-message`,
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
          message: "Hello, world!",
          appApiKey: API_KEY,
          walletId: selectedWallet === WalletType.EOA_WALLET ? '633511c9-53f4-4101-b229-aec0bd5a96fe' : undefined,
        }),
      }
    );
    console.log(response);
  }

  async function verifyMessage() {
    const chainId = 2484;
    const apiEndpoint = getAPIEndpoint();
    const response = await fetch(
      `${BUNDLER_ENDPOINT}${apiEndpoint}/verify-message`,
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
          message: "Hello, world!",
          signature:
            "0xa8ec61074223dd6492769c838090e5e017a82921768da5b85d11d5698a5da6a8650039ee7420cb7013499a46d89a7dba7ef2a2bb881ef6aded96b83c2990d79e1b",
          appApiKey: API_KEY,
        }),
      }
    );
    console.log(response);
  }
  return (
    <div className="flex gap-2">
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded-md"
        onClick={signMessage}
      >
        Sign Message
      </button>
      <button
        className="bg-yellow-400 text-white px-4 py-2 rounded-md"
        onClick={verifyMessage}
      >
        Verify Message
      </button>
    </div>
  );
}
