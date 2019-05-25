// Game
(function() {
    let scoreList = [];

    let userList = JSON.parse(localStorage.getItem("snakeLocal")) || [{ // 假数据
        name: "蓝海",
        score: 14
    }, {
        name: "兰海",
        score: 2
    }, {
        name: "蓝海",
        score: 1
    }];
    let userEl = [];

    function Game(map, user, open) {
        this.open = open; // 重开
        this.user = user || "游客";
        this.map = map;
        this.color = new Color();
        this.food = new Food(this.color);
        this.snake = new Snake();

        // 游戏分数
        this.scoreUser = this.snake.body.length - 3;

        // 保存this 
        that = this;

        this.score();
    }

    // 用户分数
    Game.prototype.score = function() {

        removeScore();

        // 排行榜
        this.ulScore = document.createElement("ul");
        this.map.appendChild(this.ulScore);
        this.ulScore.classList.add = "clearfix";
        this.ulScore.style.margin = "50px 40px";
        this.ulScore.style.position = "fixed"


        // for (let i = 0; i < userList.length; i++) {
        //     this.liScore = document.createElement("li");
        //     this.liScore.innerHTML = `${userList[i].name} ------ ${userList[i].score}`;
        //     this.ulScore.appendChild(this.liScore);
        //     this.liScore.style.fontSize = "30px";
        //     this.liScore.style.fontWeight = 400;
        //     userEl.push(this.liScore)
        // }


        this.span = document.createElement("span")
        this.span.innerHTML = `${this.user},您的分数为:${this.scoreUser}`;
        this.span.style.position = "fixed";
        this.span.style.left = this.span.style.top = "10px";
        this.span.style.fontSize = "30px";
        this.span.style.fontWeight = 400;
        this.map.appendChild(this.span);

        scoreList.push(this.span);


    }

    // 分数去重
    function removeScore() {
        for (let i = 0; i < scoreList.length; i++) {
            scoreList[i].parentNode.removeChild(scoreList[i]);
            scoreList.splice(i, 1);
        }
    }

    function removeUserEl() {
        for (let i = userEl.length - 1; i >= 0; i--) {
            userEl[i].parentNode.removeChild(userEl[i]);
            userEl.splice(i, 1);
        }
    }

    // 开始游戏
    Game.prototype.start = function() {
        this.food.init(this.map);
        this.snake.init(this.map);

        var timeId = setInterval(() => {
            this.snake.move(this.food, this.map);

            let maxX = this.map.offsetWidth / this.snake.width;
            let maxY = this.map.offsetHeight / this.snake.height;

            // 游戏分数
            this.scoreUser = this.snake.body.length - 3;
            this.span.innerHTML = `${this.user},您的分数为:${this.scoreUser}`;

            this.userStorage();

            removeUserEl();


            for (let i = 0; i < userList.length; i++) {
                this.liScore = document.createElement("li");
                this.liScore.innerHTML = `${userList[i].name} ------ ${userList[i].score}`;
                this.ulScore.appendChild(this.liScore);
                this.liScore.style.fontSize = "30px";
                this.liScore.style.fontWeight = 400;
                userEl.push(this.liScore);
            }


            // 存储用户分数进行排名
            this.userStorage()

            // 蛇头
            let snakeT = this.snake.body[0];

            // 撞身体
            for (let i = 1; i < this.snake.body.length - 1; i++) {
                if (snakeT.x == this.snake.body[i].x && snakeT.y == this.snake.body[i].y) {
                    clearInterval(timeId);
                    this.open.style.display = "block";
                    return
                }
            }
            // 撞墙
            if (snakeT.x < 0 || snakeT.x >= maxX || snakeT.y < 0 || snakeT.y >= maxY) {
                clearInterval(timeId);
                this.open.style.display = "block";
                return // 不继续初始化 (小蛇头部出map问题)
            }

            this.snake.init(this.map);
        }, 150);


        // 键盘按下事件
        window.onkeydown = function(e) {
            e = e || window.event;

            let keyCode = e.keyCode;
            // 37左 38上 39右 40下
            switch (keyCode) {
                case 37:
                    e.preventDefault(); // 禁止键盘上下方向键滚动浏览器窗口
                    if (that.snake.direction != "right") {
                        that.snake.direction = "left"
                    }
                    break;
                case 38:
                    e.preventDefault();
                    if (that.snake.direction != "bottom") {
                        that.snake.direction = "top"
                    }
                    break;
                case 39:
                    e.preventDefault();
                    if (that.snake.direction != "left") {
                        that.snake.direction = "right"
                    }
                    break;
                case 40:
                    e.preventDefault();
                    if (that.snake.direction != "top") {
                        that.snake.direction = "bottom"
                    }
                    break;
            }
        }

    }

    Game.prototype.userStorage = function() {

        let maxScore = {
            name: this.user,
            score: this.scoreUser
        };


        let tsuserList = [{ // 假数据
            name: "蓝海",
            score: 14
        }, {
            name: "兰海",
            score: 2
        }, {
            name: "蓝海",
            score: 1
        }];

        // 本地数据存储
        // localStorage.setItem("snakeLocal", JSON.stringify(tsuserList));

        userList = JSON.parse(localStorage.getItem("snakeLocal")) || tsuserList;

        // userList = JSON.parse(localStorage.getItem("snakeLocal"))


        for (let i = 0; i < userList.length; i++) {

            if (userList[i].score < maxScore.score) {
                let temp = userList[i];
                userList[i] = maxScore;
                maxScore = temp;
            }

        };
        // 本地数据存储
        localStorage.setItem("snakeLocal", JSON.stringify(tsuserList));

    }

    window.Game = Game;
}());