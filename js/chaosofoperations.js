var soundsDirectory = "./assets/sounds/";

var MAX_NUMBER_VALUE = 20;
var MIN_NUMBER_VALUE = 1;

var DEFAULT_OPERATORS = ["^", "&times;", "&times;", "&divide;", "&divide;", "mod", "+", "+", "-", "-"];

var currentPlayer = 1;

var playerSwitchAnimationInterval = 300;

var debug = false;

$(document).ready
(
	function () 
	{
		SetDebugState();
		NewGame();
		PopulatePlayerNames();
		SetButtonEventListeners();
	}
);

function SetButtonEventListeners()
{
	$("button.new-game").click(NewGame);
	$("button.instructions").click(DisplayInstructions);
}

function PopulatePlayerNames()
{
	if (debug)
	{
		$(".player-1-name").html("Cody");
		$(".player-2-name").html("Bennett");
	}
	else
	{
		$(".player-1-name").html(prompt("Enter the name of the player with the most mathematical knowledge."));
		$(".player-2-name").html(prompt("Enter the name of the player with the least mathematical knowledge."));
	}
}

function NewGame()
{
	ResetGameBoard();
	GenerateNumberTilesP1();
	GenerateNumberTilesP2();
	GenerateOperatorTilesP1();
	GenerateOperatorTilesP2();
	SetTileEventListeners();
	EvaluateBothPlayerEquations();
	AudioStartGame();
	$(".winner").addClass("display-none");
}

function GetRandomTileNumber()
{
	var range = MAX_NUMBER_VALUE - MIN_NUMBER_VALUE + 1;
	return parseInt(Math.random() * range + MIN_NUMBER_VALUE);
}

function GenerateNumberTilesP1()
{
	for (var i = 0; i < DEFAULT_OPERATORS.length; i++)
	{
		$(".player-1 .number-tiles").append(
			"<div class=\"tile number-tile\">"
				+ GetHoverMovePreviewDivHTML("number-before")
				+ "<div class=\"tile-value\">"
				+ GetRandomTileNumber()
				+ "</div>"
				+ GetHoverMovePreviewDivHTML("number-after")
				+ "</div>"
		);
	}
}

function GenerateNumberTilesP2()
{
	//Clone player 1 number tiles into player 2 number tiles
	$(".player-2 .number-tiles").append($(".player-1 .number-tiles").html());
}

function GenerateOperatorTilesP1()
{
	$.each(
		DEFAULT_OPERATORS, 
		function (key, value)
		{
			$(".player-1 .operator-tiles").append(
				"<div class=\"tile operator-tile\">"
					+ GetHoverMovePreviewDivHTML("operator-before")
					+ "<div class=\"tile-value\">"
					+ value
					+ "</div>"
					+ GetHoverMovePreviewDivHTML("operator-after")
					+ "</div>"
			);
		}
	);
}

function GenerateOperatorTilesP2()
{
	//Clone player 1 operator tiles into player 2 operator tiles
	$(".player-2 .operator-tiles").append($(".player-1 .operator-tiles").html());
}

function DisableTileEventListeners()
{
	$(".tile").off("click");
	$(".tile").off("mouseenter");
	$(".move-preview-hover-listener").off("mouseenter");
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
			UserSelectUnplayedTile(tileType, this);
		}
	).mouseenter(AudioMouseOver);
}

function UserSelectUnplayedTile(tileType, tileElement)
{
	$(".player-" + currentPlayer + " ." + tileType + "-tiles .tile").removeClass("selected");
	$(".played-tiles .selected").remove();
	$(tileElement).addClass("selected");
	AudioSelectObject();
}

function SetPlayedTilesEventListeners()
{
	$(".played-tiles .number-tile").click(
		UserDisplayClickMovePreviews
	);
	$(".played-tiles .move-preview-hover-listener").mouseenter(
		UserDisplayHoverMovePreview
	);
}

function UserDisplayClickMovePreviews()
{
	if (!CurrentPlayerSelectedTwoTiles())
	{
		return;
	}
	
	RemoveMovePreviews();
	var previewNumberBefore = $(".player-" + currentPlayer + " .number-tile.selected").clone().addClass("click-move-preview");
	var previewOperatorBefore = $(".player-" + currentPlayer + " .operator-tile.selected").clone().addClass("click-move-preview");
	var previewNumberAfter = previewNumberBefore.clone().addClass("click-move-preview-after");
	var previewOperatorAfter = previewOperatorBefore.clone().addClass("click-move-preview-after");
	$(previewNumberBefore).addClass("click-move-preview-before");
	$(previewOperatorBefore).addClass("click-move-preview-before");
	
	$(this).before(previewNumberBefore)
		.before(previewOperatorBefore)
		.after(previewNumberAfter)
		.after(previewOperatorAfter);
	
	SetClickMovePreviewEventListener("before");
	SetClickMovePreviewEventListener("after");
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

function SetClickMovePreviewEventListener(beforeOrAfter)
{
	$(".click-move-preview-" + beforeOrAfter).click(
		function () 
		{
			UserChooseClickMovePreview(beforeOrAfter);
		}
	);
}

function UserChooseClickMovePreview(beforeOrAfter)
{
	$(".click-move-preview-" + beforeOrAfter).removeClass("selected");
	$(".click-move-preview-" + beforeOrAfter).removeClass("click-move-preview");
	$(".click-move-preview-" + beforeOrAfter).removeClass("click-move-preview-" + beforeOrAfter);
	$(".selected").remove();
	AudioPlayPiece();
	NextTurn();
}

function UserDisplayHoverMovePreview()
{
	if (!CurrentPlayerSelectedTwoTiles())
	{
		return;
	}
	
	RemoveMovePreviews();
	
	var numberPreview = $(".player-" + currentPlayer + " .number-tile.selected").clone().addClass("hover-move-preview");
	var operatorPreview = $(".player-" + currentPlayer + " .operator-tile.selected").clone().addClass("hover-move-preview");
	
	if ($(this).hasClass("move-preview-hover-listener-number-before"))
	{
		$(this.parentNode)
			.before(numberPreview.addClass("no-border-right"))
			.before(operatorPreview.addClass("no-border-left"));
	}
	else if ($(this).hasClass("move-preview-hover-listener-number-after"))
	{
		$(this.parentNode)
			.after(numberPreview.addClass("no-border-left"))
			.after(operatorPreview.addClass("no-border-right"));
	}
	else if ($(this).hasClass("move-preview-hover-listener-operator-before"))
	{
		$(this.parentNode)
			.before(operatorPreview.addClass("no-border-right"))
			.before(numberPreview.addClass("no-border-left"));
	}
	else if ($(this).hasClass("move-preview-hover-listener-operator-after"))
	{
		$(this.parentNode)
			.after(operatorPreview.addClass("no-border-left"))
			.after(numberPreview.addClass("no-border-right"));
	}
	
	$(".hover-move-preview").click(UserChooseHoverMovePreview);
}

function UserChooseHoverMovePreview()
{
	$(".hover-move-preview").removeClass("selected");
	$(".hover-move-preview").removeClass("hover-move-preview");
	$(".selected").remove();
	AudioPlayPiece();
	NextTurn();
}

function GetHoverMovePreviewDivHTML(specificationClass)
{
	return "<div class=\"move-preview-hover-listener move-preview-hover-listener-" + specificationClass + "\"></div>";
}

function RemoveMovePreviews()
{
	$(".click-move-preview, .hover-move-preview").remove();
}

function SwitchPlayers()
{
	if (currentPlayer === 1)
	{
		$("body").removeClass("player-1-theme").addClass("player-2-theme");
		$("header").removeClass("player-2-theme").addClass("player-1-theme");
		$("header button").removeClass("player-1-theme").addClass("player-2-theme");
		SwitchPlayersElements();
		currentPlayer = 2;
	}
	else if (currentPlayer === 2)
	{
		$("body").removeClass("player-2-theme").addClass("player-1-theme");
		$("header").removeClass("player-1-theme").addClass("player-2-theme");
		$("header button").removeClass("player-2-theme").addClass("player-1-theme");
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

function AnimateSwitchPlayerElement(playerNumber, newTopValue)
{
	$(".player-" + playerNumber).animate(
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
	HandleWinCondition();
}

function EvaluateBothPlayerEquations()
{
	EvaluateAndDisplayPlayerEquation(1, GetPlayerEquationToEvaluate(1));
	EvaluateAndDisplayPlayerEquation(2, GetPlayerEquationToEvaluate(2));
}

function GetPlayerEquationToEvaluate(playerNumber)
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
	return expressionToEvaluate;
}

function EvaluateAndDisplayPlayerEquation(playerNumber, equationToEvaluate)
{
	$(".player-" + playerNumber + " .equation-evaluation").html("= " + eval(equationToEvaluate));
}

function CheckIfLastTileHasBeenPlayed()
{
	return $(".player-2 .number-tiles .tile").length == 0;
}

function HandleWinCondition()
{
	if (!CheckIfLastTileHasBeenPlayed())
	{
		return;
	}
	var winningPlayer = WhichPlayerIsWinning();
	if (winningPlayer == 0)
	{
		$(".player-1 .winner, .player-2 .winner").removeClass("display-none");
	}
	else
	{
		$(".player-" + winningPlayer + " .winner").removeClass("display-none");
	}
	AudioWinGame();
}

function WhichPlayerIsWinning()
{
	var playerOneEquation = GetPlayerEquationToEvaluate(1);
	var playerTwoEquation = GetPlayerEquationToEvaluate(2);
	if (eval(playerOneEquation + ">" + playerTwoEquation))
	{
		return 1;
	}
	else if (eval(playerOneEquation + "<" + playerTwoEquation))
	{
		return 2;
	}
	else
	{
		return 0;
	}
}

function ResetGameBoard()
{
	$(".player-1 .played-tiles").html($(".player-1 .start-tile"));
	$(".player-2 .played-tiles").html($(".player-2 .start-tile"));
	$(".number-tiles, .operator-tiles").html("");
	if (currentPlayer == 2)
	{
		SwitchPlayers();
	}
}

function DisplayInstructions()
{
	if ($("div.instructions").css("display") === "none")
	{
		$("div.instructions").slideDown();
	}
	else
	{
		$("div.instructions").slideUp();
	}
}


function SetDebugState()
{
	if (window.location.hash.match(/debug/))
	{
		debug = true;
		DEFAULT_OPERATORS = ["+", "^"];
		//PlayAudioFile = function (audioFileName) {};
	}
}


function PlayAudioFile(audioFileName)
{
	$(".game-audio").first().after($(".game-audio").first().clone().attr("src", soundsDirectory + audioFileName));
	setTimeout(PopAudioElement, 50000);
}

function PopAudioElement()
{
	$(".game-audio").last().remove();
}

function AudioSelectObject()
{
	PlayAudioFile("dice_popper_pop_01.wav");
}

function AudioMouseOver()
{
	PlayAudioFile("card_deal_01.wav");
}

function AudioWinGame()
{
	PlayAudioFile("gong_hit_short.wav");
}

function AudioPlayPiece()
{
	if (CheckIfLastTileHasBeenPlayed())
	{
		return;
	}
	PlayAudioFile("highlight_pleasant_03.wav");
}

function AudioStartGame()
{
	PlayAudioFile("highlight_pleasant_06.wav");
}
