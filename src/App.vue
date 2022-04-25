<template>
  <v-app>
    <v-main>
            
      <div class="map">
        <!-- <Map :markers="markers" :center="center" :zoom="zoom"> </Map> -->
          
        <map-loader
          :markers="markers"
          :map-config="mapConfig"
          :apiKey="GOOGLE_MAP_APIKEY"
        >
        </map-loader>

        <v-btn
          @click="searchText('我附近的' + NAME)"
          color="white"
          elevation="2"
          fab
          absolute
          :style="`bottom: ${showMapSearchToggle ? 95 : 30}px; right: 10px;`"
        >
          <v-icon color="grey darken-3">mdi-crosshairs-gps</v-icon>
        </v-btn>
      </div>

      <div class="map-search">
        <v-text-field
          v-model="keyword"
          :placeholder="$t('UI.Search') + NAME"
          solo
          append-icon="mdi-magnify"
          clearable
          hide-details
          @keyup.enter="searchText(keyword)"
          @click:append="searchText(keyword)"
          @click:clear="close"
          autocomplete="off"
          ref="appSearch"
          rounded
        ></v-text-field>
        <div class="mt-3">
          <template v-for="item in QUICK_DIRECT">
            <v-btn
              @click="searchText(item.searchText)"
              rounded
              class="mr-2"
              :key="item.text"
              v-bind="{'x-small':$t('GENERAL.Lang')==='en', small:$t('GENERAL.Lang')==='tw'}"
            >
              {{ item.text }}
            </v-btn>
          </template>
        </div>
        
      </div>

      <keep-alive>
        <router-view v-if="!(showMapSearchToggle && !showSearch)"></router-view>
      </keep-alive>
      
      <v-btn
        absolute
        style="bottom: 30px; right: 10px;"
        rounded
        x-large
        v-if="showMapSearchToggle"
        @click="showSearch = !showSearch"
      >
        <template v-if="showSearch">
          <v-icon class="mr-2">mdi-map</v-icon>{{$t('UI.ShowMap')}}
        </template>
        <template v-else>
          <v-icon class="mr-2">mdi-view-list</v-icon>{{$t('UI.ShowList')}}
        </template>
      </v-btn>
      <div >
          <v-btn class="mx-2 translate" fab dark small color="teal"  @click="setLang" >{{$t('GENERAL.ChangeLang')}}</v-btn>
      </div>
    </v-main>
  </v-app>

</template>

<script>
// import Map from './components/Map.vue'
import MapLoader from './components/MapLoader.vue'
import SearchEngine from './lib/search'
import bus from './lib/bus'
import { aspectRatingDescription } from './lib/utils'
import {
  GOOGLE_MAP_APIKEY,
  GOOGLE_MAP_MAPID,
  NAME,
  QUICK_DIRECT
} from './constant'

export default {
  name: 'App',

  components: { MapLoader },

  data: () => ({
    curlat: 24.79612,
    curlng: 120.993,
    keyword: '',
    mapConfig: {
      mapId: GOOGLE_MAP_MAPID,
      zoom: 12,
      center: { lat: 24.79612, lng: 120.993 },
      fullscreenControl: false,
      gestureHandling: 'greedy',
      streetViewControl: false,
      mapTypeControl: false,
      zoomControl: false
    },
    showSearch: true,
    //buttomsize: this.$i18n('GENERAL.ButtomSize'),
  }),
  computed: {
    GOOGLE_MAP_APIKEY: () => GOOGLE_MAP_APIKEY,
    NAME: () => NAME,
    QUICK_DIRECT: () => QUICK_DIRECT,
    showMapSearchToggle() {
      return this.$vuetify.breakpoint.mobile && this.$route.name === 'Search'
    },
    SearchEngine() {
      return SearchEngine
    },
    markers() {
      if (this.SearchEngine.resultList.length === 0) {
        return []
      }
      return this.SearchEngine.resultList.map((v) => ({
        position: {
          lat: parseFloat(v.lat),
          lng: parseFloat(v.lng)
        },
        id: v.cid,
        title: v.name,
        aspectDescription: aspectRatingDescription(v, false)
      }))
    }
  },
  methods: {
    blur() {
      this.$refs.appSearch.blur()
    },
    close() {
      this.keyword = ''
      bus.$emit('search-clear')
      this.$router.push('/')
      this.SearchEngine.clear()
      this.blur()
    },
    searchText(keyword) {
      if (!keyword) {
        return
      }
      console.log('App:', keyword || this.keyword)
      if (keyword) {
        this.keyword = keyword
      }
      this.showSearch = true
      this.$router.push(`/search/${this.keyword}`)
      this.blur()
    },
    setLang(){
      if (localStorage.getItem('language') === 'en') {
        localStorage.setItem('language', 'tw')
      } else {
        localStorage.setItem('language', 'en')
      }
      return history.go(0)
    }
    
  },
  beforeCreate(){
    
  },
  created() {
    if (this.$router.currentRoute.name === 'Search') {
      this.$router.push('/')
    }
  },
  beforeMount(){
    navigator.geolocation.getCurrentPosition(
      position => {
        this.mapConfig.center.lat = position.coords.latitude
        //console.log(this.mapConfig)
        this.mapConfig.center.lng = position.coords.longitude
        this.mapConfig.zoom = 15
      },
      error => {
        console.log(error.message)
      },
    )
  },
  mounted() {

    bus.$on('search-clear', () => {
      this.keyword = ''
    })
  }
}
</script>

<style scoped>
.map {
  width: 100vw;
  height: 100vh;
  background-color: lightblue;
  position: fixed;
}

.map-search {
  padding-top: 12px;
  padding-left: 12px;
  padding-right: 12px;

  max-width: 450px;
  width: 100vw;
  position: fixed;
}

.panel {
  max-width: 450px;
  width: 100vw;
  height: 100vh;
  position: fixed;
  background-color: white;
  box-shadow: 0px 0 5px #000;
  overflow-y: scroll;
}

.translate{
  top: 35px; 
  overflow: hidden; 
  position: fixed; 
  right: 35px; 
  z-index: 999;
}
</style>
