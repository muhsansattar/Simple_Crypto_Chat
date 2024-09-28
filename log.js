async function init() {
    window.web3 = await Moralis.Web3.enable();
    const user = await Moralis.User.current();

    if(user){
        renderUserProfile(user.get("Image"), user.get("username"), user.get("ethAddress"));
        getAllGroups();
        $("#my-iframe").hide();
        Moralis.initPlugins();
        $("#chatDiv").empty();
        $("#chatDiv").html(`<p class="text-center fw-bold fs-5 m-3">Select one of the groups on the left, if there is none, create one!<br>And than click Join!</p>`);
        $("#groupInfoDiv").empty();
        $("#groupInfoDiv").html(`<p class="text-center fw-bold fs-5 m-3">Select one of the groups on the left, if there is none, create one!<br>And than click Join!</p>`);
        $("#login").hide();
        $("#all").show();
        $("#infoAboutGroup").hide();
        $("#chat-div").html(`
            <h1 class="text-center fs-1 text-decoration-underline">Rules - please read:</h1>
            <div class="mt-5 mb-5 fs-5">
            <strong><ol>
                <li>Zero tolerance policy for hate speech, racism, scamming, or other toxic behaviour. Be nice!</li>
                <li>Use appropriate channels. We love sharing, but keep the conversation relevant and the other projects in their chat group.</li>
                <li>Don’t talk about politics!</li>
                <li>No NSFW content!</li>
            </ol></strong>
            </div>
            <div class="fs-5 mb-3 fw-bold text-decoration-underline">Sometimes sending message or joining group will take a bit longer so please be patient.</div><br>
            <h3>Thanks for following the rules!</h3>
        `);
        $("#chat-title").hide();
        $("#message-input-div").hide();
    }else{
        $("#all").hide();
        $("#login").show();
    }
}


async function loginMetaMask() {
    try{
        const user = await Moralis.Web3.authenticate();
        init();
    }catch(err){
        console.log(err);
    }
}

async function logInWalletConnect() {
    try{
        const user = await Moralis.Web3.authenticate({ provider: "walletconnect" });
        init();
    }catch (err){
        console.log(err);
    }
}


async function logOut() {
    try{
        await Moralis.User.logOut();
    }catch(err){
        console.log("Error occured: " + err);
    }
}


async function updateProfilePic() {
    try {
        const user = await Moralis.User.current();
        
        //Updates:
        const url = await uploadNewImage();
        user.set("Image", url);
        await user.save();

        //Renders:
        renderUserProfile(user.get("Image"), user.get("username"));
        $("#info1").html("<strong>DONE</strong>");
    } catch (error) {
        console.log("Error: " + error.code + " " + error.message);
    }
}

async function updateProfileUsername() {
    try {
        const user = await Moralis.User.current();

        //Updates:
        user.set("username", $("#change-username-input").val());
        await user.save();

        //Renders:
        renderUserProfile(user.get("Image"), user.get("username"), user.get("ethAddress"));
        $("#info").empty();
        $("#info").html("<strong>DONE</strong>");
    } catch (error) {
        alert("Username already taken!");
    }
}





function renderUserProfile(url, username, ethAddress) {
    //Profile Pic:
    if(url == undefined){
        $("#profileIMG").empty("");
        $("#profileIMG").html(`No Image Selected`);
        $("#profileIMG").show();
    }else{
        $("#profileIMG").empty("");
        $("#profileIMG").html(`<img src=${url} width=100, height=100 style="border-radius: 50%; border: 3px solid black;"></img>`);
        $("#profileIMG").show();
    }

    //Username:
    if(username == undefined){
        $("#username").empty();
        $("#username").html(`User`);
        $("#username").show();
    }else{
        $("#username").empty("");
        $("#username").html(username);
        $("#username").show();
    }

    //Eth Address:
    var address = ethAddress.substring(0, 8);
    address += " . . . . .";
    $("#ethAddress").empty();
    $("#ethAddress").html(address)
    $("#ethAddress").show();
}


async function upload() {
    const data = profileIMGInput.files[0];
    const file = new Moralis.File(data.name, data);
    await file.saveIPFS();
    return file.ipfs();
}

async function uploadNewImage() {
    const data = changeProfilePic.files[0];
    const file = new Moralis.File("profilepic", data);
    await file.saveIPFS();
    return file.ipfs();
}


async function getTokenBalancesOfUser() {
    try{
        const user = await Moralis.User.current();
        let address = user.get("ethAddress")
        let chain = $("#balances-chain-select").val();

        const options = { chain: chain }
        const balances = await Moralis.Web3.getAllERC20(options);

        $("#balancesDiv").empty();
        balances.forEach( e => {
            let currentDiv = document.getElementById("balancesDiv");
            let content = `
                <div class="row">
                    <hr>
                    <span class="col-6 text-starts"><strong>${e.name}</strong> (${e.symbol})</span><span class="col-6 text-end">${(parseInt(e.balance)/(10**parseInt(e.decimals))).toFixed(4)} ${e.symbol}</span>
                    <br>
                </div>`
            currentDiv.innerHTML += content;
        })


    }catch (err){
        console.log("Error occured: " + err);
    }
}


