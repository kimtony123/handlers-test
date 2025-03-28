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
  const [isaddproject, setIsAddProject] = useState(false);

  const [processId, setProcessId] = useState("");

  const ARS = "8vRoa-BDMWaVzNS-aJPHLk_Noss0-x97j88Q3D4REnE";

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    switch (name) {
      case "processid":
        setProcessId(value);
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

  const addProjectA = async () => {
    setIsAddProject(true);
    const appName = "ao";
    const description = "The hyper parallel computer is here";
    const protocol = "Arweave";
    const profileUrl =
      "https://pbs.twimg.com/media/Gh1cRRvXkAAXLSS?format=jpg&name=small";
    const username = "Tony.";
    const websiteUrl = "https://ao.arweave.net/";
    const twitterUrl = "https://x.com/aoTheComputer";
    const discordUrl = "https://t.co/MRPlRgaOIK";
    const coverUrl =
      "https://pbs.twimg.com/media/Gh1cRRvXkAAXLSS?format=jpg&name=small";
    const bannerUrlsArray = [
      "https://pbs.twimg.com/card_img/1881377031050641408/fhU9RE09?format=png&name=small",
      "https://pbs.twimg.com/media/Gg7oSRZbkAAH7Fg?format=jpg&name=small",
      "https://pbs.twimg.com/media/Gc0ZPswaIAAzldO?format=jpg&name=small",
    ];
    const companyName = "Forward Research ";
    const appIconUrl =
      "https://pbs.twimg.com/profile_images/1754959934574194689/ELTjnnBj_400x400.png";

    const projectType = "Infrastructure";
    // Convert the bannerUrls array to a Lua-style table format
    const bannerUrlsLua = `{ ${bannerUrlsArray
      .map((url, index) => `[${index + 1}] = "${url}"`)
      .join(", ")} }`;
    // JSON-encode it for AO Computer
    const bannerUrlsEncoded = JSON.stringify(bannerUrlsLua);

    try {
      const getTradeMessage = await message({
        process: ARS,
        tags: [
          { name: "Action", value: "AddProjectZ" },
          { name: "appName", value: String(appName) },
          { name: "description", value: String(description) },
          { name: "protocol", value: String(protocol) },
          { name: "websiteUrl", value: String(websiteUrl) },
          { name: "twitterUrl", value: String(twitterUrl) },
          { name: "discordUrl", value: String(discordUrl) },
          { name: "coverUrl", value: String(coverUrl) },
          { name: "bannerUrls", value: bannerUrlsEncoded }, // Pass the JSON-encoded Lua table
          { name: "companyName", value: String(companyName) },
          { name: "appIconUrl", value: String(appIconUrl) },
          { name: "username", value: String(username) },
          { name: "profileUrl", value: String(profileUrl) },
          { name: "projectType", value: String(projectType) },
        ],
        signer: createDataItemSigner(window.arweaveWallet),
      });

      const { Messages, Error } = await result({
        message: getTradeMessage,
        process: ARS,
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
      setIsAddProject(false);
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
            Add Your Projects.
          </Header>

          <Grid textAlign="center">
            <GridRow>
              <Button
                primary
                loading={isaddproject}
                onClick={() => addProjectA()} // Open the Confirm popup
              >
                Add Project A.
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
