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

        <b-modal v-model="isOpenTagModal" :width="1000" scroll="keep">
            <div class="card">
                <div class="card-content">
                    <div class="media">
                        <div class="media-content">
                            <label class="label is-large">編輯Tag｜劃記後選擇Tag名稱，再次點擊Tag即可刪除</label>
                        </div>
                    </div>
                    <div>
                        <div ref="text" style="white-space:pre-wrap;" v-html="content"
                             @mouseup="print"
                        ></div>
                    </div>
                    <!-- <div class="is-divider"></div>
                    <div class="content">
                        <ul v-for="(value, name, index) in extractCompleteTags" :key="index">
                            <li>標籤名稱是: {{ name }}，標籤內容為: {{ value }}</li>
                        </ul>
                    </div> -->
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
            selectTag: '',
            isTagOpen: false,
            isOpenTagModal: false,
            extractCompleteTags: {
            },
            isMouseMove: false,
        };
    },
    props: ['fileName', 'content', 'index', 'tagOptions'],
    methods: {
        print: function (evt) {
            if(evt.toElement.tagName==='MARK') {
                this.deleteTag(evt);
                return;    
            }
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
            let x = window.getSelection();
            console.log(x);
        },
        deleteTag: function (evt) {
            this.$refs.text.insertBefore(document.createTextNode(evt.toElement.innerText), evt.toElement);
            this.$refs.text.removeChild(evt.toElement);
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
            this.$refs.text.innerHTML = 
                this.$refs.text.innerHTML
                    .replace(new RegExp(tagWord, 'g'), `<mark tag="${tagName}">${tagWord}</mark>`)
                    .replace(/(<mark[^>]*>)<mark[^>]*>/g, '$1')
                    .replace(/<\/mark><\/mark>/g, '</mark>');
        },
        // extractTag: function () {
        //     let ht = this.$refs.text.getInnerHTML();
        //     let tagTexts = ht.match(/<mark[^>]*>[^<]*<\/mark>/g);
        //     tagTexts.forEach(element => {
        //         let tag = element.match(/<mark tag="([^"]*)">([^<]*)<\/mark>/);
        //         if(tag){
        //             let tagName = tag[1];
        //             let tagValue = tag[2];
        //             this.extractCompleteTags[tagName] = this.extractCompleteTags[tagName] + ',' + tagValue;
        //         }
        //     });
        // },
        saveTag: function(){
            this.$emit('handle-tag', {
                newContent: this.$refs.text.getInnerHTML(),
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
</style>
