<template>
  <div id="app">
    <navbar ref="navbar"></navbar>
    <tableContent ref="tableContent"></tableContent>
    
  </div>
</template>

<script>
import navbar from './components/navbar.vue'
import tableContent from './components/tableContent.vue'
import downMenu from './components/downMenu.vue'

import reqApi from './sendReq.js'
export default {
  name: 'App',
  components: {
    navbar,
    tableContent,
    downMenu
  },
  methods:{
    test:async function(){
      let res = await reqApi.sendReq('api/getTable')
      console.log(res);     
    },
    changeActiveTableItem:async function(item){
      
      this.$refs.navbar.activeFilterItem = '______________________'
      this.$refs.tableContent.activeTableItem = item;
      let res = await reqApi.sendReq('api/getTable/'+item)

      //смена данных в таблице      

      this.$refs.tableContent.tHeaders = Object.keys(res[0])
      this.$refs.tableContent.inputValues.length = 0
      this.$refs.tableContent.inputValues.length = Object.keys(res[0]).length
      this.$refs.tableContent.tItems.length=0
      this.$refs.tableContent.isEdit.length = res.length;
      for(let i=0;i<res.length;i++){
        this.$refs.tableContent.isEdit[i] = false;
        this.$refs.tableContent.tItems.push(Object.values(res[i])) 
      }
      this.$refs.tableContent.tItemsStart = [...this.$refs.tableContent.tItems]
      
      this.$refs.navbar.dbFilterItems = Object.keys(res[0])   
      this.$refs.tableContent.dbFilterItems = Object.keys(res[0])
      
      
    },
    changeActiveFilterItem:function(item){
      this.$refs.tableContent.activeFilterItem = item;
      //this.$refs.tableContent.tItemsStart = [...this.$refs.tableContent.tItems]
    },
    getTables:async function(){
      let res = await reqApi.sendReq('api/getTables')
      this.$refs.navbar.dbItems.length=0;
      for(let i=0;i<res.length;i++)
      {
          let objValue = Object.values(res[i]); 
          this.$refs.navbar.dbItems.push(objValue[0]) 
      }
    },

    search:function(value){
      this.$refs.tableContent.search(value)
    },   
  },
  created:function(){
    this.$on("changeActiveTableItem",this.changeActiveTableItem)
    this.$on("changeActiveFilterItem",this.changeActiveFilterItem)
    this.$on("search",this.search)

  },
  mounted:function(){
    this.getTables()
    
  }
}
</script>

<style lang="sass">

$back-color: #A2A2A3
$nav-height: 50px
$bd-item-border-color: #000000
$bd-item-hover-color: #C4C4C4
body 
  width: 100%
  margin:0
#app
  @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300&display=swap')
  font-family: roboto
#search
  font-family: roboto 
input[type="text"]
  appearance: none
  background-color: $bd-item-hover-color
  border: 2px solid transparent
  line-height: 0
  font-family: roboto
  font-size: 16px
  width: 100%
  display: block
  box-sizing: border-box
  padding: 10px 15px
  border-radius: 10px
  box-shadow: none
  outline: none !important
  letter-spacing: 0.01em
  position: relative
  z-index: 1
button
  font-family: roboto 
</style>
