<template>
  <v-app>
    <v-main>
      <div class="map">
        <!-- <Map :markers="markers" :center="center" :zoom="zoom"> </Map> -->

        <map-loader :markers="markers" :map-config="mapConfig" apiKey="">
        </map-loader>

        <v-btn
          @click="searchText('我附近的餐廳')"
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
          placeholder="搜尋"
          solo
          append-icon="mdi-magnify"
          clearable
          hide-details
          @keyup.enter="searchText"
          @click:append="searchText"
          @click:clear="close"
          autocomplete="off"
          rounded
        ></v-text-field>
        <div class="mt-3">
          <v-btn @click="searchText('附近的餐廳')" small rounded class="mr-2">
            附近的餐廳
          </v-btn>
          <v-btn @click="searchText('氣氛好的餐廳')" small rounded class="mr-2">
            氣氛好
          </v-btn>
          <v-btn @click="searchText('食物好的餐廳')" small rounded class="mr-2">
            食物好
          </v-btn>
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

export default {
  name: 'App',

  components: { MapLoader },

  data: () => ({
    keyword: '',
    mapConfig: {
      zoom: 12,
      center: { lat: 24.79612, lng: 120.993 },
      fullscreenControl: false,
      gestureHandling: 'greedy',
      streetViewControl: false,
      zoomControl: false
    },
    showSearch: true
  }),
  computed: {
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
    close() {
      this.keyword = ''
      bus.$emit('search-clear')
      this.$router.push('/')
      this.SearchEngine.clear()
    },
    searchText(keyword) {
      console.log('App:', keyword || this.keyword)
      if (keyword) {
        this.keyword = keyword
      }
      this.showSearch = true
      this.$router.push(`/search/${this.keyword}`)
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
}
</style>
