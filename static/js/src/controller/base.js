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


