<template>
    <div class="mainContent">
        <div class="gameWindow" ref="gameWindow"></div>
        <div class="gameBar"></div>
        <div class="msgWindow"></div>
    </div>
</template>
<script>
import { OctavePerlin } from '../bin/function/perlinNoise.js'
export default {
    name: 'gamePage',
    data(){
        return{
            clock: '',
            noise: [],
        }
    },
    mounted(){
        for(let i=0;i<100;i++){
        let data = i+Math.random()/* eslint-disable */
        let res = OctavePerlin(data,data,2,2)
            console.log(res);
            this.noise.push(res);
        }
    },
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