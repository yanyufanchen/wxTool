## WxValidate - 表单验证

## 插件介绍

该插件是参考 jQuery Validate 封装的，为小程序表单提供了一套常用的验证规则，包括手机号码、电子邮件验证等等，同时提供了添加自定义校验方法，让表单验证变得更简单。

原文文档地址：<https://github.com/skyvow/wx-extend/blob/master/docs/components/validate.md>

## 参数说明

| 参数       | 类型       | 描述        |
| -------- | -------- | --------- |
| rules    | `object` | 验证字段的规则   |
| messages | `object` | 验证字段的提示信息 |

## 内置校验规则

| 序号   | 规则                     | 描述                                      |
| ---- | ---------------------- | --------------------------------------- |
| 1    | `required: true`       | 这是必填字段。                                 |
| 2    | `email: true`          | 请输入有效的电子邮件地址。                           |
| 3    | `tel: true`            | 请输入11位的手机号码。                            |
| 4    | `url: true`            | 请输入有效的网址。                               |
| 5    | `date: true`           | 请输入有效的日期。                               |
| 6    | `dateISO: true`        | 请输入有效的日期（ISO），例如：2009-06-23，1998/01/22。 |
| 7    | `number: true`         | 请输入有效的数字。                               |
| 8    | `digits: true`         | 只能输入数字。                                 |
| 9    | `idcard: true`         | 请输入18位的有效身份证。                           |
| 10   | `equalTo: 'field'`     | 输入值必须和 field 相同。                        |
| 11   | `contains: 'ABC'`      | 输入值必须包含 ABC。                            |
| 12   | `minlength: 5`         | 最少要输入 5 个字符。                            |
| 13   | `maxlength: 10`        | 最多可以输入 10 个字符。                          |
| 14   | `rangelength: [5, 10]` | 请输入长度在 5 到 10 之间的字符。                    |
| 15   | `min: 5`               | 请输入不小于 5 的数值。                           |
| 16   | `max: 10`              | 请输入不大于 10 的数值。                          |
| 17   | `range: [5, 10]`       | 请输入范围在 5 到 10 之间的数值。                    |

## 常用实例方法

| 名称                               | 返回类型      | 描述                  |
| -------------------------------- | --------- | ------------------- |
| checkForm(e)                     | `boolean` | 验证所有字段的规则，返回验证是否通过。 |
| valid()                          | `boolean` | 返回验证是否通过。           |
| size()                           | `number`  | 返回错误信息的个数。          |
| validationErrors()               | `array`   | 返回所有错误信息。           |
| addMethod(name, method, message) | `boolean` | 添加自定义验证方法。          |

## addMethod(name, method, message) - 添加自定义校验

第一个参数 name 是添加的方法的名字。 第二个参数 method 是一个函数，接收三个参数 (value, param) ，value 是元素的值，param 是参数。 第三个参数 message 是自定义的错误提示。

## 使用说明

```
wxml——————————
<form bindsubmit='submitForm'>
	 <input class="input_name" name="name" type="text" value="{{name}}" 				bindchange="bindNameChange" placeholder="请输入">
	 <button class="apply_btn" form-type='submit'>发起预约</button>
<form>
// 采用name属性来捕捉验证规则

js————————
// 在onload初始化验证字段的规则——————start
const rules = {
    email: {
        required: true,
        email: true,
    },
    tel: {
        required: true,
        tel: true,
    },
    idcard: {
        required: true,
        idcard: true,
    },
}

// 验证字段的提示信息，若不传则调用默认的信息
const messages = {
    email: {
        required: '请输入邮箱',
        email: '请输入正确的邮箱',
    },
    tel: {
        required: '请输入手机号',
        tel: '请输入正确的手机号',
    },
    idcard: {
        required: '请输入身份证号码',
        idcard: '请输入正确的身份证号码',
    },
}

// 创建实例对象
this.WxValidate = new WxValidate(rules, messages)

// 自定义验证规则
this.WxValidate.addMethod('assistance', (value, param) => {
    return this.WxValidate.optional(value) || (value.length >= 1 && value.length <= 2)
}, '请勾选1-2个敲码助手')

// 如果有个表单字段的 assistance，则在 rules 中写
assistance: {
    required: true,
    assistance: true,
},
————————————end

// 然后点击提交按钮-调用验证方法，传入参数 e 是 form 表单组件中的数据
submitForm(e) {
    const params = e.detail.value

    console.log(params)

    // 传入表单数据，调用验证方法
    if (!this.WxValidate.checkForm(e)) {
        const error = this.WxValidate.errorList[0]
        return false
    }
},
```

最后是详细的使用方法

<https://www.cnblogs.com/cisum/p/9556736.html>