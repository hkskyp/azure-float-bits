document.addEventListener('DOMContentLoaded', function() {
    const floatInput = document.getElementById('floatInput');
    const precisionSelect = document.getElementById('precision');
    const convertBtn = document.getElementById('convertBtn');
    const loading = document.getElementById('loading');
    const result = document.getElementById('result');
    const error = document.getElementById('error');
    const inputInfo = document.getElementById('inputInfo');
    const bitDisplay = document.getElementById('bitDisplay');
    const bitExplanation = document.getElementById('bitExplanation');
    const exampleBtns = document.querySelectorAll('.example-btn');

    // 예시 버튼 이벤트
    exampleBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const value = this.dataset.value;
            floatInput.value = value;
            convertFloat();
        });
    });

    // 변환 버튼 이벤트
    convertBtn.addEventListener('click', convertFloat);

    // 엔터 키 이벤트
    floatInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            convertFloat();
        }
    });

    async function convertFloat() {
        const inputValue = floatInput.value.trim();
        const precision = precisionSelect.value;

        if (!inputValue) {
            showError('실수를 입력해주세요.');
            return;
        }

        hideElements();
        loading.style.display = 'block';

        try {
            const response = await fetch('/api/convert_float', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    value: inputValue,
                    precision: parseInt(precision)
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || '변환 중 오류가 발생했습니다.');
            }

            displayResult(data);
        } catch (err) {
            showError(err.message);
        } finally {
            loading.style.display = 'none';
        }
    }

    function displayResult(data) {
        inputInfo.innerHTML = `
            <strong>입력값:</strong> ${data.original_value}<br>
            <strong>정밀도:</strong> ${data.precision}비트<br>
            <strong>실제 저장된 값:</strong> ${data.stored_value}
        `;

        if (data.precision === 32) {
            displayFloatBits(data);
        } else {
            displayDoubleBits(data);
        }

        bitExplanation.innerHTML = `
            <h4>IEEE 754 표준 설명:</h4>
            <p><strong>부호 비트:</strong> ${data.sign_bit === '0' ? '양수' : '음수'}</p>
            <p><strong>지수 부분:</strong> ${data.exponent_explanation}</p>
            <p><strong>가수 부분:</strong> ${data.mantissa_explanation}</p>
        `;

        result.style.display = 'block';
    }

    function displayFloatBits(data) {
        bitDisplay.innerHTML = `
            <div class="bit-section">
                <div class="bit-label">부호 (Sign) - 1비트</div>
                <div class="bits sign-bit">${data.sign_bit}</div>
            </div>
            <div class="bit-section">
                <div class="bit-label">지수 (Exponent) - 8비트</div>
                <div class="bits exponent-bits">${data.exponent_bits}</div>
            </div>
            <div class="bit-section">
                <div class="bit-label">가수 (Mantissa) - 23비트</div>
                <div class="bits mantissa-bits">${data.mantissa_bits}</div>
            </div>
            <div class="bit-section">
                <div class="bit-label">전체 32비트</div>
                <div class="bits">${data.all_bits}</div>
            </div>
        `;
    }

    function displayDoubleBits(data) {
        bitDisplay.innerHTML = `
            <div class="bit-section">
                <div class="bit-label">부호 (Sign) - 1비트</div>
                <div class="bits sign-bit">${data.sign_bit}</div>
            </div>
            <div class="bit-section">
                <div class="bit-label">지수 (Exponent) - 11비트</div>
                <div class="bits exponent-bits">${data.exponent_bits}</div>
            </div>
            <div class="bit-section">
                <div class="bit-label">가수 (Mantissa) - 52비트</div>
                <div class="bits mantissa-bits">${data.mantissa_bits}</div>
            </div>
            <div class="bit-section">
                <div class="bit-label">전체 64비트</div>
                <div class="bits">${data.all_bits}</div>
            </div>
        `;
    }

    function showError(message) {
        error.textContent = message;
        error.style.display = 'block';
        result.style.display = 'none';
    }

    function hideElements() {
        error.style.display = 'none';
        result.style.display = 'none';
    }
});