<template>
    <div ref="Calendar">
        <section>
            <div class="box" style="justify-content: space-around">
                <nav class="level">
                    <div class="level-left">
                        <div class="buttons">
                            <b-button type="is-primary" outlined size="is-medium" @click="isAddLabel = true">新標籤</b-button>
                            <b-button type="is-primary" outlined size="is-medium" @click="isAddTask = true">新工作</b-button>
                        </div>
                    </div>
                    <div class="level-right">
                        <div class="heading">本月開頭星期</div>
                        <div class="level-item">
                            <b-field>
                                <b-numberinput placeholder="本月開頭星期幾？" v-model.number="firstDay"></b-numberinput>
                            </b-field>
                        </div>
                        <div class="heading">本月日數</div>
                        <div class="level-item">
                            <b-field>
                                <b-numberinput placeholder="本月有幾天？" v-model.number="numberOfDays"></b-numberinput>
                            </b-field>
                        </div>
                    </div>
                </nav>
            </div>
            <div class="box">
                <div class="columns">
                    <div class="column has-text-centered" v-for="(j,index) in date" :key="index">
                        <p class="heading">
                            {{ j }}
                        </p>
                    </div>
                </div>
                <div class="columns is-multiline has-text-centered is-variable is-2">
                    <div class="column is-1" v-for="(i,index) in firstDay-1" :key="index" style="width:14.286%">
                        <div class="box" style="height:26.2rem;overflow:auto;">
                            <div class="has-text-centered content">
                                <p class="title"></p>
                            </div>
                        </div>
                    </div>
                    <div class="column is-1" v-for="(i,index) in numberOfDays" :key="index" style="width:14.286%">
                        <div class="box" v-if="i!==0">
                            <div class="has-text-centered content" @dblclick="setRed(i)">
                                <p class="title" ref="haha">{{ i }}</p>
                            </div>
                            <child-task :date="i" :labels="labels" :numberOfDays="numberOfDays"></child-task>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <section class="section">
            <b-field label="標籤">
                <b-select placeholder="選擇種類" expanded v-model="taskLabel">
                    <option
                        v-for="(label) in labels"
                        :value="label"
                        :key="label.name"
                    >
                        {{ label.name }}
                    </option>
                </b-select>
            </b-field>
            <b-field label="工作標題">
                <b-input v-model="taskTitle"></b-input>
            </b-field>
            <b-field label="工作說明">
                <b-input v-model="taskExplanation"></b-input>
            </b-field>
            <b-field label="工作日期">
                <b-select placeholder="選擇日期" expanded v-model.number="taskDay">
                    <option
                        v-for="(i,index) in numberOfDays"
                        :value="i"
                        :key="index"
                    >
                        {{ i }}
                    </option>
                </b-select>
            </b-field>
        </section>

        <section class="section">
            <b-field label="標籤名稱">
                <b-input v-model="labelName"></b-input>
            </b-field>
            <b-field label="標籤icon">
                <b-input v-model="labelIcon"></b-input>
            </b-field>
            <b-field label="標籤顏色">
                <v-input-colorpicker v-model="labelColor" />
            </b-field>
        </section>
        

        <!-- <b-modal v-model="isEditTask" :width="400">
            <header class="modal-card-head" style="justify-content: space-between;">
                <p class="modal-card-title">編輯工作</p>             
            </header>

            <section class="modal-card-body">
                <b-field label="標籤">
                    <b-select placeholder="選擇種類" expanded v-model="taskId">
                        <option
                            v-for="(val, key) in labels"
                            :value="key"
                            :key="key"
                        >
                            {{ key }}
                        </option>
                    </b-select>
                </b-field>
                <b-field label="工作標題">
                    <b-input v-model="taskTitle"></b-input>
                </b-field>
                <b-field label="工作說明">
                    <b-input v-model="taskExplanation"></b-input>
                </b-field>
                <b-field label="工作日期">
                    <b-select placeholder="選擇日期" expanded v-model.number="taskDay">
                        <option
                            v-for="(i,index) in 31"
                            :value="i"
                            :key="index"
                        >
                            {{ i }}
                        </option>
                    </b-select>
                    <b-input v-model.number="taskDay"></b-input>
                </b-field>
            </section>

            <footer class="modal-card-foot" style="justify-content: space-between;">
                <div>
                    <b-button type="is-success" @click="editTask" outlined>
                        確認
                    </b-button>
                </div>
                <div>
                    <b-button type="is-primary" @click="isEditTask = false" outlined>
                        取消
                    </b-button>
                </div>
            </footer>
        </b-modal> -->

    </div>
</template>

<script>
import '../../node_modules/bulma-tooltip/dist/css/bulma-tooltip.min.css';
import InputColorPicker from 'vue-native-color-picker';
import Task from './Task';


export default {
    name: 'Calendar',
    components: {
        'v-input-colorpicker': InputColorPicker,
        'child-task': Task
    },
    created() {
        const date = new Date();      
        date.setMonth(date.getMonth()+1);
        date.setDate(0);
        this.numberOfDays=date.getDate();
    },
    data: function() {
        return {
            firstDay: 1,
            numberOfDays: undefined,
            taskLabel: undefined,
            taskTitle: '',
            taskExplanation: '',
            taskDay: 0,
            labelName: '',
            labelIcon: '',
            labelColor: '',

            labels: [
                {
                    name: '寫作',
                    icon: '○',
                    color: '#CD9DBE'
                }, {
                    name: '靈感',
                    icon: '●',
                    color: '#CD9DBE'
                }, {
                    name: '閱讀',
                    icon: '▲',
                    color: '#89D2AF'
                },
            ],
            date: [
                '星期一',
                '星期二',
                '星期三',
                '星期四',
                '星期五',
                '星期六',
                '星期日',
            ],
        };
    },
    methods: {
        compareDay(days) {
            return days > 0 && days < this.numberOfDays;
        },
        setRed(val) {
            this.$refs.haha[val].style.color = 
            this.$refs.haha[val].style.color === 'red' ? 'black' : 'red';
        },
    },
};


</script>


<style scoped>

.modal-card-body {
  overflow: auto;
}
.tooltip-own > * {
    z-index: 1000; 
}
</style>

// #CD9DBE
// #89D2AF