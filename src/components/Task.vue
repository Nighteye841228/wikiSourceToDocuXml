<template>
    <div>
        <div style="height:20em;overflow:auto;">
            <draggable
                v-model="tasks"
                v-bind="dragOptions"
                @start="drag = true"
                @end="drag = false"
            >
                <transition-group 
                    class="columns is-multiline"
                    type="transition" :name="!drag ? 'flip-list' : null"
                >
                    <div class="column is-12" v-for="(item) in tasks" :key="item.unique">
                        <b-tooltip 
                            class="tooltip-own"
                            position="is-right"
                            size="is-medium"
                            multilined
                            type="is-primary"
                            :triggers="['hover']"
                        >
                            <template v-slot:content>
                                <p>{{item.explanation}}</p>
                            </template>
                            <b-button expanded @click="changeIcon(item)" style="width:7.8em">
                                <span :style="{color: item.label.color}">{{item.label.icon}}</span>
                                {{item.title}}
                            </b-button>
                        </b-tooltip>
                    </div>
                </transition-group>

            </draggable>
        </div>

        

        <b-collapse :open.sync="isEditTask" aria-id="contentIdForA11y1">
            <template #trigger>
                <div class="container is-fullwidth">
                    <b-button
                        type="is-primary"
                        size='is-small'
                        aria-controls="contentIdForA11y1"
                        outlined
                    ><b-icon icon="pen" pack="fas"></b-icon>
                    </b-button>
                </div>
            </template>
            <div class="container is-fullwidth">
                <b-field label="標籤">
                    <b-select placeholder="種類" expanded v-model="taskLabel">
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
                <b-field>
                    <b-button type="is-primary" outlined @click="confirmEdit">確認</b-button>
                    <b-button type="is-danger" outlined @click="deleteTask">刪除</b-button>
                </b-field>
            </div>
        </b-collapse>

        
    </div>
</template>

<script>
import draggable from 'vuedraggable';
function getRandomInt(max) {
    return 10*Math.floor(Math.random() * max);
}

export default {
    name: 'Task',
    props: ['date', 'labels', 'numberOfDays', 'inheritTask'],
    components: {
        draggable,
    },
    computed: {
        dragOptions() {
            return {
                animation: 200,
                group: 'description',
                disabled: false,
                ghostClass: 'ghost'
            };
        },
    },
    data: function() {
        return {
            drag: false,

            isEditTask: false,
            taskLabel: undefined,
            taskTitle: '',
            taskExplanation: '',
            taskDay: 0,
            taskUnique: undefined,
            tasks: this.inheritTask || []
        };
    },
    methods: {
        changeIcon(item) {
            if(item.label.name === '靈感') {
                item.label = this.labels.find(({name})=> name=== '寫作');
            } else if(item.label.name === '寫作') {
                item.label = this.labels.find(({name})=> name=== '靈感');
            }
            this.setTask(item);
        },
        setTask(item) {
            this.taskTitle = item.title,
            this.taskExplanation = item.explanation;
            this.taskDay = this.date;
            this.taskLabel = item.label;
            this.taskUnique = item.unique;
        },
        confirmEdit() {
            let oldItem = this.tasks.find(({unique})=>{return unique === this.taskUnique;});
            if(this.taskDay !== this.date) {
                this.tasks = this.tasks.filter(({unique})=>{return unique !== this.taskUnique;});
                this.$emit('handleTransTask', {
                    date: this.taskDay,
                    title: this.taskTitle,
                    explanation: this.taskExplanation,
                    label: this.taskLabel,
                    unique: this.taskUnique
                });
                this.isEditTask = false;
                return;
            }
            oldItem.title = this.taskTitle;
            oldItem.explanation = this.taskExplanation;
            oldItem.label = this.taskLabel;
            this.isEditTask = false;
        },
        confirmAdd() {
            let temp = {
                title: this.taskTitle,
                explanation: this.taskExplanation,
                label: this.taskLabel,
                unique: this.taskUnique || this.taskTitle + getRandomInt(10000)
            };
            this.tasks.push(temp);
        },
        deleteTask() {
            if(!this.taskUnique) return;
            this.tasks = this.tasks.filter(({unique})=>{return unique !== this.taskUnique;});
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

.flip-list-move {
  transition: transform 0.5s;
}
.no-move {
  transition: transform 0s;
}
.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}

</style>

// #CD9DBE
// #89D2AF