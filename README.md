#lt-admin-ng-ant
[![CodeFactor](https://www.codefactor.io/repository/github/huajian123/ng-ant-admin/badge)](https://www.codefactor.io/repository/github/huajian123/ng- ant-admin)
![License](https://img.shields.io/badge/License-MIT-blue.svg)
[![Angular](https://img.shields.io/badge/Build%20with-Angular%20CLI-red?logo=angular)](https://www.github.com/angular/angular)


## ✨Features

-Support the latest angular version
- Support the latest angular version
- All components onPush, excellent performance
- All components onPush, excellent performance
- Rich code examples, complete server backend, front-end and back-end separation examples
- Rich code examples, complete server background, front-end and back-end separation examples
- Commonly used tool classes, services, instructions, and pipelines encapsulate common functions such as tables, drawers, and dialog boxes.
- Common tools, services, instructions, pipelines. Encapsulates common functions such as tables, drawers, and dialog boxes
- <font color=red size=6> All components are independent components, reducing the file size (if you need the module version, please see [here](https://github.com/andryfy/lt-admin-ng-ant/releases/ tag/v15.0))</font>
- <font color=red size=6>Standalone Components（module style is [here](https://github.com/andryfy/lt-admin-ng-ant/releases/tag/v15.0)）</font>


## Documentation

For documentation and examples, visit [doc](http://1.117.181.242:8081/)
<br>
<br>
Angular has been updated more in the past year than in the past few years. The API has many inconsistent writing methods, so the schematic has not been updated in time. Now single is only a developer preview version. In order to ensure production, I have not used it in the ng16 version. I think Wait for the api to be written stably before updating the schematic. If you want to use the schematic I provided, you can only adapt to the ng15 version at present, and use the module instead of the independent component version.
# Project Introduction
1. If you use my project for study or reference, please first determine which version of angular you are using, because some of the writing methods are different after angular15, so my suggestion is, which version of angular are you using, then download the corresponding version For ng-ant-admin, the latest version can be downloaded directly from the master branch, and the historical version can be downloaded from this link [here] (https://github.com/andryfy/lt-admin-ng-ant/releases). <br>
1. If you use my project for study or reference, please first determine which version of angular you are using, because some of the writing methods are different after angular15, so my suggestion is, what version of angular are you using, then download the The corresponding version of ng-ant-admin, the latest version can be downloaded directly from the master branch, and the historical version can be downloaded from this link [here](https://github.com/andryfy/lt-admin-ng-ant /releases). <br>
<br>
<br>
2. Account admin, password 123456, all under the system management menu are true. API interface calling example, the database is restored from backup every 10 minutes<br>
2.Account admin, password 123456, under the system management menu are real api interface call examples, the database is restored from backup every 10 minutes<br>
<br>
<br>
3. The default login timeout is 1 hour, and upload, download, websocket, and system management modules are all real interface call displays. <br>
3.The default login timeout is 1h, upload, download, websocket, and system management modules are all real interface call display. <br>
<br>
<br>
4. Complete the most commonly used permission control, personnel account management, role management, menu management, login timeout, etc. Lots of business examples added, ready to use out of the box. <br>
4. Complete the most commonly used permission control, personnel account management, role management, menu management, login timeout, etc. Added a lot of business examples, out of the box. <br>
<br>
<br>
5. If you encounter problems using this project, you can join the 376065816 qq group number to communicate with me. <br>
5. If you encounter problems using this project, you can join the 376065816 qq group number to communicate with me. <br>
<br>
<br>
Detailed Explanation of Quick Second Opening [Detailed Explanation of Quick Second Opening](https://www.bilibili.com/video/BV1gF411x7rN/)<br>
Project Build Simple Tutorial [Project Build Simple Tutorial](https://www.bilibili.com/video/BV1EM4y1w7zd/)<br>
Online demo address [demo](http://1.117.181.242/)<br>
Pure version project address [pure](https://gitee.com/hjxiaoqianduan/ng-ant-admin-pure/)<br>
pure project address [pure](https://gitee.com/hjxiaoqianduan/ng-ant-admin-pure/)<br>
Server source address [serviceApi](https://github.com/andryfy/lt-admin-ng-ant-api)<br>
serviceApi address [serviceApi](https://github.com/andryfy/lt-admin-ng-ant-api)<br>
Online swagger address [swagger](http://1.117.181.242:8003/swagger-ui.html#/)<br>


#Routing key(routing key)
The key needs to be set to the string after the last '/' of the routing address, and it must be unique<br>
The key needs to be set to the string after the last '/' of the routing address, and it must be unique<br>
```typescript
const routes: Routes = [
   {path: '', data: {key: 'login', shouldDetach: 'no'}, component: LoginFormComponent}
];
```
# Grid system monitoring (grid system monitoring)
```angular2html
enum EquipmentWidth {
   xs, // (max-width: 575.98px)
   sm, // (min-width: 576px) and (max-width: 767.98px)
   md, // (min-width: 768px) and (max-width: 991.98px)
   lg, // (min-width: 992px) and (max-width: 1199.98px)
   xl, // (min-width: 1200px) and (max-width: 1599.98px)
   xxl // (min-width: 1600px)
}
```
How to use
```
   constructor(private windowsWidthService: WindowsWidthService) {
   }
  
   this.windowsWidthService.getWindowWidthStore().pipe(takeUntil(this.destory$)).subscribe(res => {
     this.currentEquipmentWidth = res;
     this.cdr.markForCheck();
   })
```


# Modules do not need to be preloaded (Modules do not need to be preloaded)

```typescript
export const routes: Routes = [
   {
     path: 'contact',
     loadChildren: import(() => './contact/contact.module').then(m => m.ContactModule),
     data: {
       preload: false
     }
   }
];
```


# Modules don't need to save state (Modules don't need to save state)

```typescript
const routes: Routes = [
   {path: '', data: {key: 'login', shouldDetach: 'no'}, component: LoginFormComponent}
];
```

# Open a new tab page in the module to display the details, and the parameters must be set as follows (Open a new tab page in the module to display the details, and the parameters must be set as follows)
Set newTab in data (newTab Set newTab in data)
```typescript
const routes: Routes = [
   {path: '', component: TabsComponent, data: {title: 'Tab operation', key: 'tabs'}},
   {path: 'example-detail', component: DetailComponent, data: {newTab:'true', title: 'Demo Details', key: 'example-detail'}}
];
```

# The scroll bar of the specified container in the cache page (The scroll bar of the specified container in the cache page)
Set scrollContain as element selector in data (Set scrollContain as element selector in data)
```typescript
   {path: '', component: KeepScrollPageComponent, data: {title: 'Cache Scrollbar', key: 'keep-scroll-page', scrollContain:['#div-scroll1','#div-scroll2']}}

```

# The temporary statement cycle of switching tab calls is as follows under route reuse (The temporary statement cycle of switching tab calls is as follows)

```typescript
_onReuseInit: () => void;
_onReuseDestroy: () => void;

```
This can be achieved by directly writing a method named _onReuseInit or _onReuseDestroy in the target component<br>
It can be realized by directly writing the method named _onReuseInit or _onReuseDestroy in the target component<br>

## System screenshot
![ScreenShot](https://github.com/andryfy/lt-admin-ng-ant/blob/master/projectImg/11.png)

## star support
I built the back-end service interface on the server at my own expense, so if this project is useful to you, if you are willing, please raise your sexy little hand to help me order a free star to encourage, thank you<br>
<br>
if help you, if you want ,please give me a star ,thank you<br>


## donate
If this project is useful to you, and you happen to want to buy me a cup of coffee, please scan the code below, haha<br>
If this project is useful to you, and you happen to want to invite me for a cup of coffee, please scan Alipay or WeChat<br>
![ScreenShot](https://github.com/andryfy/lt-admin-ng-ant/blob/master/projectImg/weixin.jpeg)
![ScreenShot](https://github.com/andryfy/lt-admin-ng-ant/blob/master/projectImg/zhifubao.jpeg)



### 🏴Authorization AgreementLicense

MIT 
