import classNames from "classnames";
import React, { useState, useEffect } from "react";
import {
  Button,
  Container,
  Divider,
  DropdownProps,
  Form,
  FormField,
  FormSelect,
  Input,
  Confirm,
  Header,
  GridRow,
  Grid,
} from "semantic-ui-react";
import * as othent from "@othent/kms";
import { message, createDataItemSigner, result } from "@permaweb/aoconnect";
import { PermissionType } from "arconnect";

import Footer from "../../components/footer/Footer";

const permissions: PermissionType[] = [
  "ACCESS_ADDRESS",
  "SIGNATURE",
  "SIGN_TRANSACTION",
  "DISPATCH",
];

interface Tag {
  name: string;
  value: string;
}
const addaoprojects = () => {
  const [isaddprojectB, setIsAddProjectB] = useState(false);
  const [isaddprojectC, setIsAddProjectC] = useState(false);
  const [isaddprojectD, setIsAddProjectD] = useState(false);
  const [isaddprojectE, setIsAddProjectE] = useState(false);
  const [sendSuccess, setSuccess] = useState(false);
  const [loadingAirdrops, setLoadingAirdrops] = useState(true);
  const [depositAmount, setDepositAmount] = useState("");
  const [isLoadingDeposit, setIsLoadingDeposit] = useState(false);

  const [processId, setProcessId] = useState("");

  const ARS = "8vRoa-BDMWaVzNS-aJPHLk_Noss0-x97j88Q3D4REnE";

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    switch (name) {
      case "processid":
        setProcessId(value);
        break;
      case "depositamount":
        setDepositAmount(value);
        break;
      default:
        break;
    }
  };

  // Function to reload the page.
  function reloadPage(forceReload = false): void {
    if (forceReload) {
      // Force reload from the server
      location.href = location.href;
    } else {
      // Reload using the cache
      location.reload();
    }
  }

  const AIRDROP = "LkCdB2PkYRl4zTChv1DiTtiLqr5Qpu0cJ6V6mvHUnOo";

  const Tip = async () => {
    setIsLoadingDeposit(true); // Start spinner for deposit
    const appId = "TX1";
    const processId = "u2-XxndlJvyjDXU1uurYD8CTf3kehwDGEuSmTOyJwrU";
    const deposit = 10;
    const tokenDenomination = 1000;
    const tokenName = "Aostore";
    const tokenTicker = "AOS";

    const realDeposit = deposit * tokenDenomination;
    try {
      const getSwapMessage = await message({
        process: processId,
        tags: [
          { name: "Action", value: "Transfer" },
          { name: "Recipient", value: String(ARS) },
          { name: "Quantity", value: String(realDeposit) },
        ],
        signer: createDataItemSigner(window.arweaveWallet),
      });

      const { Messages, Error } = await result({
        message: getSwapMessage,
        process: processId,
      });

      if (Error) {
        alert("Error Sending Token: " + Error);
        return;
      }

      if (
        Messages?.[0].Tags.find((tag: Tag) => tag.name === "Action")?.value ===
        "Debit-Notice"
      ) {
        setSuccess(true);
      }

      const getPropMessage = await message({
        process: AIRDROP,
        tags: [
          { name: "Action", value: "TipsEarned" },
          { name: "appId", value: String(appId) },
          { name: "tokenId", value: String(processId) },
          { name: "tokenName", value: String(tokenName) },
          { name: "tokenTicker", value: String(tokenTicker) },
          { name: "tokenDenomination", value: String(tokenDenomination) },
          { name: "amount", value: String(deposit) },
        ],
        signer: createDataItemSigner(window.arweaveWallet),
      });

      const depositResult = await result({
        message: getPropMessage,
        process: AIRDROP,
      });

      if (depositResult.Error) {
        alert("Error Depositing : " + depositResult.Error);
      } else {
        const data = Messages[Messages.length - 1]?.Data; // Get the last message's data
        console.log("Last message data:", data);
        alert(depositResult.Messages[0].Data);
        setDepositAmount("");
        setProcessId("");
      }
    } catch (error) {
      alert("Error in deposit process: " + error);
    } finally {
      setIsLoadingDeposit(false); // Stop spinner for deposit
      reloadPage(true);
    }
  };

  const AddProjectD = async () => {
    setIsAddProjectD(true);

    const appId = "TX1";
    const tokenId = "u2-XxndlJvyjDXU1uurYD8CTf3kehwDGEuSmTOyJwrU";
    const tokenName = "Aostore";
    const tokenTicker = "AOS";
    const tokenDenomination = "1000";
    const logo =
      "https://pbs.twimg.com/media/Gm-Vr-XXUAAHBB-?format=jpg&name=small";

    try {
      const getTradeMessage = await message({
        process: AIRDROP,
        tags: [
          { name: "Action", value: "AddTokenDetails" },
          { name: "appId", value: String(appId) },
          { name: "tokenId", value: String(tokenId) },
          { name: "logo", value: String(logo) },
          { name: "tokenName", value: String(tokenName) },
          { name: "tokenTicker", value: String(tokenTicker) },
          { name: "tokenDenomination", value: String(tokenDenomination) },
        ],
        signer: createDataItemSigner(window.arweaveWallet),
      });
      const { Messages, Error } = await result({
        message: getTradeMessage,
        process: AIRDROP,
      });

      if (Error) {
        console.log(Error);
        alert("Error Adding Project:" + Error);
        return;
      }
      if (!Messages || Messages.length === 0) {
        alert("No messages were returned from ao. Please try later.");
        return;
      }
      const data = Messages[Messages.length - 1]?.Data; // Get the last message's data
      console.log("Last message data:", data);
    } catch (error) {
      alert("There was an error in the trade process: " + error);
    } finally {
      setIsAddProjectD(false);
    }
  };

  return (
    <div
      className={classNames(
        "content text-black dark:text-white flex flex-col h-full justify-between"
      )}
    >
      <div className="text-white flex flex-col items-center lg:items-start">
        <Container textAlign="center">
          <Header textAlign="center" as="h1">
            Tips.
          </Header>

          <Grid textAlign="center">
            <GridRow>
              <Button
                primary
                loading={isLoadingDeposit}
                onClick={() => Tip()} // Open the Confirm popup
              >
                Tip.
              </Button>
            </GridRow>

            <GridRow>
              <Button
                primary
                loading={isaddprojectD}
                onClick={() => AddProjectD()} // Open the Confirm popup
              >
                AddTokenDetails.
              </Button>
            </GridRow>
          </Grid>
        </Container>
        <Divider />
      </div>
      <Footer />
    </div>
  );
};

export default addaoprojects;
