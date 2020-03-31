let snake = [];
let direction;
let x, y, xP, yP, time = 500;
const sideLength = 30;
let moveInterval;
let onEscape = false;
let gameOver = false;
let score;

//push, unshift
//pop, shift

const log = event =>
{
  switch (event.key)
  {
    case "Enter":
      onEnter();
      break;
    case "Escape":
      clearInterval(moveInterval);
      onEscape = true;
      break;
    case "ArrowDown":
      if (direction === "North")
      {
        gameOver = true;
      }
      direction = "South";
      break;
    case "ArrowUp":
      if (direction === "South")
      {
        gameOver = true;
      }
      direction = "North";
      break;
    case "ArrowRight":
      if (direction === "West")
      {
        gameOver = true;
      }
      direction = "East";
      break;
    case "ArrowLeft":
      if (direction === "East")
      {
        gameOver = true;
      }
      direction = "West";
      break;
    case "w":
      time /= 2;
      clearInterval(moveInterval);
      moveInterval = setInterval(move, time);
      break;
    case "s":
      time *= 2;
      clearInterval(moveInterval);
      moveInterval = setInterval(move, time);
      break;
  }
  console.log(event.key);
};

document.addEventListener('keydown', event =>
{
  log(event)
});

function onEnter()
{
  if(onEscape)
  {
    onEscape = true;
    moveInterval = setInterval(move,time);
  }
  else if (gameOver)
  {
    let i = snake.length - 1;
    const svg = d3.select("svg");
    while (i >= 0)
    {
      let rect = snake.shift();
      rect.attr("id", "remove");
      svg.select("#remove").remove();
      i--;
    }
    gameOver = false;
    svg.select("#point").remove();
    startGame();
  } else
  {
    startGame();
  }
}


function startGame()
{
  const svg = d3.select("#field");
  x = 30;
  y = 30;
  direction = "East";
  score = 1;
  snake.push(svg.append("rect").attr("width", sideLength).attr("height", "30").attr("y", y).attr("x", x).attr("fill", "green").attr("id", "rectEnd").attr("stroke", "black"));
  setPoint();
  moveInterval = setInterval(move, time);
}

function setPoint()
{
  const svg = d3.select("svg");
  let valid;
  do
  {
    xP = Math.trunc(Math.random() * (window.innerWidth / sideLength)) * sideLength;
    yP = Math.trunc(Math.random() * (window.innerHeight / sideLength)) * sideLength;
    valid = true;
    for (let i = 0; i < snake.length; i++)
    {
      let rect = snake.shift();
      if (rect.attr("x") == xP && rect.attr("y") == yP)
      {
        valid = false;
      }
      snake.push(rect);
    }
  } while (!valid);
  console.log("xP = " + xP + "; yP = " + yP);
  svg.append("rect").attr("width", sideLength).attr("height", sideLength).attr("y", yP).attr("x", xP).attr("fill", "red").attr("id", "point");
}

function move()
{
  if (gameOver)
  {
    clearInterval(moveInterval);
    alert("GameOver:\nYour score is: "+score);
  } else
  {
    const svg = d3.select("svg");
    switch (direction)
    {
      case "East":
        x += sideLength;
        break;
      case "West":
        x -= sideLength;
        break;
      case "North":
        y -= sideLength;
        break;
      case "South":
        y += sideLength;
        break;
    }
    if (x === xP && y === yP)
    {
      svg.select("#point").remove();
      score++;
      setPoint();
    } else
    {
      let rectEnd = snake.shift();
      rectEnd.attr("id", "rectEnd");
      svg.select("#rectEnd").remove();
    }
    snake.push(svg.append("rect").attr("width", sideLength).attr("height", sideLength).attr("y", y).attr("x", x).attr("fill", "green").attr("stroke", "black"));
    checkCollision();
  }

}

function checkCollision()
{
  //console.log("checkCollision: "+snake.length)
  for (let i = 0; i < snake.length - 1; i++)
  {
    let rect = snake.shift();
    console.log("checkCollision: " + rect.attr("x") + "" + x);
    //console.log(rect.attr("x")+"::"+rect.attr("y"));
    if (rect.attr("x") == x && rect.attr("y") == y)
    {
      gameOver = true;
    }
    snake.push(rect);
  }

  let rect = snake.shift();
  let xSnake = rect.attr("x"), ySnake = rect.attr("y");

  if (xSnake < 0 || xSnake > window.innerWidth || ySnake < 0 || ySnake > window.innerHeight)
  {
    gameOver = true;
  }

  snake.push(rect)
}