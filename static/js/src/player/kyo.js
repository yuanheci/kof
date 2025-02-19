import { Player } from '/static/js/src/player/base.js'
import { GIF } from '/static/js/src/utils/gif.js'

class Kyo extends Player{
    constructor(root, info) {
        super(root, info);
        
        this.init_animations();
    }

    init_animations() {
        let offsets = [0, -22, -22, -125, 0, 0, 0];
        for (let i = 0; i < 7; i++){  //7个gif动作
            let gif = GIF();
            gif.load(`/static/images/player/kyo/${i}.gif`);
            this.animations.set(i, {
                gif: gif,
                frame_cnt: 0,   //这个gif一共有多少帧(总图片数)
                frame_rate: 5,  //每5帧过渡一次
                offset_y: offsets[i],    //y方向偏移量
                loaded: false,  //是否加载完成（图片加载有延时）
                scale: 2,       //放大多少倍
            });

            gif.onload = () => {
                let obj = this.animations.get(i);
                obj.frame_cnt = gif.frames.length;
                obj.loaded = true;
            }
        }
    }
}

export {
    Kyo
}


