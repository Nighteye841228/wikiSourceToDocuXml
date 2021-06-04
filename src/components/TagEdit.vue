<template>
    <div ref="tagParent">
        <div class="content">
            <b-button class="is-primary" outlined expanded @click="isOpenTagModal = true">{{ fileName }}
            </b-button>
        </div>

        <div class="selectTagBox" ref="selbox" v-if="isTagOpen">
            <span v-for="(tag, index) in splitWikiTags" :key="index">
                <b-radio type="radio" v-model="selectTag" :native-value="tag">
                    {{ tag }}</b-radio>
            </span>
            <div>
                <b-button type="is-small" @click="setTag">確認</b-button>
                <b-button type="is-small" @click="isTagOpen = false">取消</b-button>
            </div>
        </div>

        <b-modal v-model="isOpenTagModal" :width="1000" scroll="keep">
            <div class="card">
                <div class="card-content">
                    <div class="media">
                        <div class="media-content">
                            <label class="label is-large">編輯Tag</label>
                        </div>
                    </div>
                    <div class="content">
                        <b-input placeholder="輸入需要的標籤（以逗號分隔）" v-model="wikiTags"></b-input>
                        <b-button type="is-success">確認</b-button>
                    </div>
                    <div>
                        <div ref="text" style="white-space:pre-wrap;" v-html="content"
                             @mouseup="print"
                        ></div>
                    </div>
                    <div class="content">
                        <h4>目前所選擇的tag為: {{ selectTag }}</h4>
                        <b-button @click="extractTag">輸出tag列表</b-button>
                        <ul v-for="(item,index) in extractCompleteTags" :key="index">
                            <li>標籤名稱是: {{ item.tagName }}，標籤內容為: {{ item.tagValue }}</li>
                        </ul>
                    </div>
                </div>
                <footer class="modal-card-foot">
                    <section>
                        <div class="block">
                            <b-button type="is-success" outlined @click="saveTag">保存Tag</b-button>
                        </div>
                    </section>
                </footer>
            </div>
        </b-modal>
    </div>
</template>

<script>
export default {
    name: 'TagEdit',
    data: function() {
        return {
            wordSelection: undefined,
            wordRange: undefined,
            wikiTags: '',
            selectTag: '',
            isTagOpen: false,
            isOpenTagModal: false,
            extractCompleteTags: [],
            isMouseMove: false,
        };
    },
    props: ['fileName', 'content', 'index'],
    methods: {
        print: function (evt) {
            // let oEvent = evt || window.event;
            // let eventDoc = (oEvent.target && oEvent.target.ownerDocument) || document;
            // let doc = eventDoc.documentElement;
            // let body = eventDoc.body;
            // let scrollLeft = oEvent.clientX + (doc && doc.scrollLeft || body && body.scrollLeft || 0) -
            //   (doc && doc.clientLeft || body && body.clientLeft || 0);
            // let scrollTop = oEvent.clientY + (doc && doc.scrollTop  || body && body.scrollTop  || 0) -
            //   (doc && doc.clientTop  || body && body.clientTop  || 0 );
            this.isTagOpen = true;
            // document.body.appendChild(this.$refs.selbox);
            this.$nextTick(()=>{
                this.$refs.selbox.style.left = `${evt.clientX}px`;
                this.$refs.selbox.style.top = `${evt.clientY}px`;
            });
            this.wordSelection = window.getSelection();
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
        },
        searchAndTag: function (tagName, tagWord) {
            this.$refs.text.innerHTML = 
                this.$refs.text.innerHTML
                    .replace(new RegExp(tagWord, 'g'), `<mark tag="${tagName}">${tagWord}</mark>`)
                    .replace(/(<mark[^>]*>)<mark[^>]*>/g, '$1')
                    .replace(/<\/mark><\/mark>/g, '</mark>');
        },
        extractTag: function () {
            let ht = this.$refs.text.getInnerHTML();
            let tagTexts = ht.match(/<mark[^>]*>[^<]*<\/mark>/g);
            tagTexts.forEach(element => {
                let tag = element.match(/<mark tag="([^"]*)">([^<]*)<\/mark>/);
                if(tag){
                    let tagName = tag[1];
                    let tagValue = tag[2];
                    this.extractCompleteTags.push({
                        tagName: tagName,
                        tagValue: tagValue
                    });
                }
            });
        },
        saveTag: function(){
            this.$emit('handle-tag', {
                newContent: this.$refs.text.getInnerHTML(),
                index: this.index
            });
            this.isOpenTagModal = false;
        }
    },
    computed: {
        splitWikiTags: function () {
            return this.wikiTags.split(',').filter(x=>x).map(x=>x.trim());
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
</style>
