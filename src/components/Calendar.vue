<template>
    <div ref="Calendar">
        <section>
            <div class="box" style="justify-content: space-around">
                <nav class="level">
                    <div class="level-left">
                        <div class="level-item">
                            <b-collapse :open.sync="isAddLabel" aria-id="forNewLabel">
                                <template #trigger>
                                    <b-button
                                        outlined
                                        label="新標籤"
                                        type="is-primary"
                                        aria-controls="forNewLabel"
                                    />
                                </template>
                                <div class="notification">
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
                                        <b-field>
                                            <b-button outlined @click="addLabel">確認</b-button>
                                        </b-field>
                                    </section>
                                </div>
                            </b-collapse>
                        </div>
                        <div class="level-item">
                            <b-collapse :open.sync="isAddTask" aria-id="forNewTask">
                                <template #trigger>
                                    <b-button
                                        outlined
                                        label="新工作"
                                        type="is-primary"
                                        aria-controls="forNewTask"
                                    />
                                </template>
                                <div class="notification">
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
                                                    :value="index"
                                                    :key="index"
                                                >
                                                    {{ index+1 }}
                                                </option>
                                            </b-select>
                                        </b-field>
                                        <b-field><b-button outlined @click="addTask">確認</b-button></b-field>
                                    </section>
                                </div>
                            </b-collapse>
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
                        <div class="level-item">
                            <b-field>
                                <b-button @click="saveWork">存檔</b-button>
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
                    <div class="column is-1" v-for="(i,ind) in firstDay-1" :key="ind+'day'" style="width:14.286%">
                        <div class="box" style="height:26.2rem;overflow:auto;">
                            <div class="has-text-centered content">
                                <p class="title"></p>
                            </div>
                        </div>
                    </div>
                    <div class="column is-1" v-for="(i,index) in numberOfDays" :key="index" style="width:14.286%">
                        <div class="box">
                            <div class="has-text-centered content" @dblclick="setRed(index)">
                                <p class="title" ref="dateTitle">{{ index+1 }}</p>
                            </div>
                            <child-task 
                                :date="index" 
                                :labels="labels" 
                                :numberOfDays="numberOfDays" 
                                :inheritTask="allTasks[index]"
                                @handleTransTask="handleTransTask" 
                                ref="task"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>

    </div>
</template>

<script>
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
        date.setMonth(date.getMonth());
        date.setDate(1);
        this.firstDay = date.getDay();      
        date.setMonth(date.getMonth()+1);
        date.setDate(0);
        this.numberOfDays = date.getDate();

        if(this.$cookies.isKey('tasks')) this.allTasks = JSON.parse(this.$cookies.get('tasks'));
        if(this.$cookies.isKey('labels')) this.labels = JSON.parse(this.$cookies.get('labels'));
    },
    data: function() {
        return {
            isAddLabel: false,
            isAddTask: false,
            
            firstDay: 1,
            numberOfDays: undefined,
            taskLabel: undefined,
            taskTitle: '',
            taskExplanation: '',
            taskDay: 0,
            labelName: '',
            labelIcon: '',
            labelColor: '',
            allTasks: [
                [
                    
                ]
            ],

            labels: [
                {
                    name: '寫作',
                    icon: '●',
                    color: '#CD9DBE'
                }, {
                    name: '靈感',
                    icon: '○',
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
            this.$refs.dateTitle[val].style.color = 
            this.$refs.dateTitle[val].style.color === 'red' ? 'black' : 'red';
        },
        handleTransTask(task) {
            this.$refs.task[task.date].setTask(task);
            this.$refs.task[task.date].confirmAdd();
        },
        addTask() {
            const task = {
                label: this.taskLabel,
                title: this.taskTitle,
                explanation: this.taskExplanation,
                date: this.taskDay
            };
            this.handleTransTask(task);
            this.isAddTask = false;
        },
        addLabel() {
            this.labels.push({
                name: this.labelName,
                icon: this.labelIcon,
                color: this.labelColor,
            });
            this.isAddLabel = false;
        },
        saveWork() {
            this.$cookies.config(new Date(2026, 12, 28).toUTCString());
            this.allTasks = this.$refs.task.map((taskComponent)=>{
                return taskComponent.tasks;
            });
            this.$cookies.remove('tasks');
            this.$cookies.remove('labels');
            this.$cookies.set('tasks', JSON.stringify(this.allTasks));
            this.$cookies.set('labels', JSON.stringify(this.labels));
        }
    }
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