<template>
  <div id="app">
    <section class="hero is-primary is-small">
      <!-- Hero head: will stick at the top -->
      <div class="hero-head">
        <nav class="navbar">
          <div class="container">
            <div class="navbar-menu">
              <div class="navbar-start">
                <div class="navbar-item">
                  <h4 class="title is-4">Wiki2DocuXml</h4>
                </div>
              </div>
              <div class="navbar-end">
                <a
                  class="navbar-item"
                  target="_blank"
                  href="https://docusky.org.tw/DocuSky/home/v4/"
                >
                  首頁
                </a>
                <a
                  class="navbar-item"
                  target="_blank"
                  href="https://docusky.org.tw/DocuSky/docuTools/userMain/"
                >
                  我的資料庫
                </a>
                <a
                  class="navbar-item"
                  target="_blank"
                  href="https://drive.google.com/file/d/1-CZDJmh4-jYTBDbXUCOb291mEt3k8S1W/view?usp=sharing"
                >
                  教學文件
                </a>
                <a
                  role="button"
                  class="navbar-burger"
                  aria-label="menu"
                  aria-expanded="false"
                >
                  <span aria-hidden="true"></span>
                  <span aria-hidden="true"></span>
                  <span aria-hidden="true"></span>
                </a>
              </div>
            </div>
          </div>
        </nav>
      </div>
    </section>
    <b-modal v-model="isAddExtendedLinks" :width="1000" scroll="keep">
      <header class="modal-card-head">
        <p class="modal-card-title">
          選擇需要的書本（或單篇），並於下一頁選擇書本需要的篇章
        </p>
        <button
          class="delete"
          aria-label="close"
          @click="confirmAdd(0)"
        ></button>
      </header>
      <section class="modal-card-body">
        <div v-for="(link, index) in refLinks" :key="index">
          <b-checkbox
            size="is-medium"
            :native-value="link"
            v-model="selectRefLinks"
            >{{ link }}
          </b-checkbox>
        </div>
      </section>
      <footer class="modal-card-foot">
        <b-button
          type="is-primary"
          @click="selectRefLinks = refLinks.map((x) => x)"
          >全選
        </b-button>
        <b-button type="is-primary" @click="selectRefLinks = []"
          >全不選
        </b-button>
        <button class="button is-success" @click="confirmAdd(1)">
          保存結果
        </button>
        <button class="button" @click="confirmAdd(0)">取消</button>
      </footer>
    </b-modal>
    <b-modal v-model="isCheckBook" scroll="keep">
      <header class="modal-card-head">
        <p class="modal-card-title">目前已選書籍｜點擊可刪除書籍</p>
      </header>

      <footer class="modal-card-foot">
        <button class="button is-success" @click="isCheckBook = false">
          返回
        </button>
      </footer>
    </b-modal>
    <b-modal v-model="isSetGlobalDoc" scroll="keep">
      <header class="modal-card-head">
        <p class="title">未確認分件方式的文檔處理方式</p>
      </header>
      <section class="modal-card-body" style="max-height: 4em">
        <b-checkbox v-model="isKeepHyperLink"> 保留超連結 </b-checkbox>
        <b-checkbox v-model="isCutFileByPara">
          以段分件（若未勾選則保留原來的全卷為一件）
        </b-checkbox>
      </section>
      <footer class="modal-card-foot">
        <b-button type="is-primary" @click="confirmGlobalSet">確認</b-button>
      </footer>
    </b-modal>
    <b-modal v-model="isOpenUploadModal" :width="400">
      <header class="modal-card-head" style="justify-content: space-between">
        <p class="modal-card-title">上傳到DocuSky</p>
        <b-tooltip label="到DocuSky看看結果吧！" position="is-left">
          <a
            href="https://docusky.org.tw/DocuSky/docuTools/userMain/"
            target="_blank"
          >
            <nav class="level">
              <div class="level-item">
                <img src="../public/C_4C_small.png" alt="" />
              </div>
              <div class="level-item" style="padding-top: 5px">
                <b-icon icon="upload" pack="fas"></b-icon>
              </div>
            </nav>
          </a>
        </b-tooltip>
      </header>

      <section class="modal-card-body login">
        <b-field label="檔案名稱">
          <b-input v-model="uploadFileName"></b-input>
        </b-field>
        <b-field label="帳號">
          <b-input
            type="email"
            v-model="account"
            autocomplete="username"
          ></b-input>
        </b-field>
        <b-field label="密碼">
          <b-input
            type="password"
            v-model="password"
            @keypress.native.enter="login"
          ></b-input>
        </b-field>
      </section>

      <footer class="modal-card-foot" style="justify-content: space-between">
        <div>
          <b-button type="is-success" @click="login" outlined> 登入 </b-button>
          <b-button
            type="is-success"
            @click="uploadXML"
            outlined
            :disabled="!isUploadable"
          >
            上傳
          </b-button>
        </div>
        <div>
          <b-button
            type="is-primary"
            @click="isOpenUploadModal = false"
            outlined
          >
            取消
          </b-button>
        </div>
      </footer>
    </b-modal>
    <b-modal
      v-model="isEditMetaTable"
      :width="1000"
      scroll="keep"
      ref="chooseMetaProps"
    >
      <header class="modal-card-head">
        <label class="label">選擇需要的metadata欄位</label>
      </header>
      <section class="modal-card-body">
        <b-field label="1. DocuSky分件檔案名稱前綴（輸入X則會顯示為X_01.txt）">
          <b-input v-model="filenameMeta"></b-input>
        </b-field>
        <b-field label="2. 文獻集名稱取名">
          <b-input v-model="corpusNameMeta"></b-input>
        </b-field>
        <b-field label="3. 選擇需要的Metadata欄位">
          <multiselect
            v-model="selectedMetaDataColumns"
            :options="selectMetaDataColumns"
            :multiple="true"
            :close-on-select="false"
            :clear-on-select="false"
            :preserve-search="true"
            placeholder="Pick some"
            label="headerName"
            track-by="headerName"
            :preselect-first="true"
            :max-height="300"
            @close="closeEventHandler"
            ref="multiselect"
          >
            <template slot="selection" slot-scope="{ values, isOpen }">
              <span
                class="multiselect__single"
                v-if="values.length &amp;&amp; !isOpen"
              >
                {{ values.length }} options selected
              </span>
            </template>
          </multiselect>
        </b-field>
      </section>
      <footer class="modal-card-foot">
        <b-tooltip
          label="下一步編輯Metadata與Tag！"
          position="is-right"
          :animated="false"
          size="is-small"
        >
          <b-button class="is-primary" @click="splitWikiContents" outlined
            >確認輸出
          </b-button>
        </b-tooltip>
      </footer>
    </b-modal>

    <section class="section" style="padding: 24px 12px 24px 12px">
      <!-- <div class="container is-max-widescreen"> -->
      <b-steps
        v-model="activeStep"
        :animated="isAnimated"
        :rounded="isRounded"
        :has-navigation="hasNavigation"
        :icon-prev="prevIcon"
        :icon-next="nextIcon"
        :label-position="labelPosition"
        :mobile-mode="mobileMode"
        position="is-right"
        :class="stepClass"
        vertical
        ref="control"
        class="step-custom"
      >
        <b-step-item
          class="main-dish"
          step="1"
          label="書本標題名搜索"
          :clickable="isStepsClickable"
        >
          <section class="section headline">
            <label class="label is-large" title="不需完整標題"
              >書本標題名搜索
            </label>
          </section>
          <hr style="margin: 5px; padding-left: 24px; width: 100%" />
          <section class="section wow" style="padding-top: 20px">
            <div class="field has-addons" expand>
              <div class="control">
                <div style="display: none">
                  <input type="text" autocomplete="username" />
                </div>
                <input
                  style="font-size: 80px"
                  v-model="sourceWord"
                  class="input"
                  type="search"
                  placeholder="鄭氏紀事"
                  @keypress.enter="getQueryResult"
                  autocomplete="off"
                  expanded
                />
              </div>
              <div class="control">
                <b-button
                  style="font-size: 80px"
                  class="button is-link"
                  @click="getQueryResult"
                >
                  搜尋
                </b-button>
              </div>
            </div>
          </section>
        </b-step-item>

        <b-step-item
          class="main-dish"
          step="2"
          label="選擇文本"
          :clickable="isStepsClickable"
          :type="{ 'is-success': isProfileSuccess }"
        >
          <section>
            <b-sidebar
              type="is-light"
              :fullheight="fullheightSideBar"
              :fullwidth="fullwidthSideBar"
              :overlay="overlaySideBar"
              :right="rightSideBar"
              :open.sync="openSideBar"
            >
              <div
                v-for="(books, numbooks) in selectedBookMenuPool"
                label="已選書單"
                :key="books + numbooks"
              >
                <div v-for="(article, index) in books.menu" :key="article + 1">
                  <nav class="level">
                    <div class="level-left">
                      <div class="level-item">
                        <p style="font-size: 1.2em">{{ article }}</p>
                      </div>
                    </div>
                    <div class="level-right">
                      <div class="level-item">
                        <a
                          @click.stop="
                            deleteBook({
                              bookOrder: numbooks,
                              chapOrder: index,
                            })
                          "
                        >
                          <b-icon size="is-medium" icon-pack="fas" icon="delete"
                            >刪除
                          </b-icon>
                        </a>
                      </div>
                    </div>
                  </nav>
                </div>
              </div>
            </b-sidebar>
          </section>
          <section class="section headline">
            <label class="label is-large">書本目錄檢視與選取</label>
          </section>
          <hr style="margin: 5px; padding-left: 24px; width: 100%" />
          <section class="section wow" v-if="isInputDataValid">
            <div class="columns is-multiline">
              <div
                v-for="(extendedLink, index) in extendedLinks"
                :key="index"
                class="column is-half"
              >
                <GetTableContent
                  :link="extendedLink"
                  :index="index"
                  :saved="
                    selectedBookMenuPool.find(
                      (x) => x.searchName === extendedLink
                    )
                  "
                  @contentTableAdd="addSelectedMenuItem"
                />
              </div>
            </div>
          </section>
          <hr style="margin: 5px; padding-left: 24px; width: 100%" />
          <section class="section tool-button-line">
            <nav class="level">
              <div class="level-left">
                <div class="level-item">
                  <b-button
                    type="is-primary"
                    @click="openSideBar = !openSideBar"
                    outlined
                  >
                    檢視已選文件</b-button
                  >
                </div>
                <div class="level-item">
                  <b-button type="is-success" @click="releaseGate" outlined>
                    進入下一步</b-button
                  >
                </div>
              </div>
            </nav>
          </section>
        </b-step-item>

        <!-- <div class="level-item">
                                        <p>
                                            未處理文件：
                                        </p>
                                    </div>
                                    <div class="level-item">
                                        <b-checkbox v-model="isKeepHyperLink">
                                            保留超連結
                                        </b-checkbox>
                                    </div>
                                    <div class="level-item">
                                        <b-checkbox v-model="isCutFileByPara">
                                            以段分件
                                        </b-checkbox>
                                    </div> -->

        <b-step-item
          class="main-dish"
          step="3"
          label="選擇分件方式"
          :clickable="isStepsClickable"
          :type="{ 'is-success': isProfileSuccess }"
        >
          <section class="section headline">
            <nav class="level">
              <div class="level-left">
                <div class="level-item">
                  <label class="label is-large">
                    目前已下載卷數檢視 & 分件
                  </label>
                </div>
              </div>
            </nav>
          </section>
          <hr style="margin: 5px; padding-left: 24px; width: 100%" />
          <section class="section wow">
            <div
              class="columns is-multiline"
              v-for="(book, index) in selectedBookMenuPool"
              :key="index"
            >
              <div
                class="column is-one-third"
                v-for="(chap, chapCount) in book.menu"
                :key="chapCount"
              >
                <BookChildContent
                  @handle-wiki="handleWikiCutObj"
                  @delete-book="deleteBook"
                  ref="contentTable"
                  :wiki-book="chap"
                  :bookOrder="index"
                  :order="chapCount"
                >
                </BookChildContent>
              </div>
            </div>
          </section>
          <hr style="margin: 5px; padding-left: 24px; width: 100%" />
          <section class="section tool-button-line">
            <nav class="level">
              <div class="level-left">
                <div class="level-item">
                  <b-button
                    type="is-primary"
                    @click="isSetGlobalDoc = true"
                    outlined
                  >
                    處理所有未點擊分件
                  </b-button>
                </div>
                <div class="level-item">
                  <b-tooltip
                    label="確認其他未自訂的文件設定完成了嗎？"
                    multilined
                    position="is-right"
                    v-if="!isFinishSplit"
                  >
                    <b-button
                      type="is-success"
                      @click="releaseGate"
                      outlined
                      disabled
                    >
                      完成自訂修改
                    </b-button>
                  </b-tooltip>
                  <b-button
                    type="is-success"
                    @click="releaseGate"
                    v-if="isFinishSplit"
                    outlined
                  >
                    完成自訂修改
                  </b-button>
                </div>
              </div>
            </nav>
          </section>
        </b-step-item>

        <b-step-item
          class="main-dish"
          step="4"
          label="編輯Metadata"
          :clickable="isStepsClickable"
          :type="{ 'is-success': isProfileSuccess }"
        >
          <section class="section headline">
            <nav class="level">
              <div class="level-left">
                <div class="level-item">
                  <label class="label is-large">編輯metadata區域｜</label>
                  <b-button type="is-primary" @click="openEditTable" outlined>
                    選擇需要的Metadata欄位
                  </b-button>
                </div>
              </div>
              <div class="level-right">
                <div class="level-item">
                  <b-button type="is-primary" @click="undoHot" outlined>
                    <b-icon icon="undo" icon-pack="fas"></b-icon>
                  </b-button>
                </div>
                <div class="level-item">
                  <b-button type="is-primary" @click="redoHot" outlined>
                    <b-icon icon="redo" icon-pack="fas"></b-icon>
                  </b-button>
                </div>
              </div>
            </nav>
          </section>
          <hr style="margin: 5px; padding-left: 24px; width: 100%" />
          <section class="dataHandsonTable wow" v-if="!isShowTable">
            <span class="subtitle">請先點擊上方選擇需要的metadata欄位</span>
          </section>
          <section class="dataHandsonTable wow" v-if="isShowTable">
            <div v-show="isEditMetadata">
              <hot-table
                :data.sync="splitCompleteWikiContents"
                :rowHeaders="true"
                :licenseKey="licenseKey"
                :autoRowSize="true"
                :colHeaders="colHeaders"
                :manualRowResize="true"
                :manualColumnResize="[200, 250]"
                :wordWrap="false"
                :autoWrapCol="false"
                ref="hotTableComponent"
                :cells="setReadonlyColumn"
                :manualRowMove="true"
              >
              </hot-table>
            </div>
          </section>
          <hr style="margin: 5px; padding-left: 24px; width: 100%" />
          <section class="section tool-button-line">
            <nav class="level">
              <div class="level-left">
                <div class="level-item">
                  <b-button class="is-primary" @click="saveTempMeta" outlined>
                    暫時存檔
                  </b-button>
                </div>
                <div class="level-item">
                  <b-button class="is-primary" @click="exportCsvFile" outlined>
                    輸出CSV
                  </b-button>
                </div>
                <div class="level-item">
                  <div
                    class="dropdown is-up"
                    :class="{ 'is-active': isActiveDownloadTxt ? true : false }"
                  >
                    <div class="dropdown-trigger">
                      <button
                        class="button is-primary is-outlined"
                        aria-haspopup="true"
                        aria-controls="dropdown-menu"
                        @click="isActiveDownloadTxt = !isActiveDownloadTxt"
                      >
                        <span>輸出為TXT</span>
                        <span class="icon is-small">
                          <i class="fas fa-angle-down" aria-hidden="true"></i>
                        </span>
                      </button>
                    </div>
                    <div class="dropdown-menu" id="dropdown-menu" role="menu">
                      <div class="dropdown-content">
                        <a class="dropdown-item" @click="exportTxtArchive">
                          分檔輸出
                        </a>
                        <a class="dropdown-item" @click="exportTxtOneFile">
                          單檔輸出（以####做為分隔符號）
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="level-item">
                  <b-button class="is-success" @click="combineOrigin" outlined>
                    完成編輯
                  </b-button>
                </div>
              </div>
            </nav>
          </section>
        </b-step-item>

        <b-step-item
          class="main-dish"
          step="5"
          label="編輯Tag"
          :clickable="isStepsClickable"
          :type="{ 'is-success': isProfileSuccess }"
        >
          <section class="section headline">
            <nav class="level">
              <div class="level-left">
                <div class="level-item">
                  <label class="label is-large">點擊檢視文本 & 編輯Tag</label>
                </div>
              </div>
            </nav>
          </section>
          <hr style="margin: 5px; padding-left: 24px; width: 100%" />
          <section class="section wow">
            <b-field
              label="1. 選擇DocuSky預設Tag"
              custom-class="is-medium has-text-primary"
            >
              <div
                v-for="option in wikiCheckTagOptions"
                :key="option.tagLabel + '20'"
              >
                <b-checkbox :native-value="option" v-model="wikiTags">
                  {{ option.tagLabel }}
                </b-checkbox>
              </div>
            </b-field>
            <b-field
              label="2. 增加個人設定Tag(於DocuSky顯示為Udef_'使用者自訂名稱')"
              custom-class="is-medium has-text-primary"
            >
              <multiselect
                v-model="wikiTags"
                tag-placeholder="新增自訂tag"
                placeholder="輸入自訂的tag名稱(請用英文)"
                label="tagLabel"
                track-by="tagName"
                :close-on-select="false"
                :clear-on-select="false"
                :options="wikiTagOptions"
                :multiple="true"
                :taggable="true"
                @remove="deleteAllTag"
                @tag="addContentTag"
              >
              </multiselect>
            </b-field>
            <b-field
              label="3. 選擇文本進行Tag"
              custom-class="is-medium has-text-primary"
            >
              <div class="columns is-multiline">
                <TagEdit
                  v-for="(document, order) in splitCompleteWikiContents"
                  :key="document.filename"
                  :filename="document.title + '/' + document.filename"
                  :temp="tempSplitContents[order]"
                  :index="order"
                  :tagOptions="wikiTags"
                  @handle-tag="handleWikiTag"
                  ref="editTag"
                >
                </TagEdit>
              </div>
            </b-field>
          </section>
          <hr style="margin: 5px; padding-left: 24px; width: 100%" />
          <section class="section tool-button-line">
            <b-button type="is-success" outlined @click="releaseGate">
              完成Tag
            </b-button>
          </section>
        </b-step-item>

        <b-step-item
          class="main-dish"
          step="6"
          label="排列文本次序"
          :clickable="isStepsClickable"
          :type="{ 'is-success': isProfileSuccess }"
        >
          <section class="section headline">
            <nav class="level">
              <div class="level-left">
                <div class="level-item">
                  <label class="label is-large">排列文本次序</label>
                </div>
              </div>
            </nav>
          </section>
          <hr style="margin: 5px; padding-left: 24px; width: 100%" />
          <section class="section wow">
            <draggable
              v-model="splitCompleteWikiContents"
              v-bind="dragOptions"
              @start="drag = true"
              @end="drag = false"
            >
              <transition-group
                class="columns is-multiline"
                type="transition"
                :name="!drag ? 'flip-list' : null"
              >
                <FileOrder
                  v-for="(document, order) in splitCompleteWikiContents"
                  :key="document.filename"
                  :filename="document.title + '/' + document.filename"
                  :content="document.doc_content"
                  :index="order"
                  ref="fileOrder"
                >
                </FileOrder>
              </transition-group>
            </draggable>
          </section>
          <hr style="margin: 5px; padding-left: 24px; width: 100%" />
          <section class="section tool-button-line">
            <nav class="level">
              <div class="level-left">
                <div class="level-item">
                  <b-button class="is-primary" @click="reOrderFile" outlined>
                    重置排序
                  </b-button>
                </div>
                <!-- <div class="level-item">
                  <b-button class="is-primary" @click="confirmOrder" outlined>
                    確認排序
                  </b-button>
                </div> -->
                <div class="level-item">
                  <b-button type="is-success" outlined @click="generateXml"
                    >輸出XML
                  </b-button>
                </div>
              </div>
            </nav>
          </section>
        </b-step-item>

        <b-step-item
          class="main-dish"
          step="7"
          label="輸出資料"
          :clickable="isStepsClickable"
          :type="{ 'is-success': isProfileSuccess }"
        >
          <section class="section headline">
            <nav class="level">
              <div class="level-left">
                <div class="level-item">
                  <label class="label is-large">輸出資料</label>
                </div>
              </div>
            </nav>
          </section>
          <hr style="margin: 5px; padding-left: 24px; width: 100%" />
          <section class="section wow">
            <div class="box">
              <div class="column">
                <b-button
                  class="is-medium is-success"
                  @click="copyXML"
                  outlined
                  expanded
                  >複製DocuXML到剪貼簿
                </b-button>
              </div>
              <div class="column">
                <b-button
                  class="is-medium is-success"
                  @click="downloadXML"
                  outlined
                  expanded
                >
                  下載XML檔案進一步編輯
                </b-button>
              </div>
              <div class="column">
                <b-button
                  class="is-medium is-success"
                  @click="openLoginModal"
                  outlined
                  expanded
                >
                  直接上傳到DocuSky建庫
                </b-button>
              </div>
            </div>
          </section>
          <section class="section tool-button-line">
            <b-button style="visibility: hidden"></b-button>
          </section>
        </b-step-item>

        <template
          v-if="customNavigation"
          v-slot:navigation="{ previous, next }"
        >
          <nav class="step-navigation">
            <b-button
              type="is-primary"
              icon-pack="fas"
              icon-left="arrow-up"
              :disabled="previous.disabled"
              @click.prevent="previous.action"
              style="bottom: 5px"
            >
            </b-button>
            <b-button
              type="is-primary"
              icon-pack="fas"
              icon-right="arrow-down"
              :disabled="next.disabled || isOpenGate"
              @click.prevent="next.action"
            >
            </b-button>
          </nav>
        </template>
      </b-steps>

      <!-- </div> -->
    </section>
  </div>
</template>

<script>
import { columnDefinition, colHeader } from "./data";
// import SplitCompleteContent from './components/SplitCompleteContent.vue';
import BookChildContent from "./components/BookChildContent.vue";
import TagEdit from "./components/TagEdit";
import GetTableContent from "./components/GetTableContent";
import FileOrder from "./components/FileOrder";
import draggable from "vuedraggable";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { HotTable } from "@handsontable/vue";
import "handsontable/dist/handsontable.full.css";
import Multiselect from "vue-multiselect";
import "vue-multiselect/dist/vue-multiselect.min.css";
import * as JSZip from "jszip";
import {
  dt,
  $,
  getDeeperLink,
  searchWord,
  splitAndUrlHandler,
  createMetadataRows,
  padding,
} from "./tool.js";
import { composeDocuXmlFile } from "./docuXml";
// import {
//     docuskyManageDbListSimpleUI
// } from './docuWid';
import { SnackbarProgrammatic as Snackbar } from "buefy";
import { cloneDeep } from "lodash-es";

export default {
  name: "App",
  components: {
    BookChildContent,
    HotTable,
    Multiselect,
    TagEdit,
    GetTableContent,
    draggable,
    FileOrder,
  },
  computed: {
    dragOptions() {
      return {
        animation: 200,
        group: "description",
        disabled: false,
        ghostClass: "ghost",
      };
    },
    countSplitContents() {
      return this.splitCompleteWikiContents.length;
    },
    isOpenGate() {
      return this.isProcessDisable[this.activeStep];
    },
  },
  watch: {
    activeStep: {
      immediate: true,
      handler(newValue, oldValue) {
        // if(newValue == 3) {
        //     this.tempSplitContents = this.splitCompleteWikiContents.map((x)=>{
        //         return x.doc_content;
        //     });
        //     this.splitCompleteWikiContents.forEach(element => {
        //         element.doc_content = element.doc_content.replace(/(.{0,200}).*/sm, '$1');
        //     });
        // }

        if (oldValue === 3) {
          this.$nextTick(function () {
            this.splitCompleteWikiContents = this.splitCompleteWikiContents.map(
              (element, index) => {
                element.doc_content = this.tempSplitContents[index];
                return element;
              }
            );
          });
        }
      },
    },
  },
  data() {
    return {
      activeStep: 0,
      isActiveDownloadTxt: false,

      showSocial: false,
      isAnimated: true,
      isRounded: true,
      isStepsClickable: true,

      hasNavigation: true,
      customNavigation: true,
      isProfileSuccess: false,

      prevIcon: "arrow-up",
      nextIcon: "arrow-down",
      labelPosition: "left",
      mobileMode: "minimalist",
      stepClass: "step-class",
      isProcessDisable: [true, true, true, true, true, true, true],
      //above are step variable

      testContextMenu: {
        items: {
          row_above: {
            name: "Insert row above this one (custom name)",
          },
          row_below: {},
          clear_custom: {
            name: "Clear all cells (custom)",
            callback() {
              this.clear();
            },
          },
        },
      },

      isInputDataValid: true,
      isMetadataComplete: true,
      isKeepFormat: "Yes",
      isAddHyperlink: true,
      urlFieldHint: "",
      isInputEmpty: false,
      wikiUrls: "",
      wikiContents: "",
      filename: "",
      isSeperateByParagraph: "default",
      isAddExtendedLinks: false,
      isAddMenuToDownload: false,
      extendedLinks: [],
      confirmLinks: [],
      sourceWord: "",
      corpusName: "",
      corpusDefault: "文獻集名稱：預設「我的資料集」",
      tableOfContents: [],
      tempMenuList: [],
      treeShowMenu: [],
      sortValueBy: "INDEX",
      valueConsistsOf: "ALL",
      tempSelectMenu: [],
      selectedBookMenuPool: [],
      menuIndexCount: 0,
      refLinks: [],
      selectRefLinks: [],
      wikiContentSnippet: "",
      isCheckBook: false,
      kidsWord: "",
      testModal: true,
      isImageModalActive: false,
      wikiContentWaitCut: [],
      splitCompleteWikiContents: [],
      testSelCut: 1,
      selectMetaDataColumns: columnDefinition,
      selectedMetaDataColumns: [],
      licenseKey: "non-commercial-and-evaluation",
      isEditMetadata: false,
      getSplitSheet: [],
      colHeaders: colHeader,
      columns: [],
      isEditMetaTable: false,
      isSetGlobalDoc: false,
      filenameMeta: "file",
      corpusNameMeta: "我的文獻集",
      uploadFileName: "我的文獻集",
      wikiTags: [],
      wikiTagOptions: [],
      wikiCheckTagOptions: [
        {
          tagLabel: "PersonName",
          tagName: "PersonName",
        },
        {
          tagLabel: "LocName",
          tagName: "LocName",
        },
        {
          tagLabel: "Date",
          tagName: "Date",
        },
        {
          tagLabel: "Office",
          tagName: "Office",
        },
      ],
      showXmlString: "",
      isKeepHyperLink: false,
      isCutFileByPara: false,

      //登入用
      isOpenUploadModal: false,
      account: "",
      password: "",
      isUploadable: false,

      //拖曳
      drag: false,
      isEditFileOrder: false,

      //取得暫存的分件文本內容
      tempSplitContents: [],

      //側邊欄紀錄
      openSideBar: false,
      overlaySideBar: true,
      fullheightSideBar: true,
      fullwidthSideBar: false,
      rightSideBar: false,

      //查看輸出文件
      isCheckFinalCode: false,

      //跳出編輯metatable表
      isShowTable: false,

      //完成分件
      isFinishSplit: false,
    };
  },
  created() {
    if (window.localStorage.getItem("metaTable")) {
      this.$buefy.dialog.confirm({
        message: "有已存檔的MetaData編輯資料，是否載入？",
        onConfirm: () => {
          this.isAddHyperlink = Boolean(
            window.localStorage.getItem("hyperlink")
          );
          if (this.isAddHyperlink) {
            this.wikiTagOptions.push({
              tagLabel: "Wiki_url",
              tagName: "Udef_wiki",
            });
            this.wikiTags.push({
              tagLabel: "Wiki_url",
              tagName: "Udef_wiki",
            });
          }
          this.isProcessDisable[0] = false;
          this.isProcessDisable[1] = false;
          this.isProcessDisable[2] = false;
          this.activeStep = 3;
          this.isEditMetadata = true;
          this.selectedMetaDataColumns = JSON.parse(
            window.localStorage.getItem("columnNameList")
          );
          this.colHeaders = ["文件標題", "文本內容", "檔案名稱", "文獻集名稱"];
          this.colHeaders = this.colHeaders.concat(
            this.selectedMetaDataColumns.map((x) => x.headerName)
          );
          this.colHeaders = this.colHeaders.concat("文件次序編碼");
          this.$nextTick(() => {
            this.splitCompleteWikiContents = JSON.parse(
              window.localStorage.getItem("metaTable")
            );
            this.tempSplitContents = this.splitCompleteWikiContents.map((x) => {
              return x.doc_content;
            });
            this.splitCompleteWikiContents = this.splitCompleteWikiContents.map(
              (element) => {
                element.doc_content = element.doc_content.replace(
                  /(.{0,200}).*/ms,
                  "$1"
                );
                return element;
              }
            );
            this.isShowTable = true;
            this.$nextTick(function () {
              this.$refs.hotTableComponent.hotInstance.loadData(
                this.splitCompleteWikiContents
              );
              for (let i in this.splitCompleteWikiContents) {
                this.$refs.hotTableComponent.hotInstance.setCellMeta(
                  i,
                  Object.keys(this.splitCompleteWikiContents[0]).length - 1,
                  "readOnly",
                  true
                );
              }
            });
          });
        },
        onCancel: () => {
          this.$buefy.dialog.confirm({
            message: "要刪除Metadata已存檔案嗎？",
            onConfirm: () => {
              window.localStorage.clear();
            },
          });
        },
      });
    }
  },
  methods: {
    undoHot: function () {
      this.$refs.hotTableComponent.hotInstance.undo();
    },
    redoHot: function () {
      this.$refs.hotTableComponent.hotInstance.redo();
    },
    deleteBook: function (val) {
      let bookOrder = val.bookOrder;
      let chapOrder = val.chapOrder;
      if (this.selectedBookMenuPool.length) {
        this.selectedBookMenuPool[bookOrder].menu.splice(chapOrder, 1);
      }
    },
    deleteAllTag: function (tag) {
      this.splitCompleteWikiContents.forEach((element) => {
        element.doc_content = element.doc_content.replace(
          new RegExp(
            String.raw`<mark tag="${tag.tagName}">([^<]*)</mark>`,
            "g"
          ),
          "$1"
        );
      });
    },
    addContentTag: function (newTag) {
      const tag = {
        tagLabel: newTag,
        tagName: `Udef_${newTag}`,
      };
      this.wikiTagOptions.push(tag);
      this.wikiTags.push(tag);
    },
    cleanUrlField: function () {
      this.wikiUrls = "";
      this.urlFieldHint = "";
      this.isInputEmpty = false;
      this.wikiDocuments = [];
    },
    getQueryResult: async function () {
      if (this.sourceWord == "") return;
      this.refLinks = [];
      this.selectRefLinks = [];
      this.confirmLinks = [];
      this.tableOfContents = [];
      this.selectedBookMenuPool = [];
      this.refLinks = await searchWord(this.sourceWord);
      this.confirmAdd(1);
    },
    addSelectedMenuItem: function (val) {
      let saveBook = this.selectedBookMenuPool.findIndex(
        (book) => book.index === val.index
      );
      if (saveBook !== -1) {
        this.selectedBookMenuPool[saveBook] = val;
      } else {
        this.selectedBookMenuPool.push(val);
      }
    },
    getRefLink: async function (index) {
      this.refLinks = [];
      let links = await getDeeperLink(this.extendedLinks[index]);
      this.refLinks.concat(links);
    },
    openSelectBookList: function () {
      this.selectedBookMenuPool.sort((x, y) => x.index - y.index);
      this.isCheckBook = true;
    },
    confirmGlobalSet() {
      this.$refs.contentTable.forEach((element) => {
        if (!element.isViewed) {
          if (this.isCutFileByPara) element.paragraphCutWay = 2;
          if (this.isKeepHyperLink) element.isUrlAllow = true;
          element.sendWikiCutObj();
        }
      });
      this.isSetGlobalDoc = false;
      this.isFinishSplit = true;
    },
    openEditTable: function () {
      this.isEditMetaTable = true;
      this.$nextTick(function () {
        this.$refs.multiselect.activate();
      });
    },
    handleWikiCutObj: function (param) {
      let findBookIndex = this.wikiContentWaitCut.findIndex(
        (book) => book.title === param.title
      );
      if (findBookIndex !== -1) {
        this.wikiContentWaitCut[findBookIndex] = param;
      }
      this.wikiContentWaitCut.push(param);
      if (
        param.isUrlAllow &&
        !this.wikiTagOptions.find((ele) => ele.tagLabel === "Wiki_url")
      ) {
        this.wikiTagOptions.push({
          tagLabel: "Wiki_url",
          tagName: "Udef_wiki",
        });
        this.wikiTags.push({
          tagLabel: "Wiki_url",
          tagName: "Udef_wiki",
        });
      }
    },
    handleWikiTag: function (param) {
      this.splitCompleteWikiContents[param.index].doc_content =
        param.newContent;
      this.tempSplitContents[param.index] = param.newContent;
    },
    splitWikiContents: function () {
      this.wikiContentWaitCut.sort(function (a, b) {
        return a.order > b.order ? 1 : -1;
      });
      this.splitCompleteWikiContents = splitAndUrlHandler(
        this.wikiContentWaitCut
      );
      this.splitCompleteWikiContents = createMetadataRows(
        this.splitCompleteWikiContents,
        this.selectedMetaDataColumns,
        this.filenameMeta,
        this.corpusNameMeta
      );
      this.isEditMetadata = true;
      this.$nextTick(function () {
        this.$refs.hotTableComponent.hotInstance.loadData(
          this.splitCompleteWikiContents
        );
      });
      this.colHeaders = ["文件標題", "文本內容", "檔案名稱", "文獻集名稱"];
      this.colHeaders = this.colHeaders.concat(
        this.selectedMetaDataColumns.map((x) => x.headerName)
      );
      this.colHeaders = this.colHeaders.concat("文件次序編碼");

      this.$nextTick(() => {
        for (let i in this.splitCompleteWikiContents) {
          this.$refs.hotTableComponent.hotInstance.setCellMeta(
            i,
            Object.keys(this.splitCompleteWikiContents[0]).length - 1,
            "readOnly",
            true
          );
        }
      });

      // this.tempSplitContents = this.splitCompleteWikiContents.map((x)=>{
      //     return x.doc_content;
      // });
      // this.splitCompleteWikiContents.forEach(element => {
      //     element.doc_content = element.doc_content.replace(/(.{0,200}).*/sm, '$1');
      // });

      this.tempSplitContents = this.splitCompleteWikiContents.map((x) => {
        return x.doc_content;
      });
      this.splitCompleteWikiContents = this.splitCompleteWikiContents.map(
        (element) => {
          element.doc_content = element.doc_content.replace(
            /(.{0,200}).*/ms,
            "$1"
          );
          return element;
        }
      );

      this.isEditMetaTable = false;
      this.isShowTable = true;
    },
    saveTempMeta() {
      let tempFile = cloneDeep(this.splitCompleteWikiContents);
      tempFile.forEach((element, index) => {
        element.doc_content = this.tempSplitContents[index];
      });
      let myStorage = window.localStorage;
      myStorage.clear();
      myStorage.setItem("metaTable", JSON.stringify(tempFile));
      myStorage.setItem("hyperlink", this.isKeepHyperLink);
      myStorage.setItem(
        "columnNameList",
        JSON.stringify(this.selectedMetaDataColumns)
      );
      this.$buefy.snackbar.open("已完成儲存");
    },
    exportCsvFile() {
      let tempFile = cloneDeep(this.splitCompleteWikiContents);
      tempFile.forEach((element, index) => {
        element.doc_content = this.tempSplitContents[index];
      });
      let outCsvString = '"文件標題","文本內容","檔案名稱","文獻集名稱",';
      outCsvString += this.selectedMetaDataColumns
        .map((x) => `"${x.headerName}"`)
        .join(",");
      outCsvString += "\r\n";
      outCsvString += tempFile
        .map((x) => {
          let temp = [];
          for (let item in x) {
            temp.push(`"${x[item]}"`);
          }
          return temp.slice(0, -1).join();
        })
        .join("\r\n");
      const timeNow = new Date();
      let element = document.createElement("a");
      let filename = `${timeNow.toLocaleString()}_備份.csv`;
      let blob = new Blob(["\uFEFF", outCsvString], {
        type: "text/csv; charset=utf-8",
      });
      element.setAttribute("href", window.URL.createObjectURL(blob));
      element.setAttribute("download", filename);
      element.style.display = "none";
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      //   console.log(outCsvString);
    },
    exportTxtOneFile() {
      let tempFile = cloneDeep(this.splitCompleteWikiContents);
      let outputTxt = "";
      tempFile.forEach((element, index) => {
        element.doc_content = this.tempSplitContents[index];
      });
      tempFile.map((file, index) => {
        outputTxt += file.filename;
        outputTxt += "\n\n";
        outputTxt += file.doc_content;
        if (index !== tempFile.length - 1) {
          outputTxt += "\n####\n\n";
        }
      });
      let element = document.createElement("a");
      const timeNow = new Date();
      let filename = `${timeNow.toLocaleString()}_備份.txt`;
      element.setAttribute(
        "href",
        "data:text/xml;charset=utf-8," + encodeURIComponent(outputTxt)
      );
      element.setAttribute("download", filename);
      element.style.display = "none";
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      console.log("wow");
    },
    exportTxtArchive() {
      let tempFile = cloneDeep(this.splitCompleteWikiContents);
      tempFile.forEach((element, index) => {
        element.doc_content = this.tempSplitContents[index];
      });
      let zipFile = new JSZip();
      tempFile.map((file) => {
        zipFile.file(file.filename, file.doc_content);
      });
      zipFile.generateAsync({ type: "blob" }).then(function (content) {
        // see FileSaver.js
        // saveAs(content, "example.zip");

        let url = URL.createObjectURL(content);
        const timeNow = new Date();
        let element = document.createElement("a");
        let filename = `${timeNow.toLocaleString()}_備份.zip`;
        element.setAttribute("href", url);
        element.setAttribute("download", filename);
        element.style.display = "none";
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
      });
      console.log("wow");

      // //   console.log(outCsvString);
    },
    combineOrigin: function () {
      this.releaseGate();
    },
    reOrderFile: function () {
      this.splitCompleteWikiContents = this.splitCompleteWikiContents.sort(
        (a, b) => {
          return a.fileOrder - b.fileOrder;
        }
      );
    },
    confirmOrder: function () {
      this.tempSplitContents = this.splitCompleteWikiContents.map((element) => {
        return element.doc_content;
      });
      for (let i = 0; i < this.splitCompleteWikiContents.length; i++) {
        this.splitCompleteWikiContents[i].fileOrder = i + 1;
        this.splitCompleteWikiContents[i].filename = `${
          this.filenameMeta
        }_${padding(
          i + 1,
          this.splitCompleteWikiContents.length.toString().length
        )}.txt`;
      }
      this.reOrderFile();
      this.$nextTick(function () {
        this.$refs.hotTableComponent.hotInstance.loadData(
          this.splitCompleteWikiContents
        );
        for (let i in this.splitCompleteWikiContents) {
          this.$refs.hotTableComponent.hotInstance.setCellMeta(
            i,
            Object.keys(this.splitCompleteWikiContents[0]).length - 1,
            "readOnly",
            true
          );
        }
      });
      this.saveTempMeta();
    },
    checkForm: function () {
      if (!this.wikiUrls) {
        this.urlFieldHint = "is-danger";
        this.isInputEmpty = true;
        return 0;
      }
      return 1;
    },
    confirmAdd: function (flag) {
      if (flag) {
        this.extendedLinks = this.refLinks;
        this.releaseGate();
      }
      this.selectRefLinks = [];
      this.isAddExtendedLinks = false;
    },
    checkContentValue: function (obj) {
      obj.isFixContent = !obj.isFixContent;
      obj.isContentOpen = !obj.isContentOpen;
    },
    deleteContentValue: function (index) {
      this.wikiDocuments.splice(index, 1);
    },
    download: function () {
      let element = document.createElement("a");
      let filename =
        this.filename == ""
          ? `${dt.getFullYear()}_${dt.getMonth()}_${dt.getDate()}.xml`
          : this.filename;
      element.setAttribute(
        "href",
        "data:text/xml;charset=utf-8," + encodeURIComponent(this.wikiContents)
      );
      element.setAttribute("download", filename);
      element.style.display = "none";
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    },
    copyTestingCode() {
      let testingCodeToCopy = $("#wikiContents").select(function () {
        try {
          alert("Testing code was copied ");
        } catch (err) {
          alert("Oops, unable to copy");
        }
        /* unselect the range */
      });
      testingCodeToCopy.setAttribute("type", "hidden");
      window.getSelection().removeAllRanges();
    },
    onCopy: function () {
      alert("Copying Success!!");
    },
    selectAllExtendLinks: function () {
      this.extendedLinks.forEach((ele) => {
        this.confirmLinks.push(ele);
      });
    },

    setReadonlyColumn: function (row, col) {
      //設置標題名稱、檔案名稱、文獻集名稱只讀
      let cellProperty = {};
      if (col == 1 || col == 2 || col == 3) {
        cellProperty.readOnly = true;
      }
      if (col == 1) {
        cellProperty.className = "cell-edit";
      }
      return cellProperty;
    },

    closeEventHandler: function () {
      this.$refs.multiselect.isOpen = true;
    },
    generateXml: function () {
      let wow = this.splitCompleteWikiContents;
      let wikiLength = wow.length.toString().length + 1;
      let tempComplete = this.splitCompleteWikiContents.map((text, index) => {
        text.filename = `${this.filenameMeta}_${padding(
          index + 1,
          wikiLength
        )}.txt`;
        return text;
      });
      let finalFile = cloneDeep(tempComplete);
      finalFile.forEach((ele) => {
        delete ele["fileOrder"];
      });
      this.showXmlString = composeDocuXmlFile(
        finalFile,
        this.selectedMetaDataColumns,
        this.wikiTags,
        this.corpusNameMeta
      );
      this.releaseGate();
    },
    copyXML: async function () {
      await navigator.clipboard.writeText(this.showXmlString);
    },
    downloadXML: function () {
      let link = document.createElement("a");
      link.download = `${this.corpusNameMeta}`;
      link.style.display = "none";
      // 字元內容轉變成blob地址
      let blob = new Blob([this.showXmlString], {
        type: "text/xml",
      });
      link.href = URL.createObjectURL(blob);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    openLoginModal: function () {
      this.isOpenUploadModal = true;
    },
    login: function () {
      if (!this.account || !this.password) {
        fail();
        return;
      }
      // eslint-disable-next-line
      docuskyManageDbListSimpleUI.login(
        this.account,
        this.password,
        () => {
          Snackbar.open("Login Success!");
          this.isUploadable = true;
        },
        function () {
          fail();
        }
      );
      function fail() {
        Snackbar.open("Login Failed...");
      }
    },
    uploadXML: function () {
      const timeNow = new Date();
      let corpusName =
        this.uploadFileName === "我的文獻集"
          ? String(`我的文獻集_${timeNow.toLocaleString()}`).replace(
              /[/\s]/g,
              "_"
            )
          : this.uploadFileName;
      if (!this.showXmlString) return Snackbar.open("Require Content...");
      let formData = {
        dummy: {
          name: "dbTitleForImport",
          value: corpusName,
        },
        file: {
          value: this.showXmlString.replace(/\n/g, ""),
          filename: corpusName + ".xml",
          name: "importedFiles[]",
        },
      };
      // eslint-disable-next-line
      docuskyManageDbListSimpleUI.uploadMultipart(
        formData,
        function () {
          Snackbar.open("Upload Success!");
        },
        function () {
          Snackbar.open("Upload Failed...");
        }
      );
    },

    releaseGate() {
      this.isProcessDisable[this.activeStep] = false;
      this.activeStep++;
    },
  },
};
</script>

<style scoped>
[v-cloak] {
  display: none;
}

.table {
  min-width: 100%;
}

.in-modal {
  max-height: 50em;
  overflow: auto;
}

.modal-card-body {
  height: 600px;
  overflow: auto;
}

@media screen and (max-width: 768px) {
  .modal-card-body {
    height: 30em;
    overflow: auto;
  }
}

.wow {
  max-width: 100%;
  height: 70vh;
  padding-top: 20px;
  overflow: auto;
  padding-top: inherit;
}

@media screen and (max-width: 1440px) {
  .wow {
    max-width: 100%;
    height: 65vh;
    padding-top: 20px;
    overflow: auto;
    padding-top: inherit;
  }
}

.handsontable.htRowHeaders.htColumnHeaders {
  box-shadow: 10px 5px 7px grey;
}

.login {
  height: auto;
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

.tool-button-line,
.headline {
  padding: 10px 10px 10px 24px;
}
</style>

<style>
html,
body {
  height: 100%;
  margin: 0;
  padding: 0;
}

.step-custom .step-items {
  padding-top: 6rem !important;
}

.cell-edit {
  overflow: hidden;
  text-overflow: ellipsis;
}

.pagination-previous,
.pagination-next {
  background-color: rgba(124, 89, 207);
}

.pagination-previous > .icon,
.pagination-next > .icon {
  color: white;
}

.sidebar-content.is-light.is-fixed.is-fullheight {
  width: 20rem;
}

.steps.has-label-left.is-animated.is-rounded.mobile-minimalist {
  display: flex;
  padding-right: 10px;
}

.step-navigation {
  flex-basis: 4% !important;
  order: -1;
  margin-top: 20rem;
}

.step-content {
  width: 80%;
  height: 85vh;
}
</style>
