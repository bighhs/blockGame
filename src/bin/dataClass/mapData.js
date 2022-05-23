class mapDataClass{
    constructor(mapSeed){
        this.seed = mapSeed;
        this.terrainMark = { ground: 1, river: 2, wall: 3, treasure: 4};
        this.hotloadRange = 82;//base on the max_visible_area_range which value is 80
        // auto created building data
    }
}