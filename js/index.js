$(function () {
    var scene = $('.scene');
    var shebiao = {};
    var direction = 'you';
    $('.end').hide();

    /*。。。。。。。背景加载。。。。。。。。。。。。*/
    var snake = [{x: 0, y: 0}, {x: 0, y: 1}, {x: 0, y: 2}];           //蛇身为 00 01 02

    function render(){                                     //渲染
        for (var i = 0; i < 16; i++) {
            for (var j = 0; j < 20; j++) {
                $('<div>').attr('id', i + '_' + j).addClass('block').appendTo(scene)
            }
        }
        /*。。。。。。。。。。将蛇放到界面。。。。。。。。*/
        $.each(snake, function (i, v) {
            findDiv(v.x, v.y).addClass('snake')
        })
    };

    render();                                                        //渲染
    /*。。。。。。。。。。寻找坐标。。。。。。。。。。。。。*/
    function findDiv(x, y) {
        return $('#' + x + '_' + y)
    }

    /*。。。。。。。。。。放食物。。。。。。。。。。。。*/

    function fangshiwu() {                                    //随机放食物，避过蛇身。
        do {
            var x = Math.floor(Math.random() * 15);
            var y = Math.floor(Math.random() * 19)
        } while (shebiao[x + '_' + y]);
        {
            findDiv(x, y).addClass('food');
            return {x: x, y: y}
        }
    }

    var shiwu = fangshiwu();
    // var t=setInterval(move,200);
    /*。。。。。。。。暂停。。。。。。。。。。。*/
    var tf = true;                          //开关
    $('.pause').on('click', function () {
        if (tf) {
            tf = false;
            t = setInterval(move, 200);
            $(this).text('暂停')
        } else {
            tf = true;
            clearInterval(t);
            $(this).text('开始')
        }

    });

    /*。。。。。。。。判断按键。。。。。。。。。。。。*/
    $(document).on('keyup', function (e) {
        var fanbiao = {'zuo': 37, 'you': 39, 'shang': 38, 'xia': 40};
        var biao = {37: 'zuo', 39: 'you', 38: 'shang', 40: 'xia'};
        if (Math.abs(e.keyCode - fanbiao[direction]) == 2) {
            return;
        } else {
            direction = biao[e.keyCode]
        }
    })
    /*。。。。。。。。。蛇运动。。。。。。。。。。*/
    function move() {
        var jiutou = snake[snake.length - 1];
        if (direction == 'you') {
            var xintou = {x: jiutou.x, y: jiutou.y + 1};
            // findDiv(xintou.x + 1, xintou.y).animate({top: 10}).delay(30).animate({top: 0});
            // findDiv(xintou.x - 1, xintou.y).animate({top: -10}).delay(30).animate({top: 0});
            // findDiv(xintou.x, xintou.y + 2).animate({left: 20}).delay(30).animate({left: 0})
        }
        if (direction == 'zuo') {
            var xintou = {x: jiutou.x, y: jiutou.y - 1};
            // findDiv(xintou.x + 1, xintou.y).animate({top: 10}).delay(30).animate({top: 0});
            // findDiv(xintou.x - 1, xintou.y).animate({top: -10}).delay(30).animate({top: 0});
            // findDiv(xintou.x, xintou.y - 2).animate({left: -20}).delay(30).animate({left: 0})
        }
        if (direction == 'shang') {
            var xintou = {x: jiutou.x - 1, y: jiutou.y};
            // findDiv(xintou.x, xintou.y + 1).animate({left: 10}).delay(40).animate({left: 0});
            // findDiv(xintou.x, xintou.y - 1).animate({left: -10}).delay(40).animate({left: 0});
            // findDiv(xintou.x - 2, xintou.y).animate({top: 10}).delay(40).animate({top: 0})
        }
        if (direction == 'xia') {
            var xintou = {x: jiutou.x + 1, y: jiutou.y};
            // findDiv(xintou.x, xintou.y + 1).animate({left: 10}).delay(40).animate({left: 0});
            // findDiv(xintou.x, xintou.y - 1).animate({left: -10}).delay(40).animate({left: 0});
            // findDiv(xintou.x + 2, xintou.y).animate({top: -10}).delay(40).animate({top: 0})
        }
        if (shebiao[xintou.x + '_' + xintou.y]) {
            clearInterval(t);
            $('.scene').hide();
            $('.end').show().text('竟然被自己撞死了！');
            return;
        }
        if (xintou.x < 0 || xintou.x > 15 || xintou.y < 0 || xintou.y > 19) {
            //如果x小0，大15，Y小0，大19，撞墙，停止运动，隐藏蛇身，出现皮卡丘，出现字
            clearInterval(t);
            $('.scene').hide();
            $('.end').show().text('咋就撞死啦');
            return
        }
        shebiao[xintou.x + '_' + xintou.y] = true;
        snake.push(xintou);
        $(snake).each(function (i, v) {
            findDiv(v.x + 1, v.y).addClass("active")
        })
        findDiv(xintou.x, xintou.y).addClass('snake');
        if (xintou.x === shiwu.x && xintou.y === shiwu.y) {
            findDiv(shiwu.x, shiwu.y).removeClass('food');
            shiwu = fangshiwu()
        } else {
            var weiba = snake.shift();
            delete shebiao[weiba.x + '_' + weiba.y];
            findDiv(weiba.x, weiba.y).removeClass('snake')
        }
        console.log(shebiao)
    }

    $(window).on("mousedown", false);
    $('.restart').on('click', function () {
        scene.empty();
        snake = [{x: 0, y: 0}, {x: 0, y: 1}, {x: 0, y: 2}];
        render();
        shiwu = fangshiwu();
        tf = true;
        shebiao = {};
        clearInterval(t);
        $('.pause').text('开始');
        if ($('.end').show()) {
            $('.end').hide();
            $('.scene').show()
        }

        // direction='you';
        // t=setInterval(move,200);
        // $(document).keyup()

    });
    /*。。。。。。。。开始。。。。。。。。。。*/

});