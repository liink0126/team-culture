/**
 * 조직 문제 진단 및 솔루션 추천 애플리케이션
 * 설문 결과를 바탕으로 자동으로 교육 프로그램을 추천합니다.
 */
document.addEventListener('DOMContentLoaded', () => {
    const App = {
        // ============================================
        // 설정 데이터
        // ============================================
        config: {
            googleScriptUrl: 'https://script.google.com/macros/s/AKfycbweAfOcmGi-HtO-6xMSY3aPZPbMbxfIrdTpMdM-UdfIjS6iddVeUYhjaNvIaDRkbQxu/exec',
            expertConsultationUrl: 'http://pf.kakao.com/_IakxkG/chat', // 카카오톡 상담 채팅 URL
            
            // 설문 카테고리 및 질문
            surveyCategories: {
                "Commitment": [
                    "나는 우리 팀의 업무 목표를 명확하게 알고 있다.",
                    "나는 일에서 의미와 보람을 느낀다.",
                    "우리 팀원들은 팀의 일에 헌신하고 있다.",
                    "나는 우리 팀에 소속되어 기여하는 것에 자부심을 느낀다."
                ],
                "Communication": [
                    "우리 팀은 자유롭게 의견을 잘 낸다.",
                    "업무에 관한 의사 결정에 나의 의견이 반영된다.",
                    "동료들과의 자유로운 대화 속에서 업무에 대한 영감을 얻을 때가 있다.",
                    "우리 팀의 의사결정은 전반적으로 합리적이다."
                ],
                "Collaboration": [
                    "나는 현재 동료들의 업무 진척현황을 구체적으로 알고 있다.",
                    "동료들이 나의 업무에 도움을 잘 준다.",
                    "팀 차원의 업무 지원과 협업이 잘 이루어진다."
                ],
                "Process": [
                    "우리 팀은 체계적인 업무계획에 따라 일한다.",
                    "나의 업무 중 모호하거나 낭비적인 요소가 거의 없다.",
                    "우리 팀은 R&R 배분이 잘 되고 있다."
                ],
                "Trust": [
                    "우리 팀은 환경 변화에 따라 업무 방식이나 과업의 목표를 적절히 조정한다.",
                    "우리 팀은 이례적인 실수로 나를 저평가하지 않는다.",
                    "우리 팀은 우려사항이나 이의를 제기하는 것에 불이익을 주지 않는다.",
                    "나에게 권한이 잘 위임된다."
                ],
                "Growth": [
                    "팀원들이 나의 업무개선을 위한 피드백을 제공한다.",
                    "나는 일을 통해 꾸준히 성장하고 있다고 생각한다.",
                    "우리 팀은 꾸준히 업무를 개선해 나간다."
                ],
                "Leadership": [
                    "우리 팀 리더(팀장, 파트장 등)는 도전적으로 일하며 성과를 창출한다.",
                    "우리 팀 리더(팀장, 파트장 등)는 제 때 필요한 의사결정을 적절하게 내려준다.",
                    "우리 팀 리더(팀장, 파트장 등)는 업무 점검 회의(예: 주간업무회의)를 효과적으로 진행한다.",
                    "우리 팀 리더(팀장, 파트장 등)는 업무지시 및 피드백이 구체적이다.",
                    "우리 팀 리더(팀장, 파트장 등)는 중장기 관점을 가지고 체계적으로 일한다."
                ]
            },
            
            // 설문 카테고리 → 문제점 매핑 (점수 3.0 미만일 때 자동 선택)
            surveyToProblemMap: {
                Commitment: ['no_vision', 'poor_motivation'],
                Communication: ['inefficient_meetings', 'dominant_speakers', 'passive_team'],
                Collaboration: ['silos', 'conflict'],
                Process: ['slow_execution', 'bad_performance_mgmt', 'leader_micromanagement'],
                Trust: ['conflict', 'feedback_issues', 'horizontal_culture', 'leader_micromanagement', 'one_on_one_issues'],
                Growth: ['poor_motivation', 'one_on_one_issues', 'socio_feedback'],
                Leadership: ['poor_motivation', 'bad_performance_mgmt', 'one_on_one_issues', 'leader_micromanagement']
            },
            
            // 문제점 → 프로그램 추천 로직 (점수 기반)
            recommendationLogic: {
                inefficient_meetings: { ft_foundation_1day: 4, ft_foundation_2day: 3, ft_running_basic: 3, socio_decision: 2 },
                dominant_speakers: { ft_foundation_2day: 3, ft_running_basic: 2, leader_orgdev: 2 },
                passive_team: { ft_foundation_3day: 4, leader_oneonone: 3, leader_orgdev: 2 },
                feedback_issues: { socio_feedback: 4, leader_oneonone: 3 },
                silos: { leader_orgdev: 3, leader_conflict: 2, ft_agreement: 2 },
                conflict: { leader_conflict: 4, ft_agreement: 2 },
                onboarding_issues: { leader_orgdev: 3, socio_vision: 2 },
                horizontal_culture: { socio_intro: 4, leader_orgdev: 3 },
                poor_motivation: { leader_orgdev: 4, leader_perf: 3, leader_oneonone: 3 },
                bad_performance_mgmt: { leader_perf: 4, leader_oneonone: 2 },
                one_on_one_issues: { leader_oneonone: 4, socio_feedback: 2 },
                leader_micromanagement: { leader_orgdev: 3 },
                no_vision: { socio_vision: 4, leader_orgdev: 2 },
                slow_execution: { socio_decision: 4, ft_agreement: 2 },
                new_project_direction: { socio_vision: 3, ft_agreement: 2 }
            },
            
            // 교육 프로그램 정보
            programs: {
                ft_foundation_3day: {
                    title: "퍼실리테이션 파운데이션 3day",
                    url: "https://liink.co.kr/education/facilitation.php?ptype=view&prdcode=2404020001&catcode=10000000",
                    description: "그룹 소통의 가장 기본이 되는 필수 교육으로, 회의와 워크숍 진행의 핵심 스킬을 3일간 체계적으로 학습합니다.",
                    case_title: "A사 '전사 회의 문화 개선' 프로젝트",
                    case_content: "<strong class='text-gray-500'>[As-Is]</strong> 회의는 길어지고 소수만 발언하며, 결론 없이 끝나는 경우가 많았습니다.<br><strong class='text-pink-600'>[To-Be]</strong> 퍼실리테이션의 핵심 스킬을 체득한 후, 회의 시간이 40% 단축되고 모든 구성원이 적극적으로 아이디어를 내는 문화가 정착되었습니다."
                },
                ft_foundation_2day: {
                    title: "퍼실리테이션 파운데이션 2day",
                    url: "https://liink.co.kr/education/facilitation.php?ptype=view&prdcode=2404020004&catcode=10000000",
                    description: "2일 과정으로 퍼실리테이션의 핵심 이론과 실습을 통해 회의 및 워크숍 진행 역량을 기릅니다.",
                    case_title: "B사 '팀 리더 회의 역량' 강화",
                    case_content: "<strong class='text-gray-500'>[As-Is]</strong> 팀 리더들이 회의를 주재했지만, 팀원들의 침묵과 방관적인 태도로 인해 실질적인 논의가 이루어지지 않았습니다.<br><strong class='text-pink-600'>[To-Be]</strong> 리더들이 질문, 경청, 시각화 등 퍼실리테이션 스킬을 습득하여 팀원들의 자발적인 참여를 이끌어냈습니다."
                },
                ft_foundation_1day: {
                    title: "퍼실리테이션 파운데이션 1day",
                    url: "https://liink.co.kr/education/facilitation.php?ptype=view&prdcode=2404020005&catcode=10000000",
                    description: "하루 만에 퍼실리테이션의 핵심 개념을 압축적으로 배우고 싶은 분들을 위한 필수 교육입니다.",
                    case_title: "C 스타트업 '전직원 기본기' 교육",
                    case_content: "<strong class='text-gray-500'>[As-Is]</strong> 자유롭게 의견을 내는 문화를 원했지만, 실제로는 비효율적인 논의만 반복되었습니다.<br><strong class='text-pink-600'>[To-Be]</strong> 전 직원이 퍼실리테이션의 기본 원칙과 도구를 학습하여 효율적인 소통 시스템을 구축했습니다."
                },
                ft_running_basic: {
                    title: "러닝 퍼실리테이션 (기본)",
                    url: "https://liink.co.kr/education/facilitation.php?ptype=view&prdcode=2404020008&catcode=10000000",
                    description: "실시간으로 진행되는 회의와 워크숍에서 즉시 활용할 수 있는 퍼실리테이션 기본 스킬을 학습합니다.",
                    case_title: "E사 '실시간 회의 개선' 프로젝트",
                    case_content: "<strong class='text-gray-500'>[As-Is]</strong> 회의 중 즉각적인 대응이 필요한 상황에서 효과적인 진행 방법을 몰라 어려움을 겪었습니다.<br><strong class='text-pink-600'>[To-Be]</strong> 러닝 퍼실리테이션 기본 과정을 통해 실시간으로 회의를 효과적으로 이끌어가는 스킬을 습득하여 회의 효율성이 크게 향상되었습니다."
                },
                ft_agreement: {
                    title: "합의의 모든 것(심화)",
                    url: "https://liink.co.kr/education/facilitation.php?ptype=view&prdcode=2404020006&catcode=10000000",
                    description: "의사결정이 어렵거나 갈등 상황에 놓였을 때, 모든 구성원이 동의하는 합의를 이끌어내는 심화 과정입니다.",
                    case_title: "D사 '신규사업 TFT' 합의 워크숍",
                    case_content: "<strong class='text-gray-500'>[As-Is]</strong> 신규 사업 방향성을 두고 여러 부서의 이해관계가 충돌하여 몇 달째 프로젝트가 공회전하고 있었습니다.<br><strong class='text-pink-600'>[To-Be]</strong> '합의의 모든 것' 심화 과정을 통해 모든 이해관계자가 동의하는 단일안을 도출했고, 강력한 실행 동력을 확보했습니다."
                },
                socio_intro: {
                    title: "소시오크라시 소개과정",
                    url: "https://liink.co.kr/education/sociocrash.php?ptype=view&prdcode=2404020011&catcode=11000000",
                    description: "자기주도적이고 수평적인 조직 운영 방식인 소시오크라시의 기본 개념과 원리를 이해하는 입문 과정입니다.",
                    case_title: "F스타트업 '수평조직' 도입 검토",
                    case_content: "<strong class='text-gray-500'>[As-Is]</strong> 수평적인 조직으로의 전환을 꿈꿨지만, 어디서부터 어떻게 시작해야 할지 막막했습니다.<br><strong class='text-pink-600'>[To-Be]</strong> 소개 과정을 통해 경영진과 리더들이 수평적 조직 운영의 구체적인 원리와 방법을 이해하게 되었습니다."
                },
                socio_vision: {
                    title: "팀단위 비전미션 수립",
                    url: "https://liink.co.kr/education/sociocrash.php?ptype=view&prdcode=2404020014&catcode=11000000",
                    description: "팀의 목표와 방향성을 멤버들과 함께 명확하게 설정하고 주인의식을 고취시키는 워크숍입니다.",
                    case_title: "I공공기관 '신설팀' 비전 워크숍",
                    case_content: "<strong class='text-gray-500'>[As-Is]</strong> 신설팀의 팀원들이 각자 다른 생각을 가지고 있어 팀의 정체성이 모호했습니다.<br><strong class='text-pink-600'>[To-Be]</strong> 팀원들이 직접 참여하여 팀의 비전과 미션을 함께 수립하는 과정을 통해 강력한 소속감과 주인의식을 갖게 되었습니다."
                },
                socio_decision: {
                    title: "동의 의사결정과 회의 체계",
                    url: "https://liink.co.kr/education/sociocrash.php?ptype=view&prdcode=2404020015&catcode=11000000",
                    description: "만장일치가 아닌 '동의'기반의 빠르고 효과적인 의사결정 방법과 회의 체계를 학습합니다.",
                    case_title: "G IT기업 '개발팀' 회의 방식 개선",
                    case_content: "<strong class='text-gray-500'>[As-Is]</strong> 개발팀의 기술 회의가 끝없는 논쟁으로 이어져 의사결정이 계속 지연되었습니다.<br><strong class='text-pink-600'>[To-Be]</strong> '동의' 기반 의사결정 방식을 도입한 후, 회의 속도가 2배 이상 빨라지고 개발 일정 준수율이 크게 향상되었습니다."
                },
                socio_feedback: {
                    title: "동료 피드백 제대로 하기",
                    url: "https://liink.co.kr/education/sociocrash.php?ptype=view&prdcode=2404020016&catcode=11000000",
                    description: "서로의 성장을 돕는 건강한 피드백 문화를 조직에 정착시키는 구체적인 방법을 배웁니다.",
                    case_title: "H디자인 에이전시 '피드백 문화' 구축",
                    case_content: "<strong class='text-gray-500'>[As-Is]</strong> 동료 간 피드백이 없거나, 형식적인 칭찬에 그쳐 성장에 도움이 되지 않았습니다.<br><strong class='text-pink-600'>[To-Be]</strong> 구체적인 피드백 스킬을 학습하여, 서로의 성과와 발전에 기여하는 건강한 피드백 문화를 구축했습니다."
                },
                leader_orgdev: {
                    title: "팀장의 조직개발 리더십",
                    url: "https://liink.co.kr/education/leadership.php?ptype=view&prdcode=2404020019&catcode=12000000",
                    description: "팀의 잠재력을 파악하고 성과를 창출하는 조직개발 관점의 리더십 스킬을 학습합니다.",
                    case_title: "J 대기업 '신임팀장' 리더십 교육",
                    case_content: "<strong class='text-gray-500'>[As-Is]</strong> 신임 팀장들이 팀원 관리에 어려움을 느끼고 실무에만 매몰되었습니다.<br><strong class='text-pink-600'>[To-Be]</strong> 팀을 하나의 '조직'으로 보고 진단하고 개발하는 관점을 학습한 후, 팀의 몰입도와 성과를 모두 향상시켰습니다."
                },
                leader_perf: {
                    title: "성장중심 성과관리 리더십",
                    url: "https://liink.co.kr/education/leadership.php?ptype=view&prdcode=2404020020&catcode=12000000",
                    description: "일방적 평가를 넘어, 구성원의 성장을 지원하고 동기를 부여하는 성과관리 방법을 배웁니다.",
                    case_title: "K 게임회사 '리더십' 코칭 프로그램",
                    case_content: "<strong class='text-gray-500'>[As-Is]</strong> 연말 성과평가가 형식적인 절차로 전락했고, 핵심 인재들의 불만이 높았습니다.<br><strong class='text-pink-600'>[To-Be]</strong> 상시적인 성과관리 방식으로 전환하여, 자발적인 동기부여를 이끌어내고 핵심 인재의 이탈률을 낮췄습니다."
                },
                leader_oneonone: {
                    title: "원온원 리더십",
                    url: "https://liink.co.kr/education/leadership.php?ptype=view&prdcode=2404020021&catcode=12000000",
                    description: "구성원과 신뢰를 쌓고 성장을 지원하는 1:1 미팅의 구체적인 스킬과 노하우를 학습합니다.",
                    case_title: "L 스타트업 '리더 그룹' 원온원 스킬 강화",
                    case_content: "<strong class='text-gray-500'>[As-Is]</strong> 1:1 면담이 업무 현황 체크에 그치는 등 형식적으로 운영되었습니다.<br><strong class='text-pink-600'>[To-Be]</strong> 구체적인 스킬과 질문법을 학습하여, 팀원들의 숨은 고민을 해결하고 잠재력을 이끌어내는 시간으로 만들었습니다."
                },
                leader_conflict: {
                    title: "갈등관리 리더십",
                    url: "https://liink.co.kr/education/leadership.php?ptype=view&prdcode=2404020022&catcode=12000000",
                    description: "팀 내외부의 갈등 상황을 지혜롭게 해결하고 건설적인 관계로 전환하는 방법을 배웁니다.",
                    case_title: "M 제조기업 '생산-영업' 갈등 중재",
                    case_content: "<strong class='text-gray-500'>[As-Is]</strong> 생산 부서와 영업 부서 간의 해묵은 갈등으로 인해 프로젝트 진행이 비효율적이었습니다.<br><strong class='text-pink-600'>[To-Be]</strong> 리더들이 갈등의 근본 원인을 진단하고 해결 방안을 모색하여, 갈등을 '성장의 기회'로 전환했습니다."
                }
            }
        },

        // ============================================
        // 애플리케이션 상태
        // ============================================
        state: {
            questionScores: {},
            finalResults: {},
            radarChart: null
        },

        // ============================================
        // DOM 요소 캐시
        // ============================================
        elements: {},

        // ============================================
        // 초기화
        // ============================================
        init() {
            this.cacheDomElements();
            this.bindEvents();
            this.render.surveyQuestions();
        },

        cacheDomElements() {
            this.elements = {
                surveyContainer: document.getElementById('survey-container'),
                startScreen: document.getElementById('startScreen'),
                surveySection: document.getElementById('surveySection'),
                companySizeSelect: document.getElementById('company-size'),
                industryTypeSelect: document.getElementById('industry-type'),
                startSurveyButton: document.getElementById('startSurveyButton'),
                inputFieldsContainer: document.getElementById('input-fields'),
                showResultButton: document.getElementById('showResultButton'),
                resultOverlay: document.getElementById('resultOverlay'),
                resultCloseButton: document.getElementById('resultCloseButton'),
                closeModalButton: document.getElementById('closeModalButton'),
                interpretationText: document.getElementById('interpretation-text'),
                chartDetailsContainer: document.querySelector('.chart-details'),
                radarCanvas: document.getElementById('radarChart')
            };
        },

        bindEvents() {
            this.elements.companySizeSelect.addEventListener('change', () => this.handlers.onStartConditionChange());
            this.elements.industryTypeSelect.addEventListener('change', () => this.handlers.onStartConditionChange());
            this.elements.startSurveyButton.addEventListener('click', () => this.handlers.onStartSurvey());
            this.elements.inputFieldsContainer.addEventListener('click', (e) => this.handlers.onLikertClick(e));
            this.elements.showResultButton.addEventListener('click', () => this.handlers.onShowResult());
            this.elements.resultCloseButton.addEventListener('click', () => this.utils.toggleModal(false));
            this.elements.closeModalButton.addEventListener('click', () => this.utils.toggleModal(false));
        },

        // ============================================
        // 이벤트 핸들러
        // ============================================
        handlers: {
            onStartConditionChange() {
                const { companySizeSelect, industryTypeSelect, startSurveyButton } = App.elements;
                startSurveyButton.disabled = !(companySizeSelect.value && industryTypeSelect.value);
            },

            onStartSurvey() {
                App.elements.startScreen.classList.add('hidden');
                App.elements.surveySection.classList.remove('hidden');
                App.elements.surveySection.classList.add('flex');
            },

            onLikertClick(e) {
                if (!e.target.classList.contains('likert-button')) return;
                
                const { questionId, value } = e.target.dataset;
                const parent = e.target.parentNode;
                
                // 같은 질문의 다른 버튼 선택 해제
                Array.from(parent.children).forEach(btn => btn.classList.remove('selected'));
                e.target.classList.add('selected');
                
                // 점수 저장
                App.state.questionScores[questionId] = parseInt(value, 10);
                App.utils.updateSurveyButtonState();
            },

            async onShowResult() {
                if (!App.utils.allQuestionsAnswered()) return;

                const button = App.elements.showResultButton;
                const originalText = button.innerHTML;
                
                try {
                    // 로딩 상태 표시
                    button.disabled = true;
                    button.innerHTML = `
                        <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        분석 중...
                    `;
                    
                    // 결과 계산
                    const averageScores = App.utils.calculateAverages();
                    App.state.finalResults = {
                        companySize: App.elements.companySizeSelect.value,
                        industryType: App.elements.industryTypeSelect.value,
                        averageScores: averageScores
                    };
                    
                    // 진단 결과 텍스트 생성
                    const diagnosisText = App.utils.getRecommendationReason(averageScores, true);
                    const diagnosisTextPlain = App.utils.stripHtmlTags(diagnosisText);
                    const problems = App.utils.getProblemsFromSurveyScores(averageScores);
                    
                    // 데이터 저장
                    const analyticsData = {
                        createdAt: new Date().toISOString(),
                        companySize: App.state.finalResults.companySize,
                        industryType: App.state.finalResults.industryType,
                        ...App.state.finalResults.averageScores,
                        // 진단 결과 추가
                        diagnosisText: diagnosisTextPlain, // HTML 태그 제거된 순수 텍스트
                        diagnosisTextHtml: diagnosisText, // HTML 포함 버전
                        problems: problems.join(', '), // 문제점 목록
                        problemCount: problems.length // 문제점 개수
                    };
                    
                    await App.utils.saveSurveyData(analyticsData, 'surveyAnalytics');
                    
                    // 결과 표시
                    App.render.resultChart(averageScores);
                    App.elements.interpretationText.innerHTML = App.utils.getRecommendationReason(averageScores, true);
                    App.utils.toggleModal(true);
                } catch (error) {
                    console.error("Error in onShowResult:", error);
                } finally {
                    button.disabled = false;
                    button.innerHTML = originalText;
                }
            },

            onExpertConsultation() {
                // 현재 진단 결과 데이터 준비
                const consultationData = {
                    companySize: App.state.finalResults.companySize,
                    industryType: App.state.finalResults.industryType,
                    averageScores: App.state.finalResults.averageScores,
                    problems: App.utils.getProblemsFromSurveyScores(App.state.finalResults.averageScores),
                    diagnosisSummary: App.utils.getRecommendationReason(App.state.finalResults.averageScores, true)
                };
                
                // 진단 결과를 localStorage에 저장 (문의 페이지에서 사용)
                localStorage.setItem('diagnosisResults', JSON.stringify(consultationData));
                
                // 문의하기 페이지로 이동
                const inquiryUrl = 'https://liink.co.kr/introduction/inquiry.php';
                const params = new URLSearchParams({
                    companySize: consultationData.companySize || '',
                    industryType: consultationData.industryType || '',
                    from: 'diagnosis' // 진단 페이지에서 온 것임을 표시
                });
                
                // 새 창(팝업)으로 열기 - 모달은 닫지 않음 (사용자가 진단 결과를 계속 볼 수 있도록)
                const popup = window.open(
                    `${inquiryUrl}?${params.toString()}`, 
                    'inquiryPopup',
                    'width=800,height=900,scrollbars=yes,resizable=yes'
                );
                
                // 팝업이 차단되었을 경우를 대비한 처리
                if (!popup || popup.closed || typeof popup.closed === 'undefined') {
                    // 팝업 차단된 경우 현재 창에서 열기
                    window.open(`${inquiryUrl}?${params.toString()}`, '_blank');
                }
                
                // 모달은 닫지 않음 - 사용자가 진단 결과를 계속 확인할 수 있도록
            }
        },

        // ============================================
        // 렌더링 함수
        // ============================================
        render: {
            surveyQuestions() {
                let questionCounter = 1;
                const fragment = document.createDocumentFragment();
                const likertLabels = ["매우 그렇지 않다", "그렇지 않다", "보통이다", "그렇다", "매우 그렇다"];
                
                Object.entries(App.config.surveyCategories).forEach(([category, questions]) => {
                    questions.forEach((question, index) => {
                        const questionId = `${category}-${index}`;
                        App.state.questionScores[questionId] = 0;
                        
                        const questionGroup = document.createElement('div');
                        questionGroup.className = 'question-group';
                        questionGroup.innerHTML = `
                            <label class="question-label">${questionCounter}. ${question}</label>
                            <div class="flex flex-col">
                                <div class="likert-scale w-full">
                                    ${[1, 2, 3, 4, 5].map(i => 
                                        `<button class="likert-button" data-question-id="${questionId}" data-value="${i}">${i}</button>`
                                    ).join('')}
                                </div>
                                <div class="likert-guide-container w-full">
                                    ${likertLabels.map(label => `<div class="likert-guide">${label}</div>`).join('')}
                                </div>
                            </div>
                        `;
                        fragment.appendChild(questionGroup);
                        questionCounter++;
                    });
                });
                
                App.elements.inputFieldsContainer.appendChild(fragment);
            },

            resultChart(scores) {
                // 기존 차트 제거
                if (App.state.radarChart) {
                    App.state.radarChart.destroy();
                }
                
                // 상세 점수 HTML 생성
                const detailsHtml = Object.keys(scores).map(label => {
                    const score = scores[label];
                    const color = score < 3.0 ? 'bg-red-500' : (score >= 4.0 ? 'bg-green-500' : 'bg-yellow-500');
                    return `
                        <div class="detail-item flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div class="flex items-center">
                                <div class="detail-color-box w-4 h-4 rounded-md ${color} mr-3"></div>
                                <span class="font-bold text-gray-700">${label}:</span>
                            </div>
                            <span class="font-bold text-lg text-gray-800">${score.toFixed(1)}</span>
                        </div>
                    `;
                }).join('');
                
                App.elements.chartDetailsContainer.innerHTML = detailsHtml;
                
                // 레이더 차트 생성
                App.state.radarChart = new Chart(App.elements.radarCanvas, {
                    type: 'radar',
                    data: {
                        labels: Object.keys(scores),
                        datasets: [{
                            label: 'Team Performance',
                            data: Object.values(scores),
                            fill: true,
                            backgroundColor: 'rgba(209, 58, 105, 0.2)',
                            borderColor: 'rgba(209, 58, 105, 1)',
                            pointBackgroundColor: 'rgba(209, 58, 105, 1)',
                            pointBorderColor: '#fff',
                            pointHoverBackgroundColor: '#fff',
                            pointHoverBorderColor: 'rgba(209, 58, 105, 1)'
                        }]
                    },
                    options: {
                        layout: { padding: 15 },
                        maintainAspectRatio: false,
                        elements: { line: { borderWidth: 2.5, tension: 0.2 } },
                        scales: {
                            r: {
                                angleLines: { color: 'rgba(0, 0, 0, 0.15)' },
                                grid: { color: 'rgba(0, 0, 0, 0.15)' },
                                pointLabels: {
                                    color: '#374151',
                                    font: { size: 14, weight: '700', family: "'Pretendard'" }
                                },
                                min: 0,
                                max: 5,
                                ticks: {
                                    stepSize: 1,
                                    backdropColor: 'transparent',
                                    color: '#6b7280',
                                    font: { size: 12 }
                                }
                            }
                        },
                        plugins: { legend: { display: false } }
                    }
                });
            },

        },

        // ============================================
        // 유틸리티 함수
        // ============================================
        utils: {
            /**
             * 모든 질문에 응답했는지 확인
             */
            allQuestionsAnswered() {
                return Object.values(App.state.questionScores).every(score => score > 0);
            },

            /**
             * 설문 버튼 상태 업데이트
             */
            updateSurveyButtonState() {
                if (this.allQuestionsAnswered()) {
                    App.elements.showResultButton.disabled = false;
                    App.elements.showResultButton.textContent = "결과 분석하기";
                }
            },

            /**
             * 카테고리별 평균 점수 계산
             * Leadership 점수는 Process-2(R&R)와 Trust-3(권한위임) 점수를 포함하여 계산
             */
            calculateAverages() {
                const averageScores = {};
                
                // 각 카테고리별 평균 계산
                Object.keys(App.config.surveyCategories).forEach(category => {
                    const questions = App.config.surveyCategories[category];
                    let sum = 0;
                    let count = 0;
                    
                    questions.forEach((q, index) => {
                        const score = App.state.questionScores[`${category}-${index}`];
                        if (score > 0) {
                            sum += score;
                            count++;
                        }
                    });
                    
                    averageScores[category] = count > 0 ? parseFloat((sum / count).toFixed(1)) : 0;
                });
                
                // Leadership 점수 특별 처리
                const rrScore = App.state.questionScores['Process-2'] || 0;
                const delegationScore = App.state.questionScores['Trust-3'] || 0;
                const leadershipScores = Object.entries(App.state.questionScores)
                    .filter(([key]) => key.startsWith('Leadership'))
                    .map(([, value]) => value);
                
                const adjustedLeadershipSum = 
                    leadershipScores.reduce((acc, val) => acc + val, 0) + 
                    rrScore + 
                    delegationScore;
                
                const adjustedLeadershipCount = 
                    leadershipScores.length + 
                    (rrScore > 0 ? 1 : 0) + 
                    (delegationScore > 0 ? 1 : 0);
                
                if (adjustedLeadershipCount > 0) {
                    averageScores['Leadership'] = parseFloat((adjustedLeadershipSum / adjustedLeadershipCount).toFixed(1));
                }
                
                return averageScores;
            },

            /**
             * 모달 표시/숨김 토글
             */
            toggleModal(visible) {
                App.elements.resultOverlay.classList.toggle('visible', visible);
            },

            /**
             * 설문 점수 기반으로 문제점 자동 추출
             * 점수가 3.0 미만인 카테고리의 문제점들을 반환
             */
            getProblemsFromSurveyScores(scores) {
                const problems = new Set();
                
                Object.entries(scores).forEach(([category, score]) => {
                    if (score < 3.0) {
                        const mappedProblems = App.config.surveyToProblemMap[category] || [];
                        mappedProblems.forEach(problemId => problems.add(problemId));
                    }
                });
                
                return Array.from(problems);
            },

            /**
             * 선택된 문제점들로부터 추천 프로그램 계산
             * 점수 기반 알고리즘 사용
             */
            getRecommendations(selectedProblems) {
                const programScores = {};
                
                // 각 문제점별로 프로그램 점수 합산
                selectedProblems.forEach(problemId => {
                    const rules = App.config.recommendationLogic[problemId];
                    if (rules) {
                        Object.entries(rules).forEach(([programKey, score]) => {
                            programScores[programKey] = (programScores[programKey] || 0) + score;
                        });
                    }
                });
                
                // ft_foundation 시리즈 중복 방지 로직
                if (programScores.ft_foundation_1day || programScores.ft_foundation_2day || programScores.ft_foundation_3day) {
                    if (selectedProblems.length === 1 && selectedProblems.includes('inefficient_meetings')) {
                        delete programScores.ft_foundation_2day;
                        delete programScores.ft_foundation_3day;
                    } else if (selectedProblems.length >= 2 && 
                               (selectedProblems.includes('inefficient_meetings') || 
                                selectedProblems.includes('passive_team') || 
                                selectedProblems.includes('dominant_speakers'))) {
                        delete programScores.ft_foundation_1day;
                    }
                }
                
                // 점수 순으로 정렬하여 상위 2개 선택
                const sortedPrograms = Object.entries(programScores)
                    .sort(([, scoreA], [, scoreB]) => scoreB - scoreA)
                    .slice(0, 2)
                    .map(([key]) => key);
                
                // 중복 제거 후 반환 (없으면 가장 일반적인 프로그램 추천)
                const uniqueRecommendations = [...new Set(sortedPrograms)];
                return uniqueRecommendations.length > 0 ? uniqueRecommendations : ['ft_foundation_2day', 'leader_orgdev'];
            },

            /**
             * 진단 결과에 대한 해석 텍스트 생성
             */
            getRecommendationReason(scores, isFinal = false) {
                const lowScoreCategories = Object.entries(scores)
                    .filter(([, score]) => score < 3.0)
                    .map(([category]) => category);
                
                const allCategories = Object.keys(scores);
                const highScoreCategories = Object.entries(scores)
                    .filter(([, score]) => score >= 4.0)
                    .map(([category]) => category);
                
                // 문제 영역별 상세 분석
                const problemDetails = [];
                const strengths = [];
                
                if (lowScoreCategories.includes('Leadership')) {
                    const leadershipScore = scores['Leadership'];
                    problemDetails.push({
                        category: '리더십',
                        severity: leadershipScore < 2.0 ? '매우 심각' : '심각',
                        issues: ['팀 성과 창출', '구성원 성장 지원', '의사결정', '업무 지시 및 피드백', '중장기 관점'],
                        specificIssues: [
                            '팀 리더가 도전적으로 일하며 성과를 창출하지 못하고 있으며',
                            '필요한 시점에 적절한 의사결정을 내리지 못하고',
                            '업무 지시와 피드백이 구체적이지 않으며',
                            '중장기 관점에서 체계적으로 일하지 못하는 상태'
                        ],
                        impact: '리더십 부재는 팀 전체의 동기부여와 성과에 직접적인 영향을 미치며, 구성원들의 업무 몰입도와 만족도를 크게 떨어뜨립니다.'
                    });
                }
                if (lowScoreCategories.includes('Communication') || lowScoreCategories.includes('Collaboration')) {
                    const commScore = scores['Communication'] || 5;
                    const collabScore = scores['Collaboration'] || 5;
                    const isVerySevere = commScore < 2.0 || collabScore < 2.0;
                    
                    let specificIssues = [];
                    if (commScore < 3.0) {
                        specificIssues.push('팀원들이 자유롭게 의견을 내지 못하고 있으며', '의사결정 과정에 참여하지 못하며', '합리적인 의사결정이 이루어지지 않는 상태');
                    }
                    if (collabScore < 3.0) {
                        specificIssues.push('동료들의 업무 진척 현황을 파악하지 못하고 있으며', '상호 간 업무 지원과 협업이 원활하지 않은 상태');
                    }
                    
                    problemDetails.push({
                        category: '소통과 협업',
                        severity: isVerySevere ? '매우 심각' : '심각',
                        issues: ['의견 개진', '의사결정 참여', '업무 진척 현황 공유', '상호 지원'],
                        specificIssues: specificIssues,
                        impact: '소통과 협업의 부재는 팀의 효율성을 크게 저하시키고 불필요한 오해와 갈등을 유발하며, 업무 진행 속도와 품질에 부정적인 영향을 미칩니다.'
                    });
                }
                if (lowScoreCategories.includes('Trust')) {
                    const trustScore = scores['Trust'];
                    problemDetails.push({
                        category: '신뢰',
                        severity: trustScore < 2.0 ? '매우 심각' : '심각',
                        issues: ['심리적 안정감', '권한 위임', '우려사항 제기'],
                        specificIssues: [
                            '팀원들이 실패에 대한 두려움 없이 솔직한 의견을 나누지 못하고 있으며',
                            '권한이 제대로 위임되지 않아 업무 효율성이 떨어지며',
                            '우려사항이나 이의를 제기하는 것에 대한 불이익을 걱정하는 분위기'
                        ],
                        impact: '신뢰 부족은 팀원들이 솔직한 피드백을 주고받지 못하게 하여 문제 해결을 어렵게 만들고, 창의적이고 혁신적인 아이디어가 나오지 못하게 합니다.'
                    });
                }
                if (lowScoreCategories.includes('Growth') || lowScoreCategories.includes('Commitment')) {
                    const growthScore = scores['Growth'] || 5;
                    const commitmentScore = scores['Commitment'] || 5;
                    const isVerySevere = growthScore < 2.0 || commitmentScore < 2.0;
                    
                    let specificIssues = [];
                    if (commitmentScore < 3.0) {
                        specificIssues.push('팀원들이 업무 목표를 명확히 인지하지 못하고 있거나', '일에서 의미와 보람을 느끼지 못하며', '팀에 대한 소속감과 자부심이 부족한 상태');
                    }
                    if (growthScore < 3.0) {
                        specificIssues.push('구성원들이 자신의 성장 기회를 충분히 얻지 못하고 있으며', '동료로부터의 피드백이 부족하고', '업무를 통해 지속적으로 발전하고 있다는 인식이 낮은 상태');
                    }
                    
                    problemDetails.push({
                        category: '성장과 몰입',
                        severity: isVerySevere ? '매우 심각' : '심각',
                        issues: ['목표 명확성', '일의 의미와 보람', '성장 기회', '팀 소속감'],
                        specificIssues: specificIssues,
                        impact: '성장과 몰입 부족은 장기적으로 인재 이탈과 조직 역량 저하로 이어질 수 있으며, 팀원들의 업무 동기와 헌신도가 지속적으로 하락할 위험이 있습니다.'
                    });
                }
                if (lowScoreCategories.includes('Process')) {
                    const processScore = scores['Process'];
                    problemDetails.push({
                        category: '프로세스',
                        severity: processScore < 2.0 ? '매우 심각' : '심각',
                        issues: ['역할과 책임(R&R)', '업무 프로세스', '업무 지시 명확성'],
                        specificIssues: [
                            '팀 내 역할과 책임이 명확하지 않아 업무 중복이나 공백이 발생하고 있으며',
                            '효율적인 업무 프로세스가 정립되지 않아 업무 진행이 비체계적이며',
                            '업무 지시가 모호하여 실행 과정에서 혼란이 발생하는 상태'
                        ],
                        impact: '프로세스의 불명확함은 업무 효율성을 떨어뜨리고 중복 업무와 책임 회피를 야기하며, 팀 전체의 생산성과 품질에 부정적인 영향을 미칩니다.'
                    });
                }
                
                // 강점 영역 파악
                if (highScoreCategories.length > 0) {
                    strengths.push(...highScoreCategories);
                }
                
                // 종합 진단 텍스트 생성
                if (problemDetails.length === 0) {
                    return "팀의 전반적인 역량이 안정적으로 유지되고 있습니다. 현재 상태를 기반으로 더욱 발전시키기 위한 방안을 모색해볼 수 있습니다. 전문가와 함께 팀의 강점을 더욱 강화하고 다음 단계 성장을 위한 전략을 수립해보시기 바랍니다.";
                }
                
                if (isFinal) {
                    let diagnosisText = `진단 결과, 총 <strong class='text-gray-900'>${problemDetails.length}개 영역</strong>에서 개선이 필요합니다. `;
                    
                    // 각 문제 영역별 상세 설명
                    problemDetails.forEach((problem, index) => {
                        if (index === 0) {
                            // 첫 번째 문제 영역 (주요 문제) - 가장 상세하게
                            diagnosisText += `<strong class='text-gray-900'>${problem.category}</strong> 영역이 ${problem.severity}한 수준으로 나타났습니다. `;
                            if (problem.specificIssues && problem.specificIssues.length > 0) {
                                diagnosisText += `구체적으로 ${problem.specificIssues.join(', ')}로 보입니다. `;
                            } else {
                                diagnosisText += `구체적으로 ${problem.issues.slice(0, 3).join(', ')}${problem.issues.length > 3 ? ' 등' : ''}의 부분에서 문제가 추정됩니다. `;
                            }
                            diagnosisText += `${problem.impact} `;
                        } else if (index === 1) {
                            // 두 번째 문제 영역 - 상세하게
                            diagnosisText += `또한 <strong class='text-gray-900'>${problem.category}</strong> 영역에서도 ${problem.severity}한 수준의 문제가 발견되었습니다. `;
                            if (problem.specificIssues && problem.specificIssues.length > 0) {
                                diagnosisText += `${problem.specificIssues.slice(0, 2).join(', ')}로 나타나고 있습니다. `;
                            } else {
                                diagnosisText += `${problem.issues.slice(0, 2).join(', ')} 등의 부분에서 개선이 필요합니다. `;
                            }
                            diagnosisText += `${problem.impact} `;
                        } else {
                            // 세 번째 이상 문제 영역 - 간략히
                            diagnosisText += `<strong class='text-gray-900'>${problem.category}</strong> 영역에서도 ${problem.severity}한 수준의 문제가 있어 개선이 필요합니다. `;
                        }
                    });
                    
                    // 강점이 있는 경우
                    if (strengths.length > 0) {
                        const strengthNames = {
                            'Leadership': '리더십',
                            'Communication': '소통',
                            'Collaboration': '협업',
                            'Trust': '신뢰',
                            'Growth': '성장',
                            'Commitment': '몰입',
                            'Process': '프로세스'
                        };
                        const strengthKor = strengths.map(s => strengthNames[s] || s).join(', ');
                        diagnosisText += `다만 <strong class='text-gray-900'>${strengthKor}</strong> 영역은 상대적으로 양호한 상태로, 이 부분을 기반으로 다른 영역의 개선을 추진할 수 있습니다. `;
                    }
                    
                    // 마무리
                    diagnosisText += `이러한 문제들을 해결하기 위해서는 조직의 맥락과 복잡성을 고려한 맞춤형 접근이 필요합니다. 전문가와 함께 심층 상담을 통해 구체적인 해결 방안을 모색해보시기 바랍니다.`;
                    
                    return diagnosisText;
                }
                
                // 간단한 버전 (모달에서 사용하지 않음)
                return problemDetails.map(p => `${p.category} 영역에서 개선이 필요합니다.`).join(" ");
            },

            /**
             * HTML 태그 제거 (순수 텍스트 추출)
             */
            stripHtmlTags(html) {
                const tmp = document.createElement('div');
                tmp.innerHTML = html;
                return tmp.textContent || tmp.innerText || '';
            },

            /**
             * 설문 데이터를 Google Sheets에 저장
             */
            async saveSurveyData(data, sheetName) {
                const GOOGLE_SCRIPT_URL = App.config.googleScriptUrl;
                
                if (!GOOGLE_SCRIPT_URL || GOOGLE_SCRIPT_URL === 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE') {
                    console.warn("Google Apps Script URL is not set. Data will not be saved to Google Sheets.");
                    return `local-${Date.now()}`;
                }
                
                const payload = { ...data, sheetName: sheetName };
                
                try {
                    const response = await fetch(GOOGLE_SCRIPT_URL, {
                        method: 'POST',
                        redirect: "follow",
                        headers: { "Content-Type": "text/plain;charset=UTF-8" },
                        body: JSON.stringify(payload)
                    });
                    
                    if (!response.ok && response.type !== 'opaque') {
                        throw new Error(`Network response was not ok. Status: ${response.status}`);
                    }
                    
                    if (response.type === 'opaque') {
                        console.log(`Data sent to Google Sheet '${sheetName}' (opaque response).`);
                        return `g-sheet-${Date.now()}`;
                    }
                    
                    const result = await response.json();
                    if (result.status === "success") {
                        console.log(`Data successfully saved to Google Sheet '${sheetName}'.`);
                        return `g-sheet-${Date.now()}`;
                    } else {
                        throw new Error(result.message);
                    }
                } catch (e) {
                    console.error(`Error sending data to Google Sheet '${sheetName}': `, e.message);
                    alert(`Google Sheet 저장 오류: ${e.message}\n\n[문제 해결 가이드]\n1. Google Sheet의 시트 이름과 헤더가 안내서와 정확히 일치하는지 확인하세요.\n2. Apps Script를 수정한 경우, 반드시 '배포 관리 > 새 버전'으로 다시 배포했는지 확인하세요.\n3. Apps Script 배포 시 '액세스 권한'이 '모든 사용자'로 설정되었는지 확인하세요.`);
                    throw e;
                }
            }
        }
    };
    
    App.init();
});
