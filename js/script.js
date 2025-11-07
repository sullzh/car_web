
function showMessage(carName) {
    // 在数组中查找匹配的车辆
    const selectedCar = cars.find(car => car.name === carName);
    if (selectedCar) {
        const message = `
            <h2>${selectedCar.emoji} 你选择了：${selectedCar.name}！</h2>
            <!-- 就是这行！它创建了一个img标签来显示图片 -->
            <img src="${selectedCar.image}" alt="${selectedCar.name}" style="max-width: 300px; border-radius: 10px; margin: 10px 0;">
            <p><strong>声音：</strong>${selectedCar.sound}</p>
            <p><strong>介绍：</strong>${selectedCar.description}</p>
        `;
        document.getElementById('message').innerHTML = message;
    }
}
// 函数：生成车辆卡片并插入到页面中
function renderCarGallery() {
    const galleryContainer = document.getElementById('carGallery');
    
    // 如果这个容器存在（说明我们在百科页面），才执行
    if (galleryContainer) {
        let htmlContent = '';
        
        // 遍历每辆车，生成对应的HTML卡片
        cars.forEach(car => {
            htmlContent += `
                <div style="border: 2px solid #4ecdc4; border-radius: 15px; padding: 15px; text-align: center; background-color: white;">
                    <h3>${car.emoji} ${car.name}</h3>
                    <img src="${car.image}" alt="${car.name}" style="max-width: 100%; border-radius: 10px; margin: 10px 0;">
                    <p><strong>声音：</strong>${car.sound}</p>
                    <p>${car.description}</p>
                </div>
            `;
        });
        
        // 将生成的所有卡片HTML一次性插入到容器中
        galleryContainer.innerHTML = htmlContent;
    }
}

// 当页面加载完成后，自动渲染车辆百科
document.addEventListener('DOMContentLoaded', function() {
    renderCarGallery();
});

// 游戏相关变量
let currentGameData = null;
let playerScore = 0;

// 函数：开始新游戏
function startGame() {
    // 重置并隐藏一些元素
    document.getElementById('message').innerHTML = '';
    document.getElementById('carPartImage').style.display = 'none';
    
    // 随机选择一辆车和它的一个局部图
    const randomCar = cars[Math.floor(Math.random() * cars.length)];
    const randomPart = randomCar.parts[Math.floor(Math.random() * randomCar.parts.length)];
    
    currentGameData = {
        car: randomCar,
        partImage: randomPart
    };

    // 显示局部图片
    const carPartImage = document.getElementById('carPartImage');
    carPartImage.src = currentGameData.partImage;
    carPartImage.style.display = 'block';

    // 生成答案选项按钮
    generateAnswerButtons();

    // 显示答案选择区域
    document.getElementById('answerButtons').style.display = 'block';
    document.getElementById('buttonArea').innerHTML = '<button onclick="startGame()" style="font-size: 1.2em; padding: 10px 20px;">下一题</button>';
}

// 函数：生成答案选项按钮
function generateAnswerButtons() {
    const buttonContainer = document.getElementById('answerButtons');
    
    // 清空之前的按钮
    buttonContainer.innerHTML = '<p>这是什么呢？</p>';
    
    // 创建正确答案按钮
    const correctButton = document.createElement('button');
    correctButton.textContent = currentGameData.car.name;
    correctButton.onclick = () => checkAnswer(currentGameData.car.name);
    correctButton.style.margin = '5px';
    correctButton.style.padding = '10px 15px';
    buttonContainer.appendChild(correctButton);

    // 创建错误答案选项（从其他车辆中随机选择）
    const otherCars = cars.filter(car => car.name !== currentGameData.car.name);
    const wrongAnswers = [];
    
    while (wrongAnswers.length < 2 && otherCars.length > 0) {
        const randomIndex = Math.floor(Math.random() * otherCars.length);
        wrongAnswers.push(otherCars[randomIndex].name);
        otherCars.splice(randomIndex, 1); // 避免重复
    }

    // 创建错误答案按钮
    wrongAnswers.forEach(answer => {
        const button = document.createElement('button');
        button.textContent = answer;
        button.onclick = () => checkAnswer(answer);
        button.style.margin = '5px';
        button.style.padding = '10px 15px';
        buttonContainer.appendChild(button);
    });

    // 随机打乱按钮顺序
    for (let i = buttonContainer.children.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        buttonContainer.appendChild(buttonContainer.children[j]);
    }
}

// 函数：检查答案
function checkAnswer(selectedAnswer) {
    const messageDiv = document.getElementById('message');
    const scoreValueSpan = document.getElementById('scoreValue');
    
    if (selectedAnswer === currentGameData.car.name) {
        // 答对了
        playerScore++;
        scoreValueSpan.textContent = playerScore;
        messageDiv.innerHTML = `<span style="color: green;">✅ 太棒了！答对了！这就是${currentGameData.car.emoji} ${currentGameData.car.name}！</span>`;
    } else {
        // 答错了
        messageDiv.innerHTML = `<span style="color: red;">❌ 再想想哦~ 这是${currentGameData.car.emoji} ${currentGameData.car.name}呢！</span>`;
    }
    
    // 显示完整车辆图片作为反馈
    setTimeout(() => {
        messageDiv.innerHTML += `<br><img src="${currentGameData.car.image}" alt="${currentGameData.car.name}" style="max-width: 200px; margin-top: 10px; border-radius: 10px;">`;
    }, 1000);
}