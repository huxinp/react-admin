# 单选, 多选组件

> index.js
导出 单选, 多选, 单选组, 多选组 组件
```react
import { Checkbox, Radio } from 'Checkbox/index.js';
...
{/*  */}
{/* 通过 options 传入数据, 自动渲染 */}
<Checkbox.Group
  name="4"
  options={[{value: '12', label: '多选'}]}
  onChange={(val) => Object.prototype.toString().call(val) === '[object Array]'}
/>

{/* 单个多选 */}
<Checkbox value="12">多选<Checkbox>

{/* 单个单选 */}
<Radio value="1" defaultChecked={true} disabled={true}>男</Radio>

{/* 通过子组件手动渲染数据 */}
<Radio.Group name="3">
  <Radio>345</Radio>
</Radio.Group>
...
```

> Input.js     输入组件
> Checkbox.js  多选组件
> Radio.js     单选组件

Checkbox 和 Radio 都是在 Input 组件上包了一层, 并且 props 会传递到 Input 上
```react
Input.propTypes = {
  prefixCls: PropTypes.string,
  className: PropTypes.string,
  id: PropTypes.string,    // input dom 的 id
  tabIndex: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  disabled: PropTypes.bool,
  defaultChecked: PropTypes.oneOfType([PropTypes.number, PropTypes.bool]),
  checked: PropTypes.oneOfType([PropTypes.number, PropTypes.bool]),
  name: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  type: PropTypes.oneOf(['radio', 'checkbox']),  // 控制单选或多选
  readOnly: PropTypes.bool,
  autoFocus: PropTypes.bool,
  value: PropTypes.any,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  onFocus: PropTypes.func,
  onClick: PropTypes.func,
  indeterminate: PropTypes.bool,  // 半选, (单选没效果)
}
```
onChange 接收一个对象
```js
{
  target: {
    ...this.props,
    checked: e.target.checked, // 覆盖 props 当中的 checked
  },
  nativeEvent: e.nativeEvent,
  stopPropagation() {
    e.stopPropagation();
  },
  preventDefault() {
    e.preventDefault();
  },
}
```

> Group.js 成组渲染选择器

```react
<Group
  name="性别"
  type="radio"
  onChange={a => a[0] === '1'}
  options={[
    {label: '男', value: '1'},
    {label: '女', value: '0'}
  ]}
  defaultValue="1"
/>
<Group name="水果" onChange={a => console.log(a)}>
  <Checkbox value="1">西瓜</CheckBox>
  <Checkbox value="1">葡萄</CheckBox>
  <Checkbox value="1">苹果</CheckBox>
</Group>
```
props.children 和 props.options 同时存在时, 以 props.children 为准

onChange 接收一个数组

> Checkbox.Group    
实际上就是  `<Group type="checkbox" {...props} />`

> Radio.Group   
实际上就是  `<Group type="radio" {...props} />`
