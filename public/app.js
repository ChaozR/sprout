/* ==========================================================================
   2026 예술꽃 새싹학교 (바둑) 안내 웹사이트 - 스크립트
   기능: 모바일 토글, 이메일 복사, 토스트 알림, FAQ 아코디언
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // 1. 모바일 메뉴 토글 기능
    const mobileToggle = document.getElementById('mobileToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            
            // 아이콘 변경 (bars <-> xmark)
            const icon = mobileToggle.querySelector('i');
            if (navMenu.classList.contains('active')) {
                icon.className = 'fa-solid fa-xmark';
                mobileToggle.setAttribute('aria-label', '메뉴 닫기');
            } else {
                icon.className = 'fa-solid fa-bars';
                mobileToggle.setAttribute('aria-label', '메뉴 열기');
            }
        });

        // 링크 클릭 시 자동으로 메뉴 닫기
        const navLinks = navMenu.querySelectorAll('.nav-link, .btn');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                const icon = mobileToggle.querySelector('i');
                icon.className = 'fa-solid fa-bars';
                mobileToggle.setAttribute('aria-label', '메뉴 열기');
            });
        });
    }

    // 2. 이메일 클립보드 복사 및 토스트 기능
    const btnCopyEmail = document.getElementById('btnCopyEmail');
    const emailAddr = document.getElementById('emailAddr');
    const toast = document.getElementById('toast');

    if (btnCopyEmail && emailAddr && toast) {
        btnCopyEmail.addEventListener('click', () => {
            const textToCopy = emailAddr.textContent;
            
            // Clipboard API 사용
            if (navigator.clipboard && window.isSecureContext) {
                navigator.clipboard.writeText(textToCopy)
                    .then(() => showToast())
                    .catch(err => {
                        console.error('클립보드 복사 실패: ', err);
                        fallbackCopyText(textToCopy);
                    });
            } else {
                // 구형 브라우저 대체 기법
                fallbackCopyText(textToCopy);
            }
        });
    }

    // 구형 브라우저 복사 대체 처리
    function fallbackCopyText(text) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed'; // 화면 밖으로 배치
        textArea.style.left = '-9999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
            document.execCommand('copy');
            showToast();
        } catch (err) {
            console.error('대체 복사 기법도 실패: ', err);
        }
        document.body.removeChild(textArea);
    }

    // 토스트 알림 제어
    let toastTimeout;
    function showToast() {
        // 이미 켜져있는 타이머 초기화
        clearTimeout(toastTimeout);
        
        toast.classList.add('show');
        
        // 2.5초 후 제거
        toastTimeout = setTimeout(() => {
            toast.classList.remove('show');
        }, 2500);
    }

    // 3. FAQ 아코디언 애니메이션
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const item = question.parentElement;
            const answer = item.querySelector('.faq-answer');
            const isActive = item.classList.contains('active');
            
            // 다른 활성화된 아코디언 닫기
            document.querySelectorAll('.faq-item').forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                    otherItem.querySelector('.faq-answer').style.maxHeight = null;
                }
            });

            // 현재 아코디언 토글
            if (!isActive) {
                item.classList.add('active');
                answer.style.maxHeight = answer.scrollHeight + 'px';
            } else {
                item.classList.remove('active');
                answer.style.maxHeight = null;
            }
        });
    });

    // 4. 스크롤 시 헤더 그림자 처리
    const header = document.querySelector('.main-header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 10) {
                header.style.boxShadow = '0 10px 30px -10px rgba(78, 138, 84, 0.12)';
                header.style.backgroundColor = 'rgba(253, 253, 251, 0.95)';
            } else {
                header.style.boxShadow = 'var(--shadow-sm)';
                header.style.backgroundColor = 'rgba(253, 253, 251, 0.85)';
            }
        });
    }

    // 5. 교통비 모달 팝업 기능
    const trafficModal = document.getElementById('traffic-modal');
    const openTrafficModalBtn = document.getElementById('open-traffic-modal');
    const closeTrafficModalBtn = document.getElementById('close-traffic-modal');

    if (trafficModal && openTrafficModalBtn && closeTrafficModalBtn) {
        openTrafficModalBtn.addEventListener('click', () => {
            trafficModal.classList.add('active');
            document.body.style.overflow = 'hidden'; // 배경 스크롤 차단
        });

        const closeModal = () => {
            trafficModal.classList.remove('active');
            document.body.style.overflow = ''; // 스크롤 복구
        };

        closeTrafficModalBtn.addEventListener('click', closeModal);

        // 바깥 어두운 배경 클릭 시 닫기
        trafficModal.addEventListener('click', (e) => {
            if (e.target === trafficModal) {
                closeModal();
            }
        });

        // ESC 키로 닫기
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && trafficModal.classList.contains('active')) {
                closeModal();
            }
        });
    }
});
