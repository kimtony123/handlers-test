

Handlers.add(
  "AddProjectZ",
  Handlers.utils.hasMatchingTag("Action", "AddProjectZ"),
  function(m)
      local currentTime = GetCurrentTime(m)
      local AppId = GenerateAppId()
      local user = m.From
      local appName = "aostore testX"
      local description = "This is a test App"

      -- Reset DataCount for this transaction
        DataCount = 0
      
           -- Call the add functions
      AddReviewTable(AppId, user, nil)
      AddHelpfulTable(AppId, user)   

      -- Set the finalize callback to be called when DataCount reaches 2
      globalFinalizeProjectCallback = function()
        finalizeProject(user, AppId, appName, description, currentTime)
          
        end
  end
)

Handlers.add(
    "AddHelpfulRating",
    Handlers.utils.hasMatchingTag("Action", "AddHelpfulRating"),
    function(m)
      local AppId = GenerateAppId()
      local user = m.From
      AddHelpfulTable(AppId, user, nil)
    end
)

Handlers.add(
    "AddUnHelpfulRating",
    Handlers.utils.hasMatchingTag("Action", "AddUnHelpfulRating"),
    function(m)
      local AppId = GenerateAppId()
      local user = m.From
      --AddUnHelpfulTable(AppId, user, nil)
    end
)

Handlers.add(
    "AddAidropTable",
    Handlers.utils.hasMatchingTag("Action", "AddAidropTable"),
    function(m)
      local AppId = GenerateAppId()
      local user = m.From
      local AppName = "aostore"
      AddAirdropTable(AppId, user,AppName,  nil)
    end
)

Handlers.add(
    "AddFlagTableX",
    Handlers.utils.hasMatchingTag("Action", "AddFlagTableX"),
    function(m)
      local AppId = GenerateAppId()
      local user = m.From
      AddFlagTable(AppId, user, nil)
    end
)


Handlers.add(
    "AddBugReportX",
    Handlers.utils.hasMatchingTag("Action", "AddBugReportX"),
    function(m)
      local AppId = GenerateAppId()
      local user = m.From
      local username = m.Tags.username
      local profileUrl = m.Tags.profileUrl
      AddBugReportTable(AppId, user,profileUrl,username,nil)
    end
)

Handlers.add(
    "AddDevTable",
    Handlers.utils.hasMatchingTag("Action", "AddDevTable"),
    function(m)
      local AppId = GenerateAppId()
      local user = m.From
      local username = m.Tags.username
      local profileUrl = m.Tags.profileUrl
      AddDevForumTable(AppId, user,profileUrl,username,nil)
    end
)

Handlers.add(
    "AddFeatureRequestTable",
    Handlers.utils.hasMatchingTag("Action", "AddFeatureRequestTable"),
    function(m)
      local AppId = GenerateAppId()
      local user = m.From
      local username = m.Tags.username
      local profileUrl = m.Tags.profileUrl
      AddFeatureRequestTable(AppId, user,profileUrl,username,nil)
    end
)



Handlers.add(
    "RankUsers",
    Handlers.utils.hasMatchingTag("Action", "RankUsers"),
    function(m)
        -- Step 1: Aggregate total points for each user
        local userPoints = {}

        -- List of all AosPoints tables
        local aosTables = {
            AosPointsMain,
            AosPointsAirdrops,
            AosPointsBugReports,
            AosPointsDevForum,
            AosPointsFavorites,
            AosPointsFeatures,
            AosPointsFlags,
            AosPointsHelpful,
            AosPointsReviews,
            AosPointsTasks
        }

        -- Iterate through all AosPoints tables
        for _, aosTable in ipairs(aosTables) do
            if type(aosTable) == "table" then
                for appId, appData in pairs(aosTable) do
                    if appData.users then
                        for userId, userData in pairs(appData.users) do
                            -- Ensure userData.points is a valid number
                            if type(userData.points) == "number" then
                                userPoints[userId] = (userPoints[userId] or 0) + userData.points
                            else
                                print(string.format("Invalid points for user %s in app %s: %s", userId, appId, type(userData.points)))
                            end
                        end
                    end
                end
            else
                print(string.format("Invalid AosPoints table: %s", type(aosTable)))
            end
        end

        -- Step 2: Calculate total points across all users
        local totalPoints = 0
        for _, points in pairs(userPoints) do
            -- Ensure points is a valid number
            if type(points) == "number" then
                totalPoints = totalPoints + points
            else
                print(string.format("Invalid total points for a user: %s", type(points)))
            end
        end

        -- Step 3: Assign ranks based on points
         Rankings = {
            Oracle = {},
            Operator = {},
            RedPill = {},
            BluePill = {}
        }

        for userId, points in pairs(userPoints) do
            -- Ensure points is a valid number
            if type(points) ~= "number" then
                print(string.format("Invalid points for user %s: %s", userId, type(points)))
                points = 0 -- Default to 0 if invalid
            end

            -- Add user to the appropriate rank
            if points == 0 then
                Rankings.BluePill[userId] = true
            elseif totalPoints > 0 and points / totalPoints > 0.5 then
                Rankings.Oracle[userId] = true
            elseif totalPoints > 0 and points / totalPoints > 0.25 then
                Rankings.Operator[userId] = true
            else
                Rankings.RedPill[userId] = true
            end
        end

        -- Step 4: Prepare the response
        local response = {
            code = 200,
            message = "success",
            data = {
                Rankings = Rankings,
                userPoints = userPoints
            }
        }


        -- Send success response
        SendSuccess(m.From, response)
    end
)