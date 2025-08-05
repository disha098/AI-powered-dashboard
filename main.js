// Dashboard JavaScript - ADmyBRAND Insights

// Global variables
let currentTheme = 'light';
let currentPage = 1;
let itemsPerPage = 10;
let sortColumn = '';
let sortDirection = 'asc';
let filteredData = [];
let charts = {};

// Mock data for the dashboard
const mockData = {
    metrics: {
        revenue: { value: 124563, change: 12.5 },
        users: { value: 45892, change: 8.2 },
        conversions: { value: 2847, change: 15.3 },
        growth: { value: 23.4, change: 5.7 }
    },
    revenueData: [
        { month: 'Jan', value: 85000 },
        { month: 'Feb', value: 92000 },
        { month: 'Mar', value: 105000 },
        { month: 'Apr', value: 98000 },
        { month: 'May', value: 112000 },
        { month: 'Jun', value: 124563 }
    ],
    usersData: [
        { month: 'Jan', value: 32000 },
        { month: 'Feb', value: 35000 },
        { month: 'Mar', value: 38000 },
        { month: 'Apr', value: 41000 },
        { month: 'May', value: 43000 },
        { month: 'Jun', value: 45892 }
    ],
    trafficData: [
        { source: 'Organic Search', value: 45, color: '#6366f1' },
        { source: 'Direct', value: 25, color: '#8b5cf6' },
        { source: 'Social Media', value: 20, color: '#10b981' },
        { source: 'Referral', value: 10, color: '#f59e0b' }
    ],
    campaigns: [
        { id: 1, name: 'Summer Sale Campaign', status: 'active', budget: 15000, spent: 12450, impressions: 125000, clicks: 8500, ctr: 6.8, conversions: 425 },
        { id: 2, name: 'Brand Awareness', status: 'active', budget: 25000, spent: 18900, impressions: 200000, clicks: 12000, ctr: 6.0, conversions: 600 },
        { id: 3, name: 'Product Launch', status: 'paused', budget: 30000, spent: 22000, impressions: 180000, clicks: 15000, ctr: 8.3, conversions: 750 },
        { id: 4, name: 'Holiday Special', status: 'draft', budget: 20000, spent: 0, impressions: 0, clicks: 0, ctr: 0, conversions: 0 },
        { id: 5, name: 'Retargeting Ads', status: 'active', budget: 12000, spent: 8900, impressions: 95000, clicks: 7200, ctr: 7.6, conversions: 360 },
        { id: 6, name: 'Influencer Campaign', status: 'active', budget: 18000, spent: 15600, impressions: 150000, clicks: 11000, ctr: 7.3, conversions: 550 },
        { id: 7, name: 'Email Marketing', status: 'active', budget: 8000, spent: 7200, impressions: 80000, clicks: 4800, ctr: 6.0, conversions: 240 },
        { id: 8, name: 'Social Media Ads', status: 'paused', budget: 15000, spent: 11200, impressions: 120000, clicks: 9000, ctr: 7.5, conversions: 450 },
        { id: 9, name: 'Video Campaign', status: 'active', budget: 22000, spent: 19800, impressions: 220000, clicks: 18000, ctr: 8.2, conversions: 900 },
        { id: 10, name: 'Mobile App Promotion', status: 'draft', budget: 16000, spent: 0, impressions: 0, clicks: 0, ctr: 0, conversions: 0 },
        { id: 11, name: 'Local SEO Campaign', status: 'active', budget: 10000, spent: 8500, impressions: 75000, clicks: 5200, ctr: 6.9, conversions: 260 },
        { id: 12, name: 'PPC Campaign', status: 'active', budget: 28000, spent: 24500, impressions: 280000, clicks: 21000, ctr: 7.5, conversions: 1050 },
        { id: 13, name: 'Content Marketing', status: 'active', budget: 14000, spent: 12800, impressions: 140000, clicks: 9800, ctr: 7.0, conversions: 490 },
        { id: 14, name: 'Affiliate Program', status: 'paused', budget: 12000, spent: 9600, impressions: 100000, clicks: 7200, ctr: 7.2, conversions: 360 },
        { id: 15, name: 'Event Promotion', status: 'draft', budget: 18000, spent: 0, impressions: 0, clicks: 0, ctr: 0, conversions: 0 }
    ]
};

// Initialize dashboard
document.addEventListener('DOMContentLoaded', function() {
    initializeDashboard();
});

function initializeDashboard() {
    showLoading();
    
    // Initialize components
    initializeTheme();
    initializeSidebar();
    initializeMetrics();
    initializeCharts();
    initializeTable();
    initializeSearch();
    initializePagination();
    
    // Simulate loading time
    setTimeout(() => {
        hideLoading();
        startRealTimeUpdates();
    }, 1500);
}

// Theme Management
function initializeTheme() {
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;
    
    // Load saved theme
    const savedTheme = localStorage.getItem('dashboard-theme') || 'light';
    setTheme(savedTheme);
    
    themeToggle.addEventListener('click', () => {
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
    });
}

function setTheme(theme) {
    const body = document.body;
    const themeToggle = document.getElementById('themeToggle');
    const icon = themeToggle.querySelector('i');
    
    currentTheme = theme;
    body.className = theme === 'dark' ? 'dark-mode' : 'light-mode';
    
    // Update icon
    icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    
    // Save to localStorage
    localStorage.setItem('dashboard-theme', theme);
    
    // Update charts for new theme
    updateChartsTheme();
}

function updateChartsTheme() {
    const isDark = currentTheme === 'dark';
    const textColor = isDark ? '#f1f5f9' : '#1e293b';
    const gridColor = isDark ? '#334155' : '#e2e8f0';
    
    Object.values(charts).forEach(chart => {
        if (chart && chart.options) {
            chart.options.scales.x.grid.color = gridColor;
            chart.options.scales.y.grid.color = gridColor;
            chart.options.scales.x.ticks.color = textColor;
            chart.options.scales.y.ticks.color = textColor;
            chart.options.plugins.legend.labels.color = textColor;
            chart.update();
        }
    });
}

// Sidebar Management
function initializeSidebar() {
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.querySelector('.sidebar');
    
    menuToggle.addEventListener('click', () => {
        sidebar.classList.toggle('show');
    });
    
    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 1024) {
            if (!sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
                sidebar.classList.remove('show');
            }
        }
    });
}

// Metrics Management
function initializeMetrics() {
    updateMetrics();
    
    // Animate metric values
    animateMetricValues();
}

function updateMetrics() {
    const metrics = mockData.metrics;
    
    document.getElementById('revenueValue').textContent = formatCurrency(metrics.revenue.value);
    document.getElementById('usersValue').textContent = formatNumber(metrics.users.value);
    document.getElementById('conversionsValue').textContent = formatNumber(metrics.conversions.value);
    document.getElementById('growthValue').textContent = metrics.growth.value + '%';
}

function animateMetricValues() {
    const metricValues = document.querySelectorAll('.metric-value');
    
    metricValues.forEach(element => {
        const finalValue = element.textContent;
        const numericValue = parseFloat(finalValue.replace(/[$,%]/g, ''));
        const isCurrency = finalValue.includes('$');
        const isPercentage = finalValue.includes('%');
        
        animateValue(element, 0, numericValue, 2000, isCurrency, isPercentage);
    });
}

function animateValue(element, start, end, duration, isCurrency, isPercentage) {
    const startTime = performance.now();
    
    function updateValue(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const current = start + (end - start) * easeOutQuart(progress);
        
        if (isCurrency) {
            element.textContent = formatCurrency(current);
        } else if (isPercentage) {
            element.textContent = current.toFixed(1) + '%';
        } else {
            element.textContent = formatNumber(current);
        }
        
        if (progress < 1) {
            requestAnimationFrame(updateValue);
        }
    }
    
    requestAnimationFrame(updateValue);
}

function easeOutQuart(t) {
    return 1 - Math.pow(1 - t, 4);
}

// Charts Management
function initializeCharts() {
    createRevenueChart();
    createUsersChart();
    createTrafficChart();
}

function createRevenueChart() {
    const ctx = document.getElementById('revenueChart').getContext('2d');
    const data = mockData.revenueData;
    
    charts.revenue = new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.map(d => d.month),
            datasets: [{
                label: 'Revenue',
                data: data.map(d => d.value),
                borderColor: '#10b981',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#10b981',
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2,
                pointRadius: 6,
                pointHoverRadius: 8
            }]
        },
        options: getChartOptions('Revenue Trend')
    });
}

function createUsersChart() {
    const ctx = document.getElementById('usersChart').getContext('2d');
    const data = mockData.usersData;
    
    charts.users = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.map(d => d.month),
            datasets: [{
                label: 'Active Users',
                data: data.map(d => d.value),
                backgroundColor: 'rgba(99, 102, 241, 0.8)',
                borderColor: '#6366f1',
                borderWidth: 1,
                borderRadius: 4,
                borderSkipped: false
            }]
        },
        options: getChartOptions('User Activity')
    });
}

function createTrafficChart() {
    const ctx = document.getElementById('trafficChart').getContext('2d');
    const data = mockData.trafficData;
    
    charts.traffic = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: data.map(d => d.source),
            datasets: [{
                data: data.map(d => d.value),
                backgroundColor: data.map(d => d.color),
                borderWidth: 0,
                cutout: '60%'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        usePointStyle: true,
                        pointStyle: 'circle'
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.label + ': ' + context.parsed + '%';
                        }
                    }
                }
            }
        }
    });
}

function getChartOptions(title) {
    const isDark = currentTheme === 'dark';
    const textColor = isDark ? '#f1f5f9' : '#1e293b';
    const gridColor = isDark ? '#334155' : '#e2e8f0';
    
    return {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                backgroundColor: isDark ? '#1e293b' : '#ffffff',
                titleColor: textColor,
                bodyColor: textColor,
                borderColor: gridColor,
                borderWidth: 1,
                cornerRadius: 8,
                displayColors: false
            }
        },
        scales: {
            x: {
                grid: {
                    color: gridColor,
                    drawBorder: false
                },
                ticks: {
                    color: textColor,
                    font: {
                        size: 12
                    }
                }
            },
            y: {
                grid: {
                    color: gridColor,
                    drawBorder: false
                },
                ticks: {
                    color: textColor,
                    font: {
                        size: 12
                    },
                    callback: function(value) {
                        return formatNumber(value);
                    }
                }
            }
        },
        interaction: {
            intersect: false,
            mode: 'index'
        }
    };
}

// Table Management
function initializeTable() {
    filteredData = [...mockData.campaigns];
    renderTable();
    initializeSorting();
}

function renderTable() {
    const tbody = document.getElementById('campaignsTableBody');
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageData = filteredData.slice(startIndex, endIndex);
    
    tbody.innerHTML = '';
    
    pageData.forEach(campaign => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${campaign.name}</td>
            <td><span class="status-badge ${campaign.status}">${campaign.status}</span></td>
            <td>${formatCurrency(campaign.budget)}</td>
            <td>${formatCurrency(campaign.spent)}</td>
            <td>${formatNumber(campaign.impressions)}</td>
            <td>${formatNumber(campaign.clicks)}</td>
            <td>${campaign.ctr}%</td>
            <td>${formatNumber(campaign.conversions)}</td>
        `;
        tbody.appendChild(row);
    });
    
    updatePagination();
}

function initializeSorting() {
    const headers = document.querySelectorAll('th[data-sort]');
    
    headers.forEach(header => {
        header.addEventListener('click', () => {
            const column = header.dataset.sort;
            
            if (sortColumn === column) {
                sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
            } else {
                sortColumn = column;
                sortDirection = 'asc';
            }
            
            sortData();
            renderTable();
            updateSortIndicators();
        });
    });
}

function sortData() {
    filteredData.sort((a, b) => {
        let aVal = a[sortColumn];
        let bVal = b[sortColumn];
        
        // Handle numeric values
        if (typeof aVal === 'number' && typeof bVal === 'number') {
            return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
        }
        
        // Handle string values
        aVal = aVal.toString().toLowerCase();
        bVal = bVal.toString().toLowerCase();
        
        if (sortDirection === 'asc') {
            return aVal.localeCompare(bVal);
        } else {
            return bVal.localeCompare(aVal);
        }
    });
}

function updateSortIndicators() {
    const headers = document.querySelectorAll('th[data-sort]');
    
    headers.forEach(header => {
        const icon = header.querySelector('i');
        const column = header.dataset.sort;
        
        if (column === sortColumn) {
            icon.className = sortDirection === 'asc' ? 'fas fa-sort-up' : 'fas fa-sort-down';
        } else {
            icon.className = 'fas fa-sort';
        }
    });
}

// Search Management
function initializeSearch() {
    const searchInput = document.getElementById('searchInput');
    
    searchInput.addEventListener('input', debounce(() => {
        const searchTerm = searchInput.value.toLowerCase();
        
        filteredData = mockData.campaigns.filter(campaign => 
            campaign.name.toLowerCase().includes(searchTerm) ||
            campaign.status.toLowerCase().includes(searchTerm)
        );
        
        currentPage = 1;
        renderTable();
    }, 300));
}

// Pagination Management
function initializePagination() {
    const prevBtn = document.getElementById('prevPage');
    const nextBtn = document.getElementById('nextPage');
    
    prevBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderTable();
        }
    });
    
    nextBtn.addEventListener('click', () => {
        const maxPage = Math.ceil(filteredData.length / itemsPerPage);
        if (currentPage < maxPage) {
            currentPage++;
            renderTable();
        }
    });
}

function updatePagination() {
    const totalItems = filteredData.length;
    const maxPage = Math.ceil(totalItems / itemsPerPage);
    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);
    
    // Update info
    document.getElementById('paginationInfo').textContent = 
        `Showing ${startItem}-${endItem} of ${totalItems} campaigns`;
    
    // Update buttons
    document.getElementById('prevPage').disabled = currentPage === 1;
    document.getElementById('nextPage').disabled = currentPage === maxPage;
    
    // Update page numbers
    renderPageNumbers(maxPage);
}

function renderPageNumbers(maxPage) {
    const pageNumbersContainer = document.getElementById('pageNumbers');
    pageNumbersContainer.innerHTML = '';
    
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(maxPage, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
        const pageBtn = document.createElement('button');
        pageBtn.className = `page-number ${i === currentPage ? 'active' : ''}`;
        pageBtn.textContent = i;
        pageBtn.addEventListener('click', () => {
            currentPage = i;
            renderTable();
        });
        pageNumbersContainer.appendChild(pageBtn);
    }
}

// Export Functions
function exportChart(chartType) {
    const chart = charts[chartType];
    if (chart) {
        const link = document.createElement('a');
        link.download = `${chartType}-chart.png`;
        link.href = chart.toBase64Image();
        link.click();
    }
}

function exportTable() {
    const headers = ['Campaign Name', 'Status', 'Budget', 'Spent', 'Impressions', 'Clicks', 'CTR', 'Conversions'];
    const csvContent = [
        headers.join(','),
        ...filteredData.map(campaign => [
            `"${campaign.name}"`,
            campaign.status,
            campaign.budget,
            campaign.spent,
            campaign.impressions,
            campaign.clicks,
            campaign.ctr,
            campaign.conversions
        ].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'campaigns-data.csv';
    link.click();
    window.URL.revokeObjectURL(url);
}

// Real-time Updates
function startRealTimeUpdates() {
    // Update metrics every 30 seconds
    setInterval(() => {
        updateMetricsRandomly();
    }, 30000);
    
    // Update date range
    updateDateRange();
}

function updateMetricsRandomly() {
    const metrics = mockData.metrics;
    
    // Add small random variations
    Object.keys(metrics).forEach(key => {
        const variation = (Math.random() - 0.5) * 0.02; // ±1% variation
        metrics[key].value = Math.round(metrics[key].value * (1 + variation));
        metrics[key].change = Math.max(-20, Math.min(20, metrics[key].change + (Math.random() - 0.5) * 2));
    });
    
    updateMetrics();
}

function updateDateRange() {
    const dateRange = document.getElementById('dateRange');
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    dateRange.textContent = `Last 30 days (${formatDate(thirtyDaysAgo)} - ${formatDate(now)})`;
}

// Utility Functions
function formatCurrency(value) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(value);
}

function formatNumber(value) {
    return new Intl.NumberFormat('en-US').format(value);
}

function formatDate(date) {
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
    });
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function showLoading() {
    document.getElementById('loadingOverlay').classList.add('show');
}

function hideLoading() {
    document.getElementById('loadingOverlay').classList.remove('show');
}

// Add smooth scrolling for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add keyboard navigation support
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const sidebar = document.querySelector('.sidebar');
        if (sidebar.classList.contains('show')) {
            sidebar.classList.remove('show');
        }
    }
});

// Add intersection observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.metric-card, .chart-card, .table-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    observer.observe(el);
});

// Add hover effects for better UX
document.querySelectorAll('.metric-card, .chart-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-4px)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
});

// Add loading skeleton for better perceived performance
function createLoadingSkeleton() {
    const skeleton = document.createElement('div');
    skeleton.className = 'skeleton';
    skeleton.innerHTML = `
        <div class="skeleton-card">
            <div class="skeleton-line"></div>
            <div class="skeleton-line"></div>
        </div>
    `;
    return skeleton;
}

// Add error handling for charts
window.addEventListener('error', (e) => {
    console.error('Dashboard error:', e.error);
    // You could show a user-friendly error message here
});

// Add performance monitoring
const performanceObserver = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
        if (entry.entryType === 'navigation') {
            console.log('Dashboard loaded in:', entry.loadEventEnd - entry.loadEventStart, 'ms');
        }
    }
});

performanceObserver.observe({ entryTypes: ['navigation'] }); 