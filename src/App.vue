<template>
  <div id="app">
    <navbar ref="navbar"></navbar>
    <tableContent ref="tableContent"></tableContent>
  </div>
</template>

<script>
import navbar from './components/navbar.vue'
import tableContent from './components/tableContent.vue'

import reqApi from './sendReq.js'
export default {
  name: 'App',
  components: {
    navbar,
    tableContent
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
      this.$refs.tableContent.tItems.length=0
      for(let i=0;i<res.length;i++)
      {
          this.$refs.tableContent.tItems.push(Object.values(res[i])) 
      }
      this.$refs.tableContent.tItemsStart = [...this.$refs.tableContent.tItems]
      
      this.$refs.navbar.dbFilterItems = Object.keys(res[0])
      
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
body 
  width: 100%
  margin:0
#app
  @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300&display=swap')
  font-family: roboto
#search
  font-family: roboto 
</style>
