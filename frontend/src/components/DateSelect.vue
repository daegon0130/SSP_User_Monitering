<template>
<v-container>
    <v-row>
    <v-col
        cols="4"
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
        cols="4"
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
    <v-col
        cols="2"
    >
    <v-select
        v-model="timelength"
        :items="items"
        item-text="dis"
        item-value="key"
        label="기간"
        outlined
        v-on:change="sendTimeLength"
    ></v-select>
    </v-col>
    </v-row>
    <v-container v-if="timelength === 'hour'">
    <v-row>
        <v-col
            cols="4"
        >
        <v-menu
            v-model="menu3"
        >
        <template v-slot:activator="{ on }">
            <v-text-field
                :value="time1"
                label="시작시간"
                readonly
                v-on="on"
            ></v-text-field>
        </template>
        <v-time-picker
            v-if="menu3"
            :value="time1"
            @click:hour="closePicker1"
        ></v-time-picker>
        </v-menu>
        </v-col>
        <v-col
            cols="4"
        >
        <v-menu
            v-model="menu4"
        >
        <template v-slot:activator="{ on }">
            <v-text-field
                :value="time2"
                label="시작시간"
                readonly
                v-on="on"
            ></v-text-field>
        </template>
        <v-time-picker
            v-if="menu4"
            :value="time2"
            @click:hour="closePicker2"
        ></v-time-picker>
        </v-menu>
        </v-col>
    </v-row>
    </v-container>
</v-container>
</template>

<script>
export default {
  data: () => ({
    date: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
    date2: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
    timelength: 'day',
    menu: false,
    modal: false,
    menu2: false,
    time1: null,
    time2: null,
    menu3: false,
    menu4: false,
    items: [
      { dis: '시간', key: 'hour' },
      { dis: '일', key: 'day' },
      { dis: '주', key: 'week' },
      { dis: '월', key: 'month' }
    ]
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
    },
    sendTimeLength () {
      this.$emit('sendTimeLength', this.timelength)
    },
    closePicker1: function (v) {
      v = v < 10 ? '0' + v : v
      this.time1 = v + ':00'
      this.menu3 = false
      this.$emit('receiveTime', this.time1, this.time2)
    },
    closePicker2: function (v) {
      v = v < 10 ? '0' + v : v
      this.time2 = v + ':00'
      this.menu4 = false
      this.$emit('receiveTime', this.time1, this.time2)
    }
  },
  mounted () {
    this.sendDate()
    this.sendTimeLength()
  }
}
</script>
