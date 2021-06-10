<template>
    <div ref="tagParent">
        <div class="content">
            <b-button class="is-primary" outlined expanded @click="isOpenTagModal = true">{{ fileName }}
            </b-button>
        </div>

        <div class="selectTagBox" ref="selbox" v-if="isTagOpen">
            <span v-for="(tag, index) in tagOptions" :key="index">
                <b-radio type="radio" v-model="selectTag" :native-value="tag.tagName">
                    {{ tag.tagLabel }}</b-radio>
            </span>
            <div>
                <b-button type="is-small" @click="setTag">確認</b-button>
                <b-button type="is-small" @click="isTagOpen = false">取消</b-button>
            </div>
        </div>

        <div class="selectTagBox" ref="checkTagBox" v-if="isCheckTagName">
            <span>{{ showTagName }}</span>
        </div>

        <b-modal v-model="isOpenTagModal" :width="1000" scroll="keep">
            <header class="modal-card-head">
                <nav class="level">
                    <div class="level-left">
                        <div class="level-item">
                            <p class="modal-card-title">編輯Tag</p>
                        </div>
                        <div class="level-item">
                            <h6>劃記後選擇Tag名稱，再次點擊Tag即可刪除</h6>
                        </div>
                    </div>
                </nav>
            </header>
            <section class="modal-card-body">
                <div>
                    <div ref="text" style="white-space:pre-wrap;" v-html="content"
                         @mouseup="print"
                    ></div>
                </div>
            </section>
                
            <!-- <div class="is-divider"></div>
                    <div class="content">
                        <ul v-for="(value, name, index) in extractCompleteTags" :key="index">
                            <li>標籤名稱是: {{ name }}，標籤內容為: {{ value }}</li>
                        </ul>
                    </div> -->
            <footer class="modal-card-foot">
                <b-button type="is-success" outlined @click="saveTag">保存Tag</b-button>
                <b-button type="is-primary" outlined @click="isOpenTagModal = false">取消</b-button>
            </footer>
        </b-modal>
    </div>
</template>

<script>
import {
    searchAndTag
} from './../tool';
export default {
    name: 'TagEdit',
    watch: {
        isOpenTagModal: function(val) {
            this.$nextTick(()=>{
                if(val) this.actionShowTag();
            });
            if(!val) this.isTagOpen = false;
        }
    },
    data: function() {
        return {
            wordSelection: undefined,
            wordRange: undefined,
            selectTag: '',
            isTagOpen: false,
            isOpenTagModal: false,
            extractCompleteTags: {
            },
            isMouseMove: false,
            isCheckTagName: false,
            showTagName: '',
            markBucket: {
            },
        };
    },
    props: ['fileName', 'content', 'index', 'tagOptions'],
    methods: {
        handleOut: function(evt) {
            console.log('out', evt.target.tagName);
            this.isCheckTagName = false;
            evt.target.removeEventListener('mouseleave', this.handleOut);
        },
        handleIn: function(evt) {
            if(evt.target.tagName !== 'MARK') return;
            console.log('in', evt.target.tagName);
            this.isCheckTagName = true;
            this.showTagName = evt.target.attributes.tag.value;
            this.$nextTick(()=>{
                this.$refs.checkTagBox.style.left = `${evt.clientX + 20}px`;
                this.$refs.checkTagBox.style.top = `${evt.clientY + 20}px`;
                // evt.target.addEventListener('mouseleave', this.handleOut);
            });
            setTimeout(()=>{
                this.isCheckTagName = false;
            }, 1000);
        },
        print: function (evt) {
            if(evt.target.tagName==='MARK') {
                this.deleteTag(evt);
                return;    
            }
            this.wordSelection = window.getSelection();
            const {width} = this.wordSelection.getRangeAt(0).getBoundingClientRect();
            if(!width) return;
            this.isTagOpen = true;
            this.$nextTick(()=>{
                this.$refs.selbox.style.left = `${evt.clientX + 20}px`;
                this.$refs.selbox.style.top = `${evt.clientY + 20}px`;
            });
        },
        deleteTag: function (evt) {
            this.$refs.text.insertBefore(document.createTextNode(evt.target.innerText), evt.target);
            this.$refs.text.removeChild(evt.target);
        },
        setTag: function () {
            let selectText = this.wordSelection.toString();
            let markNode = document.createElement('mark');
            markNode.setAttribute('tag', this.selectTag);
            markNode.appendChild(document.createTextNode(selectText));
            this.wordSelection.deleteFromDocument();
            this.wordSelection.getRangeAt(0).insertNode(markNode);
            this.isTagOpen = false;
            this.searchAndTag(this.selectTag, selectText);
            this.extractCompleteTags[this.selectTag] = this.extractCompleteTags[this.selectTag]
                ? this.extractCompleteTags[this.selectTag] + ', ' + selectText
                : selectText;
        },
        searchAndTag: function (tagName, tagWord) {
            this.$refs.text.innerHTML = searchAndTag(tagName, tagWord, this.$refs.text.innerHTML);
        },
        actionShowTag: function() {
            this.$refs.text.addEventListener('mouseover', this.handleIn);
        },
        saveTag: function(){
            this.$emit('handle-tag', {
                newContent: this.$refs.text.innerHTML,
                index: this.index
            });
            this.isOpenTagModal = false;
        }
    }
};
</script>


<style scoped>
.selectTagBox {
    position: fixed;
    max-width: 500px;
    max-height: 400px;
    z-index: 1000;
    border: #cfe65b 2px solid;
    background-color: white;
    padding: 10px;
}

.modal-card-body {
  height: 550px;
  overflow: auto;
}
</style>
