<template>
  <v-app>
    <div>
      <v-container>
    <v-text-field v-model='title' label='제휴사 이름'/>
    <v-text-field v-model="code" label="제휴사 ID"/>
    <v-btn v-on:click="addclient">제출</v-btn>
      </v-container>
    </div>
  </v-app>
</template>

<script>

export default {
  data: () => ({
    title: '',
    code: ''
  }),
  methods: {
    addclient () {
      this.$store.commit('addclient', { id: this.code, title: this.title })
      this.title = ''
      this.code = ''
    }
  }
}
</script>
