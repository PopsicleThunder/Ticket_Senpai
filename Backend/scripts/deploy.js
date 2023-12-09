const hre = require("hardhat");

async function main() {
    // Deploy MyERC721
    const MyERC721 = await hre.ethers.getContractFactory("MyERC721");
    const myERC721 = await MyERC721.deploy(

    );
     await myERC721.waitForDeployment(); // This waits for the contract to be deployed
    console.log("MyERC721 deployed to:", myERC721.target);

    // Deploy MyERC1155
    const MyERC1155 = await hre.ethers.getContractFactory("MyERC1155");
    const myERC1155 = await MyERC1155.deploy();
    await myERC1155.waitForDeployment(); // This waits for the contract to be deployed
    console.log("MyERC1155 deployed to:", myERC1155.target);

    // Deploy TicketingPlatform with the addresses of MyERC721 and MyERC1155
    const TicketingPlatform = await hre.ethers.getContractFactory("TicketingPlatform");
    const ticketingPlatform = await TicketingPlatform.deploy(myERC721.target, myERC1155.target);
     await ticketingPlatform.waitForDeployment(); // This waits for the contract to be deployed
    console.log("TicketingPlatform deployed to:", ticketingPlatform.target);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});