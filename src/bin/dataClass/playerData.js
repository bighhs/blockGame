import { itemList } from './itemData.js';
class playerDataClass{
    // playerDataArray
    // [
    //  [healthBar,hungerBar,thirtyBar,carryWeight,realSpeed],
    //  [{backpack},totalweight],
    //  [speed,strength,will],
    //  [x,y],
    //  [cheatingMark]
    // ]
    constructor(playerInitItem,playerInitSkill,initLocation,...limitArr){
        let barArr = [];
        barArr[0] = 20 + playerInitSkill[2] * 10 + playerInitSkill[1] * 15;
        barArr[1] = 50 + playerInitSkill[2] * 14 - playerInitSkill[1] * 2 - playerInitSkill[0] * 2;
        barArr[2] = 10 + playerInitSkill[0] * 5 + playerInitSkill[1] * 2;
        barArr[3] = 100 + playerInitSkill[1] * 5 + playerInitSkill[2] * 5;
        let overweight = ( playerInitItem[1] > barArr[3]? playerInitItem[1]-barArr[3]: 0 );
        barArr[4] = playerInitSkill[0] - 0.1 * overweight;
        this.playerDataArray = [ barArr, playerInitItem, playerInitSkill, initLocation, false ];
        if(limitArr != undefined){
            this.pLimit = limitArr;
        }else{
            // pLimit [speedLimit,strengthLimit,willLimit]
            this.pLimit = [100, 100, 100];
        }
    }

    refreshBar(){
        let barArr = this.playerDataArray[0];
        let skillArr = this.playerDataArray[2];
        let itemWeight = this.playerDataArray[1][1];
        barArr[0] = 20 + skillArr[2] * 10 + skillArr[1] * 15;
        barArr[1] = 50 + skillArr[2] * 14 - skillArr[1] * 2 - skillArr[0] * 2;
        barArr[2] = 10 + skillArr[0] * 5 + skillArr[1] * 2;
        barArr[3] = 100 + skillArr[1] * 5 + skillArr[2] * 5;
        let overweight = ( itemWeight > barArr[3]? itemWeight - barArr[3]: 0 );
        barArr[4] = skillArr[0] - 0.1 * overweight;
        this.playerDataArray[0] = barArr;        
    }

    playerMove(direction){
        switch(direction){
            case 'l':
                this.playerDataArray[3][0] -= 1;
                break;
            case 'r':
                this.playerDataArray[3][0] += 1;
                break;
            case 'u':
                this.playerDataArray[3][1] += 1;
                break;
            case 'd':
                this.playerDataArray[3][1] -= 1;
                break;
        };
        return true;
    }

    playerSkillChange(skillName){
        let overflow = false;
        switch(skillName){
            case 'speed':
                if(this.playerDataArray[2][0] < this.pLimit[0])
                    this.playerDataArray[2][0] += 1;
                else
                    overflow = true;
                break;
            case 'strength':
                if(this.playerDataArray[2][1] < this.pLimit[1])
                    this.playerDataArray[2][1] += 1;
                else
                    overflow = true;
                break;
            case 'will':
                if(this.playerDataArray[2][2] < this.pLimit[2])
                    this.playerDataArray[2][2] += 1;
                else
                    overflow = true;
                break;
            case 'dspeed':
                this.playerDataArray[2][0] -= 1;
                break;
            case 'dstrength':
                this.playerDataArray[2][1] -= 1;
                break;
            case 'dwill':
                this.playerDataArray[2][2] -= 1;
                break;    
        }
        this.refreshBar();
        return overflow;
    }

    playerBackpack(method,item,amount){
        let mark = false, timely = 0, weight = 0;
        let isOwn = Reflect.has(item);
        if(amount === undefined) amount = 1;
        switch(method){
            case 'set':
                if(isOwn)
                    timely = Reflect.get(this.playerDataArray[1][0],item);
                var num = timely + amount;
                Reflect.set(this.playerDataArray[1][0],item,num);

                let msg = Reflect.get(itemList,item);
                weight = msg.weight * amount;
                this.playerDataArray[1][1] += weight;
                mark = true;
                break;
            case 'use':
                if(isOwn){
                    timely = Reflect.get(this.playerDataArray[1][0],item);
                    mark = timely < amount? false: true;
                    
                    if(mark){
                        let msg = Reflect.get(itemList,item);
                        weight = msg.weight * amount;
                        this.playerDataArray[1][1] -= weight;
                    }                    
                }
                break;
        }
        return mark;
    }
}

export var newplayer = new playerDataClass();