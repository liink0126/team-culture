<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>팀 진단 설문</title>
    <!-- 모든 CDN 링크를 head 태그 안에 명확하게 배치 -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        
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

        body {
            font-family: 'Inter', sans-serif;
            background-color: var(--background-color);
            color: var(--text-color);
            /* 화면에 꽉 채우기 위한 설정 */
            display: flex;
            justify-content: center;
            align-items: flex-start; 
            min-height: 100vh;
            padding: 2rem 1rem;
            width: 100%; 
            box-sizing: border-box; /* 패딩이 너비에 포함되도록 설정 */
            
            /* GitHub Pages Header 문제 해결을 위해 상단 여백 제거 및 설문지 시작점 조정 */
            margin: 0; 
            padding-top: 2rem; 
        }

        /* Container: 설문지 본문 컨테이너 */
        .container {
            background-color: var(--surface-color);
            border-radius: 1.5rem;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
            padding: 2.5rem;
            max-width: 900px; 
            width: 100%;
            /* body의 padding-top을 이용해 상단 여백 관리 */
            margin-top: 0; 
            margin-bottom: 2rem;
        }
        
        /* Mobile adjustments */
        @media (max-width: 640px) {
            body {
                padding: 1rem 0.5rem;
                align-items: flex-start;
                padding-top: 1rem;
            }
            .container {
                border-radius: 0; 
                box-shadow: none;
                padding: 1.5rem 1rem;
                margin-top: 0; 
            }
            .title {
                font-size: 2rem;
            }
            .subtitle {
                font-size: 1rem;
            }
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
        .question-group-wrapper {
            padding-bottom: 2rem;
            border-bottom: 1px solid var(--light-gray); /* 질문 간의 시각적 구분 */
        }
        .question-group-wrapper:last-child {
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
            max-width: 600px;
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
        }

        .chart-details {
            margin-top: 2rem;
            padding-top: 1.5rem;
            border-top: 1px solid var(--light-gray);
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 1.5rem;
        }
        .chart-details > div {
            width: calc(50% - 0.75rem);
        }
        /* Mobile: display details in a single column */
        @media (max-width: 640px) {
            .chart-details > div {
                width: 100%;
            }
        }

        .detail-item {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            font-size: 1rem;
            font-weight: 500;
        }
        .detail-color-box {
            width: 1rem;
            height: 1rem;
            border-radius: 0.25rem;
            background-color: var(--primary-color);
        }

        .hidden {
            display: none;
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
                <p class="subtitle">우리 팀의 강점과 약점을 확인하세요</p>
            </div>
            <div id="input-fields" class="space-y-6">
                <!-- Input fields for each question will be generated by JavaScript -->
            </div>
            <button id="showChartButton" class="show-chart-button" disabled>결과 보기</button>
        </div>

        <!-- Email and Marketing Consent Popup -->
        <div id="emailConsentOverlay" class="modal-overlay hidden">
            <div id="emailConsentContent" class="modal-content">
                <div class="header">
                    <h3 class="font-bold text-lg text-gray-800">결과를 이메일로 받아보세요</h3>
                    <p class="text-sm text-gray-500">마케팅 정보 수신 동의 시, 팀 역량 강화 관련 최신 정보를 보내드립니다.</p>
                </div>
                <div class="space-y-4">
                    <div>
                        <label for="marketingEmailInput" class="block text-sm font-medium text-gray-700 mb-1">이메일 주소</label>
                        <input type="email" id="marketingEmailInput" placeholder="example@email.com" class="w-full p-2 rounded-md border border-gray-300 focus:border-red-500 focus:ring focus:ring-red-200 focus:ring-opacity-50 transition ease-in-out">
                    </div>
                    <div class="flex items-center space-x-2">
                        <input type="checkbox" id="marketingConsentCheckbox" class="form-checkbox h-4 w-4 text-red-600 rounded-md transition duration-150 ease-in-out">
                        <label for="marketingConsentCheckbox" class="text-xs text-gray-600">
                            <a href="#" class="text-red-500 font-medium" onclick="return false;">개인정보 수집 및 이용</a>에 동의합니다 (마케팅 정보 수신 포함)
                        </label>
                    </div>
                </div>
                <button id="sendMarketingEmailButton" class="show-chart-button text-sm w-full mt-4" disabled>동의하고 결과 받기</button>
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
                <!-- Chart Container: Center the chart itself -->
                <div class="relative w-full h-96 mx-auto" style="max-width: 400px;"> 
                    <canvas id="radarChart"></canvas>
                </div>
                <div class="chart-details">
                    <div class="detail-item">
                        <div class="detail-color-box"></div>
                        <span class="font-bold">Commitment:</span>
                        <span id="Commitment-score"></span>
                    </div>
                    <div class="detail-item">
                        <div class="detail-color-box"></div>
                        <span class="font-bold">Communication:</span>
                        <span id="Communication-score"></span>
                    </div>
                    <div class="detail-item">
                        <div class="detail-color-box"></div>
                        <span class="font-bold">Collaboration:</span>
                        <span id="Collaboration-score"></span>
                    </div>
                    <div class="detail-item">
                        <div class="detail-color-box"></div>
                        <span class="font-bold">Process:</span>
                        <span id="Process-score"></span>
                    </div>
                    <div class="detail-item">
                        <div class="detail-color-box"></div>
                        <span class="font-bold">Trust:</span>
                        <span id="Trust-score"></span>
                    </div>
                    <div class="detail-item">
                        <div class="detail-color-box"></div>
                        <span class="font-bold">Growth:</span>
                        <span id="Growth-score"></span>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Firebase SDKs -->
    <script type="module">
        import { initializeApp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";
        import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";
        import { getFirestore, doc, addDoc, collection, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";

        // Global variables provided by the Canvas environment
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
        
        // Initialize Firebase and set up a listener for authentication state changes
        const setupFirebase = async () => {
            try {
                const app = initializeApp(firebaseConfig);
                db = getFirestore(app);
                auth = getAuth(app);
                // firebase.firestore.setLogLevel('debug'); // Uncomment for debugging

                onAuthStateChanged(auth, async (user) => {
                    if (!user) {
                        // Firebase 인증 오류 해결: 익명 인증을 우선 시도
                        if (initialAuthToken) {
                            await signInWithCustomToken(auth, initialAuthToken).catch(async (e) => {
                                console.warn("Custom token sign-in failed, falling back to anonymous:", e);
                                await signInAnonymously(auth);
                            });
                        } else {
                            await signInAnonymously(auth);
                        }
                    }
                });
            } catch (error) {
                console.error("Firebase initialization or authentication failed:", error);
            }
        };

        setupFirebase();

        // **원래의 15가지 세부 질문을 포함하는 데이터 구조를 다시 사용**
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
        const labels = Object.keys(categories); // Commitment, Communication, ... (6개 항목)
        const likertLabels = ["매우 그렇지 않다", "그렇지 않다", "보통이다", "그렇다", "매우 그렇다"];

        
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
            
            let questionScores = {}; // 15개 질문의 점수를 저장
            let companyInfo = {};
            
            // Start screen logic
            startSurveyButton.addEventListener('click', async () => {
                companyInfo = {
                    companySize: companySizeSelect.value,
                    industryType: industryTypeSelect.value
                };
                
                startScreen.classList.add('hidden');
                surveySection.classList.remove('hidden');
            });

            // Initialize all question scores (15 items)
            Object.keys(categories).forEach(category => {
                categories[category].forEach((question, index) => {
                    const questionId = `${category}-${index}`;
                    questionScores[questionId] = 0;
                });
            });

            // Check if all questions are answered (15 items)
            function allQuestionsAnswered() {
                // 15개 질문 모두 응답했는지 확인
                const totalQuestions = Object.values(categories).flat().length;
                const answeredQuestions = Object.values(questionScores).filter(score => score > 0).length;
                return answeredQuestions === totalQuestions;
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
            
            // Calculate the average score for each category (6 categories from 15 questions)
            function calculateAverages() {
                const averageScores = {};
                labels.forEach(label => {
                    const questionsInCat = categories[label];
                    let sum = 0;
                    let count = 0;
                    questionsInCat.forEach((q, index) => {
                        const score = questionScores[`${label}-${index}`];
                        if (score > 0) {
                            sum += score;
                            count++;
                        }
                    });
                    // 평균을 계산하고, 해당 항목의 질문이 하나도 없으면 0으로 처리
                    averageScores[label] = count > 0 ? sum / count : 0;
                });
                return averageScores;
            }


            // Create input fields for each question (15 items total, NO CATEGORY HEADINGS)
            Object.keys(categories).forEach(category => {
                categories[category].forEach((question, index) => {
                    const questionId = `${category}-${index}`; // Unique ID for score tracking
                    const questionGroup = document.createElement('div');
                    questionGroup.className = 'question-group-wrapper'; // 질문 그룹 래퍼로 사용
                    
                    const labelElem = document.createElement('label');
                    labelElem.className = 'question-label';
                    labelElem.textContent = question; // 세부 질문 텍스트
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
            showChartButton.addEventListener('click', () => {
                if (allQuestionsAnswered()) {
                    const averageScores = calculateAverages();
                    
                    finalResults = {
                        companySize: companyInfo.companySize,
                        industryType: companyInfo.industryType,
                        // 15개 개별 질문 점수 (저장을 위해 남겨둠)
                        rawScores: questionScores,
                        // 6개 항목 평균 점수
                        averageScores: averageScores, 
                    };
                    
                    surveySection.classList.add('hidden');
                    // show email consent section first
                    emailConsentOverlay.classList.remove('hidden');
                    emailConsentOverlay.classList.add('visible');

                }
            });

            // Close modal logic
            resultCloseButton.addEventListener('click', () => {
                resultOverlay.classList.remove('visible');
                resultOverlay.classList.add('hidden');
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
            marketingEmailInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !sendMarketingEmailButton.disabled) {
                    e.preventDefault();
                    sendMarketingEmailButton.click();
                }
            });

            // Firestore 저장 및 결과 보기 로직 (이메일 주소와 설문 결과 통합 저장)
            sendMarketingEmailButton.addEventListener('click', async () => {
                const email = marketingEmailInput.value;
                const isConsented = marketingConsentCheckbox.checked;

                if (!sendMarketingEmailButton.disabled) {
                    sendMarketingEmailButton.textContent = '저장 중...';
                    sendMarketingEmailButton.disabled = true;

                    try {
                        // Firestore에 마케팅 동의 데이터와 설문 결과를 통합하여 저장
                        await addDoc(collection(db, `/artifacts/${appId}/public/data/marketing_consents`), {
                            userEmail: email,
                            consented_to_marketing: isConsented,
                            companySize: finalResults.companySize,
                            industryType: finalResults.industryType,
                            results: finalResults.averageScores, // 6개 항목 평균 점수 저장
                            raw_scores: finalResults.rawScores, // 15개 개별 점수 (분석용)
                            userId: auth.currentUser.uid,
                            timestamp: serverTimestamp()
                        });
                        
                        // Show chart after successful save
                        emailConsentOverlay.classList.remove('visible');
                        emailConsentOverlay.classList.add('hidden');
                        resultOverlay.classList.remove('hidden');
                        resultOverlay.classList.add('visible');
                        renderChart(finalResults.averageScores); // 평균 점수로 차트 렌더링

                    } catch (e) {
                        console.error("Error saving marketing consent and results to Firestore: ", e);
                        marketingEmailMessage.textContent = '저장에 실패했습니다. 다시 시도해 주세요. (Firebase 인증/규칙 확인 필요)';
                        marketingEmailMessage.classList.remove('hidden');
                        marketingEmailMessage.style.color = '#dc3545';
                        sendMarketingEmailButton.disabled = false;
                        sendMarketingEmailButton.textContent = '동의하고 결과 받기';
                    }
                }
            });


            // Chart rendering logic
            function renderChart(scores) {
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
                        maintainAspectRatio: false, // Make chart responsive
                        elements: {
                            line: {
                                borderWidth: 2
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
                                    color: '#495057',
                                    font: {
                                        size: 14,
                                        weight: 'bold'
                                    }
                                },
                                ticks: {
                                    backdropColor: 'transparent',
                                    color: '#495057',
                                    font: {
                                        size: 10
                                    },
                                    stepSize: 1,
                                    callback: function(value, index, values) {
                                        return Math.round(value);
                                    }
                                },
                                suggestedMin: 0,
                                suggestedMax: 5
                            }
                        },
                        plugins: {
                            legend: {
                                display: false
                            }
                        }
                    }
                };

                // Destroy old chart instance if it exists to prevent rendering issues
                if (window.myRadarChart) {
                    window.myRadarChart.destroy();
                }

                window.myRadarChart = new Chart(radarCanvas, config);
                
                // Update text details below the chart
                Object.keys(scores).forEach(category => {
                    const scoreElement = document.getElementById(`${category}-score`);
                    if (scoreElement) {
                        scoreElement.textContent = scores[category].toFixed(1);
                    }
                });
            }
        });
    </script>
</body>
</html>
