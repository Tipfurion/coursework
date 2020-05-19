<template>
  <div>
    <div class="modal" v-if="isSettings">
       <div class="settings-modal" v-click-outside="closeSettings">
        <form @submit.prevent="submitSettings">
          <h2>Изменить настройки базы данных</h2>
          <input  type="text" id='host' placeholder="host" class="settings-input" :class="{ submited: submited }" @submit.prevent="submit"   >
          <input  type="text" id='user' placeholder="user" class="settings-input" :class="{ submited: submited }" @submit.prevent="submit"   >
          <input  type="text" id='database' placeholder="database" class="settings-input" :class="{ submited: submited }" @submit.prevent="submit"   >
          <input  type="password" id='password' placeholder="password" class="settings-input" :class="{ submited: submited }" @submit.prevent="submit"   >
          <button class="submit-button" type="submit">Подключиться</button>
        </form>         
       </div>
    </div>
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
     <div class="left-side-wrapper">
     <div class="nav-el dropdown-wrapper settings" @click="settings"><img src="../assets/settings.svg"></div>
      <div class="nav-el dropdown-wrapper" @click="dropdown2Active=!dropdown2Active " :class="{'dropdown-active': dropdown2Active}">{{activeTableItem}}
         <div class="dropdown " v-if="dropdown2Active" v-click-outside="close">
        <div class="nav-el dropdown-item"  v-for="(dbItem, i) in dbItems" :index=i :key=i @click="activeTableItem=dbItem"><span>{{dbItem}}</span></div>
        </div>
      </div>
      </div>
  </nav>
  </div>
</template>

<script>
import reqApi from '../sendReq.js'

export default {
  name: 'navbar',
  props: {
    msg: String
  },
  data:function(){
    return{
      isSettings:false,
      dbItems:[],
      submited:false,
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
      settings:function(){
        this.isSettings = !this.isSettings        
      },
      closeSettings:function(){
        this.isSettings = !this.isSettings
      },
      submitSettings:async function(){
       this.submited=true
       setTimeout(()=>{
         this.submited=false;
       },300)

        let settings={
          id:document.getElementById("host").value,
          user:document.getElementById("user").value,
          database:document.getElementById("database").value,
          password:document.getElementById("password").value,
        }
        let res = await reqApi.sendReq("/api/changeSettings", {
          method:"PUT",
          headers: {
              'Content-Type': 'application/json;charset=utf-8'
            },
          body:JSON.stringify(settings)
        },true)

        if(res.status===200){
          console.log("ok");
          this.$parent.$emit('getTables')
        }
        else{
          let response = await res.response
          console.error(response.sqlMessage)
          alert(response.sqlMessage)
        }    
      }
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
 display: flex
 justify-content: center
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
.left-side-wrapper
  display: flex
  flex-direction: row
.settings
  display: flex
  justify-content: center
  width: 50px
.modal
  position: absolute
  width: 100%
  height: 100% 
  background-color: rgba(0, 0, 0, 0.4)

  z-index: 2000
  display: flex
  justify-content: center
  align-items: center
.settings-modal
  position: relative
  z-index: 3000
  background-color: white
  width: 50%
  height: 50%
  opacity: 1
  display: flex
  justify-content: center
  align-items: center
.settings-input
  margin-top:20px
.submit-button
  margin-top: 30px
  width: 100%
</style>