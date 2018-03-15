var Client = function(blueprint,override) {
  this.merge(this.baseParameters);
  this.setup(blueprint.sprite,blueprint);
  this.merge(override);
};
Client.prototype = new Sprite();
Client.prototype.type = OBJECT_ENEMY;
Client.prototype.baseParameters = { A: 0, B: 0, C: 0, D: 0,
                                   E: 0, F: 0, G: 0, H: 0,
                                   t: 0, reloadTime: 0.75,
                                   reload: 0 };
Client.prototype.step = function(dt) {
  this.t += dt;

  this.vx = this.A + this.B * Math.sin(this.C * this.t + this.D);
  this.vy = this.E + this.F * Math.sin(this.G * this.t + this.H);

  this.x += this.vx * dt;
  this.y += this.vy * dt;

  var collision = this.board.collide(this,OBJECT_PLAYER);
  if(collision) {
    collision.hit(this.damage);
    this.board.remove(this);
  }

  if(Math.random() < 0.01 && this.reload <= 0) {
    this.reload = this.reloadTime;
    if(this.missiles == 2) {
      this.board.add(new EnemyMissile(this.x+this.w-2,this.y+this.h));
      this.board.add(new EnemyMissile(this.x+2,this.y+this.h));
    } else {
      this.board.add(new EnemyMissile(this.x+this.w/2,this.y+this.h));
    }

  }
  this.reload-=dt;

  if(this.y > Game.height ||
     this.x < -this.w ||
     this.x > Game.width) {
       this.board.remove(this);
  }
};
Client.prototype.hit = function(damage) {
  this.health -= damage;
  if(this.health <=0) {
    if(this.board.remove(this)) {
      Game.points += this.points || 100;
      this.board.add(new Explosion(this.x + this.w/2,
                                   this.y + this.h/2));
    }
  }
};