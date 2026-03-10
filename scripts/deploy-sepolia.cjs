async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with:", deployer.address);

  const Roulette = await ethers.getContractFactory("RoulEthRoulette");
  const roulette = await Roulette.deploy({
    value: ethers.parseEther("0.05"), // bankroll initial (ajuste si besoin)
  });

  await roulette.waitForDeployment();
  const address = await roulette.getAddress();
  console.log("RoulEthRoulette deployed to:", address);
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});

