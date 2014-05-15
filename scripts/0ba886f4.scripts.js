"use strict";function Company(){this.name,this.address,this.contactActor,this.email,this.services={},this.setAddress=function(a){if("object"!=typeof a)throw new Error("options must be object");try{this.address={attention:a.attention||null,address1:a.address1,address2:a.address2||null,city:a.city,province:a.province,postalcode:a.postalcode},this.email=a.email||null}catch(b){throw new Error("missing address items for service contactActor")}},this.getAddress=function(){return this.address},this.setContactActor=function(a){if("object"!=typeof a)throw new Error("options must be object");this.contactActor={name:a.name||null,title:a.title||"Privacy Officer"}},this.getContactActor=function(){return this.contactActor},this.setName=function(a){this.name=a},this.getName=function(){return this.name},this.setEmail=function(a){if(!validateEmail(a))throw new Error("email address invalid");this.email=a},this.getEmail=function(){return this.email},this.addService=function(a){this.services[a.getId()]=a},this.getServices=function(){return this.services},this.getService=function(a){if("undefined"!=typeof this.services[a])return this.services[a];throw new Error("No service with that ID present for company "+company.name)}}function Service(a){this.name,this.serviceType,this.serviceId=a,this.servicePiiTypes=[],this.getId=function(){return this.serviceId},this.setName=function(a){this.name=a},this.getName=function(){return this.name},this.setServiceType=function(a){this.serviceType=a,this.saveServiceTypePIIDefaults()},this.getServiceType=function(){return this.serviceType},this.saveServiceTypePIIDefaults=function(){if("undefined"==typeof this.serviceType)throw new Error("Can't get service type defaults without a type");this.servicePiiTypes=this.serviceType.getPiiTypes()},this.getServicePiiTypes=function(){return this.servicePiiTypes}}function ServiceType(a){this.name=a,this.piiTypes=[],this.addPiiType=function(a){this.piiTypes.push(a)},this.addPiiTypes=function(a){this.piiTypes=this.piiTypes.concat(a)},this.getPiiTypes=function(){return this.piiTypes}}function validateEmail(a){var b=/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;return b.test(a)}function getInnerText(a){var b,c,d="";return"undefined"!=typeof document.selection&&"undefined"!=typeof document.body.createTextRange?(c=document.body.createTextRange(),c.moveToElementText(a),d=c.text):"undefined"!=typeof window.getSelection&&"undefined"!=typeof document.createRange&&(b=window.getSelection(),b.selectAllChildren(a),d=""+b,b.removeAllRanges()),d}var pirsApp=angular.module("pirsApp",["ngRoute"]).config(["$routeProvider",function(a){a.when("/",{templateUrl:"views/main.html",controller:"MainCtrl"}).when("/companyInfo",{templateUrl:"views/company.html",controller:"CompanyCtrl"}).when("/subscriberInfo",{templateUrl:"views/subscriber.html",controller:"SubscriberCtrl"}).when("/accountInfo",{templateUrl:"views/accountInfo.html",controller:"AccountCtrl"}).when("/letter",{templateUrl:"views/letter.html",controller:"LetterCtrl"}).when("/finish",{templateUrl:"views/finish.html",controller:"FinishCtrl"}).otherwise({redirectTo:"/"})}]);pirsApp.service("StateDataManager",["$rootScope",function(a){var b={};return b.items={},b.has=function(a){if("string"!=typeof a)throw"itemKey must be a string";return"undefined"!=typeof b.items[a]?!0:!1},b.get=function(a){if(this.has(a))return this.items[a];throw"no data registered under that key"},b.pop=function(a){if("string"!=typeof a)throw"itemKey must be a string";delete this.items[a],this.broadcast(a)},b.stash=function(a,b){if("string"!=typeof a)throw"itemKey must be a string";this.items[a]=b,this.broadcast(a,b)},b.broadcast=function(b,c){var d="stateDataManager.update."+b;console.log(d,c),a.$broadcast(d,c)},b}]),pirsApp.service("NavCollection",["$rootScope",function(){var a={};return a.collection=[],a.ordered=!0,a.addNavItem=function(b,c,d,e){var f=_.findWhere(this.collection,{id:b});if(f)throw Error("item already exists in collection with id",b);var g={};g.path=c,g.name=d,g.id=b,g.icon=e,g.restricted=!0,g.selected=!1,a.collection.push(g)},a.selectedNavItem,a.previousItem=function(){var a;return this.selectedNavItem?(a=this.collection.indexOf(this.selectedNavItem)>0?this.collection.indexOf(this.selectedNavItem)-1:this.collection.indexOf(this.selectedNavItem),this.collection[a]):void 0},a.nextItem=function(){var a;return this.selectedNavItem?(a=this.collection.indexOf(this.selectedNavItem)<this.collection.length-1?this.collection.indexOf(this.selectedNavItem)+1:this.collection.indexOf(this.selectedNavItem),this.collection[a]):void 0},a.select=function(a){var b=_.findWhere(this.collection,{id:a});if(!b)throw Error("No item in nav collection by id",a);this.selectedNavItem&&(this.selectedNavItem.selected=!1),this.selectedNavItem=b,this.selectedNavItem.selected=!0},a.restrict=function(b){var c=_.findWhere(this.collection,{id:b}),d=!1;if(!c)throw Error("No item in nav collection by id",b);c.restricted=!0,angular.forEach(this.collection,function(b){b===c&&a.ordered&&(d=!0),d&&(b.restricted=!0)})},a.unRestrict=function(a){var b=_.findWhere(this.collection,{id:a});if(!b)throw Error("No item in nav collection by id",a);b.restricted=!1},a.selectByPath=function(a){var b=_.findWhere(this.collection,{path:a});this.select(b.id)},a}]),pirsApp.service("PdfLetter",function(){var a={};return a.generate=function(a,b){var b=b;console.log(a);var c,d=new jsPDF("p","pt","letter"),e=document.createElement("div"),f=a,g={top:80,bottom:60,left:40,width:522},h={"#bypassme":function(){return!0}};e.innerHTML=f.html(),console.log(f.html()),c=e,d.fromHTML(c,g.left,g.top,{width:g.width,elementHandlers:h},function(){d.save("letter.pdf"),b()},g)},a}),pirsApp.directive("uiLadda",[function(){return{link:function(a,b,c){var d=Ladda.create(b[0]);a.$watch(c.uiLadda,function(a,b){angular.isNumber(b)?angular.isNumber(a)?d.setProgress(a):a&&d.setProgress(0)||d.stop():a&&d.start()||d.stop()})}}}]),pirsApp.directive("ngEnter",function(){return function(a,b,c){b.bind("keydown keypress",function(b){13===b.which&&(a.$apply(function(){a.$eval(c.ngEnter)}),b.preventDefault())})}}),pirsApp.controller("NoticeCtrl",["$scope","StateDataManager",function(a){a.active=!1,a.nextIsLoading=!1,a.next=function(){a.nextIsLoading=!0},a.$on("stateDataManager.update.noticeValue",function(b,c){console.log(arguments),a.active=c,c||(a.nextIsLoading=!1)})}]),pirsApp.controller("ProgressCtrl",["$scope","$location","StateDataManager","NavCollection",function(a,b,c,d){a.stages=d.collection,d.unRestrict("home"),d.unRestrict("companyInfo"),a.$watch(function(){return b.path()},function(){a.activeLocation="#"+b.url(),d.selectByPath(a.activeLocation),a.previous=d.previousItem(),a.next=d.nextItem(),angular.forEach(a.stages,function(b,c){a.activeLocation==b.path?(b.active=!0,a.activeIndex=c):b.active=!1})})}]),pirsApp.run(["$http","StateDataManager","NavCollection",function(a,b,c){a({method:"GET",url:"data.json"}).success(function(a){var c,d,e={},f=[];c=a.results,d=c.piiQuestions,angular.forEach(c.serviceTypes,function(a,b){var c=new ServiceType(b);angular.forEach(a.piiQuestions,function(a){c.addPiiType(d[a])},c),e[b]=c},e),angular.forEach(c.companies,function(a){var b=new Company;b.setName(a.name),b.setAddress(a.address),b.setContactActor(a.contactActor),angular.forEach(a.services,function(a,c){var d=new Service(c);d.setServiceType(e[a.serviceType]),d.setName(a.name),b.addService(d)},b),f.push(b)},f),b.stash("companies",f)}).error(function(){});var d=[{name:"Overview",path:"#/",id:"home",icon:"glyphicon glyphicon-home"},{name:"Company",path:"#/companyInfo",id:"companyInfo",icon:"glyphicon glyphicon-briefcase"},{name:"Contact",path:"#/subscriberInfo",id:"subscriberInfo",icon:"glyphicon glyphicon-user"},{name:"Account",path:"#/accountInfo",id:"accountInfo",icon:"glyphicon glyphicon-barcode"},{name:"Letter",path:"#/letter",id:"letter",icon:"glyphicon glyphicon-file"},{name:"Complete",path:"#/finish",id:"finish",icon:"glyphicon glyphicon-flag"}];angular.forEach(d,function(a){c.addNavItem(a.id,a.path,a.name,a.icon)})}]),pirsApp.controller("MainCtrl",["$scope","StateDataManager","$timeout",function(a,b){a.nextIsLoading=!1,a.next=function(){a.nextIsLoading=!0},a.showNotice=function(){b.stash("noticeValue",!0)},a.hideNotice=function(){b.stash("noticeValue",!1)},b.has("alreadyDone")&&a.showNotice()}]),pirsApp.controller("CompanyCtrl",["$scope","$timeout","$location","$window","StateDataManager","NavCollection",function(a,b,c,d,e,f){d.scrollTo(0,0),f.unRestrict("companyInfo"),a.previous=function(){c.path("/")},a.nextIsLoading=!1,a.companies=e.get("companies"),e.has("company")&&(a.company=e.get("company")),a.services=e.has("services")?e.get("services"):[],a.prepServices=function(){a.services=[],angular.forEach(a.company.getServices(),function(a){this.push({selected:!1,serviceObj:a})},a.services),e.stash("services",a.services)},a.showService=function(a){return"selected"===a.selected},a.getPiiTypes=function(){var b=[];angular.forEach(a.services,function(c){a.showService(c)&&(b=b.concat(c.serviceObj.getServicePiiTypes()))},b),a.piiTypes=_.uniq(b),a.piiTypes.length>0?(a.IsServiceSelected=!0,f.unRestrict("subscriberInfo")):(a.IsServiceSelected=!1,f.restrict("subscriberInfo"))},a.next=function(){a.IsServiceSelected&&(a.nextIsLoading=!0,c.path("subscriberInfo"))},a.$watch("company",function(b,c){var d;"undefined"!=typeof a.company&&(console.log(b),e.stash("company",a.company),e.get("company")!==c&&(a.prepServices(),e.has("customer")&&(d=e.get("customer"),d.accountNo=null,d.phone=null,d.email=null,e.stash("customer",d)),e.has("servicesUnderOneAccount")&&e.pop("servicesUnderOneAccount"),e.has("singleAccount")&&e.pop("singleAccount"),e.has("alreadyDone")&&e.pop("alreadyDone"),a.hideNotice()))}),a.$watch("services",function(){a.getPiiTypes()},!0),a.$watch("piiTypes",function(){e.stash("piiTypes",a.piiTypes)},!0),a.showNotice=function(){e.stash("noticeValue",!0)},a.hideNotice=function(){e.stash("noticeValue",!1)},e.has("alreadyDone")&&a.showNotice()}]),pirsApp.controller("SubscriberCtrl",["$scope","$location","$window","StateDataManager","NavCollection",function(a,b,c,d,e){return c.scrollTo(0,0),a.nextIsLoading=!1,a.previous=function(){b.path("/companyInfo")},d.has("piiTypes")?(d.has("company")&&(a.company=d.get("company")),a.customer=d.has("customer")?d.get("customer"):{address:{}},a.customer.firstName="Andrew",a.customer.lastName="Hilts",a.customer.address.address1="32 Carden Street",a.customer.address.address2="#204",a.customer.address.city="Toronto",a.customer.address.province="ON",a.customer.address.postalcode="M5V1T2",a.provinces=[{name:"Alberta",code:"AB"},{name:"British Columbia",code:"BC"},{name:"Manitoba",code:"MB"},{name:"New Brunswick",code:"NB"},{name:"Newfoundland",code:"NL"},{name:"Northwest Territories",code:"NT"},{name:"Nova Scotia",code:"NS"},{name:"Nunavut",code:"NU"},{name:"Ontario",code:"ON"},{name:"Prince Edward Island",code:"PE"},{name:"Quebec",code:"QC"},{name:"Saskatchewan",code:"SK"},{name:"Yukon Territory",code:"YT"}],a.requiredFieldsFilled=function(){console.log("province",a.customer.address.province);var b=a.customer.firstName&&a.customer.lastName&&a.customer.address.address1&&a.customer.address.city&&a.customer.address.province&&""!==a.customer.address.province&&a.customer.address.postalcode;return b?(a.customer.isComplete=!0,e.unRestrict("accountInfo")):(a.customer.isComplete=!1,e.restrict("accountInfo")),b},a.next=function(){a.requiredFieldsFilled()&&(a.nextIsLoading=!0,b.path("accountInfo"))},a.$watch("customer",function(){d.stash("customer",a.customer)}),a.showNotice=function(){d.stash("noticeValue",!0)},void(d.has("alreadyDone")&&a.showNotice())):void a.previous()}]),pirsApp.controller("AccountCtrl",["$scope","$location","$window","StateDataManager","NavCollection",function(a,b,c,d,e){return c.scrollTo(0,0),a.nextIsLoading=!1,a.previous=function(){b.path("/subscriberInfo")},a.servicesUnderOneAccount=d.has("servicesUnderOneAccount")?d.get("servicesUnderOneAccount"):!0,a.singleAccount=d.has("singleAccount")?d.get("singleAccount"):{},d.has("customer")&&d.get("company")&&d.has("services")&&"undefined"!=typeof _.findWhere(d.get("services"),{selected:"selected"})?(a.services=d.get("services"),a.selectedServices=0,angular.forEach(a.services,function(b){b.selected&&a.selectedServices++},a.selectedServices),1==a.selectedServices&&(a.oneService=!0),a.company=d.get("company"),angular.forEach(a.services,function(b,c){"undefined"==typeof b.account&&(b.account={}),b.getFirstEmail=function(){return a.services[0].account.email},b.getFirstPhone=function(){return a.services[0].account.phone},b.getFirstAccountNumber=function(){return a.services[0].account.number},b.setFirstEmail=function(){b.account.email=b.getFirstEmail()},b.setFirstPhone=function(){b.account.phone=b.getFirstPhone()},b.setFirstAccountNumber=function(){b.account.number=b.getFirstAccountNumber(),console.log(b.account.number)},a.services[c]=b},a.services),a.requiredFieldsFilled=function(){var b="pristine";return a.servicesUnderOneAccount?(console.log(a.singleAccount),a.singleAccount&&a.singleAccount.number?(e.unRestrict("letter"),!0):(e.restrict("letter"),!1)):(angular.forEach(a.services,function(a){!a.account.number&&a.selected?b=!1:"pristine"===b&&(b=!0)},b),b?e.unRestrict("letter"):e.restrict("letter"),b)},a.showService=function(a){return"selected"===a.selected},a.next=function(){a.requiredFieldsFilled()&&(a.nextIsLoading=!0,b.path("letter"))},a.$watch("services",function(){d.stash("services",a.services)}),a.$watch("servicesUnderOneAccount",function(){d.stash("servicesUnderOneAccount",a.servicesUnderOneAccount),d.stash("singleAccount",a.singleAccount)}),a.showNotice=function(){d.stash("noticeValue",!0)},a.hideNotice=function(){d.stash("noticeValue",!1)},void(d.has("alreadyDone")&&a.showNotice())):void a.previous()}]),pirsApp.controller("LetterCtrl",["$scope","$location","$timeout","$window","StateDataManager","PdfLetter","NavCollection",function(a,b,c,d,e,f,g){if(d.scrollTo(0,0),a.previous=function(){b.path("/accountInfo")},!e.has("piiTypes")||!e.has("customer")&&!e.get("customer").isComplete)return void a.previous();if(g.unRestrict("finish"),a.letter={isGenerating:!1,isGenerated:!1},a.customer=e.get("customer"),a.company=e.get("company"),a.services=e.get("services"),a.piiTypes=e.get("piiTypes"),a.servicesUnderOneAccount=e.get("servicesUnderOneAccount"),a.servicesUnderOneAccount&&(a.singleAccount=e.get("singleAccount")),a.date=moment().format("MMMM Do, YYYY"),a.showNotice=function(){e.stash("noticeValue",!0),c.cancel(h)},a.hideNotice=function(){e.stash("noticeValue",!1)},e.has("alreadyDone"))a.showNotice();else var h=c(function(){a.showNotice()},15e3);a.save=function(){f.generate($("#letter"),function(){c(function(){a.letter.isGenerating=!1,a.letter.isGenerated=!0,a.showNotice()},50)}),a.letter.isGenerating=!0,a.letter.isGenerated=!1},a.showService=function(a){return"selected"===a.selected},a.buildEmail=function(){var b,c,d,e,f;return b=a.company.contactActor.title?a.company.contactActor.title+"< "+a.company.email+" >":a.company.email,c="Formal Request for Personal Information Held By Your Company",f=$("#richLetter"),f.find(".piiItem").each(function(){var a;a=this.innerHTML,this.innerHTML="* "+a+"<br/>"}),d=getInnerText(f.get(0)).replace(/^\s+|\s+$/g,"").replace(/\n,'\r\n'/),f.find(".piiItem").each(function(){var a;a=this.innerHTML,this.innerHTML=a.substring(2),$(this).find("br").remove()}),e="mailto:"+encodeURIComponent(b)+"?subject="+encodeURIComponent(c)+"&body="+encodeURIComponent(d)},c(function(){a.email=a.buildEmail()},10)}]),pirsApp.controller("FinishCtrl",["$scope","$location","StateDataManager",function(a,b,c){return a.previous=function(){b.path("/letter")},c.has("piiTypes")&&(c.has("customer")||c.get("customer").isComplete)?(a.company=c.get("company"),c.stash("noticeValue",!1),c.stash("alreadyDone",!0),void(a.startOver=function(){c.pop("company"),c.pop("services"),c.pop("piiTypes"),c.pop("singleAccount"),c.pop("servicesUnderOneAccount"),c.pop("alreadyDone"),b.path("/companyInfo")})):void a.previous()}]);