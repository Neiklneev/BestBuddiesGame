// Importing our game engine, Kaplay
import kaplay from "https://unpkg.com/kaplay@3001.0.19/dist/kaplay.mjs";

const speedArray = [60, 80, 100, 115, 130, 140, 150, 155, 160, 180]
const bpsArray = [0.3, 0.5, 0.8, 1.2, 1.6, 1.9, 2.2, 2.4, 2.5, 3.0]

let sound = 1;
let speed = 10;

kaplay({
  background:"#87CEEB",
  font: "tahoma"
});


loadFont("tahoma", "assets/tahoma.ttf")
loadSound("pop", "assets/pop.mp3")
loadSound("bg", "assets/background.mp3")
loadSprite("cloud", "assets/cloud.png")


scene("main", () => {


  for (let x of [1, 2, 3, 4, 5]) {
    add([
      sprite("cloud"),
      pos(rand(vec2(width(), height()))),
      scale(0.5)
    ])
  }

  let bg = play("bg", {
    loop:true,
    volume: 0.2*sound
  })

  let settingsButton = add([
    text("⚙"),
    color(0, 0, 0),
    pos(width()-20, 20),
    area(),
    anchor("topright")
  ])

  let scoreCounter = add([
      text("0"),
      color(0, 0, 0),
      pos(20, 20),
      anchor("topleft")
    ])

  let score = 0;


  loop(1/bpsArray[speed-1], () => {

    let position = rand(vec2(60, height()), vec2(width()-60, height() - 170))

    let circleSprite = add([

      circle(60),
      area(),
      pos(position),
      color(rand(rgb(255, 255, 255))),
      outline(4),
      anchor("center"),
      move(UP, rand(speedArray[speed-1]-15, speedArray[speed-1]+15)),
      "balloon",


    ]);
  });


  onClick("balloon", (bln) => {
    addKaboom(bln.pos);
    shake();
    play("pop", { volume:0.5*sound, loop: false });
    destroy(bln);
    score ++
  });

  onUpdate(() => {
    for (let balloon of get("balloon")) {
      if (balloon.pos.y < 0) {
        bg.stop();
        go("over", score);
      }
    }

    if (settingsButton.isHovering()) {
      settingsButton.color = Color.fromHex(0x555555);
    } else {
      settingsButton.color = BLACK;
    }
    scoreCounter.text = score;
  });

  settingsButton.onClick(() => {
    bg.stop();
    go("settings")
  })
});


scene("settings", () => {

  loadSprite("balloons", "assets/balloons.png")
  loadSprite("speed", "assets/speed.png")
  loadSprite("musicOn", "assets/musicOn.png")
  loadSprite("musicNo", "assets/musicNo.png")
  add([
    text("Settings", {size:60}),
    pos(width()/2, 100),
    color(0, 0, 0),
    anchor("center")
  ])

  let speedCounter = add([
    text(speed, { size:60 }),
    color(0, 0, 0),
    pos(width()/2, height()/2-40),
    anchor("center")
  ]);

    let music = add([ sprite(sound ? "musicOn" : "musicNo"), pos(width()/2, height()/2 + 50), anchor("center"), scale(0.2), area(), "music"])

  let speedUp = add([ text("►", { size:60 }), area(), color(255, 255, 255), pos(width()/2 + 70, height()/2-40), anchor("center"), "speedButton", "up"])
  let speedDown = add([ text("◄", { size:60 }), area(), color(255, 255, 255),pos(width()/2 - 70, height()/2-40), anchor("center"), "speedButton", "down"])

  onClick("speedButton", (speedButton) => {
    if (speedButton.is("up")) {
      if (speed < 10) { speed += 1; speedCounter.text = speed; }
    } else {
      if (speed > 1) { speed -= 1; speedCounter.text = speed; }
    }
  })

  onClick("music", () => {
    sound = !sound;
    loadSprite("musicOn", "assets/musicOn.png")
    loadSprite("musicNo", "assets/musicNo.png");
    destroyAll("music");
    var music = add([ sprite(sound ? "musicOn" : "musicNo"), pos(width()/2, height()/2 + 50), anchor("center"), scale(0.2), area(), "music"])
  })

  let saveButton = add([
    rect(200+width()/4, 100, {radius:20}),
    color("#00FF00"),
    pos(width()/2, height() - 100),
    anchor("center"),
    outline(4),
    scale(1),
    area()
  ]);

  saveButton.onClick(() => {
    go("main");
  })

  onUpdate(() => {
    for (let button of get("button")) {
      if (button.isHovering()) {
        button.color = Color.fromHex(0x888888);
      } else {
        button.color = Color.fromHex(0xFFFFFF);
      }
    }

    if (saveButton.isHovering()) {
      saveButton.scale.x += (((1.2-saveButton.scale.x)/8))
      saveButton.scale.y += (((1.2-saveButton.scale.y)/8))
    } else {
      saveButton.scale.x += ((1-saveButton.scale.x)/8)
      saveButton.scale.y += ((1-saveButton.scale.y)/8)
    }

  })
})



scene("over", (finalScore) => {
  add([
    text("Game Over", { "size": 60 }),
    color(255, 0, 0),
    pos(width()/2, 120),
    anchor("center")
  ]);
  add([
    text(finalScore, { "size": 40 }),
    color(0, 0, 0),
    pos(width()/2, 50),
    anchor("center")
  ]);

  add([
    text("Click To Play!", {"size": 40}),
    color(0, 0, 0),
    pos(width()/2, height() - 60),
    anchor("center")
  ])

  let backButton = add([
    rect(200+width()/4, 100, {radius:20}),
    color("#00FF00"),
    pos(center()),
    anchor("center"),
    outline(4),
    scale(2),
    area()
  ]);

  onUpdate(() => {
    if (backButton.isHovering()) {
      backButton.scale.x += (((1.2-backButton.scale.x)/8))
      backButton.scale.y += (((1.2-backButton.scale.y)/8))
    } else {
      backButton.scale.x += ((1-backButton.scale.x)/8)
      backButton.scale.y += ((1-backButton.scale.y)/8)
    }
  });

  backButton.onClick(() => {
    go("main");
  })

})
// Activating the main scene
go("main");
