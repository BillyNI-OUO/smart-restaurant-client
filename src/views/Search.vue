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
              {{$t('FEEDBACK.NoMatching')}}
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
                      {{$t('DETAIL.NotEnoughComment')}}
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
                <v-btn outlined @click="reportedMissingPlace=!reportedMissingPlace; reportName = keyword">
                  {{$t('FEEDBACK.CantFindText')}}
                </v-btn>
              </template>
              <template  v-if="reportedMissingPlace">
                <v-form
                  ref="form"
                  lazy-validation
                  v-model="reportValid"
                >
                  <v-text-field
                    v-model="reportName"
                    :counter="20"
                    :rules="nameRules"
                    :label="restaurantLabel"
                    required
                  ></v-text-field>
                  <v-text-field
                    v-model="reportLabel"
                    :counter="50"
                    :rules="labelRules"
                    :label="noteLabel"
                  ></v-text-field>
                  <v-btn
                    :disabled="!reportValid"
                    color="success"
                    class="mr-4"
                    @click="feedbackReportMissingPlace"
                  >
                    {{$t('FEEDBACK.Submit')}}
                  </v-btn>
                  <v-btn
                    color="error"
                    class="mr-4"
                    @click="reportedMissingPlace=!reportedMissingPlace"
                  >
                    {{$t('FEEDBACK.Cancel')}}
                  </v-btn>
                </v-form>
              </template>
              <template>
                <div class="text-center">
                  <v-snackbar
                    v-model="snackbar"
                    :timeout="timeout"
                    :multi-line="multiLine"
                  >
                    {{ snackbarText }}

                    <template v-slot:action="{ attrs }">
                      <v-btn
                        color="blue"
                        text
                        v-bind="attrs"
                        @click="snackbar = false"
                      >
                        Close
                      </v-btn>
                    </template>
                  </v-snackbar>
                </div>
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
import { NAME, APIBASE, ASPECTS, QUICK_DIRECT } from '../constant'
import i18n from '../plugins/vue-i18n'

export default {
  name: 'Search',
  mixins: [keepScrollTop],
  components: { PlaceholderImage },
  data() {
    return {
      text: '',
      keyword: '',
      reportLabel: '',
      reportName: '',
      reportValid: true,
      snackbar: false,
      timeout:2000,
      snackbarText: this.$t('FEEDBACK.ThxFeedBack'),
      restaurantLabel :this.$t('FEEDBACK.RestaurantLabel'),
      noteLabel : this.$t('FEEDBACK.NoteLabel'),
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
        { text: this.$t('GENERAL.Filter'), value: '' },
        { text: this.$t('GENERAL.TotalRating'), value: 'rating' },

        ...ASPECTS.map((v) => ({ text: `${v.title} 4⭐+`, value: v.key }))
      ],
      filterFilterBy: '',

      priceLevelItems: [
        { text: this.$t('GENERAL.Price'), value: 0 },
        { text: '$+', value: 1 },
        { text: '$$+', value: 2 },
        { text: '$$$+', value: 3 },
        { text: '$$$$+', value: 4 }
      ],
      filterPriceLevel: 0,

      filterSortBy: 'distance',
      sortByList: [
        { text: this.$t('GENERAL.SortByDist'), value: 'distance' },
        { text: this.$t('GENERAL.SortByRating'), value: 'rating' }
      ],

      reportedMissingPlace: false,
      nameRules:[
        v => !!v || 'Restaurant\'s name is required',
        v => (v && v.length <= 20) || 'Restaurant\'s name must be less than 20 characters'
      ],
      labelRules:[
        v => (v && v.length <= 50) || 'Label must be less than 50 characters'
      ]
    }
  },
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
    search(Text) {
      if (!Text) {
        Text = this.keyword
      }
      this.keyword = Text
      this.blur()
      this.SearchEngine.clear()
      console.log('perform searching.', Text)

      if (Text != i18n.t('QUICKDIRECT.NearbyText')) {
        for (let {key, text, searchText } of QUICK_DIRECT) {
          
          if (Text === searchText) {

            this.filterFilterBy = key
            this.searchNearby(this.SearchEngine.mapLat, this.SearchEngine.mapLng)
            return
          }
        }
      }
      if (Text === i18n.t('QUICKDIRECT.NearbyText')) {
        
        this.searchNearby(this.SearchEngine.mapLat, this.SearchEngine.mapLng)
      } else if (Text === '我附近的' + this.NAME) {
        this.searchNearbyGPS()
      } else {
        this.SearchEngine.search({
          keyword: Text,
          rating: this.filterRating,
          price_level: this.filterPriceLevel,
          sort_by: this.filterSortBy,
          filter_by: this.filterFilterBy
        })
      }
      this.reportedMissingPlace = false
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
      if (!this.reportName) {
        return
      }

      this.reportedMissingPlace = false
      this.snackbar = true
      return new Promise((resolve, reject) => {
        axios
          .post(`${this.APIBASE}/feedback/missing_place`, {
            name: this.reportName,
            label: this.reportLabel
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
