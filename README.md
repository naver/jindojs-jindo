# **Jindo JavaScript Framework** - Do more, easier and faster
=========================================================

Jindo is open source JavaScript framework developed by [NAVER Corp.](http://www.navercorp.com/en/index.nhn) since 2010,
providing a lot of useful methods in a way of wrapping native object and extending it.

Jindo is the main JavaScript framework used for developing most of NAVER's web products.

> **Jindo is part of JindoJS family product**

> JindoJS consists with : `Jindo, Jindo Component and Jindo Mobile Component`

> - __Official website__ : http://jindo.dev.naver.com/
> - __Online API Documentation__ : 
>   - English : http://jindo.dev.naver.com/docs/jindo/latest/desktop/en/
>   - Korean : http://jindo.dev.naver.com/docs/jindo/latest/desktop/ko/

## **Download**
You can download customized version at Jindo download page :
- English : http://jindo.dev.naver.com/utils/downloader/jindo/web/download.en.php
- Korean : http://jindo.dev.naver.com/utils/downloader/jindo/web/download.php


## **Modules**
- **$** : Select a DOM element by id or create new one.
- **$Jindo** : Provide information about Jindo, and provide utility methods.
- **$Class** : Provide methods to make object oriented programming style code.
- **$$(cssquery)** : CSS selector engine.
- **$Agent** : Provide information about browser, operating systems and user's system.
- **$A** : Utility methods handling Array.
- **$H** : Make enumerated key/value pair object hash, and provide utility methods to handle.
- **$Fn** : Wrap native Function object and extend it providing utility methods.
- **$Event** : Wrap native Event object and extend it providing utility methods.
- **$Element** : Wrap native HTML element and provide useful utility methods.
- **$ElementList** : Provide methods to handle more than one DOM elements at same time.
- **$Form** : Provide utility methods to handle &lt;form> element and its child elements.
- **$Document** : Provide information about document element.
- **$Window** : Wrap window object and provide useful methods.
- **$S** : Wrap native String object and extend it providing utility methods.
- **$Json** : Provide utility methods to handle JSON(JavaScript Object Notation).
- **$Ajax** : Utility methods handling AJAX request and response.
- **$Date** : Wrap native Date object and extend it providing utility methods.
- **$Cookie** : Utility methods handling Cookie.
- **$Template** : Template engine.

## **How to build your own version of Jindo**

First, make directory where you want have the source of Jindo, then get the source from repo.

```bash
# make directory and enter
$ mkdir jindo && cd jindo

# get the clone from the repo
$ git clone https://github.com/naver/jindojs-jindo.git

# install dependency modules for build and build!
$ npm install && grunt
```

- All of the build information like version, namespace setting, license, etc.,
can be found on 'package.json' file.
- Build files can be found at `'./dist'` directory and the structure will be like :


|depth1     | depth2 | Explanation |
| ---       | ---    | --- |
|**./dist** |        |  |
|           | desktop| desktop version object files, which each object files merged with comments |
|           | doc    | API documentaion |
|           | merged | Files which are merged and minified for distribution |
|           | meta   | meta files (dependencies info and changelog) |
|           | mobile | mobile version object files, which each object files merged with comments |


## **Running the Unit Test & Code Quality Tool**

Jindo use [QUnit](http://qunitjs.com/) for unit test and [JSHint](http://jshint.com/) for code quality, so make sure you have all the necessary dependencies installed.


### **Running on command line**
Running test on command line require [Grunt](http://gruntjs.com/) installed on your machine.

```bash
# to install dependencies modules
$ npm install

# run JSHInt & QUnit test together
$ grunt qp

# run JSHInt only
$ grunt jshint

# run QUnit test for deskop and mobile version
$ grunt qunit

# run QUnit test for desktop version only
$ grunt qunit:desktop

# run QUnit test for mobile version only
$ grunt qunit:mobile
```

### **Running on browser**
To run the test on your browser, you need to have a web server(like Apache) installed on your local machine.

```
# Test can be runned using via 1)runner file or 2)module file.

# 1) Runner file provide easy way for test modules separately or all test together.
http://localhost/jindo/test/[desktop|mobile]/runner.html?[all | module]

ex)
http://localhost/jindo/test/desktop/runner.html?all  # run all the desktop tests
http://localhost/jindo/test/mobile/runner.html?jindo.$Ajax  # run jindo.$Ajax mobile module test only


# 2) Module runner file
http://localhost/jindo/test/[desktop|mobile]/{$MODULE_NAME}.html

ex)
http://localhost/jindo/test/desktop/jindo.$Element.html  # run jindo.$Element desktop module test

```

## **i18n**
For now, Jindo support `Korean(ko)` and `English(en)` as well.

## **Issues**
When you find a bug, please report us via the [GitHub issues page](https://github.com/naver/jindojs-jindo/issues).

## **License**
- LGPL v2
- http://www.gnu.org/licenses/old-licenses/lgpl-2.0.html

# **Jindo JavaScript Framework** - Do more, easier and faster
=========================================================

Jindo is open source JavaScript framework developed by [NAVER Corp.](http://www.navercorp.com/en/index.nhn) since 2010,
providing a lot of useful methods in a way of wrapping native object and extending it.

Jindo is the main JavaScript framework used for developing most of NAVER's web products.

> **Jindo is part of JindoJS family product**

> JindoJS consists with : `Jindo, Jindo Component and Jindo Mobile Component`

> - __Official website__ : http://jindo.dev.naver.com/
> - __Online API Documentation__ :
>   - English : http://jindo.dev.naver.com/docs/jindo/latest/desktop/en/
>   - Korean : http://jindo.dev.naver.com/docs/jindo/latest/desktop/ko/

## **Download**
You can download customized version at Jindo download page :
- English : http://jindo.dev.naver.com/utils/downloader/jindo/web/download.en.php
- Korean : http://jindo.dev.naver.com/utils/downloader/jindo/web/download.php


## **Modules**
- **$** : Select a DOM element by id or create new one.
- **$Jindo** : Provide information about Jindo, and provide utility methods.
- **$Class** : Provide methods to make object oriented programming style code.
- **$$(cssquery)** : CSS selector engine.
- **$Agent** : Provide information about browser, operating systems and user's system.
- **$A** : Utility methods handling Array.
- **$H** : Make enumerated key/value pair object hash, and provide utility methods to handle.
- **$Fn** : Wrap native Function object and extend it providing utility methods.
- **$Event** : Wrap native Event object and extend it providing utility methods.
- **$Element** : Wrap native HTML element and provide useful utility methods.
- **$ElementList** : Provide methods to handle more than one DOM elements at same time.
- **$Form** : Provide utility methods to handle &lt;form> element and its child elements.
- **$Document** : Provide information about document element.
- **$Window** : Wrap window object and provide useful methods.
- **$S** : Wrap native String object and extend it providing utility methods.
- **$Json** : Provide utility methods to handle JSON(JavaScript Object Notation).
- **$Ajax** : Utility methods handling AJAX request and response.
- **$Date** : Wrap native Date object and extend it providing utility methods.
- **$Cookie** : Utility methods handling Cookie.
- **$Template** : Template engine.

## **How to build your own version of Jindo**

First, make directory where you want have the source of Jindo, then get the source from repo.

```bash
# make directory and enter
$ mkdir jindo && cd jindo

# get the clone from the repo
$ git clone https://github.com/naver/jindojs-jindo.git

# install dependency modules for build and build!
$ npm install && grunt
```

- All of the build information like version, namespace setting, license, etc.,
can be found on 'package.json' file.
- Build files can be found at `'./dist'` directory and the structure will be like :


|depth1     | depth2 | Explanation |
| ---       | ---    | --- |
|**./dist** |        |  |
|           | desktop| desktop version object files, which each object files merged with comments |
|           | doc    | API documentaion |
|           | merged | Files which are merged and minified for distribution |
|           | meta   | meta files (dependencies info and changelog) |
|           | mobile | mobile version object files, which each object files merged with comments |


## **Running the Unit Test & Code Quality Tool**

Jindo use [QUnit](http://qunitjs.com/) for unit test and [JSHint](http://jshint.com/) for code quality, so make sure you have all the necessary dependencies installed.


### **Running on command line**
Running test on command line require [Grunt](http://gruntjs.com/) installed on your machine.

```bash
# to install dependencies modules
$ npm install

# run JSHInt & QUnit test together
$ grunt qp

# run JSHInt only
$ grunt jshint

# run QUnit test for deskop and mobile version
$ grunt qunit

# run QUnit test for desktop version only
$ grunt qunit:desktop

# run QUnit test for mobile version only
$ grunt qunit:mobile
```

### **Running on browser**
To run the test on your browser, you need to have a web server(like Apache) installed on your local machine.

```
# Test can be runned using via 1)runner file or 2)module file.

# 1) Runner file provide easy way for test modules separately or all test together.
http://localhost/jindo/test/[desktop|mobile]/runner.html?[all | module]

ex)
http://localhost/jindo/test/desktop/runner.html?all  # run all the desktop tests
http://localhost/jindo/test/mobile/runner.html?jindo.$Ajax  # run jindo.$Ajax mobile module test only


# 2) Module runner file
http://localhost/jindo/test/[desktop|mobile]/{$MODULE_NAME}.html

ex)
http://localhost/jindo/test/desktop/jindo.$Element.html  # run jindo.$Element desktop module test

```

## **i18n**
For now, Jindo support `Korean(ko)` and `English(en)` as well.

## **Issues**
When you find a bug, please report us via the [GitHub issues page](https://github.com/naver/jindojs-jindo/issues).

## **License**
- LGPL v2
- http://www.gnu.org/licenses/old-licenses/lgpl-2.0.html

## **Who uses Jindo?**

Important numbers of companies has been chosen JindoJS to build their web products. A few of them are listed below.

![They uses JindoJS!](http://jindo.dev.naver.com/jindo_home/img/reference.png)

- [NAVER](http://www.naver.com/),
[CJMall](http://mw.cjmall.com/),
[YES24](http://m.yes24.com/),
[iSTYLE24](http://m.istyle24.com/),
[FUNSHOP](http://m.funshop.co.kr/),
[U+](http://page.uplus.co.kr/),
[CGV](http://m.cgv.co.kr/),
[FOOTBALL DAY](http://m.fd.naver.com/gmc/home),
[Kumkang](http://www.kumkang.com/),
[IPG](http://m.infopub.co.kr/),
[pxd](http://www.pxd.co.kr/),
[Open Books](http://m.openbooks.co.kr/)


[![Analytics](https://ga-beacon.appspot.com/UA-45811892-6/jindojs-jindo/readme)](https://github.com/naver/jindojs-jindo)