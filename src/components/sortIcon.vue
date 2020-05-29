<template>
    <span class="sort-icon">
        <svg v-if="clickCounter===0"  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="black" width="18px" height="18px"></svg>
        <svg v-if="clickCounter===2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="black" width="18px" height="18px"><path d="M7 14l5-5 5 5z"/><path d="M0 0h24v24H0z" fill="none"/></svg>
        <svg v-if="clickCounter===1"  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="black" width="18px" height="18px"><path d="M7 10l5 5 5-5z"/><path d="M0 0h24v24H0z" fill="none"/></svg>          
    </span>
</template>

<script>
export default {
  name: 'sortIcon',
  data: function(){
    return{
        clickCounter:0,
        id:Number
    }
  },
  methods:{
      count:function(e){
        if(e.target.id === this.$parent.activeSortItemIndex)
          this.clickCounter++
          if(this.clickCounter>=3){
            this.clickCounter=0;
          }
      }    
  },
  created:function(){

  },
  mounted:function(){
      this.id = this.$el.id
  }
}
</script>


<style scoped>

</style>
