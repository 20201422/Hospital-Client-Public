<script>
const name='global_color'

// 颜色集 在这里添加颜色
const blue = '#007bff'  // 主题蓝
const blue1 = '#5b9ade' // 浅一些的蓝
const red = '#e2452e' // 中国红
const red1 ='#cc2c3c' // 更深一些的中国红
const yellow ='#e0d632' // 黄色
const yellow1 ='#fadc27'  // 黄色
const grey = '#a4a4a6'  // 灰色
const grey1 = '#f5f5f7' // 浅一些的灰色
const grey2 = '#7c7c7c' // 字体灰
const black1 = '#3b3b3d'  // 黑色
const white1 ='white' // 白色
const green = '#175850' // 绿色

// 在这里添加颜色的运用，只需修改下方颜色就可以全局修改
// 颜色运用-主题色、标题广告及footer背景色
// ⚠️注意⚠️：调整主题颜色时这四个都要改！！！！！！
// 喜迎二十大主题中国色
// const main_color = red  // 关联footer背景色以及标题广告上背景色，主题色
// const main_color1 = red1  // 标题广告下背景色，主题色
// const font_color = yellow // 标题广告字体颜色
// const font_color1 = yellow1 // 标题广告链接颜色
// 标准主题色
// const main_color = blue  // 关联footer背景色以及标题广告上背景色，主题色
// const main_color1 = blue1  // 标题广告下背景色，主题色
// const font_color = white1  // 标题广告字体颜色
// const font_color1 = white1 // 标题广告链接颜色

const main_color = green  // 关联footer背景色以及标题广告上背景色，主题色
const main_color1 = blue1  // 标题广告下背景色，主题色
const font_color = white1  // 标题广告字体颜色
const font_color1 = white1 // 标题广告链接颜色

// 颜色运用-按钮
const button_color = main_color // 添加按钮背景色（主）
const button_color1 = main_color1 // 添加按钮背景色（上）

// 颜色运用-灰色
const model_color = grey1 // 模块灰色
const shadow_color = grey // 阴影色
const font_grey = grey2 // 字体色

export default {
    userId: name,
    blue: blue,
    blue1: blue1,
    red: red,
    red1: red1,
    yellow: yellow,
    yellow1: yellow1,
    grey: grey,
    grey1: grey1,
    grey2: grey2,
    black1: black1,
    white1: white1,
    main_color: main_color,
    main_color1: main_color1,
    font_color: font_color,
    font_color1: font_color1,
    button_color: button_color,
    button_color1: button_color1,
    model_color: model_color,
    shadow_color: shadow_color,
    font_grey: font_grey,
}
</script>
