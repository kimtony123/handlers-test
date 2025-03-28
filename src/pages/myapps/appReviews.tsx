import classNames from "classnames";
import React, { useState, useEffect } from "react";
import {
  Button,
  CommentGroup,
  Container,
  Divider,
  Form,
  Grid,
  Header,
  Icon,
  Loader,
  Menu,
  MenuItem,
  MenuMenu,
  Rating,
  FormField,
  Input,
} from "semantic-ui-react";
import { useParams } from "react-router-dom";
import { Comment as SUIComment } from "semantic-ui-react";
import * as othent from "@othent/kms";
import { message, createDataItemSigner, result } from "@permaweb/aoconnect";
import Footer from "../../components/footer/Footer";
import { useNavigate } from "react-router-dom";

interface Review {
  reviewId: string;
  username: string;
  comment: string;
  rating: number;
  timestamp: number;
  upvotes: number;
  downvotes: number;
  helpfulVotes: number;
  unhelpfulVotes: number;
  profileUrl: string;
  voters: Record<string, any>;
  replies: Reply[];
}

interface Reply {
  replyId: string;
  comment: string;
  timestamp: number;
  upvotes: number;
  downvotes: number;
  user: string;
  username: string;
  profileUrl: string;
}

interface AppData {
  AppName: string;
  CompanyName: string;
  Reviews: Record<string, Review[]>;
  AppId: string;
}

const aoprojectsinfo = () => {
  const { AppId: paramAppId } = useParams();
  const AppId = paramAppId || "defaultAppId"; // Provide a default AppId

  const [appReviews, setAppReviews] = useState<Record<string, any> | null>(
    null
  );
  const [loadingAppReviews, setLoadingAppReviews] = useState(true);
  const [addReviewReply, setAddReviewReply] = useState(false);
  const [comment, setComment] = useState("");
  const [addHelpful, setAddHelpful] = useState(false);
  const [addUnhelpful, setAddUnhelpful] = useState(false);
  const [addUpvote, setAddUpvote] = useState(false);
  const [addDownvote, setAddDownvote] = useState(false);

  const ARS = "e-lOufTQJ49ZUX1vPxO-QxjtYXiqM8RQgKovrnJKJ18";
  const navigate = useNavigate();

  // Ensure AppId is never undefined
  const handleProjectReviewsInfo = (appId: string | undefined) => {
    if (!appId) return;
    navigate(`/projectreviews/${appId}`);
  };
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    switch (name) {
      case "comment":
        setComment(value);
        break;
      default:
        break;
    }
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

  const username = localStorage.getItem("username");
  const profileUrl = localStorage.getItem("profilePic");
  useEffect(() => {
    const fetchAppReviews = async () => {
      setLoadingAppReviews(true);
      try {
        const messageResponse = await message({
          process: ARS,
          tags: [
            { name: "Action", value: "FetchAppReviews" },
            { name: "AppId", value: AppId },
          ],
          signer: createDataItemSigner(othent),
        });

        const resultResponse = await result({
          message: messageResponse,
          process: ARS,
        });

        const { Messages, Error } = resultResponse;

        if (Error) {
          alert("Error fetching app reviews: " + Error);
          return;
        }

        if (Messages && Messages.length > 0) {
          const data = JSON.parse(Messages[0].Data);
          console.log(data);
          setAppReviews(data);
        }
      } catch (error) {
        console.error("Error fetching app reviews:", error);
      } finally {
        setLoadingAppReviews(false);
      }
    };

    fetchAppReviews();
  }, [AppId]);

  const AddReviewReply = async (ReviewID: string) => {
    if (!AppId) return;
    console.log(AppId);
    if (!ReviewID) return;
    console.log(ReviewID);

    setAddReviewReply(true);
    try {
      const getTradeMessage = await message({
        process: ARS,

        tags: [
          { name: "Action", value: "AddReviewReply" },
          { name: "AppId", value: String(AppId) },
          { name: "username", value: String(username) },
          { name: "profileUrl", value: String(profileUrl) },
          { name: "ReviewId", value: String(ReviewID) },
          { name: "comment", value: String(comment) },
        ],
        signer: createDataItemSigner(othent),
      });
      const { Messages, Error } = await result({
        message: getTradeMessage,
        process: ARS,
      });

      if (Error) {
        alert("Error Adding review:" + Error);
        return;
      }
      if (!Messages || Messages.length === 0) {
        alert("No messages were returned from ao. Please try later.");
        return;
      }
      const data = Messages[Messages.length - 1]?.Data;
      alert(data);
    } catch (error) {
      alert("There was an error in the trade process: " + error);
      console.error(error);
    } finally {
      setAddReviewReply(false);
    }
  };

  const AddHelpfulReview = async (ReviewID: string) => {
    if (!AppId) return;
    console.log(AppId);
    if (!ReviewID) return;
    console.log(ReviewID);

    setAddHelpful(true);
    try {
      const getTradeMessage = await message({
        process: ARS,

        tags: [
          { name: "Action", value: "MarkHelpfulReview" },
          { name: "AppId", value: String(AppId) },
          { name: "ReviewId", value: String(ReviewID) },
          { name: "username", value: String(username) },
        ],
        signer: createDataItemSigner(othent),
      });
      const { Messages, Error } = await result({
        message: getTradeMessage,
        process: ARS,
      });

      if (Error) {
        alert("Error Adding :" + Error);
        return;
      }
      if (!Messages || Messages.length === 0) {
        alert("No messages were returned from ao. Please try later.");
        return;
      }
      const data = Messages[Messages.length - 1]?.Data;
      alert(data);
    } catch (error) {
      alert("There was an error in the review process: " + error);
      console.error(error);
    } finally {
      setAddHelpful(false);
    }
  };

  const AddUnhelpfulReview = async (ReviewID: string) => {
    if (!AppId) return;
    console.log(AppId);

    if (!ReviewID) return;
    console.log(ReviewID);

    setAddUnhelpful(true);
    try {
      const getTradeMessage = await message({
        process: ARS,

        tags: [
          { name: "Action", value: "MarkUnhelpfulReview" },
          { name: "AppId", value: String(AppId) },
          { name: "ReviewId", value: String(ReviewID) },
          { name: "username", value: String(username) },
        ],
        signer: createDataItemSigner(othent),
      });
      const { Messages, Error } = await result({
        message: getTradeMessage,
        process: ARS,
      });

      if (Error) {
        alert("Error Adding project to Favorite:" + Error);
        return;
      }
      if (!Messages || Messages.length === 0) {
        alert("No messages were returned from ao. Please try later.");
        return;
      }
      const data = Messages[Messages.length - 1]?.Data;
      alert(data);
    } catch (error) {
      alert("There was an error in the trade process: " + error);
      console.error(error);
    } finally {
      setAddUnhelpful(false);
    }
  };

  const AddUpvoteReview = async (ReviewID: string) => {
    if (!AppId) return;
    console.log(AppId);
    if (!ReviewID) return;
    console.log(ReviewID);

    setAddUpvote(true);
    try {
      const getTradeMessage = await message({
        process: ARS,
        tags: [
          { name: "Action", value: "MarkUpvoteReview" },
          { name: "AppId", value: String(AppId) },
          { name: "ReviewId", value: String(ReviewID) },
          { name: "username", value: String(username) },
        ],
        signer: createDataItemSigner(othent),
      });
      const { Messages, Error } = await result({
        message: getTradeMessage,
        process: ARS,
      });

      if (Error) {
        alert("Error Adding Upvoting App:" + Error);
        return;
      }
      if (!Messages || Messages.length === 0) {
        alert("No messages were returned from ao. Please try later.");
        return;
      }
      const data = Messages[Messages.length - 1]?.Data;
      alert(data);
    } catch (error) {
      alert("There was an error in the Upvoting process: " + error);
      console.error(error);
    } finally {
      setAddUpvote(false);
    }
  };
  const AddDownvoteReview = async (ReviewID: string) => {
    if (!AppId) return;
    console.log(AppId);
    if (!ReviewID) return;
    console.log(ReviewID);
    setAddDownvote(true);
    try {
      const getTradeMessage = await message({
        process: ARS,

        tags: [
          { name: "Action", value: "DownvoteReview" },
          { name: "AppId", value: String(AppId) },
          { name: "ReviewId", value: String(ReviewID) },
          { name: "username", value: String(username) },
        ],
        signer: createDataItemSigner(othent),
      });
      const { Messages, Error } = await result({
        message: getTradeMessage,
        process: ARS,
      });

      if (Error) {
        alert("Error Adding project to Favorite:" + Error);
        return;
      }
      if (!Messages || Messages.length === 0) {
        alert("No messages were returned from ao. Please try later.");
        return;
      }
      const data = Messages[Messages.length - 1]?.Data;
      alert(data);
    } catch (error) {
      alert("There was an error in the trade process: " + error);
      console.error(error);
    } finally {
      setAddDownvote(false);
    }
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  return (
    <div
      className={classNames(
        "content text-black dark:text-white flex flex-col h-full justify-between"
      )}
    >
      <Container>
        {loadingAppReviews ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "60vh",
            }}
          >
            <Loader active inline="centered" size="large">
              Loading your reviews...
            </Loader>
          </div>
        ) : appReviews ? (
          <>
            <Container>
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
                    name="change owner"
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

              <Header as="h1"> Project Reviews</Header>
              <Divider />
              <Grid>
                <CommentGroup threaded>
                  {Object.entries(appReviews).map(([key, review]) => (
                    <SUIComment key={review.reviewId}>
                      <SUIComment.Avatar
                        src={
                          review.profileUrl ||
                          "https://react.semantic-ui.com/images/avatar/small/matt.jpg"
                        }
                      />
                      <SUIComment.Content>
                        <SUIComment.Author as="a">
                          {review.username || "Anonymous"}
                        </SUIComment.Author>
                        <SUIComment.Metadata>
                          <span>{formatDate(review.timestamp)}</span>
                          <Rating
                            icon="star"
                            defaultRating={review.rating}
                            maxRating={5}
                            disabled
                          />
                        </SUIComment.Metadata>
                        <SUIComment.Text>
                          {review.comment || "No comment provided."}
                        </SUIComment.Text>
                        <SUIComment.Actions>
                          <SUIComment.Action>
                            <Button
                              loading={addUpvote}
                              onClick={() => AddUpvoteReview(review.reviewId)}
                              primary
                              color="blue"
                              size="mini"
                              icon
                            >
                              <Icon name="thumbs up" />{" "}
                              {review.voters.upvoted.count || 0} Upvotes
                            </Button>
                            <Button
                              loading={addDownvote}
                              onClick={() => AddDownvoteReview(review.reviewId)}
                              color="red"
                              size="mini"
                              icon
                            >
                              {" "}
                              <Icon name="thumbs down" />{" "}
                              {review.voters.downvoted.count || 0} Downvotes
                            </Button>
                          </SUIComment.Action>
                        </SUIComment.Actions>
                        <SUIComment.Text>
                          {review.voters.foundHelpful.count} Found This Review
                          Helpful. Did You find this Review Helpful ?
                        </SUIComment.Text>
                        <SUIComment.Actions>
                          <SUIComment.Action>
                            <Button
                              loading={addHelpful}
                              onClick={() => AddHelpfulReview(review.reviewId)}
                              color="blue"
                              size="mini"
                              icon
                            >
                              <Icon name="thumbs up" />{" "}
                              {review.voters.foundHelpful.count || 0} Yes
                            </Button>
                            <Button
                              loading={addUnhelpful}
                              onClick={() =>
                                AddUnhelpfulReview(review.reviewId)
                              }
                              color="red"
                              size="mini"
                              icon
                            >
                              <Icon name="thumbs down" />{" "}
                              {review.voters.foundUnhelpful.count || 0} No
                            </Button>
                          </SUIComment.Action>
                        </SUIComment.Actions>
                      </SUIComment.Content>
                      <SUIComment.Group>
                        {Object.entries(review.replies || {}).map(
                          ([replyKey, reply]) => {
                            const typedReply = reply as Reply; // 👈 Type assertion

                            return (
                              <SUIComment key={typedReply.replyId}>
                                <SUIComment.Avatar
                                  src={typedReply.profileUrl}
                                />
                                <SUIComment.Content>
                                  <SUIComment.Author as="a">
                                    {typedReply.username || "Anonymous"}
                                  </SUIComment.Author>
                                  <SUIComment.Metadata>
                                    <span>
                                      {formatDate(typedReply.timestamp)}
                                    </span>
                                  </SUIComment.Metadata>
                                  <SUIComment.Text>
                                    {typedReply.comment ||
                                      "No comment provided."}
                                  </SUIComment.Text>
                                </SUIComment.Content>
                              </SUIComment>
                            );
                          }
                        )}
                      </SUIComment.Group>
                      <Form reply>
                        <FormField>
                          <Input
                            size="big"
                            type="text"
                            name="comment"
                            value={comment}
                            onChange={handleInputChange}
                            placeholder="Reply to Review..."
                          />
                        </FormField>
                        <FormField>
                          <Button
                            primary
                            loading={addReviewReply}
                            onClick={() => AddReviewReply(review.reviewId)}
                            content="Reply"
                            labelPosition="left"
                            icon="edit"
                          />
                        </FormField>
                      </Form>
                    </SUIComment>
                  ))}
                </CommentGroup>
              </Grid>
            </Container>
          </>
        ) : (
          <>
            <Container>
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
                    name="change owner"
                  />
                  <MenuItem
                    onClick={() => handleNotification(AppId)}
                    name="Send Messages."
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
                  <MenuItem onClick={() => handleTasks(AppId)} name="tasks" />
                </MenuMenu>
              </Menu>
              <Header as="h4" color="grey">
                No reviews found for this app.
              </Header>
            </Container>
          </>
        )}

        <Divider />
      </Container>
      <Footer />
    </div>
  );
};

export default aoprojectsinfo;
