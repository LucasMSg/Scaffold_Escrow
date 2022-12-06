import { useContractReader } from "eth-hooks";
import { Link } from "react-router-dom";
import { Button, Card, Divider, Form, Input } from "antd";
import React, { useCallback, useEffect, useState } from "react";
import { getRPCPollTime } from "../helpers";
import { create } from "ipfs-http-client";
import { utils } from "ethers";

const { ethers } = require("ethers");

const { BufferList } = require("bl");
// https://www.npmjs.com/package/ipfs-http-client

/* async function ipfsClient() {
  const ipfs = create({
    host: "localhost",
    port: 5001,
    protocol: "http",
  });
  return ipfs;
} */

/* async function getData(hash) {
  let ipfs = await ipfsClient();

  let asyncitr = ipfs.cat(hash);

  for await (const itr of asyncitr) {
    let data = Buffer.from(itr).toString();
    console.log(data);
  }
} */

// helper function to "Get" from IPFS
// you usually go content.toString() after this...
// const getFromIPFS = async hashToGet => {
//   for await (const file of ipfs.get(hashToGet)) {
//     console.log(file.path);
//     if (!file.content) continue;
//     const content = new BufferList();
//     for await (const chunk of file.content) {
//       content.append(chunk);
//     }
//     console.log(content);
//     return content;
//   }
// };

/**
 * web3 props can be passed from '../App.jsx' into your local view component for use
 * @param {*} yourLocalBalance balance on current network
 * @param {*} readContracts contracts from current chain already pre-loaded using ethers contract module. More here https://docs.ethers.io/v5/api/contract/contract/
 * @returns react component
 **/
function EscrowView({ yourLocalBalance, readContracts, signer, tx, writeContracts, localProvider, contractConfig }) {
  // you can also use hooks locally in your component of choice
  // in this case, let's keep track of 'purpose' variable from our contract

  const [uri, setUri] = useState();
  const [to, setTo] = useState();
  const [signatures, setSignatures] = useState("");
  const [voucherSigner, setVoucherSigner] = useState("");
  const [imageRender, setImageRender] = useState();

  const [tokenAdd, setTokenAdd] = useState();
  const [tokenId, setTokenId] = useState();
  const [timeLock, setTimeLock] = useState();

  return (
    <div>
      <div style={{ border: "1px solid #cccccc", padding: 16, width: 400, margin: "auto", marginTop: 64 }}>
        <h2>Add new feature</h2>
        <Divider />
        <label>Token Address</label>
        <Input
          onChange={e => {
            setTokenAdd(e.target.value);
          }}
        />
        <Button
          style={{ marginTop: 8 }}
          onClick={async () => {
            const result = await tx(writeContracts.Escrow.addFeature(tokenAdd));
            console.log(result);
          }}
        >
          Deposit
        </Button>
        <p>{signatures}</p>
      </div>
      <div style={{ border: "1px solid #cccccc", padding: 16, width: 400, margin: "auto", marginTop: 64 }}>
        <h2>Deposit</h2>
        <Divider />
        <label>Token Address</label>
        <Input
          onChange={e => {
            setTokenAdd(e.target.value);
          }}
        />
        <label>Token Id</label>
        <Input
          onChange={e => {
            setTokenId(e.target.value);
          }}
        />
        <label>Set Timelock</label>
        <Input
          onChange={e => {
            setTimeLock(e.target.value);
          }}
        />
        <Button
          style={{ marginTop: 8 }}
          onClick={async () => {
            const result = await tx(writeContracts.Escrow.deposit(tokenAdd, tokenId, timeLock));
            console.log(result);
          }}
        >
          Deposit
        </Button>
        <p>{signatures}</p>
      </div>
      <div style={{ border: "1px solid #cccccc", padding: 16, width: 400, margin: "auto", marginTop: 64 }}>
        <h2>Withdraw</h2>
        <Divider />
        <label>Token Address</label>
        <Input
          onChange={e => {
            setTokenAdd(e.target.value);
          }}
        />
        <label>Token Id</label>
        <Input
          onChange={e => {
            setTokenId(e.target.value);
          }}
        />
        <Button
          style={{ marginTop: 8, marginRight: 8 }}
          onClick={async () => {
            const result = await tx(writeContracts.Escrow.withdraw(tokenAdd, tokenId));
            console.log(result);
          }}
        >
          Withdraw
        </Button>
      </div>
      <div style={{ border: "1px solid #cccccc", padding: 16, width: 600, margin: "auto", marginTop: 64 }}>
        {/* <a href={metadata}>IMAGE</a> */}
        {imageRender}
      </div>
    </div>
  );
}

export default EscrowView;
