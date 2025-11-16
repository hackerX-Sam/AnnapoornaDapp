import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { Aptos, AptosConfig, Network } from '@aptos-labs/ts-sdk';
import { MODULE_ADDRESS, NETWORK } from '../config/constants';

export function useContract() {
  const { account, signAndSubmitTransaction } = useWallet();

  const config = new AptosConfig({ network: Network.TESTNET });
  const aptos = new Aptos(config);

  const donate = async (amount: number, message: string) => {
    if (!account) throw new Error('Wallet not connected');

    const payload = {
      type: 'entry_function_payload',
      function: `${MODULE_ADDRESS}::donation::donate`,
      type_arguments: [],
      arguments: [MODULE_ADDRESS, amount, Array.from(new TextEncoder().encode(message))],
    };

    const response = await signAndSubmitTransaction(payload);
    await aptos.waitForTransaction({ transactionHash: response.hash });
    return response;
  };

  const redeem = async (beneficiary: string, amount: number, purpose: string) => {
    if (!account) throw new Error('Wallet not connected');

    const payload = {
      type: 'entry_function_payload',
      function: `${MODULE_ADDRESS}::donation::redeem`,
      type_arguments: [],
      arguments: [beneficiary, amount, Array.from(new TextEncoder().encode(purpose))],
    };

    const response = await signAndSubmitTransaction(payload);
    await aptos.waitForTransaction({ transactionHash: response.hash });
    return response;
  };

  const initialize = async () => {
    if (!account) throw new Error('Wallet not connected');

    const payload = {
      type: 'entry_function_payload',
      function: `${MODULE_ADDRESS}::donation::initialize`,
      type_arguments: [],
      arguments: [],
    };

    const response = await signAndSubmitTransaction(payload);
    await aptos.waitForTransaction({ transactionHash: response.hash });
    return response;
  };

  const getPoolBalance = async (poolAddress: string): Promise<number> => {
    try {
      const result = await aptos.view({
        payload: {
          function: `${MODULE_ADDRESS}::donation::get_pool_balance`,
          typeArguments: [],
          functionArguments: [poolAddress],
        },
      });
      return Number(result[0]);
    } catch (error) {
      return 0;
    }
  };

  const getTotalDonations = async (poolAddress: string): Promise<number> => {
    try {
      const result = await aptos.view({
        payload: {
          function: `${MODULE_ADDRESS}::donation::get_total_donations`,
          typeArguments: [],
          functionArguments: [poolAddress],
        },
      });
      return Number(result[0]);
    } catch (error) {
      return 0;
    }
  };

  const getTotalRedemptions = async (poolAddress: string): Promise<number> => {
    try {
      const result = await aptos.view({
        payload: {
          function: `${MODULE_ADDRESS}::donation::get_total_redemptions`,
          typeArguments: [],
          functionArguments: [poolAddress],
        },
      });
      return Number(result[0]);
    } catch (error) {
      return 0;
    }
  };

  const getDonorStats = async (donorAddress: string): Promise<{ totalDonated: number; donationCount: number }> => {
    try {
      const result = await aptos.view({
        payload: {
          function: `${MODULE_ADDRESS}::donation::get_donor_stats`,
          typeArguments: [],
          functionArguments: [donorAddress],
        },
      });
      return {
        totalDonated: Number(result[0]),
        donationCount: Number(result[1]),
      };
    } catch (error) {
      return { totalDonated: 0, donationCount: 0 };
    }
  };

  const isAdmin = async (poolAddress: string, userAddress: string): Promise<boolean> => {
    try {
      const result = await aptos.view({
        payload: {
          function: `${MODULE_ADDRESS}::donation::is_admin`,
          typeArguments: [],
          functionArguments: [poolAddress, userAddress],
        },
      });
      return Boolean(result[0]);
    } catch (error) {
      return false;
    }
  };

  return {
    donate,
    redeem,
    initialize,
    getPoolBalance,
    getTotalDonations,
    getTotalRedemptions,
    getDonorStats,
    isAdmin,
    aptos,
  };
}
