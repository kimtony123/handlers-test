local json = require("json")
local math = require("math")



-- This process details
PROCESS_NAME = "aos Tasks_Table"
PROCESS_ID = "a_YRsw_22Dw5yPdQCUmVFAeI8J3OUsCGc_z0KrtEvNg"

-- Main aostore  process details
PROCESS_NAME_MAIN = "aos aostoreP "
PROCESS_ID_MAIN = "8vRoa-BDMWaVzNS-aJPHLk_Noss0-x97j88Q3D4REnE"


-- Credentials token
ARS = "8vRoa-BDMWaVzNS-aJPHLk_Noss0-x97j88Q3D4REnE"

AOS_POINTS = "vv8WuNF3bD9MG9tL4zguinQSobFFLDGQJtw_-yyoVl0"


TaskTable = TaskTable or {}
AosPoints = AosPoints or {}
Transactions = Transactions or {}

TransactionCounter = TransactionCounter or 0
TaskCounter = TaskCounter or 0
ReplyCounter = ReplyCounter or 0




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

-- Function to generate a unique transaction ID
function GenerateTransactionId()
    TransactionCounter = TransactionCounter + 1
    return "TX" .. tostring(TransactionCounter)
end

-- Function to generate a unique transaction ID
function GenerateTaskId()
    TaskCounter = TaskCounter + 1
    return "PX" .. tostring(TaskCounter)
end

-- Function to generate a unique transaction ID
function GenerateReplyId()
    ReplyCounter = ReplyCounter + 1
    return "RX" .. tostring(ReplyCounter)
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
    "AddTaskTable",
    Handlers.utils.hasMatchingTag("Action", "AddTaskTable"),
    function(m)
        local currentTime = m.Tags.currentTime
        local taskId = GenerateTaskId()
        local appId = m.Tags.appId
        local user  = m.Tags.user
        local username = m.Tags.username
        local profileUrl = m.Tags.profileUrl
        local caller   = m.From
        local replyId  = GenerateReplyId()
        
        print("Here is the caller Process ID"..caller)
        

        -- Field validation examples
        if not ValidateField(profileUrl, "profileUrl", m.From) then return end
        if not ValidateField(username, "username", m.From) then return end
        if not ValidateField(appId, "appId", m.From) then return end
        if not ValidateField(user, "user", m.From) then return end
        if not ValidateField(currentTime, "currentTime", m.From) then return end

        
        -- Ensure global tables are initialized
        TaskTable = TaskTable or {}
        AosPoints = AosPoints or {}
       
        TaskTable[appId] = {
        appId = appId,
        status = false,
        owner = user,
        mods = { [user] = { permissions = { replyTask = true }, time = currentTime } },
        tasks = {
        [taskId] = {
            taskId = taskId,
            createdTime = currentTime,
            link = "https://x.com/aoTheComputer",
            task = "Follow, Retweet, and Like our Twitter page",
            description = "Launched on aostore",
            tasksAmount = 50000,
            taskerCount = 500,
            amountPerTask = 50000/500,
            tokenDenomination = 3 ,
            tokenId = ARS,
         completedRate = {
                        completeCount = 1,
                        remainingTasks = 500-1},
            replies = {
                        [replyId] = {
                            username = username,
                            user = user ,
                            profileUrl = profileUrl,
                            comment = "https://x.com/aoTheComputer",
                            status = "Pending",
                            rank = "Architect",
                            completedTasks = {
                            completed = false,
                            completedTime = currentTime,  -- When the task was completed
                             proof = "https://x.com/aoTheComputer",  -- Optional: Proof of completion (like a link or TX hash)
                             amount = 50000/500
                            }
                            
                }
                    }
            
        }
    },
    count = 1,
    countHistory = { { time = currentTime, count = 1 } },
    users = {
        [user] = {
            time = currentTime,        }
    },
   
}
        -- Create the AosPoints table for this appId
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
        
        TaskTable[#TaskTable + 1] = {
            TaskTable[appId]
        }

        AosPoints[#AosPoints + 1] = {
            AosPoints[appId]
        }


        local transactionType = "Project Creation."
        local amount = 0
        local points = 5
        LogTransaction(m.From, appId, transactionType, amount, currentTime, points)

        TaskTable[appId].status = true
        AosPoints[appId].status = true

        local status = true
        -- Send responses back
        ao.send({
            Target = ARS,
            Action = "TaskRespons",
            Data = tostring(status)
        })
        print("Successfully Added Task table")
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

        if not ValidateField(appId, "appId", m.From) then return end
        if not ValidateField(owner, "owner", m.From) then return end
        if not ValidateField(currentTime, "currentTime", m.From) then return end

        
        -- Ensure appId exists in Tokens
        if TaskTable[appId] == nil then
            SendFailure(m.From ,"App doesnt exist for  specified " )
            return
        end

        -- Check if the user making the request is the current owner
        if TaskTable[appId].owner ~= owner then
            SendFailure(m.From, "You are not the Owner of the App.")
            return
        end
        
       
        local transactionType = "Deleted Project."
        local amount = 0
        local points = 0
        LogTransaction(m.From, appId, transactionType, amount, currentTime, points)
        TaskTable[appId] = nil
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

        if not ValidateField(appId, "appId", m.From) then return end
        if not ValidateField(newOwner, "newOwner", m.From) then return end
        if not ValidateField(currentOwner, "currentOwner", m.From) then return end
        if not ValidateField(currentTime, "currentTime", m.From) then return end

        -- Ensure appId exists in Tokens
        if TaskTable[appId] == nil then
            SendFailure(m.From, "App doesnt exist for  specified AppId..")
            return
        end
        
        -- Check if the user making the request is the current owner
        if TaskTable[appId].owner ~= currentOwner then
            SendFailure(m.From , "You are not the owner of this app.")
            return
        end

        -- Transfer ownership
        TaskTable[appId].owner = newOwner
        TaskTable[appId].mods[currentOwner] = newOwner

        local transactionType = "Transfered app succesfully."
        local amount = 0
        local points = 3
        LogTransaction(m.From, appId, transactionType, amount, currentTime, points)
    end
)




Handlers.add(
    "FetchAppTasks",
    Handlers.utils.hasMatchingTag("Action", "FetchAppTasks"),
    function(m)
        local appId = m.Tags.appId

         if not ValidateField(appId, "appId", m.From) then return end

        -- Ensure appId exists in ReviewsTable
         if TaskTable[appId] == nil then
             SendFailure(m.From , "App not Found.")
            return
        end
        -- Fetch the info
        local tasks = TaskTable[appId].tasks

        -- Check if there are reviews
        if not tasks or #tasks == 0 then
            SendFailure(m.From , "No Data Found in Dev Forum.")
          return
        end
        SendSuccess(m.From , tasks)
    end
)


Handlers.add(
    "DepositConfirmedAddNewTask",
    Handlers.utils.hasMatchingTag("Action", "DepositConfirmedN"),
    function(m)
        local userId = m.From
        local appId = m.Tags.appId
        local tokenId = m.Tags.tokenId
        local tokenDenomination = m.Tags.denomination
        local amount = tonumber(m.Tags.amount)
        local currentTime = GetCurrentTime(m)
        local taskId = GenerateAirdropId()

        if not ValidateField(appId, "appId", m.From) then return end
        if not ValidateField(tokenId, "tokenId", m.From) then return end
        if not ValidateField(tokenDenomination, "tokenDenomination", m.From) then return end
        if not ValidateField(amount, "amount", m.From) then return end

         -- Ensure appId exists in BugsReportsTable
        if TaskTable[appId] == nil then
            SendFailure(m.From ,"App doesnt exist for  specified App" )
            return
        end

        -- Check if the App exists
        local tasks  = TaskTable[appId]
        
      -- Validate ownership: only the App Owner can call this handler
        if tasks.owner ~= userId then
            SendFailure(m.From ,"You are not authorized to perform this action. Only the App Owner can confirm deposits." )
            return
        end

       
        local status = "Pending"

        -- Insert the new airdrop into the appId's airdrops list
        tasks.tasks[taskId] = {
            createdTime = currentTime,
            status = status,
            taskId = taskId,
            amount = amount,
            tokenId = tokenId,
            tokenDenomination = tokenDenomination
        }

        -- Update count and history
        tasks.count = (tasks.count or 0) + 1

        tasks.countHistory[#tasks.countHistory + 1] = {
            count = tasks.count,
            time = currentTime
        }

        local transactionType = "Tasks Creation."
        local amount = 0
        local points = 200
        LogTransaction(m.From, appId, transactionType, amount, currentTime, points)
       

        -- Send confirmation back to the App Owner
        SendSuccess(m.From, "Deposit confirmed for AppId: " .. appId .. ", tokenId: " .. tokenId .. ", Amount: " .. amount)
        
    end
)


Handlers.add(
    "FinalizeTask",
    Handlers.utils.hasMatchingTag("Action", "FinalizeTask"),
    function(m)
        local taskId = m.Tags.taskId
        local appId = m.Tags.appId
        local link = m.Tags.link
        local task = m.Tags.task
        local description = m.Tags.description
        local taskerCount = m.Tags.taskerCount
        local userId = m.From
        local currentTime = GetCurrentTime(m)

       

        if not ValidateField(appId, "appId", m.From) then return end
        if not ValidateField(link, "link", m.From) then return end
        if not ValidateField(taskId, "taskId", m.From) then return end
        if not ValidateField(task, "task", m.From) then return end
        if not ValidateField(description, "description", m.From) then return end
        if not ValidateField(taskerCount, "taskerCount", m.From) then return end


        if TaskTable[appId].tasks[taskId]  == nil then
            SendFailure(m.From, "task does not exists for that AppId..")
            return
        end

        if TaskTable[appId].owner ~= userId then
            SendFailure(m.From ,"You are not authorized to perform this action. Only the App Owner can Finalize tasks." )
            return
        end


        local taskFound = TaskTable[appId].tasks[taskId]

        local amountPerTask = (taskFound.amount/ taskFound.taskerCount)
        
        local replies = {}
        -- Update the task with new information
        taskFound.link  = link
        taskFound.task = task
        taskFound.taskerCount = taskerCount
        taskFound.status = "Ongoing" -- Update status to Ongoing
        taskFound.description = description
        taskFound.amountPerTask = amountPerTask
        taskFound.replies = replies
        
        local transactionType = "Task Finalization."
        local amount = 0
        local points = 100
        LogTransaction(m.From, appId, transactionType, amount, currentTime, points)
        SendSuccess(m.From ,"task finalized successfully for ID: " .. taskId )
    end
)






Handlers.add(
    "AddTaskReply",
    Handlers.utils.hasMatchingTag("Action", "AddTaskReplys"),
    function(m)

        local appId = m.Tags.appId
        local taskId = m.Tags.taskId
        local username = m.Tags.username
        local comment = m.Tags.comment
        local profileUrl = m.Tags.profileUrl
        local user = m.From
        local currentTime = GetCurrentTime(m)
        local replyId = GenerateReplyId()
        local providedRank = m.Tags.rank
        


        if not ValidateField(appId, "appId", m.From) then return end
        if not ValidateField(comment, "comment", m.From) then return end
        if not ValidateField(username, "username", m.From) then return end
        if not ValidateField(profileUrl, "profileUrl", m.From) then return end
        if not ValidateField(taskId, "taskId", m.From) then return end
        if not ValidateField(providedRank, "providedRank", m.From) then return end

        -- Ensure appId exists in ReviewsTable
        if TaskTable[appId] == nil then
            SendFailure(m.From, "App doesnt exist for  specified AppId..")
            return
        end

        -- Check if the user is the app owner
        if TaskTable[appId].owner ~= user or TaskTable[appId].mods[user] ~= user then
            SendFailure(m.From, "Only the app owner or Mods can reply to bug reports.")
        end

        if TaskTable[appId].tasks[taskId] == nil then
            SendFailure(m.From, "task doesnt exist for  specified AppId..")
            return
        end


        local targetTasks =  TaskTable[appId].tasks[taskId]

        -- Check if the user has already replied to this review
        if targetTasks.replies then
            for _, reply in ipairs(targetTasks.replies) do
                if reply.comment == comment then
                    local transactionType = "Replied twice using the same comment"
                    local amount = 0
                    local points = -30
                    LogTransaction(m.From, appId, transactionType, amount, currentTime, points)
                    SendFailure(m.From, "This link has already been replied , 30 AosPoints deducted")
                    return
                end
            end
        else
            targetTasks.replies = {} -- Initialize replies table if not present
        end
        
      
        local finalRank = DetermineUserRank(m.From,appId, providedRank)

         local amount = TaskTable[appId].tasks[taskId].amountPerTask

        TaskTable[appId].tasks[taskId].replies[replyId] =  {
            replyId = replyId,
            user = user ,
            comment = comment,
            status = "Pending",
            completedTasks = {
                            completed = false,
                            completedTime = currentTime,  -- When the task was completed
                             proof = comment,  -- Optional: Proof of completion (like a link or TX hash)
                             amount = amount},           
            profileUrl = profileUrl,
            rank = finalRank,
            username = username,
            timestamp = currentTime
        }
        local transactionType = "Finished A task."
        local amount = 0
        local points = 3
        LogTransaction(m.From, appId, transactionType, amount, currentTime, points)
        SendSuccess(m.From , "Task submitted Succesfully")
         end
)

Handlers.add(
    "RewardTask",
    Handlers.utils.hasMatchingTag("Action", "RewardTask"),
    function(m)

        local appId = m.Tags.appId
        local taskId = m.Tags.taskId
        local replyId = m.Tags.replyId
        local user = m.From
        local currentTime = GetCurrentTime(m)
        


        if not ValidateField(appId, "appId", m.From) then return end
        if not ValidateField(replyId, "replyId", m.From) then return end
        if not ValidateField(taskId, "taskId", m.From) then return end

        -- Ensure appId exists in ReviewsTable
        if TaskTable[appId] == nil then
            SendFailure(m.From, "App doesnt exist for  specified AppId..")
            return
        end

        -- Check if the user is the app owner
        if TaskTable[appId].owner ~= user or TaskTable[appId].mods[user] ~= user then
            SendFailure(m.From, "Only the app owner or Mods can reward tasks.")
        end

        if TaskTable[appId].tasks[taskId] == nil then
            SendFailure(m.From, "task doesnt exist for  specified AppId..")
            return
        end



        local targetReply =  TaskTable[appId].tasks[taskId][replyId]

        if targetReply == nil then
            SendFailure(m.From, "reply Id doesnt exist for  specified AppId..")
            return
        end

         if targetReply.completedTasks.completed then
            SendFailure(m.From, "Reward already sent to the user")
            return
        end
        
        local gift = TaskTable[appId].tasks[taskId].amountPerTask
         
        local tokenId = TaskTable[appId].tasks[taskId].tokenId
        local tokenDenomination = TaskTable[appId].tasks[taskId].tokenDenomination

        local user =  targetReply.user 

         -- Calculate amount in base units (assuming 1 token = 1000 units)
        local amount = gift * tokenDenomination
        -- Transfer tokens
        ao.send({
        Target = tokenId,
        Action = "Transfer",
        Quantity = tostring(amount),
        Recipient = tostring(user)})


        targetReply.completedTasks.completed = true
        targetReply.completedTasks.completedTime = currentTime

        targetReply.completedTasks.amount = amount

        local transactionType = "Rewarded user."
        local amount = 0
        local points = 3
        LogTransaction(m.From, appId, transactionType, amount, currentTime, points)

        local transactionType = "Received Reward."
        local amount = gift
        local points = 0
        LogTransaction(m.From, appId, transactionType, amount, currentTime, points)
        SendSuccess(m.From , " Succesfully Rewarded user" .. user)
         end
)


Handlers.add(
    "AddModerator",
    Handlers.utils.hasMatchingTag("Action", "AddModerator"),
    function(m)

        local appId = m.Tags.appId
        local modId = m.Tags.modId
        local user = m.From
        local currentTime = GetCurrentTime(m) -- Ensure you have a function to get the current timestamp
        

        if not ValidateField(appId, "appId", m.From) then return end
        if not ValidateField(modId , "modId", m.From) then return end


         -- Ensure appId exists in TaskTable
        if TaskTable[appId] == nil then
            SendFailure(m.From, "App doesnt exist for  specified appId ")
            return
        end
        
         -- Check if the user is the app owner
        if TaskTable[appId].owner ~= user then
            SendFailure(m.From, "Only the app owner can add moderator.")
        end


        local modlists = TaskTable[appId]
        modlists.users[user] = { replyTask = true, time = currentTime }
        local transactionType = "Added Moderator.."
        local amount = 0
        local points = 3
        LogTransaction(m.From, appId, transactionType, amount, currentTime, points)  
      
        SendSuccess(user,modlists)
    end
)

Handlers.add(
    "RemoveModerator",
    Handlers.utils.hasMatchingTag("Action", "RemoveModerator"),
    function(m)

        local appId = m.Tags.appId
        local modId = m.Tags.modId
        local user = m.From
        local currentTime = GetCurrentTime(m) -- Ensure you have a function to get the current timestamp
        

        if not ValidateField(appId, "appId", m.From) then return end
        if not ValidateField(modId , "modId", m.From) then return end


         -- Ensure appId exists in TaskTable
        if TaskTable[appId] == nil then
            SendFailure(m.From, "App doesnt exist for  specified appId ")
            return
        end
        
         -- Check if the user is the app owner
        if TaskTable[appId].owner ~= user then
            SendFailure(m.From, "Only the app owner can add moderator.")
        end


        local modlists = TaskTable[appId].mods
        
        modlists.users[user] = nil

        local transactionType = "Removed Moderator.."
        local amount = 0
        local points = 2
        LogTransaction(m.From, appId, transactionType, amount, currentTime, points)  
        SendSuccess(user,modlists)
    end
)

Handlers.add(
    "FetchModsLists",
    Handlers.utils.hasMatchingTag("Action", "FetchModsLists"),
    function(m)

        local appId = m.Tags.appId
        local user = m.From

        if not ValidateField(appId, "appId", m.From) then return end

         -- Ensure appId exists in TaskTable
        if TaskTable[appId] == nil then
            SendFailure(m.From, "App doesnt exist for  specified appId ")
            return
        end
        
         -- Check if the user is the app owner
        if TaskTable[appId].owner ~= user or TaskTable[appId].mods[user] ~= user then
            SendFailure(m.From, "Only the app owner or Mods can view modlists.")
        end


        local modlists =  TaskTable[appId].mods

        SendSuccess(user,modlists)
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
            Action = "TasksAosRespons",
            Data = TableToJson(aosPointsData)
        })
        -- Send success response
        print("Successfully Sent tasks handler aosPoints table")
    end
)

Handlers.add(
    "ClearData",
    Handlers.utils.hasMatchingTag("Action", "ClearData"),
    function(m)
        TaskTable = {}
        AosPoints =  {}
        Transactions = Transactions or {}
        TaskCounter = 0
        TransactionCounter = 0
        ReplyCounter = 0
    end
)