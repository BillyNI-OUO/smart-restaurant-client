<template>
  <v-container class="panel search" style="padding-bottom: 64px;">
    <v-layout wrap>
      <v-flex xs12 pb-3>
        <v-layout wrap>
          <v-flex xs12 mb-3>
            <v-text-field
              ref="searchSearch"
              v-model="keyword"
              placeholder="搜尋"
              solo
              clearable
              hide-details
              prepend-icon="mdi-arrow-left"
              append-icon="mdi-magnify"
              @click:prepend="close"
              @keyup.enter="searchText(keyword)"
              @click:append="searchText(keyword)"
              @click:clear="close"
              autocomplete="off"
              rounded
            ></v-text-field>
          </v-flex>

          <v-flex xs12>
            <v-layout>
              <v-flex xs4 pr-1>
                <v-select
                  v-model="filterFilterBy"
                  :items="filterByItems"
                  dense
                  outlined
                  hide-details
                  @change="search()"
                ></v-select>
              </v-flex>
              <v-flex xs4 pl-1 pr-1>
                <v-select
                  v-model="filterPriceLevel"
                  :items="priceLevelItems"
                  dense
                  outlined
                  hide-details
                  @change="search()"
                ></v-select>
              </v-flex>
              <v-flex xs4 pl-1>
                <v-select
                  v-model="filterSortBy"
                  :items="sortByList"
                  dense
                  outlined
                  hide-details
                  @change="search()"
                ></v-select>
              </v-flex>
            </v-layout>
          </v-flex>
        </v-layout>
      </v-flex>

      <v-flex xs12>
        <v-layout wrap>
          <template v-if="SearchEngine.resultList.length === 0">
            <v-flex xs12 style="text-align: center;" pt-5>
              沒有符合的項目
            </v-flex>
          </template>

          <template v-for="(item, index) in SearchEngine.resultList">
            <v-flex
              xs12
              :key="index"
              @click="
                SearchEngine.$emit(`marker-highlight-${item.cid}`)
                $router.push(`/detail/${item.cid}`)
              "
              style="cursor: pointer;"
            >
              <v-layout>
                <v-flex xs8 pr-2 pt-3 class="search-item-content">
                  <h3
                    style="
                      height: 28px;
                      overflow: hidden;
                      text-overflow: ellipse;
                      text-wrap: no-wrap;
                    "
                  >
                    {{ item.name }}
                  </h3>
                  <div style="height: 24px; overflow: hidden;">
                    <span class="yellow--text text--darken-4">
                      {{ item.rating && item.rating.toFixed(1) }}
                    </span>

                    <v-rating
                      v-if="item.rating"
                      style="display: inline; position: relative; top: -2px;"
                      dense
                      empty-icon="mdi-star-outline"
                      full-icon="mdi-star"
                      half-icon="mdi-star-half-full"
                      hover
                      length="5"
                      :value="item.rating"
                      readonly
                      size="18"
                      background-color="yellow darken-4"
                      color="yellow darken-4"
                      half-increments
                    ></v-rating>
                    <span
                      class="grey--text text--darken-1"
                      v-if="item.user_ratings_total"
                    >
                      ({{ item.user_ratings_total }})
                    </span>

                    <span
                      v-if="item.price_level"
                      class="grey--text text--darken-1"
                    >
                      ·
                      {{ '$'.repeat(item.price_level) }}
                    </span>

                    <span
                      v-if="!item.user_ratings_total"
                      class="grey--text text--darken-1"
                    >
                      評論不足
                    </span>
                  </div>
                  <div
                    style="height: 24px; overflow: hidden;"
                    class="grey--text text--darken-1"
                  >
                    {{ item.formatted_address }}
                  </div>
                  <div
                    style="height: 24px; overflow: hidden;"
                    v-html="aspectRatingDescription(item, true, filterSortBy)"
                  ></div>
                </v-flex>

                <v-flex xs4 pt-2 pb-2 class="search-item-img">
                  <placeholder-image
                    weight="100%"
                    height="100%"
                    :src="`${APIBASE}/img/place_header/${item.cid}.jpg`"
                    :error-src="
                      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='
                    "
                    style="background-size: cover; border-radius: 4px;"
                  ></placeholder-image>
                </v-flex>
              </v-layout>
              <v-divider></v-divider>
            </v-flex>
          </template>

          <v-flex>
            <v-container pt-3 style="text-align: center;">
              <template v-if="!reportedMissingPlace">
                <v-btn outlined @click="feedbackReportMissingPlace">
                  找不到{{ NAME }}嗎？
                </v-btn>
              </template>

              <template v-else>
                <p>感謝您的回報</p>
              </template>
            </v-container>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import axios from 'axios'
import bus from '../lib/bus'
import SearchEngine from '../lib/search'
import { aspectRatingsDict, aspectRatingDescription } from '../lib/utils'
import PlaceholderImage from '../components/PlaceholderImage.vue'
import keepScrollTop from '../mixins/keepScrollTop'
import { NAME, APIBASE, ASPECTS } from '../constant'

export default {
  name: 'Search',
  mixins: [keepScrollTop],
  components: { PlaceholderImage },
  data: () => ({
    text: '',
    keyword: '',

    // deprecated
    ratingItems: [
      { text: '評價', value: 0 },
      { text: '1⭐+', value: 1 },
      { text: '2⭐+', value: 2 },
      { text: '3⭐+', value: 3 },
      { text: '4⭐+', value: 4 },
      { text: '4.5⭐+', value: 4.5 }
    ],
    filterRating: 0,

    filterByItems: [
      { text: '篩選', value: '' },
      { text: '總分 4⭐+', value: 'rating' },

      ...ASPECTS.map((v) => ({ text: `${v.title} 4⭐+`, value: v.key }))
    ],
    filterFilterBy: '',

    priceLevelItems: [
      { text: '價格', value: 0 },
      { text: '$+', value: 1 },
      { text: '$$+', value: 2 },
      { text: '$$$+', value: 3 },
      { text: '$$$$+', value: 4 }
    ],
    filterPriceLevel: 0,

    filterSortBy: 'distance',
    sortByList: [
      { text: '距離排序', value: 'distance' },
      { text: '評價排序', value: 'rating' }
    ],

    reportedMissingPlace: false
  }),
  computed: {
    NAME: () => NAME,
    APIBASE: () => APIBASE,
    SearchEngine: () => SearchEngine,
    aspectRatingsDict: () => aspectRatingsDict,
    aspectRatingDescription: () => aspectRatingDescription
  },
  methods: {
    blur() {
      this.$refs.searchSearch.blur()
    },
    close(redicrect = true) {
      this.keyword = ''
      this.filterRating = 0
      this.filterPriceLevel = 0
      this.filterFilterBy = ''
      this.filterSortBy = 'distance'
      bus.$emit('search-clear')
      this.blur()
      if (redicrect) {
        this.$router.push('/')
      }
      this.SearchEngine.clear()
      this.reportedMissingPlace = false
      blur()
    },
    search(text) {
      if (!text) {
        text = this.keyword
      }
      this.keyword = text
      this.blur()
      this.SearchEngine.clear()
      console.log('perform searching.', text)

      for (let { key, title } of ASPECTS) {
        if (text === title + '好的' + this.NAME) {
          this.filterFilterBy = key
          this.searchNearby(this.SearchEngine.mapLat, this.SearchEngine.mapLng)
          return
        }
      }

      if (text === '附近的' + this.NAME) {
        this.searchNearby(this.SearchEngine.mapLat, this.SearchEngine.mapLng)
      } else if (text === '我附近的' + this.NAME) {
        this.searchNearbyGPS()
      } else {
        this.SearchEngine.search({
          keyword: text,
          rating: this.filterRating,
          price_level: this.filterPriceLevel,
          sort_by: this.filterSortBy,
          filter_by: this.filterFilterBy
        })
      }
    },
    searchNearbyGPS() {
      console.log('gps')
      navigator.geolocation.getCurrentPosition(
        (res) => {
          console.log(res)
          let lat = res.coords.latitude + 0
          let lng = res.coords.longitude - 0.008755
          this.searchNearby(lat, lng)
        },
        (err) => {
          console.error(err)
          alert('請開啟您的定位功能！')
        }
      )
    },
    searchNearby(lat = '', lng = '', text = '') {
      let args = {
        keyword: text,
        lng: lng,
        lat: lat,
        rating: this.filterRating,
        filter_by: this.filterFilterBy,
        price_level: this.filterPriceLevel,
        sort_by: this.filterSortBy
      }
      this.SearchEngine.searchNearby(args)
    },
    searchText() {
      console.log('searchText', this.keyword)
      this.$router.push(`/search/${this.keyword}`)
    },
    feedbackReportMissingPlace() {
      if (!this.keyword) {
        return
      }

      this.reportedMissingPlace = true
      return new Promise((resolve, reject) => {
        axios
          .post(`${this.APIBASE}/feedback/missing_place`, {
            name: this.keyword
          })
          .then((res) => {
            let data = res.data
            if (data.error) {
              console.error(data)
              reject(data)
              return
            }

            resolve()
          })
      })
    }
  },
  mounted() {
    this.keyword = this.$route.params.query
    this.search(this.keyword)
    bus.$on('search-clear', () => {
      this.keyword = ''
    })
  },
  created() {
    this.keyword = this.$route.params.query
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      if (vm.keyword === to.params.query) {
        return
      }
      vm.keyword = to.params.query
      vm.search(to.params.query)
    })
  },
  beforeRouteUpdate(to, from, next) {
    this.search(to.params.query)
    next()
  },
  beforeRouteLeave(to, from, next) {
    if (to.name === 'Home') {
      this.close(false)
    }
    next()
  }
}
</script>

<style scoped>
.search {
  width: 100%;
  height: 100%;
}

.search-item-img {
  height: 120px;
}
.search-item-content {
  height: 120px;
}
</style>
