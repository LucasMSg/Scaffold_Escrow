import { useContractReader } from "eth-hooks";
import { Link } from "react-router-dom";
import { Button, Card, Divider, Form, Input, List } from "antd";
import React, { useCallback, useEffect, useState } from "react";
import { getRPCPollTime } from "../helpers";
import { create } from "ipfs-http-client";
import { utils } from "ethers";
import { Address } from "../components";

const { ethers } = require("ethers");

const { BufferList } = require("bl");
// https://www.npmjs.com/package/ipfs-http-client

/**
 * web3 props can be passed from '../App.jsx' into your local view component for use
 * @param {*} yourLocalBalance balance on current network
 * @param {*} readContracts contracts from current chain already pre-loaded using ethers contract module. More here https://docs.ethers.io/v5/api/contract/contract/
 * @returns react component
 **/
function EscrowView({
  yourLocalBalance,
  readContracts,
  signer,
  tx,
  writeContracts,
  localProvider,
  contractConfig,
  blockExplorer,
  mainnetProvider,
}) {
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

  const [yourCollectibles, setYourCollectibles] = useState();

  const EscrowAdd = useContractReader(readContracts, "Escrow", "address");
  const balance = useContractReader(readContracts, "ERC721Mintable", "balanceOf", [EscrowAdd]);

  useEffect(() => {
    const updateYourCollectibles = async () => {
      const collectibleUpdate = [];
      for (let tokenIndex = balance; tokenIndex < balance; tokenIndex++) {
        try {
          console.log("Getting token index", tokenIndex);
          const tokenId = await readContracts.ERC721Mintable.tokenOfOwnerByIndex(
            readContracts.Escrow.address,
            tokenIndex,
          );

          try {
            collectibleUpdate.push({
              id: tokenId,
              owner: readContracts.Escrow.address /* , uri: tokenURI, owner: address, ...jsonManifest */,
            });
          } catch (e) {
            console.log(e);
          }
        } catch (e) {
          console.log(e);
        }
      }
      setYourCollectibles(collectibleUpdate);
    };
    updateYourCollectibles();
  }, [balance, readContracts]);

  return (
    <div>
      <div style={{ border: "1px solid #cccccc", padding: 16, width: 400, margin: "auto", marginTop: 64 }}>
        <h2>Add new feature</h2>
        <Divider />
        <label>Token Address </label>
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
      {/* trying to list the tokens belonging to escrow */}
      <h2>{balance + " Tokens"}</h2>
      <h2>{"Address " + EscrowAdd}</h2>
      <List
        bordered
        dataSource={yourCollectibles}
        renderItem={item => {
          const id = item.id.toNumber();
          return (
            <List.Item key={id /*+ "_" + item.uri + "_" + item.owner */}>
              <Card
                title={
                  <div>
                    <span style={{ fontSize: 16, marginRight: 8 }}>{"Token"}</span> #{id /* item.name */}
                  </div>
                }
              ></Card>
              {
                <div>
                  Owner:{" "}
                  <Address
                    address={item.owner}
                    ensProvider={mainnetProvider}
                    blockExplorer={blockExplorer}
                    fontSize={16}
                  />
                  {
                    <Button
                      onClick={async () => {
                        const result = await tx(
                          writeContracts.ERC721Mintable.approve(readContracts.Escrow.address, id),
                        );
                        console.log(result);
                      }}
                    >
                      Escrow Approve
                    </Button>
                  }
                </div>
              }
            </List.Item>
          );
        }}
      />
    </div>
  );
}

export default EscrowView;
