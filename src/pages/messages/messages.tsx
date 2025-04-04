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
  const [isaddprojectF, setIsAddProjectF] = useState(false);
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

  const AIRDROP = "a_YRsw_22Dw5yPdQCUmVFAeI8J3OUsCGc_z0KrtEvNg";
  const appId = "TX1";
  // In addproject function, use these values directly
  const addProjectB = async () => {
    setIsAddProjectB(true);
    try {
      const getTradeMessage = await message({
        process: AIRDROP,
        tags: [
          { name: "Action", value: "TestSanitizer" },
          { name: "appId", value: String(appId) },
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
      alert(data);
    } catch (error) {
      alert("There was an error in the trade process: " + error);
    } finally {
      setIsAddProjectB(false);
    }
  };

  const deposit = async () => {
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
          { name: "Recipient", value: String(AIRDROP) },
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
          { name: "Action", value: "DepositConfirmedAddNewTask" },
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

  // In addproject function, use these values directly
  const AddProjectC = async () => {
    setIsAddProjectC(true);
    const appId = "TX1";
    const taskId = "PX4";
    const replyId = "RX3";
    try {
      const getTradeMessage = await message({
        process: AIRDROP,
        tags: [
          { name: "Action", value: "RewardTask" },
          { name: "appId", value: String(appId) },
          { name: "taskId", value: String(taskId) },
          { name: "replyId", value: String(replyId) },
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
      alert(data);
    } catch (error) {
      alert("There was an error in the trade process: " + error);
    } finally {
      setIsAddProjectC(false);
    }
  };

  const AddProjectD = async () => {
    setIsAddProjectD(true);

    const taskId = "PX4";
    const appId = "TX1";
    const taskerCount = 5;
    const link = "https://x.com/ar_aostore";
    const description =
      "Create a tweet/thread  about aostore and reply with the tweet Url and get 250 AOS tokens";

    const task = "Create , thread follow on twitter 250 AOS reward";

    const title = "Twitter Task.";
    try {
      const getTradeMessage = await message({
        process: AIRDROP,
        tags: [
          { name: "Action", value: "FinalizeTask" },
          { name: "appId", value: String(appId) },
          { name: "taskId", value: String(taskId) },
          { name: "title", value: String(title) },
          { name: "task", value: String(task) },
          { name: "taskerCount", value: String(taskerCount) },
          { name: "link", value: String(link) },
          { name: "description", value: String(description) },
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

  const AddProjectE = async () => {
    setIsAddProjectE(true);

    const appId = "TX1";
    const taskId = "PX4";
    const username = "TONY";
    const profileUrl = "";
    const rank = "Oracle";
    const url = "https://x.com/ar_aostore/status/1905231430025670998";
    try {
      const getTradeMessage = await message({
        process: AIRDROP,
        tags: [
          { name: "Action", value: "AddTaskReply" },
          { name: "appId", value: String(appId) },
          { name: "taskId", value: String(taskId) },
          { name: "username", value: String(username) },
          { name: "profileUrl", value: String(profileUrl) },
          { name: "rank", value: String(rank) },
          { name: "url", value: String(url) },
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
      setIsAddProjectE(false);
    }
  };

  const AddProjectF = async () => {
    setIsAddProjectF(true);

    const appId = "TX1";
    const taskId = "PX1";
    try {
      const getTradeMessage = await message({
        process: AIRDROP,
        tags: [
          { name: "Action", value: "FetchTaskInfo" },
          { name: "appId", value: String(appId) },
          { name: "taskId", value: String(taskId) },
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
      setIsAddProjectF(false);
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
            Tasks.
          </Header>

          <Grid textAlign="center">
            <GridRow>
              <Button
                primary
                loading={isaddprojectB}
                onClick={() => addProjectB()} // Open the Confirm popup
              >
                FetchAppTasks.
              </Button>
            </GridRow>
            <GridRow>
              <Button
                primary
                loading={isaddprojectC}
                onClick={() => AddProjectC()} // Open the Confirm popup
              >
                Reward User.
              </Button>
            </GridRow>
            <GridRow>
              <Button
                primary
                loading={isLoadingDeposit}
                onClick={() => deposit()} // Open the Confirm popup
              >
                deposit tasks.
              </Button>
            </GridRow>
            <GridRow>
              <Button
                primary
                loading={isaddprojectE}
                onClick={() => AddProjectE()} // Open the Confirm popup
              >
                Add Task reply
              </Button>
            </GridRow>
            <GridRow>
              <Button
                primary
                loading={isaddprojectF}
                onClick={() => AddProjectF()} // Open the Confirm popup
              >
                GetTaskInfo
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
