import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { Contract } from "ethers";

/**
 * Deploys a contract named "YourContract" using the deployer account and
 * constructor arguments set to the deployer address
 *
 * @param hre HardhatRuntimeEnvironment object.
 */
const deployYourContract: DeployFunction = async function(hre: HardhatRuntimeEnvironment) {
    /*
      On localhost, the deployer account is the one that comes with Hardhat, which is already funded.
  
      When deploying to live networks (e.g `yarn deploy --network goerli`), the deployer account
      should have sufficient balance to pay for the gas fees for contract creation.
  
      You can generate a random account with `yarn generate` which will fill DEPLOYER_PRIVATE_KEY
      with a random private key in the .env file (then used on hardhat.config.ts)
      You can run the `yarn account` command to check your balance in every network.
    */
    const { deployer } = await hre.getNamedAccounts();
    const { deploy } = hre.deployments;
    const arbiEAS = "0xbD75f629A22Dc1ceD33dDA0b68c546A1c035c458"
    const royBase = "0x5FbDB2315678afecb367f032d93F642f64180aa3"
    const amount = 1
    await deploy("RoyBase", {
        from: deployer,
        // Contract constructor arguments
        args: [arbiEAS, royBase, amount],
        log: true,
        // autoMine: can be passed to the deploy function to make the deployment process faster on local networks by
        // automatically mining the contract deployment transaction. There is no effect on live networks.
        autoMine: true,
    });

    // Get the deployed contract to interact with it after deploying.
    const yourContract = await hre.ethers.getContract<Contract>("RoyBase");
    console.log("👋 Initial greeting:", yourContract);
};

export default deployYourContract;

// Tags are useful if you have multiple deploy files and only want to run one of them.
// e.g. yarn deploy --tags YourContract
deployYourContract.tags = ["RoyBase"];
