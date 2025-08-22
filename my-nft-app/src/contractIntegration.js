import { useContractRead, useContractWrite } from 'wagmi';

// Read NFT data
const { data: tokenURI } = useContractRead({
  address: '0x...', // Your NFT contract address
  abi: nftAbi,
  functionName: 'tokenURI',
  args: [tokenId]
});

// Mint NFT
const { write: mintNFT } = useContractWrite({
  address: '0x...',
  abi: nftAbi,
  functionName: 'mint'
});
