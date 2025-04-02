local json = require("json")


-- This process details
PROCESS_NAME = "aos Airdrops_Table"
PROCESS_ID = "XkAtx1XJse3MMv4MrT5aRQbBu7_i-gTOE7kNmZj6Z8o"


-- Main aostore  process details
PROCESS_NAME_MAIN = "aos aostoreP "
PROCESS_ID_MAIN = "8vRoa-BDMWaVzNS-aJPHLk_Noss0-x97j88Q3D4REnE"


-- Feature Requests details
PROCESS_NAME_FEATURE_REQUEST_TABLE = "aos featureRequestsTable"
PROCESS_ID_FEATURE_REQUEST_TABLE = "YGoIdaqLZauaH3aNLKyWdoFHTg0Voa5O3NhCMWKHRtY"


-- Favorites process details
PROCESS_NAME_FAVORITES_TABLE = "aos Favorites_Table"
PROCESS_ID_FAVORITES_TABLE  = "2aXLWDFCbnxxBb2OyLmLlQHwPnrpN8dDZtB9Y9aEdOE"


-- DevForum Table process
PROCESS_NAME_DEV_FORUM_TABLE = "aos DevForumTable"
PROCESS_ID_DEV_FORUM_TABLE = "V7KLJ9Fc48sb6VstzR3JPSymVhrF7dlP-Vt4W25-7bo"

-- Bug Reports Table process
PROCESS_NAME_BUG_REPORT_TABLE = "aos Bug_Report_Table"
PROCESS_ID_BUG_REPORT_TABLE  = "x_CruGONBzwAOJoiTJ5jSddG65vMpRw9uMj9UiCWT5g"


-- Reviews Table process
PROCESS_NAME_REVIEW_TABLE = "aos Reviews_Table"
PROCESS_ID_REVIEW_TABLE = "-E8bZaG3KJMNqwCCcIqFKTVzqNZgXxqX9Q32I_M3-Wo"


-- Aostore stakers process details
PROCESS_NAME = "aos Stakers_Table"
PROCESS_ID_STAKERS = "95butVk7xiquzqadgbqrrFtKCPtaEumi27ckEnIN4ww"

-- Credentials token
ARS = "8vRoa-BDMWaVzNS-aJPHLk_Noss0-x97j88Q3D4REnE"

AOS_POINTS = "vv8WuNF3bD9MG9tL4zguinQSobFFLDGQJtw_-yyoVl0"



-- tables 
AirdropsTable = AirdropsTable or {}
AosPoints  = AosPoints or {}
ExpiredAirdrops = ExpiredAirdrops or {}
Transactions = Transactions or {}


AidropCounter = AidropCounter or 0
TransactionCounter = TransactionCounter or 0

-- Function to generate a unique transaction ID
function GenerateTransactionId()
    TransactionCounter = TransactionCounter + 1
    return "TX" .. tostring(TransactionCounter)
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
            createdTime = currentTime
        }
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
    return msg.createdTime -- returns time in milliseconds
end



-- Function to generate a unique transaction ID
function GenerateAirdropId()
    AidropCounter = AidropCounter + 1
    return "AX" .. tostring(AidropCounter)
end

function DetermineUserRank(user, appId, providedRank)
    
    -- Get app data with safety checks
    local appData = TaskTable[appId] or {}
    local owner = appData.owner
    local mods = appData.mods or {}

    -- Determine rank priority
    if user == owner then
        return "Architect" -- Highest priority
    elseif mods[user] then
        return "Agent"     -- Secondary priority
    else
        return providedRank -- Default/fallback rank
    end
end


Handlers.add(
    "AddAirdropsTableX",
    Handlers.utils.hasMatchingTag("Action", "AddAirdropsTableX"),
    function(m)
        local currentTime = m.Tags.currentTime
        local airdropId = GenerateAirdropId()
        local appId = m.Tags.appId
        local user  = m.Tags.user
        local profileUrl = m.Tags.profileUrl
        local username = m.Tags.username
        local appIconUrl = m.Tags.appIconUrl
        local appName = m.Tags.appName
        local caller = m.From


        print("Here is the caller Process ID"..caller)


        -- Field validation examples
        if not ValidateField(currentTime, "currentTime", m.From) then return end
        if not ValidateField(profileUrl, "profileUrl", m.From) then return end
        if not ValidateField(username, "username", m.From) then return end
        if not ValidateField(appId, "appId", m.From) then return end
        if not ValidateField(user, "user", m.From) then return end
        if not ValidateField(appIconUrl, "appIconUrl", m.From) then return end
        if not ValidateField(appName, "appName", m.From) then return end

        -- Ensure global tables are initialized
        AirdropsTable = AirdropsTable or {}
        AosPoints = AosPoints or {}
        Transactions = Transactions or {}

       AirdropsTable[appId] =
        {
        owner = user,
  airdrops = {
    [airdropId] = {
      airdropId = airdropId,
      owner = user,
      appId = appId,
      tokenId = ARS,
        amount = 5,
      title = "aostore launch",
      createdTime = currentTime,
      appName = appName,
      appIconUrl = appIconUrl,
      status = "Pending",  -- (Pending, Active, Completed)
      airdropsReceivers = "ReviewsTable",
      startTime = currentTime,
      endTime = currentTime + 3600,
      minAosPoints = 150,
      description = "Review and rate our project between today and 8th February and earn AirdropsTable ",
      unverifiedParticipants = { [user] = { time = currentTime, Eligible = false } },
      verifiedParticipants = {},
      claimedUsers = {}  -- To track users who have claimed rewards
    }},
  count = 1,
  countHistory = { { time = currentTime, count = 1 } },
}
        AosPoints[appId] = {
            appId = appId,
            status = false,
            totalPointsApp = 5,
            count = 1,
            countHistory = { { time = currentTime, count = 1 } },
            users = {
                [user] = { time = currentTime , points = 5 }
            }
        }

        AirdropsTable[#AirdropsTable + 1] = {
            AirdropsTable[appId]
        }

        AosPoints[#AosPoints + 1] = {
            AosPoints[appId]
        }

        local transactionType = "Project Creation."
        local amount = 0
        local points = 5
        LogTransaction(m.From, appId, transactionType, amount, currentTime, points)
       
        -- Update statuses to true after creation
        AirdropsTable[appId].status = true
        AosPoints[appId].status = true

        local status = true

         ao.send({
            Target = ARS,
            Action = "AirdropRespons",
            Data = tostring(status)
        })
        -- Send success response
        print("Successfully Added airdrops Table table")
    end
)


Handlers.add(
    "DeleteApp",
    Handlers.utils.hasMatchingTag("Action", "DeleteApp"),
    function(m)

        local appId = m.Tags.appId
        local owner = m.Tags.owner
        local caller = m.From
        local currentTime = m.Tags.currentTime

        if ARS ~= caller then
            SendFailure(m.From, "Only the Main process can call this handler.")
            return
        end
        
        -- Ensure appId exists in AirdropsTable 
        if AirdropsTable [appId] == nil then
            SendFailure(m.From ,"App doesnt exist for  specified " )
            return
        end

        -- Check if the user making the request is the current owner
        if AirdropsTable [appId].owner ~= owner then
            SendFailure(m.From, "You are not the Owner of the App.")
            return
        end

        if not ValidateField(currentTime, "currentTime", m.From) then return end
        if not ValidateField(appId, "appId", m.From) then return end
        if not ValidateField(owner, "owner", m.From) then return end

        local transactionType = "Deleted Project."
        local amount = 0
        local points = 0
        LogTransaction(m.From, appId, transactionType, amount, currentTime, points)
        AirdropsTable [appId] = nil
        print("Sucessfully Deleted App" )

    end
)

Handlers.add(
    "TransferAppOwnership",
    Handlers.utils.hasMatchingTag("Action", "TransferAppOwnership"),
    function(m)
        local appId = m.Tags.appId
        local newOwner = m.Tags.NewOwner
        local caller = m.From
        local currentTime = m.Tags.currentTime
        local currentOwner = m.Tags.currentOwner

         -- Check if PROCESS_ID called this handler
        if ARS ~= caller then
            SendFailure(m.From, "Only the Main process can call this handler.")
            return
        end
        
        -- Ensure appId exists in AirdropsTable 
        if AirdropsTable [appId] == nil then
            SendFailure(m.From, "App doesnt exist for  specified AppId..")
            return
        end


        if not ValidateField(currentTime, "currentTime", m.From) then return end
        if not ValidateField(appId, "appId", m.From) then return end
        if not ValidateField(newOwner, "newOwner", m.From) then return end
        if not ValidateField(currentOwner, "currentOwner", m.From) then return end

        -- Check if the user making the request is the current owner
        if AirdropsTable [appId].owner ~= currentOwner then
            SendFailure(m.From , "You are not the owner of this app.")
            return
        end

        -- Transfer ownership
        AirdropsTable [appId].owner = newOwner
        AirdropsTable [appId].mods[currentOwner] = newOwner

        local transactionType = "Transfered app succesfully."
        local amount = 0
        local points = 3
        LogTransaction(m.From, appId, transactionType, amount, currentTime, points)
    end
)




Handlers.add(
    "DepositConfirmedN",
    Handlers.utils.hasMatchingTag("Action", "DepositConfirmedN"),
    function(m)
        local userId = m.From
        local appId = m.Tags.appId
        local tokenId = m.Tags.tokenId
        local tokenName = m.Tags.tokenName
        local tokenTicker = m.Tags.tokenTicker
        local tokenDenomination = m.Tags.tokenDenomination
        local amount = tonumber(m.Tags.amount)
        local currentTime = GetCurrentTime(m)
        local airdropId = GenerateAirdropId()


        if not ValidateField(appId, "appId", m.From) then return end
        if not ValidateField(tokenId, "tokenId", m.From) then return end
        if not ValidateField(tokenName, "tokenName", m.From) then return end
        if not ValidateField(tokenDenomination, "tokenDenomination", m.From) then return end
        if not ValidateField(tokenTicker, "tokenTicker", m.From) then return end
        if not ValidateField(amount, "amount", m.From) then return end

        local fees = amount * 0.03 * tokenDenomination
        
        -- Send reward tokens
        ao.send({
            Target = tokenId,
            Action = "Transfer",
            Quantity = tostring(fees),
            Recipient = tostring(PROCESS_ID_AIRDROP_TABLE)
        })
 
        local amount = amount * 0.968

         -- Ensure appId exists in BugsReportsTable
        if AirdropsTable[appId] == nil then
            SendFailure(m.From ,"App doesnt exist for  specified App" )
            return
        end

        -- Check if the App exists
        local airdop  = AirdropsTable[appId]
        
        local appName = AirdropsTable[appId].appName
        local tokenDenomination = AirdropsTable[appId].tokenDenomination
        -- Validate ownership: only the App Owner can call this handler
        if airdop.owner ~= userId then
            SendFailure(m.From ,"You are not authorized to perform this action. Only the App Owner can confirm deposits." )
            return
        end

       
        local status = "Pending"

        -- Insert the new airdrop into the appId's airdrops list
        airdop.airdrops[airdropId] = {
            createdTime = currentTime,
            status = status,
            airdropId = airdropId,
            appId = appId,
            appName = appName,
            owner = userId,
            amount = amount,
            tokenId = tokenId,
            tokenDenomination = tokenDenomination
        }

        -- Update count and history
        airdop.count = (airdop.count or 0) + 1

        airdop.countHistory[#airdop.countHistory + 1] = {
            count = airdop.count,
            time = currentTime
        }

        local transactionType = " Airdop  Creation."
        local Amount = 0
        local points = 200
        LogTransaction(m.From, appId, transactionType, Amount, currentTime, points)
       

        -- Send confirmation back to the App Owner
        SendSuccess(m.From, airdropId)
        
    end
)




Handlers.add(
    "GetAllAirdrops",
    Handlers.utils.hasMatchingTag("Action", "GetAllAirdrops"),
    function(m)
        -- Check if AirdropsTable is initialized
        if AirdropsTable == nil then
            SendFailure(m.From, "AirdropsTable is not initialized.")
            return
        end

        -- Optionally flatten the data into a list
        local flatAirdrops = {}
        for appId, appData in pairs(AirdropsTable) do
            -- Check if appData.airdrops exists and is a table
            if type(appData.airdrops) ~= "table" then
                SendFailure(m.From, "Invalid airdrops data for appId: " .. appId)
                return
            end

            -- Iterate over the airdrops table
            for airdropId, airdrop in pairs(appData.airdrops) do
                flatAirdrops[#flatAirdrops + 1] = airdrop
            end
        end

        -- Send success response
        SendSuccess(m.From, flatAirdrops)
    end
)

Handlers.add(
    "GetAirdropsByAppId",
    Handlers.utils.hasMatchingTag("Action", "GetAirdropsByAppId"),
    function(m)
        -- Extract AppId from the message tags
        local appId = m.Tags.appId

        if not ValidateField(appId, "appId", m.From) then return end

        -- Ensure appId exists in BugsReportsTable
         if AirdropsTable[appId] == nil then
             SendFailure(m.From , "Airdrops not Found.")
            return
        end
        -- Fetch the info
        local airdropsInfo = AirdropsTable[appId].airdrops

        SendSuccess(m.From , airdropsInfo)
        end
)





Handlers.add(
    "FetchAirdropData",
    Handlers.utils.hasMatchingTag("Action", "FetchAirdropData"),
    function(m)
        local user = m.From
        local appId = m.Tags.appId 
        local airdropId = m.Tags.airdropId

      
        if not ValidateField(airdropId, "airdropId", m.From) then return end
        if not ValidateField(appId, "appId", m.From) then return end

        if AirdropsTable[appId].airdrops[airdropId]  == nil then
            SendFailure(m.From, "Airdrop does not exists for that AppId..")
            return
        end

        -- Check if the Airdrop exists
        local airdropFound = AirdropsTable[appId].airdrops[airdropId]
        

        SendSuccess(m.From ,airdropFound)

    end
)



Handlers.add(
    "FinalizeAirdropN",
    Handlers.utils.hasMatchingTag("Action", "FinalizeAirdropN"),
    function(m)
        local airdropId = m.Tags.airdropId
        local appId = m.Tags.appId
        local airdropsReceivers = m.Tags.airdropsReceivers
        local description = m.Tags.description
        local startTime = tonumber(m.Tags.startTime) -- Convert to number
        local endTime = tonumber(m.Tags.endTime) -- Convert to number
        local currentTime = GetCurrentTime(m)
        local minAosPoints = m.Tags.minAosPoints
        local title = m.Tags.title

        print("Finalizing Airdrop with ID: " .. (airdropId or "nil"))


        if not ValidateField(airdropId, "airdropId", m.From) then return end
        if not ValidateField(airdropsReceivers, "airdropsReceivers", m.From) then return end
        if not ValidateField(startTime, " startTime", m.From) then return end
        if not ValidateField(endTime, "endTime", m.From) then return end
        if not ValidateField(appId, "appId", m.From) then return end
        if not ValidateField(description, "description", m.From) then return end
        if not ValidateField(minAosPoints, "minAosPoints", m.From) then return end
        if not ValidateField(title, "title", m.From) then return end


        -- Validate that endTime is greater than startTime
        if endTime <= startTime then
            SendFailure(m.From , "EndTime must be greater than StartTime." )
            return
        end

        if AirdropsTable[appId].airdrops[airdropId]  == nil then
            SendFailure(m.From, "Airdrop does not exists for that AppId..")
            return
        end

        -- Check if the Airdrop exists
        local airdropFound = AirdropsTable[appId].airdrops[airdropId]
        
        -- Update the Airdrop with new information
        airdropFound.airdropsReceivers = airdropsReceivers
        airdropFound.startTime = startTime
        airdropFound.endTime = endTime
        airdropFound.status = "Ongoing" -- Update status to Ongoing
        airdropFound.description = description
        airdropFound.minAosPoints = minAosPoints
        airdropFound.title = title

        local transactionType = " Airdop Finalization."
        local amount = 0
        local points = 100
        LogTransaction(m.From, appId, transactionType, amount, currentTime, points)

        
        local airdropInfo = AirdropsTable[appId].airdrops[airdropId]

        SendSuccess(m.From , airdropInfo)
        -- Log the updated Airdrop (Optional)
        print("Updated Airdrop: " .. TableToJson(airdropFound))
    end
)


Handlers.add(
    "DeletedAirdrop",
    Handlers.utils.hasMatchingTag("Action", "DeletedAirdrop"),
    function(m)
        local airdropId = m.Tags.airdropId
        local appId = m.Tags.appId
     -- Convert to number
        local currentTime = GetCurrentTime(m)
        

        print("Finalizing Airdrop with ID: " .. (airdropId or "nil"))


        if not ValidateField(airdropId, "airdropId", m.From) then return end
        if not ValidateField(appId, "appId", m.From) then return end
      

        if AirdropsTable[appId].airdrops[airdropId]  == nil then
            SendFailure(m.From, "Airdrop does not exists for that AppId..")
            return
        end

        -- Check if the Airdrop exists
        local airdropFound = AirdropsTable[appId].airdrops[airdropId]
  
        if currentTime >= airdropFound.endTime then
            SendFailure(m.From , "Wait for Airdrop To expire." )
            return
        end
        local transactionType = "Deleted Airdrop."
        local amount = 0
        local points = 0
        LogTransaction(m.From, appId, transactionType, amount, currentTime, points)
        airdropFound = nil
        SendSuccess(m.From ,"Airdrop Deleted Successfully  ")
    end
)


Handlers.add(
    "GetAosPointsTable",
    Handlers.utils.hasMatchingTag("Action", "GetAosPointsTable"),
    function(m)
        local caller = m.From

        print("Here is the caller Process ID"..caller)

        if AOS_POINTS ~= caller then
           SendFailure(m.From, "Only the AosPoints process can call this handler.")
            return
        end
        
        local aosPointsData = AosPoints 

        ao.send({
            Target = AOS_POINTS,
            Action = "AirdropAosRespons",
            Data = TableToJson(aosPointsData)
        })
        -- Send success response
        print("Successfully Sent airdrop handler aosPoints table")
    end
)


Handlers.add(
    "FetchAppAirdrops",
    Handlers.utils.hasMatchingTag("Action", "FetchAppAirdrops"),
    function(m)
        local appId = m.Tags.appId

         if not ValidateField(appId, "appId", m.From) then return end

        -- Ensure appId exists in ReviewsTable
         if AirdropsTable[appId] == nil then
             SendFailure(m.From , "App not Found.")
            return
        end
        -- Fetch the info
        local appAirdrops = AirdropsTable[appId].airdrops

        SendSuccess(m.From , appAirdrops)
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
                user_transactions[#user_transactions + 1] =  transaction
            end
        end
           -- If no transactions found, return early
        if user_transactions == nil then
            SendFailure(m.From, "You have no transactions.")
            return
        end
        SendSuccess(m.From ,user_transactions )
        end
)


Handlers.add(
    "GetUserStatistics",
    Handlers.utils.hasMatchingTag("Action", "GetUserStatistics"),
    function(m)
        local userId = m.From

        -- Check if transactions table exists
        if not Transactions then
            SendFailure(m.From , "Transactions table not found.")
         return
        end

        -- Initialize user statistics
        local userStatistics = {
            totalEarnings = 0,
            transactions = {}
        }

        -- Flag to track if user has transactions
        local hasTransactions = false

        -- Loop through the transactions table to gather user's data
        for _, transaction in pairs(Transactions) do
            if transaction.user == userId then
                hasTransactions = true


                -- Add transaction details to the statistics

                userStatistics.transactions[#userStatistics.transactions + 1] =  {
                    amount = transaction.amount,
                    time = transaction.createdTime
                }
                -- Increment total earnings
                userStatistics.totalEarnings = userStatistics.totalEarnings + transaction.amount
            end
        end

        -- If no transactions found, return early
        if hasTransactions == nil then
            SendFailure(m.From, "You have no earnings.")
            return
        end
        SendSuccess (m.From , userStatistics)
      end
)



Handlers.add(
    "ClearData",
    Handlers.utils.hasMatchingTag("Action", "ClearData"),
    function(m)
        AirdropsTable = {}
        AosPoints =  {}
        ExpiredAirdrops = {}
        Transactions = Transactions or {}
        AidropCounter = 0
        TransactionCounter =  0
    end
)
