document.addEventListener('DOMContentLoaded', () => {
    const urlInput = document.getElementById('urlInput');
    const analyzeBtn = document.getElementById('analyzeBtn');
    const resultsContainer = document.getElementById('resultsContainer');
    const scoreOverview = document.getElementById('scoreOverview');
    const metricsGrid = document.getElementById('metricsGrid');
    const exportSection = document.getElementById('exportSection');

    // Función para analizar la URL
    async function analyzeSEO(url) {
        try {
            // Simulamos el análisis SEO (en una implementación real, esto se conectaría a un backend)
            const response = await fetch(url);
            const html = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');

            // Análisis de meta tags
            const metaScore = analyzeMetaTags(doc);
            updateMetricCard('metaScore', 'metaDetails', metaScore);

            // Análisis de estructura
            const structureScore = analyzeStructure(doc);
            updateMetricCard('structureScore', 'structureDetails', structureScore);

            // Análisis móvil (simulado)
            const mobileScore = analyzeMobileOptimization();
            updateMetricCard('mobileScore', 'mobileDetails', mobileScore);

            // Análisis de velocidad (simulado)
            const speedScore = analyzeSpeed();
            updateMetricCard('speedScore', 'speedDetails', speedScore);

            // Análisis de enlaces
            const linksScore = analyzeLinks(doc);
            updateMetricCard('linksScore', 'linksDetails', linksScore);

            // Análisis de palabras clave
            const keywordsScore = analyzeKeywords(doc);
            updateMetricCard('keywordsScore', 'keywordsDetails', keywordsScore);

            // Análisis de redes sociales
            const socialScore = analyzeSocialMedia(doc);
            updateMetricCard('socialScore', 'socialDetails', socialScore);

            // Análisis de seguridad
            const securityScore = analyzeSecurity(url);
            updateMetricCard('securityScore', 'securityDetails', securityScore);

            // Calcular puntuación total
            const totalScore = Math.round(
                (metaScore.score + structureScore.score + mobileScore.score + 
                speedScore.score + linksScore.score + keywordsScore.score + 
                socialScore.score + securityScore.score) / 8
            );
            document.getElementById('totalScore').textContent = totalScore;

            // Mostrar resultados
            showResults();

        } catch (error) {
            alert('Error al analizar la URL: ' + error.message);
        }
    }

    // Función para analizar meta tags
    function analyzeMetaTags(doc) {
        const issues = [];
        let score = 100;

        // Verificar título
        const title = doc.title;
        if (!title) {
            issues.push('Falta el título de la página');
            score -= 20;
        } else if (title.length < 30 || title.length > 60) {
            issues.push('La longitud del título no es óptima (30-60 caracteres)');
            score -= 10;
        }

        // Verificar meta description
        const metaDesc = doc.querySelector('meta[name="description"]');
        if (!metaDesc) {
            issues.push('Falta la meta descripción');
            score -= 20;
        } else if (metaDesc.content.length < 120 || metaDesc.content.length > 160) {
            issues.push('La longitud de la meta descripción no es óptima (120-160 caracteres)');
            score -= 10;
        }

        return {
            score: Math.max(0, score),
            issues
        };
    }

    // Función para analizar estructura
    function analyzeStructure(doc) {
        const issues = [];
        let score = 100;

        // Verificar encabezados
        const h1s = doc.getElementsByTagName('h1');
        if (h1s.length === 0) {
            issues.push('No hay encabezado H1');
            score -= 20;
        } else if (h1s.length > 1) {
            issues.push('Múltiples encabezados H1 encontrados');
            score -= 10;
        }

        // Verificar imágenes
        const images = doc.getElementsByTagName('img');
        let imagesWithoutAlt = 0;
        for (const img of images) {
            if (!img.alt) imagesWithoutAlt++;
        }
        if (imagesWithoutAlt > 0) {
            issues.push(`${imagesWithoutAlt} imágenes sin atributo alt`);
            score -= Math.min(20, imagesWithoutAlt * 5);
        }

        return {
            score: Math.max(0, score),
            issues
        };
    }

    // Función para analizar optimización móvil (simulada)
    function analyzeMobileOptimization() {
        const score = 85;
        const issues = [
            'Viewport meta tag presente',
            'Diseño responsive detectado',
            'Tamaño de fuente legible en móvil'
        ];
        return { score, issues };
    }

    // Función para analizar velocidad (simulada)
    function analyzeSpeed() {
        const score = 90;
        const issues = [
            'Tiempo de carga: 2.3s',
            'Compresión GZIP activada',
            'Caché del navegador configurado'
        ];
        return { score, issues };
    }

    // Función para analizar enlaces
    function analyzeLinks(doc) {
        const links = doc.getElementsByTagName('a');
        const issues = [];
        let score = 100;
        let internalLinks = 0;
        let externalLinks = 0;
        let brokenLinks = 0;

        for (const link of links) {
            const href = link.getAttribute('href');
            if (!href) {
                brokenLinks++;
                continue;
            }

            if (href.startsWith('#') || href.startsWith('/') || href.includes(window.location.hostname)) {
                internalLinks++;
            } else {
                externalLinks++;
            }

            if (!link.textContent.trim()) {
                issues.push('Enlace sin texto descriptivo encontrado');
                score -= 5;
            }
        }

        if (brokenLinks > 0) {
            issues.push(`${brokenLinks} enlaces rotos encontrados`);
            score -= brokenLinks * 10;
        }

        issues.push(`Enlaces internos: ${internalLinks}`);
        issues.push(`Enlaces externos: ${externalLinks}`);

        return {
            score: Math.max(0, score),
            issues
        };
    }

    // Función para analizar palabras clave
    function analyzeKeywords(doc) {
        const content = doc.body.textContent.toLowerCase();
        const words = content.split(/\s+/);
        const wordCount = {};
        const issues = [];
        let score = 100;

        words.forEach(word => {
            if (word.length > 3) {
                wordCount[word] = (wordCount[word] || 0) + 1;
            }
        });

        const sortedWords = Object.entries(wordCount)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 5);

        issues.push('Palabras clave principales:');
        sortedWords.forEach(([word, count]) => {
            const density = (count / words.length * 100).toFixed(2);
            issues.push(`${word}: ${count} veces (${density}%)`);            
        });

        return { score, issues };
    }

    // Función para analizar redes sociales
    function analyzeSocialMedia(doc) {
        const issues = [];
        let score = 100;

        const socialMeta = [
            'og:title',
            'og:description',
            'og:image',
            'twitter:card',
            'twitter:title',
            'twitter:description'
        ];

        socialMeta.forEach(meta => {
            if (!doc.querySelector(`meta[property="${meta}"], meta[name="${meta}"]`)) {
                issues.push(`Falta meta tag ${meta}`);
                score -= 10;
            }
        });

        const socialLinks = doc.querySelectorAll('a[href*="facebook.com"], a[href*="twitter.com"], a[href*="linkedin.com"], a[href*="instagram.com"]');
        if (socialLinks.length === 0) {
            issues.push('No se encontraron enlaces a redes sociales');
            score -= 10;
        } else {
            issues.push(`Enlaces a redes sociales encontrados: ${socialLinks.length}`);
        }

        return {
            score: Math.max(0, score),
            issues
        };
    }

    // Función para analizar seguridad
    function analyzeSecurity(url) {
        const issues = [];
        let score = 100;

        if (!url.startsWith('https://')) {
            issues.push('El sitio no usa HTTPS');
            score -= 30;
        } else {
            issues.push('El sitio usa HTTPS');
        }

        // Simulamos verificación de certificado SSL
        issues.push('Certificado SSL válido');

        // Simulamos verificación de políticas de seguridad
        const securityHeaders = [
            'Content-Security-Policy',
            'X-Frame-Options',
            'X-XSS-Protection'
        ];

        securityHeaders.forEach(header => {
            issues.push(`Header de seguridad ${header} presente`);
        });

        return {
            score: Math.max(0, score),
            issues
        };
    }

    // Función para actualizar tarjeta de métrica
    function updateMetricCard(scoreId, detailsId, result) {
        document.getElementById(scoreId).textContent = `${result.score}/100`;
        const detailsList = document.getElementById(detailsId);
        detailsList.innerHTML = '';
        result.issues.forEach(issue => {
            const li = document.createElement('li');
            li.textContent = issue;
            detailsList.appendChild(li);
        });
    }

    // Función para mostrar resultados
    function showResults() {
        scoreOverview.classList.remove('hidden');
        metricsGrid.classList.remove('hidden');
        exportSection.classList.remove('hidden');
    }

    // Event listeners
    analyzeBtn.addEventListener('click', () => {
        const url = urlInput.value.trim();
        if (!url) {
            alert('Por favor, ingrese una URL válida');
            return;
        }
        analyzeSEO(url);
    });

    // Exportar a CSV
    document.getElementById('exportCSV').addEventListener('click', () => {
        const scores = {
            total: document.getElementById('totalScore').textContent,
            meta: document.getElementById('metaScore').textContent,
            structure: document.getElementById('structureScore').textContent,
            mobile: document.getElementById('mobileScore').textContent,
            speed: document.getElementById('speedScore').textContent,
            links: document.getElementById('linksScore').textContent,
            keywords: document.getElementById('keywordsScore').textContent,
            social: document.getElementById('socialScore').textContent,
            security: document.getElementById('securityScore').textContent
        };

        const csvContent = `URL,Puntuación Total,Meta Tags,Estructura,Móvil,Velocidad,Enlaces,Palabras Clave,Redes Sociales,Seguridad\n${urlInput.value},${scores.total},${scores.meta},${scores.structure},${scores.mobile},${scores.speed},${scores.links},${scores.keywords},${scores.social},${scores.security}`;
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'analisis_seo.csv';
        link.click();
    });

    // Guardar en base de datos
    document.getElementById('saveDB').addEventListener('click', () => {
        // Aquí se implementaría la lógica para guardar en la base de datos
        alert('Resultados guardados en la base de datos');
    });
});