document.addEventListener('DOMContentLoaded', function() {
    const navButtons = document.querySelectorAll('.nav-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    const playButton = document.getElementById('play-btn');
    const loadingOverlay = document.getElementById('loading-overlay');
    let progressBar = document.querySelector('.progress-bar');
    let bannerDots = document.querySelectorAll('.banner-dot');
    const installationItems = document.querySelectorAll('.installation-item');
    const installationsList = document.querySelector('.installations-list');
    let installationMenuOpen = null;

    // Initialize websim connection for multiplayer features
    const room = new WebsimSocket();

    // Handle tab navigation
    navButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons and tabs
            navButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(tab => tab.classList.remove('active'));

            // Add active class to clicked button and corresponding tab
            this.classList.add('active');
            const tabId = this.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });

    // Banner carousel functionality
    let currentBanner = 0;
    const bannerCount = bannerDots.length;

    function showBanner(index) {
        bannerDots.forEach(dot => dot.classList.remove('active'));
        bannerDots[index].classList.add('active');

        // In a real implementation, you would change the banner image here
        // For this demo, we'll just change the active dot
    }

    function nextBanner() {
        currentBanner = (currentBanner + 1) % bannerCount;
        showBanner(currentBanner);
    }

    // Auto advance banner every 5 seconds
    setInterval(nextBanner, 5000);

    // Manual banner navigation
    bannerDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentBanner = index;
            showBanner(currentBanner);
        });
    });

    // Installation item selection
    installationItems.forEach(item => {
        item.addEventListener('click', () => {
            installationItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
        });
    });

    // Play button functionality
    let isLaunching = false;

    playButton.addEventListener('click', function() {
        if (isLaunching) return;
        isLaunching = true;

        // Get selected version from dropdown
        const selectedVersion = document.getElementById('version').value;
        let clientPath = '';
        
        // Map selected version to the correct HTML file
        switch(selectedVersion) {
            case 'eagler1.8.8':
                clientPath = 'EaglercraftX_1.8_u50_Offline_Signed.html';
                break;
            case 'eagler1.5.2':
                clientPath = 'eaglercraft.1.5.2.html';
                break;
            case 'justin':
                clientPath = 'v3b12.html';
                break;
            case 'resent':
                clientPath = 'Resent-4.0-Patch-4-Signed.html';
                break;
            case 'astra':
                clientPath = 'Astra Client.html';
                break;
            case 'pixel':
                clientPath = 'PixelClient WASM Offline.html';
                break;
            default:
                clientPath = 'EaglercraftX_1.8_u50_Offline_Signed.html';
        }
        
        // Simulate launching Minecraft
        loadingOverlay.classList.add('active');

        // Reset progress bar
        progressBar.style.width = '0%';
        
        // Update loading text based on selected version
        document.querySelector('.loading-text').textContent = `Loading ${document.getElementById('version').options[document.getElementById('version').selectedIndex].text}...`;

        // Simulate loading progress with more realistic timing
        let progress = 0;
        const loadingInterval = setInterval(() => {
            progress += Math.random() * 5;
            if (progress >= 100) {
                progress = 100;
                clearInterval(loadingInterval);

                // Set final loading message
                document.querySelector('.loading-text').textContent = `Launching ${document.getElementById('version').options[document.getElementById('version').selectedIndex].text}`;
                
                // Launch the client
                setTimeout(() => {
                    // Create an iframe to load the client
                    const gameFrame = document.createElement('iframe');
                    gameFrame.src = clientPath;
                    gameFrame.style.position = 'fixed';
                    gameFrame.style.top = '0';
                    gameFrame.style.left = '0';
                    gameFrame.style.width = '100%';
                    gameFrame.style.height = '100%';
                    gameFrame.style.border = 'none';
                    gameFrame.style.zIndex = '2000';
                    document.body.appendChild(gameFrame);
                    
                    // Add a back button
                    const backButton = document.createElement('button');
                    backButton.textContent = '← Back to Launcher';
                    backButton.style.position = 'fixed';
                    backButton.style.top = '10px';
                    backButton.style.left = '10px';
                    backButton.style.zIndex = '2001';
                    backButton.style.padding = '8px 16px';
                    backButton.style.backgroundColor = '#333';
                    backButton.style.color = 'white';
                    backButton.style.border = 'none';
                    backButton.style.borderRadius = '4px';
                    backButton.style.cursor = 'pointer';
                    
                    backButton.addEventListener('click', () => {
                        document.body.removeChild(gameFrame);
                        document.body.removeChild(backButton);
                        loadingOverlay.classList.remove('active');
                        isLaunching = false;
                    });
                    
                    document.body.appendChild(backButton);
                    
                    // Hide loading overlay after the game loads
                    gameFrame.onload = () => {
                        loadingOverlay.classList.remove('active');
                    };
                }, 1500);
            }
            progressBar.style.width = `${progress}%`;
        }, 200);
    });

    // Function to add a new installation to the list
    function addNewInstallation(clientName) {
        const version = clientName.includes('Eaglercraft') ? 'Latest' : '1.8.8';

        const installationItem = document.createElement('div');
        installationItem.className = 'installation-item';
        installationItem.innerHTML = `
            <div class="installation-icon">
                <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                    <path d="M4 2h16a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zm0 2v16h16V4H4zm2 2h12v12H6V6zm2 2h4v4h-4v-4z"/>
                </svg>
            </div>
            <div class="installation-info">
                <div class="installation-name">${clientName}</div>
                <div class="installation-version">${version}</div>
            </div>
            <div class="installation-actions">
                <button class="btn btn-icon menu-button">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                        <path d="M12 16c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
                    </svg>
                </button>
            </div>
        `;

        installationsList.appendChild(installationItem);

        // Add event listeners to new installation
        setupInstallationListeners(installationItem);

        // Show a notification
        alert(`${clientName} has been added to your installations!`);
    }

    // Set up listeners for all installation items (including new ones)
    function setupInstallationListeners(item) {
        // Click on installation to select it
        item.addEventListener('click', (e) => {
            if (!e.target.closest('.menu-button') && !e.target.closest('.menu-popup')) {
                document.querySelectorAll('.installation-item').forEach(i => i.classList.remove('active'));
                item.classList.add('active');
            }
        });

        // Three dots menu button
        const menuButton = item.querySelector('.menu-button');
        if (menuButton) {
            menuButton.addEventListener('click', (e) => {
                e.stopPropagation();

                // Close any open menu first
                closeAllMenus();

                // Create menu popup
                const menuPopup = document.createElement('div');
                menuPopup.className = 'menu-popup';
                menuPopup.innerHTML = `
                    <div class="menu-item delete-item">Delete</div>
                `;

                // Position the menu next to the button
                const rect = menuButton.getBoundingClientRect();
                menuPopup.style.top = rect.bottom + 'px';
                menuPopup.style.left = (rect.left - 100) + 'px';

                menuButton.parentNode.appendChild(menuPopup);
                installationMenuOpen = menuPopup;

                // Handle delete action
                menuPopup.querySelector('.delete-item').addEventListener('click', () => {
                    if (confirm('Are you sure you want to delete this installation?')) {
                        item.remove();
                    }
                    closeAllMenus();
                });

                // Close menu when clicking outside
                document.addEventListener('click', closeMenuOnOutsideClick);
            });
        }
    }

    // Function to close all open menus
    function closeAllMenus() {
        if (installationMenuOpen) {
            installationMenuOpen.remove();
            installationMenuOpen = null;
            document.removeEventListener('click', closeMenuOnOutsideClick);
        }
    }

    function closeMenuOnOutsideClick(e) {
        if (!e.target.closest('.menu-popup') && !e.target.closest('.menu-button')) {
            closeAllMenus();
        }
    }

    // Initialize existing installations with event listeners
    document.querySelectorAll('.installation-item').forEach(item => {
        setupInstallationListeners(item);
    });

    // Modify version selection to show Eaglercraft versions
    const versionSelect = document.getElementById('version');
    if (versionSelect) {
        versionSelect.innerHTML = `
            <option value="eagler1.8.8">Eaglercraft 1.8.8</option>
            <option value="eagler1.5.2">Eaglercraft 1.5.2</option>
            <option value="justin">Justin Client</option>
            <option value="resent">Resent Client</option>
            <option value="astra">Astra Client</option>
            <option value="pixel">PixelClient</option>
        `;
    }

    // Update news content for launcher updates
    const newsItems = [
        {
            title: "LAUNCHER UPDATE 0.0.2",
            date: "April 10, 2025",
            content: "Fixed client selection issues, improved user interface.",
            image: "https://www.minecraft.net/content/dam/games/minecraft/screenshots/RayTracing-MinecraftRTX-1080.jpg"
        },
        {
            title: "LAUNCHER UPDATE 0.0.1",
            date: "March 4, 2025",
            content: "Initial release! Added Justin Client, Resent Client, Astra Client.",
            image: "https://www.minecraft.net/content/dam/games/minecraft/screenshots/Deep_dark_sculk_spread.jpg"
        }
    ];

    // Update the news tab with launcher updates
    function updateNewsTab() {
        const newsListContainer = document.querySelector('#news .news-list');
        if (!newsListContainer) return;

        newsListContainer.innerHTML = '';

        newsItems.forEach(item => {
            const newsItem = document.createElement('div');
            newsItem.className = 'news-item';
            newsItem.innerHTML = `
                <div class="news-item-image" style="background-image: url('${item.image}');"></div>
                <div class="news-item-content">
                    <h3>${item.title}</h3>
                    <div class="news-date">${item.date}</div>
                    <p>${item.content}</p>
                </div>
            `;
            newsListContainer.appendChild(newsItem);
        });

        // Also update home news tiles
        const newsTiles = document.querySelector('.tiles');
        if (newsTiles) {
            newsTiles.innerHTML = '';

            newsItems.slice(0, 3).forEach(item => {
                const tile = document.createElement('div');
                tile.className = 'news-tile';
                tile.innerHTML = `
                    <div class="tile-image" style="background-image: url('${item.image}');"></div>
                    <div class="tile-content">
                        <h4>${item.title}</h4>
                        <p>${item.content.substring(0, 40)}...</p>
                    </div>
                `;
                newsTiles.appendChild(tile);
            });
        }
    }

    // Update news content when the page loads
    updateNewsTab();

    // Set page title to reflect it's a launcher
    document.title = "Minecraft Launcher";

    // Remove login button reference
    const headerButtons = document.querySelector('.header-buttons');
    if (headerButtons) {
        headerButtons.innerHTML = '<button class="btn btn-small">Settings</button>';
    }

    // Add smooth animations with GSAP
    gsap.from('.launcher', { duration: 0.5, y: 30, opacity: 0 });
    gsap.from('.nav-btn', { duration: 0.3, x: -20, opacity: 0, stagger: 0.1, delay: 0.3 });
    gsap.from('.featured-banner', { duration: 0.5, y: 20, opacity: 0, delay: 0.5 });
    gsap.from('.versions-panel', { duration: 0.5, y: 20, opacity: 0, delay: 0.6 });
    gsap.from('.news-tile', { duration: 0.5, y: 20, opacity: 0, stagger: 0.1, delay: 0.7 });
});
