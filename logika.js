const CONSTRAINT_COLORS = [
    'rgba(255, 0, 0)',      // красный
    'rgba(0, 0, 255)',      // синий  
    'rgba(255, 128, 0)',    // оранжевый
    'rgba(0, 128, 0)',      // зеленый
    'rgba(128, 0, 255)',    // фиолетовый
    'rgba(255, 0, 255)',    // розовый
    'rgba(0, 255, 255)',    // бирюзовый
    'rgba(128, 128, 0)',    // оливковый
    'rgba(128, 0, 0)',      // бордовый
    'rgba(0, 128, 128)'     // морской волны
];

// Функция добавления нового ограничения
function addConstraint() {
    const container = document.getElementById('constraints-container');
    const currentCount = container.children.length;
    
    if (currentCount >= MAX_CONSTRAINTS) {
        alert(`Максимум ${MAX_CONSTRAINTS} ограничений`);
        return;
    }
    
    const newIndex = currentCount;
    const newRow = document.createElement('div');
    newRow.className = 'constraint-row';
    newRow.innerHTML = `
        <input type="number" class="coeff-a" value="1">x1 + 
        <input type="number" class="coeff-b" value="1">x2 
         <select class="sign-select">
            <option value="<="><=</option>
            <option value=">=">>=</option>
        </select>
        <input type="number" class="coeff-c" value="5">
        <button class="btn-remove-constraint" onclick="removeConstraint(this)">×</button>
    `;
    
    container.appendChild(newRow);
    updateConstraintsCounter();
    updateRemoveButtons();
}

// Функция удаления ограничения
function removeConstraint(button) {
    const container = document.getElementById('constraints-container');
    if (container.children.length <= 1) {
        alert('Должно быть хотя бы одно ограничение');
        return;
    }
    
    const row = button.closest('.constraint-row');
    container.removeChild(row);
    updateConstraintsCounter();
    updateRemoveButtons();
}

// Обновление счетчика ограничений
function updateConstraintsCounter() {
    const counter = document.getElementById('constraints-counter');
    const currentCount = document.getElementById('constraints-container').children.length;
    counter.textContent = `(${currentCount}/${MAX_CONSTRAINTS} ограничений)`;
}

// Обновление видимости кнопок удаления
function updateRemoveButtons() {
    const removeButtons = document.querySelectorAll('.btn-remove-constraint');
    const shouldShow = document.getElementById('constraints-container').children.length > 1;
    removeButtons.forEach(btn => btn.style.display = shouldShow ? 'block' : 'none');
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('btn-add-constraint').addEventListener('click', addConstraint);
    updateConstraintsCounter();
    updateRemoveButtons();
});

let optimalPoint = null;
        let optimizationType = 'max';

        function findIntersection(a1, b1, c1, a2, b2, c2) {
        const determinant = a1 * b2 - a2 * b1;
        if (Math.abs(determinant) < 0.0001) {
            return null;
        }
        const x = (c1 * b2 - c2 * b1) / determinant;
        const y = (a1 * c2 - a2 * c1) / determinant;
        return { x: x, y: y };
        }

        function isPointFeasible(point, constraints) {
            for (const constraint of constraints) {
                const value = constraint.a * point.x + constraint.b * point.y;
                
                if (constraint.sign === '<=' && value > constraint.eq + 0.001) {
                    return false;
                }
                if (constraint.sign === '>=' && value < constraint.eq - 0.001) {
                    return false;
                }
            }
            return true;
        }

        function calculateOptimalVector(c1, c2) {
            // Функция для вычисления наибольшего общего делителя (НОД)
            function gcd(a, b) {
                a = Math.abs(a);
                b = Math.abs(b);
                if (b === 0) return a;
                return gcd(b, a % b);
            }
            // 1. Нахождение НОД коэффициентов
            const divisor = gcd(c1, c2);
            
            // 2. Масштабирование до минимальных целых чисел
            let x = c1 / divisor;
            let y = c2 / divisor;
            
            // 3. Проверка длины вектора
            const length = Math.sqrt(x * x + y * y);
            const maxComfortableLength = 15; // Оптимальная длина для графика
            
            if (length > maxComfortableLength) {
                const scale = maxComfortableLength / length;
                x = x * scale;
                y = y * scale;
            }
            
            return { x: x, y: y };
        }

        let myChart;

        // Основные элементы
        const title6 = document.getElementById('title6');
        const title7 = document.getElementById('title7');
        const dang = document.getElementById('dang');
        const xValues = [];
        const yValues4 = [];

        // Новые глобальные массивы для графиков
        let allDatasets = [];
        let currentConstraints = [];

        // Максимальное количество ограничений
        const MAX_CONSTRAINTS = 10;
        
//НОВАЯ ФУНКЦИЯ ДАННЫХ ДЛЯ ГРАФИКОВ
function xandyVizov(constraints) {
    xValues.length = 0;
    yValues4.length = 0;

    // Очищаем ВСЕ массивы (до 10)
    for (let i = 0; i < 10; i++) {
        if (!window[`yValues${i}`]) window[`yValues${i}`] = [];
        if (!window[`yValuesHelp${i}verh`]) window[`yValuesHelp${i}verh`] = [];
        if (!window[`yValuesHelp${i}niz`]) window[`yValuesHelp${i}niz`] = [];
        
        window[`yValues${i}`].length = 0;
        window[`yValuesHelp${i}verh`].length = 0;
        window[`yValuesHelp${i}niz`].length = 0;
    }

    // Заполняем xValues и целевую функцию (это не меняется)
    for (let x = -100; x <= 100; x += 2) {
        xValues.push(x);
        yValues4.push((-title6.value * x / title7.value));
    }

    // НОВОЕ: Динамически заполняем линии ограничений
    constraints.forEach((constraint, index) => {
        for (let x = -100; x <= 100; x += 2) {
            // Основная линия
            const y = (-constraint.a / constraint.b * x) + (constraint.eq / constraint.b);
            window[`yValues${index}`].push(y);
            
            // Вспомогательные линии для заливки
            window[`yValuesHelp${index}verh`].push(
                (-constraint.a / constraint.b * x) + (constraint.eq * 1000 / constraint.b)
            );
            window[`yValuesHelp${index}niz`].push(
                (-constraint.a / constraint.b * x) - (constraint.eq * 1000 / constraint.b)
            );
        }
    });
}

// ████ ДОБАВЬ ЭТУ ФУНКЦИЮ ████
function gatherConstraints() {
    const constraints = [];
    const rows = document.querySelectorAll('.constraint-row');
    
    rows.forEach(row => {
        const a = parseFloat(row.querySelector('.coeff-a').value) || 0;
        const b = parseFloat(row.querySelector('.coeff-b').value) || 0;
        const c = parseFloat(row.querySelector('.coeff-c').value) || 0;
        const sign = row.querySelector('.sign-select').value;
        
        constraints.push({ a, b, eq: c, sign });
    });
    
    return constraints;
}

        dang.onclick = () => {

            // получаем constraints динамически 
            const constraints = gatherConstraints();
            
            // ВСЯ ОСТАЛЬНАЯ ЛОГИКА ОСТАЕТСЯ ПРЕЖНЕЙ
            const c1 = parseFloat(title6.value);
            const c2 = parseFloat(title7.value);
            const vector = calculateOptimalVector(c1, c2);

            // constraints в xandyVizov 
            xandyVizov(constraints);

            let allIntersections = [];
                for (let i = 0; i < constraints.length; i++) {
                    for (let j = i + 1; j < constraints.length; j++) {
                        const line1 = constraints[i];
                        const line2 = constraints[j];
                        const point = findIntersection(line1.a, line1.b, line1.eq, line2.a, line2.b, line2.eq);
                        if (point) {
                            allIntersections.push(point);
                        }
                    }
                }

                const feasiblePoints = allIntersections.filter(point => 
                    isPointFeasible(point, constraints)
                );

                optimizationType = document.getElementById('optType').value;
                let bestPoint = null;
                let bestValue = (optimizationType === 'max') ? -Infinity : Infinity;

                for (const point of feasiblePoints) {
                    const L = c1 * point.x + c2 * point.y;
                    
                    if ((optimizationType === 'max' && L > bestValue) ||
                        (optimizationType === 'min' && L < bestValue)) {
                        bestValue = L;
                        bestPoint = point;
                    }
                }

                // optimalPoint = bestPoint;
                // optimizationType = document.getElementById('optType').value;

                optimalPoint = bestPoint;

            xandyVizov(constraints)

            let optimalPointDataset = [];
            if (bestPoint) {
                optimalPointDataset = [{
                    label: 'Оптимальное решение',
                    data: [{ x: bestPoint.x, y: bestPoint.y }],
                    backgroundColor: 'green',
                    borderColor: 'green',
                    pointRadius: 10,
                    pointStyle: 'circle',
                    fill: true,
                    showLine: false
                }];
            } else {
                console.warn('⚠️ Не найдено допустимое решение! Проверьте ограничения.');
            }
            
            if (!myChart) {
                const ctx = document.getElementById('myChart').getContext('2d')
                myChart = new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: xValues,
                        datasets: [
                            // Основные линии (динамически)
                            ...constraints.map((constraint, index) => ({
                                label: '',
                                data: window[`yValues${index}`],
                                borderColor: CONSTRAINT_COLORS[index % CONSTRAINT_COLORS.length],
                                borderWidth: 3,
                                backgroundColor: CONSTRAINT_COLORS[index % CONSTRAINT_COLORS.length].replace(')', ', 0.2)'),
                                fill: false
                            })),
                            
    ...constraints.map((constraint, index) => {
        if (constraint.sign === '>=') {
            return {
                label: '',
                data: window[`yValuesHelp${index}verh`],
                borderColor: CONSTRAINT_COLORS[index % CONSTRAINT_COLORS.length],
                borderWidth: 1,
                backgroundColor: CONSTRAINT_COLORS[index % CONSTRAINT_COLORS.length].replace(')', ', 0.2)'),
                fill: {
                    target: `${index}`,
                    above: CONSTRAINT_COLORS[index % CONSTRAINT_COLORS.length].replace(')', ', 0.2)')
                }
            };
        } else {
            return {
                label: '',
                data: window[`yValuesHelp${index}niz`],
                borderColor: CONSTRAINT_COLORS[index % CONSTRAINT_COLORS.length],
                borderWidth: 1,
                backgroundColor: CONSTRAINT_COLORS[index % CONSTRAINT_COLORS.length].replace(')', ', 0.2)'),
                fill: {
                    target: `${index}`,
                    above: CONSTRAINT_COLORS[index % CONSTRAINT_COLORS.length].replace(')', ', 0.2)')
                }
            };
        }
    }),
    
    // Целевая функция
    {
        label: '',
        data: yValues4,
        borderColor: 'rgba(47,69,56)',
        pointRadius: 0,
        borderWidth: 2,
        pointBackgroundColor: 'transparent',
        fill: false
    },
    
    // Оптимальная точка
    // {
    //     label: 'Оптимальное решение',
    //     data: [{ x: bestPoint.x, y: bestPoint.y }],
    //     backgroundColor: 'green',
    //     borderColor: 'green',
    //     pointRadius: 10,
    //     pointStyle: 'circle',
    //     fill: true,
    //     showLine: false
    // }

    ...optimalPointDataset 
]
                    },
                    options: {
                        scales: {
                            x: {
                                // title: {
                                //     type: 'linear',
                                //     display: true,
                                //     text: 'x'
                                // },
                                // min: -100,
                                // max: 100,
                                // beginAtZero: true,
                                // grace: '0%',
                                // position: 'center'
                                type: 'linear',
                                position: 'center',
                                min: -100,
                                max: 100
                                //     offset: false                                   ,
                                // ticks: {
                                //     stepSize: 20
                                // }
                            },
                            y: {
                                // title: {
                                //     type: 'linear',
                                //     display: true,
                                //     text: 'y'
                                // },
                                // min: -100,
                                // max: 100,
                                // beginAtZero: true,
                                // grace: '0%',
                                // position: 'center'
                                type: 'linear',
                                position: 'center',
                                min: -100,
                                max: 100
                                // offset: false,
                                // ticks: {
                                //     stepSize: 20
                                // }
                            }
                        },
                        plugins: {
                            legend: {
                                position: 'bottom',
                                display: true
                            },
                            tooltip: {
                                //mode: 'index', 
                                intersect: true
                            },
                            filler: {
                                propagate: true 
                            },
                            elements: {
                                line: {
                                    tension: 0 
                                }
                            },
                            annotation: {
                                annotations: {
                                    arrow: {
                                        type: 'line',
                                        xMin: 0,
                                        xMax: vector.x,
                                        yMin: 0,
                                        yMax: vector.y,
                                        borderColor: 'blue',
                                        borderWidth: 1
                                    }
                                }
                            },
                            
                        }
                    },
                })
            } else {
                updateChartData()
            }

            if (optimalPoint) {
                setTimeout(() => {
                    animateToOptimalPoint(constraints);
                }, 500);
            }

        };

        // Эта функция позволяет обновлять график автоматически, без перезагрузки страницы
        document.addEventListener('DOMContentLoaded', () => {
            const signInputs = document.querySelectorAll('.sign-select') // эта строка выбирает ве элементы с классом sign-input
            signInputs.forEach(input => {
                //эта часть накладывает на все элементы с классом sign-input событие change(он срабатывает, когда мы выбираем знак в выпадающнм списке <select>), затем после изменения знака вызывается функция, которая обновляет график, в зависимости от выбранного значения
                input.addEventListener('change', e => {
                    updateChartData();
                })
            })
        })

        function updateChartData() {

            const constraints = gatherConstraints();
            
            const c1 = parseFloat(title6.value);
            const c2 = parseFloat(title7.value);
            const vector = calculateOptimalVector(c1, c2);
            
            // ... остальной код без изменений

            let allIntersections = [];
                for (let i = 0; i < constraints.length; i++) {
                    for (let j = i + 1; j < constraints.length; j++) {
                        const line1 = constraints[i];
                        const line2 = constraints[j];
                        const point = findIntersection(line1.a, line1.b, line1.eq, line2.a, line2.b, line2.eq);
                        if (point) {
                            allIntersections.push(point);
                        }
                    }
                }

                const feasiblePoints = allIntersections.filter(point => 
                    isPointFeasible(point, constraints)
                );

                optimizationType = document.getElementById('optType').value;
                let bestPoint = null;
                let bestValue = (optimizationType === 'max') ? -Infinity : Infinity;

                for (const point of feasiblePoints) {
                    const L = c1 * point.x + c2 * point.y;
                    
                    if ((optimizationType === 'max' && L > bestValue) ||
                        (optimizationType === 'min' && L < bestValue)) {
                        bestValue = L;
                        bestPoint = point;
                    }      
                }

                optimalPoint = bestPoint;

                // console.log('Оптимальная точка:', bestPoint);
                // console.log('Значение функции:', bestValue);

            xandyVizov(constraints);

    const datasets = [
    // Основные линии (динамически)
    ...constraints.map((constraint, index) => ({
        label: '',
        data: window[`yValues${index}`],
        borderColor: ['rgba(255, 0, 0)', 'rgba(0, 0, 255)', 'rgba(255, 128, 0)'][index % 3],
        borderWidth: 3,
        backgroundColor: ['rgba(255, 0, 0, 0.2)', 'rgba(0, 0, 255, 0.2)', 'rgba(255, 128, 0, 0.2)'][index % 3],
        fill: false
    })),

    ...constraints.map((constraint, index) => {
        if (constraint.sign === '>=') {
            return {
                label: '',
                data: window[`yValuesHelp${index}verh`],
                borderColor: ['rgba(255, 0, 0)', 'rgba(0, 0, 255)', 'rgba(255, 128, 0)'][index % 3],
                borderWidth: 1,
                backgroundColor: ['rgba(255, 0, 0, 0.1)', 'rgba(0, 0, 255, 0.1)', 'rgba(255, 128, 0, 0.1)'][index % 3],
                fill: {
                    target: `${index}`,
                    above: ['rgba(255, 0, 0, 0.1)', 'rgba(0, 0, 255, 0.1)', 'rgba(255, 128, 0, 0.1)'][index % 3]
                }
            };
        } else {
            return {
                label: '',
                data: window[`yValuesHelp${index}niz`],
                borderColor: ['rgba(255, 0, 0)', 'rgba(0, 0, 255)', 'rgba(255, 128, 0)'][index % 3],
                borderWidth: 1,
                backgroundColor: ['rgba(255, 0, 0, 0.1)', 'rgba(0, 0, 255, 0.1)', 'rgba(255, 128, 0, 0.1)'][index % 3],
                fill: {
                    target: `${index}`,
                    above: ['rgba(255, 0, 0, 0.1)', 'rgba(0, 0, 255, 0.1)', 'rgba(255, 128, 0, 0.1)'][index % 3]
                }
            };
        }
    }),
    
    // Целевая функция
    {
        label: '',
        data: yValues4,
        borderColor: 'rgba(47,69,56)',
        pointRadius: 0,
        borderWidth: 2,
        pointBackgroundColor: 'transparent',
        fill: false
    },
    
    // Оптимальная точка
    ...(bestPoint ? [{
    label: 'Оптимальное решение',
    data: [{ x: bestPoint.x, y: bestPoint.y }],
    backgroundColor: 'green',
    borderColor: 'green',
    pointRadius: 10,
    pointStyle: 'circle',
    fill: true,
    showLine: false
}] : [])
];

        console.log("Datasets:", datasets);

        myChart.data.datasets = datasets;

        if (myChart && myChart.options.plugins.annotation) {
        
        myChart.options.plugins.annotation.annotations.arrow.xMax = vector.x;
        myChart.options.plugins.annotation.annotations.arrow.yMax = vector.y;
        
        if (!myChart.options.plugins.annotation.annotations.arrow) {
            myChart.options.plugins.annotation.annotations.arrow = {
                type: 'line',
                xMin: 0,
                yMin: 0,
                xMax: vector.x,
                yMax: vector.y,
                borderColor: 'blue',
                borderWidth: 1,
                arrowHeads: {
                    end: {
                        enabled: true,
                        fill: true,
                        length: 15,
                        width: 10
                    }
                }
            };
        }
    }

    if (optimalPoint) {
                setTimeout(() => {
                    animateToOptimalPoint(constraints);
                }, 500); 
            }
                myChart.update()
            }
        

        function animateToOptimalPoint(constraints) {
            const c1 = parseFloat(title6.value);
            const c2 = parseFloat(title7.value);
            
            const startL = 0; 
            const endL = c1 * optimalPoint.x + c2 * optimalPoint.y; 
            let currentL = startL;
            const animationSpeed = 0.03; 
            
            const targetDatasetIndex = constraints.length * 2; 
            
            function animateFrame() {
                currentL += (endL - currentL) * animationSpeed;
                
                const newData = [];
                for (let x = -100; x <= 100; x += 2) {
                    const y = (currentL - c1 * x) / c2;
                    newData.push({ x: x, y: y });
                }
                
                myChart.data.datasets[targetDatasetIndex].data = newData;
                myChart.update();
                
                if (Math.abs(currentL - endL) > 0.5) {
                    requestAnimationFrame(animateFrame);
                }
            }
            
            animateFrame();
        }
