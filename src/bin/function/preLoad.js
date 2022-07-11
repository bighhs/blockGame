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
        seed = seed===undefined?0.66523:seed;
        let blockArray = new Array();

        async function seedHelper(...setting){
            let disk = poissonDiskHandler(...setting);
            let grad = await disk.seed(seed);
            return disk.gradExchange(grad).objectRes;
        }
        // get around nine block
        // 未考虑退化情况，也就是刚好能被150整除，后续更新
        let res = await seedHelper(x-150,y+150,{minSize:40,blockSize:blockSize});
        blockArray.push({res: res,locate:[-1,1]});
        res = await seedHelper(x,y+150,{minSize:40,blockSize:blockSize});
        blockArray.push({res: res,locate:[0,1]});
        res = await seedHelper(x+150,y+150,{minSize:40,blockSize:blockSize});
        blockArray.push({res: res,locate:[1,1]});
        res = await seedHelper(x-150,y,{minSize:40,blockSize:blockSize});
        blockArray.push({res: res,locate:[-1,0]});
        res = await seedHelper(x,y,{minSize:40,blockSize:blockSize});
        blockArray.push({res: res,locate:[0,0]});
        res = await seedHelper(x+150,y,{minSize:40,blockSize:blockSize});
        blockArray.push({res: res,locate:[1,0]});
        res = await seedHelper(x-150,y-150,{minSize:40,blockSize:blockSize});
        blockArray.push({res: res,locate:[-1,-1]});
        res = await seedHelper(x,y-150,{minSize:40,blockSize:blockSize});
        blockArray.push({res: res,locate:[0,-1]});
        res = await seedHelper(x+150,y-150,{minSize:40,blockSize:blockSize});
        blockArray.push({res: res,locate:[1,-1]});

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

    function coloringCell(Vresult){
        // this function will markdown the cell that has been colored by the real location
        let x0 = (x % 150)*150,y0 = (y % 150)*150;
        let cellResult = [];
        let loadCells = Vresult.cells.forEach((cell)=>{
            if(cell.halfedges.length!==0){
                let xc = cell.site.x + x0;
                let yc = cell.site.y + y0;
                
            }
        })
        
    }

    return {
        poissonInit,
        getherPoint,
        voronoiSlice
    }
}