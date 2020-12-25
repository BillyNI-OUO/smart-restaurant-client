<template>
  <v-layout wrap class="panel detail">
    <v-flex xs12 pb-3>
      <v-layout wrap>
        <v-flex
          xs12
          class="detail-cover"
          style="background-image: url(https://lh5.googleusercontent.com/p/AF1QipNUa5VRyTSXLuyL0eTX_4Et2ixZp_Gs0uaf3Wf3=w122-h92-k-no);"
        >
          <v-container>
            <v-btn
              depressed
              @click="$router.back()"
              style="background-color: #ffffffdd;"
            >
              <v-icon>mdi-arrow-left</v-icon>
              返回上一頁
            </v-btn>
            <v-btn
              depressed
              @click="close"
              style="background-color: #ffffffdd; float: right;"
            >
              <v-icon>mdi-close</v-icon>
              關閉
            </v-btn>
          </v-container>
        </v-flex>
        <v-flex xs12 v-if="placeInfo">
          <v-container>
            <h2>{{ placeInfo.name }}</h2>
            <p>
              <span>
                <span class="yellow--text text--darken-4">
                  {{ placeInfo.rating }}
                </span>
                <v-rating
                  style="display: inline; position: relative; top: -2px;"
                  dense
                  empty-icon="mdi-star-outline"
                  full-icon="mdi-star"
                  half-icon="mdi-star-half-full"
                  hover
                  length="5"
                  :value="placeInfo.rating"
                  readonly
                  size="18"
                  background-color="yellow darken-4"
                  color="yellow darken-4"
                  half-increments
                ></v-rating>
                <span class="grey--text text--darken-1">
                  ({{ placeInfo.user_ratings_total }})
                </span>
                <span
                  v-if="placeInfo.price_level"
                  class="grey--text text--darken-1"
                >
                  ·
                  {{ '$'.repeat(placeInfo.price_level) }}
                </span>
              </span>
              <br />
              <span v-html="aspectRatingDescription(placeInfo, true)"> </span>
            </p>
          </v-container>

          <v-list>
            <v-divider></v-divider>

            <v-list-item
              :href="
                `https://www.google.com.tw/maps/search/${placeInfo.name} ${placeInfo.formatted_address}`
              "
              target="_blank"
            >
              <v-list-item-icon>
                <v-icon color="primary">mdi-map</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>
                  在 Google Map 中開啟
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>

            <v-divider></v-divider>

            <v-list-item>
              <v-list-item-icon>
                <v-icon color="primary">mdi-map-marker</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>
                  {{ placeInfo.formatted_address }}
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>

            <v-divider></v-divider>

            <v-list-item>
              <v-list-item-icon>
                <v-icon color="primary">mdi-pencil</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>
                  提出修改建議
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>

            <v-divider></v-divider>
          </v-list>

          <v-container>
            <h3 class="mt-3 mb-2">評論摘要</h3>

            <v-layout wrap>
              <v-flex
                v-for="item in aspectRatingsList.filter(
                  (item) => placeInfo[`${item.key}_rating`]
                )"
                :key="item.key"
                style="text-align: center;"
              >
                <div style="font-size: 15px;">
                  {{ item.text }}
                </div>
                <div
                  style="font-size: 24px; line-height: 30px;"
                  class="yellow--text text--darken-4"
                >
                  {{ placeInfo[`${item.key}_rating`].toFixed(1) }}
                </div>
                <!--
                <v-rating
                  style="position: relative; top: -7px; height: 14px;"
                  dense
                  empty-icon="mdi-star-outline"
                  full-icon="mdi-star"
                  half-icon="mdi-star-half-full"
                  hover
                  length="5"
                  :value="placeInfo[`${item.key}_rating`]"
                  readonly
                  size="14"
                  background-color="yellow darken-4"
                  color="yellow darken-4"
                  half-increments
                ></v-rating>
                -->
                <div class="grey--text" style="font-size: 14px;">
                  ({{ placeInfo[`${item.key}_count`] }})
                </div>
              </v-flex>
            </v-layout>
            <!--
            <p>
              <template v-for="item in aspectRatingsList">
                <div
                  :key="item.key"
                  class="mb-2"
                  v-if="placeInfo[`${item.key}_rating`]"
                >
                  {{ item.text }}
                  {{ placeInfo[`${item.key}_rating`].toFixed(1) }}
                  <v-rating
                    style="display: inline; position: relative; top: -2px;"
                    dense
                    empty-icon="mdi-star-outline"
                    full-icon="mdi-star"
                    half-icon="mdi-star-half-full"
                    hover
                    length="5"
                    :value="placeInfo[`${item.key}_rating`]"
                    readonly
                    size="18"
                    background-color="yellow darken-4"
                    color="yellow darken-4"
                    half-increments
                  ></v-rating>
                  ({{ placeInfo[`${item.key}_count`] }})
                </div>
              </template>
            </p>
                -->
          </v-container>

          <v-container mb-3>
            <v-card>
              <v-card-title>您覺得這些資訊有用嗎？</v-card-title>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn text>
                  <v-icon class="mr-1">mdi-emoticon-sad-outline</v-icon>沒有用
                </v-btn>
                <v-btn outlined>
                  <v-icon class="mr-1">mdi-emoticon-happy-outline</v-icon>有幫助
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-container>

          <v-divider></v-divider>

          <v-container style="display: none;">
            <h3 class="mt-3 mb-2">評論摘要</h3>
          </v-container>
        </v-flex>
      </v-layout>
    </v-flex>
  </v-layout>
</template>

<script>
import bus from '../lib/bus'
import SearchEngine from '../lib/search'
import {
  aspectRatingsList,
  aspectRatingsDict,
  aspectRatingDescription
} from '../lib/utils'
import axios from 'axios'
import Vue from 'vue'

export default {
  name: 'Detail',
  data: () => ({
    cid: '',
    placeInfo: {}
  }),
  components: {},
  computed: {
    SearchEngine() {
      return SearchEngine
    },
    aspectRatingsDict() {
      return aspectRatingsDict
    },
    aspectRatingsList() {
      return aspectRatingsList
    },
    aspectRatingDescription() {
      return aspectRatingDescription
    }
  },
  methods: {
    load(cid) {
      // cid = '12930000113132718392'
      axios.get(`${window.APIBASE}/detail/${cid}`).then((res) => {
        Vue.set(this, 'placeInfo', res.data)
      })
    },
    close() {
      bus.$emit('search-clear')
      this.SearchEngine.clear()
      this.$router.push('/')
    }
  },
  mounted() {
    // this.cid = this.$route.params.cid
    // this.load(this.cid)
  },
  created() {
    this.cid = this.$route.params.cid
    this.load(this.cid)
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      if (vm.cid === to.params.cid) {
        return
      }
      vm.cid = to.params.cid
      vm.load(to.params.cid)
    })
  },
  beforeRouteUpdate(to, from, next) {
    console.log('beforeRouteUpdate!', to.params.cid)
    this.cid = to.params.cid
    this.load(to.params.cid)
    next()
  }
}
</script>

<style scoped>
.detail-cover {
  height: 200px;
  background-size: cover;
}
</style>
