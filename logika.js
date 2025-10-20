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
        const title6 = document.getElementById('title6')
        const title7 = document.getElementById('title7')
        const title = document.getElementById('title')
        const title1 = document.getElementById('title1')
        const title2 = document.getElementById('title2')
        const title3 = document.getElementById('title3')
        const title4 = document.getElementById('title4')
        const title5 = document.getElementById('title5')
        const title11 = document.getElementById('title11')
        const title22 = document.getElementById('title22')
        const title33 = document.getElementById('title33')
        const dang = document.getElementById('dang')

        const sign1 = document.getElementById('sign1').value
        const sign2 = document.getElementById('sign2').value
        const sign3 = document.getElementById('sign3').value

        const xValues = []
        const yValues1 = []
        const yValues2 = []
        const yValues3 = []
        const yValues4 = []
        const yValuesHelp1verh = []
        const yValuesHelp2verh = []
        const yValuesHelp3verh = []
        const yValuesHelp1niz = []
        const yValuesHelp2niz = []
        const yValuesHelp3niz = []

        function xandyVizov() {
            xValues.length = 0 
            yValues1.length = 0
            yValues4.length = 0
            yValues2.length = 0
            yValues3.length = 0
            yValuesHelp1verh.length = 0
            yValuesHelp2verh.length = 0
            yValuesHelp3verh.length = 0
            yValuesHelp1niz.length = 0
            yValuesHelp2niz.length = 0
            yValuesHelp3niz.length = 0

            for (let x = -100; x <= 100; x += 2) {
                xValues.push(x)
                yValues1.push((-title.value / title1.value * x) + (title11.value / title1.value))
                yValues2.push((-title2.value / title3.value * x) + (title22.value / title3.value))
                yValues3.push((-title4.value / title5.value * x) + (title33.value / title5.value))
            }

            for (let x = -100; x <= 100; x += 2) {
                yValues4.push((-title6.value * x / title7.value))
            }

            for (let x = -100; x <= 100; x += 2) {
                xValues.push(x)
                yValuesHelp1verh.push((-title.value / title1.value * x) + (title11.value * 1000 / title1.value))
                yValuesHelp2verh.push((-title2.value / title3.value * x) + (title22.value * 1000 / title3.value))
                yValuesHelp3verh.push((-title4.value / title5.value * x) + (title33.value * 1000 / title5.value))
                yValuesHelp1niz.push((-title.value / title1.value * x) - (title11.value * 1000 / title1.value))
                yValuesHelp2niz.push((-title2.value / title3.value * x) - (title22.value * 1000 / title3.value))
                yValuesHelp3niz.push((-title4.value / title5.value * x) - (title33.value * 1000 / title5.value))
            }

            console.log('Диапазоны вспомогательных линий:');
            console.log('Help1niz:', Math.min(...yValuesHelp1niz), 'до', Math.max(...yValuesHelp1niz));
            console.log('Help2niz:', Math.min(...yValuesHelp2niz), 'до', Math.max(...yValuesHelp2niz));
            console.log('Help3niz:', Math.min(...yValuesHelp3niz), 'до', Math.max(...yValuesHelp3niz));

        }

        

        dang.onclick = () => {

            const c1 = parseFloat(title6.value);
            const c2 = parseFloat(title7.value);
            const vector = calculateOptimalVector(c1, c2);

            const constraints = [
                { 
                    a: parseFloat(title.value), 
                    b: parseFloat(title1.value), 
                    eq: parseFloat(title11.value), 
                    sign: document.getElementById('sign1').value 
                },
                { 
                    a: parseFloat(title2.value), 
                    b: parseFloat(title3.value), 
                    eq: parseFloat(title22.value), 
                    sign: document.getElementById('sign2').value 
                },
                { 
                    a: parseFloat(title4.value), 
                    b: parseFloat(title5.value), 
                    eq: parseFloat(title33.value), 
                    sign: document.getElementById('sign3').value 
                }
            ];

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

            xandyVizov()
            
            if (!myChart) {
                const ctx = document.getElementById('myChart').getContext('2d')
                myChart = new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: xValues,
                        datasets: [
                            {
                                label: '',
                                data: yValues1,
                                borderColor: 'rgba(255, 0, 0)',
                                borderWidth: 3,
                                backgroundColor: 'rgba(255, 0, 0, 0.2)',
                                fill: false
                            },
                            {
                                label: '',
                                data: yValues2,
                                borderColor: 'rgba(0, 0, 255)',
                                borderWidth: 3,
                                backgroundColor: 'rgba(0, 0, 255, 0.2)',
                                fill: false
                            },
                            {
                                label: '',
                                data: yValues3,
                                borderColor: 'rgba(255, 128, 0)',
                                borderWidth: 3,
                                backgroundColor: 'rgba(255, 128, 0, 0.2 )',
                                fill: false
                            },
                            {
                                label: '',
                                data: yValues4,
                                borderColor: 'rgba(47,69,56)',
                                pointRadius: 0,
                                borderWidth: 2,
                                pointBackgroundColor: 'transparent',
                                fill: false
                            },
                            {
                                label: 'Оптимальное решение',
                                data: [{ x: bestPoint.x, y: bestPoint.y }],
                                backgroundColor: 'green',
                                borderColor: 'green',
                                pointRadius: 10,
                                pointStyle: 'circle',
                                fill: true,
                                showLine: false
                            },
                            ...(sign1 === '>=' ? [{
                                label: "",
                                data: yValuesHelp1verh,
                                borderColor: 'rgba(255, 0, 0)',
                                borderWidth: 1,
                                backgroundColor: 'rgba(255, 0, 0, 0.2)',
                                fill:{
                                    target: '0',
                                    above: 'rgba(255, 0, 0, 0.2)'
                                }
                            }] : []),

                            ...(sign2 === '>=' ? [{
                                label: "",
                                data: yValuesHelp2verh,
                                borderColor: 'rgba(0, 0, 255)',
                                borderWidth: 1,
                                backgroundColor: 'rgba(0, 0, 255, 0.2)',
                                fill:{
                                    target: '1',
                                    above: 'rgba(0, 0, 255, 0.2)'
                                }
                            }] : []),
                            ...(sign3 === '>=' ? [{
                                label: "",
                                data: yValuesHelp3verh,
                                borderColor: 'rgba(255, 128, 0)',
                                borderWidth: 1,
                                backgroundColor: 'rgba(255, 128, 0, 0.2)',
                                fill:{
                                    target: '2',
                                    above: 'rgba(255, 128, 0, 0.2)'
                                }
                            }] : []),
                            ...(sign1 === '<=' ? [{
                                label: "",
                                data: yValuesHelp1niz,
                                borderColor: 'rgba(255, 0, 0)',
                                borderWidth: 1,
                                backgroundColor: 'rgba(255, 0, 0, 0.2)',
                                fill:{
                                    target: '0',
                                    above: 'rgba(255, 0, 0, 0.2)'
                                },
                            }] : []),
                            ...(sign2 === '<=' ? [{
                                label: "",
                                data: yValuesHelp2niz,
                                borderColor: 'rgba(0, 0, 255)',
                                borderWidth: 1,
                                backgroundColor: 'rgba(0, 0, 255, 0.2)',
                                fill:{
                                    target: '1',
                                    above: 'rgba(0, 0, 255, 0.2)'
                                }
                            }] : []),
                            ...(sign3 === '<=' ? [{
                                label: "",
                                data: yValuesHelp3niz,
                                borderColor: 'rgba(255, 128, 0)',
                                borderWidth: 1,
                                backgroundColor: 'rgba(255, 128, 0, 0.2)',
                                fill:{
                                    target: '2',
                                    above: 'rgba(255, 128, 0, 0.2)'
                                }
                            }] : []),
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
                                //position: 'bottom'
                                display: false
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
                    animateToOptimalPoint();
                }, 500);
            }

        };

        // Эта функция позволяет обновлять график автоматически, без перезагрузки страницы
        document.addEventListener('DOMContentLoaded', () => {
            const signInputs = document.querySelectorAll('.sign-input') // эта строка выбирает ве элементы с классом sign-input
            signInputs.forEach(input => {
                //эта часть накладывает на все элементы с классом sign-input событие change(он срабатывает, когда мы выбираем знак в выпадающнм списке <select>), затем после изменения знака вызывается функция, которая обновляет график, в зависимости от выбранного значения
                input.addEventListener('change', e => {
                    updateChartData();
                })
            })
        })

        function updateChartData() {

            const c1 = parseFloat(title6.value);
            const c2 = parseFloat(title7.value);
            const vector = calculateOptimalVector(c1, c2);

            const sign1 = document.getElementById('sign1')
            const sign2 = document.getElementById('sign2')
            const sign3 = document.getElementById('sign3')

            const constraints = [
                { 
                    a: parseFloat(title.value), 
                    b: parseFloat(title1.value), 
                    eq: parseFloat(title11.value), 
                    sign: document.getElementById('sign1').value 
                },
                { 
                    a: parseFloat(title2.value), 
                    b: parseFloat(title3.value), 
                    eq: parseFloat(title22.value), 
                    sign: document.getElementById('sign2').value 
                },
                { 
                    a: parseFloat(title4.value), 
                    b: parseFloat(title5.value), 
                    eq: parseFloat(title33.value), 
                    sign: document.getElementById('sign3').value 
                }
            ];

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

            xandyVizov();

            if (optimalPoint) {
                let optimalDatasetIndex = -1;
                for (let i = 0; i < myChart.data.datasets.length; i++) {
                    if (myChart.data.datasets[i].label === 'Оптимальное решение') {
                        optimalDatasetIndex = i;
                        break;
                    }
                }
                
                // Обновляем данные
                if (optimalDatasetIndex !== -1) {
                    myChart.data.datasets[optimalDatasetIndex].data = [
                        { x: optimalPoint.x, y: optimalPoint.y }
                    ];
                }
            }

    //         if (optimalPoint) {
    //     myChart.data.datasets.push({
    //         label: 'Оптимальное решение',
    //         data: [{ x: optimalPoint.x, y: optimalPoint.y }],
    //         backgroundColor: 'green',
    //         borderColor: 'green',
    //         pointRadius: 10,
    //         pointStyle: 'circle',
    //         fill: true,
    //         showLine: false
    //     });
    // }

            let yValues1 = []
            let yValues2 = []
            let yValues3 = []

            for (let x = -100; x <= 100; x += 2) {
                yValues1.push((-title.value / title1.value * x) + (title11.value / title1.value))
                yValues2.push((-title2.value / title3.value * x) + (title22.value / title3.value))
                yValues3.push((-title4.value / title5.value * x) + (title33.value / title5.value))
            }

            if (myChart) {
                myChart.data.datasets[0].data = yValues1
                myChart.data.datasets[1].data = yValues2
                myChart.data.datasets[2].data = yValues3

                // myChart.data.datasets[3].data = sign1 === '>=' ? yValuesHelp1verh : [];
                // myChart.data.datasets[4].data = sign1 === '<=' ? yValuesHelp1niz : [];
                // myChart.data.datasets[5].data = sign2 === '>=' ? yValuesHelp2verh : [];
                // myChart.data.datasets[6].data = sign2 === '<=' ? yValuesHelp2niz : [];
                // myChart.data.datasets[7].data = sign3 === '>=' ? yValuesHelp3verh : [];
                // myChart.data.datasets[8].data = sign3 === '<=' ? yValuesHelp3niz : [];

                //Обновляем вспомогательные линии
                // if (myChart.data.datasets[3]) {
                //     myChart.data.datasets[3].data = sign1 === '>=' ? yValuesHelp1verh : [];
                // }
                // if (myChart.data.datasets[4]) {
                //     myChart.data.datasets[4].data = sign1 === '<=' ? yValuesHelp1niz : [];
                // }
                // if (myChart.data.datasets[5]) {
                //     myChart.data.datasets[5].data = sign2 === '>=' ? yValuesHelp2verh : [];
                // }
                // if (myChart.data.datasets[6]) {
                //     myChart.data.datasets[6].data = sign2 === '<=' ? yValuesHelp2niz : [];
                // }
                // if (myChart.data.datasets[7]) {
                //     myChart.data.datasets[7].data = sign3 === '>=' ? yValuesHelp3verh : [];
                // }
                // if (myChart.data.datasets[8]) {
                //     myChart.data.datasets[8].data = sign3 === '<=' ? yValuesHelp3niz : [];
                // }

        const datasets = [
            {
                label: '',
                data: yValues1,
                borderColor: 'rgba(255, 0, 0)',
                borderWidth: 3,
                backgroundColor: 'rgba(255, 0, 0, 0.2)',
                fill: false
            },
            {
                label: '',
                data: yValues2,
                borderColor: 'rgba(0, 0, 255)',
                borderWidth: 3,
                backgroundColor: 'rgba(0, 0, 255, 0.2)',
                fill: false
            },
            {
                label: '',
                data: yValues3,
                borderColor: 'rgba(255, 128, 0)',
                borderWidth: 3,
                backgroundColor: 'rgba(255, 128, 0, 0.2)',
                fill: false
            },
            {
                label: '',
                data: yValues4,
                borderColor: 'rgba(47,69,56)',
                pointRadius: 0,
                borderWidth: 2,
                pointBackgroundColor: 'transparent',
                fill: false
            },
            {
                label: 'Оптимальное решение',
                // data: [{ x: optimalPoint.x, y: optimalPoint.y }],
                data: optimalPoint ? [{ x: optimalPoint.x, y: optimalPoint.y }] : [],
                backgroundColor: 'green',
                borderColor: 'green',
                pointRadius: 10,
                pointStyle: 'circle',
                fill: true,
                showLine: false
            },
            
            ...(sign1.value === '>=' ? [{
                label: '',
                data: yValuesHelp1verh,
                borderColor: 'rgba(255, 0, 0)',
                borderWidth: 1,
                backgroundColor: 'rgba(255, 0, 0, 0.2)',
                fill: {
                    target: '0',
                    above: 'rgba(255, 0, 0, 0.2)'
                }
            }] : []),
            ...(sign2.value === '>=' ? [{
                label: "",
                data: yValuesHelp2verh,
                borderColor: 'rgba(0, 0, 255)',
                borderWidth: 1,
                backgroundColor: 'rgba(0, 0, 255, 0.2)',
                fill: {
                    target: '1',
                    above: 'rgba(0, 0, 255, 0.2)'
                }
            }] : []),
            ...(sign3.value === '>=' ? [{
                label: '',
                data: yValuesHelp3verh,
                borderColor: 'rgba(255, 128, 0)',
                borderWidth: 1,
                backgroundColor: 'rgba(255, 128, 0, 0.2)',
                fill: {
                    target: '2',
                    above: 'rgba(255, 128, 0, 0.2)'
                }
            }] : []),
            ...(sign1.value === '<=' ? [{
                label: '',
                data: yValuesHelp1niz,
                borderColor: 'rgba(255, 0, 0)',
                borderWidth: 1,
                backgroundColor: 'rgba(255, 0, 0, 0.2)',
                fill: {
                    target: '0',
                    above: 'rgba(255, 0, 0, 0.2)'
                }
            }] : []),
            ...(sign2.value === '<=' ? [{
                label: '',
                data: yValuesHelp2niz,
                borderColor: 'rgba(0, 0, 255)',
                borderWidth: 1,
                backgroundColor: 'rgba(0, 0, 255, 0.2)',
                fill: {
                    target: '1',
                    above: 'rgba(0, 0, 255, 0.2)'
                }
            }] : []),
            ...(sign3.value === '<=' ? [{
                label: '',
                data: yValuesHelp3niz,
                borderColor: 'rgba(255, 128, 0)',
                borderWidth: 1,
                backgroundColor: 'rgba(255, 128, 0, 0.2)',
                fill: {
                    target: '2',
                    above: 'rgba(255, 128, 0, 0.2)'
                }
            }] : [])
        ];

        console.log("Обновление datasets:");
        console.log("Знак 1:", sign1.value);
        console.log("Знак 2:", sign2.value);
        console.log("Знак 3:", sign3.value);
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

    for (let i = 0; i < myChart.data.datasets.length; i++) {
        if (myChart.data.datasets[i].label === 'Оптимальное решение') {
            myChart.data.datasets.splice(i, 1);
            break;
        }
    }

    if (optimalPoint) {
                setTimeout(() => {
                    animateToOptimalPoint();
                }, 500); 
            }

    if (optimalPoint) {
        myChart.data.datasets.push({
            label: 'Оптимальное решение',
            data: [{ x: optimalPoint.x, y: optimalPoint.y }],
            backgroundColor: 'green',
            borderColor: 'green',
            pointRadius: 10,
            pointStyle: 'circle',
            fill: true,
            showLine: false
        });
    }


                myChart.update()
            }
        }

        function animateToOptimalPoint() {
            const c1 = parseFloat(title6.value);
            const c2 = parseFloat(title7.value);
            
            const startL = 0; 
            const endL = c1 * optimalPoint.x + c2 * optimalPoint.y; 
            let currentL = startL;
            const animationSpeed = 0.03; 
            
            const targetDatasetIndex = 3; 
            
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
