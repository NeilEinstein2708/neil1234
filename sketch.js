var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4;
var backgroundImg
var score=0;
var jumpSound, collidedSound;

var darkcloud;

var gameOver, restart;
var lines;

function preload(){
  jumpSound = loadSound("assets/sounds/jump.wav")
  collidedSound = loadSound("assets/sounds/collided.wav")
  
  backgroundImg = loadImage("assets/backgroundImg.png")
  sunAnimation = loadImage("assets/sun.png");
  
  trex_running = loadAnimation("assets/trex_2.png","assets/trex_1.png","assets/trex_3.png");
  trex_collided = loadAnimation("assets/trex_collided.png");
  
  groundImage = loadImage("assets/ground.png");
  
  cloudImage = loadImage("assets/cloud.png");
  
  obstacle1 = loadImage("assets/obstacle1.png");
  obstacle2 = loadImage("assets/obstacle2.png");
  obstacle3 = loadImage("assets/obstacle3.png");
  obstacle4 = loadImage("assets/obstacle4.png");
  
  gameOverImg = loadImage("assets/gameOver.png");
  restartImg = loadImage("assets/restart.png");
  dark_cloud = loadImage("001-dark-cloud-shape.png")
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  sun = createSprite(width - 50, 100,10,10);
  sun.addAnimation("sun", sunAnimation);
  sun.scale = 0.1
  
  trex = createSprite(50,330,20,50);
  
  
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.setCollider('circle',0,0,350)
  trex.scale = 0.08
  // trex.debug=true
  
  invisibleGround = createSprite(width/2,height-10,width,125);  
  invisibleGround.shapeColor = "#f4cbaa";
  
  ground = createSprite(width/2,height,width,2);
  ground.addImage("ground",groundImage);
  ground.x = width/2
  ground.velocityX = -(6 + 3*score/100);
  
  gameOver = createSprite(width/2,height/2- 50);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(width/2,height/2);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.1;

  gameOver.visible = false;
  restart.visible = false;
  
 
  // invisibleGround.visible =false

  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  
  acloudsGroup = new Group();
  
  score = 0;
  
  lines = createSprite(width/2,0,width,1);
  
}

function draw() {
  //trex.debug = true;
  background(backgroundImg);
  textSize(20);
  fill("black")
  text("Score: "+ score,30,50);
  
   if (gameState===PLAY){
    score = score + Math.round(getFrameRate()/60);
    ground.velocityX = -(6 + 3*score/100);
    
    if(touches.length>0 ||(keyDown("SPACE")) && trex.y  >= height-105) {
      jumpSound.play( )
      trex.velocityY = -10.08 ;
      
    }
     
     
       if(trex.y >= height - 160){
         acloudsGroup.destroyEach();
        }
     else if(trex.y <= height - 156){
         cloudsGroup.destroyEach();
        }
     
     
     cloudsGroup.depth = trex.depth;
    trex.depth = trex.depth+1;
    
    restart.depth = cloudsGroup.depth;
      restart.depth = restart.depth + 1;   
      
      
      gameOver.depth = cloudsGroup.depth;
      gameOver.depth = gameOver.depth + 1;  
     
    if(lines.isTouching(trex)){
         collidedSound.play()
    gameState = END;
      trex.x = 50;
      trex.y = 395;
      trex.depth = ground.depth
      trex.depth = trex.depth + 1;
      
  }
   lines.visible = false;
    trex.velocityY = trex.velocityY + 0.8
  
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
  
    trex.collide(invisibleGround);
    spawnClouds();
    spawnObstacles();
     spawnACloud();
  
    if(obstaclesGroup.isTouching(trex)){
        collidedSound.play()
        gameState = END;
    }
     
   
    if(acloudsGroup.isTouching(trex)){
        collidedSound.play()
        gameState = END;
   
  
       
      
      
    }
  }
  else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    
    //set velcity of each game object to 0
    ground.velocityX = 0;
    trex.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    acloudsGroup.setVelocityXEach(0);
    //change the trex animation
    trex.changeAnimation("collided",trex_collided);
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
         
    
    if(touches.length>0 || keyDown("SPACE")) {      
      reset();
      touches = []
      
  
    }
     
    
  if(trex.y > height){
     gameState = END
  }
  }


  drawSprites();
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(width+20,height-300,40,10);
    cloud.y = Math.round(random(100,220));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 300;
    
    //adjust the depth
     
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
  
}

function spawnObstacles() {
  if(frameCount % 60 === 0) {
    var obstacle = createSprite(600,height-95,20,30);
    obstacle.setCollider('circle',0,0,45)
    // obstacle.debug = true
  
    obstacle.velocityX = -(6 + 3*score/100);
    
    //generate random obstacles
    var rand = Math.round(random(1,2));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      default: break;
    }
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.3;
    obstacle.lifetime = 300;
    obstacle.depth = trex.depth;
    trex.depth +=1;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}
function spawnACloud(){
   if (frameCount % 60 === 0) {
    var acloud = createSprite(width+20,height-300,40,10);
     
     acloudsGroup.setColliderEach("circle",10, acloud.width, acloud.height);
     acloudsGroup.debugEach = false;
    acloud.y = Math.round(random(30,270));
    acloud.addImage(dark_cloud);
    acloud.scale = 0.8;  
    acloud.velocityX = -3;
    
     //assign lifetime to the variable
    acloud.lifetime = 300;
    
    //adjust the depth
    acloudsGroup.depth = trex.depth;
    trex.depth = trex.depth+1;
    
    restart.depth = cloudsGroup.depth;
      restart.depth = restart.depth + 1;   
      
     
      
      gameOver.depth = cloudsGroup.depth;
      gameOver.depth = gameOver.depth + 1;   
    
    //add each cloud to the group
    acloudsGroup.add(acloud);
  }
  
}


function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  acloudsGroup.destroyEach();
  trex.changeAnimation("running",trex_running);
  
  score = 0;
  if(trex.isTouching(lines)){
    gameState = END;
  }
  
}
