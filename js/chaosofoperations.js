var MAX_NUMBER_VALUE = 100;
var MIN_NUMBER_VALUE = 1;

var DEFAULT_OPERATORS = ["^", "&times;", "&times;", "&divide;", "&divide;", "mod", "+", "+", "-", "-"];

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
}

function GenerateNumberTilesP1()
{
	for (var i = 0; i < 10; i++)
	{
		$(".player-1 .number-tiles").append("<div class=\"tile\">" + GetRandomTileNumber() + "</div>");
	}
}

function GetRandomTileNumber()
{
	return parseInt(Math.random() * MAX_NUMBER_VALUE + MIN_NUMBER_VALUE);
}

function GenerateOperatorTilesP1()
{
	$.each(
		DEFAULT_OPERATORS, 
		function (key, value)
		{
			$(".player-1 .operator-tiles").append("<div class=\"tile\">" + value + "</div>");
		}
	);
}

function AddNumberTileEventListeners()
{

}

function AddOperatorTileEventListeners()
{

}
