import { SyncOutlined } from "@ant-design/icons";
import { utils } from "ethers";
import { Button, Card, DatePicker, Divider, Input, List, Progress, Slider, Spin, Switch } from "antd";
import React, { useState } from "react";
import { Address, Balance, AddressInput } from "../components";

export default function TokenView({
  purpose,
  setPurposeEvents,
  address,
  mainnetProvider,
  localProvider,
  yourLocalBalance,
  price,
  tx,
  readContracts,
  writeContracts,
  yourCollectibles,
  yourBalance,
  blockExplorer,
  //EscrowAdd,
}) {
  const [transferToAddresses, setTransferToAddresses] = useState({});

  return (
    <div style={{ width: 640, margin: "auto", marginTop: 32, paddingBottom: 32 }}>
      <h2>{yourBalance + " Tokens " /* + EscrowAdd */}</h2>
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
                  <AddressInput
                    ensProvider={mainnetProvider}
                    placeholder="transfer to address"
                    value={transferToAddresses[id]}
                    onChange={newValue => {
                      const update = {};
                      update[id] = newValue;
                      setTransferToAddresses({ ...transferToAddresses, ...update });
                    }}
                  />
                  <Button
                    onClick={() => {
                      console.log("writeContracts", writeContracts);
                      tx(writeContracts.YourCollectible.transferFrom(address, transferToAddresses[id], id));
                    }}
                  >
                    Transfer
                  </Button>
                  {/* <Button
                    onClick={async () => {
                      const result = await tx(writeContracts.ERC721Mintable.approve(id, EscrowAdd));
                      console.log(result);
                    }}
                  >
                    Escrow Approve
                  </Button> */}
                </div>
              }
            </List.Item>
          );
        }}
      />
    </div>
  );
}
