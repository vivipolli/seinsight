// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const CommunitySignalOracleModule = buildModule("CommunitySignalOracleModule", (m) => {
  // Get deployer address as initial owner (can be overridden via parameters)
  const initialOwner = m.getParameter("initialOwner", m.getAccount(0));

  // Deploy the CommunitySignalOracle contract
  const oracle = m.contract("CommunitySignalOracle", [initialOwner]);

  return { oracle };
});

export default CommunitySignalOracleModule;
