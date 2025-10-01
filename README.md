<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>liink | 조직 문제 진단 및 솔루션 추천</title>
    <!-- CDN Links for required libraries -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <link rel="stylesheet" as="style" crossorigin href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css" />
    
    <style>
        /* Base Font and Layout Styles */
        body {
            font-family: 'Pretendard', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background-color: #f7f8fc; /* Softer background color */
            display: flex;
            justify-content: center;
            align-items: flex-start;
            min-height: 100vh;
            padding: 2rem 1rem;
            box-sizing: border-box;
            /* Prevents awkward word breaks in Korean */
            word-break: keep-all;
            overflow-wrap: break-word;
        }

        /* Custom Colors */
        :root {
            --primary-color: #d83968;
            --primary-hover-color: #c1325c;
            --surface-color: #ffffff;
            --text-heading-color: #1a202c;
            --text-body-color: #4a5568;
            --text-muted-color: #718096;
            --border-color: #e2e8f0;
            --background-color: #f7f8fc;
        }
        
        /* Main Container */
        .container-wrapper {
            background-color: var(--surface-color);
            border-radius: 1.5rem;
            box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.08);
            padding: 2rem; /* Default padding for mobile */
            max-width: 900px;
            width: 100%;
            border: 1px solid var(--border-color);
        }

        @media (min-width: 768px) { /* More padding on medium screens and up */
            .container-wrapper {
                padding: 3rem 4rem;
            }
        }

        /* Section Header */
        .header {
            text-align: center;
            margin-bottom: 2.5rem;
        }
        .title {
            font-size: 2.25rem; /* Responsive font size */
            font-weight: 800;
            color: var(--text-heading-color);
            line-height: 1.3;
        }
         .title .highlight {
            color: var(--primary-color);
        }
        .subtitle {
            font-size: 1.125rem; /* Responsive font size */
            color: var(--text-body-color);
            margin-top: 0.75rem;
            max-width: 600px;
            margin-left: auto;
            margin-right: auto;
        }
        
        /* Survey Specific Styles */
        .question-group {
            margin-bottom: 2rem;
            padding-bottom: 2rem;
            border-bottom: 1px solid var(--border-color);
        }
        .question-group:last-of-type { border-bottom: none; }
        .question-label {
            font-weight: 600;
            margin-bottom: 1rem;
            font-size: 1.1rem;
            color: var(--text-heading-color);
            display: block;
        }
        .likert-scale {
            display: grid;
            grid-template-columns: repeat(5, 1fr);
            gap: 0.5rem;
        }
        .likert-button {
            padding: 0.75rem 0; border-radius: 0.75rem; border: 2px solid var(--border-color);
            background-color: var(--surface-color); font-weight: 600; cursor: pointer; transition: all 0.2s ease-in-out;
            color: var(--text-muted-color); font-size: 1rem; text-align: center;
        }
        .likert-button:hover { background-color: #fdf2f8; border-color: #fbcfe8; }
        .likert-button.selected {
            background-color: var(--primary-color); border-color: var(--primary-color); color: #ffffff; transform: scale(1.05);
            box-shadow: 0 4px 15px rgba(216, 57, 104, 0.2);
        }
        .likert-guide-container { display: flex; justify-content: space-between; font-size: 0.8rem; color: var(--text-muted-color); margin-top: 0.75rem; padding: 0 0.25rem;}

        /* Main Action Button Style */
        .action-button {
            background-color: var(--primary-color); color: white; padding: 1rem 2rem; border-radius: 0.75rem; font-size: 1.125rem;
            font-weight: 700; border: none; cursor: pointer; transition: all 0.2s ease-in-out;
            box-shadow: 0 4px 15px rgba(216, 57, 104, 0.2); margin-top: 2rem; align-self: center; width: 100%;
        }
        @media (min-width: 640px) { .action-button { width: auto; min-width: 250px; } }
        .action-button:hover { background-color: var(--primary-hover-color); transform: translateY(-3px); box-shadow: 0 6px 20px rgba(216, 57, 104, 0.3); }
        .action-button:disabled { background-color: #cbd5e1; cursor: not-allowed; box-shadow: none; transform: none; }
        
        /* Modal Styles */
        .modal-overlay {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.6);
            display: flex; justify-content: center; align-items: center; z-index: 1000;
            opacity: 0; visibility: hidden; transition: opacity 0.3s ease-in-out, visibility 0.3s ease-in-out;
        }
        .modal-overlay.visible { opacity: 1; visibility: visible; }
        .modal-content {
            background-color: var(--surface-color); padding: 2.5rem; border-radius: 1.5rem; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
            position: relative; max-width: 650px; width: 90%; transform: scale(0.95); transition: transform 0.3s ease-in-out;
        }
        .modal-overlay.visible .modal-content { transform: scale(1); }
        .modal-close-button {
            position: absolute; top: 1rem; right: 1.5rem; background: none; border: none; font-size: 2rem;
            line-height: 1; color: var(--text-muted-color); cursor: pointer; transition: color 0.2s;
        }
        .modal-close-button:hover { color: var(--primary-color); }

        /* Chart Styles */
        .chart-container { width: 100%; max-width: 350px; height: 350px; margin: 1rem auto; }
        .chart-details {
            margin-top: 1.5rem;
            padding-top: 1.5rem;
            border-top: 1px solid var(--border-color);
            display: grid;
            grid-template-columns: 1fr; /* 1 column on mobile */
            gap: 0.75rem;
        }
        @media (min-width: 500px) { /* 2 columns on sm screens and up */
            .chart-details {
                grid-template-columns: repeat(2, 1fr);
                gap: 1rem;
            }
        }
        .detail-item { display: flex; align-items: center; gap: 0.75rem; font-size: 0.95rem; font-weight: 500; }
        .detail-color-box { width: 0.75rem; height: 0.75rem; border-radius: 0.25rem; flex-shrink: 0; }
        
        /* Recommender Specific Styles */
        .screen { display: none; }
        .screen.active { display: block; animation: fadeIn 0.6s ease-in-out; }
        @keyframes fadeIn { 
            from { opacity: 0; transform: translateY(20px); } 
            to { opacity: 1; transform: translateY(0); } 
        }
        .custom-checkbox + label {
            border: 2px solid var(--border-color);
        }
        .custom-checkbox:checked + label {
            border-color: var(--primary-color); background-color: #fdf2f8; box-shadow: 0 4px 10px rgba(216, 57, 104, 0.1); transform: translateY(-2px);
        }
        .progress-bar-fill { transition: width 0.5s ease-in-out; }
        
        .hidden { display: none !important; }
    </style>
</head>
<body>
    <div class="container-wrapper">
        <!-- Part 1: Team Diagnosis Survey -->
        <div id="survey-container">
            <!-- Start Screen -->
            <div id="startScreen" class="flex flex-col gap-8 text-center">
                <div class="header">
                    <h1 class="title">1단계: <span class="highlight">팀 역량</span> 진단</h1>
                    <p class="subtitle">먼저 간단한 설문을 통해 현재 우리 팀의 역량 수준을 진단합니다.</p>
                </div>
                <div class="space-y-4 text-left">
                    <div>
                        <label for="company-size" class="block text-lg font-medium text-gray-700 mb-2">기업 규모</label>
                        <select id="company-size" class="w-full p-3 rounded-xl border border-gray-300 focus:border-pink-500 focus:ring focus:ring-pink-200 focus:ring-opacity-50 transition ease-in-out">
                            <option value="">선택하세요</option>
                            <option value="대기업">대기업</option>
                            <option value="중견기업">중견기업</option>
                            <option value="중소기업">중소기업</option>
                            <option value="스타트업">스타트업</option>
                            <option value="기타">기타</option>
                        </select>
                    </div>
                    <div>
                        <label for="industry-type" class="block text-lg font-medium text-gray-700 mb-2">산업 분류</label>
                        <select id="industry-type" class="w-full p-3 rounded-xl border border-gray-300 focus:border-pink-500 focus:ring focus:ring-pink-200 focus:ring-opacity-50 transition ease-in-out">
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
                <button id="startSurveyButton" class="action-button" disabled>설문 시작하기</button>
            </div>

            <!-- Survey Section -->
            <div id="surveySection" class="hidden flex flex-col items-center">
                <div class="header">
                    <h1 class="title">팀 역량 진단 설문</h1>
                    <p class="subtitle">우리 팀의 현재 상태에 대해 가장 가깝다고 생각하는 점수를 선택해주세요.</p>
                </div>
                <div id="input-fields" class="space-y-6 w-full">
                    <!-- Input fields will be generated by JavaScript -->
                </div>
                <button id="showChartButton" class="action-button" disabled>모든 질문에 응답해 주세요</button>
            </div>
        </div>

        <!-- Part 2: Solution Recommender -->
        <div id="recommender-container" class="hidden">
            <!-- Progress Bar -->
            <div id="progress-container" class="mb-10">
                <div class="flex justify-between items-center mb-2">
                    <span id="progress-text" class="text-base font-semibold text-[#d83968]">문제 진단</span>
                    <span class="text-sm text-gray-500 font-medium"><span id="progress-step">1</span> / 2</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                    <div id="progress-bar-fill" class="bg-[#d83968] h-2 rounded-full" style="width: 50%;"></div>
                </div>
            </div>

            <!-- Screen 1: Problem Selection -->
            <div id="screen-1" class="screen">
                 <h1 class="title text-center">2단계: <span class="highlight">조직 문제점</span> 확인</h1>
                 <p class="subtitle text-center">진단 결과에 따라 예상되는 문제점들이 자동 선택되었습니다.<br class="hidden sm:block"> 내용을 확인하고, 추가하거나 변경하여 조직의 상황을 더 정확하게 알려주세요.</p>
                <div id="problem-categories" class="space-y-8 mt-10">
                    <!-- Problem categories and items will be injected here -->
                </div>
                <div class="mt-10 flex justify-center">
                    <button class="action-button" onclick="showRecommendation()" id="show-result-btn" disabled>맞춤 솔루션 확인하기</button>
                </div>
            </div>
            
            <!-- Screen 2: Recommendation Result -->
            <div id="screen-2" class="screen">
                <h1 class="title text-center">liink의 <span class="highlight">맞춤 솔루션</span> 제안</h1>
                <p class="subtitle text-center">선택하신 문제를 해결하기 위한 최적의 프로그램을 추천해 드립니다.</p>
                <div id="recommendation-content" class="space-y-8 mt-10">
                    <!-- Recommendation will be injected here -->
                </div>
                <div class="bg-slate-100 p-6 rounded-lg mt-10 text-center">
                    <h3 class="font-bold text-lg text-gray-800 mb-2">더 자세한 내용이 궁금하신가요?</h3>
                    <p class="text-gray-600 mb-5">아래 버튼을 눌러 문의를 남겨주시면<br>전문 컨설턴트가 상세한 프로그램 내용과 일정을 안내해 드립니다.</p>
                    <div class="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
                        <button class="w-full whitespace-nowrap bg-gray-300 text-gray-800 font-bold py-3 px-4 rounded-lg hover:bg-gray-400 transition" onclick="showScreen('screen-1', 1)">진단 다시하기</button>
                        <button class="w-full whitespace-nowrap bg-[#d83968] text-white font-bold py-3 px-6 rounded-lg hover:bg-[#c1325c] transition" onclick="showScreen('screen-3')">전문가에게 문의하기</button>
                    </div>
                </div>
            </div>

            <!-- Screen 3: Contact Form -->
            <div id="screen-3" class="screen">
                <h1 class="title text-center">문의 내용 남기기</h1>
                <p class="subtitle text-center">담당자가 빠르게 확인 후 연락드리겠습니다.</p>
                <form id="contact-form" class="space-y-4 mt-10">
                    <div class="grid sm:grid-cols-2 gap-4">
                        <div><label for="company" class="block text-sm font-medium text-gray-700 mb-1">회사/단체명*</label><input type="text" id="company" class="w-full p-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#d83968] focus:border-[#d83968]" required></div>
                        <div><label for="name" class="block text-sm font-medium text-gray-700 mb-1">담당자 이름*</label><input type="text" id="name" class="w-full p-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#d83968] focus:border-[#d83968]" required></div>
                        <div><label for="phone" class="block text-sm font-medium text-gray-700 mb-1">연락처*</label><input type="tel" id="phone" class="w-full p-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#d83968] focus:border-[#d83968]" required></div>
                        <div><label for="email" class="block text-sm font-medium text-gray-700 mb-1">이메일*</label><input type="email" id="email" class="w-full p-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#d83968] focus:border-[#d83968]" required></div>
                    </div>
                    <div><label for="requests" class="block text-sm font-medium text-gray-700 mb-1">기타 요청사항</label><textarea id="requests" rows="4" class="w-full p-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#d83968] focus:border-[#d83968]"></textarea></div>
                    <div id="contact-form-error" class="text-center text-red-600 hidden mt-2"></div>
                    <div class="flex flex-col sm:flex-row gap-4 pt-4">
                        <button type="button" class="w-full bg-gray-300 text-gray-800 font-bold py-3 px-4 rounded-lg hover:bg-gray-400 transition" onclick="showScreen('screen-2')">뒤로</button>
                        <button type="submit" class="w-full bg-[#d83968] text-white font-bold py-3 px-4 rounded-lg hover:bg-[#c1325c] transition">제출하기</button>
                    </div>
                </form>
            </div>

            <!-- Screen 4: Completion -->
            <div id="screen-4" class="screen text-center py-10">
                <h2 class="text-3xl font-bold text-gray-800 mb-4">문의가 성공적으로 접수되었습니다.</h2>
                <p class="text-base text-gray-600 mb-8 max-w-md mx-auto">검토 후 24시간 이내에 담당자가 입력하신 연락처로 회신드리겠습니다. 감사합니다.</p>
                <button class="bg-gray-700 text-white font-bold py-3 px-6 rounded-lg hover:bg-gray-800 transition" onclick="location.reload()">처음으로 돌아가기</button>
            </div>
        </div>
    </div>
    
    <!-- Modals (Popups) -->
    <!-- Email and Marketing Consent Popup -->
    <div id="emailConsentOverlay" class="modal-overlay">
        <div id="emailConsentContent" class="modal-content">
            <div class="header">
                <h3 class="text-2xl font-bold text-gray-800" style="color: var(--primary-color);">결과 수신 및 정보 동의</h3>
                <p class="text-base text-gray-500 mt-2">이메일로 상세 진단 결과를 받아보시고, 팀 역량 강화 관련 최신 정보를 수신하시겠습니까?</p>
            </div>
            <div class="space-y-4 pt-4">
                <div>
                    <label for="marketingEmailInput" class="block text-sm font-medium text-gray-700 mb-1">이메일 주소</label>
                    <input type="email" id="marketingEmailInput" placeholder="example@email.com" class="w-full p-3 rounded-lg border border-gray-300 focus:border-pink-500 focus:ring focus:ring-pink-200 focus:ring-opacity-50 transition ease-in-out">
                </div>
                <div class="flex items-center space-x-2">
                    <input type="checkbox" id="marketingConsentCheckbox" class="form-checkbox h-5 w-5 text-pink-600 rounded-md transition duration-150 ease-in-out">
                    <label for="marketingConsentCheckbox" class="text-sm text-gray-600">
                        <a href="#" class="text-pink-500 font-bold" onclick="return false;">개인정보 수집 및 이용</a>에 동의합니다 (마케팅 정보 수신 포함)
                    </label>
                </div>
            </div>
            <div class="flex justify-center">
                 <button id="sendMarketingEmailButton" class="action-button w-full mt-6" disabled>동의하고 결과 받기</button>
            </div>
            <div id="marketingEmailMessage" class="mt-2 text-center text-red-500 hidden"></div>
        </div>
    </div>

    <!-- Final Result Popup -->
    <div id="resultOverlay" class="modal-overlay">
        <div id="resultContent" class="modal-content" style="max-width: 800px;">
            <button id="resultCloseButton" class="modal-close-button">&times;</button>
            <div class="header">
                <h2 class="title text-3xl">팀 역량 진단 결과</h2>
                <p class="subtitle mt-2">우리 팀의 현재 역량 수준을 한눈에 확인하세요.</p>
            </div>
            <div class="md:grid md:grid-cols-2 md:gap-8">
                <div>
                    <div class="chart-container">
                        <canvas id="radarChart"></canvas>
                    </div>
                     <div class="my-4 flex justify-center space-x-4 text-sm text-gray-600 border p-2 rounded-lg bg-slate-50">
                        <div class="flex items-center"><span class="w-3 h-3 rounded-full bg-green-500 mr-2"></span>우수 (4.0 이상)</div>
                        <div class="flex items-center"><span class="w-3 h-3 rounded-full bg-gray-500 mr-2"></span>보통 (3.0-3.9)</div>
                        <div class="flex items-center"><span class="w-3 h-3 rounded-full bg-red-500 mr-2"></span>개선 필요 (3.0 미만)</div>
                    </div>
                     <div class="chart-details">
                        <!-- Detail items will be populated by JS -->
                     </div>
                </div>
                <div class="mt-8 md:mt-0 flex flex-col justify-center">
                    <div id="result-interpretation" class="bg-slate-50 p-6 rounded-lg border border-slate-200">
                         <p class="text-base text-slate-500 mb-2 font-semibold">종합 진단</p>
                         <p id="interpretation-text" class="text-lg text-slate-800 leading-relaxed"></p>
                    </div>
                    <button id="goToRecommenderButton" class="action-button w-full mt-6">맞춤 솔루션 추천받기 &rarr;</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Firebase SDKs and Logic -->
    <script type="module">
        import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
        import { getAuth, signInAnonymously, signInWithCustomToken } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
        import { getFirestore, addDoc, collection, serverTimestamp, setLogLevel } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

        // Default Firebase Configuration (for local testing)
        const defaultConfig = {
            apiKey: "AIzaSyCdNq4N7hU4C6BG1Yqs8yGv_6e5cBj7gDA",
            authDomain: "team-diagnostics-email-l-ac752.firebaseapp.com",
            projectId: "team-diagnostics-email-l-ac752",
            storageBucket: "team-diagnostics-email-l-ac752.firebasestorage.app",
            messagingSenderId: "413174244491",
            appId: "1:413174244491:web:1948fc8726a6c453bd608e"
        };
        
        // Use environment-provided config if available
        const firebaseConfig = typeof __firebase_config !== 'undefined'
            ? JSON.parse(__firebase_config)
            : defaultConfig;

        const appId = typeof __app_id !== 'undefined' ? __app_id : firebaseConfig.appId;

        let db, auth, userId;
        let finalResults = {};
        let myRadarChart = null;

        // Initialize Firebase
        async function initializeFirebaseAndAuth() {
            try {
                const app = initializeApp(firebaseConfig);
                db = getFirestore(app);
                auth = getAuth(app);
                const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;
                if (initialAuthToken) {
                    const userCredential = await signInWithCustomToken(auth, initialAuthToken);
                    userId = userCredential.user.uid;
                } else {
                    const userCredential = await signInAnonymously(auth);
                    userId = userCredential.user.uid;
                }
                console.log("Authenticated with userId:", userId);
            } catch (error) {
                console.error("Firebase initialization or authentication failed:", error);
            }
        }

        initializeFirebaseAndAuth();

        // --- DATA (Constants) ---
        const surveyCategories = {
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
        
        const PROBLEMS = {
            communication: [
                { id: 'inefficient_meetings', text: '회의가 길고 결론이 안 나요' },
                { id: 'dominant_speakers', text: '회의에서 특정 사람만 말해요' },
                { id: 'passive_team', text: '팀원들이 소극적이고 아이디어를 내지 않아요' },
                { id: 'feedback_issues', text: '보고나 피드백 방식에 문제가 있어요' }
            ],
            teamwork: [
                { id: 'silos', text: '부서 간 협업이 어렵고 이기주의가 있어요' },
                { id: 'conflict', text: '갈등 발생 시 건강하게 해결하지 못해요' },
                { id: 'onboarding_issues', text: '새로운 팀원이 조직에 적응하기 힘들어해요' },
                { id: 'horizontal_culture', text: '수평적인 조직문화를 만들고 싶어요' }
            ],
            leadership: [
                { id: 'poor_motivation', text: '리더들이 팀원들에게 동기부여를 잘 못해요' },
                { id: 'bad_performance_mgmt', text: '성과관리가 공정하지 않다고 느껴져요' },
                { id: 'one_on_one_issues', text: '1:1 면담이 형식적이고 효과가 없어요' },
                { id: 'leader_micromanagement', text: '리더가 실무에만 매몰되어 방향을 못 잡아요' }
            ],
            strategy: [
                { id: 'no_vision', text: '조직의 비전과 목표가 불명확해요' },
                { id: 'slow_execution', text: '결정은 느리고 실행력이 떨어져요' },
                { id: 'new_project_direction', text: '신사업/프로젝트 방향을 정하기 어려워요' },
            ]
        };

        const CATEGORY_NAMES = { communication: '회의/소통', teamwork: '팀워크/문화', leadership: '리더십/성과', strategy: '전략/방향성' };
        
        const PROGRAMS = {
             ft_foundation_3day: { title: "퍼실리테이션 파운데이션 3day", url: "https://liink.co.kr/education/facilitation.php?ptype=view&prdcode=2404020001&catcode=10000000", description: "그룹 소통의 가장 기본이 되는 필수 교육으로, 회의와 워크숍 진행의 핵심 스킬을 3일간 체계적으로 학습합니다.", case_title: "A사 '전사 회의 문화 개선' 프로젝트", case_content: "<strong class='text-gray-500'>[As-Is]</strong> 회의는 길어지고 소수만 발언하며, 결론 없이 끝나는 경우가 많았습니다.<br><strong class='text-[#d83968]'>[To-Be]</strong> 퍼실리테이션의 핵심 스킬을 체득한 후, 회의 시간이 40% 단축되고 모든 구성원이 적극적으로 아이디어를 내는 문화가 정착되었습니다." },
             ft_foundation_2day: { title: "퍼실리테이션 파운데이션 2day", url: "https://liink.co.kr/education/facilitation.php?ptype=view&prdcode=2404020004&catcode=10000000", description: "2일 과정으로 퍼실리테이션의 핵심 이론과 실습을 통해 회의 및 워크숍 진행 역량을 기릅니다.", case_title: "B사 '팀 리더 회의 역량' 강화", case_content: "<strong class='text-gray-500'>[As-Is]</strong> 팀 리더들이 회의를 주재했지만, 팀원들의 침묵과 방관적인 태도로 인해 실질적인 논의가 이루어지지 않았습니다.<br><strong class='text-[#d83968]'>[To-Be]</strong> 리더들이 질문, 경청, 시각화 등 퍼실리테이션 스킬을 습득하여 팀원들의 자발적인 참여를 이끌어냈습니다." },
             ft_foundation_1day: { title: "퍼실리테이션 파운데이션 1day", url: "https://liink.co.kr/education/facilitation.php?ptype=view&prdcode=2404020005&catcode=10000000", description: "하루 만에 퍼실리테이션의 핵심 개념을 압축적으로 배우고 싶은 분들을 위한 필수 교육입니다.", case_title: "C 스타트업 '전직원 기본기' 교육", case_content: "<strong class='text-gray-500'>[As-Is]</strong> 자유롭게 의견을 내는 문화를 원했지만, 실제로는 비효율적인 논의만 반복되었습니다.<br><strong class='text-[#d83968]'>[To-Be]</strong> 전 직원이 퍼실리테이션의 기본 원칙과 도구를 학습하여 효율적인 소통 시스템을 구축했습니다." },
             ft_agreement: { title: "합의의 모든 것(심화)", url: "https://liink.co.kr/education/facilitation.php?ptype=view&prdcode=2404020008&catcode=10000000", description: "의사결정이 어렵거나 갈등 상황에 놓였을 때, 모든 구성원이 동의하는 합의를 이끌어내는 심화 과정입니다.", case_title: "D사 '신규사업 TFT' 합의 워크숍", case_content: "<strong class='text-gray-500'>[As-Is]</strong> 신규 사업 방향성을 두고 여러 부서의 이해관계가 충돌하여 몇 달째 프로젝트가 공회전하고 있었습니다.<br><strong class='text-[#d83968]'>[To-Be]</strong> '합의의 모든 것' 심화 과정을 통해 모든 이해관계자가 동의하는 단일안을 도출했고, 강력한 실행 동력을 확보했습니다." },
             socio_intro: { title: "소시오크라시 소개과정", url: "https://liink.co.kr/education/sociocrash.php?ptype=view&prdcode=2404020011&catcode=11000000", description: "자기주도적이고 수평적인 조직 운영 방식인 소시오크라시의 기본 개념과 원리를 이해하는 입문 과정입니다.", case_title: "F스타트업 '수평조직' 도입 검토", case_content: "<strong class='text-gray-500'>[As-Is]</strong> 수평적인 조직으로의 전환을 꿈꿨지만, 어디서부터 어떻게 시작해야 할지 막막했습니다.<br><strong class='text-[#d83968]'>[To-Be]</strong> 소개 과정을 통해 경영진과 리더들이 수평적 조직 운영의 구체적인 원리와 방법을 이해하게 되었습니다." },
             socio_vision: { title: "팀단위 비전미션 수립", url: "https://liink.co.kr/education/sociocrash.php?ptype=view&prdcode=2404020014&catcode=11000000", description: "팀의 목표와 방향성을 멤버들과 함께 명확하게 설정하고 주인의식을 고취시키는 워크숍입니다.", case_title: "I공공기관 '신설팀' 비전 워크숍", case_content: "<strong class='text-gray-500'>[As-Is]</strong> 신설팀의 팀원들이 각자 다른 생각을 가지고 있어 팀의 정체성이 모호했습니다.<br><strong class='text-[#d83968]'>[To-Be]</strong> 팀원들이 직접 참여하여 팀의 비전과 미션을 함께 수립하는 과정을 통해 강력한 소속감과 주인의식을 갖게 되었습니다." },
             socio_decision: { title: "동의 의사결정과 회의 체계", url: "https://liink.co.kr/education/sociocrash.php?ptype=view&prdcode=2404020015&catcode=11000000", description: "만장일치가 아닌 '동의'기반의 빠르고 효과적인 의사결정 방법과 회의 체계를 학습합니다.", case_title: "G IT기업 '개발팀' 회의 방식 개선", case_content: "<strong class='text-gray-500'>[As-Is]</strong> 개발팀의 기술 회의가 끝없는 논쟁으로 이어져 의사결정이 계속 지연되었습니다.<br><strong class='text-[#d83968]'>[To-Be]</strong> '동의' 기반 의사결정 방식을 도입한 후, 회의 속도가 2배 이상 빨라지고 개발 일정 준수율이 크게 향상되었습니다." },
             socio_feedback: { title: "동료 피드백 제대로 하기", url: "https://liink.co.kr/education/sociocrash.php?ptype=view&prdcode=2404020016&catcode=11000000", description: "서로의 성장을 돕는 건강한 피드백 문화를 조직에 정착시키는 구체적인 방법을 배웁니다.", case_title: "H디자인 에이전시 '피드백 문화' 구축", case_content: "<strong class='text-gray-500'>[As-Is]</strong> 동료 간 피드백이 없거나, 형식적인 칭찬에 그쳐 성장에 도움이 되지 않았습니다.<br><strong class='text-[#d83968]'>[To-Be]</strong> 구체적인 피드백 스킬을 학습하여, 서로의 성과와 발전에 기여하는 건강한 피드백 문화를 구축했습니다." },
             leader_orgdev: { title: "팀장의 조직개발 리더십", url: "https://liink.co.kr/education/leadership.php?ptype=view&prdcode=2404020019&catcode=12000000", description: "팀의 잠재력을 파악하고 성과를 창출하는 조직개발 관점의 리더십 스킬을 학습합니다.", case_title: "J 대기업 '신임팀장' 리더십 교육", case_content: "<strong class='text-gray-500'>[As-Is]</strong> 신임 팀장들이 팀원 관리에 어려움을 느끼고 실무에만 매몰되었습니다.<br><strong class='text-[#d83968]'>[To-Be]</strong> 팀을 하나의 '조직'으로 보고 진단하고 개발하는 관점을 학습한 후, 팀의 몰입도와 성과를 모두 향상시켰습니다." },
             leader_perf: { title: "성장중심 성과관리 리더십", url: "https://liink.co.kr/education/leadership.php?ptype=view&prdcode=2404020020&catcode=12000000", description: "일방적 평가를 넘어, 구성원의 성장을 지원하고 동기를 부여하는 성과관리 방법을 배웁니다.", case_title: "K 게임회사 '리더십' 코칭 프로그램", case_content: "<strong class='text-gray-500'>[As-Is]</strong> 연말 성과평가가 형식적인 절차로 전락했고, 핵심 인재들의 불만이 높았습니다.<br><strong class='text-[#d83968]'>[To-Be]</strong> 상시적인 성과관리 방식으로 전환하여, 자발적인 동기부여를 이끌어내고 핵심 인재의 이탈률을 낮췄습니다." },
             leader_oneonone: { title: "원온원 리더십", url: "https://liink.co.kr/education/leadership.php?ptype=view&prdcode=2404020021&catcode=12000000", description: "구성원과 신뢰를 쌓고 성장을 지원하는 1:1 미팅의 구체적인 스킬과 노하우를 학습합니다.", case_title: "L 스타트업 '리더 그룹' 원온원 스킬 강화", case_content: "<strong class='text-gray-500'>[As-Is]</strong> 1:1 면담이 업무 현황 체크에 그치는 등 형식적으로 운영되었습니다.<br><strong class='text-[#d83968]'>[To-Be]</strong> 구체적인 스킬과 질문법을 학습하여, 팀원들의 숨은 고민을 해결하고 잠재력을 이끌어내는 시간으로 만들었습니다."},
             leader_conflict: { title: "갈등관리 리더십", url: "https://liink.co.kr/education/leadership.php?ptype=view&prdcode=2404020022&catcode=12000000", description: "팀 내외부의 갈등 상황을 지혜롭게 해결하고 건설적인 관계로 전환하는 방법을 배웁니다.", case_title: "M 제조기업 '생산-영업' 갈등 중재", case_content: "<strong class='text-gray-500'>[As-Is]</strong> 생산 부서와 영업 부서 간의 해묵은 갈등으로 인해 프로젝트 진행이 비효율적이었습니다.<br><strong class='text-[#d83968]'>[To-Be]</strong> 리더들이 갈등의 근본 원인을 진단하고 해결 방안을 모색하여, 갈등을 '성장의 기회'로 전환했습니다." },
             default: { title: "팀 시너지 워크숍", url: "https://liink.co.kr/", description: "팀의 소통과 협업에 문제가 있을 때, 신뢰를 바탕으로 팀워크를 강화하고 공동의 목표를 향해 나아가는 워크숍입니다.", case_title: "O사 '신규팀 빌딩' 워크숍", case_content: "<strong class='text-gray-500'>[As-Is]</strong> 신규 TF팀이 서먹한 분위기 속에서 소통이 단절되고 시너지가 나지 않았습니다.<br><strong class='text-[#d83968]'>[To-Be]</strong> 워크숍을 통해 서로의 강점과 업무 스타일을 이해하고 신뢰를 구축하여, 단기간 내에 강력한 원팀(One-Team)으로 거듭났습니다." }
        };
        
        const RECOMMENDATION_LOGIC = {
            inefficient_meetings: { ft_foundation_1day: 4, ft_foundation_2day: 3, socio_decision: 2 },
            dominant_speakers: { ft_foundation_2day: 3, leader_orgdev: 2 },
            passive_team: { ft_foundation_3day: 4, leader_oneonone: 3, leader_orgdev: 2 },
            feedback_issues: { socio_feedback: 4, leader_oneonone: 3 },
            silos: { leader_orgdev: 3, leader_conflict: 2, ft_agreement: 2 },
            conflict: { leader_conflict: 4, ft_agreement: 2 },
            onboarding_issues: { leader_orgdev: 3, default: 2 },
            horizontal_culture: { socio_intro: 4, leader_orgdev: 3 },
            poor_motivation: { leader_orgdev: 4, leader_perf: 3, leader_oneonone: 3 },
            bad_performance_mgmt: { leader_perf: 4, leader_oneonone: 2 },
            one_on_one_issues: { leader_oneonone: 4, socio_feedback: 2 },
            leader_micromanagement: { leader_orgdev: 3 },
            no_vision: { socio_vision: 4, default: 2 },
            slow_execution: { socio_decision: 4, ft_agreement: 2 },
            new_project_direction: { socio_vision: 3, ft_agreement: 2 }
        };

        const SURVEY_TO_PROBLEM_MAP = {
            Commitment: ['no_vision'],
            Communication: ['inefficient_meetings', 'dominant_speakers', 'passive_team'],
            Collaboration: ['silos', 'conflict'],
            Process: ['slow_execution', 'bad_performance_mgmt'],
            Trust: ['conflict', 'feedback_issues', 'horizontal_culture'],
            Growth: ['poor_motivation', 'one_on_one_issues', 'socio_feedback']
        };

        // --- DOM Elements ---
        const surveyContainer = document.getElementById('survey-container');
        const recommenderContainer = document.getElementById('recommender-container');
        // Survey elements
        const startScreen = document.getElementById('startScreen');
        const surveySection = document.getElementById('surveySection');
        const companySizeSelect = document.getElementById('company-size');
        const industryTypeSelect = document.getElementById('industry-type');
        const startSurveyButton = document.getElementById('startSurveyButton');
        const inputFieldsContainer = document.getElementById('input-fields');
        const showChartButton = document.getElementById('showChartButton');
        // Modal elements
        const emailConsentOverlay = document.getElementById('emailConsentOverlay');
        const resultOverlay = document.getElementById('resultOverlay');
        const marketingEmailInput = document.getElementById('marketingEmailInput');
        const marketingConsentCheckbox = document.getElementById('marketingConsentCheckbox');
        const sendMarketingEmailButton = document.getElementById('sendMarketingEmailButton');
        const resultCloseButton = document.getElementById('resultCloseButton');
        const goToRecommenderButton = document.getElementById('goToRecommenderButton');
        const interpretationText = document.getElementById('interpretation-text');
        const chartDetailsContainer = document.querySelector('.chart-details');

        let questionScores = {};
        
        // --- PART 1: SURVEY LOGIC ---
        function initializeSurvey() {
            let questionCounter = 1;
            Object.keys(surveyCategories).forEach(category => {
                surveyCategories[category].forEach((question, index) => {
                    const questionId = `${category}-${index}`;
                    questionScores[questionId] = 0;

                    const questionGroup = document.createElement('div');
                    questionGroup.className = 'question-group';
                    
                    const labelElem = document.createElement('label');
                    labelElem.className = 'question-label';
                    labelElem.textContent = `${questionCounter}. ${question}`;
                    questionGroup.appendChild(labelElem);
                    questionCounter++;

                    const likertContainer = document.createElement('div');
                    likertContainer.className = 'flex flex-col items-center';

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
                            updateSurveyUI();
                        };
                        likertScale.appendChild(button);
                    }
                    likertContainer.appendChild(likertScale);
                    
                    const likertGuideContainer = document.createElement('div');
                    likertGuideContainer.className = 'likert-guide-container w-full';
                    ["매우 그렇지 않다", "그렇지 않다", "보통이다", "그렇다", "매우 그렇다"].forEach(label => {
                        const guideDiv = document.createElement('div');
                        guideDiv.className = 'likert-guide';
                        guideDiv.textContent = label;
                        likertGuideContainer.appendChild(guideDiv);
                    });
                    likertContainer.appendChild(likertGuideContainer);
                    questionGroup.appendChild(likertContainer);
                    inputFieldsContainer.appendChild(questionGroup);
                });
            });
        }

        function checkStartConditions() {
            startSurveyButton.disabled = !(companySizeSelect.value !== "" && industryTypeSelect.value !== "");
        }

        function allQuestionsAnswered() {
            return Object.values(questionScores).every(score => score > 0);
        }

        function updateSurveyUI() {
            if (allQuestionsAnswered()) {
                showChartButton.disabled = false;
                showChartButton.textContent = "결과 분석하기";
            }
        }
        
        function calculateAverages() {
            const averageScores = {};
            Object.keys(surveyCategories).forEach(label => {
                const questions = surveyCategories[label];
                let sum = 0, count = 0;
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

        function renderChart(scores) {
            const radarCanvas = document.getElementById('radarChart');
            if (myRadarChart) {
                myRadarChart.destroy();
            }

            chartDetailsContainer.innerHTML = ''; // Clear previous details
            Object.keys(scores).forEach(label => {
                 const color = scores[label] < 3.0 ? '#ef4444' : (scores[label] >= 4.0 ? '#22c55e' : '#6b7280');
                 const itemHTML = `
                    <div class="detail-item">
                        <div class="detail-color-box" style="background-color: ${color};"></div>
                        <span>
                            <span class="font-bold">${label}:</span>
                            <span class="font-medium text-gray-700 ml-1">${scores[label].toFixed(1)}</span>
                        </span>
                    </div>
                 `;
                 chartDetailsContainer.innerHTML += itemHTML;
            });
            
            const data = {
                labels: Object.keys(scores),
                datasets: [{
                    label: 'Team Performance', data: Object.values(scores), fill: true,
                    backgroundColor: 'rgba(216, 57, 104, 0.2)', borderColor: 'rgb(216, 57, 104)',
                    pointBackgroundColor: 'rgb(216, 57, 104)', pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff', pointHoverBorderColor: 'rgb(216, 57, 104)'
                }]
            };

            const config = {
                type: 'radar', data: data,
                options: {
                    maintainAspectRatio: false,
                    elements: { line: { borderWidth: 3, tension: 0.2 } },
                    scales: {
                        r: {
                            angleLines: { color: 'rgba(150, 150, 150, 0.2)' },
                            grid: { color: 'rgba(150, 150, 150, 0.2)' },
                            pointLabels: { color: 'var(--text-body-color)', font: { size: 14, weight: '600', family: "'Pretendard'" } },
                            min: 0, // Set minimum value for the scale
                            max: 5, // Set maximum value for the scale
                            ticks: {
                                stepSize: 1,
                                backdropColor: 'transparent',
                                color: 'var(--text-muted-color)'
                            }
                        }
                    },
                    plugins: { legend: { display: false } }
                }
            };
            myRadarChart = new Chart(radarCanvas, config);
        }

        // --- PART 2: RECOMMENDER LOGIC ---
        let currentScreen = 'screen-1';

        function initializeProblems() {
            const container = document.getElementById('problem-categories');
            container.innerHTML = '';
            for (const [categoryKey, problems] of Object.entries(PROBLEMS)) {
                let categoryHtml = `
                    <div>
                        <h2 class="text-xl font-semibold text-gray-800 mb-4 border-b-2 border-gray-100 pb-3">${CATEGORY_NAMES[categoryKey]}</h2>
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                `;
                problems.forEach(problem => {
                    categoryHtml += `
                        <div>
                            <input type="checkbox" id="problem-${problem.id}" name="problems" value="${problem.id}" class="hidden custom-checkbox">
                            <label for="problem-${problem.id}" class="flex items-center text-center justify-center min-h-[80px] p-4 rounded-xl cursor-pointer transition-all duration-200 hover:bg-slate-50 hover:-translate-y-1">
                                <span class="font-medium text-gray-700">${problem.text}</span>
                            </label>
                        </div>
                    `;
                });
                categoryHtml += '</div></div>';
                container.innerHTML += categoryHtml;
            }
            
            document.querySelectorAll('input[name="problems"]').forEach(checkbox => {
                checkbox.addEventListener('change', () => {
                    const anyChecked = Array.from(document.querySelectorAll('input[name="problems"]')).some(c => c.checked);
                    document.getElementById('show-result-btn').disabled = !anyChecked;
                });
            });
        }
        
        function updateProgressBar(step) {
            const fill = document.getElementById('progress-bar-fill');
            const text = document.getElementById('progress-text');
            const stepEl = document.getElementById('progress-step');
            const texts = ['문제점 확인', '솔루션 제안'];
            
            stepEl.textContent = step;
            fill.style.width = `${(step / 2) * 100}%`;
            text.textContent = texts[step - 1];
        }

        function showScreen(screenId, step) {
            document.getElementById(currentScreen)?.classList.remove('active');
            const nextScreen = document.getElementById(screenId);
            nextScreen.classList.add('active');
            currentScreen = screenId;
            
            const progressContainer = document.getElementById('progress-container');
            if(screenId === 'screen-3' || screenId === 'screen-4') {
                progressContainer.style.display = 'none';
            } else {
                progressContainer.style.display = 'block';
            }

            if (step) updateProgressBar(step);

            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        
        function getSelectedProblems() {
            return Array.from(document.querySelectorAll('input[name="problems"]:checked')).map(cb => cb.value);
        }
        
        function getTopTwoRecommendations(selectedProblems) {
            const scores = {};
            selectedProblems.forEach(problemId => {
                const rules = RECOMMENDATION_LOGIC[problemId];
                if (rules) {
                    for (const [programKey, score] of Object.entries(rules)) {
                        scores[programKey] = (scores[programKey] || 0) + score;
                    }
                }
            });

            if (Object.keys(scores).length === 0) return ['default', 'leader_orgdev'];
            
            if (scores.ft_foundation_1day || scores.ft_foundation_2day || scores.ft_foundation_3day) {
                if (selectedProblems.length === 1 && selectedProblems.includes('inefficient_meetings')) {
                    delete scores.ft_foundation_2day;
                    delete scores.ft_foundation_3day;
                } else if(selectedProblems.length >= 2 && (selectedProblems.includes('inefficient_meetings') || selectedProblems.includes('passive_team') || selectedProblems.includes('dominant_speakers'))) {
                   delete scores.ft_foundation_1day;
                }
            }

            const sortedPrograms = Object.entries(scores).sort(([, scoreA], [, scoreB]) => scoreB - scoreA);
            const topTwo = sortedPrograms.slice(0, 2).map(([key]) => key);

            if (topTwo.length < 2) topTwo.push('default');
            if (topTwo.length > 1 && topTwo[0] === topTwo[1]) {
                topTwo[1] = sortedPrograms[2] ? sortedPrograms[2][0] : 'default';
            }
            
            return topTwo;
        }

        function showRecommendation() {
            const selected = getSelectedProblems();
            const [key1, key2] = getTopTwoRecommendations(selected);
            const program1 = PROGRAMS[key1];
            const program2 = PROGRAMS[key2];
            const reason = getRecommendationReason(finalResults.averageScores, true); // Get detailed reason for final recommendation
            const container = document.getElementById('recommendation-content');
            
            container.innerHTML = `
                <div class="bg-slate-50 p-6 rounded-lg border border-slate-200">
                    <p class="text-base text-slate-500 mb-2 font-semibold">핵심 문제 진단</p>
                    <p class="text-lg text-slate-800 leading-relaxed">${reason}</p>
                </div>
                <div class="grid md:grid-cols-2 gap-6">
                    <div class="flex flex-col">
                        <p class="text-sm text-gray-500 mb-2 font-semibold tracking-wider">RECOMMENDATION 1</p>
                        <div class="bg-white p-6 rounded-xl border border-slate-200 flex-1 flex flex-col justify-between shadow-sm">
                            <div>
                                <h2 class="text-2xl font-bold text-[#d83968] mb-3">${program1.title}</h2>
                                <p class="text-base text-gray-600 mb-4 leading-relaxed">${program1.description}</p>
                                <hr class="my-4" />
                                <h3 class="text-lg font-bold text-gray-800 mb-3">${program1.case_title}</h3>
                                <p class="text-base text-gray-700 leading-relaxed mb-4">${program1.case_content}</p>
                            </div>
                            <a href="${program1.url}" target="_blank" class="mt-4 inline-block bg-[#d83968] text-white font-bold py-3 px-5 rounded-lg hover:bg-[#c1325c] transition text-base text-center">프로그램 상세 보기 &rarr;</a>
                        </div>
                    </div>
                    <div class="flex flex-col">
                        <p class="text-sm text-gray-500 mb-2 font-semibold tracking-wider">RECOMMENDATION 2</p>
                        <div class="bg-white p-6 rounded-xl border border-slate-200 flex-1 flex flex-col justify-between shadow-sm">
                             <div>
                                <h2 class="text-2xl font-bold text-gray-700 mb-3">${program2.title}</h2>
                                <p class="text-base text-gray-600 mb-4 leading-relaxed">${program2.description}</p>
                                <hr class="my-4" />
                                <h3 class="text-lg font-bold text-gray-800 mb-3">${program2.case_title}</h3>
                                <p class="text-base text-gray-700 leading-relaxed mb-4">${program2.case_content}</p>
                            </div>
                            <a href="${program2.url}" target="_blank" class="mt-4 inline-block bg-gray-200 text-gray-800 font-bold py-3 px-5 rounded-lg hover:bg-gray-300 transition text-base text-center">프로그램 상세 보기 &rarr;</a>
                        </div>
                    </div>
                </div>
            `;
            showScreen('screen-2', 2);
        }

        // --- INTEGRATION LOGIC ---
        
        function getRecommendationReason(scores, isFinal = false) {
            const lowScoreThreshold = 3.0;
            const lowScoreCategories = Object.entries(scores)
                .filter(([, score]) => score < lowScoreThreshold)
                .map(([category]) => category);
            
            let insights = [];
            if (lowScoreCategories.includes('Communication') || lowScoreCategories.includes('Collaboration')) {
                 insights.push("팀원들 간의 <strong class='text-black'>'소통과 협업'</strong> 방식에 개선이 필요해 보입니다.");
            }
            if (lowScoreCategories.includes('Trust')) {
                insights.push("실패에 대한 두려움 없이 솔직한 의견을 나눌 수 있는 <strong class='text-black'>'심리적 안정감'</strong> 조성이 시급합니다.");
            }
            if (lowScoreCategories.includes('Growth') || lowScoreCategories.includes('Commitment')) {
                insights.push("구성원들의 <strong class='text-black'>'성장과 동기부여'</strong>를 위한 리더십과 명확한 목표 공유가 중요합니다.");
            }
             if (lowScoreCategories.includes('Process')) {
                insights.push("명확한 역할과 책임(R&R) 설정과 효율적인 <strong class='text-black'>'업무 프로세스'</strong> 정립이 필요합니다.");
            }

            if (insights.length === 0) {
                return "팀의 전반적인 역량이 안정적입니다. 현재 상태를 유지하고 더욱 발전시키기 위한 방안을 모색해볼 수 있습니다.";
            }

            if (isFinal) {
                return `진단 결과, ${insights.join(" 또한, ")} 이러한 문제들을 해결하기 위한 최적의 솔루션들을 아래에 제안합니다.`;
            }
            return insights.join(" ");
        }


        function preselectProblemsBasedOnSurvey(scores) {
            const lowScoreThreshold = 3.0; 
            let problemsToSelect = new Set();
            
            Object.entries(scores).forEach(([category, score]) => {
                if (score < lowScoreThreshold) {
                    const mappedProblems = SURVEY_TO_PROBLEM_MAP[category] || [];
                    mappedProblems.forEach(problemId => problemsToSelect.add(problemId));
                }
            });

            // Uncheck all first
            document.querySelectorAll('input[name="problems"]').forEach(cb => cb.checked = false);

            // Check relevant problems
            problemsToSelect.forEach(problemId => {
                const checkbox = document.getElementById(`problem-${problemId}`);
                if (checkbox) {
                    checkbox.checked = true;
                }
            });
            // Trigger change to update button state
            document.getElementById('show-result-btn').disabled = problemsToSelect.size === 0;
        }


        // --- Event Listeners ---
        document.addEventListener('DOMContentLoaded', () => {
            initializeSurvey();
            initializeProblems();
            updateProgressBar(1);
            window.showScreen = showScreen; // Make it globally accessible for inline onclick
            window.showRecommendation = showRecommendation;

            // Survey Start
            companySizeSelect.addEventListener('change', checkStartConditions);
            industryTypeSelect.addEventListener('change', checkStartConditions);
            startSurveyButton.addEventListener('click', () => {
                startScreen.classList.add('hidden');
                surveySection.classList.remove('hidden');
                surveySection.classList.add('flex');
            });

            // Survey -> Email Consent
            showChartButton.addEventListener('click', () => {
                 if (allQuestionsAnswered()) {
                    finalResults = {
                        companySize: companySizeSelect.value,
                        industryType: industryTypeSelect.value,
                        averageScores: calculateAverages(),
                        userId: userId,
                        timestamp: new Date().toISOString()
                    };
                    emailConsentOverlay.classList.add('visible');
                 }
            });

            // Email Consent -> Result Popup
            function checkMarketingConsent() {
                const emailValue = marketingEmailInput.value;
                const consentChecked = marketingConsentCheckbox.checked;
                sendMarketingEmailButton.disabled = !(emailValue.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/) && consentChecked);
            }
            marketingEmailInput.addEventListener('input', checkMarketingConsent);
            marketingConsentCheckbox.addEventListener('change', checkMarketingConsent);

            sendMarketingEmailButton.addEventListener('click', async () => {
                if (sendMarketingEmailButton.disabled || !db || !userId) {
                    const msg = document.getElementById('marketingEmailMessage');
                    msg.textContent = '인증 정보가 올바르지 않습니다. 페이지를 새로고침 후 다시 시도해주세요.';
                    msg.classList.remove('hidden');
                    return;
                }

                sendMarketingEmailButton.textContent = '저장 중...';
                sendMarketingEmailButton.disabled = true;

                try {
                    const docData = {
                        ...finalResults,
                        userEmail: marketingEmailInput.value,
                        consented_to_marketing: marketingConsentCheckbox.checked,
                        timestamp: serverTimestamp()
                    };
                    await addDoc(collection(db, `/artifacts/${appId}/public/data/survey_results`), docData);
                    
                    emailConsentOverlay.classList.remove('visible');
                    resultOverlay.classList.add('visible');
                    renderChart(finalResults.averageScores);
                    interpretationText.innerHTML = getRecommendationReason(finalResults.averageScores);

                } catch(e) {
                    console.error("Error saving to Firestore: ", e);
                    const msg = document.getElementById('marketingEmailMessage');
                    msg.textContent = '오류: 저장을 실패했습니다. 잠시 후 다시 시도해주세요.';
                    msg.classList.remove('hidden');
                    sendMarketingEmailButton.textContent = '동의하고 결과 받기';
                    sendMarketingEmailButton.disabled = false;
                }
            });

            // Result Popup -> Recommender
            goToRecommenderButton.addEventListener('click', () => {
                resultOverlay.classList.remove('visible');
                surveyContainer.classList.add('hidden');
                recommenderContainer.classList.remove('hidden');
                
                showScreen('screen-1', 1);
                preselectProblemsBasedOnSurvey(finalResults.averageScores);
            });
            
            resultCloseButton.addEventListener('click', () => resultOverlay.classList.remove('visible'));
            
            // Contact Form Submission
            document.getElementById('contact-form').addEventListener('submit', async function(e) {
                e.preventDefault();
                const errorEl = document.getElementById('contact-form-error');
                errorEl.classList.add('hidden');

                if (!db || !userId) {
                    errorEl.textContent = '인증 정보가 올바르지 않습니다. 페이지를 새로고침 후 다시 시도해주세요.';
                    errorEl.classList.remove('hidden');
                    return;
                }

                const selectedProblems = getSelectedProblems();
                const recommendations = getTopTwoRecommendations(selectedProblems).map(key => PROGRAMS[key].title);

                const contactInfo = {
                    company: document.getElementById('company').value,
                    name: document.getElementById('name').value,
                    phone: document.getElementById('phone').value,
                    email: document.getElementById('email').value,
                    requests: document.getElementById('requests').value,
                    selectedProblems: selectedProblems,
                    recommendations: recommendations,
                    surveyResults: finalResults.averageScores,
                    timestamp: serverTimestamp()
                };
                
                try {
                    await addDoc(collection(db, `/artifacts/${appId}/public/data/contact_inquiries`), contactInfo);
                    showScreen('screen-4');
                } catch (error) {
                    console.error("Error writing document: ", error);
                    errorEl.textContent = '제출에 실패했습니다. 잠시 후 다시 시도해주세요.';
                    errorEl.classList.remove('hidden');
                }
            });
        });
    </script>
</body>
</html>

