// Importing our game engine, Kaplay
import kaplay from "https://unpkg.com/kaplay@3001.0.19/dist/kaplay.mjs";

const speedArray = [60, 80, 120, 150, 180];
const bpsArray = [0.3, 0.7, 1.2, 2, 3];


kaplay({
  background:"#87CEEB"
});

scene("main", ({speed, bps}) => {
  loadSound("pop", "assets/pop.mp3")
  loadSound("bg", "assets/background.mp3")

  play("bg", {
    loop:false,
    volume: 0.2
  })

  let scoreCounter = add([
      text("0"),
      pos(20, 20),
      anchor("topleft")
    ])

  let score = 0;


  loop(1/bps, () => {

    console.log(`POINT 2 REACHED, speed ${speed}`)
    let position = rand(vec2(110, height()-80), vec2(width()-270, height() - 170))

    let circleSprite = add([

      circle(60),
      area(),
      pos(position),
      color(200, 0, 0),
      outline(4),
      anchor("center"),
      move(UP, speed),
      "balloon",


    ]);

    
    circleSprite.onClick(() => {

      addKaboom(circleSprite.pos);
      shake();
      play("pop", {
        volume:0.5,
        loop: false
      })
      circleSprite.destroy();
      score ++;

    });

  });

  onUpdate(() => {
    for (let balloon of get("balloon")) {
      if (balloon.pos.y < 0) {
        go("over", score);
      }
    }
    scoreCounter.text = score;
  });

  onKeyPress("space", () => {
    go("settings", {speed:speed, bps:bps})
  })
});


scene("settings", ({speed, bps}) => {

  let speedCounter = add([ text(speedArray.indexOf(speed)+1, { size:60 }), color(0, 0, 0), pos(width()/2, height()/3) ]);
  let bpsCounter = add([ text(bpsArray.indexOf(bps)+1, { size:60 }), color(0, 0, 0), pos(width()/2, 2 * height()/3) ]);


  onKeyPress("a", () => {
    if (Number(speedCounter.text) > 1) {
      let currentSpeed = Number(speedCounter.text) - 1; 
      speedCounter.text=currentSpeed}
  });

  onKeyPress("d", () => {
    if (Number(speedCounter.text) < 5) {
      let currentSpeed = Number(speedCounter.text) + 1; 
      speedCounter.text=currentSpeed}
  });

  onKeyPress("w", () => {
    if (Number(bpsCounter.text) < 5) {
      let currentBps = Number(bpsCounter.text) + 1; 
      bpsCounter.text=currentBps}
  });

  onKeyPress("s", () => {
    if (Number(bpsCounter.text) > 1) {
      let currentBps = Number(bpsCounter.text) - 1; 
      bpsCounter.text=currentBps}
  });

  onMousePress(() => {
    go("main", {speed:speedArray[speedCounter.text - 1], bps:bpsArray[bpsCounter.text-1]});
    console.log(speedArray[Number(speedCounter.text) - 1])
    console.log(bpsArray[Number(bpsCounter.text) - 1])
  })
})



scene("over", (finalScore) => {
  add([
    text(`Game Over - You Got ${finalScore} Points!`, { "size": 60 }),
    color(255, 0, 0),
    pos(width()/2, 100),
    anchor("center")
  ]);

  add([
    text("Click The Button Above To Play Again!", {"size": 40}),
    color(0, 0, 0),
    pos(width()/2, height() - 60),
    anchor("center")
  ])

  let backButton = add([
    rect(400, 100, {radius:20}),
    color("#00FF00"),
    pos(center()),
    anchor("center"),
    outline(4),
    scale(2),
    area()
  ]);

  onUpdate(() => {
    if (backButton.isHovering()) {
      backButton.scale.x += (((1.1-backButton.scale.x)/8))
      backButton.scale.y += (((1.1-backButton.scale.y)/8))
    } else {
      backButton.scale.x += ((1-backButton.scale.x)/8)
      backButton.scale.y += ((1-backButton.scale.y)/8)
    }
  });

  backButton.onClick(() => {
    go("main", {speed: 180, bps: 3});
  })

})
// Activating the main scene
go("main", {speed: 180, bps: 3});
