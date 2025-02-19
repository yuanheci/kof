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


