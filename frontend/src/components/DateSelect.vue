<template>
    <v-row>
    <v-col
        cols="12"
        sm="6"
        md="4"
    >
        <v-menu
            ref="menu"
            v-model="menu"
            :close-on-content-click="false"
            :return-value.sync="date"
            transition="scale-transition"
            offset-y
            min-width="auto"
        >
                <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                        v-model="date"
                        label='시작'
                        readonly
                        v-bind="attrs"
                        outlined
                    >
                    <template v-slot:append>
                        <v-btn color="error" v-on="on" icon small>
                            <v-icon>mdi-calendar</v-icon>
                        </v-btn>
                    </template>
                    </v-text-field>
                </template>
                <v-date-picker
                    v-model="date"
                    no-title
                    scrollable
                >
                    <v-spacer></v-spacer>
                    <v-btn
                        text
                        color="primary"
                        @click="menu = false"
                    >Cancel</v-btn>
                    <v-btn
                        text
                        color="primary"
                        @click="calcDate(); $refs.menu.save(date); sendDate() "
                    >OK
                    </v-btn>
                </v-date-picker>
        </v-menu>
    </v-col>
    <v-col
        cols="12"
        sm="6"
        md="4"
    >
        <v-menu
            ref="menu2"
            v-model="menu2"
            :close-on-content-click="false"
            :return-value.sync="date2"
            transition="scale-transition"
            offset-y
            min-width="auto"
        >
                <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                        v-model="date2"
                        label='종료'
                        readonly
                        v-bind="attrs"
                        outlined
                    >
                    <template v-slot:append>
                        <v-btn color="error" v-on="on" icon small>
                            <v-icon>mdi-calendar</v-icon>
                        </v-btn>
                    </template>
                    </v-text-field>
                </template>
                <v-date-picker
                    v-model="date2"
                    no-title
                    scrollable
                >
                    <v-spacer></v-spacer>
                    <v-btn
                        text
                        color="primary"
                        @click="menu2 = false"
                    >Cancel</v-btn>
                    <v-btn
                        text
                        color="primary"
                        @click="calcDate(); $refs.menu2.save(date2); sendDate()"
                    >OK
                    </v-btn>
                </v-date-picker>
        </v-menu>
    </v-col>
    </v-row>
</template>

<script>
export default {
  data: () => ({
    date: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
    date2: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
    menu: false,
    modal: false,
    menu2: false
  }),
  methods: {
    sendDate () {
      this.$emit('receiveDate', this.date, this.date2)
    },
    calcDate () {
      var d1 = Date.parse(this.date)
      var d2 = Date.parse(this.date2)
      if (d1 > d2) {
        this.date = this.date2
      }
    }
  },
  mounted () {
    this.sendDate()
  }
}
</script>
