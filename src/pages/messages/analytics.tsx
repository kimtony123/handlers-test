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
  const [isaddprojectG, setIsAddProjectG] = useState(false);
  const [isaddprojectH, setIsAddProjectH] = useState(false);
  const [isaddprojectI, setIsAddProjectI] = useState(false);
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

  const Reviews = "-E8bZaG3KJMNqwCCcIqFKTVzqNZgXxqX9Q32I_M3-Wo";

  const AIRDROP = "a_YRsw_22Dw5yPdQCUmVFAeI8J3OUsCGc_z0KrtEvNg";

  const appId = "TX2";
  // In addproject function, use these values directly
  const addProjectB = async () => {
    setIsAddProjectB(true);
    try {
      const getTradeMessage = await message({
        process: Reviews,
        tags: [
          { name: "Action", value: "FetchAppReviewsCount" },
          { name: "appId", value: String(appId) },
        ],
        signer: createDataItemSigner(window.arweaveWallet),
      });
      const { Messages, Error } = await result({
        message: getTradeMessage,
        process: Reviews,
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

  // In addproject function, use these values directly
  const AddProjectC = async () => {
    setIsAddProjectC(true);

    try {
      const getTradeMessage = await message({
        process: Reviews,
        tags: [
          { name: "Action", value: "FetchAppRatings" },
          { name: "appId", value: String(appId) },
        ],
        signer: createDataItemSigner(window.arweaveWallet),
      });
      const { Messages, Error } = await result({
        message: getTradeMessage,
        process: Reviews,
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

  const Favorites = "2aXLWDFCbnxxBb2OyLmLlQHwPnrpN8dDZtB9Y9aEdOE";

  const AddProjectD = async () => {
    setIsAddProjectD(true);

    const appId = "TX1";

    try {
      const getTradeMessage = await message({
        process: Favorites,
        tags: [
          { name: "Action", value: "FetchFavoritesCount" },
          { name: "appId", value: String(appId) },
        ],
        signer: createDataItemSigner(window.arweaveWallet),
      });
      const { Messages, Error } = await result({
        message: getTradeMessage,
        process: Favorites,
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

    try {
      const getTradeMessage = await message({
        process: Favorites,
        tags: [
          { name: "Action", value: "FetchFavoritesCountHistory" },
          { name: "appId", value: String(appId) },
        ],
        signer: createDataItemSigner(window.arweaveWallet),
      });
      const { Messages, Error } = await result({
        message: getTradeMessage,
        process: Favorites,
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

  const DevForum = "xs_gSLAAdqPYPRhHrNmdyktmgiJBExWycxNahLKaPy4";

  const AddProjectF = async () => {
    setIsAddProjectF(true);

    const appId = "TX1";
    try {
      const getTradeMessage = await message({
        process: DevForum,
        tags: [
          { name: "Action", value: "GetDevForumCount" },
          { name: "appId", value: String(appId) },
        ],
        signer: createDataItemSigner(window.arweaveWallet),
      });
      const { Messages, Error } = await result({
        message: getTradeMessage,
        process: DevForum,
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

  const FeatureRequest = "xs_gSLAAdqPYPRhHrNmdyktmgiJBExWycxNahLKaPy4";

  const AddProjectG = async () => {
    setIsAddProjectG(true);

    const appId = "TX1";
    try {
      const getTradeMessage = await message({
        process: FeatureRequest,
        tags: [
          { name: "Action", value: "GetDevForumCount" },
          { name: "appId", value: String(appId) },
        ],
        signer: createDataItemSigner(window.arweaveWallet),
      });
      const { Messages, Error } = await result({
        message: getTradeMessage,
        process: FeatureRequest,
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
      setIsAddProjectG(false);
    }
  };

  const BugReports = "x_CruGONBzwAOJoiTJ5jSddG65vMpRw9uMj9UiCWT5g";

  const AddProjectH = async () => {
    setIsAddProjectH(true);

    const appId = "TX1";
    try {
      const getTradeMessage = await message({
        process: BugReports,
        tags: [
          { name: "Action", value: "GetBugReportCount" },
          { name: "appId", value: String(appId) },
        ],
        signer: createDataItemSigner(window.arweaveWallet),
      });
      const { Messages, Error } = await result({
        message: getTradeMessage,
        process: BugReports,
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
      setIsAddProjectH(false);
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
            Analytics
          </Header>

          <Grid textAlign="center">
            <GridRow>
              <Button
                primary
                loading={isaddprojectB}
                onClick={() => addProjectB()} // Open the Confirm popup
              >
                FetchReviewsCount
              </Button>
            </GridRow>
            <GridRow>
              <Button
                primary
                loading={isaddprojectC}
                onClick={() => AddProjectC()} // Open the Confirm popup
              >
                FetchAppRatings
              </Button>
            </GridRow>

            <GridRow>
              <Button
                primary
                loading={isaddprojectD}
                onClick={() => AddProjectD()} // Open the Confirm popup
              >
                FetchFavoritesCount.
              </Button>
            </GridRow>

            <GridRow>
              <Button
                primary
                loading={isaddprojectE}
                onClick={() => AddProjectE()} // Open the Confirm popup
              >
                FetchFavoritesCountHistory.
              </Button>
            </GridRow>
            <GridRow>
              <Button
                primary
                loading={isaddprojectF}
                onClick={() => AddProjectF()} // Open the Confirm popup
              >
                FetchDevForumCount
              </Button>
            </GridRow>
            <GridRow>
              <Button
                primary
                loading={isaddprojectG}
                onClick={() => AddProjectG()} // Open the Confirm popup
              >
                FetchFeaturesRequestCount.
              </Button>
            </GridRow>
            <GridRow>
              <Button
                primary
                loading={isaddprojectH}
                onClick={() => AddProjectH()} // Open the Confirm popup
              >
                FetchugReportsCount.
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
