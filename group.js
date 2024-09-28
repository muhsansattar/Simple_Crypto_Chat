async function createGroup() {
    try{
        let tokenAddressInput = $("#token-address-input").val();    
        let amountInput = $("#token-amount-input").val();
        let chain = $("#chain-select").val();

        let token = await Moralis.Cloud.run("getToken", {address: tokenAddressInput, chain: chain});

        if(tokenAddressInput.length <= 10){
            if(chain == "eth" || chain == "ropsten" || chain == "kovan" || chain == "rinkeby"){
                tokenAddressInput = "ETH";
                token = "ETH";
            }
            if(chain == "bsc" || chain == "0x61"){
                tokenAddressInput = "BNB";
                token = "BNB";
            }
            if(chain == "matic" || chain == "0x89"){
                tokenAddressInput = "MATIC";
                token = "MATIC";
            }
        }



        if(token.length == 0){
            alert("Token deas not exists! On selected chain!");
        }else{
            //Saving all info about chat group:
            const chatGroup = new Moralis.Object("Group");
            chatGroup.set("name", $("#chatGroupName-input").val());
            chatGroup.set("description", $("#description-input").val());
            if(token[0].address == undefined){
                let amount = amountInput * (10**18);
    
                chatGroup.set("token", tokenAddressInput);
                chatGroup.set("tokenAmount", amount)
            }else{
    
                let amount = amountInput * (10**token[0].decimals);
    
                chatGroup.set("token", token[0].address);
                chatGroup.set("tokenAmount", amount);
            }
            chatGroup.set("nft", 1);
            chatGroup.set("chain", chain);
            const url = await uploadGroupImage();
            chatGroup.set("image", url);
            await chatGroup.save();
            getAllGroups();
    
            $("#info2").empty();
            $("#info2").html("<strong>DONE</strong>");
        }
    }catch(err){
        console.log(err + "Please, try again!");
    }
}


async function createNFTGroup(){
    let chain = $("#chain-select").val();
    let nftAddress = $("#token-address-input").val();
    let amountInput = parseInt($("#token-amount-input").val());

    const chatGroup = new Moralis.Object("Group");
    chatGroup.set("name", $("#chatGroupName-input").val());
    chatGroup.set("description", $("#description-input").val());
    chatGroup.set("tokenAmount", amountInput);
    chatGroup.set("token", nftAddress);
    chatGroup.set("chain", chain);
    chatGroup.set("nft", 0);
    const url = await uploadGroupImage();
    chatGroup.set("image", url);
    await chatGroup.save();
    getAllGroups();

    $("#info2").empty();
    $("#info2").html("<strong>DONE</strong>");
}



async function uploadGroupImage() {
    const data = chatGroupIMGInput.files[0]
    const file = new Moralis.File(data.name, data);
    await file.saveIPFS();
    return file.ipfs();
}


async function getAllGroups(){
    const Groups = new Moralis.Query("Group");
    const allGroups = await Groups.find();

    //Render:
    $("#allChatGroups").empty();

    if(allGroups.length == 0) {
        $("#allChatGroups").html(`<p class="text-center fw-bold fs-4">No Chat Groups Created</p>`);
        $("#allChatGroups").show();
    }

    allGroups.forEach(group => {
        let currentDiv = document.getElementById("allChatGroups");
        let content = `<div class="row rounded p-2 mb-4 shadow1">
                            <div class="col-4">
                                <img src="${group.get("image")}" style="border: 3px solid black; border-radius: 50%;"  width=75, height=75/>
                            </div>
                            <div class="col-8">
                                <p class="fs-5 mdb1 text-break"><strong>${group.get("name")}</strong></p>
                                <button id="chat" class="btn btn-dark mb-2 mt-0 w-50 rounded-pill" onclick="renderChatGroupInfo('${group.get("name")}', '${group.get("description")}', '${group.id}', '${group.get("image")}', '${group.get("token")}', '${group.get("tokenAmount")}', '${group.get("chain")}', '${group.get("nft")}')">CHAT</button>
                            </div>
                        </div>`;
        currentDiv.innerHTML += content; 
    });
}



//Chat btn clicked:
async function renderChatGroupInfo(name, description, id, image, tokenAddress, tokenAmount, chain, nft) {
    let tokenName;
    let tokenSymbol;
    let tokenDecimals;
    let chainName;
    let amount = tokenAmount;

    if(nft == 0) {
        let nftMetadata = await Moralis.Cloud.run("getNFTMetadata", {address: tokenAddress, chain: chain});
        tokenName = nftMetadata.name;
        tokenSymbol = nftMetadata.contract_type;
        if(nftMetadata.symbol == null) {
            tokenTicker = nftMetadata.name
        }else{
            tokenTicker = nftMetadata.symbol;
        }        
        tokenDecimals = 0;
    }else{
        let token = await Moralis.Cloud.run("getToken", {address: tokenAddress, chain: chain});
        if(token == undefined){
            if(chain == "eth" || chain == "ropsten" || chain == "kovan" || chain == "rinkeby"){
                tokenName = "Ethereum";
                tokenSymbol = "ETH";
                tokenDecimals = 18;
                tokenTicker = "ETH";
                amount = tokenAmount / (10**tokenDecimals);
            }
            if(chain == "bsc" || chain == "0x61"){
                tokenName = "Binance Coin";
                tokenSymbol = "BNB";
                tokenDecimals = 18;
                tokenTicker = "BNB";
                amount = tokenAmount / (10**tokenDecimals);
            }
            if(chain == "matic" || chain == "0x89"){
                tokenName = "Matic Token";
                tokenSymbol = "MATIC";
                tokenDecimals = 18;
                tokenTicker = "MATIC";
                amount = tokenAmount / (10**tokenDecimals);
            }
        }else{
            tokenName = token[0].name;
            tokenSymbol = token[0].symbol;
            tokenDecimals = token[0].decimals;
            tokenTicker = token.symbol;
            amount = tokenAmount / (10**tokenDecimals);
            chainName;
        }
    }

    if(chain == "eth"){
        chainName = "Ethereum Mainnet";
    }
    if(chain == "bsc"){
        chainName = "Binance Smart Chain Mainnet";
    }
    if(chain == "matic"){
        chainName = "Polygon Network Mainnet";
    }
    if(chain == "kovan"){
        chainName = "Kovan Testnet";
    }
    if(chain == "ropsten"){
        chainName = "Ropsten Testnet";
    }
    if(chain == "rinkeby"){
        chainName = "Rinkeby Testnet";
    }
    if(chain == "0x61"){
        chainName = "Binance Testnet";
    }
    if(chain == "0x89"){
        chainName = "Polygon Testnet";
    }

    $("#info3").empty();
    $("#groupInfoDiv").empty();

    $("#groupImage").empty();
    $("#groupName").empty();
    $("#groupDescription").empty();
    $("#groupPeople").empty();
    $("#buttonJoinDiv").empty();
    $("#token").empty();
    $("#tokenAmount").empty();

    $("#join-btn").show();
    $("#chat-div").hide();
    $("#chat-title").hide();
    $("#message-input-div").hide();

    $("#groupImage").html(`<img src="${image}" width=200, height=200, style="border: 3px solid black; border-radius: 50%;" />`);
    $("#groupName").html(name);
    $("#groupDescription").html(description);
    $("#chain").html(`<h6 class="text-center mt-4 fs-5">Requirements to join:</h6>Chain: <strong>${chainName}</strong>`);
    $("#token").html(`Token: <strong>${tokenName} (${tokenSymbol})</strong>`);
    $("#tokenAmount").html(`Amount: <strong>${amount} ${tokenTicker}</strong>`);
    $("#buttonJoinDiv").html(`<button onclick="joinChatGroup('${id}', '${tokenAddress}', '${tokenAmount}', '${name}', '${image}', '${chain}', '${nft}')" class="btn btn-success w-100 fw-bold mt-5 mb-5" id="join-btn">Start Chatting</button>`);

    $("#infoAboutGroup").show();
}




//Join btn clicked:
async function joinChatGroup(id, tokenAddress, tokenAmount, name, img, chain, nft) {
    $("#join-btn").hide();
    $("#message-input-div").hide();
    $("#info3").show();
    $("#info3").html("Joining, please wait!");

    let tokenBalance;
    let requiredBalance;
    let nftBalance;
    
    if(nft == 0){
        nftBalance = await checkNFTBalance(chain, tokenAddress);
    }else{
        let token = await Moralis.Cloud.run("getToken", {address: tokenAddress, chain: chain});
        let decimals;
        if(token == undefined) {
            decimals = 18;
        }else{
            decimals = token[0].decimals;
        }
        requiredBalance = tokenAmount / (10**decimals);
        tokenBalance = await checkBalance(chain, tokenAddress, tokenAmount, decimals);
    }

    if(tokenBalance < requiredBalance) {
        $("#info3").hide();
        $("#join-btn").show();
        $("#message-input-div").hide();
        alert("Insufficient balance! Cannot join chat group!");
    }else if(nftBalance < tokenAmount) {
        $("#info3").hide();
        $("#join-btn").show();
        $("#message-input-div").hide();
        alert("Insufficient balance! Cannot join chat group!");
    }else{
        //subscription.unsubscribe();
        $("#info3").html("Joined!");
        $("#chatDiv").empty();
        $("#chat-title").html(`<img src="${img}" width=40 height=40 style="border: 1px solid black; border-radius: 50%;" class="d-inline-block float-start fw-bolder"/><h4 class="d-inline-block ms-3">${name}</h4><hr class="fw-bold">`)
        $("#message-input-div").html(`<hr>
        <div class="input-group mb-1">
            <textarea type="text" rows="2" id="message-input" class="form-control" placeholder="Write your message . . . ." aria-label="Write your Message" aria-describedby="send-btn"></textarea>
            <button id="send-btn" type="button" onclick="sendMessage('${id}', '${chain}', '${tokenAddress}', '${tokenAmount}', '${nft}')" class="btn btn-primary">Send</button>
        </div>`);
        $("#message-input-div").show();
        $("#chat-div").show();
        $("#chat-title").show();
        getHistory(id);
        queryMessage(id);
    }
}

async function checkBalance(chain, tokenAddress) {
    const user = Moralis.User.current();
    let ethAddress = user.get("ethAddress");

    if(tokenAddress.length > 6){
        const tokenBalanceObject1 = await Moralis.Web3.getERC20({chain: chain, tokenAddress: tokenAddress, address: ethAddress});
        return tokenBalanceObject1.balance;
    }else{
        const tokenBalanceObject = await Moralis.Web3API.account.getNativeBalance({chain: chain, address: ethAddress})
        return tokenBalanceObject.balance / (10**18);
    }
}


async function checkNFTBalance(chain, tokenAddress){
    const user = Moralis.User.current();
    let ethAddress = user.get("ethAddress");
    const options = { chain: chain, address: ethAddress, token_address: tokenAddress};
    const nfts = await Moralis.Web3API.account.getNFTsForContract(options);
    let arr = nfts.result;
    return arr.length;
}
