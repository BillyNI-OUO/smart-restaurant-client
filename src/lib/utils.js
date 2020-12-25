export const aspectRatingsList = [
  { text: '食物', key: 'food' },
  { text: '服務', key: 'service' },
  { text: '氣氛', key: 'atmosphere' },
  { text: '清潔', key: 'cleanliness' },
  { text: '價值', key: 'value' }
]

export const aspectRatingsDict = (() => {
  let dict = {}
  aspectRatingsList.map((v) => (dict[v.key] = v.text))
  return dict
})()

export function aspectRatingDescription(placeInfo, rich = false) {
  // 😄😫😐😡🤢
  /*
      function getRatingDescription(rating) {
        if (rating >= 4.5) {
          return '超讚'
        } else if (rating < 4.5 && rating >= 3.5) {
          return '良好'
        } else if (rating < 3.5 && rating >= 2.5) {
          return '普通'
        } else if (rating < 2.5 && rating >= 1.5) {
          return '不佳'
        } else if (rating < 1.5) {
          return '極差'
        }
      }
      */
  // 😄😐😡
  // ✔✔️⚠️❌
  function getRatingDescription(rating) {
    if (rating >= 4.5) {
      return rich
        ? `
        <span>
          <i aria-hidden="true" class="v-icon notranslate mdi mdi-check-all theme--light" style="color: green; position: relative; top: -2px;"></i>
        </span >
        `
        : '✔️✔️'
    } else if (rating < 4.5 && rating >= 3.5) {
      return rich
        ? `
        <span>
          <i aria-hidden="true" class="v-icon notranslate mdi mdi-check theme--light" style="color: green; position: relative; top: -2px;"></i>
        </span >
        `
        : '✔️'
    } else if (rating < 3.5 && rating >= 2.5) {
      return rich
        ? `
        <span>
          <i aria-hidden="true" class="v-icon notranslate mdi mdi-alert theme--light" style="color: #ffe000; position: relative; top: -2px;"></i>
        </span >
        `
        : '⚠️'
    } else if (rating < 2.5) {
      return rich
        ? `
        <span>
          <i aria-hidden="true" class="v-icon notranslate mdi mdi-close theme--light" style="color: red; position: relative; top: -2px;"></i>
        </span >
        `
        : '❌'
    }
  }

  let aspectKeyRatingList = aspectRatingsList.map((v) => ({
    key: v.key,
    rating: placeInfo[`${v.key}_rating`],
    count: placeInfo[`${v.key}_count`]
  }))
  aspectKeyRatingList = aspectKeyRatingList.filter((v) => v.count >= 20)
  aspectKeyRatingList.sort((a, b) => b.rating - a.rating)

  if (aspectKeyRatingList.length === 0) {
    return ''
  } else if (aspectKeyRatingList.length === 1) {
    return (
      aspectRatingsDict[aspectKeyRatingList[0].key] +
      getRatingDescription(aspectKeyRatingList[0].rating)
    )
  } else {
    return (
      aspectRatingsDict[aspectKeyRatingList[0].key] +
      getRatingDescription(aspectKeyRatingList[0].rating) +
      ' · ' +
      aspectRatingsDict[
        aspectKeyRatingList[aspectKeyRatingList.length - 1].key
      ] +
      getRatingDescription(
        aspectKeyRatingList[aspectKeyRatingList.length - 1].rating
      )
    )
  }
}
