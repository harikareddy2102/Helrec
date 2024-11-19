const hre = require("hardhat");

async function main() {
    const HealthRecord = await hre.ethers.getContractFactory("HealthRecord");
    const healthRecord = await HealthRecord.deploy();
    await healthRecord.deployed();
    console.log("HealthRecord contract deployed to:", healthRecord.address);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
