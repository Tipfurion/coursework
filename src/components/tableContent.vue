<template>
<div>
    <div v-if="isPrint" class="modal">
    <div class="label-wrapper-modal">
        <h2>{{activeTableItem}}</h2>
    </div>         
      <table>
        <thead>
          <tr>
            <td class="tHeader" v-for="(header, i) in tHeaders" :id=i :key=i>{{header}}<sort-icon :id=i></sort-icon>
            </td>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, i) in tItems" :id="'tr'+i" :key=i  >
            <td  v-for="(item, j) in tItems[i]" :index=j :key=j>
              <span>{{item}}</span>
            </td>
          </tr>
        </tbody>        
      </table>
    <div class="label-wrapper-modal">
        <button class="submit-button" @click="print">Назад</button>
    </div>      
    </div>



    <div class="label-wrapper-main">
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
          <tr v-for="(item, i) in tItems" :id="'tr'+i" :key=i  >
            <td  v-for="(item, j) in tItems[i]" :index=j :key=j>
              <span v-if="!isEdit[i]">{{item}}</span>
              <span v-else><input type="text" class="tInput" :value="item" :id="'inp'+j"></span>
            </td>
            <td v-if="isEdit[i]" class="tIcon" @click="submitEdit(i)"><img src="../assets/done.svg"></td>
            <td class="tIcon" @click="edit(i)"><img src="../assets/edit.svg"></td>
            <td class="tIcon" @click="deleteData(i)"><img src="../assets/delete.svg"></td>
          </tr>
        </tbody>        
      </table>
      <hr>
      <div class="label-wrapper">
        <h2>Добавить</h2>
      </div>
      <hr>
      <div class="form-wrapper">
        <form @submit.prevent="submit">
        <div class="inputs-wrapper" >
          <input  v-for="(item, i) in dbFilterItems" :index=i :key=i type="text" id='search' :class="{ submited: submited }" @submit.prevent="submit"   :placeholder=item  >
        
          <button class="submit-button" type="submit">Добавить</button>
        </div>
        </form>
        <div class="down-menu">
          <div>
              <button class="submit-button" @click="print">Печать<img class="btnIcon" src="../assets/print.svg"></button>
            </div>
        </div>
      </div>
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
      tHeaders:[],
      tItems:[],
      isEdit:[],
      tItemsStart: [],
      activeTableItem:"Выберите таблицу",
      dbFilterItems:[],
      inputValues:[],
      clickCounter:0,
      isPrint:false,
      prevEditIndex:Number,
      activeFilterItem:String,
      activeSortItemIndex:Number,
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
         this.tItems.length=0;
         this.tItems = [...this.tItemsStart] 
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
      if(typeof(this.tItems[0][this.activeSortItemIndex])==='string' && this.clickCounter!==0){
        this.tItems = [...this.tItems.reverse()]     
      }
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
       
       
     },
     edit:function(id){
       if(this.prevEditIndex!==id){
         this.isEdit[this.prevEditIndex]=false;

       }
       this.isEdit[id]=!this.isEdit[id]
       this.prevEditIndex = id;
       this.tItems.push([])
       this.tItems.pop()
     },
     submitEdit:async function(id){
       let values = []
       for(let i=0;i<this.tHeaders.length;i++){
         let el = document.getElementById('inp'+i)
         values.push(el.value)
       }
        let res = await reqApi.sendReq("/api/editData", {
          method:"PUT",
          headers: {
              'Content-Type': 'application/json;charset=utf-8'
            },
          body:JSON.stringify({table:this.activeTableItem,headers:this.tHeaders,items:this.tItems[id],data:values})
        },true)

        if(res.status===200){
          this.tItems[id] =[...values]
          this.isEdit[id]=!this.isEdit[id]  
          this.tItems.push([])
          this.tItems.pop()
        }
        else{
          let response = await res.response
          console.error(response.sqlMessage)
          alert(response.sqlMessage)
        }           
     },
     print:function(){
       this.isPrint = !this.isPrint
     },
    },


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
  width: 50%
.label-wrapper-main
  display: flex
  justify-content: center
  width: 90%
  h2
    margin-top:70px
.label-wrapper-modal
  display: flex
  justify-content: center
  width: 99%
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

input[type="text"]
  margin: 10px
.inputs-wrapper
  width: 100%
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
  width: 20px
.tIcon:hover
   background-color: $back-color
.tInput
  padding: 0
  margin: 0
  border-bottom: 1px solid black
  background-color: transparent
  height: 100%
  margin: 0 !important
  border-radius:0
form
  width: 50%
.form-wrapper
  display: flex
  justify-content: space-between
  flex-direction: row
.down-menu
  background-color: transparent
  width: 30%
  margin-left: 40px
.nav-el
  margin-top: auto
  padding-left: 10px
  padding-right: 10px
  height: $nav-height - 3px
  display: flex
  align-items: center
  border-bottom: 3px solid transparent
.nav-el:hover
  background-color: $back-color
.btnIcon
  position: relative
  left: 20%  
.modal
  position: absolute
  width: 100%
  height: 100% 
  background-color: white
  opacity: 1
  z-index: 1000
</style>