# vue - property - decorator

```javascript

1，@Component(options:ComponentOptions = {})

@Component 装饰器可以接收一个对象作为参数，可以在对象中声明 components ，filters，directives等未提供装饰器的选项，也可以声明computed，watch等

import { Vue, Component } from 'vue-property-decorator'

@Component({
  filters: {
    toFixed: (num: number, fix: number = 2) => {
      return num.toFixed(fix)
    }
  }
})
export default class MyComponent extends Vue {
  public list: number[] = [0, 1, 2, 3, 4]
  get evenList() {
    return this.list.filter((item: number) => item % 2 === 0)
  }
}

2，@Prop(options: (PropOptions | Constructor[] | Constructor) = {})

@Prop装饰器接收一个参数，这个参数可以有三种写法：

Constructor，例如String，Number，Boolean等，指定 prop 的类型；
Constructor[]，指定 prop 的可选类型；
PropOptions，可以使用以下选项：type，default，required，validator。
import { Vue, Component, Prop } from 'vue-property-decorator'

@Componentexport default class MyComponent extends Vue {
  @Prop(String) public propA: string | undefined
  @Prop([String, Number]) public propB!: string | number
  @Prop({
    type: String,
    default: 'abc'
  })
  public propC!: string
}
等同于下面的js写法

export default {
  props: {
    propA: {
      type: Number
    },
    propB: {
      default: 'default value'
    },
    propC: {
      type: [String, Boolean]
    }
  }
}
注意：

属性的ts类型后面需要加上undefined类型；或者在属性名后面加上!，表示非null 和 非undefined
的断言，否则编译器会给出错误提示；
指定默认值必须使用上面例子中的写法，如果直接在属性名后面赋值，会重写这个属性，并且会报错。
3，@PropSync(propName: string, options: (PropOptions | Constructor[] | Constructor) = {})

@PropSync装饰器与@prop用法类似，二者的区别在于：

@PropSync 装饰器接收两个参数：
propName: string 表示父组件传递过来的属性名；
options: Constructor | Constructor[] | PropOptions 与@Prop的第一个参数一致；
@PropSync 会生成一个新的计算属性。
import { Vue, Component, PropSync } from 'vue-property-decorator'

@Component
export default class MyComponent extends Vue {
  @PropSync('propA', { type: String, default: 'abc' }) public syncedPropA!: string
}
等同于下面的js写法

export default {
  props: {
    propA: {
      type: String,
      default: 'abc'
    }
  },
  computed: {
    syncedPropA: {
      get() {
        return this.propA
      },
      set(value) {
        this.$emit('update:propA', value)
      }
    }
  }
}
注意：@PropSync需要配合父组件的.sync修饰符使用

4，@Model(event?: string, options: (PropOptions | Constructor[] | Constructor) = {})

@Model装饰器允许我们在一个组件上自定义v-model，接收两个参数：

event: string 事件名。
options: Constructor | Constructor[] | PropOptions 与@Prop的第一个参数一致。
import { Vue, Component, Model } from 'vue-property-decorator'

@Component
export default class MyInput extends Vue {
  @Model('change', { type: String, default: '123' }) public value!: string
}
等同于下面的js写法

export default {
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    value: {
      type: String,
      default: '123'
    }
  }
}
上面例子中指定的是change事件，所以我们还需要在template中加上相应的事件：

<template>
  <input
    type="text"
    :value="value"
    @change="$emit('change', $event.target.value)"
  />
</template>
对自定义v-model不太理解的同学，可以查看自定义事件

5，@Watch(path: string, options: WatchOptions = {})

@Watch 装饰器接收两个参数：

path: string 被侦听的属性名；
options?: WatchOptions={} options可以包含两个属性 ：
immediate?:boolean 侦听开始之后是否立即调用该回调函数；
deep?:boolean 被侦听的对象的属性被改变时，是否调用该回调函数；

侦听开始，发生在beforeCreate勾子之后，created勾子之前

import { Vue, Component, Watch } from 'vue-property-decorator'

@Component
export default class MyInput extends Vue {
  @Watch('msg')
  public onMsgChanged(newValue: string, oldValue: string) {}

  @Watch('arr', { immediate: true, deep: true })
  public onArrChanged1(newValue: number[], oldValue: number[]) {}

  @Watch('arr')
  public onArrChanged2(newValue: number[], oldValue: number[]) {}
}
等同于下面的js写法

export default {
  watch: {
    msg: [
      {
        handler: 'onMsgChanged',
        immediate: false,
        deep: false
      }
    ],
    arr: [
      {
        handler: 'onArrChanged1',
        immediate: true,
        deep: true
      },
      {
        handler: 'onArrChanged2',
        immediate: false,
        deep: false
      }
    ]
  },
  methods: {
    onMsgVhanged(newValue, oldValue) {},
    onArrChange1(newValue, oldValue) {},
    onArrChange2(newValue, oldValue) {}
  }
}

6，@Emit(event?: string)

@Emit 装饰器接收一个可选参数，该参数是$Emit的第一个参数，充当事件名。如果没有提供这个参数，$Emit会将回调函数名的camelCase转为kebab-case，并将其作为事件名；
@Emit会将回调函数的返回值作为第二个参数，如果返回值是一个Promise对象，$emit会在Promise对象被标记为resolved之后触发；
@Emit的回调函数的参数，会放在其返回值之后，一起被$emit当做参数使用。
import { Vue, Component, Emit } from 'vue-property-decorator'

@Component
export default class MyComponent extends Vue {
  count = 0
  @Emit()
  public addToCount(n: number) {
    this.count += n
  }
  @Emit('reset')
  public resetCount() {
    this.count = 0
  }
  @Emit()
  public returnValue() {
    return 10
  }
  @Emit()
  public onInputChange(e) {
    return e.target.value
  }
  @Emit()
  public promise() {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(20)
      }, 0)
    })
  }
}
等同于下面的js写法

export default {
  data() {
    return {
      count: 0
    }
  },
  methods: {
    addToCount(n) {
      this.count += n
      this.$emit('add-to-count', n)
    },
    resetCount() {
      this.count = 0
      this.$emit('reset')
    },
    returnValue() {
      this.$emit('return-value', 10)
    },
    onInputChange(e) {
      this.$emit('on-input-change', e.target.value, e)
    },
    promise() {
      const promise = new Promise(resolve => {
        setTimeout(() => {
          resolve(20)
        }, 0)
      })
      promise.then(value => {
        this.$emit('promise', value)
      })
    }
  }
}

7，@Ref(refKey?: string)

@Ref 装饰器接收一个可选参数，用来指向元素或子组件的引用信息。如果没有提供这个参数，会使用装饰器后面的属性名充当参数

import { Vue, Component, Ref } from 'vue-property-decorator'
import { Form } from 'element-ui'

@Componentexport default class MyComponent extends Vue {
  @Ref() readonly loginForm!: Form
  @Ref('changePasswordForm') readonly passwordForm!: Form

  public handleLogin() {
    this.loginForm.validate(valide => {
      if (valide) {
        // login...
      } else {
        // error tips
      }
    })
  }
}
等同于下面的js写法

export default {
  computed: {
    loginForm: {
      cache: false,
      get() {
        return this.$refs.loginForm
      }
    },
    passwordForm: {
      cache: false,
      get() {
        return this.$refs.changePasswordForm
      }
    }
  }
}

8. Mixins
在使用Vue进行开发时我们经常要用到混合,结合TypeScript之后我们有两种mixins的方法.

一种是vue-class-component提供的.

//定义要混合的类 mixins.ts
import Vue from 'vue';
import  Component  from 'vue-class-component';

@Component  // 一定要用Component修饰
export default class myMixins extends Vue {
    value: string = "Hello"
}
// 引入
import  Component  {mixins}  from 'vue-class-component';
import myMixins from 'mixins.ts';

@Component
export class myComponent extends mixins(myMixins) {
                          // 直接extends myMinxins 也可以正常运行
      created(){
          console.log(this.value) // => Hello
    }
}
第二种方式是在@Component中混入.

我们改造一下mixins.ts,定义vue/type/vue模块,实现Vue接口

// mixins.ts
import { Vue, Component } from 'vue-property-decorator';


declare module 'vue/types/vue' {
    interface Vue {
        value: string;
    }
}

@Component
export default class myMixins extends Vue {
    value: string = 'Hello'
}
混入

import { Vue, Component, Prop } from 'vue-property-decorator';
import myMixins from '@static/js/mixins';

@Component({
    mixins: [myMixins]
})
export default class myComponent extends Vue{
    created(){
        console.log(this.value) // => Hello
    }
}
总结: 两种方式不同的是在定义mixins时如果没有定义vue/type/vue模块, 那么在混入的时候就要继承该mixins; 如果定义vue/type/vue模块,在混入时可以在@Component中mixins直接混入.

9.@Model
Vue组件提供model: {prop?: string, event?: string}让我们可以定制prop和event.
默认情况下，一个组件上的v-model 会把 value用作 prop且把 input用作 event，但是一些输入类型比如单选框和复选框按钮可能想使用 value prop来达到不同的目的。使用model选项可以回避这些情况产生的冲突。

下面是Vue官网的例子
Vue.component('my-checkbox', {
  model: {
    prop: 'checked',
    event: 'change'
  },
  props: {
    // this allows using the `value` prop for a different purpose
    value: String,
    // use `checked` as the prop which take the place of `value`
    checked: {
      type: Number,
      default: 0
    }
  },
  // ...
})
<my-checkbox v-model="foo" value="some value"></my-checkbox>
上述代码相当于：

<my-checkbox
  :checked="foo"
  @change="val => { foo = val }"
  value="some value">
</my-checkbox>
即foo双向绑定的是组件的checke, 触发双向绑定数值的事件是change

使用vue-property-decorator提供的@Model改造上面的例子.

import { Vue, Component, Model} from 'vue-property-decorator';

@Component
export class myCheck extends Vue{
   @Model ('change', {type: Boolean})  checked!: boolean;
}
总结, @Model()接收两个参数, 第一个是event值, 第二个是prop的类型说明, 与@Prop类似, 这里的类型要用JS的. 后面在接着是prop和在TS下的类型说明.


```