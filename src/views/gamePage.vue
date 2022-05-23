<template>
    <div class="mainContent">
        <div class="gameWindow" ref="gameWindow"></div>
        <div class="gameBar"></div>
    </div>
</template>
<script>
export default {
    name: 'gamePage',
    data(){
        return{
            clock: '',
        }
    },
    mounted(){

    },
    methods: {
        beginGame(){
            // 60fps
            this.clock = setInterval(()=>{
                // load all the game loader function
                this.mapInterator();
            },17);
        },
        exitGame(){
            saveMethods();
            clearInterval(this.clock);
        },
        mapInterator(){},
    }
}
</script>
<style lang="less" scoped>
.mainContent{
    margin-top: 20px;
    display: flex;
    justify-content: space-evenly;
    .gameWindow{
        flex: 1;
        width: 80%;
        min-width: 500px;
        max-width: 2500px;
        height: 80%;
        min-height: 500px;
        max-height: 2500px;
        margin-left: 20px;
    }
    .gameBar{
        width: 17%;
        min-width: 100px;
        max-width: 300px;
        height: 17%;
        min-height: 100px;
        max-height: 300px;
        margin-right: 20px;
    }
}
</style>