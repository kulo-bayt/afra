// ============================================================
//  Afra'nın Macerası - Mario-style Birthday Platformer
// ============================================================

const COLORS = {
  pink: 0xFF6B9D, darkPink: 0xC44569, gold: 0xFFD93D,
  skyTop: 0x74b9ff, skyBottom: 0xa29bfe,
  mint: 0x55efc4, darkGreen: 0x00b894,
  purple: 0x6c5ce7, brown: 0x8B6914,
  white: 0xffffff, red: 0xff4757, darkBg: 0x1a1a2e,
  pipe: 0x27ae60, pipeDark: 0x1e8449,
  brick: 0xd35400, brickDark: 0xa04000,
  qBlock: 0xf1c40f, qBlockDark: 0xd4ac0f,
  coinColor: 0xFFD700, shield: 0x48dbfb, speed: 0x55efc4, magnet: 0xa29bfe
};
const GAME_W = 800, GAME_H = 500, T = 40; // tile size

// Level data — platform heights tuned so every jump ≤ 130 px rise
// Max jump ≈ 163 px (v₀=650, g=1300), safe design margin = 130 px
const LEVELS = {
  // Level 1 - "İlk Adım" (Kolay): Sürekli zemin, engeller basit
  1: {
    world: 1600,
    ground: [[0,1600]], // continuous - no gaps
    steps: [[280,420],[320,420],[320,380]],
    floats: [
      [480,380,100],   // 80px above ground – easy
      [700,360,120],   // 100px above ground
      [950,380,100],   // easy
      [1150,360,120],  // stepping stone
      [1350,340,100],  // stepping stone to crush
    ],
    qBlocks: [[300,370,'coin'],[540,340,'coin'],[760,320,'heart'],[1010,340,'coin']],
    bricks: [[320,370],[1030,340]],
    pipes: [[400,50],[900,50]], // short pipes – easy to jump over
    coins: [
      [80,420],[120,420],[160,420],[200,420],
      [500,340],[520,340],[540,340],
      [710,320],[730,320],[750,320],
      [960,340],[980,340],[1000,340],
      [1160,320],[1180,320],[1200,320],
      [1380,300],[1400,300],[1420,300],
    ],
    powerUps: [],
    enemies: [[600,40,false],[1050,45,false]],
    movingPlats: [],
    crush: [1520, 290]  // platform at y=340, reachable from ground
  },
  // Level 2 - "Yükselen Kalpler" (Orta): 3 boşluk, 4 düşman, 1 hareketli platform
  2: {
    world: 2400,
    ground: [[0,520],[600,400],[1080,400],[1560,380],[1960,440]],
    steps: [[200,420],[240,420],[240,380]],
    floats: [
      [500,380,100],   // near first gap
      [780,360,120],
      [1060,380,100],
      [1320,360,120],
      [1540,340,100],  // near third gap
      [1800,360,120],
      [2050,340,120],
      [2250,350,100],
    ],
    qBlocks: [[260,370,'coin'],[560,340,'shield'],[840,320,'coin'],[1100,340,'speed'],[1580,310,'coin'],[2100,310,'heart']],
    bricks: [[280,370],[860,320],[1120,340],[2120,310]],
    pipes: [[380,50],[950,60],[1450,50]],
    coins: [
      [80,420],[120,420],[160,420],
      [420,380],[440,360],[460,340],
      [620,420],[660,420],
      [790,320],[830,320],
      [1000,420],[1040,420],
      [1200,340],[1240,340],[1280,340],
      [1550,300],[1570,300],
      [1810,320],[1850,320],
      [1980,420],[2020,420],[2060,420],
      [2260,310],[2300,310],[2340,310]
    ],
    powerUps: [[1400,380,'speed']],
    enemies: [[480,50,false],[900,55,false],[1350,60,false],[1900,55,false]],
    movingPlats: [[540,340,100,120,0,2200]],
    crush: [2320, 290]  // platform at y=340
  },
  // Level 3 - "Son Dans" (Zor): 4 geniş boşluk, 5 düşman + 1 boss, 2 hareketli platform
  3: {
    world: 3200,
    ground: [[0,380],[500,300],[920,260],[1300,280],[1680,240],[2040,260],[2400,240],[2720,280],[2980,220]],
    steps: [[2980,420],[3020,420],[3020,380],[3060,380]],
    floats: [
      [380,380,90],    // bridge first gap
      [660,360,100],
      [900,380,90],
      [1140,360,100],
      [1380,340,100],  // stepping stone
      [1620,360,100],
      [1860,340,100],
      [2100,360,100],
      [2340,340,120],
      [2620,360,100],
      [2860,340,100],
      [3080,330,100],  // near crush
    ],
    qBlocks: [[200,370,'coin'],[440,340,'heart'],[720,320,'shield'],[1160,330,'coin'],[1420,310,'star'],[1900,310,'speed'],[2380,310,'magnet'],[2660,330,'heart'],[3100,300,'star']],
    bricks: [[220,370],[240,370],[740,320],[1180,330],[1440,310],[2400,310],[2680,330],[3120,300]],
    pipes: [[300,50],[780,60],[1480,50],[2080,60],[2860,50]],
    coins: [
      [60,420],[100,420],[140,420],[180,420],
      [400,340],[420,320],[440,310],[460,320],[480,340],
      [560,420],[600,420],
      [700,300],[740,300],[780,300],
      [930,360],[970,360],
      [1150,310],[1190,310],[1230,310],
      [1390,300],[1430,300],[1470,300],
      [1640,340],[1680,340],
      [1870,300],[1910,300],[1950,300],
      [2110,340],[2150,340],[2190,340],
      [2350,300],[2390,300],[2430,300],
      [2630,320],[2670,320],
      [3000,380],[3040,350],[3080,320],
      [3130,290],[3160,290]
    ],
    powerUps: [[1640,330,'speed'],[2630,320,'shield']],
    enemies: [[340,60,false],[700,65,false],[1300,70,false],[1800,65,false],[2400,70,false],[3060,80,true]],
    movingPlats: [[440,350,90,100,0,2000],[1780,350,90,100,0,2200]],
    crush: [3140, 270]  // platform at y=320
  }
};

// ============================================================
//  BOOT SCENE
// ============================================================
class BootScene extends Phaser.Scene {
  constructor() { super('BootScene'); }
  preload() {
    const loadText = document.getElementById('loading-text');
    if (loadText) loadText.textContent = 'Yükleniyor...';
    this.textures.addBase64('afra', ASSET_AFRA);
    this.textures.addBase64('baby', ASSET_BABY);
    this.textures.addBase64('crush', ASSET_CRUSH);
  }
  create() {
    const needed = ['afra','baby','crush'];
    const allReady = () => needed.every(k => this.textures.exists(k));
    if (allReady()) { this.goToMenu(); return; }
    const check = this.time.addEvent({ delay: 100, loop: true, callback: () => {
      const bar = document.getElementById('loading-bar');
      const ready = needed.filter(k => this.textures.exists(k)).length;
      if (bar) bar.style.width = Math.round((ready/needed.length)*100)+'%';
      if (allReady()) { check.remove(); this.goToMenu(); }
    }});
  }
  goToMenu() {
    const s = document.getElementById('loading-screen');
    if (s) { const b = document.getElementById('loading-bar'); if(b) b.style.width='100%'; s.classList.add('hidden'); setTimeout(()=>s.remove(),600); }
    this.scene.start('MenuScene');
  }
}

// ============================================================
//  MENU SCENE
// ============================================================
class MenuScene extends Phaser.Scene {
  constructor() { super('MenuScene'); }
  create() {
    const W = this.scale.width, H = this.scale.height;
    // Gradient
    const bg = this.add.graphics();
    for (let y=0;y<H;y++) {
      bg.fillStyle(Phaser.Display.Color.GetColor(
        Math.round(Phaser.Math.Linear(0xFF,0xA2)),
        Math.round(Phaser.Math.Linear(0x6B,0x9B)),
        Math.round(Phaser.Math.Linear(0x9D,0xFE))),1);
      bg.fillRect(0,y,W,1);
    }
    // Particles
    for (let i=0;i<20;i++) {
      const g=this.add.graphics(), x=Phaser.Math.Between(20,W-20), y0=Phaser.Math.Between(20,H-20);
      if(i%2===0){g.fillStyle(COLORS.white,0.4);g.beginPath();g.arc(-4,-3,4,Math.PI,0,false);g.arc(4,-3,4,Math.PI,0,false);g.lineTo(0,8);g.closePath();g.fillPath();}
      else{g.fillStyle(COLORS.gold,0.5);g.beginPath();for(let j=0;j<5;j++){const a=(j*4*Math.PI)/5-Math.PI/2;const px=Math.cos(a)*6,py=Math.sin(a)*6;j===0?g.moveTo(px,py):g.lineTo(px,py);}g.closePath();g.fillPath();}
      g.setPosition(x,y0);
      this.tweens.add({targets:g,y:y0-Phaser.Math.Between(30,80),alpha:{from:0.3,to:0.8},duration:Phaser.Math.Between(2000,4000),yoyo:true,repeat:-1,ease:'Sine.easeInOut'});
    }
    const title=this.add.text(W/2,100,"Afra'nın Macerası",{fontFamily:'Fredoka One, cursive',fontSize:'48px',color:'#ffffff',stroke:'#C44569',strokeThickness:6,shadow:{offsetX:3,offsetY:3,color:'#00000044',blur:8,fill:true}}).setOrigin(0.5);
    this.tweens.add({targets:title,y:110,duration:1500,yoyo:true,repeat:-1,ease:'Sine.easeInOut'});
    this.add.text(W/2,170,'Doğum Günü Özel Macerası',{fontFamily:'Fredoka One, cursive',fontSize:'18px',color:'#FFD93D'}).setOrigin(0.5);
    // Show both characters
    const afra=this.add.image(W/2-55,275,'afra').setScale(0.18);
    const crush=this.add.image(W/2+55,275,'crush').setScale(0.15);
    this.tweens.add({targets:afra,y:265,duration:1200,yoyo:true,repeat:-1,ease:'Sine.easeInOut'});
    this.tweens.add({targets:crush,y:265,duration:1400,yoyo:true,repeat:-1,ease:'Sine.easeInOut',delay:200});
    // Heart between them
    this.time.addEvent({delay:800,loop:true,callback:()=>{
      const hg=this.add.graphics();hg.fillStyle(COLORS.red,0.8);hg.beginPath();hg.arc(-3,-2,3,Math.PI,0,false);hg.arc(3,-2,3,Math.PI,0,false);hg.lineTo(0,5);hg.closePath();hg.fillPath();
      hg.setPosition(W/2,265);this.tweens.add({targets:hg,y:235,alpha:0,scaleX:1.5,scaleY:1.5,duration:1200,onComplete:()=>hg.destroy()});
    }});
    // Button
    const bb=this.add.graphics();bb.fillStyle(COLORS.gold,1);bb.fillRoundedRect(W/2-90,370,180,55,28);bb.lineStyle(3,0xffffff,0.8);bb.strokeRoundedRect(W/2-90,370,180,55,28);
    const bt=this.add.text(W/2,397,'OYNA',{fontFamily:'Fredoka One, cursive',fontSize:'28px',color:'#C44569'}).setOrigin(0.5);
    const bz=this.add.zone(W/2,397,180,55).setInteractive({useHandCursor:true});
    this.tweens.add({targets:[bb,bt,bz],scaleX:1.05,scaleY:1.05,duration:800,yoyo:true,repeat:-1,ease:'Sine.easeInOut'});
    bz.on('pointerdown',()=>this.scene.start('StoryScene',{level:1}));
  }
}

// ============================================================
//  STORY SCENE
// ============================================================
class StoryScene extends Phaser.Scene {
  constructor() { super('StoryScene'); }
  create(data) {
    const lv=data.level||1, W=this.scale.width, H=this.scale.height;
    const bg=this.add.graphics();bg.fillStyle(COLORS.darkBg,1);bg.fillRect(0,0,W,H);bg.lineStyle(4,COLORS.pink,0.6);bg.strokeRoundedRect(30,30,W-60,H-60,20);
    const stories={
      1:"Afra bir sabah uyandığında, bugünün\nözel bir gün olduğunu hissetti...\nAma önce küçük yaramaz engelleri\naşması gerekiyordu!",
      2:"Afra giderek yaklaşıyordu...\nKalbi hızla atıyordu.\nAma yol daha da zorlaşıyordu!",
      3:"Son adım...\nEn büyük engeli aşarsa,\nonu bekleyen sürpriz\nçok güzel olacak!"
    };
    const names={1:'İlk Adım',2:'Yükselen Kalpler',3:'Son Dans'};
    this.add.text(W/2,70,'Level '+lv,{fontFamily:'Fredoka One, cursive',fontSize:'32px',color:'#FFD93D',stroke:'#C44569',strokeThickness:4}).setOrigin(0.5);
    this.add.text(W/2,110,names[lv]||'',{fontFamily:'Fredoka One, cursive',fontSize:'20px',color:'#FF6B9D'}).setOrigin(0.5);
    // Show Afra character
    const afraImg = this.add.image(W/2, 170, 'afra').setScale(0.12).setAlpha(0);
    this.tweens.add({targets:afraImg, alpha:1, y:160, duration:500, ease:'Back.easeOut'});
    this.tweens.add({targets:afraImg, y:155, duration:1000, yoyo:true, repeat:-1, ease:'Sine.easeInOut', delay:500});

    const str=stories[lv]||stories[1];
    const txt=this.add.text(W/2,260,'',{fontFamily:'Fredoka One, cursive',fontSize:'20px',color:'#fff',align:'center',lineSpacing:8}).setOrigin(0.5);
    let ci=0;
    this.time.addEvent({delay:40,repeat:str.length-1,callback:()=>{ci++;txt.setText(str.substring(0,ci));}});
    this.time.delayedCall(str.length*40+500,()=>{
      const bb=this.add.graphics();bb.fillStyle(COLORS.pink,1);bb.fillRoundedRect(W/2-80,400,160,50,25);
      const bt=this.add.text(W/2,425,'Devam',{fontFamily:'Fredoka One, cursive',fontSize:'22px',color:'#fff'}).setOrigin(0.5);
      const z=this.add.zone(W/2,425,160,50).setInteractive({useHandCursor:true});
      this.tweens.add({targets:[bb,bt,z],scaleX:1.05,scaleY:1.05,duration:600,yoyo:true,repeat:-1,ease:'Sine.easeInOut'});
      z.on('pointerdown',()=>this.scene.start('GameScene',{level:lv, hearts:data.hearts, score:data.score, coinCount:data.coinCount, purchasedItems:data.purchasedItems}));
    });
  }
}

// ============================================================
//  GAME SCENE - Mario-style platformer
// ============================================================
class GameScene extends Phaser.Scene {
  constructor() { super('GameScene'); }

  init(data) {
    this.currentLevel = data.level || 1;
    this.hearts = data.hearts || 3;
    this.score = data.score || 0;
    this.coinCount = data.coinCount || 0;
    this.invincible = false;
    this.gameOver = false;
    this.levelComplete = false;
    this.powerUps = { invincible:0, speed:0, magnet:0, shield:false };
    this.powerUpGfx = {};

    // Apply purchased items from shop
    const purchased = data.purchasedItems || [];
    purchased.forEach(item => {
      if(item === 'heart') this.hearts = Math.min(this.hearts+1, 5);
      else if(item === 'shield') this.powerUps.shield = true;
      else if(item === 'speed') this.powerUps.speed = 6000;
      else if(item === 'magnet') this.powerUps.magnet = 8000;
    });
  }

  create() {
    const lvl = LEVELS[this.currentLevel];
    const W = lvl.world, H = GAME_H;

    this.physics.world.setBounds(0, 0, W, H);
    this.cameras.main.setBounds(0, 0, W, H);

    // Mobile
    this.mobileLeft=false; this.mobileRight=false; this.mobileJump=false;
    this.setupMobileControls();

    // Background
    this.createBackground(W, H);

    // Physics groups
    this.platforms = this.physics.add.staticGroup();
    this.movingPlatforms = this.physics.add.group({allowGravity:false,immovable:true});
    this.questionBlocks = this.physics.add.staticGroup();
    this.brickBlocks = this.physics.add.staticGroup();
    this.coins = this.physics.add.group({allowGravity:false});
    this.powerUpItems = this.physics.add.group({allowGravity:false});
    this.enemies = this.physics.add.group({allowGravity:false});

    // Build level
    this.buildGround(lvl, H);
    this.buildSteps(lvl);
    this.buildFloats(lvl);
    this.buildPipes(lvl, H);
    this.buildQuestionBlocks(lvl);
    this.buildBrickBlocks(lvl);
    this.buildMovingPlatforms(lvl);
    this.spawnCoins(lvl);
    this.spawnPowerUps(lvl);
    this.spawnEnemies(lvl, H);
    this.createCrush(lvl);

    // Player
    this.player = this.physics.add.sprite(60, H-120, 'afra').setScale(0.13);
    this.player.setCollideWorldBounds(false);
    this.player.body.setSize(200,650);
    this.player.body.setOffset(70,80);
    this.player.setDepth(10);

    // Mario-style jump state
    this.jumpHeld = false;
    this.coyoteTimer = 0;
    this.wasOnGround = false;

    // Collisions
    this.physics.add.collider(this.player, this.platforms);
    this.physics.add.collider(this.player, this.movingPlatforms);
    this.physics.add.collider(this.enemies, this.platforms);
    this.physics.add.collider(this.enemies, this.movingPlatforms);

    // ? block: player hits from below
    this.physics.add.collider(this.player, this.questionBlocks, this.hitQBlock, null, this);
    this.physics.add.collider(this.player, this.brickBlocks, this.hitBrick, null, this);

    this.physics.add.overlap(this.player, this.enemies, this.hitEnemy, null, this);
    this.physics.add.overlap(this.player, this.crush, this.reachCrush, null, this);
    this.physics.add.overlap(this.player, this.coins, this.collectCoin, null, this);
    this.physics.add.overlap(this.player, this.powerUpItems, this.collectPowerUp, null, this);

    // Camera follow
    this.cameras.main.startFollow(this.player, true, 0.08, 0.08);
    this.cameras.main.setDeadzone(100, 50);

    // HUD (fixed to camera)
    this.createHUD();

    // Apply pre-purchased powerup visuals
    if(this.powerUps.shield) {
      this.shieldGfx = this.add.graphics();
      this.shieldGfx.lineStyle(2, COLORS.shield, 0.7);
      this.shieldGfx.strokeCircle(0, 0, 35);
      this.shieldGfx.fillStyle(COLORS.shield, 0.15);
      this.shieldGfx.fillCircle(0, 0, 35);
      this.shieldGfx.setDepth(11);
    }
    if(this.powerUps.speed > 0) this.player.setTint(COLORS.speed);
    if(this.powerUps.magnet > 0) this.player.setTint(COLORS.magnet);

    // Keyboard
    this.cursors = this.input.keyboard.createCursorKeys();
    this.wasd = this.input.keyboard.addKeys({
      up:Phaser.Input.Keyboard.KeyCodes.W, left:Phaser.Input.Keyboard.KeyCodes.A,
      right:Phaser.Input.Keyboard.KeyCodes.D, space:Phaser.Input.Keyboard.KeyCodes.SPACE
    });
  }

  // --- BACKGROUND ---
  createBackground(W, H) {
    // Sky gradient (render to texture for performance)
    const sky = this.add.graphics();
    for(let y=0;y<H;y++){
      sky.fillStyle(Phaser.Display.Color.GetColor(
        Math.round(Phaser.Math.Linear(0x74,0xa2)),
        Math.round(Phaser.Math.Linear(0xb9,0x9b)),
        Math.round(Phaser.Math.Linear(0xff,0xfe))),1);
      sky.fillRect(0,y,W,1);
    }
    sky.setDepth(0);

    // Mountains repeating
    const mt = this.add.graphics();
    mt.fillStyle(0x6c5ce7, 0.25);
    for(let bx=0; bx<W; bx+=400) {
      mt.beginPath(); mt.moveTo(bx,H);
      mt.lineTo(bx,H-100); mt.lineTo(bx+60,H-180); mt.lineTo(bx+140,H-130);
      mt.lineTo(bx+200,H-210); mt.lineTo(bx+300,H-140); mt.lineTo(bx+400,H-170);
      mt.lineTo(bx+400,H); mt.closePath(); mt.fillPath();
    }
    mt.setDepth(0);

    // Hills (closer, parallax effect)
    const hills = this.add.graphics();
    hills.fillStyle(0x00b894, 0.2);
    for(let bx=0; bx<W; bx+=300) {
      hills.fillEllipse(bx+150, H-30, 300, 120);
    }
    hills.setDepth(0);

    // Clouds
    for(let i=0; i<Math.floor(W/200); i++){
      const c=this.add.graphics();
      const cx=Phaser.Math.Between(50,W-50), cy=Phaser.Math.Between(25,120);
      c.fillStyle(0xffffff,0.6);
      c.fillEllipse(0,0,Phaser.Math.Between(50,90),Phaser.Math.Between(20,35));
      c.fillEllipse(-18,-6,35,22); c.fillEllipse(18,-4,40,25);
      c.setPosition(cx,cy); c.setDepth(0);
      this.tweens.add({targets:c,x:cx+Phaser.Math.Between(-20,20),duration:Phaser.Math.Between(6000,12000),yoyo:true,repeat:-1,ease:'Sine.easeInOut'});
    }
  }

  // --- GROUND ---
  buildGround(lvl, H) {
    lvl.ground.forEach(([x, w]) => {
      // Visual
      const g = this.add.graphics(); g.setDepth(1);
      // Dirt
      g.fillStyle(COLORS.brown, 1);
      g.fillRect(x, H-T, w, T);
      // Grass top
      g.fillStyle(COLORS.mint, 1);
      g.fillRect(x, H-T, w, 10);
      g.fillStyle(COLORS.darkGreen, 1);
      g.fillRect(x+2, H-T+2, w-4, 4);
      // Grid lines for tile feel
      g.lineStyle(1, 0x000000, 0.08);
      for(let tx=x; tx<x+w; tx+=T) g.strokeRect(tx, H-T, T, T);

      // Physics
      const zone = this.add.zone(x+w/2, H-T+T/2, w, T);
      this.physics.add.existing(zone, true);
      this.platforms.add(zone);
    });
  }

  // --- STEPS (extra ground blocks) ---
  buildSteps(lvl) {
    if(!lvl.steps) return;
    lvl.steps.forEach(([x, y]) => {
      const g = this.add.graphics(); g.setDepth(1);
      g.fillStyle(COLORS.brown, 1); g.fillRoundedRect(x, y, T, T, 2);
      g.fillStyle(COLORS.mint, 1); g.fillRoundedRect(x, y, T, 8, {tl:2,tr:2,bl:0,br:0});
      g.lineStyle(1, 0x000000, 0.1); g.strokeRect(x, y, T, T);
      const z = this.add.zone(x+T/2, y+T/2, T, T);
      this.physics.add.existing(z, true); this.platforms.add(z);
    });
  }

  // --- FLOATING PLATFORMS ---
  buildFloats(lvl) {
    lvl.floats.forEach(([x, y, w]) => {
      this.addPlatformVisual(x, y, w, 20);
    });
  }

  addPlatformVisual(x, y, w, h) {
    const g = this.add.graphics(); g.setDepth(1);
    g.fillStyle(0x000000, 0.12); g.fillRoundedRect(x+2, y+2, w, h, 6);
    g.fillStyle(COLORS.brown, 1); g.fillRoundedRect(x, y, w, h, 6);
    g.fillStyle(COLORS.mint, 1); g.fillRoundedRect(x, y, w, 10, {tl:6,tr:6,bl:0,br:0});
    g.fillStyle(COLORS.darkGreen, 1); g.fillRoundedRect(x+3, y+2, w-6, 3, 1);
    const z = this.add.zone(x+w/2, y+h/2, w, h);
    this.physics.add.existing(z, true); this.platforms.add(z);
  }

  // --- PIPES ---
  buildPipes(lvl, H) {
    lvl.pipes.forEach(([x, h]) => {
      const py = H - T - h; // pipe top y (sitting on ground)
      const g = this.add.graphics(); g.setDepth(2);
      // Pipe body
      g.fillStyle(COLORS.pipe, 1); g.fillRect(x+4, py+20, T-8, h-20);
      // Pipe top (wider)
      g.fillStyle(COLORS.pipe, 1); g.fillRoundedRect(x, py, T, 24, {tl:4,tr:4,bl:0,br:0});
      // Highlight
      g.fillStyle(0x2ecc71, 0.4); g.fillRect(x+6, py+24, 6, h-24);
      // Dark edge
      g.fillStyle(COLORS.pipeDark, 1); g.fillRect(x+T-10, py+24, 4, h-24);
      g.fillStyle(COLORS.pipeDark, 0.5); g.fillRect(x, py, T, 4);
      // Physics (the whole pipe is solid)
      const z = this.add.zone(x+T/2, py+h/2, T, h);
      this.physics.add.existing(z, true); this.platforms.add(z);
    });
  }

  // --- QUESTION BLOCKS ---
  buildQuestionBlocks(lvl) {
    lvl.qBlocks.forEach(([x, y, item]) => {
      const g = this.add.graphics(); g.setDepth(2);
      this.drawQBlock(g, x, y, false);
      const z = this.add.zone(x+T/2, y+T/2, T, T);
      this.physics.add.existing(z, true);
      z.qGfx = g; z.qItem = item; z.qUsed = false; z.qX = x; z.qY = y;
      this.questionBlocks.add(z);
    });
  }

  drawQBlock(g, x, y, used) {
    g.clear();
    if (used) {
      g.fillStyle(0x7f8c8d, 1); g.fillRoundedRect(x, y, T, T, 4);
      g.lineStyle(2, 0x6c7a7a, 1); g.strokeRoundedRect(x, y, T, T, 4);
    } else {
      g.fillStyle(COLORS.qBlock, 1); g.fillRoundedRect(x, y, T, T, 4);
      g.lineStyle(2, COLORS.qBlockDark, 1); g.strokeRoundedRect(x+2, y+2, T-4, T-4, 3);
      // Question mark
      g.fillStyle(0xffffff, 0.9);
      g.fillRoundedRect(x+14, y+8, 12, 4, 2);
      g.fillRoundedRect(x+22, y+8, 4, 12, 2);
      g.fillRoundedRect(x+14, y+16, 12, 4, 2);
      g.fillRoundedRect(x+14, y+16, 4, 8, 2);
      g.fillRoundedRect(x+14, y+28, 4, 5, 2);
    }
  }

  hitQBlock(player, block) {
    if (block.qUsed) return;
    // Activate when player hits from BELOW (Mario-style head bump)
    // OR lands on top of the block
    const hitFromBelow = player.body.touching.up && block.body.touching.down;
    const landedOnTop = player.body.touching.down && block.body.touching.up;
    if (!hitFromBelow && !landedOnTop) return;

    block.qUsed = true;
    this.drawQBlock(block.qGfx, block.qX, block.qY, true);

    // Squash animation: block compresses then releases item
    const gfx = block.qGfx;
    this.tweens.add({
      targets: gfx, scaleY: 0.7, scaleX: 1.2, duration: 100, yoyo: true, ease: 'Quad.easeOut',
      onYoyo: () => {
        // Release item upward with visual display
        const ix = block.qX + T/2, iy = block.qY - 30;
        if (block.qItem === 'coin') {
          this.showQBlockItem(ix, iy, 'coin');
          this.score += 100;
          this.coinCount++;
          this.updateHUD();
          this.showFloatingText(ix, iy-10, '+100', '#FFD700');
        } else {
          this.showQBlockItem(ix, iy, block.qItem);
        }
      }
    });
  }

  // Show the item from a ? block: big visual, label, auto-collect after 0.5s
  showQBlockItem(x, y, type) {
    const g = this.add.graphics(); g.setDepth(20);
    const colors = {coin:COLORS.coinColor, heart:COLORS.red, star:COLORS.gold, shield:COLORS.shield, speed:COLORS.speed, magnet:COLORS.magnet};
    const labels = {coin:'🪙 Coin!', heart:'❤️ Can!', star:'⭐ Yıldız!', shield:'🛡️ Kalkan!', speed:'⚡ Hız!', magnet:'🧲 Mıknatıs!'};
    const col = colors[type] || COLORS.gold;

    // Glow circle
    g.fillStyle(col, 0.4); g.fillCircle(0, 0, 22);
    g.fillStyle(col, 1); g.fillCircle(0, 0, 14);
    g.fillStyle(0xffffff, 0.5); g.fillCircle(-3, -3, 5);
    g.setPosition(x, y);

    // Label text
    const lbl = this.add.text(x, y - 28, labels[type]||'', {
      fontFamily:'Fredoka One, cursive', fontSize:'16px', color:'#fff',
      stroke:'#000', strokeThickness:3
    }).setOrigin(0.5).setDepth(21);

    // Pop up animation
    this.tweens.add({targets:[g,lbl], y: y-40, duration:300, ease:'Back.easeOut'});

    // Auto-collect after 0.5s
    this.time.delayedCall(500, () => {
      // Collect effect
      this.spawnBurst(g.x, g.y, col, 8);
      g.destroy();
      lbl.destroy();
      // Apply power-up (coins already counted above)
      if(type !== 'coin') {
        this.applyPowerUp(type);
        this.updateHUD();
      }
    });
  }

  // --- BRICK BLOCKS ---
  buildBrickBlocks(lvl) {
    lvl.bricks.forEach(([x, y]) => {
      const g = this.add.graphics(); g.setDepth(2);
      this.drawBrick(g, x, y);
      const z = this.add.zone(x+T/2, y+T/2, T, T);
      this.physics.add.existing(z, true);
      z.bGfx = g; z.bX = x; z.bY = y;
      this.brickBlocks.add(z);
    });
  }

  drawBrick(g, x, y) {
    g.fillStyle(COLORS.brick, 1); g.fillRoundedRect(x, y, T, T, 3);
    g.lineStyle(1, COLORS.brickDark, 0.6);
    g.strokeRect(x+1, y+1, T/2-1, T/2-1);
    g.strokeRect(x+T/2, y+1, T/2-1, T/2-1);
    g.strokeRect(x+1, y+T/2, T/2-1, T/2-1);
    g.strokeRect(x+T/2, y+T/2, T/2-1, T/2-1);
    g.lineStyle(1, 0xffffff, 0.15);
    g.strokeRoundedRect(x, y, T, T, 3);
  }

  hitBrick(player, brick) {
    if (!player.body.touching.up || !brick.body.touching.down) return;
    // Break it
    const bx = brick.bX, by = brick.bY;
    // Fragment effect
    for(let i=0;i<6;i++){
      const f=this.add.graphics(); f.fillStyle(COLORS.brick,1); f.fillRect(0,0,8,8); f.setDepth(20);
      f.setPosition(bx+Phaser.Math.Between(0,T), by+Phaser.Math.Between(0,T));
      this.tweens.add({targets:f, x:f.x+Phaser.Math.Between(-60,60), y:f.y+Phaser.Math.Between(-80,40),
        alpha:0, angle:Phaser.Math.Between(-180,180), duration:600, onComplete:()=>f.destroy()});
    }
    if(brick.bGfx) brick.bGfx.destroy();
    brick.destroy();
    this.score += 50;
    this.updateHUD();
  }

  // --- MOVING PLATFORMS ---
  buildMovingPlatforms(lvl) {
    lvl.movingPlats.forEach(([x,y,w,mx,my,dur]) => {
      const g = this.add.graphics(); g.setDepth(1);
      g.fillStyle(0x000000,0.12); g.fillRoundedRect(-w/2+2,2,w,20,6);
      g.fillStyle(0xe67e22,1); g.fillRoundedRect(-w/2,0,w,20,6);
      g.fillStyle(0xf39c12,1); g.fillRoundedRect(-w/2,0,w,8,{tl:6,tr:6,bl:0,br:0});
      g.setPosition(x+w/2, y+10);

      const z = this.add.zone(x+w/2, y+10, w, 20);
      this.physics.add.existing(z,false);
      z.body.setImmovable(true); z.body.setAllowGravity(false);
      this.movingPlatforms.add(z);
      z.mpGfx=g;

      this.tweens.add({targets:[z,g], x:'+='+mx, y:'+='+my, duration:dur||2000,
        yoyo:true, repeat:-1, ease:'Sine.easeInOut'});
    });
  }

  // --- COINS ---
  spawnCoins(lvl) {
    lvl.coins.forEach(([x, y]) => this.spawnCoinAt(x, y, false));
  }

  spawnCoinAt(x, y, fromBlock) {
    const g = this.add.graphics(); g.setDepth(3);
    g.fillStyle(COLORS.coinColor, 1);
    g.fillCircle(0, 0, 8);
    g.fillStyle(0xFFC200, 1);
    g.fillCircle(0, 0, 5);
    g.fillStyle(0xFFE066, 1);
    g.fillCircle(-2, -2, 2);
    g.setPosition(x, y);

    const z = this.add.zone(x, y, 18, 18);
    this.physics.add.existing(z, false);
    z.body.setAllowGravity(false);
    z.cGfx = g;
    this.coins.add(z);

    // Bob animation
    this.tweens.add({targets:[g,z], y:y-6, duration:600+Phaser.Math.Between(0,200), yoyo:true, repeat:-1, ease:'Sine.easeInOut'});

    // Spin effect (scale X)
    this.tweens.add({targets:g, scaleX:{from:1,to:0.3}, duration:400, yoyo:true, repeat:-1, ease:'Sine.easeInOut'});

    if(fromBlock) {
      // Pop up animation
      g.setPosition(x, y+20);
      z.setPosition(x, y+20);
      this.tweens.add({targets:[g,z], y:y-15, duration:300, ease:'Quad.easeOut', onComplete:()=>{
        g.destroy(); z.destroy();
      }});
    }
  }

  collectCoin(player, coin) {
    if(!coin.active) return;
    this.score += 50;
    this.coinCount++;
    if(coin.cGfx) coin.cGfx.destroy();
    this.showFloatingText(coin.x, coin.y-10, '+50', '#FFD700');
    this.spawnBurst(coin.x, coin.y, COLORS.coinColor, 6);
    coin.destroy();
    this.updateHUD();
  }

  // --- POWER-UPS ---
  spawnPowerUps(lvl) {
    lvl.powerUps.forEach(([x, y, type]) => this.spawnPowerUpAt(x, y, type));
  }

  spawnPowerUpAt(x, y, type) {
    const g = this.add.graphics(); g.setDepth(4);
    const colors = {heart:COLORS.red, star:COLORS.gold, shield:COLORS.shield, speed:COLORS.speed, magnet:COLORS.magnet};
    const col = colors[type] || COLORS.gold;

    // Glowing background circle
    g.fillStyle(col, 0.3); g.fillCircle(0, 0, 14);
    g.fillStyle(col, 1);

    if(type==='heart') {
      g.beginPath();g.arc(-4,-2,5,Math.PI,0,false);g.arc(4,-2,5,Math.PI,0,false);g.lineTo(0,9);g.closePath();g.fillPath();
    } else if(type==='star') {
      g.beginPath();
      for(let i=0;i<10;i++){const r=i%2===0?10:4;const a=(i*Math.PI)/5-Math.PI/2;g.lineTo(Math.cos(a)*r,Math.sin(a)*r);}
      g.closePath();g.fillPath();
    } else if(type==='shield') {
      g.beginPath();g.moveTo(0,-10);g.lineTo(9,-4);g.lineTo(7,6);g.lineTo(0,11);g.lineTo(-7,6);g.lineTo(-9,-4);g.closePath();g.fillPath();
      g.fillStyle(0xffffff,0.3);g.fillCircle(-2,-2,4);
    } else if(type==='speed') {
      g.fillRoundedRect(-7,-4,14,8,3);
      g.fillStyle(0xffffff,0.5);g.fillTriangle(5,-3,10,0,5,3);
    } else if(type==='magnet') {
      g.lineStyle(4,col,1);g.beginPath();g.arc(0,-2,7,Math.PI,0,false);g.strokePath();
      g.fillRect(-8,-2,4,10);g.fillRect(4,-2,4,10);
    }

    g.setPosition(x, y);

    const z = this.add.zone(x, y, 24, 24);
    this.physics.add.existing(z, false);
    z.body.setAllowGravity(false);
    z.pGfx = g; z.pType = type;
    this.powerUpItems.add(z);

    // Float + glow
    this.tweens.add({targets:[g,z], y:y-8, duration:800, yoyo:true, repeat:-1, ease:'Sine.easeInOut'});
    this.tweens.add({targets:g, alpha:{from:0.7,to:1}, duration:500, yoyo:true, repeat:-1});
  }

  collectPowerUp(player, item) {
    if(!item.active) return;
    const type = item.pType;
    if(item.pGfx) item.pGfx.destroy();

    const labels = {heart:'+1 Can',star:'Yıldız Gücü!',shield:'Kalkan!',speed:'Hız Modu!',magnet:'Mıknatıs!'};
    const colors = {heart:'#ff4757',star:'#FFD93D',shield:'#48dbfb',speed:'#55efc4',magnet:'#a29bfe'};
    this.showFloatingText(item.x, item.y-15, labels[type]||'', colors[type]||'#fff');
    this.spawnBurst(item.x, item.y, item.pGfx ? COLORS.gold : COLORS.pink, 10);
    item.destroy();

    this.applyPowerUp(type);
    this.updateHUD();
  }

  applyPowerUp(type) {
    if(type==='heart') {
      this.hearts = Math.min(this.hearts+1, 5);
    } else if(type==='star') {
      this.powerUps.invincible = 8000;
      this.invincible = true;
      this.player.setTint(0xFFD93D);
      this.score += 200;
    } else if(type==='shield') {
      this.powerUps.shield = true;
      this.score += 100;
      // Show shield bubble
      if(this.shieldGfx) this.shieldGfx.destroy();
      this.shieldGfx = this.add.graphics();
      this.shieldGfx.lineStyle(2, COLORS.shield, 0.7);
      this.shieldGfx.strokeCircle(0, 0, 35);
      this.shieldGfx.fillStyle(COLORS.shield, 0.15);
      this.shieldGfx.fillCircle(0, 0, 35);
      this.shieldGfx.setDepth(11);
    } else if(type==='speed') {
      this.powerUps.speed = 6000;
      this.score += 100;
      this.player.setTint(COLORS.speed);
    } else if(type==='magnet') {
      this.powerUps.magnet = 8000;
      this.score += 100;
      this.player.setTint(COLORS.magnet);
    }
  }

  // --- ENEMIES ---
  spawnEnemies(lvl, H) {
    lvl.enemies.forEach(([x, spd, boss]) => {
      const e = this.physics.add.sprite(x, H-100, 'baby');
      e.setScale(boss ? 0.18 : 0.13);
      e.body.setAllowGravity(true);
      e.body.setSize(200,650); e.body.setOffset(70,80);
      e.setDepth(5); e.isBoss=boss||false; e.patrolSpeed=spd;
      e.setVelocityX(spd);
      this.enemies.add(e);
      if(boss) {
        // Boss: red tint + periodic jump
        e.setTint(0xff6b6b);
        this.time.addEvent({delay:2500,loop:true,callback:()=>{
          if(e.active&&e.body&&e.body.blocked.down) e.setVelocityY(-280);
        }});
      }
    });
  }

  // --- CRUSH ---
  createCrush(lvl) {
    const [cx,cy] = lvl.crush;
    // Platform for crush to stand on
    this.addPlatformVisual(cx-50, cy+50, 100, 20);

    this.crush = this.physics.add.sprite(cx, cy, 'crush');
    this.crush.setScale(0.14);
    this.crush.body.setAllowGravity(false);
    this.crush.body.setSize(350,450); this.crush.body.setOffset(50,50);
    this.crush.setDepth(5);
    this.tweens.add({targets:this.crush,y:cy-8,duration:1000,yoyo:true,repeat:-1,ease:'Sine.easeInOut'});
    // Heart particles
    this.time.addEvent({delay:700,loop:true,callback:()=>{
      if(!this.crush||!this.crush.active)return;
      const hg=this.add.graphics();
      hg.fillStyle(COLORS.pink,0.8);hg.beginPath();hg.arc(-3,-2,3,Math.PI,0,false);hg.arc(3,-2,3,Math.PI,0,false);hg.lineTo(0,5);hg.closePath();hg.fillPath();
      hg.setPosition(this.crush.x+Phaser.Math.Between(-18,18),this.crush.y+Phaser.Math.Between(-15,5));hg.setDepth(6);
      this.tweens.add({targets:hg,y:hg.y-35,alpha:0,duration:1100,onComplete:()=>hg.destroy()});
    }});
    // Flag pole before crush
    const fg = this.add.graphics(); fg.setDepth(2);
    fg.fillStyle(0x95a5a6,1); fg.fillRect(cx-60, cy-20, 6, 120);
    fg.fillStyle(COLORS.pink,1); fg.fillTriangle(cx-54, cy-20, cx-54, cy+10, cx-24, cy-5);
  }

  // --- HIT ENEMY ---
  hitEnemy(player, enemy) {
    if(this.gameOver||this.levelComplete) return;

    // Star power = destroy enemy
    if(this.powerUps.invincible > 0) {
      this.spawnBurst(enemy.x, enemy.y, COLORS.gold, 10);
      this.showFloatingText(enemy.x, enemy.y-20, '+300', '#FFD93D');
      this.score += 300;
      enemy.destroy();
      this.updateHUD();
      return;
    }

    if(this.invincible) return;

    // Shield absorbs hit
    if(this.powerUps.shield) {
      this.powerUps.shield = false;
      if(this.shieldGfx){this.shieldGfx.destroy();this.shieldGfx=null;}
      this.spawnBurst(player.x, player.y, COLORS.shield, 12);
      this.showFloatingText(player.x, player.y-30, 'Kalkan Kırıldı!', '#48dbfb');
      this.cameras.main.shake(150, 0.008);
      // Brief invincibility
      this.invincible = true;
      this.time.delayedCall(500, ()=>{this.invincible=false;});
      const dir = player.x < enemy.x ? -1 : 1;
      player.setVelocity(dir*150, -150);
      this.updateHUD();
      return;
    }

    this.hearts--;
    this.updateHUD();
    this.cameras.main.flash(300,255,0,0,true);
    this.cameras.main.shake(200,0.012);

    if(this.hearts<=0){ this.showGameOver(); return; }

    this.invincible = true;
    this.tweens.add({targets:player,alpha:0.3,duration:100,yoyo:true,repeat:9,
      onComplete:()=>{if(this.player&&this.player.active)this.player.setAlpha(1);this.invincible=false;}});
    const dir = player.x < enemy.x ? -1 : 1;
    player.setVelocity(dir*200, -220);
  }

  // --- REACH CRUSH ---
  reachCrush() {
    if(this.levelComplete||this.gameOver) return;
    this.levelComplete = true;

    // Star burst celebration
    for(let i=0;i<20;i++){
      const sg=this.add.graphics();
      sg.fillStyle(Phaser.Math.Between(0,1)?COLORS.gold:COLORS.pink,1);
      sg.beginPath();for(let j=0;j<10;j++){const r=j%2===0?6:2.5;const a=(j*Math.PI)/5-Math.PI/2;sg.lineTo(Math.cos(a)*r,Math.sin(a)*r);}sg.closePath();sg.fillPath();
      sg.setPosition(this.crush.x,this.crush.y);sg.setDepth(20);
      this.tweens.add({targets:sg,x:sg.x+Phaser.Math.Between(-120,120),y:sg.y+Phaser.Math.Between(-100,60),alpha:0,duration:1000,onComplete:()=>sg.destroy()});
    }

    if(this.currentLevel < 3) {
      // Levels 1-2: show completion then go to shop
      const overlay=this.add.rectangle(GAME_W/2,GAME_H/2,GAME_W,GAME_H,0x000000,0.4).setDepth(25).setScrollFactor(0);
      this.add.text(GAME_W/2,GAME_H/2-20,'Level Tamamlandı!',{fontFamily:'Fredoka One, cursive',fontSize:'36px',color:'#FFD93D',stroke:'#C44569',strokeThickness:4}).setOrigin(0.5).setDepth(26).setScrollFactor(0);
      this.time.delayedCall(1500,()=>{
        this.scene.start('ShopScene',{
          level:this.currentLevel, hearts:this.hearts, score:this.score, coinCount:this.coinCount
        });
      });
    } else {
      // Level 3: Dramatic reunion cutscene
      this.physics.pause();

      // Auto-walk player to crush
      this.tweens.add({
        targets: this.player,
        x: this.crush.x - 30,
        duration: 800,
        ease: 'Quad.easeOut',
        onComplete: () => {
          // Big heart explosion
          for(let i=0;i<30;i++){
            const hg=this.add.graphics();
            const col = Phaser.Math.RND.pick([COLORS.pink, COLORS.red, COLORS.gold]);
            hg.fillStyle(col,0.9);
            hg.beginPath();hg.arc(-4,-3,5,Math.PI,0,false);hg.arc(4,-3,5,Math.PI,0,false);hg.lineTo(0,7);hg.closePath();hg.fillPath();
            hg.setPosition(this.crush.x-15,this.crush.y);hg.setDepth(25);
            const angle = (i/30)*Math.PI*2;
            this.tweens.add({targets:hg,
              x:hg.x+Math.cos(angle)*Phaser.Math.Between(60,150),
              y:hg.y+Math.sin(angle)*Phaser.Math.Between(60,150),
              alpha:0, scaleX:2, scaleY:2,
              duration:1200, onComplete:()=>hg.destroy()});
          }

          // Overlay
          this.add.rectangle(GAME_W/2,GAME_H/2,GAME_W,GAME_H,0x000000,0.5).setDepth(24).setScrollFactor(0);

          // Typewriter text
          const msg = 'Sonunda kavuştular!';
          const txt = this.add.text(GAME_W/2, GAME_H/2-20, '', {
            fontFamily:'Fredoka One, cursive', fontSize:'34px', color:'#FFD93D',
            stroke:'#C44569', strokeThickness:5
          }).setOrigin(0.5).setDepth(26).setScrollFactor(0);

          let ci=0;
          this.time.addEvent({delay:60,repeat:msg.length-1,callback:()=>{
            ci++; txt.setText(msg.substring(0,ci));
          }});

          // Transition to WinScene after 2.5s
          this.time.delayedCall(2500, ()=>{
            this.scene.start('WinScene',{score:this.score,coinCount:this.coinCount});
          });
        }
      });
    }
  }

  // --- GAME OVER ---
  showGameOver() {
    this.gameOver=true; this.physics.pause();
    this.add.rectangle(GAME_W/2,GAME_H/2,GAME_W,GAME_H,0x000000,0.6).setDepth(25).setScrollFactor(0);
    this.add.text(GAME_W/2,GAME_H/2-40,'Ahh! Düştün...',{fontFamily:'Fredoka One, cursive',fontSize:'32px',color:'#ff4757',stroke:'#000',strokeThickness:3}).setOrigin(0.5).setDepth(26).setScrollFactor(0);
    this.add.text(GAME_W/2,GAME_H/2+10,'Ama vazgeçme!',{fontFamily:'Fredoka One, cursive',fontSize:'20px',color:'#fff'}).setOrigin(0.5).setDepth(26).setScrollFactor(0);
    const bb=this.add.graphics();bb.fillStyle(COLORS.pink,1);bb.fillRoundedRect(GAME_W/2-90,GAME_H/2+50,180,50,25);bb.setDepth(26).setScrollFactor(0);
    this.add.text(GAME_W/2,GAME_H/2+75,'Tekrar Dene',{fontFamily:'Fredoka One, cursive',fontSize:'22px',color:'#fff'}).setOrigin(0.5).setDepth(26).setScrollFactor(0);
    const z=this.add.zone(GAME_W/2,GAME_H/2+75,180,50).setInteractive({useHandCursor:true}).setDepth(27).setScrollFactor(0);
    z.on('pointerdown',()=>this.scene.start('GameScene',{level:this.currentLevel,hearts:3,score:0,coinCount:0}));
  }

  // --- HUD ---
  createHUD() {
    const W = GAME_W;
    this.hudBar=this.add.graphics();this.hudBar.fillStyle(0x000000,0.35);this.hudBar.fillRoundedRect(5,5,W-10,38,8);this.hudBar.setDepth(30).setScrollFactor(0);
    // Hearts
    this.heartIcons=[];
    for(let i=0;i<5;i++){
      const hg=this.add.graphics();
      hg.fillStyle(COLORS.red,1);hg.beginPath();hg.arc(16+i*26-3,22-2,4.5,Math.PI,0,false);hg.arc(16+i*26+3,22-2,4.5,Math.PI,0,false);hg.lineTo(16+i*26,22+5);hg.closePath();hg.fillPath();
      hg.setDepth(31).setScrollFactor(0);hg.setVisible(i<this.hearts);this.heartIcons.push(hg);
    }
    // Coin icon + count
    const ci=this.add.graphics();ci.fillStyle(COLORS.coinColor,1);ci.fillCircle(W/2-40,22,7);ci.fillStyle(0xFFC200,1);ci.fillCircle(W/2-40,22,4);ci.setDepth(31).setScrollFactor(0);
    this.coinText=this.add.text(W/2-28,22,'x'+this.coinCount,{fontFamily:'Fredoka One, cursive',fontSize:'15px',color:'#FFD700'}).setOrigin(0,0.5).setDepth(31).setScrollFactor(0);
    // Score
    this.scoreText=this.add.text(W-15,22,this.score+'',{fontFamily:'Fredoka One, cursive',fontSize:'16px',color:'#FFD93D'}).setOrigin(1,0.5).setDepth(31).setScrollFactor(0);
    // Level
    this.add.text(W/2+40,22,'Lv.'+this.currentLevel,{fontFamily:'Fredoka One, cursive',fontSize:'14px',color:'#fff'}).setOrigin(0,0.5).setDepth(31).setScrollFactor(0);
    // Power-up indicator area
    this.puText=this.add.text(W/2,42,'',{fontFamily:'Fredoka One, cursive',fontSize:'11px',color:'#fff',align:'center'}).setOrigin(0.5,0).setDepth(31).setScrollFactor(0).setAlpha(0);
  }

  updateHUD() {
    for(let i=0;i<this.heartIcons.length;i++) this.heartIcons[i].setVisible(i<this.hearts);
    if(this.scoreText) this.scoreText.setText(this.score+'');
    if(this.coinText) this.coinText.setText('x'+this.coinCount);
  }

  // --- FLOATING TEXT ---
  showFloatingText(x, y, text, color) {
    const t = this.add.text(x, y, text, {fontFamily:'Fredoka One, cursive',fontSize:'16px',color:color,stroke:'#000',strokeThickness:2}).setOrigin(0.5).setDepth(25);
    this.tweens.add({targets:t, y:y-40, alpha:0, duration:800, onComplete:()=>t.destroy()});
  }

  // --- PARTICLES ---
  spawnBurst(x, y, color, count) {
    for(let i=0;i<(count||8);i++){
      const p=this.add.graphics();p.fillStyle(color,1);p.fillCircle(0,0,Phaser.Math.Between(2,4));p.setPosition(x,y);p.setDepth(15);
      const a=(i/(count||8))*Math.PI*2;
      this.tweens.add({targets:p,x:x+Math.cos(a)*Phaser.Math.Between(25,50),y:y+Math.sin(a)*Phaser.Math.Between(25,50),alpha:0,duration:500,onComplete:()=>p.destroy()});
    }
  }

  spawnDust(x, y) {
    for(let i=0;i<4;i++){
      const d=this.add.graphics();d.fillStyle(COLORS.brown,0.5);d.fillCircle(0,0,Phaser.Math.Between(2,4));d.setPosition(x+Phaser.Math.Between(-10,10),y);d.setDepth(4);
      this.tweens.add({targets:d,y:y-Phaser.Math.Between(10,25),alpha:0,duration:400,onComplete:()=>d.destroy()});
    }
  }

  // --- MOBILE ---
  setupMobileControls() {
    const bL=document.getElementById('btn-left'),bR=document.getElementById('btn-right'),bJ=document.getElementById('btn-jump');
    if(!bL)return;
    const add=(el,key)=>{
      el.addEventListener('touchstart',(e)=>{e.preventDefault();this[key]=true;el.classList.add('pressed');});
      el.addEventListener('touchend',(e)=>{e.preventDefault();this[key]=false;el.classList.remove('pressed');});
      el.addEventListener('touchcancel',(e)=>{e.preventDefault();this[key]=false;el.classList.remove('pressed');});
      el.addEventListener('mousedown',()=>{this[key]=true;el.classList.add('pressed');});
      el.addEventListener('mouseup',()=>{this[key]=false;el.classList.remove('pressed');});
      el.addEventListener('mouseleave',()=>{this[key]=false;el.classList.remove('pressed');});
    };
    add(bL,'mobileLeft');add(bR,'mobileRight');add(bJ,'mobileJump');
  }

  // --- UPDATE ---
  update(time, delta) {
    if(this.gameOver||!this.player||!this.player.active) return;

    const dt = delta;
    const onGround = this.player.body.blocked.down || this.player.body.touching.down;

    // Power-up timers
    if(this.powerUps.invincible>0){
      this.powerUps.invincible-=dt;
      if(this.powerUps.invincible<=0){this.powerUps.invincible=0;this.invincible=false;this.player.clearTint();
        // Rainbow flicker at end
        this.tweens.add({targets:this.player,alpha:0.5,duration:100,yoyo:true,repeat:3,onComplete:()=>{if(this.player)this.player.setAlpha(1);}});
      } else {
        // Rainbow tint cycling
        const cols = [0xFFD93D,0xFF6B9D,0x55efc4,0x48dbfb,0xa29bfe];
        this.player.setTint(cols[Math.floor(time/150)%cols.length]);
      }
    }
    if(this.powerUps.speed>0){
      this.powerUps.speed-=dt;
      if(this.powerUps.speed<=0){this.powerUps.speed=0;this.player.clearTint();}
      else if(this.powerUps.invincible<=0) this.player.setTint(COLORS.speed);
    }
    if(this.powerUps.magnet>0){
      this.powerUps.magnet-=dt;
      if(this.powerUps.magnet<=0){this.powerUps.magnet=0;this.player.clearTint();}
      else {
        if(this.powerUps.invincible<=0&&this.powerUps.speed<=0) this.player.setTint(COLORS.magnet);
        // Attract coins
        this.coins.getChildren().forEach(c=>{
          if(!c.active) return;
          const dist = Phaser.Math.Distance.Between(this.player.x,this.player.y,c.x,c.y);
          if(dist<150){
            const ang = Phaser.Math.Angle.Between(c.x,c.y,this.player.x,this.player.y);
            const spd = Math.max(100, 300-dist*2);
            c.body.setVelocity(Math.cos(ang)*spd, Math.sin(ang)*spd);
            if(c.cGfx){c.cGfx.x+=(this.player.x-c.cGfx.x)*0.1;c.cGfx.y+=(this.player.y-c.cGfx.y)*0.1;}
          }
        });
      }
    }

    // Power-up HUD text
    const puParts=[];
    if(this.powerUps.invincible>0) puParts.push('⭐ '+ Math.ceil(this.powerUps.invincible/1000)+'s');
    if(this.powerUps.shield) puParts.push('🛡️');
    if(this.powerUps.speed>0) puParts.push('⚡ '+Math.ceil(this.powerUps.speed/1000)+'s');
    if(this.powerUps.magnet>0) puParts.push('🧲 '+Math.ceil(this.powerUps.magnet/1000)+'s');
    if(this.puText){
      if(puParts.length>0){this.puText.setText(puParts.join('  '));this.puText.setAlpha(0.9);}
      else{this.puText.setAlpha(0);}
    }

    // Shield bubble follow
    if(this.shieldGfx && this.powerUps.shield){
      this.shieldGfx.setPosition(this.player.x, this.player.y);
    }

    // Speed multiplier
    const speedMult = this.powerUps.speed > 0 ? 1.5 : 1;
    const moveSpeed = 220 * speedMult;
    const jumpPower = this.powerUps.speed > 0 ? -700 : -650;

    // Movement
    const left = this.cursors.left.isDown||this.wasd.left.isDown||this.mobileLeft;
    const right = this.cursors.right.isDown||this.wasd.right.isDown||this.mobileRight;
    const jumpPressed = this.cursors.up.isDown||this.wasd.up.isDown||this.wasd.space.isDown||this.mobileJump;
    const jumpJust = Phaser.Input.Keyboard.JustDown(this.cursors.up)||Phaser.Input.Keyboard.JustDown(this.wasd.up)||Phaser.Input.Keyboard.JustDown(this.wasd.space)||this.mobileJump;

    if(left){this.player.setVelocityX(-moveSpeed);this.player.setFlipX(true);}
    else if(right){this.player.setVelocityX(moveSpeed);this.player.setFlipX(false);}
    else{this.player.setVelocityX(0);}

    // Coyote time: allow jump shortly after leaving ground
    if(onGround) {
      this.coyoteTimer = 120; // ms
      this.wasOnGround = true;
    } else {
      this.coyoteTimer -= dt;
    }

    const canJump = onGround || this.coyoteTimer > 0;
    if(jumpJust && canJump){
      this.player.setVelocityY(jumpPower);
      this.coyoteTimer = 0; // consume coyote time
      this.spawnDust(this.player.x, this.player.body.bottom);
      this.jumpHeld = true;
      this.mobileJump = false;
    }

    // Variable jump height: release early = short jump
    if(!jumpPressed) this.jumpHeld = false;
    if(this.player.body.velocity.y < 0 && !this.jumpHeld) {
      this.player.body.velocity.y += 30; // cut jump short
    }

    // Fast fall: extra gravity when falling (no floaty feeling)
    if(this.player.body.velocity.y > 0) {
      this.player.body.velocity.y += 15;
    }

    // Speed trail
    if(this.powerUps.speed>0 && (left||right) && Math.random()>0.5) {
      const t=this.add.graphics();t.fillStyle(COLORS.speed,0.4);t.fillCircle(0,0,3);t.setPosition(this.player.x,this.player.y+Phaser.Math.Between(-10,10));t.setDepth(9);
      this.tweens.add({targets:t,alpha:0,scaleX:0.2,scaleY:0.2,duration:300,onComplete:()=>t.destroy()});
    }
    // Invincible sparkle
    if(this.powerUps.invincible>0 && Math.random()>0.6) {
      const s=this.add.graphics();s.fillStyle(COLORS.gold,0.8);
      s.beginPath();for(let i=0;i<10;i++){const r=i%2===0?4:1.5;const a=(i*Math.PI)/5-Math.PI/2;s.lineTo(Math.cos(a)*r,Math.sin(a)*r);}s.closePath();s.fillPath();
      s.setPosition(this.player.x+Phaser.Math.Between(-15,15),this.player.y+Phaser.Math.Between(-20,20));s.setDepth(9);
      this.tweens.add({targets:s,alpha:0,y:s.y-20,duration:400,onComplete:()=>s.destroy()});
    }

    // Enemy AI
    this.enemies.getChildren().forEach(e=>{
      if(!e.active||!e.body) return;
      if(e.body.blocked.left) e.setVelocityX(Math.abs(e.patrolSpeed));
      else if(e.body.blocked.right) e.setVelocityX(-Math.abs(e.patrolSpeed));
      e.setFlipX(e.body.velocity.x<0);
    });

    // Moving platform gfx sync
    this.movingPlatforms.getChildren().forEach(mp=>{
      if(mp.mpGfx) mp.mpGfx.setPosition(mp.x, mp.y);
    });

    // Fall off screen
    if(this.player.y > GAME_H+50){this.hearts=0;this.showGameOver();}
  }
}

// ============================================================
//  SHOP SCENE
// ============================================================
class ShopScene extends Phaser.Scene {
  constructor() { super('ShopScene'); }
  create(data) {
    this.currentLevel = data.level || 1;
    this.hearts = data.hearts || 3;
    this.score = data.score || 0;
    this.coinCount = data.coinCount || 0;
    this.purchasedItems = data.purchasedItems || [];

    const W = this.scale.width, H = this.scale.height;

    // Dark background
    const bg = this.add.graphics();
    bg.fillStyle(0x1a1a2e, 1); bg.fillRect(0, 0, W, H);
    bg.lineStyle(3, COLORS.gold, 0.5); bg.strokeRoundedRect(15, 15, W-30, H-30, 16);

    // Title
    this.add.text(W/2, 40, 'Dükkan', {
      fontFamily:'Fredoka One, cursive', fontSize:'36px', color:'#FFD93D',
      stroke:'#C44569', strokeThickness:4
    }).setOrigin(0.5);

    // Coin display
    const coinG = this.add.graphics();
    coinG.fillStyle(COLORS.coinColor, 1); coinG.fillCircle(W/2-60, 80, 10);
    coinG.fillStyle(0xFFC200, 1); coinG.fillCircle(W/2-60, 80, 6);
    this.coinText = this.add.text(W/2-44, 80, 'x ' + this.coinCount, {
      fontFamily:'Fredoka One, cursive', fontSize:'22px', color:'#FFD700'
    }).setOrigin(0, 0.5);

    // Items
    const items = [
      { id:'heart', emoji:'❤️', name:'Ekstra Can', desc:'+1 Can', price:8, color:'#ff4757' },
      { id:'shield', emoji:'🛡️', name:'Kalkan', desc:'1 darbe emer', price:12, color:'#48dbfb' },
      { id:'speed', emoji:'⚡', name:'Hız Başlangıcı', desc:'6sn hız', price:15, color:'#55efc4' },
      { id:'magnet', emoji:'🧲', name:'Mıknatıs', desc:'8sn çekim', price:15, color:'#a29bfe' }
    ];

    const startY = 120, itemH = 75;
    items.forEach((item, i) => {
      const y = startY + i * itemH;
      const canAfford = this.coinCount >= item.price;

      // Item card background
      const card = this.add.graphics();
      card.fillStyle(canAfford ? 0x2d2d4e : 0x1e1e36, 1);
      card.fillRoundedRect(40, y, W-80, 60, 12);
      card.lineStyle(2, canAfford ? 0x4a4a7a : 0x333355, 1);
      card.strokeRoundedRect(40, y, W-80, 60, 12);

      // Emoji + name
      this.add.text(70, y+18, item.emoji + ' ' + item.name, {
        fontFamily:'Fredoka One, cursive', fontSize:'18px',
        color: canAfford ? '#fff' : '#666'
      });
      this.add.text(70, y+40, item.desc, {
        fontFamily:'Fredoka One, cursive', fontSize:'12px',
        color: canAfford ? '#aaa' : '#555'
      });

      // Price + buy button
      const btnX = W - 130, btnW = 90, btnH = 36;
      const btn = this.add.graphics();
      btn.fillStyle(canAfford ? 0xf1c40f : 0x555555, 1);
      btn.fillRoundedRect(btnX, y+12, btnW, btnH, 10);

      const priceText = this.add.text(btnX + btnW/2, y+12+btnH/2, item.price + ' 🪙', {
        fontFamily:'Fredoka One, cursive', fontSize:'14px',
        color: canAfford ? '#1a1a2e' : '#888'
      }).setOrigin(0.5);

      if (canAfford) {
        const zone = this.add.zone(btnX + btnW/2, y+12+btnH/2, btnW, btnH).setInteractive({useHandCursor:true});
        zone.on('pointerdown', () => {
          this.coinCount -= item.price;
          this.purchasedItems.push(item.id);
          this.coinText.setText('x ' + this.coinCount);

          // Flash effect
          this.cameras.main.flash(200, 255, 215, 0, true);

          // Purchased feedback
          const fb = this.add.text(W/2, H/2, item.emoji + ' Alındı!', {
            fontFamily:'Fredoka One, cursive', fontSize:'28px', color:item.color,
            stroke:'#000', strokeThickness:3
          }).setOrigin(0.5).setDepth(10);
          this.tweens.add({targets:fb, y:H/2-40, alpha:0, duration:800, onComplete:()=>fb.destroy()});

          // Rebuild scene to update buttons
          this.time.delayedCall(400, () => {
            this.scene.restart({
              level:this.currentLevel, hearts:this.hearts, score:this.score,
              coinCount:this.coinCount, purchasedItems:this.purchasedItems
            });
          });
        });
      }
    });

    // Continue button
    const cY = startY + items.length * itemH + 20;
    const cb = this.add.graphics();
    cb.fillStyle(COLORS.pink, 1); cb.fillRoundedRect(W/2-90, cY, 180, 50, 25);
    const ct = this.add.text(W/2, cY+25, 'Devam ▶', {
      fontFamily:'Fredoka One, cursive', fontSize:'24px', color:'#fff'
    }).setOrigin(0.5);
    const cz = this.add.zone(W/2, cY+25, 180, 50).setInteractive({useHandCursor:true});
    this.tweens.add({targets:[cb,ct,cz],scaleX:1.05,scaleY:1.05,duration:600,yoyo:true,repeat:-1,ease:'Sine.easeInOut'});
    cz.on('pointerdown', () => {
      const nextLevel = this.currentLevel + 1;
      this.scene.start('StoryScene', {
        level: nextLevel, hearts: this.hearts, score: this.score,
        coinCount: this.coinCount, purchasedItems: this.purchasedItems
      });
    });
  }
}

// ============================================================
//  WIN SCENE
// ============================================================
class WinScene extends Phaser.Scene {
  constructor() { super('WinScene'); }
  create(data) {
    const W=this.scale.width, H=this.scale.height, score=data.score||0, coins=data.coinCount||0;
    const bg=this.add.graphics();
    for(let y=0;y<H;y++){bg.fillStyle(Phaser.Display.Color.GetColor(Math.round(Phaser.Math.Linear(0xFF,0xC4)),Math.round(Phaser.Math.Linear(0x6B,0x45)),Math.round(Phaser.Math.Linear(0x9D,0x69))),1);bg.fillRect(0,y,W,1);}
    // Confetti
    this.time.addEvent({delay:100,repeat:60,callback:()=>{
      const colors=[COLORS.gold,COLORS.pink,COLORS.mint,COLORS.red,0xff9ff3,0x48dbfb,COLORS.white];
      const cx=Phaser.Math.Between(0,W),c=this.add.graphics(),col=Phaser.Math.RND.pick(colors);
      c.fillStyle(col,1);Math.random()>0.5?c.fillRect(-4,-2,8,4):c.fillCircle(0,0,4);c.setPosition(cx,-10);c.setDepth(5);
      this.tweens.add({targets:c,y:H+20,x:cx+Phaser.Math.Between(-80,80),angle:Phaser.Math.Between(-360,360),duration:Phaser.Math.Between(2000,4000),onComplete:()=>c.destroy()});
    }});
    // Heart frame
    for(let i=0;i<30;i++){
      const hg=this.add.graphics(),a=(i/30)*Math.PI*2;
      hg.fillStyle(COLORS.pink,0.7);hg.beginPath();hg.arc(-3,-2,3.5,Math.PI,0,false);hg.arc(3,-2,3.5,Math.PI,0,false);hg.lineTo(0,5);hg.closePath();hg.fillPath();
      hg.setPosition(W/2+Math.cos(a)*(W*0.42),H/2+Math.sin(a)*(H*0.42));hg.setDepth(2);
      this.tweens.add({targets:hg,scaleX:1.3,scaleY:1.3,duration:Phaser.Math.Between(800,1500),yoyo:true,repeat:-1,ease:'Sine.easeInOut'});
    }
    // Title
    const title=this.add.text(W/2,65,"İyi ki Doğdun\nAfra!",{fontFamily:'Fredoka One, cursive',fontSize:'44px',color:'#fff',align:'center',stroke:'#C44569',strokeThickness:6,lineSpacing:8,shadow:{offsetX:3,offsetY:3,color:'#00000044',blur:10,fill:true}}).setOrigin(0.5).setDepth(10);
    this.tweens.add({targets:title,scaleX:1.05,scaleY:1.05,duration:1200,yoyo:true,repeat:-1,ease:'Sine.easeInOut'});
    // Characters
    const afra=this.add.image(W/2-55,225,'afra').setScale(0.16).setDepth(10);
    const crush=this.add.image(W/2+55,225,'crush').setScale(0.14).setDepth(10);
    this.tweens.add({targets:[afra,crush],y:215,duration:1500,yoyo:true,repeat:-1,ease:'Sine.easeInOut'});
    // Hearts between
    this.time.addEvent({delay:600,loop:true,callback:()=>{
      const hg=this.add.graphics();hg.fillStyle(COLORS.red,0.9);hg.beginPath();hg.arc(-3,-2,3,Math.PI,0,false);hg.arc(3,-2,3,Math.PI,0,false);hg.lineTo(0,5);hg.closePath();hg.fillPath();
      hg.setPosition(W/2+Phaser.Math.Between(-15,15),210);hg.setDepth(11);
      this.tweens.add({targets:hg,y:170,alpha:0,scaleX:1.5,scaleY:1.5,duration:1500,onComplete:()=>hg.destroy()});
    }});
    // Message
    this.add.text(W/2,320,'Sen bu dünyadaki\nen güzel hediyesin.\nNice mutlu yıllara...',{fontFamily:'Fredoka One, cursive',fontSize:'18px',color:'#fff',align:'center',lineSpacing:6,shadow:{offsetX:1,offsetY:1,color:'#00000033',blur:4,fill:true}}).setOrigin(0.5).setDepth(10);
    // Stats
    if(score>0||coins>0){
      this.add.text(W/2,395,'Skor: '+score+(coins>0?'  |  Coin: '+coins:''),{fontFamily:'Fredoka One, cursive',fontSize:'15px',color:'#FFD93D'}).setOrigin(0.5).setDepth(10);
    }
    // Replay
    const bb=this.add.graphics();bb.fillStyle(COLORS.gold,1);bb.fillRoundedRect(W/2-100,425,200,50,25);bb.setDepth(10);
    const bt=this.add.text(W/2,450,'Yeniden Oyna',{fontFamily:'Fredoka One, cursive',fontSize:'22px',color:'#C44569'}).setOrigin(0.5).setDepth(10);
    const z=this.add.zone(W/2,450,200,50).setInteractive({useHandCursor:true}).setDepth(11);
    this.tweens.add({targets:[bb,bt,z],scaleX:1.05,scaleY:1.05,duration:800,yoyo:true,repeat:-1,ease:'Sine.easeInOut'});
    z.on('pointerdown',()=>this.scene.start('MenuScene'));
  }
}

// ============================================================
//  CONFIG
// ============================================================
const config = {
  type: Phaser.AUTO,
  width: GAME_W,
  height: GAME_H,
  parent: 'game-container',
  backgroundColor: '#74b9ff',
  scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
  physics: { default:'arcade', arcade:{ gravity:{y:1300}, debug:false }},
  scene: [BootScene, MenuScene, StoryScene, GameScene, ShopScene, WinScene]
};

const game = new Phaser.Game(config);
