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
  coinColor: 0xFFD700, shield: 0x48dbfb, speed: 0x55efc4, magnet: 0xa29bfe,
  spring: 0xff6b9d, springDark: 0xc44569
};
const GAME_W = 800, GAME_H = 500, T = 40; // tile size

// Level data — platform heights tuned so every jump ≤ 130 px rise
// Max jump ≈ 163 px (v₀=650, g=1300), safe design margin = 130 px
// Her bölge ~200px, her bölgede max 1 özel element
const LEVELS = {
  // ── Level 1 ── düz zemin, nazik giriş
  1: {
    world: 1600,
    ground: [[0,1600]],
    steps: [],
    floats: [
      [300,400,100],   // alçak
      [550,380,80],    // orta
      [700,350,80],    // yüksek – merdiven efekti
      [950,400,100],   // alçak – nefes
      [1200,370,80],   // orta
      [1380,340,100],  // yüksek – crush'a çıkış
    ],
    qBlocks: [[550,370,'coin'],[1200,340,'heart']],
    bricks: [],
    pipes: [[450,50]],
    coins: [
      [80,420],[120,420],[160,420],[200,420],
      [370,350],[390,350],[410,350],
      [710,340],[730,340],[750,340],
      [850,280],[850,240],[850,200],  // spring
      [1060,330],[1080,330],[1100,330],
      [1370,320],[1390,320],[1410,320],
    ],
    powerUps: [],
    enemies: [[600,80,false],[1050,80,false]],
    movingPlats: [],
    springs: [[850,448]],
    signs: [[200,420,'Hadi Afra!'],[1150,420,'Az kaldı!']],
    checkpoint: 800,
    letters: [[300,400,'S'],[750,350,'E'],[1300,340,'V']],
    crush: [1520, 300]
  },
  // ── Level 2 ── küçük boşluklar, biraz daha macera
  2: {
    world: 2400,
    // Her boşluk 80px – rahat zıplanır
    ground: [[0,500],[580,500],[1160,400],[1640,400],[2120,280]],
    steps: [],
    floats: [
      [550,400,100],   // alçak
      [800,370,80],    // orta
      [1050,340,80],   // yüksek – merdiven
      [1300,400,100],  // alçak – nefes
      [1550,370,80],   // orta
      [1800,340,80],   // yüksek
      [2050,400,100],  // alçak – nefes
      [2250,380,100],  // crush'a geçiş
    ],
    qBlocks: [[400,370,'coin'],[1000,350,'shield'],[1800,340,'speed']],
    bricks: [],
    pipes: [[650,50],[1300,50]],
    coins: [
      [80,420],[120,420],[160,420],
      [520,350],[540,350],[560,350],
      [810,340],[830,340],[850,340],
      [950,280],[950,240],[950,200],  // spring
      [1110,350],[1130,350],
      [1410,330],[1430,330],[1450,330],
      [1710,340],[1730,340],
      [1900,280],[1900,240],[1900,200],  // spring
      [2060,330],[2080,330],
      [2270,340],[2290,340],[2310,340],
    ],
    powerUps: [],
    enemies: [[700,90,false],[1250,85,false],[1700,90,false],[2100,85,false]],
    movingPlats: [[550,360,100,120,0,2200]],
    springs: [[950,448],[1900,448]],
    signs: [[250,420,'Kalbin yolunu bilir'],[1500,420,'Neredeyse orada!']],
    checkpoint: 1200,
    letters: [[450,380,'İ'],[1150,370,'Y'],[1850,360,'O']],
    crush: [2320, 300]
  },
  // ── Level 3 ── son bölüm, boss bekliyor
  3: {
    world: 3200,
    // Her boşluk 100px – koşarak atlanır, köprü platformlar var
    ground: [[0,420],[520,380],[1000,380],[1480,380],[1960,380],[2440,380],[2920,280]],
    steps: [],
    floats: [
      [440,400,80],    // köprü – alçak
      [700,370,80],    // orta
      [940,400,80],    // köprü – alçak
      [1200,360,80],   // yüksek
      [1420,400,80],   // köprü – alçak
      [1650,370,80],   // orta
      [1900,340,80],   // yüksek – merdiven
      [2150,400,100],  // alçak – nefes
      [2380,400,80],   // köprü – alçak
      [2650,370,80],   // orta
      [2850,340,80],   // yüksek
      [3020,370,100],  // crush'a geçiş
    ],
    qBlocks: [[350,380,'coin'],[1100,360,'heart'],[1800,360,'shield'],[2500,360,'star']],
    bricks: [],
    pipes: [[650,50],[1350,50],[2050,50],[2800,50]],
    coins: [
      [80,420],[120,420],[160,420],[200,420],
      [450,350],[470,350],[490,350],
      [760,340],[780,340],[800,340],
      [900,280],[900,240],[900,200],  // spring
      [1110,350],[1130,350],[1150,350],
      [1460,330],[1480,330],
      [1810,340],[1830,340],[1850,340],
      [2160,330],[2180,330],
      [2510,340],[2530,340],[2550,340],
      [2650,280],[2650,240],[2650,200],  // spring
      [2860,330],[2880,330],
      [3060,320],[3080,320],[3100,320],
    ],
    powerUps: [[1550,360,'speed']],
    enemies: [[650,95,false],[1200,90,false],[1700,95,false],[2300,90,false],[3050,100,true]],
    movingPlats: [[700,360,100,100,0,2000],[2100,360,100,100,0,2200]],
    springs: [[900,448],[2650,448]],
    signs: [[250,420,'Son düzlük!'],[1600,420,'Aşk engel tanımaz'],[2800,420,'Hadi, koş!']],
    checkpoint: 1600,
    letters: [[550,380,'R'],[1800,360,'U'],[2750,360,'M']],
    crush: [3100, 300]
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
    this.textures.addBase64('sisters', ASSET_SISTERS);
  }
  create() {
    const needed = ['afra','baby','crush','sisters'];
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
      1:"Afrodit bir sabah uyanır ve\nçengelköyün güzel semalarını izlerken\ncanı fileden misket peynir çeker,\n\nAma o da ne..\n\nFilenin önünde Ömer Faruk\nonu bekliyor! Galiba bu sefer\nkavuşacaklar, çok güzel ama..\n\nÖnünde bazı engeller var gibi?\nO da kim? Ne? Hazan Bebek mi???\n\nOnları ez ya da üstünden atla\nve sevdana kavuş!",
      2:"Hazan bebek erken yaşta kreşe\ngiderek iyice yaramaz oldu,\no çok zeki bir bebek,\n\nAma bir Büyükkayıkçı\nasla pes etmez,\n\nOyuna devam et ve\nAkçaabat köftene kavuş!",
      3:"Son level başlıyor,\n\nAşk her engeli yener!\n\nNurten kardeşinden öğrendiğin\ntaktikleri uygula ve aşkına kavuş.\n\nBelki titizde pasta da yersiniz..\n\nHadi afra göster gücünü!"
    };
    const names={1:'Misket Peynir',2:'Kreş Kaçkını',3:'Son Dans'};
    this.add.text(W/2,70,'Level '+lv,{fontFamily:'Fredoka One, cursive',fontSize:'32px',color:'#FFD93D',stroke:'#C44569',strokeThickness:4}).setOrigin(0.5);
    this.add.text(W/2,110,names[lv]||'',{fontFamily:'Fredoka One, cursive',fontSize:'20px',color:'#FF6B9D'}).setOrigin(0.5);
    const str=stories[lv]||stories[1];
    const txt=this.add.text(W/2,260,'',{fontFamily:'Fredoka One, cursive',fontSize:'15px',color:'#fff',align:'center',lineSpacing:5,wordWrap:{width:W-80}}).setOrigin(0.5);
    let ci=0;
    this.time.addEvent({delay:30,repeat:str.length-1,callback:()=>{ci++;txt.setText(str.substring(0,ci));}});
    this.time.delayedCall(str.length*30+500,()=>{
      const bb=this.add.graphics();bb.fillStyle(COLORS.pink,1);bb.fillRoundedRect(W/2-80,430,160,45,22);
      const bt=this.add.text(W/2,452,'Devam',{fontFamily:'Fredoka One, cursive',fontSize:'20px',color:'#fff'}).setOrigin(0.5);
      const z=this.add.zone(W/2,452,160,45).setInteractive({useHandCursor:true});
      this.tweens.add({targets:[bb,bt,z],scaleX:1.05,scaleY:1.05,duration:600,yoyo:true,repeat:-1,ease:'Sine.easeInOut'});
      z.on('pointerdown',()=>this.scene.start('GameScene',{level:lv, hearts:data.hearts, score:data.score, coinCount:data.coinCount, purchasedItems:data.purchasedItems, collectedLetters:data.collectedLetters}));
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
    this.checkpointReached = false;
    this.checkpointX = 0;
    this.stompCombo = 0;
    this.comboTimer = 0;
    this.collectedLetters = data.collectedLetters || [];
    this.crushReactionTimer = 0;
    this.spawnX = data.spawnX || null;

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
    this.mobileJumpJust=false; // single-frame trigger for jump
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
    this.springGroup = this.physics.add.staticGroup();
    this.letterGroup = this.physics.add.group({allowGravity:false});

    // Build level
    this.buildGround(lvl, H);
    this.buildSteps(lvl);
    this.buildFloats(lvl);
    this.buildPipes(lvl, H);
    this.buildQuestionBlocks(lvl);
    this.buildBrickBlocks(lvl);
    this.buildMovingPlatforms(lvl);
    this.buildSprings(lvl);
    this.buildSigns(lvl);
    this.buildCheckpoint(lvl, H);
    this.buildLetters(lvl);
    this.spawnCoins(lvl);
    this.spawnPowerUps(lvl);
    this.spawnEnemies(lvl, H);
    this.createCrush(lvl);

    // Player
    const startX = this.spawnX || 60;
    this.player = this.physics.add.sprite(startX, H-120, 'afra').setScale(0.10);
    this.player.setCollideWorldBounds(false);
    this.player.body.setSize(220,600);
    this.player.body.setOffset(60,120);
    this.player.setDepth(10);

    // Mario-style jump state
    this.jumpHeld = false;
    this.coyoteTimer = 0;
    this.wasOnGround = false;
    this.jumpBufferTimer = 0;  // jump buffer: press jump before landing
    this.landedThisFrame = false;

    // Collisions
    this.physics.add.collider(this.player, this.platforms);
    this.physics.add.collider(this.player, this.movingPlatforms);
    this.physics.add.collider(this.enemies, this.platforms);
    this.physics.add.collider(this.enemies, this.movingPlatforms);

    // ? block: player hits from below
    this.physics.add.collider(this.player, this.questionBlocks, this.hitQBlock, null, this);
    this.physics.add.collider(this.player, this.brickBlocks, this.hitBrick, null, this);

    this.physics.add.collider(this.player, this.springGroup, this.hitSpring, null, this);
    this.physics.add.overlap(this.player, this.enemies, this.hitEnemy, null, this);
    this.physics.add.overlap(this.player, this.crush, this.reachCrush, null, this);
    this.physics.add.overlap(this.player, this.coins, this.collectCoin, null, this);
    this.physics.add.overlap(this.player, this.powerUpItems, this.collectPowerUp, null, this);
    this.physics.add.overlap(this.player, this.letterGroup, this.collectLetter, null, this);

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

  // --- SPRINGS (Trambolinler) ---
  buildSprings(lvl) {
    if(!lvl.springs) return;
    lvl.springs.forEach(([x, y]) => {
      const g = this.add.graphics(); g.setDepth(2);
      // Base
      g.fillStyle(COLORS.springDark, 1);
      g.fillRoundedRect(x, y+8, 30, 12, {tl:0,tr:0,bl:4,br:4});
      // Spring coil
      g.lineStyle(3, COLORS.spring, 1);
      g.beginPath();
      for(let i=0; i<4; i++) {
        g.moveTo(x+6, y+6-i*2); g.lineTo(x+24, y+4-i*2);
      }
      g.strokePath();
      // Top pad
      g.fillStyle(COLORS.spring, 1);
      g.fillRoundedRect(x-2, y-4, 34, 8, 4);
      g.fillStyle(0xffffff, 0.3);
      g.fillRoundedRect(x+2, y-2, 16, 3, 2);

      const z = this.add.zone(x+15, y+5, 34, 20);
      this.physics.add.existing(z, true);
      z.sGfx = g; z.sX = x; z.sY = y;
      this.springGroup.add(z);

      // Idle bounce animation
      this.tweens.add({targets:g, scaleY:{from:1,to:0.92}, duration:600, yoyo:true, repeat:-1, ease:'Sine.easeInOut'});
    });
  }

  hitSpring(player, spring) {
    if(!player.body.touching.down) return;
    // Super bounce – controlled, doesn't fly off screen
    player.setVelocityY(-750);
    this.jumpHeld = true;

    // Squash-stretch animation
    const g = spring.sGfx;
    this.tweens.add({targets:g, scaleY:0.4, scaleX:1.3, duration:80, yoyo:true, ease:'Quad.easeOut'});

    // Boing text
    this.showFloatingText(spring.x, spring.sY - 20, 'Boing!', '#FF6B9D');
    this.spawnBurst(spring.x, spring.sY, COLORS.spring, 6);
  }

  // --- SIGNS (Motivasyon tabelaları) ---
  buildSigns(lvl) {
    if(!lvl.signs) return;
    lvl.signs.forEach(([x, y, text]) => {
      // Wooden post
      const g = this.add.graphics(); g.setDepth(1);
      g.fillStyle(0x8B6914, 1);
      g.fillRect(x+18, y, 6, 30);
      // Sign board
      g.fillStyle(0xffeaa7, 1);
      g.fillRoundedRect(x-10, y-28, 62, 30, 6);
      g.lineStyle(2, 0xd4ac0f, 1);
      g.strokeRoundedRect(x-10, y-28, 62, 30, 6);
      // Text
      const t = this.add.text(x+21, y-13, text, {
        fontFamily:'Fredoka One, cursive', fontSize:'8px', color:'#C44569',
        align:'center', wordWrap:{width:56}
      }).setOrigin(0.5).setDepth(2);
      // Small heart on top
      const h = this.add.graphics(); h.setDepth(2);
      h.fillStyle(COLORS.red, 0.8);
      h.beginPath(); h.arc(-2,-1,2.5,Math.PI,0,false); h.arc(2,-1,2.5,Math.PI,0,false);
      h.lineTo(0,4); h.closePath(); h.fillPath();
      h.setPosition(x+21, y-35);
      this.tweens.add({targets:h, y:h.y-5, duration:800, yoyo:true, repeat:-1, ease:'Sine.easeInOut'});
    });
  }

  // --- CHECKPOINT ---
  buildCheckpoint(lvl, H) {
    if(!lvl.checkpoint) return;
    const cx = lvl.checkpoint;
    this.checkpointX = cx;
    // Flag pole
    const g = this.add.graphics(); g.setDepth(2);
    g.fillStyle(0x95a5a6, 1); g.fillRect(cx, H-T-70, 5, 70);
    // Flag (starts white, turns pink when reached)
    this.cpFlag = this.add.graphics(); this.cpFlag.setDepth(2);
    this.cpFlag.fillStyle(0xaaaaaa, 0.6);
    this.cpFlag.fillTriangle(cx+5, H-T-70, cx+5, H-T-45, cx+30, H-T-57);
    this.cpFlagX = cx;
  }

  // --- LOVE LETTERS ---
  buildLetters(lvl) {
    if(!lvl.letters) return;
    lvl.letters.forEach(([x, y, ch]) => {
      // Already collected?
      if(this.collectedLetters.includes(ch)) return;

      const g = this.add.graphics(); g.setDepth(4);
      // Envelope background
      g.fillStyle(COLORS.pink, 0.3); g.fillCircle(0, 0, 16);
      g.fillStyle(COLORS.pink, 1); g.fillCircle(0, 0, 12);
      g.setPosition(x, y);

      const txt = this.add.text(x, y, ch, {
        fontFamily:'Fredoka One, cursive', fontSize:'14px', color:'#fff',
        stroke:'#C44569', strokeThickness:2
      }).setOrigin(0.5).setDepth(5);

      const z = this.add.zone(x, y, 28, 28);
      this.physics.add.existing(z, false);
      z.body.setAllowGravity(false);
      z.lGfx = g; z.lTxt = txt; z.lChar = ch;
      this.letterGroup.add(z);

      // Float + sparkle
      this.tweens.add({targets:[g,z,txt], y:y-8, duration:900, yoyo:true, repeat:-1, ease:'Sine.easeInOut'});
      this.tweens.add({targets:g, alpha:{from:0.7,to:1}, scaleX:{from:0.9,to:1.1}, scaleY:{from:0.9,to:1.1}, duration:600, yoyo:true, repeat:-1});
    });
  }

  collectLetter(player, letter) {
    if(!letter.active) return;
    const ch = letter.lChar;
    this.collectedLetters.push(ch);
    if(letter.lGfx) letter.lGfx.destroy();
    if(letter.lTxt) letter.lTxt.destroy();

    this.showFloatingText(letter.x, letter.y-20, '💌 ' + ch + '!', '#FF6B9D');
    this.spawnBurst(letter.x, letter.y, COLORS.pink, 8);
    this.score += 150;
    letter.destroy();
    this.updateHUD();
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
    const BABY_LINES = ['Ağlayacağım!','Mama nerde?','Beni ezme!','Çıtır çıtır!','Gıdık gıdık!','Hıyaaa!','Dadaaa!','Goo goo!','Uykum var!'];
    const BOSS_LINES = ['Ben KOCA bebeğim!','Kimse geçemez!','Patron benim!','HAHAHA!','Altımı değiştirin!','Biberonumu verin!','Uyumam gerek!'];

    lvl.enemies.forEach(([x, spd, boss]) => {
      const e = this.physics.add.sprite(x, H-100, 'baby');
      e.setScale(boss ? 0.18 : 0.13);
      e.body.setAllowGravity(true);
      e.body.setBounceX(1); // duvar/kenardan sekme
      e.body.setSize(200,650); e.body.setOffset(70,80);
      e.setDepth(5); e.isBoss=boss||false; e.patrolSpeed=spd;
      e.patrolOrigin = x; e.patrolRange = boss ? 250 : 150;
      e.setVelocityX(spd);
      this.enemies.add(e);

      if(boss) {
        e.setTint(0xff6b6b);
        e.setScale(0.22);
        e.bossHP = 3;
        e.setVelocityX(spd);
        this.time.addEvent({delay:1800,loop:true,callback:()=>{
          if(!e.active||!e.body) return;
          if(e.body.blocked.down) {
            e.setVelocityY(-300);
            const newDir = e.body.velocity.x >= 0 ? -Math.abs(e.patrolSpeed) : Math.abs(e.patrolSpeed);
            e.setVelocityX(newDir);
          }
        }});
      } else {
        // Level 1: bebekler duruyor, Level 2: yarısı yürüyor, Level 3: hepsi
        const lv = this.currentLevel;
        if(lv === 1) {
          e.setVelocityX(0);
          e.patrolSpeed = 0;
        } else if(lv === 2) {
          // Her ikinci bebek yürüsün
          const idx = this.enemies.getChildren().length;
          if(idx % 2 === 0) { e.setVelocityX(0); e.patrolSpeed = 0; }
          else { e.setVelocityX(Phaser.Math.Between(0,1) ? spd : -spd); }
        } else {
          e.setVelocityX(Phaser.Math.Between(0,1) ? spd : -spd);
        }
      }

      // Funny speech bubbles
      const lines = boss ? BOSS_LINES : BABY_LINES;
      this.time.addEvent({
        delay: Phaser.Math.Between(3000, 6000), loop: true,
        callback: () => {
          if(!e.active) return;
          const dist = this.player && this.player.active ?
            Phaser.Math.Distance.Between(this.player.x, this.player.y, e.x, e.y) : 999;
          if(dist > 300) return; // only show when player is near

          const bubble = this.add.graphics(); bubble.setDepth(20);
          bubble.fillStyle(0xffffff, 0.9);
          bubble.fillRoundedRect(-45, -22, 90, 28, 8);
          // Speech tail
          bubble.fillTriangle(-5, 6, 5, 6, 0, 14);
          bubble.setPosition(e.x, e.y - 55);

          const txt = this.add.text(e.x, e.y - 60, Phaser.Math.RND.pick(lines), {
            fontFamily:'Fredoka One, cursive', fontSize:'10px', color:'#C44569', align:'center'
          }).setOrigin(0.5).setDepth(21);

          // Pop in, stay, fade out
          bubble.setScale(0); txt.setScale(0);
          this.tweens.add({targets:[bubble,txt], scaleX:1, scaleY:1, duration:200, ease:'Back.easeOut'});
          this.time.delayedCall(1500, () => {
            this.tweens.add({targets:[bubble,txt], alpha:0, y:'-=15', duration:400,
              onComplete:()=>{ bubble.destroy(); txt.destroy(); }});
          });
        }
      });
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
      this.squashEnemy(enemy, 300);
      return;
    }

    if(this.invincible) return;

    // STOMP: player falling onto enemy from above = kill enemy (Mario-style)
    if(player.body.velocity.y > 0 && player.y < enemy.y - 10) {
      player.setVelocityY(-400);

      // Boss: needs multiple stomps
      if(enemy.isBoss && enemy.bossHP > 1) {
        enemy.bossHP--;
        this.cameras.main.shake(150, 0.01);
        this.showFloatingText(enemy.x, enemy.y-30, 'HP: '+enemy.bossHP+'/3', '#ff4757');
        this.spawnBurst(enemy.x, enemy.y, COLORS.red, 8);
        // Boss gets angry: faster + flash red
        enemy.patrolSpeed *= 1.3;
        enemy.setVelocityX(enemy.body.velocity.x > 0 ? enemy.patrolSpeed : -enemy.patrolSpeed);
        this.tweens.add({targets:enemy, alpha:0.3, duration:80, yoyo:true, repeat:3});
        // Boss angry line
        const bossLines = ['ACIDI!','KIZIYORUM!','BU KADAR MI?!'];
        this.showFloatingText(enemy.x, enemy.y-50, Phaser.Math.RND.pick(bossLines), '#FF6B9D');
        this.score += 100;
        this.updateHUD();
        return;
      }

      // Normal kill or final boss stomp
      this.stompCombo++;
      this.comboTimer = 1500;
      const combo = Math.min(this.stompCombo, 5);
      const points = (enemy.isBoss ? 500 : 200) * combo;
      const msgs = enemy.isBoss
        ? ['YENILDIIIM!','Altımı değiştirin!','AĞLIYORUUUM!']
        : ['Ezildim!','Ayyy!','Anne!','Acıdı!','Hıh!'];
      this.squashEnemy(enemy, points, Phaser.Math.RND.pick(msgs));
      if(enemy.isBoss) this.cameras.main.shake(300, 0.015);
      if(combo >= 2) this.showFloatingText(player.x, player.y-50, 'x'+combo+' COMBO!', '#FFD93D');
      return;
    }

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

  squashEnemy(enemy, points, msg) {
    this.spawnBurst(enemy.x, enemy.y, COLORS.gold, 8);
    this.showFloatingText(enemy.x, enemy.y-20, msg || '+'+points, msg ? '#FF6B9D' : '#FFD93D');
    if(msg) this.showFloatingText(enemy.x, enemy.y-40, '+'+points, '#FFD93D');
    this.score += points;
    // Squash animation then destroy
    if(enemy.body) enemy.body.setVelocity(0,0);
    this.tweens.add({targets:enemy, scaleY:0.1, scaleX:0.2, alpha:0, duration:300,
      onComplete:()=>{ if(enemy.active) enemy.destroy(); }});
    this.updateHUD();
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
          level:this.currentLevel, hearts:this.hearts, score:this.score, coinCount:this.coinCount, collectedLetters:this.collectedLetters
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
            this.scene.start('WinScene',{score:this.score,coinCount:this.coinCount,collectedLetters:this.collectedLetters});
          });
        }
      });
    }
  }

  // --- GAME OVER ---
  showGameOver() {
    this.gameOver=true;

    // Mario-style death animation: bounce up then fall
    if(this.player && this.player.active) {
      this.player.body.setAllowGravity(false);
      this.player.body.setVelocity(0, 0);
      this.player.setDepth(30);
      this.tweens.add({
        targets: this.player, y: this.player.y - 80, duration: 400, ease:'Quad.easeOut',
        onComplete: () => {
          this.tweens.add({
            targets: this.player, y: GAME_H + 100, duration: 600, ease:'Quad.easeIn',
            onComplete: () => this.showGameOverUI()
          });
        }
      });
    } else {
      this.showGameOverUI();
    }
  }

  showGameOverUI() {
    this.physics.pause();
    const hasCP = this.checkpointReached;
    this.add.rectangle(GAME_W/2,GAME_H/2,GAME_W,GAME_H,0x000000,0.6).setDepth(25).setScrollFactor(0);
    this.add.text(GAME_W/2,GAME_H/2-40,'Ahh! Düştün...',{fontFamily:'Fredoka One, cursive',fontSize:'32px',color:'#ff4757',stroke:'#000',strokeThickness:3}).setOrigin(0.5).setDepth(26).setScrollFactor(0);
    this.add.text(GAME_W/2,GAME_H/2+10, hasCP ? 'Bayraktan devam!' : 'Ama vazgeçme!',{fontFamily:'Fredoka One, cursive',fontSize:'20px',color:'#fff'}).setOrigin(0.5).setDepth(26).setScrollFactor(0);
    const bb=this.add.graphics();bb.fillStyle(COLORS.pink,1);bb.fillRoundedRect(GAME_W/2-90,GAME_H/2+50,180,50,25);bb.setDepth(26).setScrollFactor(0);
    this.add.text(GAME_W/2,GAME_H/2+75,'Tekrar Dene',{fontFamily:'Fredoka One, cursive',fontSize:'22px',color:'#fff'}).setOrigin(0.5).setDepth(26).setScrollFactor(0);
    const z=this.add.zone(GAME_W/2,GAME_H/2+75,180,50).setInteractive({useHandCursor:true}).setDepth(27).setScrollFactor(0);
    z.on('pointerdown',()=>{
      const startData = {level:this.currentLevel, hearts:3, score:hasCP?this.score:0,
        coinCount:hasCP?this.coinCount:0, collectedLetters:this.collectedLetters,
        spawnX: hasCP ? this.checkpointX : null};
      this.scene.start('GameScene', startData);
    });
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
    // Letter progress
    const fullWord = 'SEVİYORUM';
    const letterStr = fullWord.split('').map(c => this.collectedLetters.includes(c) ? c : '·').join(' ');
    this.letterText = this.add.text(W/2, 8, letterStr, {
      fontFamily:'Fredoka One, cursive', fontSize:'10px', color:'#FF6B9D'
    }).setOrigin(0.5,0).setDepth(31).setScrollFactor(0).setAlpha(0.8);
  }

  updateHUD() {
    for(let i=0;i<this.heartIcons.length;i++) this.heartIcons[i].setVisible(i<this.hearts);
    if(this.scoreText) this.scoreText.setText(this.score+'');
    if(this.coinText) this.coinText.setText('x'+this.coinCount);
    if(this.letterText) {
      const fullWord = 'SEVİYORUM';
      this.letterText.setText(fullWord.split('').map(c => this.collectedLetters.includes(c) ? c : '·').join(' '));
    }
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
    // Extra: detect jump press moment for mobile
    const jumpEl = bJ;
    if(jumpEl) {
      jumpEl.addEventListener('touchstart',(e)=>{e.preventDefault();this.mobileJumpJust=true;});
      jumpEl.addEventListener('mousedown',()=>{this.mobileJumpJust=true;});
    }
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

    // --- MARIO-STYLE PHYSICS ---
    const speedMult = this.powerUps.speed > 0 ? 1.5 : 1;
    const maxSpeed = 220 * speedMult;
    const accel = 1200;  // acceleration (px/s²)
    const decel = 800;   // deceleration / friction
    const jumpPower = this.powerUps.speed > 0 ? -700 : -650;

    const left = this.cursors.left.isDown||this.wasd.left.isDown||this.mobileLeft;
    const right = this.cursors.right.isDown||this.wasd.right.isDown||this.mobileRight;
    const jumpPressed = this.cursors.up.isDown||this.wasd.up.isDown||this.wasd.space.isDown||this.mobileJump;
    const jumpJust = Phaser.Input.Keyboard.JustDown(this.cursors.up)||Phaser.Input.Keyboard.JustDown(this.wasd.up)||Phaser.Input.Keyboard.JustDown(this.wasd.space)||this.mobileJumpJust;

    // Momentum: accelerate toward max speed, decelerate with friction
    const dtSec = dt / 1000;
    let vx = this.player.body.velocity.x;
    if(left) {
      vx = Math.max(vx - accel * dtSec, -maxSpeed);
      this.player.setFlipX(true);
    } else if(right) {
      vx = Math.min(vx + accel * dtSec, maxSpeed);
      this.player.setFlipX(false);
    } else {
      // Friction: slide to stop
      if(Math.abs(vx) < decel * dtSec) vx = 0;
      else vx -= Math.sign(vx) * decel * dtSec;
    }
    this.player.setVelocityX(vx);

    // Coyote time
    if(onGround) {
      // Landing detection
      if(!this.wasOnGround) {
        this.landedThisFrame = true;
        // Squash on landing
        this.tweens.add({targets:this.player, scaleY:0.08, scaleX:0.12, duration:60, yoyo:true, ease:'Quad.easeOut'});
        this.spawnDust(this.player.x, this.player.body.bottom);
      }
      this.coyoteTimer = 120;
      this.wasOnGround = true;
    } else {
      this.landedThisFrame = false;
      this.coyoteTimer -= dt;
      this.wasOnGround = false;
    }

    // Jump buffer: remember jump press for 100ms
    if(jumpJust) this.jumpBufferTimer = 100;
    else this.jumpBufferTimer -= dt;
    this.mobileJumpJust = false; // consume mobile jump trigger

    const canJump = onGround || this.coyoteTimer > 0;
    const wantsJump = jumpJust || this.jumpBufferTimer > 0;
    if(wantsJump && canJump){
      this.player.setVelocityY(jumpPower);
      this.coyoteTimer = 0;
      this.jumpBufferTimer = 0;
      // Stretch on jump
      this.tweens.add({targets:this.player, scaleY:0.12, scaleX:0.08, duration:80, yoyo:true, ease:'Quad.easeOut'});
      this.spawnDust(this.player.x, this.player.body.bottom);
      this.jumpHeld = true;
      this.mobileJump = false;
      this.mobileJumpJust = false;
    }

    // Variable jump height
    if(!jumpPressed) this.jumpHeld = false;
    if(this.player.body.velocity.y < 0 && !this.jumpHeld) {
      this.player.body.velocity.y += 30;
    }

    // Fast fall
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

    // Enemy AI – patrol back and forth within range
    this.enemies.getChildren().forEach(e=>{
      if(!e.active||!e.body) return;
      // Turn at walls
      if(e.body.blocked.left) e.setVelocityX(Math.abs(e.patrolSpeed));
      else if(e.body.blocked.right) e.setVelocityX(-Math.abs(e.patrolSpeed));
      // Turn at patrol range edges
      if(e.x < e.patrolOrigin - e.patrolRange) e.setVelocityX(Math.abs(e.patrolSpeed));
      else if(e.x > e.patrolOrigin + e.patrolRange) e.setVelocityX(-Math.abs(e.patrolSpeed));
      e.setFlipX(e.body.velocity.x<0);
    });

    // Moving platform gfx sync
    this.movingPlatforms.getChildren().forEach(mp=>{
      if(mp.mpGfx) mp.mpGfx.setPosition(mp.x, mp.y);
    });

    // Combo timer decay
    if(this.comboTimer > 0) { this.comboTimer -= dt; if(this.comboTimer <= 0) this.stompCombo = 0; }

    // Checkpoint detection
    if(!this.checkpointReached && this.checkpointX > 0 && this.player.x >= this.checkpointX) {
      this.checkpointReached = true;
      // Animate flag: turn pink
      if(this.cpFlag) {
        this.cpFlag.clear();
        this.cpFlag.fillStyle(COLORS.pink, 1);
        this.cpFlag.fillTriangle(this.cpFlagX+5, GAME_H-T-70, this.cpFlagX+5, GAME_H-T-45, this.cpFlagX+30, GAME_H-T-57);
        this.showFloatingText(this.cpFlagX+15, GAME_H-T-85, 'Checkpoint!', '#55efc4');
        this.spawnBurst(this.cpFlagX+15, GAME_H-T-60, COLORS.mint, 8);
      }
    }

    // Crush reactions: only when close, with long cooldown
    if(this.crush && this.crush.active && this.player.active) {
      const distToCrush = this.crush.x - this.player.x;
      this.crushReactionTimer -= dt;
      if(distToCrush < 400 && distToCrush > 0 && this.crushReactionTimer <= 0) {
        this.crushReactionTimer = 5000;  // 5 saniye arayla, spam yok
        const msgs = ['Gel!','Buradayım!','Seni bekliyorum!','Hadi!','Çabuk ol!'];
        const bub = this.add.graphics(); bub.setDepth(20);
        bub.fillStyle(0xffffff,0.9); bub.fillRoundedRect(-40,-20,80,26,8);
        bub.fillTriangle(-4,6,4,6,0,13);
        bub.setPosition(this.crush.x, this.crush.y-50);
        const ct = this.add.text(this.crush.x, this.crush.y-54, Phaser.Math.RND.pick(msgs), {
          fontFamily:'Fredoka One, cursive',fontSize:'10px',color:'#C44569',align:'center'
        }).setOrigin(0.5).setDepth(21);
        bub.setScale(0); ct.setScale(0);
        this.tweens.add({targets:[bub,ct],scaleX:1,scaleY:1,duration:200,ease:'Back.easeOut'});
        this.time.delayedCall(2000,()=>{
          this.tweens.add({targets:[bub,ct],alpha:0,y:'-=15',duration:400,onComplete:()=>{bub.destroy();ct.destroy();}});
        });
      }
    }

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
    this.collectedLetters = data.collectedLetters || [];

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
              coinCount:this.coinCount, purchasedItems:this.purchasedItems,
              collectedLetters:this.collectedLetters
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
        coinCount: this.coinCount, purchasedItems: this.purchasedItems,
        collectedLetters: this.collectedLetters
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
    const letters = data.collectedLetters || [];
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
    const title=this.add.text(W/2,50,"İyi ki doğdun\nafra!",{fontFamily:'Fredoka One, cursive',fontSize:'36px',color:'#fff',align:'center',stroke:'#C44569',strokeThickness:6,lineSpacing:4,shadow:{offsetX:3,offsetY:3,color:'#00000044',blur:10,fill:true}}).setOrigin(0.5).setDepth(10);
    this.tweens.add({targets:title,scaleX:1.05,scaleY:1.05,duration:1200,yoyo:true,repeat:-1,ease:'Sine.easeInOut'});
    // Abla kardeş fotoğrafı
    const sisImg = this.add.image(W/2, 175, 'sisters').setDepth(10);
    // Fotoğrafı küçült ve yuvarlak çerçeve yap
    const imgScale = Math.min(140 / sisImg.width, 100 / sisImg.height);
    sisImg.setScale(imgScale);
    // Pembe çerçeve
    const frame = this.add.graphics(); frame.setDepth(9);
    frame.lineStyle(4, COLORS.pink, 1);
    frame.strokeRoundedRect(W/2-72, 125, 144, 100, 12);
    // Hafif sallanma
    this.tweens.add({targets:[sisImg,frame],y:'+=5',duration:1500,yoyo:true,repeat:-1,ease:'Sine.easeInOut'});
    // Hearts
    this.time.addEvent({delay:700,loop:true,callback:()=>{
      const hg=this.add.graphics();hg.fillStyle(COLORS.red,0.9);hg.beginPath();hg.arc(-3,-2,3,Math.PI,0,false);hg.arc(3,-2,3,Math.PI,0,false);hg.lineTo(0,5);hg.closePath();hg.fillPath();
      hg.setPosition(W/2+Phaser.Math.Between(-40,40),130);hg.setDepth(11);
      this.tweens.add({targets:hg,y:100,alpha:0,scaleX:1.5,scaleY:1.5,duration:1500,onComplete:()=>hg.destroy()});
    }});
    // Message - birebir orijinal metin
    this.add.text(W/2,280,'Sen bu dünyadaki en güzel hediyesin,\nNice mutlu yıllara\n\nÖmer faruğu boşver de\nkeşke biz bi kavuşabilseydik\nabla kardeş\n\nSeni çok seviyorum',{fontFamily:'Fredoka One, cursive',fontSize:'13px',color:'#fff',align:'center',lineSpacing:5,shadow:{offsetX:1,offsetY:1,color:'#00000033',blur:4,fill:true}}).setOrigin(0.5).setDepth(10);
    // Stats
    if(score>0||coins>0){
      const statsLine = 'Skor: '+score+(coins>0?'  |  Coin: '+coins:'');
      this.add.text(W/2,390,statsLine,{fontFamily:'Fredoka One, cursive',fontSize:'15px',color:'#FFD93D'}).setOrigin(0.5).setDepth(10);
      // Show collected love word
      if(letters.length > 0) {
        const fullWord = 'SEVİYORUM';
        const wordStr = fullWord.split('').map(c => letters.includes(c) ? c : '·').join(' ');
        this.add.text(W/2, 410, '💌 ' + wordStr, {fontFamily:'Fredoka One, cursive',fontSize:'14px',color:'#FF6B9D'}).setOrigin(0.5).setDepth(10);
      }
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
