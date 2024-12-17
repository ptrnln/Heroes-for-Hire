import { ethers } from '../../smart_contracts/node_modules/ethers';
import { TreasureChestABI, TeasureChestAddress } from '../abi/TreasureChest';

export class GameRewardService {
    static async claimTreasureChest(keyTokenId: number = 1) {
        try {
            if (!window.ethereum) {
                throw new Error("No ethereum provider found");
            }

            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            
            const treasureChest = new ethers.Contract(
                TeasureChestAddress,
                TreasureChestABI,
                signer
            );

            // Call the claimWithKey function
            const tx = await treasureChest.claimWithKey(keyTokenId);
            await tx.wait();

            return true;
        } catch (error) {
            console.error("Error claiming treasure chest:", error);
            return false;
        }
    }
} 