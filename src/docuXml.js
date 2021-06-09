export function composeDocuXmlFile(wikiDocuments, metaArray, tags, corpusName) {
    let metaData = metaArray.slice(0);
    metaData.unshift({
        field: 'title',
        headerName: '文件標題',
    },
    {
        field: 'doc_content',
        headerName: '文本內容',
    },
    {
        field: 'fileName',
        headerName: '檔案名稱',
    },
    {
        field: 'corpus',
        headerName: '文獻集名稱',
    });
    let finalXml = '';
    finalXml += composeDocuXmlHead(metaData, tags, corpusName);
    finalXml += composeDocuXmlDocument(wikiDocuments);
    finalXml = bindXmlVal('ThdlPrototypeExport', finalXml, false, [1, 1]);
    finalXml = '<?xml version="1.0"?>\n' + finalXml.replace(/\n\n/g, '\n');
    return finalXml;
}

function composeDocuXmlHead(metaData, tags, corpusName) {
    let corpusMetaString = '';
    let corpusTagString = '';
    let corpusXml = '';
    metaData.forEach((ele) => {
        let string = bindXmlVal(ele.field, ele.headerName, false, [0, 1]);
        string = addAttr('show_spotlight', 'Y', string, false);
        string = addAttr('display_order', '999', string, false);
        corpusMetaString += string;
    });
    corpusMetaString = bindXmlVal('metadata_field_settings', corpusMetaString, false, [1, 1]);
    tags.forEach((ele) => {
        let string = `<spotlight category="${ele.tagName}" sub_category="-" display_order="1" title="${ele.tagLabel}"/>\n`;
        string += `<tag type="contentTagging" name="${ele.tagName}" default_category="${ele.tagName}" default_sub_category="-"/>\n`;
        corpusTagString += string;
    });
    corpusTagString = bindXmlVal('feature_analysis', corpusTagString, false, [1, 1]);
    corpusXml = corpusMetaString + corpusTagString;
    corpusXml = bindXmlVal('corpus', corpusXml, false, [1, 1]);
    corpusXml = addAttr('name', corpusName, corpusXml, false);
    return corpusXml;
}

function composeDocuXmlDocument(wikiDocuments) {
    let combineDocument = wikiDocuments.map((wikiDocument) => {
        let documentString = '';
        let docContentTemp = '';
        let fileName = '';
        for (const [key, value] of Object.entries(wikiDocument)) {
            if (key !== 'doc_content' && key !== 'fileName') {
                documentString += bindXmlVal(key, value, false, [0, 1]);
            } else if (key === 'doc_content') {
                docContentTemp = value;
            } else if (key === 'fileName'){
                fileName = value;
            }            
        }
        docContentTemp = addPara(transMarkToTag(docContentTemp));
        documentString += bindXmlVal('doc_content', docContentTemp, false, [1, 1]);
        documentString = bindXmlVal('document', documentString, false, [1, 1]);
        documentString = addAttr('fileName', fileName, documentString, false);
        return documentString;
    }).join('');
    return bindXmlVal('documents', combineDocument, false, [1, 1]);
}

function addPara(string) {
    let str = string;
    let paraText = str.split('\n').map(ele => {
        return bindXmlVal('Paragraph', ele, false, [1, 1]);
    }).join('');
    return paraText;
}

function bindXmlVal(xmlName = '', word = '', isCap = false, isNewLine = [0, 0]) {
    let val = isCap ? wordCapitalize(xmlName) : xmlName ;
    let nl = ['', '\n'];
    return `<${val}>${nl[isNewLine[0]]}${word}${nl[isNewLine[0]]}</${val}>${nl[isNewLine[1]]}`;
}


function wordCapitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function addAttr(attrName = '', attrVal = '', destXml = '', isCap = false) {
    let head = destXml.match(/^<[^/\s>]*/);
    if (!head) return;
    let val = isCap ? wordCapitalize(attrName) : attrName;
    let countXmlNameLen = head[0].length;
    return `${head[0]} ${val}="${attrVal}"${destXml.slice(countXmlNameLen)}`;
}

function transMarkToTag (string) {
    let str = string;
    function transformMark(sentence, tag, target, text) {
        return `<${wordCapitalize(target)}${text}</${wordCapitalize(target)}>`;
    }

    function Cap(sen, target) {
        return `${wordCapitalize(target)}="`;
    }

    str = str
        .replace(/(<mark tag=)"([^"]*)"([^>]*>[^<]*)(<\/mark>)/g, transformMark)
        .replace(/(\w+)="/g, Cap)
        .replace(/(<((?!Term)[^>])*)>([^<]*)(<\/[^>]*>)/g, '$1 Term="$3">$3$4');
    return str;
}