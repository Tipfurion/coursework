<template>
  <nav>
      <div class="footer-wrapper">
        <div class=""  v-for="(dbFilterItem, i) in dbFilterItems" :index=i :key=i ><span>{{dbFilterItem}}</span></div>
      </div>
  </nav>
</template>

<script>
export default {
  name: 'downMenu',
  props: {
    msg: String
  },
  data:function(){
    return{
      //dbItems:["склад","товар","заказ","покупатель","поставщик"],
      dbFilterItems:[],
    }
  },   
    methods:{
    },
    watch:{
    }

}
</script>
<style lang="sass" scoped>

$back-color: #A2A2A3
$nav-height: 50px
$bd-item-border-color: #000000
$bd-item-hover-color: #C4C4C4

.footer-wrapper
  position: fixed
  bottom: 0
  width: 100%
  height: 100px
  opacity: 1
  background-color:#C4C4C4
span
  

</style>