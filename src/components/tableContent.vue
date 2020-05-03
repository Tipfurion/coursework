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
          <tr v-for="(item, i) in tItems" :id=i :key=i>
            <td v-for="(item, j) in tItems[i]" :index=j :key=j>{{item}}</td>
            <td class="tIcon" ><img src="../assets/edit.svg"></td>
            <td class="tIcon" @click="deleteData(i)"><img src="../assets/delete.svg"></td>

          </tr>
        </tbody>        
      </table>
      <div class="label-wrapper">
        <h2>Добавить</h2>
      </div>
      <form @submit.prevent="submit">
      <div class="inputs-wrapper" >
        <input  v-for="(item, i) in dbFilterItems" :index=i :key=i type="text" id='search' :class="{ submited: submited }" @submit.prevent="submit"   :placeholder=item  >
      
        <button class="submit-button" type="submit">Добавить</button>
      </div>
      </form>
    </div>
    

</div>
</template>

<script>
import reqApi from '../sendReq.js'
import sortIcon from'./sortIcon.vue'
export default {
  name: 'tableContent',
  components: {
    sortIcon
  },
  data:function(){
    return{
      submited:false,
      arrowActive:false,
      tHeaders:['ID Поставщика','Телефон','Адрес','Адрес','Адрес','Адрес'],
      tItems:[['а',1,3,5,6,'a'],['в',1,1,1,1,'c'],['б',2,2,3,4,'b']],
      tItemsStart: [],
      activeTableItem:"Выберите таблицу",
      dbFilterItems:[],
      inputValues:[],
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
     submit:async function(e){ 
       this.submited=true
       setTimeout(()=>{
         this.submited=false;
       },300)

      for(let i=0;i<this.inputValues.length;i++){
        this.inputValues[i] = e.target[i].value
      }  
      let data={}
      for(let i=0;i<this.tHeaders.length;i++){
        let prop = this.tHeaders[i]
        data[prop]= this.inputValues[i]
      }
      try{
        let res = await reqApi.sendReq('api/addData',{
          method:"POST",
          headers: {
              'Content-Type': 'application/json;charset=utf-8'
            },
          body:JSON.stringify({table:this.activeTableItem,data})
        },true)
        if(res.status===200){
          this.tItems.push([...this.inputValues])
          for(let i=0;i<this.inputValues.length;i++){    
            e.target[i].value= ''
          }            
        }
        else{
          let response = await res.response
          console.error(response.sqlMessage)
          alert(response.sqlMessage)
        }
       
      }
      catch(err){
        console.error(err)
      }
      
     },
     deleteData:async function(id){     
      try{
        let res = await reqApi.sendReq('api/deleteData',{
          method:"DELETE",
          headers: {
              'Content-Type': 'application/json;charset=utf-8'
            },
          body:JSON.stringify({table:this.activeTableItem,headers:this.tHeaders, items:this.tItems[id]})
        },true)      
        if(res.status===200){
          this.tItems.splice(id,1)
        }
        else{
          let response = await res.response 
          console.error(response.sqlMessage)
          alert(response.sqlMessage)
        }
      }
      catch(err){
        console.error(err)
        alert(err)
      }
       
       
     }
    },
    watch:{

    }

}
</script>
<style lang="sass" scoped>
@import "vars.sass"
.wrapper
  display: flex
  flex-direction: column
  padding: 10px
  justify-content: center
.label-wrapper
  display: flex
  justify-content: center
  width: 40%
.menu
  width: 10%
  height: 600px
  background-color: $bd-item-border-color
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
    
  td
    border: 1px solid $bd-item-border-color
    align-content: center
  h2
thead
  tr
    border-bottom: 2px solid $bd-item-border-color
  td
hr
  margin-top: 10px
.submit-button
  margin-top:10px
  border: none
  border-radius: 5px
  box-shadow: none
  outline: none !important  
  height: 40px
  width: 60%
  background-color: $bd-item-hover-color
.submit-button:hover
  background-color:$back-color
  transform: scale(1.1)
input[type="text"]
  margin: 10px
.inputs-wrapper
  width: 40%
  display: flex
  flex-direction: column
  justify-content: center
  align-items: center
.submited
  background-color:$back-color
  transform: scale(1.1)
.tIcon
  border: none
  background-color: white 
  border-collapse: none
.tIcon:hover
   background-color: $back-color
</style>