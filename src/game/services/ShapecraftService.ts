import { ethers } from 'ethers';

export class ShapecraftService {
    private static KEY_CONTRACT = "0x01eB5CF188ba7d075FDf7eDF2BB8426b17CA3320";
    private static EYE_CONTRACT = "0xAA394da7d62E502a7E3dA7e11d21A74c277143d5";
    
    private static ERC1155_ABI = [
        "function balanceOf(address account, uint256 id) view returns (uint256)"
    ];

    static async checkOwnership(address: string) {
        try {
            if (!window.ethereum) {
                throw new Error("No ethereum provider found");
            }

            const provider = new ethers.BrowserProvider(window.ethereum);
            const keyContract = new ethers.Contract(
                this.KEY_CONTRACT, 
                this.ERC1155_ABI, 
                provider
            );

            const keyBalance = await keyContract.balanceOf(address, 1);
            return {
                hasKey: keyBalance > 0
            };
        } catch (error) {
            console.error("Error checking ownership:", error);
            return { hasKey: false };
        }
    }
} 