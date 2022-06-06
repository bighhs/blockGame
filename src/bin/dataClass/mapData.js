class mapDataClass{
    constructor(mapSeed){
        if(mapSeed !== undefined){
            if(mapSeed > 1||mapSeed < 0){
                if(mapSeed<0) mapSeed = -mapSeed;
                let low8 = mapSeed & 255;
                if(low8 < 8) low8 = (mapSeed & (65536 - 255)) >> 8;
                this.seed = (low8) / 255;
            }
        }else this.seed = Math.random();
        this.terrainMark = { ground: 1, river: 2, wall: 3, treasure: 4};
        this.loadRange = 50;//base on the max_visible_area_range which value is 80
        // auto created building data
        this.mapMemery = new Array(this.loadRange);
        for(let i=0;i<this.loadRange;i++){
            this.mapMemery[i] = new Array(this.loadRange);
        }
        this.leftDown = [0,0];
        this.rightTop = [49,49];
        
    }
}