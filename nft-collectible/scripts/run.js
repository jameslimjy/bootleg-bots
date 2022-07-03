const { utils } = require("ethers");

async function main() {
    const baseTokenURI = 'ipfs://QmbXupjn1eyUynGsNF4HHj55PdzzxEjbqaoyDfvLBQSA6X/';

    // get owner/deployer's wallet address
    const [owner] = await hre.ethers.getSigners();

    // get contract to be deployed
    const contractFactory = await hre.ethers.getContractFactory('NFTCollectible');

    // deploy contract
    const contract = await contractFactory.deploy(baseTokenURI);

    // wait for transaction to be mined
    await contract.deployed()

    // get contract address
    console.log('contract deployed to:', contract.address);

    // reserve NFTs
    let txn = await contract.reserveNFTs();
    await txn.wait();
    console.log("10 NFTs have been reserved");

    // mint 3 NFTs by sending ether
    txn = await contract.mintNFTs(3, { value: utils.parseEther('0.03')});
    await txn.wait()

    // get all token IDs of the owner
    let tokens = await contract.tokensOfOwner(owner.address)
    console.log("owner has tokens: ", tokens);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });