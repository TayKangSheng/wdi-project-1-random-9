// create canvas
// requestAnimationFrame
// create function for paddles (x, y, width, height, x speed, y speed)
// create prototype render for paddles (size and coordinates of rectangle)
// create functions for Player 1 and 2's paddles using paddle function created previously
// render players' paddles using prototype render declared previously
// create function for ball (x, y, x speed, y speed, radius)
// create prototype render for ball

// var animate = window.requestAnimationFrame
// initialize canvas by setting context
var canvas = document.getElementById('canvas')
width = canvas.width
height = canvas.height
var ctx = canvas.getContext('2d')

// rendering the background of the game
var render = function () {
  ctx.fillStyle = '#000000'
  ctx.fillRect(0, 0, width, height)
  playerOne.render()
  playerTwo.render()
  // ball.render()
}

// paddle
function Paddle (x, y, width, height) {
  this.x = x
  this.y = y
  this.width = width
  this.height = height
  this.x_speed = 0
  this.y_speed = 0
}

Paddle.prototype.render = function () {
  ctx.beginPath()
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(this.x, this.y, this.width, this.height)
  ctx.closePath()
}

// Player 1's paddle on the left
function Player1 () {
  this.paddle = new Paddle(20, 210, 10, 80)
}

// Player 2's paddle on the right
function Player2 () {
  this.paddle = new Paddle(670, 210, 10, 80)
}

Player1.prototype.render = function () {
  this.paddle.render()
}

Player2.prototype.render = function () {
  this.paddle.render()
}

function Ball (x, y) {
  this.x = x
  this.y = y
  this.radius = 5
  this.x_speed = 3
  this.y_speed = 0
}

// ball, circle does not require closePath as it is self closing
// 0 is the angle at which the arc starts and ends
// Ball.prototype.render = function () {
//   ctx.save()
//   ctx.beginPath()
//   ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
//   ctx.fillStyle = 'ffffff'
//   ctx.fill()
//   ctx.closePath()
//   ctx.restore()
// }

var playerOne = new Player1()
// playerOne.render()
var playerTwo = new Player2()
// playerTwo.render()
var ball = new Ball(350, 250)
// ball.render()

Ball.prototype.update = function (paddle1, paddle2) {
  this.x += this.x_speed
  this.y += this.y_speed
  var top_x = this.x - 5  // -5 to account for radius of ball
  var top_y = this.y - 5
  var bottom_x = this.x + 5
  var bottom_y = this.y + 5
  //  hit top border
  if (top_y < 0) {
    this.y = 5
    this.y_speed = -this.y_speed
  }
  //  hit bottom border
  if (bottom_y > 500) {
    this.y = 495
    this.y_speed = -this.y_speed
  }
  //  point scored
  if (bottom_x < 5 || top_x + 5 > 700) {
    //  reset ball to start from middle
    this.x_speed = 3
    this.y_speed = 0
    this.x = 300
    this.y = 200
  }
  //  hit Player 1's paddle
  if (bottom_x > paddle1.x && top_x < (paddle1.x + paddle1.width) && top_y < (paddle1.y + paddle1.height) && bottom_y > paddle1.y) {
    this.x_speed = 3
    this.y_speed += (paddle1.y_speed / 2)
    this.x += this.x_speed
  }
  //  hit Player 2's paddle
  else if (top_x < (paddle2.x + paddle2.width) && bottom_x > paddle2.x && top_y < (paddle2.y + paddle2.height) && bottom_y > paddle2.y) {
    this.x_speed = -3
    this.y_speed += (paddle2.y_speed / 2)
    this.x += this.x_speed
  }
  ctx.clearRect(0, 0, 700, 500) //  to erase any shapes that have been drawn previously, for eg background and paddles. sets all pixels defined by x,y and width, height to transparent black
  render()  //  render back the shapes
  ctx.save()  //  set original state of the canvas
  ctx.beginPath()
  ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
  ctx.fillStyle = '#ffffff'
  ctx.fill()
  ctx.closePath()
  ctx.restore() //  restore to saved state
}

// function KeyListener() {
//   this.pressedKeys = []
//
//   this.keydown = function(e) {
//     this.pressedKeys[e.keyCode] = true
//   }
//   this.keyup = function(e) {
//     this.pressedKeys[e.keyCode] = false
//   }
//   window.addEventListener('keydown', this.keydown.bind(this))
//   window.addEventListener('keyup', this.keyup.bind(this))
// }
//
// KeyListener.prototype.isPressed = function(key) {
//   return this.pressedKeys[key] ? true : false
// }
var keysDown = {}
//  move paddles when keys are pressed
window.addEventListener('keydown', function (e) {
  keysDown[e.keyCode] = true
})
window.addEventListener('keyup', function (e) {
  delete keysDown[e.keyCode]
})

playerOne.update = function () {
  for (var key in keysDown) {
    var value = Number(key)
    if (value == 87) { //  W key
      playerOne.paddle.move(0, -3)
    } else if (value == 83) {
      playerOne.paddle.move(0, 3)
    } else {
      playerOne.paddle.move(0, 0)
    }
  }
}

playerTwo.update = function () {
  for (var key in keysDown) {
    var value = Number(key)
    if (value == 38) { //  arrow up key
      playerTwo.paddle.move(0, -3)
    } else if (value == 40) {
      playerTwo.paddle.move(0, 3)
    } else {
      playerTwo.paddle.move(0, 0)
    }
  }
}

Paddle.prototype.move = function (x, y) {
  this.x += x
  this.y += y
  this.x_speed = x
  this.y_speed = y
  if (this.y < 0) {  //  paddle hitting the top
    this.y = 0
    this.y_speed = 0
  } else if ((this.y + this.height > 500)) {  //  paddle hits the bottom
    this.y = 500 - this.height
    this.y_speed = 0
  }
}

var update = function () {
  ball.update(playerOne.paddle, playerTwo.paddle)
  playerOne.update()
  playerTwo.update()
  requestAnimationFrame(update)
}

requestAnimationFrame(update)
