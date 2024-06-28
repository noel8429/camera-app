const camera = document.getElementById('camera');
const canvas = document.getElementById('canvas');
const output = document.getElementById('output');
const captureButton = document.getElementById('capture');
const saveButton = document.getElementById('save');
const retakeButton = document.getElementById('retake');
const userNameInput = document.getElementById('userName');

let templateImage = new Image();

function initApp() {
    templateImage.onload = function() {
        console.log('템플릿 이미지 로드 완료');
        captureButton.disabled = false;
        startCamera();
    };
    templateImage.onerror = function() {
        console.error('템플릿 이미지 로드 실패');
        alert('템플릿 이미지를 불러오는데 실패했습니다. 페이지를 새로고침 해주세요.');
    };
    templateImage.src = 'images/template.jpg';
    
    captureButton.disabled = true; // 이미지 로딩 전에는 버튼 비활성화
}

async function startCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
        camera.srcObject = stream;
    } catch (err) {
        console.error("카메라 접근 에러:", err);
        alert("카메라에 접근할 수 없습니다. 카메라 권한을 확인해주세요.");
    }
}

captureButton.addEventListener('click', function() {
    canvas.width = templateImage.width;
    canvas.height = templateImage.height;
    const ctx = canvas.getContext('2d');
    
    // 템플릿 이미지 그리기
    ctx.drawImage(templateImage, 0, 0);
    
    // 사용자 사진 합성
    const aspectRatio = camera.videoWidth / camera.videoHeight;
    let drawWidth = canvas.width * 0.5;
    let drawHeight = drawWidth / aspectRatio;
    let drawX = canvas.width * 0.25;
    let drawY = canvas.height * 0.25;
    ctx.drawImage(camera, drawX, drawY, drawWidth, drawHeight);

    output.src = canvas.toDataURL('image/jpeg');
    camera.classList.add('hidden');
    canvas.classList.add('hidden');
    output.classList.remove('hidden');
    captureButton.classList.add('hidden');
    saveButton.classList.remove('hidden');
    retakeButton.classList.remove('hidden');
    userNameInput.classList.remove('hidden');
});

saveButton.addEventListener('click', function() {
    const ctx = canvas.getContext('2d');
    ctx.font = '20px Arial';
    ctx.fillStyle = 'black';
    ctx.fillText(`이름: ${userNameInput.value}`, 50, canvas.height - 50);
    
    const link = document.createElement('a');
    link.download = '환경_실천_약속.jpg';
    link.href = canvas.toDataURL('image/jpeg');
    link.click();
});

retakeButton.addEventListener('click', function() {
    camera.classList.remove('hidden');
    output.classList.add('hidden');
    captureButton.classList.remove('hidden');
    saveButton.classList.add('hidden');
    retakeButton.classList.add('hidden');
    userNameInput.classList.add('hidden');
});

// 앱 초기화 함수 호출
initApp();
