var soundsDirectory = "./assets/sounds/";

var MAX_NUMBER_VALUE = 100;
var MIN_NUMBER_VALUE = 1;

var DEFAULT_OPERATORS = ["^", "&times;", "&times;", "&divide;", "&divide;", "mod", "+", "+", "-", "-"];

var currentPlayer = 1;

var playerOneColor;
var playerTwoColor;

var playerSwitchAnimationInterval = 300;

$(document).ready
(
	function () 
	{
		NewGame();
		PopulatePlayerNames();
		SetPlayerColors();
	}
);

function PopulatePlayerNames()
{
	$(".player-1-name").html(prompt("Enter the name of the player with the most mathematical knowledge."));
	$(".player-2-name").html(prompt("Enter the name of the player with the least mathematical knowledge."));
}

function SetPlayerColors()
{
	playerOneColor = $("body").css("background-color");
	playerTwoColor = $("header").first().css("background-color");
}

function NewGame()
{
	GenerateNumberTilesP1();
	GenerateNumberTilesP2();
	GenerateOperatorTilesP1();
	GenerateOperatorTilesP2();
	SetTileEventListeners();
	EvaluateBothPlayerEquations();
}

function GetRandomTileNumber()
{
	var range = MAX_NUMBER_VALUE - MIN_NUMBER_VALUE;
	return parseInt(Math.random() * range + MIN_NUMBER_VALUE);
}

function GenerateNumberTilesP1()
{
	for (var i = 0; i < 40; i++)
	{
		$(".player-1 .number-tiles").append("<div class=\"tile number-tile\">" + GetRandomTileNumber() + "</div>");
	}
}

function GenerateNumberTilesP2()
{
	//clone player 1 number tiles into player 2 number tiles
	$(".player-2 .number-tiles").append($(".player-1 .number-tiles").html());
}

function GenerateOperatorTilesP1()
{
	$.each(
		DEFAULT_OPERATORS, 
		function (key, value)
		{
			$(".player-1 .operator-tiles").append("<div class=\"tile operator-tile\">" + value + "</div>");
		}
	);
}

function GenerateOperatorTilesP2()
{
	//clone player 1 operator tiles into player 2 operator tiles
	$(".player-2 .operator-tiles").append($(".player-1 .operator-tiles").html());
}

function DisableTileEventListeners()
{
	$(".tile").off( "click" );
}

function SetTileEventListeners()
{
	SetUnplayedTileEventListeners("number");
	SetUnplayedTileEventListeners("operator");
	SetPlayedTilesEventListeners();
}

function SetUnplayedTileEventListeners(tileType)
{
	$(".player-" + currentPlayer + " ." + tileType + "-tiles .tile").click(
		function ()
		{
			UserSelectTile(tileType, this);
		}
	);
}

function UserSelectTile(tileType, tileElement)
{
	$(".player-" + currentPlayer + " ." + tileType + "-tiles .tile").removeClass("selected");
	$(".played-tiles .selected").remove();
	$(tileElement).addClass( "selected" );
}

function SetPlayedTilesEventListeners()
{
	$(".played-tiles .number-tile").click(
		DisplayPossibleMoves
	);
}

function DisplayPossibleMoves()
{
	if (!CurrentPlayerSelectedTwoTiles())
	{
		return;
	}
	
	$(".move-preview").remove();
	var previewNumberBefore = $(".player-" + currentPlayer + " .number-tile.selected").clone();
	var previewOperatorBefore = $(".player-" + currentPlayer + " .operator-tile.selected").clone();
	$(previewNumberBefore).addClass("move-preview");
	$(previewOperatorBefore).addClass("move-preview");
	var previewNumberAfter = previewNumberBefore.clone();
	var previewOperatorAfter = previewOperatorBefore.clone();
	$(previewNumberBefore).addClass("move-preview-before");
	$(previewOperatorBefore).addClass("move-preview-before");
	$(previewNumberAfter).addClass("move-preview-after");
	$(previewOperatorAfter).addClass("move-preview-after");
	
	$(this).before(previewNumberBefore);
	$(this).before(previewOperatorBefore);
	$(this).after(previewNumberAfter);
	$(this).after(previewOperatorAfter);
	
	SetMovePreviewClickEventListener("before");
	SetMovePreviewClickEventListener("after");
}

function CurrentPlayerSelectedTwoTiles()
{
	if (
		$(".player-" + currentPlayer + " .number-tiles .selected").length +
			$(".player-" + currentPlayer + " .operator-tiles .selected").length
		== 2
	) {
		return true;
	}
	return false;
}

function SetMovePreviewClickEventListener(beforeOrAfter)
{
	$(".move-preview-" + beforeOrAfter).click(
		function () 
		{
			UserChooseMove(beforeOrAfter);
		}
	);
}

function UserChooseMove(beforeOrAfter)
{
	$(".move-preview-" + beforeOrAfter).removeClass("selected");
	$(".move-preview-" + beforeOrAfter).removeClass("move-preview");
	$(".move-preview-" + beforeOrAfter).removeClass("move-preview-" + beforeOrAfter);
	$(".selected").remove();
	NextTurn();
}

function SwitchPlayers()
{
	if ( currentPlayer === 1 )
	{
		$("body").css("background-color", playerTwoColor);
		$("header").css("background-color", playerOneColor);
		$("header h1").css("color", playerTwoColor);
		SwitchPlayersElements();
		currentPlayer = 2;
	}
	else if ( currentPlayer === 2 )
	{
		$("body").css("background-color", playerOneColor);
		$("header").css("background-color", playerTwoColor);
		$("header h1").css("color", playerOneColor);
		SwitchPlayersElements();
		currentPlayer = 1;
	}
	else
	{
		alert("WHAT YOU DID? WHAT YOU DID NAAAAH? AHM GONNA BEAT YOU WITH MAH FIIIIISTS!");
	}
}

function SwitchPlayersElements()
{
	$(".player-1, .player-2").css("position", "absolute");
	
	var playerOneHeight = $(".player-1").outerHeight();
	var playerTwoHeight = $(".player-2").outerHeight();
	var playerOneTop, playerTwoTop;
	
	if (currentPlayer === 1)
	{
		playerOneTop = playerTwoHeight;
		playerTwoTop = 0;
		$(".player-2").css("top", playerOneHeight);
	}
	else if (currentPlayer === 2)
	{
		playerOneTop = 0;
		playerTwoTop = playerOneHeight;
		$(".player-1").css("top", playerTwoHeight);
	}
	else
	{
		alert("Error: The current player is not set properly.");
		return;
	}
	
	AnimateSwitchPlayerElement(1, playerOneTop);
	AnimateSwitchPlayerElement(2, playerTwoTop);
	setTimeout(
		function ()
		{
			//(currentPlayer%2+1) inverts 2 to 1 and vice versa
			$(".player-" + currentPlayer).insertBefore($(".player-" + (currentPlayer%2+1)));
			$(".player-1, .player-2").css("position", "initial");
		},
		playerSwitchAnimationInterval
	);
}

function AnimateSwitchPlayerElement(whichPlayer, newTopValue)
{
	$(".player-" + whichPlayer).animate(
		{
			"top": newTopValue
		},
		playerSwitchAnimationInterval
	);
}

function NextTurn()
{
	SwitchPlayers();
	EvaluateBothPlayerEquations();
	DisableTileEventListeners();
	SetTileEventListeners();
}

function EvaluateBothPlayerEquations()
{
	EvaluatePlayerEquation(1);
	EvaluatePlayerEquation(2);
}

function EvaluatePlayerEquation(playerNumber)
{
	var expressionElements = $(".player-" + playerNumber + " .played-tiles");
	var humanReadableExpression = "";
	expressionElements.each(
		function() {
			humanReadableExpression += this.textContent.replace(/\s/g, "");
		}
	);
	var expressionToEvaluate = humanReadableExpression;
	expressionToEvaluate = expressionToEvaluate.replace(/×/g, "*");
	expressionToEvaluate = expressionToEvaluate.replace(/÷/g, "/");
	expressionToEvaluate = expressionToEvaluate.replace(/mod/g, "%");
	expressionToEvaluate = expressionToEvaluate.replace(/(\d+)\^(\d+)/g, "Math.pow($1, $2)");
	expressionToEvaluate = expressionToEvaluate.replace(/Math.pow\((.+?)\)\^(\d+)/g, "Math.pow(Math.pow($1), $2)");
	$(".player-" + playerNumber + " .equation-evaluation").html("= " + eval(expressionToEvaluate));
}

function playAudioFile(audioFileName)
{
	$(".game-audio").attr("src", soundsDirectory + audioFileName);
}
