'use client';

import { useMemo } from 'react';
import { useAccount, useReadContract, useWriteContract } from 'wagmi';
import { parseEther } from 'viem';
import { roulEthRouletteAbi } from '@/lib/rouletteAbi';

type BetType = 'red' | 'black' | 'green';

function betTypeToEnum(type: BetType): number {
  // enum BetType { Red, Black, Green }
  if (type === 'red') return 0;
  if (type === 'black') return 1;
  return 2;
}

export function useRouletteContract() {
  const { isConnected } = useAccount();
  const address = process.env.NEXT_PUBLIC_ROULETTE_CONTRACT_ADDRESS as `0x${string}` | undefined;

  const contract = useMemo(() => {
    if (!address) return null;
    return { address, abi: roulEthRouletteAbi as unknown as any } as const;
  }, [address]);

  const bankroll = useReadContract(
    contract
      ? { ...contract, functionName: 'bankroll' }
      : ({ query: { enabled: false } } as any)
  );

  const minBetWei = useReadContract(
    contract
      ? { ...contract, functionName: 'minBetWei' }
      : ({ query: { enabled: false } } as any)
  );

  const maxBetWei = useReadContract(
    contract
      ? { ...contract, functionName: 'maxBetWei' }
      : ({ query: { enabled: false } } as any)
  );

  const { writeContractAsync, isPending } = useWriteContract();

  async function placeBet(type: BetType, amountEth: number) {
    if (!contract) throw new Error('CONTRACT_ADDRESS_NOT_SET');
    if (!isConnected) throw new Error('WALLET_NOT_CONNECTED');
    if (!Number.isFinite(amountEth) || amountEth <= 0) throw new Error('INVALID_AMOUNT');

    return await writeContractAsync({
      ...contract,
      functionName: 'placeBet',
      args: [betTypeToEnum(type)],
      value: parseEther(amountEth.toString()),
    });
  }

  return {
    enabled: Boolean(contract),
    address: contract?.address,
    placeBet,
    isPlacingBet: isPending,
    bankroll,
    minBetWei,
    maxBetWei,
  };
}

