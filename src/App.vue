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
          :placeholder="'搜尋' + NAME"
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
              small
              rounded
              class="mr-2"
              :key="item.text"
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
          <v-icon class="mr-2">mdi-map</v-icon>顯示地圖
        </template>
        <template v-else>
          <v-icon class="mr-2">mdi-view-list</v-icon>顯示清單
        </template>
      </v-btn>
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
    showSearch: true
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
    }
  },
  created() {
    if (this.$router.currentRoute.name === 'Search') {
      this.$router.push('/')
    }
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
</style>
