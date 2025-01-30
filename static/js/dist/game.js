let AC_GAME_OBJECTS = [];

class AcGameObject {
    constructor() {
        AC_GAME_OBJECTS.push(this);

        this.timedelta = 0;
        this.has_call_start = false;
    }

    start() {  //初始执行一次
        
    }

    update() {  //每一帧执行一次(除了第一帧)

    }

    destroy() {   //删除当前对象
        for (let i in AC_GAME_OBJECTS) {
            if (AC_GAME_OBJECTS[i] == this) {
                AC_GAME_OBJECTS.splice(i, 1);
                break;
            }
        }
    }
}

let last_timestamp;

let AC_GAME_OBJECTS_FRAME = (timestamp) => {   //每一帧的操作
    for (let obj of AC_GAME_OBJECTS) {
        if (!obj.has_call_start) {
            obj.start();
            obj.has_call_start = true;
        } else {
            obj.timedelta = timestamp - last_timestamp;
            obj.update();
        }
    }
    last_timestamp = timestamp;
    requestAnimationFrame(AC_GAME_OBJECTS_FRAME);
}

requestAnimationFrame(AC_GAME_OBJECTS_FRAME);

export {
    AcGameObject
}


import { GameMap } from '/static/js/src/game_map/base.js'
import { Kyo } from '/static/js/src/player/kyo.js'

//主类，这个类才是直接被引入到html中的，所以子类要在这里引入并创建实例
class KOF {
    constructor(id) {
        this.$kof = $('#' + id);
        console.log(this.$kof);

        this.game_map = new GameMap(this);
        this.players = [
            new Kyo(this, {
                id: 0,
                x: 200,
                y: 0,
                width: 120,
                height: 200,
                color: 'blue',
            }),
            new Kyo(this, {
                id: 1,
                x: 900,
                y: 0,
                width: 120,
                height: 200,
                color: 'red',
            })
        ];
        
    }   
}

export {
    KOF
}


class Controller {
    constructor($canvas) {
        this.$canvas = $canvas;

        this.pressed_keys = new Set();
        this.start();
    }

    start() {
        this.$canvas.on('keydown', (e) =>{  //如果不用匿名函数，那么这个函数绑定的this是$canvas
            this.pressed_keys.add(e.key);   //加到set中，set可以判重
        })

        this.$canvas.on('keyup', (e) => {
            this.pressed_keys.delete(e.key);
        })
    }
}

export {
    Controller
}


class Player extends AcGameObject {
    constructor(root, info) { //root，便于索引地图上的每一个元素
        super();

        this.root = root;
        this.id = info.id;
        this.x = info.x;   //左上顶点的坐标(x,y)
        this.y = info.y;
        this.width = info.width;
        this.height = info.height;
        this.color = info.color;

        this.direction = 1;  //1--右   -1---左

        this.vx = 0;
        this.vy = 0;
        
        this.speedx = 400;   //水平速度
        this.speedy = -1000;  //跳起的初始速度

        this.gravity = 40;

        this.ctx = this.root.game_map.ctx;
        this.pressed_keys = this.root.game_map.controller.pressed_keys;

        this.status = 3;  //0: idle, 1: 向前, 2: 向后, 3: 跳跃, 4: 攻击，5: 被打， 6: 死亡
        this.animations = new Map();

        this.frame_current_cnt = 0;

        this.hp = 100;
        //find，在后代中查找
        this.$hp = this.root.$kof.find(`.kof-head-hp-${this.id}>div`);  //外层--红色
        this.$hp_div = this.$hp.find('div');   //里层--绿色
    }   

    start() {

    }

    update_control() {
        let w, a, d, space;
        if (this.id === 0) {
            w = this.pressed_keys.has('w');
            a = this.pressed_keys.has('a');
            d = this.pressed_keys.has('d');
            space = this.pressed_keys.has(' ');
        } else {
            w = this.pressed_keys.has('ArrowUp');
            a = this.pressed_keys.has('ArrowLeft');
            d = this.pressed_keys.has('ArrowRight');
            space = this.pressed_keys.has('Enter');
        }

        if (this.status === 0 || this.status === 1) {
            if (space) {
                this.status = 4;
                this.vx = 0;
                this.frame_current_cnt = 0;
            }
            else if (w) {
                if (d) {
                    this.vx = this.speedx;
                } else if (a) {
                    this.vx = -this.speedx;
                } else {
                    this.vx = 0;
                }
                this.vy = this.speedy;
                this.status = 3;
                this.frame_current_cnt = 0;
            } else if (d) {
                this.vx = this.speedx;
                this.status = 1;
            } else if (a) {
                this.vx = -this.speedx;
                this.status = 1;
            } else {
                this.vx = 0;
                this.status = 0;
            }
        }
    }

    update_move() {
        this.vy += this.gravity;   

        this.x += this.vx * this.timedelta / 1000;
        this.y += this.vy * this.timedelta / 1000;

        if (this.y > 450) {
            this.y = 450;
            this.vy = 0;
            if(this.status === 3) this.status = 0;
        }

        if (this.x < 0) {
            this.x = 0;
        } else if (this.x + this.width > this.root.game_map.$canvas.width()) {
            this.x = this.root.game_map.$canvas.width() - this.width;
        }
    }

    update_direction() {
        if (this.status === 6) return;

        let players = this.root.players;
        if (players[0] && players[1]) {
            let me = this, you = players[1 - this.id];
            if (me.x < you.x) me.direction = 1;
            else me.direction = -1;
        }
    }

    is_attack() {
        if (this.status === 6) return;
        this.status = 5;
        this.frame_current_cnt = 0;

        this.hp = Math.max(this.hp - 20, 0);

        this.$hp_div.animate({   //里面的div(绿色)血条减少的渐变效果
            width: this.$hp.parent().width() * this.hp / 100,
        }, 300);
        this.$hp.animate({   //外面的div(红色)的渐变效果
            width: this.$hp.parent().width() * this.hp / 100
        }, 600);

        if (this.hp <= 0) {
            this.status = 6;
            this.hp = 0;
            this.vx = 0;
        }
    }

    is_collision(r1, r2) {
        if (Math.max(r1.x1, r2.x1) > Math.min(r1.x2, r2.x2)) {
            return false;
        }
        if (Math.max(r1.y1, r2.y1) > Math.min(r1.y2, r2.y2)) {
            return false;
        }
        return true;
    }

    update_attack() {
        //根据测试得到，在攻击动作的第18帧去进行判断检测
        if (this.status === 4 && this.frame_current_cnt === 18) {
            let me = this, you = this.root.players[1 - this.id];
            let r1;
            if (this.direction > 0) {
                r1 = {   //(x1, y1)为矩形左上角坐标，(x2, y2)为右下角坐标，把挥拳的矩形提取出来用于判断
                    x1: me.x + 120,
                    y1: me.y + 40,
                    x2: me.x + 120 + 100,
                    y2: me.y + 40 + 20,
                };
            } else {
                r1 = {
                    x1: me.x + me.width - 120 - 100,
                    y1: me.y + 40,
                    x2: me.x + me.width - 120 - 100 + 100,
                    y2: me.y + 40 + 20,
                };
            }
            
            let r2 = {
                x1: you.x,
                y1: you.y,
                x2: you.x + you.width,
                y2: you.y + you.height,
            }

            if (this.is_collision(r1, r2)) {
                you.is_attack();
            }

        }

    }

    update() {
        this.update_control();
        this.update_move();
        this.update_direction();
        this.update_attack();

        this.render();
    }

    render() {   //渲染
        //碰撞检测矩形
        // this.ctx.fillStyle = 'blue';
        // this.ctx.fillRect(this.x, this.y, this.width, this.height);

        // if (this.direction > 0) {
        //     this.ctx.fillStyle = 'red';
        //     this.ctx.fillRect(this.x + 120, this.y + 40, 100, 20);
        // } else {
        //     this.ctx.fillStyle = 'red';
        //     this.ctx.fillRect(this.x + this.width - 120 - 100, this.y + 40, 100, 20);
        // }

        let status = this.status;
        if (this.status === 1 && this.direction * this.vx < 0) status = 2;

        let obj = this.animations.get(status);
        if (obj && obj.loaded) {   //已经被加载出来了
            if (this.direction > 0) {
                let k = parseInt(this.frame_current_cnt / obj.frame_rate) % obj.frame_cnt;
                let image = obj.gif.frames[k].image;
                this.ctx.drawImage(image, this.x, this.y + obj.offset_y, image.width * obj.scale, image.height * obj.scale);
            } else {   //变换坐标系的一系列操作---上网查资料
                this.ctx.save(); 
                this.ctx.scale(-1, 1);
                this.ctx.translate(-this.root.game_map.$canvas.width(), 0);

                let k = parseInt(this.frame_current_cnt / obj.frame_rate) % obj.frame_cnt;
                let image = obj.gif.frames[k].image;
                this.ctx.drawImage(image, this.root.game_map.$canvas.width() - this.x - this.width, this.y + obj.offset_y, image.width * obj.scale, image.height * obj.scale);

                this.ctx.restore();
            }
        }
        
        if (this.status === 4 || this.status === 5 || this.status === 6){
            if (this.frame_current_cnt === obj.frame_rate * (obj.frame_cnt - 1)) {
                if (this.status === 6) {
                    this.frame_current_cnt--;
                }
                else this.status = 0;
            }
        }
        this.frame_current_cnt++;
    }
}

export {
    Player
}


import { GIF } from '/static/js/src/utils/gif.js'


