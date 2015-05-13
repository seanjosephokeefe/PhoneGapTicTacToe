//scripts.js
var players = new Array();
var currentPlayerTurn = 0;
var winner = false;
var round = 1;
var combos = [['LU', 'MU', 'RU'], ['LM', 'MM', 'RM'], ['LL', 'ML', 'RL'], ['LU', 'LM', 'LL'], ['MU', 'MM', 'ML'], ['RU', 'RM', 'RL'], ['LU', 'MM', 'RL'], ['LL', 'MM', 'RU']];
var squares = ['LU', 'LM', 'LL', 'MU', 'MM', 'ML', 'RU', 'RM', 'RL'];

function playerObject(name, icon) {
    this.name = name;
    this.icon = icon;
}

$(document).ready(function () {
    BeginNewGame(1);
});

$(".gameGrid").click(function () {
    CheckTurn(this.id);
});

function BeginNewGame() {
    $("#DivIntro").show();
    $("#DivGame").hide();
    $("#DivMessage").html("");
    $("#DivIntro").html("");
    if (currentPlayerTurn == 1)
        $("#DivIntro").append("First Player: " + players[0].name + "<br /><br />");
    $("#DivIntro").append("Enter Name for Player " + (currentPlayerTurn + 1) + ":<br />");
    $("#DivIntro").append("<input type='text' id='TBPlayer' />&nbsp;");
    $("#DivIntro").append("<input type='button' value='save name' onclick='AssignPlayer()' />");
    $("#TBPlayer").focus();
}

function AssignPlayer() {
    if ($("#TBPlayer").val().length == 0)
        $("#DivMessage").html("Please enter a player name");
    else {
        players.push(new playerObject($("#TBPlayer").val(), null))
        if (currentPlayerTurn == 0) {
            currentPlayerTurn++;
            BeginNewGame();
        }
        else {
            currentPlayerTurn = 0;
            FlipCoin();
        }
    }
    return (true);
}

function FlipCoin() {
    $("#DivIntro").show("");
    $("#DivMessage").html("");
    $("#DivIntro").html("");
    $("#DivIntro").append("First Player: " + players[0].name + "<br />");
    $("#DivIntro").append("Second Player: " + players[1].name + "<br /><br />");
    $("#DivIntro").append("Virtual decider,<br />to see who goes first: ");
    $("#DivIntro").append("<input type='button' value='decide' onclick='GetPlayerOrder();' />");
}

function GetPlayerOrder() {
    currentPlayerTurn = (Math.floor((Math.random() * 10) + 1)%2);
    $("#DivIntro").html("");
    $("#DivIntro").append("Player " + (currentPlayerTurn + 1) + ": " + players[currentPlayerTurn].name + ", will go first.<br /><br />");
    var playerToDecide = 0;
    if (currentPlayerTurn == 0)
        playerToDecide = 1;
    $("#DivIntro").append("So player " + (playerToDecide + 1) + ": " + players[playerToDecide].name + ", choose X or O<br /><br />");
    $("#DivIntro").append("<div class='center'><span id='SpanX' class='center' onclick='GetXorO(\"x\",\"" + playerToDecide + "\");'><img src='images/x.png' /></span>&nbsp;<span id='SpanO' class='center' onclick='GetXorO(\"o\",\"" + playerToDecide + "\");'><img src='images/o.png' /></span>");
}

function GetXorO(which, playerToDecide) {
    if (which == 'x') {
        players[playerToDecide].icon = 'x';
        players[currentPlayerTurn].icon = 'o';
    }
    else {
        players[playerToDecide].icon = 'o';
        players[currentPlayerTurn].icon = 'x';
    }
    PlayGame();
}

function PlayGame() {
    winner = false;
    $("#DivIntro").html("");
    $("#DivIntro").hide();
    $("#DivGame").show();

    BeginTurn();
}

function BeginTurn() {
    $("#DivMessage").html("It's player " + (currentPlayerTurn + 1) + ": [" + players[currentPlayerTurn].name + "] turn...");
}

function CheckTurn(squareID) {
    if ($("#Img" + squareID).attr("src") == "images/blank.png") {
        if (!winner){
            $("#Img" + squareID).attr("src", "images/" + players[currentPlayerTurn].icon + ".png");
            var result=EvaluateGrid();
            if (result==false) {
                if (currentPlayerTurn == 1)
                    currentPlayerTurn = 0;
                else
                    currentPlayerTurn = 1;
                $("#DivMessage").html("It's player " + (currentPlayerTurn + 1) + ": [" + players[currentPlayerTurn].name + "] turn...");
            }
        }
    }
}

function EvaluateGrid(){
    var won = false;
    player = 0;
    while (player < 2) {
        for (var i = 0; i < combos.length; i++) {
            if ((won==false)&&(($("#Img" + combos[i][0]).attr("src") == "images/" + players[player].icon + ".png") && ($("#Img" + combos[i][1]).attr("src") == "images/" + players[player].icon + ".png") && ($("#Img" + combos[i][2]).attr("src") == "images/" + players[player].icon + ".png"))) {
                //winner
                $("#Img" + combos[i][0]).attr("src", "images/win_" + players[player].icon + ".png");
                $("#Img" + combos[i][1]).attr("src", "images/win_" + players[player].icon + ".png");
                $("#Img" + combos[i][2]).attr("src", "images/win_" + players[player].icon + ".png");
                $("#DivMessage").html("Congratulations player " + (player + 1) + ": " + players[player].name + ".");
                $("#DivMessage").append("<br /> You won!!! Play Again? <input type='button' value='ok' onclick='ResetGame();' />");
                won = true;
            }
        }
        player++;
    }
    round++;
    if (round == 10) {
        $("#DivMessage").html("Sometimes in life there are no winners.");
        $("#DivMessage").append("<br />Play Again? <input type='button' value='ok' onclick='ResetGame();' />");
        won = true;
    }
    winner = won;
    return won;
}

function ResetGame() {
    currentPlayerTurn = 0;
    round = 1;
    for (var i = 0; i < squares.length; i++) {
        $("#Img" + squares[i]).attr("src", "images/blank.png");
    }
    $("#DivGame").hide();
    $("#DivMessage").html("Keep same players? <input type='button' value='yes' onclick='FlipCoin();' />&nbsp;<input type='button' value='no' onclick='ClearPlayers();' />");
}

function ClearPlayers() {
    winner = false;
    players = new Array();
    BeginNewGame();
}