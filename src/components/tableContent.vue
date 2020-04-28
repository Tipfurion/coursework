<template>
<div>
    <div class="label-wrapper">
        <h2>{{activeTableItem}}</h2>
    </div>
    <div class="wrapper">
      <table>
        <thead>
          <tr>
            <td class="tHeader" @click="changeSortItem" v-for="(header, i) in tHeaders" :id=i :key=i>{{header}}<sort-icon :id=i></sort-icon>
            </td>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, i) in tItems" :index=i :key=i>
            <td v-for="(item, j) in tItems[i]" :index=j :key=j>{{item}}</td>
          </tr>
        </tbody>
      </table>
      
    </div>

</div>
</template>

<script>
import sortIcon from'./sortIcon.vue'
export default {
  name: 'tableContent',
  components: {
    sortIcon
  },
  data:function(){
    return{
      arrowActive:false,
      tHeaders:['ID Поставщика','Телефон','Адрес','Адрес','Адрес','Адрес'],
      tItems:[['а',1,3,5,6,'a'],['в',1,1,1,1,'c'],['б',2,2,3,4,'b']],
      tItemsStart: [],
      activeTableItem:"Выберите таблицу",
      activeFilterItem:String,
      activeSortItemIndex:Number,
      clickCounter:0,
      prevSortItemIndex:Number
    }
  },   
   methods:{
     changeSortItem:function(e){
       this.activeSortItemIndex = e.target.id
       if(this.prevSortItemIndex !== this.activeSortItemIndex ){
         this.clickCounter = 0;
       }
       this.prevSortItemIndex = this.activeSortItemIndex 
       this.clickCounter++
          if(this.clickCounter>=3){
            this.clickCounter=0;
          }
       if(this.clickCounter===0){
         this.tItems =[...this.tItemsStart]
       }
       else{
        this.tItems.sort((a, b)=> { 
            if(this.clickCounter===1){
              return a[this.activeSortItemIndex] === b[this.activeSortItemIndex] ? 0 : (a[this.activeSortItemIndex] < b[this.activeSortItemIndex] ? 1 : -1)
            }
            else if(this.clickCounter===2){
              return a[this.activeSortItemIndex] === b[this.activeSortItemIndex] ? 0 : (a[this.activeSortItemIndex] > b[this.activeSortItemIndex] ? 1 : -1)
            }
          });
       }
      if(typeof(this.tItems[0][this.activeSortItemIndex]==='string')){
        this.tItems.reverse()
      }
      console.log(this.$children);
      for(let i=0;i<this.$children.length;i++){
        if(this.$children[i].id === this.activeSortItemIndex){
          this.$children[i].clickCounter = this.clickCounter
        }
        else{
           this.$children[i].clickCounter=0
        }
      }
      
       
     },
     search:function(value){
      this.tItems = [...this.tItemsStart]
      let index = this.tHeaders.indexOf(this.activeFilterItem)
      let tempArr = []
      for(let i=0;i<this.tItems.length;i++){
        tempArr.push(String(this.tItems[i][index]).toLowerCase())
      }
      for(let i=0;i<tempArr.length;i++){
        if(!tempArr[i].includes(value.toLowerCase())){
          this.tItems.splice(i,1)
          tempArr.splice(i,1)
          i--     
        }
      }      
     },
    },
    watch:{

    }

}
</script>
<style lang="sass" scoped>
$bd-item-border-color: #000000

.wrapper
  display: flex
  padding: 10px
  
.label-wrapper
  display: flex
  justify-content: center
  
.menu
  width: 10%
  height: 600px
  background-color: #000000   
table
  border-collapse: collapse
  width: 90%
.tHeader
  font-size: 1.3em
  font-weight: bold
  
td 
  padding: 10px
tr:nth-child(even)
  background-color: #f2f2f2
tbody
  tr
    border-bottom: 1px solid $bd-item-border-color
  td
    border: 1px solid $bd-item-border-color
    align-content: center
  h2
thead
  tr
    border-bottom: 2px solid $bd-item-border-color
  td
   

</style>