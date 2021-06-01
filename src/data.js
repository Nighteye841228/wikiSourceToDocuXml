const columnDefinition = [ 
    {
        field: 'author',
        headerName: '文件作者',
    },
    {
        field: 'doc_source',
        headerName: '文件來源',
    },
    {
        field: 'doc_topic_l1',
        headerName: '文件主題階層一',
    },
    {
        field: 'doc_topic_l2',
        headerName: '文件主題階層二',
    },
    {
        field: 'doc_topic_l3',
        headerName: '文件主題階層三',
    },
    {
        field: 'geo_level1',
        headerName: '文件地域階層一',
    },
    {
        field: 'geo_level2',
        headerName: '文件地域階層二',
    },
    {
        field: 'geo_level3',
        headerName: '文件地域階層三',
    },
    {
        field: 'geo_longitude',
        headerName: '文件所在經度',
    },
    {
        field: 'geo_latitude',
        headerName: '文件所在緯度',
    },
    {
        field: 'doc_category_l1',
        headerName: '文件分類階層一',
    },
    {
        field: 'doc_category_l2',
        headerName: '文件分類階層二',
    },
    {
        field: 'doc_category_l3',
        headerName: '文件分類階層三',
    },
    {
        field: 'docclass',
        headerName: '文件類別',
    },
    {
        field: 'docclass_aux',
        headerName: '文件子類別',
    },
    {
        field: 'doctype',
        headerName: '文件型態',
    },
    {
        field: 'doctype_aux',
        headerName: '文件子型態',
    },
    {
        field: 'book_code',
        headerName: '文件書碼',
    },
    {
        field: 'time_orig_str',
        headerName: '文件時間(字串)',
    },
    {
        field: 'time_varchar',
        headerName: '文件時間(西曆)',
    },
    {
        field: 'time_norm_year',
        headerName: '文件時間(中曆)',
    },
    {
        field: 'era',
        headerName: '文件時間(年號)',
    },
    {
        field: 'time_norm_kmark',
        headerName: '文件時間(帝號)',
    },
    {
        field: 'year_for_grouping',
        headerName: '文件時間(西元年)',
    },
    {
        field: 'time_dynasty',
        headerName: '文件時間(朝代)',
    },
    {
        field: 'doc_seq_number',
        headerName: '文件順序',
    },
    {
        field: 'timeseq_not_before',
        headerName: '文件起始時間',
    },
    {
        field: 'timeseq_not_after',
        headerName: '文件結束時間',
    },
    {
        field: 'doc_attachment',
        headerName: '文件圖檔',
    },
    {
        field: 'doc_att_caption',
        headerName: '文件圖檔的圖說',
    },
];

const colHeader = [
    '文件標題',
    '文獻集名稱',
    '文件作者',
    '文件來源',
    '文件主題階層一',
    '文件主題階層二',
    '文件主題階層三',
    '文件地域階層一',
    '文件地域階層二',
    '文件地域階層三',
    '文件所在經度',
    '文件所在緯度',
    '文件分類階層一',
    '文件分類階層二',
    '文件分類階層三',
    '文件類別',
    '文件子類別',
    '文件型態',
    '文件子型態',
    '文件書碼',
    '文件時間(字串)',
    '文件時間(西曆)',
    '文件時間(中曆)',
    '文件時間(年號)',
    '文件時間(帝號)',
    '文件時間(西元年)',
    '文件時間(朝代)',
    '文件順序',
    '文件起始時間',
    '文件結束時間',
    '文件圖檔',
    '文件圖檔的圖說',
    '文件內容',
];

const columns = [
    {
        wordWrap: false 
    },
    {
        wordWrap: false,
        width: '150px' 
    },
    {
    },
    {
    },
    {
    },
    {
    },
    {
    },
    {
    },
    {
    },
    {
    },
    {
    },
    {
    },
    {
    },
    {
    },
    {
    },
    {
    },
    {
    },
    {
    },
    {
    },
    {
    },
    {
    },
    {
    },
    {
    },
    {
    },
    {
    },
    {
    },
    {
    },
    {
    },
    {
    },
    {
    },
    {
    },
    {
    },
    {
    },
];

export { columnDefinition, colHeader, columns };
