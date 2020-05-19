var donutPie = {};

(function (self) {
    self.init = function () {

        
    }

})(donutPie);


window.addEventListener("load", function () {
    setTimeout(function () {
        donutPie.init();
    }, 200);
 
 });
 
 window.addEventListener("resize", function () {
    donutPie.init();
 });