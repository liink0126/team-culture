<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>팀 진단 설문</title>
    <!-- CDN Links for required libraries -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        
        /* ********** GitHub Pages 충돌 방지 및 전체 화면 설정 CSS ********** */
        
        /* 1. GitHub Pages의 Header, Footer 및 기타 불필요한 테마 요소를 강제로 숨깁니다. */
        /* .site-header, .site-footer 등 테마가 삽입하는 요소를 숨깁니다. */
        .site-header, .site-footer, .view-on-github { display: none !important; }
        
        /* 2. body와 html이 화면 전체를 덮도록 설정하고, 기본 마진을 제거합니다. */
        html, body {
            margin: 0;
            padding: 0;
            width: 100%;
            height: 100%;
            /* 폰트 설정은 body에서 전역으로 적용 */
            font-family: 'Inter', sans-serif;
            background-color: var(--background-color);
            color: var(--text-color);
        }

        /* 3. 본문 컨테이너를 화면 중앙에 배치하고 전체를 덮도록 설정합니다. */
        body {
            /* GitHub Pages Header가 삽입되더라도 본문이 영향을 덜 받도록 flex-start 대신 center 사용 */
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            padding: 2rem 1rem;
            box-sizing: border-box; /* 패딩이 전체 너비에 포함되도록 설정 */
        }
        
        /* Custom Colors and Base Styles */
        :root {
            --primary-color: #d83968;
            --secondary-color: #3b82f6;
            --background-color: #f8f9fa;
            --surface-color: #ffffff;
            --text-color: #212529;
            --light-gray: #e9ecef;
            --medium-gray: #dee2e6;
            --dark-gray: #495057;
        }

        /* Container and Layout */
        .container {
            background-color: var(--surface-color);
            border-radius: 1.5rem;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
            padding: 2.5rem;
            max-width: 900px;
            width: 100%;
            /* 추가: GitHub Header를 위한 상단 여백 확보 (혹시 모를 충돌 대비) */
            margin-top: 0; 
            margin-bottom: 0; 
        }

        /* Header */
        .header {
            text-align: center;
            margin-bottom: 2rem;
        }
        .title {
            font-size: 3rem;
            font-weight: 800;
            color: var(--primary-color);
            line-height: 1;
        }
        .subtitle {
            font-size: 1.25rem;
            color: #6c757d;
            margin-top: 0.5rem;
        }

        /* Input Section */
        .input-section {
            display: flex;
            flex-direction: column;
            gap: 2rem;
        }
        
        .question-group {
            margin-bottom: 2rem;
            padding-bottom: 1rem;
            border-bottom: 1px solid var(--light-gray);
        }
        .question-group:last-of-type {
            border-bottom: none;
        }

        .question-label {
            font-weight: 600;
            margin-bottom: 1rem;
            font-size: 1.1rem;
            color: var(--dark-gray);
            display: block;
        }

        /* Likert Scale */
        .likert-scale {
            display: flex;
            gap: 0.75rem;
            position: relative;
        }
        .likert-button {
            flex: 1;
            padding: 1rem 0;
            border-radius: 0.75rem;
            border: 2px solid var(--light-gray);
            background-color: var(--surface-color);
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s ease-in-out;
            color: var(--dark-gray);
            font-size: 1rem;
            text-align: center;
        }
        .likert-button:hover {
            background-color: var(--light-gray);
            transform: translateY(-1px);
        }
        .likert-button.selected {
            background-color: var(--primary-color);
            border-color: var(--primary-color);
            color: #ffffff;
            transform: scale(1.05);
            box-shadow: 0 4px 15px rgba(216, 57, 104, 0.3);
        }

        /* Button */
        .show-chart-button {
            background-color: var(--primary-color);
            color: white;
            padding: 1.25rem 2.5rem;
            border-radius: 0.75rem;
            font-size: 1.125rem;
            font-weight: 700;
            border: none;
            cursor: pointer;
            transition: background-color 0.2s, transform 0.2s, box-shadow 0.2s;
            box-shadow: 0 4px 15px rgba(216, 57, 104, 0.3);
            margin-top: 2rem;
            align-self: center;
            min-width: 200px;
        }
        .show-chart-button:hover {
            background-color: #c42b58;
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(216, 57, 104, 0.4);
        }
        .show-chart-button:disabled {
            background-color: #adb5bd;
            cursor: not-allowed;
            box-shadow: none;
            transform: none;
        }

        /* Modal Styles */
        .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.7);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.3s ease-in-out, visibility 0.3s ease-in-out;
        }
        .modal-overlay.visible {
            opacity: 1;
            visibility: visible;
        }
        .modal-content {
            background-color: var(--surface-color);
            padding: 2.5rem;
            border-radius: 1.5rem;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
            position: relative;
            max-width: 650px; /* 차트 확대를 위해 Max-width 증가 */
            width: 90%;
            transform: scale(0.95);
            transition: transform 0.3s ease-in-out;
        }
        .modal-overlay.visible .modal-content {
            transform: scale(1);
        }
        .modal-close-button {
            position: absolute;
            top: 1rem;
            right: 1.5rem;
            background: none;
            border: none;
            font-size: 2rem;
            line-height: 1;
            color: var(--dark-gray);
            cursor: pointer;
            transition: color 0.2s;
        }
        .modal-close-button:hover {
            color: var(--primary-color);
        }

        .likert-guide-container {
            display: flex;
            justify-content: space-between;
            font-size: 0.8rem;
            color: #868e96;
            margin-top: 0.5rem;
        }
        .likert-guide {
            text-align: center;
            flex: 1;
            padding: 0 0.2rem; /* 가이드 텍스트 간격 조절 */
        }
        
        .chart-container {
            width: 100%;
            max-width: 450px; /* 차트의 최대 크기 설정 */
            height: 450px;
            margin: 2rem auto; /* 중앙 정렬 */
        }

        .chart-details {
            margin-top: 2rem;
            padding-top: 1.5rem;
            border-top: 1px solid var(--light-gray);
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 1.5rem;
        }

        .detail-item {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            font-size: 1rem;
            font-weight: 600;
        }
        .detail-color-box {
            width: 1rem;
            height: 1rem;
            border-radius: 0.25rem;
            background-color: var(--primary-color);
        }

        .hidden {
            display: none !important;
        }
        
    </style>
</head>
<body>
    <div class="container">
        <!-- Start Screen -->
        <div id="startScreen" class="input-section">
            <div class="header">
                <h1 class="title">팀 진단 설문</h1>
                <p class="subtitle">설문 시작 전, 정보를 입력해 주세요.</p>
            </div>
            <div class="space-y-4">
                <div>
                    <label for="company-size" class="block text-lg font-medium text-gray-700 mb-2">기업 규모</label>
                    <select id="company-size" class="w-full p-3 rounded-md border border-gray-300 focus:border-red-500 focus:ring focus:ring-red-200 focus:ring-opacity-50 transition ease-in-out">
                        <option value="">선택하세요</option>
                        <option value="대기업">대기업</option>
                        <option value="중견기업">중견기업</option>
                        <option value="중소기업">중소기업</option>
                        <option value="스타트업">스타트업</option>
                        <option value="1인 기업">1인 기업</option>
                    </select>
                </div>
                <div>
                    <label for="industry-type" class="block text-lg font-medium text-gray-700 mb-2">산업 분류</label>
                    <select id="industry-type" class="w-full p-3 rounded-md border border-gray-300 focus:border-red-500 focus:ring focus:ring-red-200 focus:ring-opacity-50 transition ease-in-out">
                        <option value="">선택하세요</option>
                        <option value="농업, 임업 및 어업">농업, 임업 및 어업</option>
                        <option value="광업">광업</option>
                        <option value="제조업">제조업</option>
                        <option value="전기, 가스, 증기 및 공기 조절 공급업">전기, 가스, 증기 및 공기 조절 공급업</option>
                        <option value="건설업">건설업</option>
                        <option value="도매 및 소매업">도매 및 소매업</option>
                        <option value="운수 및 창고업">운수 및 창고업</option>
                        <option value="숙박 및 음식점업">숙박 및 음식점업</option>
                        <option value="정보통신업">정보통신업</option>
                        <option value="금융 및 보험업">금융 및 보험업</option>
                        <option value="부동산업">부동산업</option>
                        <option value="전문, 과학 및 기술 서비스업">전문, 과학 및 기술 서비스업</option>
                        <option value="사업시설 관리, 사업 지원 및 임대 서비스업">사업시설 관리, 사업 지원 및 임대 서비스업</option>
                        <option value="공공 행정, 국방 및 사회보장 행정">공공 행정, 국방 및 사회보장 행정</option>
                        <option value="교육 서비스업">교육 서비스업</option>
                        <option value="보건업 및 사회복지 서비스업">보건업 및 사회복지 서비스업</option>
                        <option value="예술, 스포츠 및 여가관련 서비스업">예술, 스포츠 및 여가관련 서비스업</option>
                        <option value="협회 및 단체, 수리 및 기타 개인 서비스업">협회 및 단체, 수리 및 기타 개인 서비스업</option>
                    </select>
                </div>
            </div>
            <button id="startSurveyButton" class="show-chart-button">설문 시작하기</button>
        </div>

        <!-- Survey Section -->
        <div id="surveySection" class="input-section hidden">
            <div class="header">
                <h1 class="title">팀 진단 설문</h1>
                <p class="subtitle">우리 팀의 역량을 확인하세요 (1점:매우 그렇지 않다 ~ 5점:매우 그렇다)</p>
            </div>
            <div id="input-fields" class="space-y-6">
                <!-- Input fields for each question will be generated by JavaScript -->
            </div>
            <button id="showChartButton" class="show-chart-button" disabled>모든 질문에 응답해 주세요</button>
        </div>

        <!-- Email and Marketing Consent Popup -->
        <div id="emailConsentOverlay" class="modal-overlay hidden">
            <div id="emailConsentContent" class="modal-content">
                <div class="header">
                    <h3 class="font-bold text-3xl text-gray-800" style="color: var(--primary-color);">결과 수신 및 동의</h3>
                    <p class="text-base text-gray-500 mt-2">이메일로 결과를 받아보시고, 팀 역량 강화 관련 최신 정보를 수신하시겠습니까?</p>
                </div>
                <div class="space-y-4 pt-4">
                    <div>
                        <label for="marketingEmailInput" class="block text-sm font-medium text-gray-700 mb-1">이메일 주소</label>
                        <input type="email" id="marketingEmailInput" placeholder="example@email.com" class="w-full p-3 rounded-md border border-gray-300 focus:border-red-500 focus:ring focus:ring-red-200 focus:ring-opacity-50 transition ease-in-out">
                    </div>
                    <div class="flex items-center space-x-2">
                        <input type="checkbox" id="marketingConsentCheckbox" class="form-checkbox h-5 w-5 text-red-600 rounded-md transition duration-150 ease-in-out">
                        <label for="marketingConsentCheckbox" class="text-sm text-gray-600">
                            <a href="#" class="text-red-500 font-bold" onclick="return false;">개인정보 수집 및 이용</a>에 동의합니다 (마케팅 정보 수신 포함)
                        </label>
                    </div>
                </div>
                <button id="sendMarketingEmailButton" class="show-chart-button text-sm w-full mt-6" disabled>동의하고 결과 받기</button>
                <div id="marketingEmailMessage" class="mt-2 text-center text-green-600 hidden"></div>
            </div>
        </div>

        <!-- Final Result Popup -->
        <div id="resultOverlay" class="modal-overlay hidden">
            <div id="resultContent" class="modal-content">
                <button id="resultCloseButton" class="modal-close-button">&times;</button>
                <div class="header">
                    <h2 class="title text-3xl">팀 진단 결과</h2>
                    <p class="subtitle mt-2">우리 팀의 역량을 한눈에 확인하세요</p>
                </div>
                <!-- Chart Container: 가운데 정렬 및 크기 확보 -->
                <div class="chart-container">
                    <canvas id="radarChart"></canvas>
                </div>
                <div class="chart-details">
                    <div class="detail-item">
                        <div id="Commitment-box" class="detail-color-box"></div>
                        <span class="font-bold">Commitment:</span>
                        <span id="Commitment-score" class="font-medium text-gray-700"></span>
                    </div>
                    <div class="detail-item">
                        <div id="Communication-box" class="detail-color-box"></div>
                        <span class="font-bold">Communication:</span>
                        <span id="Communication-score" class="font-medium text-gray-700"></span>
                    </div>
                    <div class="detail-item">
                        <div id="Collaboration-box" class="detail-color-box"></div>
                        <span class="font-bold">Collaboration:</span>
                        <span id="Collaboration-score" class="font-medium text-gray-700"></span>
                    </div>
                    <div class="detail-item">
                        <div id="Process-box" class="detail-color-box"></div>
                        <span class="font-bold">Process:</span>
                        <span id="Process-score" class="font-medium text-gray-700"></span>
                    </div>
                    <div class="detail-item">
                        <div id="Trust-box" class="detail-color-box"></div>
                        <span class="font-bold">Trust:</span>
                        <span id="Trust-score" class="font-medium text-gray-700"></span>
                    </div>
                    <div class="detail-item">
                        <div id="Growth-box" class="detail-color-box"></div>
                        <span class="font-bold">Growth:</span>
                        <span id="Growth-score" class="font-medium text-gray-700"></span>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Firebase SDKs and Logic -->
    <script type="module">
        import { initializeApp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";
        import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";
        import { getFirestore, addDoc, collection, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";

        // Firebase Configuration (MUST BE UPDATED BY THE USER FOR PRODUCTION)
        const appId = "1:413174244491:web:1948fc8726a6c453bd608e";
        const firebaseConfig = {
          apiKey: "AIzaSyCdNq4N7hU4C6BG1Yqs8yGv_6e5cBj7gDA",
          authDomain: "team-diagnostics-email-l-ac752.firebaseapp.com",
          projectId: "team-diagnostics-email-l-ac752",
          storageBucket: "team-diagnostics-email-l-ac752.firebasestorage.app",
          messagingSenderId: "413174244491",
          appId: "1:413174244491:web:1948fc8726a6c453bd608e"
        };
        const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

        let db;
        let auth;
        let finalResults = {};
        let myRadarChart = null;

        // Initialize Firebase and set up a listener for authentication state changes
        const setupFirebase = async () => {
            try {
                const app = initializeApp(firebaseConfig);
                db = getFirestore(app);
                auth = getAuth(app);
                // firebase.firestore.setLogLevel('debug'); // Uncomment for debugging

                onAuthStateChanged(auth, async (user) => {
                    if (!user) {
                        try {
                            // 커스텀 토큰 미스매치 오류 방지: 익명 인증을 먼저 시도하여 사용자 세션을 확보
                            await signInAnonymously(auth);
                        } catch (error) {
                            console.error("Firebase Auth Error (Check Console Settings!):", error);
                        }
                    }
                });
            } catch (error) {
                console.error("Firebase initialization failed:", error);
            }
        };

        setupFirebase();

        
        // Main logic to handle form and data submission
        document.addEventListener('DOMContentLoaded', () => {
            const startScreen = document.getElementById('startScreen');
            const surveySection = document.getElementById('surveySection');
            const emailConsentOverlay = document.getElementById('emailConsentOverlay');
            const resultOverlay = document.getElementById('resultOverlay');

            const companySizeSelect = document.getElementById('company-size');
            const industryTypeSelect = document.getElementById('industry-type');
            const startSurveyButton = document.getElementById('startSurveyButton');
            
            const inputFieldsContainer = document.getElementById('input-fields');
            const showChartButton = document.getElementById('showChartButton');

            const marketingEmailInput = document.getElementById('marketingEmailInput');
            const marketingConsentCheckbox = document.getElementById('marketingConsentCheckbox');
            const sendMarketingEmailButton = document.getElementById('sendMarketingEmailButton');
            const marketingEmailMessage = document.getElementById('marketingEmailMessage');
            
            const radarCanvas = document.getElementById('radarChart');
            const resultCloseButton = document.getElementById('resultCloseButton');
            
            let questionScores = {};
            let companyInfo = {};
            

            const categories = {
                "Commitment": [
                    "나는 우리 팀의 업무 목표를 명확하게 알고 있다.",
                    "나는 우리 팀의 업무가 나에게 의미 있고 보람 있다고 느낀다."
                ],
                "Communication": [
                    "우리 팀은 누구나 자유롭게 의견을 제시할 수 있는 분위기이다.",
                    "나의 의견이 팀의 의사결정에 반영된다고 느낀다.",
                    "나는 동료들과의 자유로운 대화 속에서 업무에 대한 아이디어를 얻는다."
                ],
                "Collaboration": [
                    "나는 동료들의 업무 진행 상황을 잘 알고 있다.",
                    "동료들은 나의 업무에 적극적으로 도움을 준다.",
                    "우리 팀은 협업과 업무 지원이 원활하게 이루어진다."
                ],
                "Process": [
                    "우리 팀은 체계적인 계획에 따라 업무를 수행한다.",
                    "나의 업무에는 모호하거나 낭비적인 요소가 거의 없다.",
                    "우리 팀은 역할과 책임(R&R)이 명확하게 배분되어 있다."
                ],
                "Trust": [
                    "우리 팀은 실수에 대해 공정하게 판단하며 저평가하지 않는다.",
                    "나는 우리 팀에서 우려나 이의를 자유롭게 제기할 수 있다고 느낀다."
                ],
                "Growth": [
                    "동료들은 나의 업무 개선을 위한 피드백을 제공한다.",
                    "나는 업무를 통해 지속적으로 성장하고 있다고 느낀다."
                ]
            };
            const labels = Object.keys(categories);
            const likertLabels = ["매우 그렇지 않다", "그렇지 않다", "보통이다", "그렇다", "매우 그렇다"];

            // Start screen logic
            function checkStartConditions() {
                const sizeSelected = companySizeSelect.value !== "";
                const industrySelected = industryTypeSelect.value !== "";
                // startSurveyButton.disabled = !(sizeSelected && industrySelected); // 항상 활성화로 변경
            }
            
            companySizeSelect.addEventListener('change', checkStartConditions);
            industryTypeSelect.addEventListener('change', checkStartConditions);

            startSurveyButton.addEventListener('click', () => {
                companyInfo = {
                    companySize: companySizeSelect.value,
                    industryType: industryTypeSelect.value
                };
                
                startScreen.classList.add('hidden');
                surveySection.classList.remove('hidden');
                surveySection.classList.add('flex'); // flex display for centering
            });

            // Initialize all question scores
            Object.keys(categories).forEach(category => {
                categories[category].forEach((question, index) => {
                    const questionId = `${category}-${index}`;
                    questionScores[questionId] = 0;
                });
            });

            // Check if all questions are answered
            function allQuestionsAnswered() {
                return Object.values(questionScores).every(score => score > 0);
            }

            // Update button state
            function updateUI() {
                if (allQuestionsAnswered()) {
                    showChartButton.disabled = false;
                    showChartButton.textContent = "결과 보기";
                } else {
                    showChartButton.disabled = true;
                    showChartButton.textContent = "모든 질문에 응답해 주세요";
                }
            }

            // Calculate the average score for each category
            function calculateAverages() {
                const averageScores = {};
                labels.forEach(label => {
                    const questions = categories[label];
                    let sum = 0;
                    let count = 0;
                    questions.forEach((q, index) => {
                        const score = questionScores[`${label}-${index}`];
                        if (score > 0) {
                            sum += score;
                            count++;
                        }
                    });
                    averageScores[label] = count > 0 ? parseFloat((sum / count).toFixed(1)) : 0;
                });
                return averageScores;
            }

            // Create input fields for each question
            Object.keys(categories).forEach(category => {
                categories[category].forEach((question, index) => {
                    const questionId = `${category}-${index}`;
                    const questionGroup = document.createElement('div');
                    questionGroup.className = 'question-group';
                    
                    const labelElem = document.createElement('label');
                    labelElem.className = 'question-label';
                    labelElem.textContent = question;
                    questionGroup.appendChild(labelElem);

                    const likertScaleContainer = document.createElement('div');
                    likertScaleContainer.className = 'flex flex-col items-center';

                    const likertScale = document.createElement('div');
                    likertScale.className = 'likert-scale w-full';
                    
                    for (let i = 1; i <= 5; i++) {
                        const button = document.createElement('button');
                        button.className = 'likert-button';
                        button.textContent = i;
                        button.value = i;
                        button.onclick = (e) => {
                            Array.from(e.target.parentNode.children).forEach(btn => btn.classList.remove('selected'));
                            e.target.classList.add('selected');
                            questionScores[questionId] = parseInt(e.target.value, 10);
                            updateUI();
                        };
                        likertScale.appendChild(button);
                    }
                    
                    const likertGuideContainer = document.createElement('div');
                    likertGuideContainer.className = 'likert-guide-container w-full';
                    likertLabels.forEach(label => {
                        const guideDiv = document.createElement('div');
                        guideDiv.className = 'likert-guide';
                        guideDiv.textContent = label;
                        likertGuideContainer.appendChild(guideDiv);
                    });

                    likertScaleContainer.appendChild(likertScale);
                    likertScaleContainer.appendChild(likertGuideContainer);
                    questionGroup.appendChild(likertScaleContainer);
                    
                    inputFieldsContainer.appendChild(questionGroup);
                });
            });

            // Show chart logic
            showChartButton.addEventListener('click', async () => {
                if (allQuestionsAnswered()) {
                    finalResults = {
                        companySize: companySizeSelect.value,
                        industryType: industryTypeSelect.value,
                        averageScores: calculateAverages(),
                        userId: auth.currentUser?.uid || 'anonymous',
                        timestamp: new Date().toISOString()
                    };
                    
                    surveySection.classList.add('hidden');
                    // Show email consent section first
                    emailConsentOverlay.classList.remove('hidden');
                    emailConsentOverlay.classList.add('visible');

                }
            });

            // Close modal logic
            resultCloseButton.addEventListener('click', () => {
                resultOverlay.classList.remove('visible');
                resultOverlay.classList.add('hidden');
                // 페이지를 리셋하고 싶으면 window.location.reload(); 사용
            });
            
            // Marketing consent logic
            function checkMarketingConsent() {
                const emailValue = marketingEmailInput.value;
                const consentChecked = marketingConsentCheckbox.checked;
                sendMarketingEmailButton.disabled = !(emailValue.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/) && consentChecked);
            }

            marketingEmailInput.addEventListener('input', checkMarketingConsent);
            marketingConsentCheckbox.addEventListener('change', checkMarketingConsent);
            
            // Enter key press on email input
            marketingEmailInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && !sendMarketingEmailButton.disabled) {
                    e.preventDefault();
                    sendMarketingEmailButton.click();
                }
            });

            // Firestore 저장 및 결과 보기 로직
            sendMarketingEmailButton.addEventListener('click', async () => {
                const email = marketingEmailInput.value;
                const isConsented = marketingConsentCheckbox.checked;

                if (!sendMarketingEmailButton.disabled) {
                    sendMarketingEmailButton.textContent = '저장 중...';
                    sendMarketingEmailButton.disabled = true;

                    try {
                        // Firestore에 마케팅 동의 및 설문 결과 데이터 저장
                        const docData = {
                            ...finalResults,
                            userEmail: email,
                            consented_to_marketing: isConsented,
                            timestamp: serverTimestamp()
                        };

                        // 이메일 주소와 설문 결과 통합하여 저장
                        await addDoc(collection(db, `/artifacts/${appId}/public/data/marketing_consents`), docData);
                        
                        // 성공 후 팝업 띄우기
                        emailConsentOverlay.classList.remove('visible');
                        emailConsentOverlay.classList.add('hidden');
                        resultOverlay.classList.remove('hidden');
                        resultOverlay.classList.add('visible');
                        renderChart(finalResults.averageScores);

                    } catch (e) {
                        console.error("Error saving to Firestore: ", e);
                        marketingEmailMessage.textContent = '저장에 실패했습니다. (Firebase 권한 및 연결 확인)';
                        marketingEmailMessage.classList.remove('hidden');
                        marketingEmailMessage.style.color = '#dc3545';
                        sendMarketingEmailButton.disabled = false;
                        sendMarketingEmailButton.textContent = '동의하고 결과 받기';
                    }
                }
            });


            // Chart rendering logic
            let chartInstance = null;
            function renderChart(scores) {
                if (chartInstance) {
                    chartInstance.destroy();
                }
                
                // Update detail scores below chart
                labels.forEach(label => {
                    document.getElementById(`${label}-score`).textContent = scores[label].toFixed(1);
                });

                const data = {
                    labels: labels,
                    datasets: [{
                        label: 'Team Performance',
                        data: Object.values(scores),
                        fill: true,
                        backgroundColor: 'rgba(216, 57, 104, 0.4)',
                        borderColor: '#d83968',
                        pointBackgroundColor: '#d83968',
                        pointBorderColor: '#fff',
                        pointHoverBackgroundColor: '#fff',
                        pointHoverBorderColor: 'rgba(216, 57, 104, 1)'
                    }]
                };

                const config = {
                    type: 'radar',
                    data: data,
                    options: {
                        maintainAspectRatio: false, // 캔버스 크기 제어를 위해 필요
                        elements: {
                            line: {
                                borderWidth: 2,
                                tension: 0 // 육각형 모양을 위한 설정 (0 = 직선)
                            }
                        },
                        scales: {
                            r: {
                                angleLines: {
                                    color: 'rgba(150, 150, 150, 0.2)'
                                },
                                grid: {
                                    color: 'rgba(150, 150, 150, 0.2)'
                                },
                                pointLabels: {
                                    color: 'var(--dark-gray)',
                                    font: {
                                        size: 14,
                                        weight: '600'
                                    }
                                },
                                ticks: {
                                    stepSize: 1.0, // 1점 단위로 눈금 설정
                                    beginAtZero: true,
                                    min: 0,
                                    max: 5,
                                    backdropColor: 'rgba(255, 255, 255, 0.7)',
                                    color: 'var(--dark-gray)'
                                }
                            }
                        },
                        plugins: {
                            legend: {
                                display: false
                            }
                        }
                    }
                };
                
                chartInstance = new Chart(radarCanvas, config);
            }
        });
    </script>
</body>
</html>
