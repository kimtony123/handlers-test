local json = require("json")
local math = require("math")



-- AOSPOINTS process details.
PROCESS_NAME = "aos AosPoints"
PROCESS_ID_ = "vv8WuNF3bD9MG9tL4zguinQSobFFLDGQJtw_-yyoVl0"

AOS_POINTS = "vv8WuNF3bD9MG9tL4zguinQSobFFLDGQJtw_-yyoVl0"

-- Main  process details.
PROCESS_NAME = "aos aostoreP"
PROCESS_ID_MAIN = "8vRoa-BDMWaVzNS-aJPHLk_Noss0-x97j88Q3D4REnE"

-- Reviews Table process
PROCESS_NAME_REVIEW_TABLE = "aos Reviews_Table"
PROCESS_ID_REVIEW_TABLE = "-E8bZaG3KJMNqwCCcIqFKTVzqNZgXxqX9Q32I_M3-Wo"


-- Bug Reports Table process
PROCESS_NAME_BUG_REPORT_TABLE = "aos Bug_Report_Table"
PROCESS_ID_BUG_REPORT_TABLE  = "x_CruGONBzwAOJoiTJ5jSddG65vMpRw9uMj9UiCWT5g"


-- Helpful Table process
PROCESS_NAME_HELPFUL_TABLE = "aos Helpful_Table"
PROCESS_ID_HELPFUL_TABLE = "bQVmkwCFW7K2hIcVslihAt4YjY1RIkEkg5tXpZDGbbw"


-- DevForum Table process
PROCESS_NAME_DEV_FORUM_TABLE = "aos DevForumTable"
PROCESS_ID_DEV_FORUM_TABLE = "xs_gSLAAdqPYPRhHrNmdyktmgiJBExWycxNahLKaPy4"


-- Feature Requests details
PROCESS_NAME_FEATURE_REQUEST_TABLE = "aos featureRequestsTable"
PROCESS_ID_FEATURE_REQUEST_TABLE = "zxAZKgdrL8-ykqW-iJDkBEXJv812f7CZFjsazDKdehw"

-- This flag Table details
PROCESS_NAME_FLAG_TABLE = "aos Flag_Table"
PROCESS_ID_FLAG_TABLE = "BpGlNnMA09jM-Sfh6Jldswhp5AnGTCST4MxG2Dk-ABo"



-- Favorites process details
PROCESS_NAME_FAVORITES_TABLE = "aos Favorites_Table"
PROCESS_ID_FAVORITES_TABLE  = "2aXLWDFCbnxxBb2OyLmLlQHwPnrpN8dDZtB9Y9aEdOE"

-- Airdrops process details
PROCESS_NAME = "aos Airdrops_Table"
PROCESS_ID_AIRDROP_TABLE = "XkAtx1XJse3MMv4MrT5aRQbBu7_i-gTOE7kNmZj6Z8o"

-- Tips  process details
PROCESS_NAME = "aos TipsTable"
PROCESS_ID_TIPS_TABLE = "LkCdB2PkYRl4zTChv1DiTtiLqr5Qpu0cJ6V6mvHUnOo"


-- Tasks table  process details
PROCESS_NAME = "aos Tasks_Table"
PROCESS_ID_TASKS_TABLE = "a_YRsw_22Dw5yPdQCUmVFAeI8J3OUsCGc_z0KrtEvNg"


-- Credentials token
ARS = "8vRoa-BDMWaVzNS-aJPHLk_Noss0-x97j88Q3D4REnE"

-- tables 
Apps = Apps or {}

-- AosPoints Tables.

AosPointsMain = AosPointsMain or {}
AosPointsAirdrops = AosPointsAirdrops or {}
AosPointsBugReports = AosPointsBugReports or {}
AosPointsDevForum = AosPointsDevForum or {}
AosPointsFavorites = AosPointsFavorites or {}
AosPointsFeatures = AosPointsFeatures or {}
AosPointsFlags = AosPointsFlags or {}
AosPointsHelpful = AosPointsHelpful or {}
AosPointsTips = AosPointsTips or {}
AosPointsReviews = AosPointsReviews or {}
AosPointsTasks = AosPointsTasks or {}


Transactions  = Transactions or {}

Rankings = Rankings or {}

AosPoints = AosPoints or {}
-- Counters variables 
AppCounter  = AppCounter or 0
TransactionCounter = TransactionCounter or 0
MessageCounter  = MessageCounter or 0


-- Callback Variables
FetchmainaosCallback = nil
FetchreviewsCallback = nil
FetchhelpfulCallback = nil
FetchbugreportsCallback = nil
FetchdevforumCallback  = nil
FetchfeaturetableCallback = nil
FetchflagtableCallback  = nil
FetchunhelpfullCallback = nil
FetchfavoritesCallback = nil
FetchairdropsCallback = nil
FetchtipsCallback  = nil


function TableToJson(tbl)
    local result = {}
    for key, value in pairs(tbl) do
        local valueType = type(value)
        if valueType == "table" then
            value = TableToJson(value)
            table.insert(result, string.format('"%s":%s', key, value))
        elseif valueType == "string" then
            table.insert(result, string.format('"%s":"%s"', key, value))
        elseif valueType == "number" then
            table.insert(result, string.format('"%s":%d', key, value))
        elseif valueType == "function" then
            table.insert(result, string.format('"%s":"%s"', key, tostring(value)))
        end
    end

    local json = "{" .. table.concat(result, ",") .. "}"
    return json
end

-- Function to get the current time in milliseconds
function GetCurrentTime(msg)
    return msg.Timestamp -- returns time in milliseconds
end


-- Function to generate a unique App ID
function GenerateAppId()
    AppCounter = AppCounter + 1
    return "TX" .. tostring(AppCounter)
end




-- Function to generate a unique transaction ID
function GenerateTransactionId()
    TransactionCounter = TransactionCounter + 1
    return "TX" .. tostring(TransactionCounter)
end


-- Response helper functions
function SendSuccess(target, message)
    ao.send({
        Target = target,
        Data = TableToJson({
            code = 200,
            message = "success",
            data = message
        })
    })
end


function SendFailure(target, message)
    ao.send({
        Target = target,
        Data = TableToJson({
            code = 404,
            message = message,
            data = {}
        })
    })
end

function ValidateField(value, fieldName, target)
    if not value then
        SendFailure(target, fieldName .. " is missing or empty")
        return false
    end
    return true
end

-- Helper function to log transactions
function LogTransaction(user, appId, transactionType, amount, currentTime, points)
    local transactionId = GenerateTransactionId()
   
    if AosPoints[appId].users[user] == nil then
         AosPoints[appId].users[user] = {points = 0, time = currentTime}
    end

    AosPoints[appId].users[user].points = AosPoints[appId].users[user].points + points
    local currentPoints = AosPoints[appId].users[user].points

    Transactions[#Transactions + 1] = {
            user = user,
            transactionid = transactionId,
            transactionType = transactionType,
            amount = amount,
            points = currentPoints,
            timestamp = currentTime
        }
end


function AddMainAosPoints( callback)
    ao.send({
        Target = PROCESS_ID_MAIN,
        Tags = {
            { name = "Action", value = "GetAosPointsTable" },
        }
    })
    -- Save the callback to be called later
    FetchmainaosCallback = callback
end




function AddAosPointsReviews( callback)
    ao.send({
        Target = PROCESS_ID_REVIEW_TABLE,
        Tags = {
            { name = "Action",     value = "GetAosPointsTable" }
        }
    })
    -- Save the callback to be called later
    FetchreviewsCallback = callback
end


function AddAosPointsHelpful(callback)
    ao.send({
        Target = PROCESS_ID,
        Tags = {
            { name = "Action", value = "GetAosPointsTable" },
        }
    })
     -- Save the callback to be called later
    FetchhelpfulCallback = callback
end


function AddAosPointsBugReport( callback)
    ao.send({
        Target = PROCESS_ID_BUG_REPORT_TABLE,
        Tags = {
            { name = "Action",   value = "GetAosPointsTable" },
        }
    })
    -- Save the callback to be called later
    FetchbugreportsCallback = callback
end


function AddAosPointsDevForum( callback)
    ao.send({
        Target = PROCESS_ID_DEV_FORUM_TABLE,
        Tags = {
            { name = "Action",     value = "GetAosPointsTable" },
        }
    })
    -- Save the callback to be called later
    FetchdevforumCallback = callback
end



function AddAosPointsFeatureRequest( callback)
    ao.send({
        Target = PROCESS_ID_FEATURE_REQUEST_TABLE,
        Tags = {
            { name = "Action", value = "GetAosPointsTable" },
        }
    })
    -- Save the callback to be called later
    FetchfeaturetableCallback = callback
end


function AddAosPointsFlagTable( callback)
    ao.send({
        Target = PROCESS_ID_FLAG_TABLE,
        Tags = {
            { name = "Action", value = "GetAosPointsTable" },
        }
    })
    -- Save the callback to be called later
    FetchflagtableCallback = callback
end


function AddAosPointsFavorite(callback)
    ao.send({
        Target = PROCESS_ID_FAVORITES_TABLE,
        Tags = {
            { name = "Action",  value = "GetAosPointsTable" },}
    })
    -- Save the callback to be called later
    FetchfavoritesCallback = callback
end



function AddAosPointsAirdrop( callback)
    ao.send({
        Target = PROCESS_ID_AIRDROP_TABLE,
        Tags = {
            { name = "Action",  value = "GetAosPointsTable" },
        }
    })
    -- Save the callback to be called later
    FetchairdropsCallback = callback
end


function AddAosPointsTips( callback)
    ao.send({
        Target = PROCESS_ID_TIPS_TABLE,
        Tags = {
            { name = "Action",  value = "GetAosPointsTable" },
        }
    })
    -- Save the callback to be called later
    FetchtipsCallback = callback
end

function AddAosPointsTasks( callback)
    ao.send({
        Target = PROCESS_ID_TASKS_TABLE,
        Tags = {
            { name = "Action",  value = "GetAosPointsTable" },
        }
    })
    -- Save the callback to be called later
    FetchtipsCallback = callback
end


-- In ReviewsResponse handler:
Handlers.add(
  "MainAosRespons",
  Handlers.utils.hasMatchingTag("Action", "MainAosRespons"),
    function(m)

    if m.From == PROCESS_ID_MAIN then
      local xData = json.decode(m.Data)
      if  xData  == nil then
      print("No data received in Main response.")
      return
      end
      print("Updated AosMainPoints Response:", xData)
      AosPointsMain = xData
    else
        ao.send({ Target = m.From, Data = "Wrong ProcessID" })
    end
  end
)



Handlers.add(
  "ReviewsAosRespons",
  Handlers.utils.hasMatchingTag("Action", "ReviewsAosRespons"),
  function(m)

    if m.From == PROCESS_ID_REVIEW_TABLE then
      local xData = json.decode(m.Data)
      if  xData  == nil then
      print("No data received in Reviews response.")
      return
      end
      print("Updated Rviews Response:", xData)
      AosPointsReviews = xData
    else
        ao.send({ Target = m.From, Data = "Wrong ProcessID" })
    end
  end
)


-- In UpvotesResponse handler:
Handlers.add(
  "HelpfulRespons",
  Handlers.utils.hasMatchingTag("Action", "HelpfulRespons"),
  function(m)

    if m.From == PROCESS_ID_HELPFUL_TABLE then
        
      local xData = json.decode(m.Data)
      if  xData  == nil then
      print("No data received in Helpful response.")
      return
      end
      print("Updated AosPointsHelpful Response:", xData)
      AosPointsHelpful = xData
        else
        ao.send({ Target = m.From, Data = "Wrong ProcessID" })
    end
      
  end
)


-- In UpvotesResponse handler:
Handlers.add(
  "BugReportAosRespons",
  Handlers.utils.hasMatchingTag("Action", "BugReportAosRespons"),
  function(m)

    if m.From == PROCESS_ID_BUG_REPORT_TABLE then
      local xData = json.decode(m.Data)
      if  xData  == nil then
      print("No data received in Main response.")
      return
      end
      print("Updated BugReport aosPoints Response:", xData)
      AosPointsBugReports = xData
    else
        ao.send({ Target = m.From, Data = "Wrong ProcessID" })
    end
      
  end
)

-- In UpvotesResponse handler:
Handlers.add(
  "DevForumAosRespons",
  Handlers.utils.hasMatchingTag("Action", "DevForumAosRespons"),
  function(m)

    if m.From == PROCESS_ID_DEV_FORUM_TABLE then
      local xData = json.decode(m.Data)
      if  xData  == nil then
      print("No data received in Main response.")
      return
      end
      print("Updated DevForum Response:", xData)
      AosPointsDevForum = xData
    else
        ao.send({ Target = m.From, Data = "Wrong ProcessID" })
    end
      
  end
)

-- In UpvotesResponse handler:
Handlers.add(
  "FeaturesAosRespons",
  Handlers.utils.hasMatchingTag("Action", "FeaturesAosRespons"),
  function(m)

    if m.From == PROCESS_ID_FEATURE_REQUEST_TABLE then
      local xData = json.decode(m.Data)
      if  xData  == nil then
      print("No data received in Main response.")
      return
      end
      print("Updated AosPointsFeatures Response:", xData)
      AosPointsFeatures = xData
    else
        ao.send({ Target = m.From, Data = "Wrong ProcessID" })
    end
      
  end
)

-- In FlagTable handler:
Handlers.add(
  "FlagAosRespons",
  Handlers.utils.hasMatchingTag("Action", "FlagAosRespons"),
  function(m)

    if m.From == PROCESS_ID_FLAG_TABLE then
       local xData = json.decode(m.Data)
      if  xData  == nil then
      print("No data received in Main response.")
      return
      end
      print("Updated AosMainPointsFlags Response:", xData)
      AosPointsFlags = xData
    else
        ao.send({ Target = m.From, Data = "Wrong ProcessID" })
    end
  end
)


-- In Airdrop handler:
Handlers.add(
  "FavoritesAosRespons",
  Handlers.utils.hasMatchingTag("Action", "FavoritesAosRespons"),
  function(m)

    if m.From == PROCESS_ID_FAVORITES_TABLE then
        local xData = m.Data
        if not xData then
          print("No data received in Favorites Table response.")
          return
        end
       local xData = json.decode(m.Data)
      if  xData  == nil then
      print("No data received in Main response.")
      return
      end
      print("Updated AosMainPointsFavorites Response:", xData)
      AosPointsFavorites = xData
    else
        ao.send({ Target = m.From, Data = "Wrong ProcessID" })
    end
  end
)


-- In Airdops handler:
Handlers.add(
  "AirdropAosRespons",
  Handlers.utils.hasMatchingTag("Action", "AirdropAosRespons"),
  function(m)

    if m.From == PROCESS_ID_AIRDROP_TABLE then
        local xData = m.Data
        if not xData then
          print("No data received in Airdrop aospoints response.")
          return
        end
        print("Updated Airdrop aosPoints Table  Response:", xData)
        AosPointsAirdrops = xData
    else
        ao.send({ Target = m.From, Data = "Wrong ProcessID" })
    end
  end
)


-- In Tips handler:
Handlers.add(
  "TipsRespons",
  Handlers.utils.hasMatchingTag("Action", "TipsRespons"),
  function(m)

    if m.From == PROCESS_ID_TIPS_TABLE then
         local xData = m.Data
        if not xData then
          print("No data received in Airdrop aospoints response.")
          return
        end
        print("Updated aosPoints tips Table  Response:", xData)
        AosPointsTips = xData
    else
        ao.send({ Target = m.From, Data = "Wrong ProcessID" })
    end
  end
)

-- In Tasks handler:
Handlers.add(
  "TasksAosRespons",
  Handlers.utils.hasMatchingTag("Action", "TasksAosRespons"),
  function(m)

    if m.From == PROCESS_ID_TASKS_TABLE then
          local xData = m.Data
        if not xData then
          print("No data received in Airdrop aospoints response.")
          return
        end
        print("Updated Tasks Table  Response:", xData)
        AosPointsTasks = xData
    else
        ao.send({ Target = m.From, Data = "Wrong ProcessID" })
    end
  end
)


Handlers.add(
    "GetAosPoints",
    Handlers.utils.hasMatchingTag("Action", "GetAosPoints"),
    function(m)
    
    DataCount = 0

    AddMainAosPoints(nil)
    AddAosPointsReviews(nil)
    AddAosPointsHelpful(nil)
    AddAosPointsBugReport(nil)
    AddAosPointsDevForum(nil)
    AddAosPointsFeatureRequest(nil)
    AddAosPointsFlagTable(nil)
    AddAosPointsFavorite(nil)
    AddAosPointsTasks(nil)
    AddAosPointsTips(nil)
    SendSuccess(m.From, "Message Suucessfully sent.")
    
      end
)

Handlers.add(
    "FetchMainAosPoints",
    Handlers.utils.hasMatchingTag("Action", "FetchMainAosPoints"),
    function(m)
    AddMainAosPoints(nil)
      end
)

Handlers.add(
    "FetchAirdropsXAosPoints",
    Handlers.utils.hasMatchingTag("Action", "FetchAirdropsXAosPoints"),
    function(m)
    AddMainAosPoints(nil)
    AddAosPointsAirdrop(nil)
    AddAosPointsReviews(nil)
    AddAosPointsFlagTable(nil)
    AddAosPointsFavorite(nil)
    AddAosPointsBugReport(nil)
    AddAosPointsDevForum(nil)
    AddAosPointsFeatureRequest(nil)
    AddAosPointsTasks(nil)
      end
)

Handlers.add(
    "FetchAirdropsAosPoints",
    Handlers.utils.hasMatchingTag("Action", "FetchAirdropsAosPoints"),
    function(m)
   
    AddAosPointsTips(nil)
      end
)

Handlers.add(
    "RankUsers",
    Handlers.utils.hasMatchingTag("Action", "RankUsers"),
    function(m)
        -- Step 1: Aggregate total points for each user
        local userPoints = {}

        -- Iterate through all apps in AosPointsMain
        for appId, appData in pairs(AosPointsMain) do
            for userId, points in pairs(appData.users) do
                userPoints[userId] = (userPoints[userId] or 0) + points
            end
        end

        -- Step 2: Calculate total points across all apps
        local totalPoints = 0
        for _, points in pairs(userPoints) do
            totalPoints = totalPoints + points
        end

        -- Step 3: Assign ranks based on points
        local rankings = {
            Oracle = {},
            Operator = {},
            RedPill = {},
            BluePill = {}
        }

        for userId, points in pairs(userPoints) do
            if points == 0 then
                table.insert(rankings.BluePill, userId)
            elseif points / totalPoints > 0.5 then
                table.insert(rankings.Oracle, userId)
            elseif points / totalPoints > 0.25 then
                table.insert(rankings.Operator, userId)
            else
                table.insert(rankings.RedPill, userId)
            end
        end

        -- Step 4: Store rankings globally or return them
        Rankings = rankings -- Store globally for later use

        -- Debugging output
        print("Ranking Results:")
        print("Oracles:", #rankings.Oracle)
        print("Operators:", #rankings.Operator)
        print("RedPills:", #rankings.RedPill)
        print("BluePills:", #rankings.BluePill)

        -- Send success response
        SendSuccess(m.From, "Users ranked successfully.")
    end
)


Handlers.add(
    "GetUserRank",
    Handlers.utils.hasMatchingTag("Action", "GetUserRank"),
    function(m)
        local userId = m.From

        -- Step 1: Default rank and points
        local rank = "BluePill" -- Default rank
        local totalPoints = 0  -- Default points

        -- Step 2: Check if Rankings table exists and find the user's rank
        if Rankings then
            for category, users in pairs(Rankings) do
                for _, id in ipairs(users) do
                    if id == userId then
                        rank = category
                        break
                    end
                end
            end
        end

        -- Step 3: Calculate total points for the user (if they exist in AosPointsMain)
        if AosPointsMain then
            for _, appData in pairs(AosPointsMain) do
                totalPoints = totalPoints + (appData.users[userId] or 0)
            end
        end

        -- Step 4: Prepare rank information
        local rankInfo = {
            rank = rank,
            aosPoints = totalPoints
        }

        -- Step 5: Send response
        SendSuccess(m.From, rankInfo)
    end
)


Handlers.add(
    "SwappedToAos",
    Handlers.utils.hasMatchingTag("Action", "SwappedToAos"),
    function(m)
        local userId = m.From
        local pointsDeducted = m.Tags.points

        -- Step 1: Default points.
        local totalPoints = 0  -- Default points

        -- Step 3: Calculate total points for the user (if they exist in AosPointsMain)
        if AosPointsMain then
            for _, appData in pairs(AosPointsMain) do
                totalPoints = totalPoints + (appData.users[userId] or 0)
            end
        end


        local amount = pointsDeducted *1000 * 0.05


         -- Send reward tokens
        ao.send({
            Target = ARS,
            Action = "Transfer",
            Quantity = tostring(amount),
            Recipient = tostring(userId)
        })

        local balance = totalPoints - pointsDeducted

        -- Step 5: Send response
        SendSuccess(m.From, balance)
    end
)

-- Handler to view all transactions
Handlers.add(
    "view_transactions",
    Handlers.utils.hasMatchingTag("Action", "view_transactions"),
    function(m)
        local user = m.From
        local user_transactions = {}
        
        -- Filter transactions for the specific user
        for _, transaction in ipairs(Transactions) do
            -- Skip nil transactions
            if transaction ~= nil and transaction.user == user then
                user_transactions[#user_transactions + 1] = transaction
            end
        end

        -- Check if at least one banner is provided
        if #user_transactions == 0 then
            SendFailure(m.From, "You do not have any transactions")
          return
        end
        SendSuccess(m.From , user_transactions)
        end
)





Handlers.add(
    "ClearAosPointsMain",
    Handlers.utils.hasMatchingTag("Action", "ClearAosPointsMain"),
    function(m)
      AosPointsMain = {}
    end
)

