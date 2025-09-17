document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('nav a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    const sections = document.querySelectorAll('section');
    const observerOptions = {
        threshold: 0.6,
        rootMargin: '-100px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const activeNavLink = document.querySelector(`nav a[href="#${entry.target.id}"]`);
                
                navLinks.forEach(link => link.classList.remove('active'));
                
                if (activeNavLink) {
                    activeNavLink.classList.add('active');
                }
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });

    loadHtmlFiles();
    
    console.log('DAC300 Site loaded successfully');
});

async function loadHtmlFiles() {
    const fileListContainer = document.getElementById('file-list');
    const baseUrl = window.location.origin + window.location.pathname.replace('/index.html', '').replace(/\/$/, '');
    
    try {
        const response = await fetch('./files.json');
        const files = await response.json();
        
        if (files.length === 0) {
            fileListContainer.innerHTML = '<p class="no-files">No HTML files found.</p>';
            return;
        }
        
        const fileListHTML = files.map(file => {
            const fileName = file.replace('.html', '');
            const fileUrl = `${baseUrl}/${file}`;
            
            return `
                <div class="file-item">
                    <div class="file-info">
                        <h3 class="file-name">${fileName}</h3>
                        <div class="file-actions">
                            <a href="${file}" target="_blank" class="preview-btn">Preview</a>
                            <button class="copy-btn" onclick="copyToClipboard('${fileUrl}')">Copy URL</button>
                        </div>
                    </div>
                    <div class="file-url">
                        <code>${fileUrl}</code>
                    </div>
                </div>
            `;
        }).join('');
        
        fileListContainer.innerHTML = fileListHTML;
        
    } catch (error) {
        console.error('Error loading files:', error);
        fileListContainer.innerHTML = '<p class="error">Error loading file list.</p>';
    }
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        const notification = document.createElement('div');
        notification.className = 'copy-notification';
        notification.textContent = 'URL copied to clipboard!';
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy: ', err);
        alert('Failed to copy URL');
    });
}