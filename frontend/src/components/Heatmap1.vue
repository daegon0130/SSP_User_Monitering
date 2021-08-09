<template>
<v-app>
  <v-container>
  <div>준비중입니다</div>
  <v-btn v-on:click="sortarray">
    dd</v-btn>
  </v-container>
</v-app>
</template>
<script>
export default {
  data: () => ({
    elements:
    {
      time: '2021-08-06',
      '0000001': 2,
      '0000002': 2,
      '0000003': 3,
      '0000004': 5,
      '0000005': 2,
      '0000006': 4,
      '0000007': 3,
      '0000008': 9,
      '0000009': 6,
      '0000010': 2,
      '0000011': 3,
      '0000012': 10,
      '0000013': 4,
      '0000014': 1,
      '0000015': 5,
      '0000016': 3,
      '0000017': 4
    }
  }),
  methods: {
    sortarray () {
      this.elements.sort()
      console.log(this.elements)
    }
  }
}
</script>
