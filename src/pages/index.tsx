// pages/index.tsx
import Link from 'next/link';

export default function LandingPage() {
  return (
    <main style={{ padding: '3rem', fontFamily: 'sans-serif', color: '#eee', background: '#0c0c0c', minHeight: '100vh' }}>
      <h1 style={{ fontSize: '2.5rem' }}>🧙‍♂️ TipJar With Modifiers</h1>
      <p style={{ fontSize: '1.25rem', maxWidth: '700px', marginTop: '1rem' }}>
        A fully decentralized Ethereum-powered tipping system built on Sepolia Testnet. Users can connect their wallets,
        send tips with messages, pause/resume tipping, and withdraw — all directly from the blockchain.
      </p>

      <ul style={{ marginTop: '2rem', listStyle: 'none', padding: 0 }}>
        <li>✅ Smart Contract written in Solidity</li>
        <li>✅ Deployed to Sepolia Testnet</li>
        <li>✅ Frontend powered by Next.js & Ethers.js</li>
        <li>✅ Confetti upon tip success ✨</li>
      </ul>

      <Link href="/app">
        <button style={{
          marginTop: '2rem',
          padding: '0.75rem 1.5rem',
          fontSize: '1.2rem',
          fontWeight: 'bold',
          backgroundColor: '#22c55e',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer'
        }}>
          🚀 Launch DApp
        </button>
      </Link>
    </main>
  );
}
