window.onload = function() {
    Moralis.initialize("eBatNLonO2KHzgxJ81T082IFmwbY4PsbsVsPzWrk");
    Moralis.serverURL = "https://fpqcp09qsfeu.moralisweb3.com:2053/server";
    
    init();
    $("#my-iframe").hide();
    
    $("#logout-btn").click(function(){
        $("#login").show();
        $("#all").hide();
        logOut();
    });
    
    $("#createGroup-btn").click(function() {
        let checkbox = document.getElementById("checkbox");
        let checkboxState = checkbox.checked;
        if(!checkboxState){
            createGroup(); 
            $("#info2").empty(); 
        }else{
            createNFTGroup();
            $("#info2").empty(); 
        }
    });




    //Plugin - buy crypto:
    $("#btn-buy").click(function() { buyCrypto() });
    async function buyCrypto() {
        let response = await Moralis.Plugins.fiat.buy({}, {disableTriggers: true});
        document.getElementById('my-iframe').src = response.result.data;
        $("#my-iframe").show();
    }

    $(document).on('keyup', function(e) {
        if($("#my-iframe").is(":visible")) {
            if (e.key == "Escape") {
                $('#my-iframe').hide();
            }
        }
    });

    $(document).ready(function(){
        $("#all").click(function(){
            if($("#my-iframe").is(":visible")) {
                $('#my-iframe').hide();
            }
        });
    });

    



    $("#btn-metamask").click(function() { loginMetaMask() });
    $("#btn-walletconnect").click(function() { logInWalletConnect() });
    $("#change-pic-btn").click(function() { updateProfilePic(); $("#info1").empty();});
    $("#change-username-btn").click(function() { updateProfileUsername(); $("#info").empty(); });
    $("#show-balances-btn").click(function() { getTokenBalancesOfUser() });
    $("#send-btn").click(function() { sendMessage() });
    
    
}
    
