import { AcGameObject } from '/static/js/ac_game_object/base.js'
import {Controller} from '/static/js/controller/base.js'

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
    }

    start() {

    }

    update() {  //update中不直接写逻辑，将逻辑封装成函数，在这里调用
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