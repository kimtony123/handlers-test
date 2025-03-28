import classNames from "classnames";
import React, { useState, useEffect } from "react";
import {
  Button,
  Container,
  Divider,
  Form,
  FormField,
  Header,
  Input,
  Loader,
  Menu,
  MenuItem,
  MenuMenu,
  Table,
} from "semantic-ui-react";
import { useParams } from "react-router-dom";
import Calendar from "react-calendar";
import * as othent from "@othent/kms";
import { message, createDataItemSigner, result } from "@permaweb/aoconnect";
import Footer from "../../../components/footer/Footer";
import { useNavigate } from "react-router-dom";

interface Tag {
  name: string;
  value: string;
}

// Home Component
interface AppAirdropData {
  userId: string;
  appId: string;
  tokenId: string;
  amount: number;
  timestamp: number;
  appname: string;
  airdropId: string;
  status: string;
}

const aoprojectsinfo = () => {
  const { AppId: paramAppId } = useParams();
  const AppId = paramAppId || "defaultAppId"; // Ensure AppId is always a valid string
  const [sendSuccess, setSuccess] = useState(false);
  const [loadingAirdrops, setLoadingAirdrops] = useState(true);
  const [airdropData, setAppAirdropData] = useState<AppAirdropData[]>([]);
  const [processId, setProcessId] = useState("");

  const [depositAmount, setDepositAmount] = useState("");
  const [isLoadingDeposit, setIsLoadingDeposit] = useState(false);

  const ARS = "e-lOufTQJ49ZUX1vPxO-QxjtYXiqM8RQgKovrnJKJ18";
  const navigate = useNavigate();

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

  // Ensure AppId is never undefined
  const handleProjectReviewsInfo = (appId: string | undefined) => {
    if (!appId) return;
    navigate(`/projectreviews/${appId}`);
  };

  const handleOwnerStatisticsInfo = (appId: string | undefined) => {
    if (!appId) return;
    navigate(`/projectstats/${appId}`);
  };

  const handleOwnerAirdropInfo = (appId: string | undefined) => {
    if (!appId) return;
    navigate(`/projectairdropsadmin/${appId}`);
  };

  const handleOwnerUpdatesInfo = (appId: string | undefined) => {
    if (!appId) return;
    navigate(`/projectupdates/${appId}`);
  };

  const handleOwnerChange = (appId: string | undefined) => {
    if (!appId) return;
    navigate(`/ownerchange/${appId}`);
  };

  const handleAirdropInfo = (appId: string | undefined) => {
    if (!appId) return;
    navigate(`/airdropinfo/${appId}`);
  };

  const handleNotification = (appId: string | undefined) => {
    if (!appId) return;
    navigate(`/sendupdates/${appId}`);
  };

  const handleFeaturesandBugs = (appId: string | undefined) => {
    if (!appId) return;
    navigate(`/projectfeaturesbugs/${appId}`);
  };

  const handleBugReports = (appId: string | undefined) => {
    if (!appId) return;
    navigate(`/projectbugreports/${appId}`);
  };

  const handleAostoreAi = (appId: string | undefined) => {
    if (!appId) return;
    navigate(`/projectaostoreai/${appId}`);
  };

  const handleTasks = (appId: string | undefined) => {
    if (!appId) return;
    navigate(`/projecttasks/${appId}`);
  };

  useEffect(() => {
    const fetchAirdrops = async () => {
      setLoadingAirdrops(true);
      try {
        const messageResponse = await message({
          process: ARS,
          tags: [{ name: "Action", value: "getOwnerAirdropsN" }],
          signer: createDataItemSigner(othent),
        });

        const resultResponse = await result({
          message: messageResponse,
          process: ARS,
        });

        const { Messages, Error } = resultResponse;

        if (Error) {
          alert("Error fetching airdrops: " + Error);
          return;
        }

        if (!Messages || Messages.length === 0) {
          alert("No messages returned from AO. Please try later.");
          return;
        }
        const data = JSON.parse(Messages[0].Data);
        console.log(data);
        setAppAirdropData(Object.values(data));
      } catch (error) {
        console.error("Error fetching airdrops:", error);
      } finally {
        setLoadingAirdrops(false);
      }
    };

    (async () => {
      await fetchAirdrops();
    })();
  }, []);

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

  const deposit = async () => {
    setIsLoadingDeposit(true); // Start spinner for deposit

    try {
      const getSwapMessage = await message({
        process: processId,
        tags: [
          { name: "Action", value: "Transfer" },
          { name: "Recipient", value: String(ARS) },
          { name: "Quantity", value: String(depositAmount) },
        ],
        signer: createDataItemSigner(othent),
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
        process: ARS,
        tags: [
          { name: "Action", value: "DepositConfirmedN" },
          { name: "AppId", value: String(AppId) },
          { name: "processId", value: String(processId) },
          { name: "Amount", value: String(depositAmount) },
        ],
        signer: createDataItemSigner(othent),
      });

      const depositResult = await result({
        message: getPropMessage,
        process: ARS,
      });

      if (depositResult.Error) {
        alert("Error Depositing : " + depositResult.Error);
      } else {
        alert(depositResult.Messages?.[0]?.Data || "Deposit Successful");
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

  return (
    <div
      className={classNames(
        "content text-black dark:text-white flex flex-col h-full justify-between"
      )}
    >
      <div className="text-white flex flex-col items-center lg:items-start">
        <Container>
          <Divider />

          {loadingAirdrops ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "60vh",
              }}
            >
              <Loader active inline="centered" size="large">
                Loading Airdrops Data...
              </Loader>
            </div>
          ) : (
            <>
              <Menu pointing>
                <MenuItem
                  onClick={() => handleProjectReviewsInfo(AppId)}
                  name="Reviews"
                />
                <MenuItem
                  onClick={() => handleOwnerStatisticsInfo(AppId)}
                  name="Statistics"
                />
                <MenuItem
                  onClick={() => handleOwnerAirdropInfo(AppId)}
                  name="Airdrops"
                />
                <MenuMenu position="right">
                  <MenuItem
                    onClick={() => handleOwnerUpdatesInfo(AppId)}
                    name="Update"
                  />
                  <MenuItem
                    onClick={() => handleOwnerChange(AppId)}
                    name="changeowner"
                  />
                  <MenuItem
                    onClick={() => handleNotification(AppId)}
                    name="Messages."
                  />
                  <MenuItem
                    onClick={() => handleFeaturesandBugs(AppId)}
                    name="F Requests."
                  />
                  <MenuItem
                    onClick={() => handleBugReports(AppId)}
                    name="Bug Reports."
                  />

                  <MenuItem
                    onClick={() => handleAostoreAi(AppId)}
                    name="aostore AI"
                  />
                  <MenuItem
                    onClick={() => handleTasks(AppId)}
                    name="Whats New"
                  />
                </MenuMenu>
              </Menu>
              <Header textAlign="center" as="h1">
                Airdrop Your Users.
              </Header>

              <Header />
              <Form>
                <FormField required>
                  <label>Enter Your Token Process Id.</label>
                  <Input
                    type="text"
                    name="processid"
                    value={processId}
                    onChange={handleInputChange}
                    placeholder="Token Process Id."
                  />
                </FormField>
                <FormField required>
                  <label>Enter Airdrop Amount.</label>
                  <Input
                    type="text"
                    name="depositamount"
                    value={depositAmount}
                    onChange={handleInputChange}
                    placeholder="Enter Airdrop Amount"
                  />
                </FormField>
                <Button
                  loading={isLoadingDeposit}
                  onClick={deposit}
                  color="green"
                >
                  Deposit
                </Button>
              </Form>

              <Divider />
              <Header textAlign="center" as="h1">
                Airdrops.
              </Header>
              <Table celled>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>App name</Table.HeaderCell>
                    <Table.HeaderCell> Amount</Table.HeaderCell>
                    <Table.HeaderCell>AirdropId</Table.HeaderCell>
                    <Table.HeaderCell>Status</Table.HeaderCell>
                    <Table.HeaderCell>Airdrop Info.</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>

                <Table.Body>
                  {airdropData.map((app, index) => (
                    <Table.Row key={index}>
                      <Table.Cell>{app.appname}</Table.Cell>
                      <Table.Cell>{app.amount}</Table.Cell>
                      <Table.Cell>{app.airdropId}</Table.Cell>
                      <Table.Cell>{app.status}</Table.Cell>
                      <Table.Cell>
                        {" "}
                        <Button
                          primary
                          onClick={() => handleAirdropInfo(app.airdropId)}
                        >
                          Airdrop Info
                        </Button>
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            </>
          )}
        </Container>
        <Divider />
      </div>
      <Footer />
    </div>
  );
};

export default aoprojectsinfo;
