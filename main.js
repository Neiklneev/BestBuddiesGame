// Importing our game engine, Kaplay
import kaplay from "https://unpkg.com/kaplay@3001.0.19/dist/kaplay.mjs";


// Initializing the game
kaplay({
  background:"#87CEEB"
});


scene("main", () => {

  let scoreCounter = add([
      text("0"),
      pos(width() - 20, 20),
      anchor("topright")
    ])

  let score = 0;
  loop(1, () => {


    let position = rand(vec2(50, height()-20), vec2(width()-270, height() - 100))

    let circleSprite = add([

      circle(60),
      area(),
      pos(position),
      color(200, 0, 0),
      outline(4),
      anchor("center"),
      move(UP, 80),
      "balloon",


    ]);

    
    circleSprite.onClick(() => {

      addKaboom(circleSprite.pos);
      shake();
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
});


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
    color("#0000FF"),
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
    go("main")
  })

})
// Activating the main scene
go("main");
