import { AcGameObject } from '/static/js/src/ac_game_object/base.js'
import {Controller} from '/static/js/src/controller/base.js'

class GameMap extends AcGameObject{
    constructor(root) {
        super();
        
        this.root = root;
        //使用jquery获取canvas对象（本质就是一块画布）
        this.$canvas = $('<canvas width="1280" height="720" tabindex=0></canvas>'); 
        this.ctx = this.$canvas[0].getContext('2d');
        this.root.$kof.append(this.$canvas);
        this.$canvas.focus();  //聚焦，能够接收键盘输入

        this.controller = new Controller(this.$canvas);

        this.root.$kof.append($(`<div class="kof-head">
        <div class="kof-head-hp-0"><div><div></div></div></div>
        <div class="kof-head-timer">60</div>
        <div class="kof-head-hp-1"><div><div></div></div></div>
        </div>`))

        this.time_left = 60000;   //ms
        this.$timer = this.root.$kof.find('.kof-head-timer');

    }

    start() {

    }

    update() {  //update中不直接写逻辑，将逻辑封装成函数，在这里调用
        this.time_left -= this.timedelta;
        if (this.time_left <= 0) {
            this.time_left = 0;

            let [a, b] = this.root.players;
            if (a.status != 6 && b.status != 6) {
                a.status = b.status = 6;
                a.frame_current_cnt = b.frame_current_cnt = 0;
                a.vx = b.vx = 0;
            }
        }


        this.$timer.text(parseInt(this.time_left / 1000));

        this.render();  
    }

    render() {
        //console.log(this.ctx.canvas.width);
        // this.ctx.fillStyle = 'black';
        //this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    }
}

export {
    GameMap
}


