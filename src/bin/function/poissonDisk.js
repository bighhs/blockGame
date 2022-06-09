/***********************************************************************
       poissonDisk function that make random point with a seed
       固定的种子在固定的加载区块（函数中为blockSize计算的区块位置）生成固定的泊松采样点，
       使得有规律的生成随机点

usage: let poisson = poissonDiskHandler(nowLocation);
       let grad = await seed(randomSeed);  seed between 0-1
       let pointArray = poisson.gradExchange(grad);

       author: chen_JunYang
************************************************************************/
export function poissonDiskHandler(x,y){

    const blockSize = 150;

    let X = Math.floor(x / blockSize);
    let Y = Math.floor(y / blockSize);
    let perm = new Array(512);
    let mapSize = blockSize;
    let minSize = 20;

    class grad2D{
        // usually they are square,then accept two arguement;
        constructor(minSize,mapSize,X,Y){
            this.size = minSize / Math.sqrt(2);
            this.min = minSize;
            this.gradNum = Math.floor(mapSize / this.size) + 1;
            this.grad = new Array(this.gradNum);
            this.handleArray = new Array();
            this.X = X;
            this.Y = Y;
            this.getHandleTime = 0;
            for(let i=0;i<this.gradNum;i++){
                this.grad[i] = new Array(this.gradNum);
                this.grad[i].fill(undefined);
            }
            this.tryTime = 30;
        }
        setPoint(point){
            let x=point[0], y=point[1];
            let xIndex = Math.floor(x/this.size);
            let yIndex = Math.floor(y/this.size);
            if(this.grad[yIndex][xIndex] === undefined){
                this.grad[yIndex][xIndex] = [x,y];
                return true;
            }
            return false;
        }
        getPoint(xIndex,yIndex){
            if(this.grad[yIndex][xIndex] === undefined){
                return false;
            }
            return this.grad[yIndex][xIndex];
        }
        setHandle(point){
            this.handleArray.push(point);
        }
        getHandle(perm){
            this.getHandleTime += 1;
            let randomIndex = Math.floor((perm[ (this.getHandleTime*this.getHandleTime + this.X + this.Y) & 511 ] / 255) * this.handleArray.length);
            if(randomIndex === this.handleArray.length){
                randomIndex -= 1;
            }
            return {'index': randomIndex, 'point': this.handleArray[randomIndex]};
        }
        removeHandle(index){
            this.handleArray.splice(index,1);
        }
        // point : [ x, y]
        isGood(point){
            let xIndex = Math.floor(point[0]/this.size);
            let yIndex = Math.floor(point[1]/this.size);
            function checkPoint(point1,xCheck,yCheck){
                if(xCheck<0||xCheck>grad.gradNum-1||yCheck<0||yCheck>grad.gradNum-1){
                    return true;
                }
                let point2 = grad.getPoint(xCheck,yCheck);
                if(point2 === false){
                    return true;
                } 
                let dX = Math.abs(point1[0] - point2[0]);
                let dY = Math.abs(point1[1] - point2[1]);
                let distance = Math.sqrt(dX*dX + dY*dY);
                if(distance > grad.min){
                    return true;
                }else{
                    return false;
                }
            }
            if(this.getPoint(xIndex,yIndex)){
                return false;
            }
            // check nearby 20 block
            if(checkPoint(point,xIndex-1,yIndex-2)&&checkPoint(point,xIndex,yIndex-2)&&checkPoint(point,xIndex+1,yIndex-2)){
            if(checkPoint(point,xIndex-2,yIndex-1)&&checkPoint(point,xIndex-1,yIndex-1)&&checkPoint(point,xIndex,yIndex-1)&&checkPoint(point,xIndex+1,yIndex-1)&&checkPoint(point,xIndex+2,yIndex-1)){
            if(checkPoint(point,xIndex-2,yIndex)&&checkPoint(point,xIndex-1,yIndex)&&checkPoint(point,xIndex+1,yIndex)&&checkPoint(point,xIndex+2,yIndex)){
            if(checkPoint(point,xIndex-2,yIndex+1)&&checkPoint(point,xIndex-1,yIndex+1)&&checkPoint(point,xIndex,yIndex+1)&&checkPoint(point,xIndex+1,yIndex+1)&&checkPoint(point,xIndex+2,yIndex+1)){
            if(checkPoint(point,xIndex-1,yIndex+2)&&checkPoint(point,xIndex,yIndex+2)&&checkPoint(point,xIndex+1,yIndex+2)){
                return true;
            }}}}}    
        }
    }

    async function seed(seed){
        let getNoiseHelper = await import('./perlinNoise.js').then(({ getNoiseHelper }) => {return getNoiseHelper});
        let noise = getNoiseHelper();
        noise.seed(seed);
        perm = noise.perm;
        return poissonDisk();
    }

    let grad = new grad2D(minSize,mapSize,X,Y);

    function getFirstPoint(){
        let randomX = perm[(grad.X*2 + grad.Y) & 511] / 255;
        let randomY = perm[(grad.Y*2 + grad.X) & 511] / 255;
        let xI = mapSize * randomX;
        let yI = mapSize * randomY;
        return [ xI, yI];
    }

    function getRandomPoint(hash,point){
        let angle = 2 * hash * Math.PI;
        let distance = (1 + hash) * grad.min;
        let newX = point[0] + distance * Math.cos(angle);
        let newY = point[1] + distance * Math.sin(angle);
        if(newX<0||newY<0||newX>mapSize||newY>mapSize){
            return false
        }return [ newX, newY];
    }

    function poissonDisk(){
        let firstPoint = getFirstPoint();
        grad.setPoint(firstPoint);
        grad.setHandle(firstPoint);
        do{
            let handleInstance = grad.getHandle(perm);
            let handleIndex = handleInstance.index;
            let handlePoint = handleInstance.point;
            let handleHash = handlePoint[0] + handlePoint[1] + handleIndex;
            let time;
            for(time=0;time<grad.tryTime;time++){
                let hash = perm[(handleHash + time*time) & 511] / 255;
                let randomPoint = getRandomPoint(hash,handlePoint);
                if(randomPoint === false){
                    continue;
                }
                if(grad.isGood(randomPoint)){
                    grad.setPoint(randomPoint);
                    grad.setHandle(randomPoint);
                    break;
                }   
            }
            if(time === grad.tryTime){
                grad.removeHandle(handleIndex);
            }
        }while(grad.handleArray.length !== 0);
        return grad;
    }
    // the blockSize of grad must bigger than the basic size 
    function gradExchange(grad){
        let size = 150;
        let test = new Array(size*size);
        test.fill(0);
        let res = new Array();
        for(let i=0;i<grad.gradNum;i++){
            for(let j=0;j<grad.gradNum;j++){
                let point = grad.getPoint(j,i);
                if(point){
                    res.push(point);
                    let xI = Math.round(point[0]);
                    let yI = Math.round(point[1]);
                    test[xI + size*yI] = 1;
                }
            }
        }
        return {res,test};
    }

    return {
        seed,
        poissonDisk,
        gradExchange,
    }
}