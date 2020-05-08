<template>
  <nav>
      <div class="filter-wrapper">
        <div class="nav-el">фильтровать по</div>
        <div class="nav-el dropdown-wrapper" @click="dropdownActive=!dropdownActive " :class="{'dropdown-active': dropdownActive}">{{activeFilterItem}}
          <div class="dropdown " v-if="dropdownActive" v-click-outside="close">
            <div class="nav-el dropdown-item"  v-for="(dbFilterItem, i) in dbFilterItems" :index=i :key=i @click="activeFilterItem=dbFilterItem" ><span>{{dbFilterItem}}</span></div>
          </div>

        </div>
        <div class="nav-el">
          <input type="text" id='search' placeholder="поиск..." @input="submitSearch" >
        </div>

      </div>    
      <div class="nav-el dropdown-wrapper" @click="dropdown2Active=!dropdown2Active " :class="{'dropdown-active': dropdown2Active}">{{activeTableItem}}
         <div class="dropdown " v-if="dropdown2Active" v-click-outside="close">
        <div class="nav-el dropdown-item"  v-for="(dbItem, i) in dbItems" :index=i :key=i @click="activeTableItem=dbItem"><span>{{dbItem}}</span></div>
        </div>
      </div>
  </nav>
</template>

<script>
export default {
  name: 'navbar',
  props: {
    msg: String
  },
  data:function(){
    return{
      //dbItems:["склад","товар","заказ","покупатель","поставщик"],
      dbItems:[],
      dbFilterItems:[],
      dropdownActive:false,
      dropdown2Active:false,
      activeFilterItem: '______________________',
      activeTableItem:'Выбор таблицы'
    }
  },   
   methods:{
      close:function(){
        if(this.dropdownActive){
          this.dropdownActive = false
        }
      },
      submitSearch:function(e){     
        this.$parent.$emit("search",e.target.value)
      },
    },
    watch:{
      activeFilterItem:function(){
        console.log(this.activeFilterItem);
        
        this.$parent.$emit("changeActiveFilterItem",this.activeFilterItem)
      },
      activeTableItem:function(){
        this.$parent.$emit("changeActiveTableItem",this.activeTableItem)
      }
    }

}
</script>
<style lang="sass" scoped>

@import "vars.sass"
nav
  width: 100%
  height: $nav-height
  display: flex
  align-items: center
  justify-content: space-between
  background-color:$back-color
  position: fixed
  z-index: 1000
.bd-wrapper
  height: $nav-height 
  display: flex
  align-items: center
  justify-content: flex-end
.nav-el
  margin-top: auto
  padding-left: 10px
  padding-right: 10px
  height: $nav-height - 3px
  display: flex
  align-items: center
  border-bottom: 3px solid transparent
  span
.bd-item:hover
  background-color:$bd-item-hover-color
  border-bottom-color:$bd-item-border-color
.filter-wrapper
  display: flex
  align-items: center
.dropdown-wrapper
 width: 160px
 border-bottom: 3px solid transparent
.dropdown-wrapper:hover

.dropdown
  position: absolute
  z-index: 111
  flex-direction: column
  top: 50px
  width: 160px
  transform: translateX(-10px)
.dropdown-wrapper:hover
  background-color: $bd-item-hover-color
.dropdown-active
  background-color: $bd-item-hover-color
  border-bottom-color:$bd-item-border-color
.dropdown-item
  background-color: $bd-item-hover-color
  margin-top: auto
  padding: 10px
  width: 160px
  z-index: 2000
.dropdown-item:hover
  background-color: $back-color




      

</style>