import classNames from "classnames";
import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  CardGroup,
  CommentGroup,
  CommentMetadata,
  CommentText,
  Container,
  Divider,
  DropdownProps,
  Form,
  FormField,
  FormSelect,
  FormTextArea,
  Grid,
  GridColumn,
  GridRow,
  Header,
  Icon,
  Input,
  Label,
  List,
  ListContent,
  ListDescription,
  ListHeader,
  ListIcon,
  ListItem,
  Loader,
  Menu,
  MenuItem,
  MenuMenu,
  Statistic,
  StatisticLabel,
  StatisticValue,
  TextArea,
} from "semantic-ui-react";
import { useParams } from "react-router-dom";

import { Comment as SUIComment } from "semantic-ui-react";

import * as othent from "@othent/kms";
import { FaSpinner } from "react-icons/fa"; // Spinner Icon

import { message, createDataItemSigner, result } from "@permaweb/aoconnect";
import Footer from "../../components/footer/Footer";
import { useNavigate } from "react-router-dom";

interface AppData {
  AppName: string;
  CompanyName: string;
  WebsiteUrl: string;
  ProjectType: string;
  AppIconUrl: string;
  CoverUrl: string;
  Company: string;
  Description: string;
  Ratings: Array<number>; // Assuming ratings are numbers
  AppId: string;
  BannerUrls: Array<string>; // Assuming banner URLs are strings
  CreatedTime: number;
  DiscordUrl: string;
  Downvotes: Array<string>; // Assuming downvotes are strings (user IDs)
  Protocol: string;
  Reviews: Array<string>; // Assuming reviews are strings
  TwitterUrl: string;
  Upvotes: Array<string>; // Assuming upvotes are strings (user IDs)
}

interface LeaderboardEntry {
  name: any;
  ratings: any;
  rank: any;
  AppIconUrl: any;
}

const aoprojectsinfo = () => {
  const { AppId: paramAppId } = useParams();
  const AppId = paramAppId || "defaultAppId"; // Ensure AppId is always a valid string

  const [apps, setAppInfo] = useState<AppData[]>([]);
  const [updateValue, setUpdateValue] = useState("");
  const [getProjectInfo, setGetProjectInfo] = useState("");
  const [loadingApps, setLoadingApps] = useState(true);
  const [loadingAppInfo, setLoadingAppInfo] = useState(true);
  const [rating, setRating] = useState(0); // ✅ State to hold the rating value
  const [updateApp, setUpdatingApp] = useState(false);

  const [projectTypeValue, setProjectTypeValue] = useState<
    string | undefined
  >();
  const [selectedProjectType, setSelectedProjectType] = useState<
    string | undefined
  >(undefined);

  const ARS = "e-lOufTQJ49ZUX1vPxO-QxjtYXiqM8RQgKovrnJKJ18";
  const navigate = useNavigate();

  const updateOptions = [
    { key: "1", text: "OwnerUserName", value: "OwnerUserName" },
    { key: "2", text: "AppName", value: "AppName" },
    { key: "3", text: "Description", value: "Description" },
    { key: "4", text: "Protocol", value: "Protocol" },
    { key: "5", text: "WebsiteUrl", value: "WebsiteUrl" },
    { key: "6", text: "TwitterUrl", value: "TwitterUrl" },
    { key: "7", text: "DiscordUrl", value: "DiscordUrl" },
    { key: "8", text: "CoverUrl", value: "CoverUrl" },
    { key: "9", text: "profileUrl", value: "profileUrl" },
    { key: "10", text: "CompanyName", value: "CompanyName" },
    { key: "11", text: "AppIconUrl", value: "AppIconUrl" },
    { key: "12", text: "BannerUrl1", value: "BannerUrl1" },
    { key: "13", text: "BannerUrl2", value: "BannerUrl2" },
    { key: "14", text: "BannerUrl3", value: "BannerUrl3" },
    { key: "15", text: "BannerUrl4", value: "BannerUrl4" },
    { key: "16", text: "WhatsNew", value: "WhatsNew" },
  ];

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    switch (name) {
      case "updatevalue":
        setUpdateValue(value);
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

  const handleProjectTypeChange = (
    _: React.SyntheticEvent<HTMLElement, Event>,
    data: DropdownProps
  ) => {
    const value = data.value as string | undefined;
    setProjectTypeValue(value);
  };

  useEffect(() => {
    const fetchAppInfo = async () => {
      if (!AppId) return;
      console.log(AppId);
      setLoadingAppInfo(true);

      try {
        const messageResponse = await message({
          process: ARS,
          tags: [
            { name: "Action", value: "AppInfo" },
            { name: "AppId", value: String(AppId) },
          ],
          signer: createDataItemSigner(othent),
        });

        const resultResponse = await result({
          message: messageResponse,
          process: ARS,
        });

        const { Messages, Error } = resultResponse;

        if (Error) {
          alert("Error fetching app info: " + Error);
          return;
        }

        if (Messages && Messages.length > 0) {
          const data = JSON.parse(Messages[0].Data);
          console.log(data);
          setAppInfo(Object.values(data));
        }
      } catch (error) {
        console.error("Error fetching app info:", error);
      } finally {
        setLoadingAppInfo(false);
      }
    };

    (async () => {
      await fetchAppInfo();
    })();
  }, [AppId]);

  const updateproject = async (AppId: string) => {
    if (!AppId) return;
    console.log(AppId);

    setUpdatingApp(true);
    try {
      const getTradeMessage = await message({
        process: ARS,
        tags: [
          { name: "Action", value: "UpdateAppDetails" },
          { name: "AppId", value: String(AppId) },
          { name: "NewValue", value: String(updateValue) },
          { name: "UpdateOption", value: String(projectTypeValue) },
        ],

        signer: createDataItemSigner(othent),
      });
      const { Messages, Error } = await result({
        message: getTradeMessage,
        process: ARS,
      });

      if (Error) {
        alert("Error Updating Project:" + Error);
        return;
      }
      if (!Messages || Messages.length === 0) {
        alert("No messages were returned from ao. Please try later.");
        return;
      }
      const data = Messages[Messages.length - 1]?.Data;
      alert(data);
      setUpdateValue("");
    } catch (error) {
      alert("There was an error in the trade process: " + error);
      console.error(error);
    } finally {
      setUpdatingApp(false);
    }
  };

  const src = "AO.svg";

  return (
    <div
      className={classNames(
        "content text-black dark:text-white flex flex-col h-full justify-between"
      )}
    >
      <div className="text-white flex flex-col items-center lg:items-start">
        <Container>
          {loadingAppInfo ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "60vh",
              }}
            >
              <Loader active inline="centered" size="large">
                Loading App Updates...
              </Loader>
            </div>
          ) : apps ? (
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
                Update App.
              </Header>
              <Form>
                <FormField required>
                  <label>What are you planning to update?</label>
                  <FormSelect
                    options={updateOptions}
                    placeholder="Project Type"
                    value={selectedProjectType}
                    onChange={handleProjectTypeChange}
                  />
                </FormField>
                <FormField required>
                  <label>New Updated Value?</label>
                  <Input
                    type="text"
                    name="updatevalue"
                    value={updateValue}
                    onChange={handleInputChange}
                    placeholder="New Value"
                  />
                </FormField>
                <Button
                  loading={updateApp}
                  color="purple"
                  onClick={() => updateproject(AppId)}
                >
                  {" "}
                  Update App.
                </Button>
              </Form>
            </>
          ) : (
            <Header as="h4" color="grey">
              No reviews found for this app.
            </Header>
          )}
          <Divider />
        </Container>
        <Divider />
      </div>
      <Footer />
    </div>
  );
};

export default aoprojectsinfo;
