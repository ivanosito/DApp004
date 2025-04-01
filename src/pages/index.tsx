import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { getContract } from '../../utils/contract';

export default function Home() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [ethBalance, setEthBalance] = useState<string | null>(null);
  const [contractBalance, setContractBalance] = useState<string | null>(null);
  const [ownerAddress, setOwnerAddress] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState<boolean | null>(null);
  const [tipAmount, setTipAmount] = useState<string>('0.01');
  const [isOwner, setIsOwner] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!;
  const chainId = Number(process.env.NEXT_PUBLIC_CHAIN_ID);

  const connectWallet = async () => {
    if (typeof window.ethereum === 'undefined') {
      alert("Please install MetaMask.");
      return;
    }

    try {
      const [account] = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });
      setWalletAddress(account);
    } catch (err) {
      console.error("User denied account access", err);
    }
  };

  const loadContractData = async () => {
    if (!walletAddress || typeof window.ethereum === 'undefined') return;

    const provider = new ethers.BrowserProvider(window.ethereum);
    const contract = getContract(provider);

    const bal = await provider.getBalance(contractAddress);
    setContractBalance(ethers.formatEther(bal));

    const owner = await contract.owner();
    setOwnerAddress(owner);
    setIsOwner(owner.toLowerCase() === walletAddress.toLowerCase());

    const paused = await contract.tipsPaused();
    setIsPaused(paused);
  };

  const sendTip = async () => {
    if (!walletAddress || typeof window.ethereum === 'undefined') return;
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = getContract(signer);

    try {
      const tx = await contract.sendTip({
        value: ethers.parseEther(tipAmount)
      });
      setStatus("Sending tip...");
      await tx.wait();
      setStatus("Tip sent!");
      loadContractData();
    } catch (e) {
      console.error(e);
      setStatus("Transaction failed.");
    }
  };

  const pauseTips = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = getContract(signer);
    const tx = await contract.pauseTips();
    await tx.wait();
    loadContractData();
  };

  const resumeTips = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = getContract(signer);
    const tx = await contract.resumeTips();
    await tx.wait();
    loadContractData();
  };

  const withdraw = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = getContract(signer);
    const tx = await contract.withdraw();
    await tx.wait();
    loadContractData();
  };

  useEffect(() => {
    if (walletAddress) {
      loadContractData();
    }
  }, [walletAddress]);

  return (
    <main className="p-8 font-mono text-white bg-black min-h-screen">
      <h1 className="text-3xl mb-4">🧙 TipJar With Modifiers</h1>
      {!walletAddress ? (
        <button onClick={connectWallet} className="bg-blue-600 px-4 py-2 rounded">
          🔌 Connect Wallet
        </button>
      ) : (
        <div className="space-y-4">
          <p><strong>🧝 Address:</strong> {walletAddress}</p>
          <p><strong>📜 Contract:</strong> {contractAddress}</p>
          <p><strong>💰 Contract Balance:</strong> {contractBalance} ETH</p>
          <p><strong>👑 Owner:</strong> {ownerAddress}</p>
          <p><strong>⛔ Paused:</strong> {isPaused ? "Yes" : "No"}</p>

          <div className="space-x-2">
            <input
              type="number"
              step="0.01"
              min="0"
              value={tipAmount}
              onChange={(e) => setTipAmount(e.target.value)}
              className="text-black p-1"
            />
            <button onClick={sendTip} className="bg-green-600 px-4 py-2 rounded">
              💸 Send Tip
            </button>
          </div>

          {isOwner && (
            <div className="space-x-2">
              <button onClick={pauseTips} className="bg-yellow-600 px-4 py-2 rounded">⛔ Pause Tips</button>
              <button onClick={resumeTips} className="bg-indigo-600 px-4 py-2 rounded">▶️ Resume Tips</button>
              <button onClick={withdraw} className="bg-red-600 px-4 py-2 rounded">💰 Withdraw</button>
            </div>
          )}

          {status && <p><strong>Status:</strong> {status}</p>}
        </div>
      )}
    </main>
  );
}
