/*****************************************************
    预加载（3*3）
    强加载中心区块的voronoi图，其他八块边界是不正确的，唯有中心的边界正确，再根据坐标截取中间区块返回，
    同时会缓存大区块，在强加载区块变换时总有3个弱加载区块可以重复利用
*****************************************************/

import { poissonDiskHandler } from './poissonDisk.js'
import { Voronoi } from './voronoi.js'

export function preLoadHelper(x,y){
    let blockSize = 150;

    async function poissonInit(seed){
        let grad = await disk.seed(0.66523);
        let blockArray = new Array();
        // get around nine block
        let disk = poissonDiskHandler(x-150,y+150,{minSize:40,blockSize:blockSize});
        let poissonArray = {res:disk.gradExchange(grad).objectRes,locate:[-1,1]};
        blockArray.push(poissonArray);
        disk = poissonDiskHandler(x,y+150,{minSize:40,blockSize:blockSize});
        poissonArray = {res:disk.gradExchange(grad).objectRes,locate:[0,1]};
        blockArray.push(poissonArray);
        disk = poissonDiskHandler(x+150,y+150,{minSize:40,blockSize:blockSize});
        poissonArray = {res:disk.gradExchange(grad).objectRes,locate:[1,1]};
        blockArray.push(poissonArray);
        disk = poissonDiskHandler(x-150,y,{minSize:40,blockSize:blockSize});
        poissonArray = {res:disk.gradExchange(grad).objectRes,locate:[-1,0]};
        blockArray.push(poissonArray);
        disk = poissonDiskHandler(x,y,{minSize:40,blockSize:blockSize});
        poissonArray = {res:disk.gradExchange(grad).objectRes,locate:[0,0]};
        blockArray.push(poissonArray);
        disk = poissonDiskHandler(x+150,y,{minSize:40,blockSize:blockSize});
        poissonArray = {res:disk.gradExchange(grad).objectRes,locate:[1,0]};
        blockArray.push(poissonArray);
        disk = poissonDiskHandler(x-150,y-150,{minSize:40,blockSize:blockSize});
        poissonArray = {res:disk.gradExchange(grad).objectRes,locate:[-1,-1]};
        blockArray.push(poissonArray);
        disk = poissonDiskHandler(x,y-150,{minSize:40,blockSize:blockSize});
        poissonArray = {res:disk.gradExchange(grad).objectRes,locate:[0,-1]};
        blockArray.push(poissonArray);
        disk = poissonDiskHandler(x+150,y-150,{minSize:40,blockSize:blockSize});
        poissonArray = {res:disk.gradExchange(grad).objectRes,locate:[1,-1]};
        blockArray.push(poissonArray);

        return blockArray;
    }

    function getherPoint(blockArray){
        // preLoad size: 450 * 450 for 150 * 150 each block
        let bigBlock = new Array();
        let size = 150;
        for(let i=0;i<blockArray.length;i++){
            for(let j=0;j<blockArray[i].res.length;j++){
                bigBlock.push({
                        x:(blockArray[i].res[j].x) + blockArray[i].locate[0]*size,
                        y:(blockArray[i].res[j].y) + blockArray[i].locate[1]*size
                    })
            }
        }

        return bigBlock;
    }

    function voronoiSlice(bigBlock){
        let bbox = { xl: -150, xr: 300, yt: -150, yb: 300 };
        let voronoi = new Voronoi();
        let Vresult = voronoi.compute(bigBlock,bbox);

        return Vresult;
    }

    return {
        seed,
        getherPoint
    }
}