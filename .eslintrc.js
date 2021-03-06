module.exports = {
    root: true,
    env: {
        node: true,
    },
    extends: ['plugin:vue/essential', 'eslint:recommended'],
    parserOptions: {
        parser: 'babel-eslint',
    },
    rules: {
        indent: [0, 2], // 縮排規則，index[0] 的數字代表含意為 關閉(0), 警告(1), 錯誤(2)
        quotes: [0], // 單引號, 雙引號
        semi: [1, 'always'], // 句尾是否加上 ";"
        'no-use-before-define': [2, 'nofunc'], //變數是否一定要宣告賦值
        'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off', // 是否留下 console.log
        'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off', // 是否留下 debugger
        'comma-spacing': [
            2,
            {
                // 關於 , 的規則，前後是否有空格
                before: false,
                after: true,
            },
        ],
        'key-spacing': [
            1,
            {
                // 關於 key 的 ":" 前後是否有空格
                beforeColon: false,
                afterColon: true,
            },
        ],
        'import/first': [0], // 雖說 import 都會先 Hoisting，在這些行數中間可否插入其他的變數或是函式
        'object-property-newline': [
            0,
            {
                // Object 的撰寫規則，詳請請查閱官方文件
                allowAllPropertiesOnSameLine: false,
            },
        ],
        'object-curly-newline': [
            1,
            {
                // Object 的撰寫規則，詳請請查閱官方文件
                ObjectExpression: 'always',
                ImportDeclaration: 'always',
                ExportDeclaration: 'never',
            },
        ],
        'vue/html-indent': [
            1,
            4,
            {
                // Vue 中的 html 的撰寫規則，詳請請查閱官方文件
                attribute: 1,
                baseIndent: 1,
                closeBracket: 0,
                alignAttributesVertically: true,
                ignores: [],
            },
        ],
        'vue/html-closing-bracket-newline': [
            1,
            {
                // Vue 中的 html 的撰寫規則，詳請請查閱官方文件
                singleline: 'never',
                multiline: 'always',
            },
        ],
        'vue/html-closing-bracket-spacing': [
            1,
            {
                // Vue 中的 html 的撰寫規則，詳請請查閱官方文件
                selfClosingTag: 'always',
            },
        ],
    },
};
