var MAX_NUMBER_VALUE = 100;
var MIN_NUMBER_VALUE = 1;

var DEFAULT_OPERATORS = ["^", "&times;", "&times;", "&divide;", "&divide;", "mod", "+", "+", "-", "-"];

var currentPlayer = 1;

$(document).ready
(
	function () 
	{
		NewGame();
	}
);

function NewGame()
{
	//Build the hand for player 1
	GenerateNumberTilesP1();
	//copy it for player 2
	$(".player-2 .number-tiles").append($(".player-1 .number-tiles").html());
	//build the operator tiles
	GenerateOperatorTilesP1();
	$(".player-2 .operator-tiles").append($(".player-1 .operator-tiles").html());
	AddTileEventListeners('number');
	AddTileEventListeners('operator');
	AddPlayedTilesEventListeners();
}

function GenerateNumberTilesP1()
{
	for (var i = 0; i < 10; i++)
	{
		$(".player-1 .number-tiles").append("<div class=\"tile number-tile\">" + GetRandomTileNumber() + "</div>");
	}
}

function GetRandomTileNumber()
{
	var range = MAX_NUMBER_VALUE - MIN_NUMBER_VALUE;
	return parseInt(Math.random() * range + MIN_NUMBER_VALUE);
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

function DisableTileEventListeners()
{
	$(".tile").off( "click" );
}

function AddTileEventListeners(tileType)
{
	$(".player-" + currentPlayer + " ." + tileType + "-tiles .tile").click(
		function () {
			SelectTile(tileType, this);
		}
	);
}

function AddOperatorTileEventListeners()
{
	
}

function SelectTile(tileType, tileElement)
{
	$(".player-" + currentPlayer + " ." + tileType + "-tiles .tile").removeClass("selected");
	$(tileElement).addClass( "selected" );
}

function AddPlayedTilesEventListeners()
{
	$(".player-" + currentPlayer + " .played-tiles .number-tile").hover(
		DisplayPossibleMoves
	);
}

function DisplayPossibleMoves()
{
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
	
	$(".move-preview-before").click(
		function () {
			chooseMove("before");
		}
	);
	$(".move-preview-after").click(
		function () {
			chooseMove("after");
		}
	);
}

function chooseMove(beforeOrAfter)
{
	$(".move-preview-" + beforeOrAfter).removeClass("selected");
	$(".move-preview-" + beforeOrAfter).removeClass("move-preview");
	$(".move-preview-" + beforeOrAfter).removeClass("move-preview-" + beforeOrAfter);
	$(".selected").remove();
	SwitchPlayers();
}

function SwitchPlayers()
{
	if ( currentPlayer === 1 )
	{
		currentPlayer = 2;
	}
	else if ( currentPlayer === 2 )
	{
		currentPlayer = 1;
	}
	else
	{
		alert("WHAT YOU DID? WHAT YOU DID NAAAAH? AHM GONNA BEAT YOU WITH MAH FIIIIISTS!");
	}
}
