import { ethers } from 'ethers';
import abi from '../abi/TipJar.json';

const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!;

export const getContract = (providerOrSigner: ethers.Provider | ethers.Signer) => {
  return new ethers.Contract(contractAddress, abi, providerOrSigner);
};
