<template>
    <div class="mainContent">
        <div class="gameWindow" ref="gameWindow"></div>
        <div class="gameBar"></div>
        <div class="msgWindow"></div>
        <div class="checkMap">
            <canvas ref="canvas" width="700" height="700"></canvas>
        </div>
    </div>
</template>
<script>
import * as echarts from 'echarts'

import { poissonDiskHandler } from '../bin/function/poissonDisk'
import { getDelaunayHelper } from '../bin/function/delaunay'
import { Voronoi } from '../bin/function/voronoi'
import { preLoadHelper } from '../bin/function/preLoad'
export default {
    name: 'gamePage',
    data(){
        return{
            clock: '',
            noise: [],
            Xdata: [],
            Ydata: []
        }
    },
    async mounted(){
        let noise3 = await import('../bin/function/water.js').then(({ mapWaterHelper }) => {return mapWaterHelper});
        let noise2 = noise3(16059,1537);
        let datamain = await noise2.seed(0.66523);

        let disk = poissonDiskHandler(16059,1537,{minSize:30,blockSize:150});
        let grad = await disk.seed(0.66523);
        let poissonArray = disk.gradExchange(grad);
        let delaunay = getDelaunayHelper();
        let dMap = delaunay.triangulate(poissonArray.arrayRes).open

        let sites = poissonArray.objectRes;
        let bbox = { xl: 0, xr: 150, yt: 0, yb: 150 };
        let voronoi = new Voronoi();
        let Vresult = voronoi.compute(sites,bbox);

        let pl = preLoadHelper(16059,1537);
        let bArray = await pl.poissonInit();
        let rv = pl.voronoiSlice(pl.getherPoint(bArray));
        /*eslint-disable*/
        console.log(Vresult);
        console.log(rv);

        for (let i = 0; i < 150; i++) {
            for (let j = 0; j < 150; j++) {
                // let x = (max - min) * i / 200 + min;
                // let y = (max - min) * j / 100 + min;
                let position = j+i*150;
                let num = datamain.map[position];
                if(datamain.waterMap[position] === 1){ num = 0; }
                if(poissonArray.test[position] === 1){ num = 1; }
                // num = num>0.7?num:0.3;
                this.noise.push([i, j, num]);
                // data.push([i, j, normalDist(theta, x) * normalDist(theta, y)]);
            }
        }
        for (let j = 0; j < 150; j++) {
            this.Ydata.push(j);
            this.Xdata.push(j);
        }
        this.drawChart();
        this.drawMap(poissonArray.arrayRes,dMap,rv.cells)
    },
    methods: {
        drawChart(){
            let chartDom = this.$refs.gameWindow;
            let myChart = echarts.init(chartDom);
            let option;

            option = {
                tooltip: {},
                xAxis: {
                    type: 'category',
                    data: this.Xdata
                },
                yAxis: {
                    type: 'category',
                    data: this.Ydata
                },
                visualMap: {
                    min: 0,
                    max: 1,
                    calculable: true,
                    realtime: false,
                    inRange: {
                    color: [
                        '#313695',
                        '#4575b4',
                        '#74add1',
                        '#abd9e9',
                        '#e0f3f8',
                        '#ffffbf',
                        '#fee090',
                        '#fdae61',
                        '#f46d43',
                        '#d73027',
                        '#a50026'
                    ]
                    }
                },
                series: [
                    {
                    name: 'Gaussian',
                    type: 'heatmap',
                    data: this.noise,
                    emphasis: {
                        itemStyle: {
                        borderColor: '#333',
                        borderWidth: 1
                        }
                    },
                    progressive: 1000,
                    animation: false
                    }
                ]
            };

            option && myChart.setOption(option);
        },
        drawMap(vertices,triangles,cells){
            let canvasMap = this.$refs.canvas,
                ctx = canvasMap.getContext("2d"),
                i;
            // for(i = triangles.length; i; ) {
            //     ctx.beginPath();
            //     --i; ctx.moveTo(vertices[triangles[i]][0], vertices[triangles[i]][1]);
            //     --i; ctx.lineTo(vertices[triangles[i]][0], vertices[triangles[i]][1]);
            //     --i; ctx.lineTo(vertices[triangles[i]][0], vertices[triangles[i]][1]);
            //     ctx.closePath();
            //     ctx.stroke();
            // }
            for(i = 0; i < cells.length; i++){
                ctx.beginPath();
                let edgeArray = cells[i].halfedges;
                for(let k = 0; k < edgeArray.length ; k++){
                    ctx.moveTo(edgeArray[k].edge.va.x+150,edgeArray[k].edge.va.y+150);
                    ctx.lineTo(edgeArray[k].edge.vb.x+150,edgeArray[k].edge.vb.y+150);
                }
                ctx.closePath();
                ctx.stroke();
            }
        },

    }
    // methods: {
    //     beginGame(){
    //         // 60fps
    //         this.clock = setInterval(()=>{
    //             // load all the game loader function
    //             this.mapInterator();
    //         },17);
    //     },
    //     exitGame(){
    //         saveMethods();
    //         clearInterval(this.clock);
    //     },
    //     mapInterator(){},
    // }
}
</script>
<style lang="less" scoped>
.mainContent{
    margin-top: 20px;
    display: flex;
    position: relative;
    justify-content: space-around;
    flex-wrap: wrap;
    .gameWindow{
        overflow: hidden;
        width: 80%;
        min-width: 500px;
        max-width: 1600px;
        height: 80%;
        min-height: 500px;
        max-height: 1600px;
        margin-left: 20px;
    }
    .gameBar{
        width: 17%;
        min-width: 200px;
        max-width: 500px;
        height: 17%;
        min-height: 500px;
        max-height: 1600px;
        margin-right: 20px;
    }
    .msgWindow{
        position: absolute;
        display: none;
    }
}
</style>