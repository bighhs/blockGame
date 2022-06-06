export function mapWaterHelper(x,y){
    // basic block size is 150*150 ;for every block it contain A waterinstant 
    const blockSize = 150;

    let X = Math.floor(x / blockSize);
    let Y = Math.floor(y / blockSize);

    let perm = new Array(512);
    let noise;

    async function seed(seed){
        let getNoiseHelper = await import('./perlinNoise.js').then(({ getNoiseHelper }) => {return getNoiseHelper});
        noise = getNoiseHelper();
        noise.seed(seed);
        perm = noise.perm;
        return createWaterMap();
    }

    function getBeginPoints(){
        let pointsArray = new Array();
        let randomNumX = perm[(X*2+Y) & 511] / 255;
        let randomNumY = perm[(Y*2+X) & 511] / 255;
        let midX = ((2*randomNumX - 1)*(2*randomNumX - 1)*(2*randomNumX - 1) + 1)/2;
        let midY = ((2*randomNumY - 1)*(2*randomNumY - 1)*(2*randomNumY - 1) + 1)/2;
        let xI = Math.floor((blockSize-1) * midX);
        let yI = Math.floor((blockSize-1) * midY);
        pointsArray.push([ xI, yI]);
        return pointsArray;
    }

    function createWaterMap(){
        let map = new Array(),
            waterMap = new Array();
        let Xbegin = X*blockSize,
            Ybegin = Y*blockSize;
        for(let j=Ybegin;j<Ybegin+blockSize;j++){
            for(let i=Xbegin;i<Xbegin+blockSize;i++){
                let num = noise.octavePerlin(i, j, 30, 2, 10)
                map.push(num);

                if(num<0.2) {waterMap.push(1);}
                else {waterMap.push(0);}
            }
        }

        let beginPoints = getBeginPoints();
        flowLoop(beginPoints[0],map,waterMap);
        return {waterMap,map};
    }

    // help water flowing from height to low
    function flowLoop(beginPoint,heightMap,waterMap){

        let lowArray = new Array(),
            location = beginPoint[1]*blockSize + beginPoint[0];
        waterMap[location] = 1;

        if(beginPoint[1]!==0 && heightMap[location]>=heightMap[location - blockSize]){
            lowArray.push([beginPoint[0],beginPoint[1]-1]);
        }
        if(beginPoint[1]!==149 && heightMap[location]>=heightMap[location + blockSize]){
            lowArray.push([beginPoint[0],beginPoint[1]+1]);
        }
        if(beginPoint[0]!==0 && heightMap[location]>=heightMap[location - 1]){
            lowArray.push([beginPoint[0]-1,beginPoint[1]]);
        }
        if(beginPoint[0]!==149 && heightMap[location]>=heightMap[location + 1]){
            lowArray.push([beginPoint[0]+1,beginPoint[1]]);
        }
        if(lowArray.length !== 0){
            let flowPoint = lowArray[perm[location & 511] % lowArray.length];
            flowLoop(flowPoint,heightMap,waterMap);            
        }else{
            return;
        }return;

    }

    return {
        seed,
        createWaterMap
    }
}