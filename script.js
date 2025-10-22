// --- 1. 기본 요소 가져오기 ---
const entryScene = document.getElementById('entry');
const livingRoomScene = document.getElementById('living-room');
const door = document.getElementById('door');
const objects = document.querySelectorAll('.object');
const focusScenes = document.querySelectorAll('.focus-scene');
const backButtons = document.querySelectorAll('.back-btn');

// (촛불 씬을 위한 요소)
const breathText = document.querySelector('.breath-text');
let breathTimer = null; // 촛불 씬의 타이머를 저장할 변수

// --- 2. 씬 전환 함수 ---
function changeScene(hideScene, showScene) {
    hideScene.classList.remove('active');
    showScene.classList.add('active');
}

// --- 3. [신규] 비(Rain) 생성 함수 (jQuery 없이 수정) ---
var makeItRain = function() {
    // 기존 빗방울 삭제
    document.querySelectorAll('.rain').forEach(el => el.innerHTML = '');
  
    var increment = 0;
    var drops = "";
    var backDrops = "";
  
    while (increment < 100) {
        var randoHundo = (Math.floor(Math.random() * (98 - 1 + 1) + 1));
        var randoFiver = (Math.floor(Math.random() * (5 - 2 + 1) + 2));
        increment += randoFiver;
        
        // 빗방울 HTML 생성
        var dropHTML = 
            '<div class="drop" style="left: ' + increment + '%; bottom: ' + (randoFiver + randoFiver - 1 + 100) + '%; animation-delay: 0.' + randoHundo + 's; animation-duration: 0.5' + randoHundo + 's;">' +
                '<div class="stem" style="animation-delay: 0.' + randoHundo + 's; animation-duration: 0.5' + randoHundo + 's;"></div>' +
                '<div class="splat" style="animation-delay: 0.' + randoHundo + 's; animation-duration: 0.5' + randoHundo + 's;"></div>' +
            '</div>';
        
        drops += dropHTML;

        // 뒷줄 빗방울 HTML 생성 (right 속성 사용)
        var backDropHTML = 
            '<div class="drop" style="right: ' + increment + '%; bottom: ' + (randoFiver + randoFiver - 1 + 100) + '%; animation-delay: 0.' + randoHundo + 's; animation-duration: 0.5' + randoHundo + 's;">' +
                '<div class="stem" style="animation-delay: 0.' + randoHundo + 's; animation-duration: 0.5' + randoHundo + 's;"></div>' +
                '<div class="splat" style="animation-delay: 0.' + randoHundo + 's; animation-duration: 0.5' + randoHundo + 's;"></div>' +
            '</div>';

        backDrops += backDropHTML;
    }
  
    // 빗방울을 HTML에 삽입
    const frontRow = document.querySelector('.rain.front-row');
    if (frontRow) frontRow.innerHTML = drops;
    
    const backRow = document.querySelector('.rain.back-row');
    if (backRow) backRow.innerHTML = backDrops;
}


// --- 4. 이벤트 리스너 설정 ---

// 1. 진입 -> 머무름 (문 열림 애니메이션 추가)
door.addEventListener('click', () => {
    door.classList.add('open'); // 문 열림 클래스 추가

    // 애니메이션이 끝난 후 씬 전환 (1초 + 약간의 여유)
    setTimeout(() => {
        changeScene(entryScene, livingRoomScene);
        door.classList.remove('open'); // 다음 진입을 위해 클래스 제거
        door.style.transform = 'rotateY(0deg)'; // 씬 전환 후 문을 다시 닫힌 상태로 재설정
    }, 1200); // CSS transition 시간보다 약간 길게 설정
});

// 2. 머무름 -> 3. 집중
objects.forEach(object => {
    object.addEventListener('click', () => {
        const objectId = object.id;
        const targetScene = document.getElementById('focus-' + objectId);
        
        if (targetScene) {
            changeScene(livingRoomScene, targetScene);

            // [★ 핵심] 씬에 따라 다른 기능 실행
            if (objectId === 'window') {
                // 창문 씬이면 비를 뿌림
                makeItRain();
            } 
            else if (objectId === 'candle') {
                // 촛불 씬이면 호흡 텍스트 애니메이션 시작
                if (breathText) breathText.textContent = '들이마시고...';
                
                // 4초마다 텍스트 변경 (CSS 애니메이션 8초 주기의 절반)
                breathTimer = setInterval(() => {
                    if (breathText) {
                        breathText.textContent = (breathText.textContent === '들이마시고...') ? '내쉬고...' : '들이마시고...';
                    }
                }, 4000);
            }
        }
    });
});

// 3. 집중 -> 2. 머무름 (돌아가기)
backButtons.forEach(button => {
    button.addEventListener('click', () => {
        const currentFocusScene = button.closest('.focus-scene');
        if (currentFocusScene) {
            changeScene(currentFocusScene, livingRoomScene);

            // [★ 핵심] 촛불 씬의 타이머가 실행 중이면 정지
            if (breathTimer) {
                clearInterval(breathTimer);
                breathTimer = null;
            }
        }
    });
});