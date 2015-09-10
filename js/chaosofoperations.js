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
	GenerateNumberTilesP2();
	//Generate the operator tiles
	GenerateOperatorTilesP1();
	GenerateOperatorTilesP2();
	SetTileEventListeners();
}

function GetRandomTileNumber()
{
	var range = MAX_NUMBER_VALUE - MIN_NUMBER_VALUE;
	return parseInt(Math.random() * range + MIN_NUMBER_VALUE);
}

function GenerateNumberTilesP1()
{
	for (var i = 0; i < 10; i++)
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
	$(".player-2 .operator-tiles").append($(".player-1 .operator-tiles").html());
}

function DisableTileEventListeners()
{
	$(".tile").off( "click" );
}

function SetTileEventListeners()
{
	SetUnplayedTileEventListeners('number');
	SetUnplayedTileEventListeners('operator');
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
	$(tileElement).addClass( "selected" );
}

function SetPlayedTilesEventListeners()
{
	$(".player-" + currentPlayer + " .played-tiles .number-tile").hover(
		DisplayPossibleMoves
	);
}

//TODO refactor this function
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
		function () 
		{
			UserChooseMove("before");
		}
	);
	$(".move-preview-after").click(
		function () 
		{
			UserChooseMove("after");
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

function NextTurn()
{
	SwitchPlayers();
	DisableTileEventListeners();
	SetTileEventListeners();
}
