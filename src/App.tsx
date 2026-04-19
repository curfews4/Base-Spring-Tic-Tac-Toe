import React from 'react';
import '@rainbow-me/rainbowkit/styles.css';
import {
  getDefaultConfig,
  RainbowKitProvider,
  ConnectButton,
  lightTheme,
} from '@rainbow-me/rainbowkit';
import { WagmiProvider, useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { base } from 'wagmi/chains';
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import TicTacToe from './components/TicTacToe';
import { motion } from 'motion/react';
import { Sparkles, CalendarCheck2, ExternalLink } from 'lucide-react';

const config = getDefaultConfig({
  appName: 'Base Spring Tic-Tac-Toe',
  projectId: 'YOUR_PROJECT_ID_HERE', // Replaced by user usually, or use public ones if possible
  chains: [base],
  ssr: true,
});

const queryClient = new QueryClient();

// Mock contract info - in a real app these would be real addresses
const CHECK_IN_CONTRACT_ADDRESS = '0x0000000000000000000000000000000000000000' as `0x${string}`; 
const CHECK_IN_ABI = [
  {
    "inputs": [],
    "name": "checkIn",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
] as const;

const CheckInUI = () => {
    const { isConnected, address } = useAccount();
    const { data: hash, writeContract, isPending, error } = useWriteContract();

    const { isLoading: isConfirming, isSuccess: isConfirmed } = 
        useWaitForTransactionReceipt({ hash });

    const handleCheckIn = () => {
        // This is a placeholder call. Real contract on Base is needed.
        // We simulate the interaction.
        writeContract({
            address: CHECK_IN_CONTRACT_ADDRESS,
            abi: CHECK_IN_ABI,
            functionName: 'checkIn',
            // @ts-ignore - Some wagmi versions require explicit chain/account even if connected
            chain: base,
            account: address,
        });
    };

    return (
        <div className="flex flex-col items-center gap-4 w-full">
            {!isConnected ? (
                <div className="flex flex-col items-center gap-3">
                    <p className="text-sm text-gray-500 font-medium text-center">Подключите кошелек, чтобы сделать чек-ин на Base</p>
                    <ConnectButton />
                </div>
            ) : (
                <div className="flex flex-col items-center gap-4 w-full">
                    <div className="flex items-center justify-between w-full glass-card p-4 bg-white/40 border-dashed">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                <CalendarCheck2 size={24} />
                            </div>
                            <div>
                                <h3 className="font-playful font-bold text-gray-800">Ежедневный Чек-ин</h3>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Сеть Base • Только газ</p>
                            </div>
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleCheckIn}
                            disabled={isPending || isConfirming}
                            className={`px-6 py-2 rounded-full font-bold text-sm shadow-sm transition-all ${
                                isConfirmed 
                                ? 'bg-green-500 text-white cursor-default' 
                                : 'bg-pink-500 text-white hover:bg-pink-600 active:bg-pink-700'
                            }`}
                        >
                            {isPending || isConfirming ? 'Отправка...' : isConfirmed ? 'Готово!' : 'Отметиться'}
                        </motion.button>
                    </div>
                    {isConfirmed && (
                         <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-xs text-green-600 font-bold flex items-center gap-1"
                        >
                            Чек-ин успешно выполнен! <a href={`https://basescan.org/tx/${hash}`} target="_blank" rel="noopener noreferrer" className="underline flex items-center gap-0.5">BaseScan <ExternalLink size={10}/></a>
                        </motion.div>
                    )}
                    {error && (
                        <p className="text-[10px] text-red-500 max-w-[200px] text-center">
                            Оплата газа не прошла (Вероятно, недостаточно средств или контракт-заглушка)
                        </p>
                    )}
                </div>
            )}
        </div>
    );
};

export default function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={lightTheme({
            accentColor: '#0052FF',
            accentColorForeground: 'white',
            borderRadius: 'large',
        })}>
          <div className="min-h-screen flex flex-col">
            {/* Header */}
            <nav className="flex items-center justify-between px-8 py-6 frosted-glass rounded-none border-t-0 border-x-0 bg-white/5 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-base-blue rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(0,82,255,0.5)] border border-white/30 font-bold text-xl">B</div>
                <span className="text-2xl font-black tracking-tighter uppercase">BaseToe</span>
              </div>
              <div className="flex items-center gap-6">
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/20">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-blue-100">Base Mainnet</span>
                </div>
                <ConnectButton label="Connect" showBalance={false} chainStatus="none" />
              </div>
            </nav>

            <main className="flex-1 flex flex-col lg:flex-row p-4 sm:p-8 gap-8 overflow-hidden">
                {/* Game Section */}
                <div className="flex-[1.5] frosted-glass p-8 flex flex-col items-center justify-center relative overflow-hidden bg-white/5 backdrop-blur-2xl">
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz48L3N2Zy4=')] opacity-50 pointer-events-none"></div>
                    <TicTacToe />
                </div>

                {/* Sidebar */}
                <div className="flex-1 flex flex-col gap-6">
                    {/* Check-in Card */}
                    <div className="bg-base-blue rounded-3xl p-6 shadow-2xl relative overflow-hidden">
                         <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full"></div>
                         <h3 className="text-xl font-black mb-2 flex items-center gap-2">
                            Daily Check-in <Sparkles size={20} />
                         </h3>
                         <p className="text-blue-100 text-sm mb-6">Earn XP and Base Points every day. Claims are free, only pay gas fees.</p>
                         <CheckInUI />
                    </div>

                    {/* Stats Card */}
                    <div className="flex-1 frosted-glass p-6 flex flex-col bg-white/5 backdrop-blur-md">
                        <h4 className="text-[10px] uppercase tracking-[0.2em] font-black text-white/40 mb-6">Top Base Players</h4>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/5">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-orange-400"></div>
                                    <span className="text-sm font-bold">vitalik.eth</span>
                                </div>
                                <span className="text-xs font-mono text-blue-300">1,240 XP</span>
                            </div>
                            <div className="flex items-center justify-between p-3 rounded-2xl">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-purple-400"></div>
                                    <span className="text-sm font-bold text-white/70">brian.base</span>
                                </div>
                                <span className="text-xs font-mono text-white/40">980 XP</span>
                            </div>
                            <div className="flex items-center justify-between p-3 rounded-2xl">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-pink-400"></div>
                                    <span className="text-sm font-bold text-white/70">jesse.eth</span>
                                </div>
                                <span className="text-xs font-mono text-white/40">850 XP</span>
                            </div>
                        </div>

                        <div className="mt-auto pt-6">
                            <div className="p-4 rounded-2xl bg-white/5 border border-dashed border-white/20">
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] text-white/50 uppercase font-bold">Builder Code</span>
                                    <span className="text-[10px] font-mono bg-blue-500/20 px-2 py-0.5 rounded text-blue-300 uppercase">Verified</span>
                                </div>
                                <p className="mt-1 text-[10px] font-mono opacity-60 truncate">0xBASE_Tic_Toe_Contract_V1</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="px-8 py-4 flex items-center justify-between text-[10px] text-white/40 uppercase font-black tracking-widest bg-white/2 backdrop-blur-sm">
                <div className="flex gap-6">
                    <span>Built for Base</span>
                    <span className="hidden sm:inline">Smart Wallet Ready</span>
                    <span className="hidden sm:inline">Developer Resources</span>
                </div>
                <div>© 2024 BaseToe Protocol</div>
            </footer>
          </div>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
