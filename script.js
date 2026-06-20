// --- Fallback Profile Data (Default State) ---
const DEFAULT_PROFILE = {
  "name": "Dr. Rahul Mishra",
  "designation": "Assistant Professor",
  "department": "Department of Computer Science and Engineering",
  "institution": "Indian Institute of Technology Patna",
  "email": "rahul_mishra@iitp.ac.in",
  "phone": "06115-233-(8)989",
  "researchInterests": [
    "Deep Learning",
    "Fog Computing",
    "Internet of Things (IoT)",
    "Wireless Sensors Network (WSN)",
    "Smart Sensing"
  ],
  "admin_password": "iitp@123",
  "avatar": "1769377776340-Rahul Mishra.jpg",
  "about": "Dr. Rahul Mishra is an Assistant Professor in the Department of Computer Science & Engineering at the Indian Institute of Technology Patna. His research interests lie at the intersection of Deep Learning, Fog Computing, Internet of Things (IoT), and Smart Sensing.",
  "experience": [
    {
      "role": "Assistant Professor",
      "organization": "DA-IICT Gandhinagar",
      "duration": "Dec 2022 - Feb 2024"
    },
    {
      "role": "Research Associate",
      "organization": "IISc Bangalore",
      "duration": "Sept 2022 - Dec 2022"
    }
  ],
  "awards": [
    "Got student conference grant sponsored by the IEEE Communications Society (ComSoc), INFOCOM 2021 and 2022"
  ],
  "professional_bodies": [
    "IEEE Member"
  ],
  "books": [
    {
      "title": "AICTE Textbook on Design and Analysis of Algorithm (Link)",
      "link": "https://ekumbh.aicte-india.org/book.php"
    }
  ],
  "patents": [
    {
      "title": "Rahul Mishra, T. K. Maiti, A. Jain, P. Lalwani, and R. Shah, \"Racket Sports Activities Monitoring and Corrections using Grip Embedded Sensors and Smartphone\", Patent filed (Patent no. 202411014828)"
    }
  ],
  "publications": [
    "R. Mishra and H. P. Gupta, \"Towards Understanding the Impact of Participant and its Wearable Devices in Federated Learning,\" in IEEE Transactions on Mobile Computing, doi: 10.1109/TMC.2025.3530818. [pdf]",
    "R. Mishra and H. P. Gupta, \"Fed-NL: A Federated Learning Approach to Suppress Noise in Participant Datasets to Reduce Communication Rounds for Convergence,\" in IEEE Transactions on Mobile Computing, [Accepted]. [pdf]",
    "R. Mishra, H. P. Gupta, G. Banga and S. K. Das, \"Fed-RAC: Resource-Aware Clustering for Tackling Heterogeneity of Participants in Federated Learning,\" in IEEE Transactions on Parallel and Distributed Systems, vol. 35, no. 7, pp. 1207-1220, July 2024, doi: 10.1109/TPDS.2024.3379933.[pdf]",
    "Rahul Mishra and Hari Prabhat Gupta. 2023. A Model Personalization-based Federated Learning Approach for Heterogeneous Participants with Variability in the Dataset. ACM Trans. Sen. Netw. 20, 1, Article 22 (January 2024), 28 pages. https://doi.org/10.1145/3629978.[pdf]",
    "R. Mishra and H. P. Gupta, \"Designing and Training of Lightweight Neural Networks on Edge Devices Using Early Halting in Knowledge Distillation,\" in IEEE Transactions on Mobile Computing, vol. 23, no. 5, pp. 4665-4677, May 2024, doi: 10.1109/TMC.2023.3297026.[pdf]"
  ],
  "conferences": [
    "Rahul Mishra and H.P. Gupta, \"i-Care: A Multi-Modal Data Integration Approach for Real-time Surveillance and Voice Assistance to Improve Infant Care\", 11th ACM International Conference on Systems for Energy-Efficient Buildings, Cities, and Transportation (BuildSys 2024 ), Nov 7 - 8, 2024 in Hangzhou, China   (Accepted Regular Paper).",
    "Rahul Mishra, and P. Anand, \"On Demand Reliability in the Internet of Things Enabled Sensors Networks\" 20th International Wireless Communications & Mobile Computing Conference (IWCMC 2024), May 27-31, 2024, in Ayia Napa, Cyprus. (Regular paper, Core B conference)",
    "Rahul Mishra and H.P. Gupta, \"A Federated Learning Approach to Minimize Communication Rounds Using Noise Rectification\" IEEE Wireless Communications and Networking Conference (WCNC), April 21 - 24, 2024 in Dubai, UAE   (Accepted)."
  ],
  "courses": [
    {
      "code": "CS244",
      "name": "Introduction to Data Science"
    },
    {
      "code": "CS2101",
      "name": "Algorithms"
    },
    {
      "code": "CS6109",
      "name": "Drone Data Processing"
    }
  ]
};

// --- State Variables ---
let profileData = {};
let activeTab = 'journals';
let isEditing = false;
let currentEditType = null; // 'experience', 'courses', 'patents', 'books', 'publications', 'conferences', 'awards', 'professional_bodies', 'researchInterests'
let currentEditIndex = null; // null for add, index number for edit

// --- Initialize App ---
async function init() {
    // 1. Try to load data from profile_data.json
    try {
        const response = await fetch('profile_data.json');
        if (response.ok) {
            profileData = await response.json();
            console.log("Loaded profile data from server profile_data.json");
        } else {
            throw new Error("Local profile_data.json load failed");
        }
    } catch (e) {
        console.warn("Could not load from server. Checking local storage fallback.", e);
        const cached = localStorage.getItem('rahul_mishra_profile_v2');
        if (cached) {
            try {
                profileData = JSON.parse(cached);
                console.log("Loaded profile data from localStorage");
            } catch (err) {
                console.error("Failed to parse cached localStorage data", err);
                profileData = DEFAULT_PROFILE;
            }
        } else {
            console.log("Loading default profile state");
            profileData = DEFAULT_PROFILE;
        }
    }

    // Initialize layout and UI components
    initTheme();
    renderAll();
    initTabs();
    initScrollAnimations();
    initAdminPortal();
}

// --- Render Core Function ---
function renderAll() {
    // Document Title
    document.title = `${profileData.name} | Faculty Portfolio`;
    
    // Header & Navigation
    setTextContent('nav-name', profileData.name);
    
    // Hero details
    setTextContent('hero-name', profileData.name);
    setTextContent('hero-designation', profileData.designation);
    setTextContent('hero-dept', `${profileData.department}, ${profileData.institution}`);
    setTextContent('hero-bio-text', profileData.about);
    
    // Contact Info
    setTextContent('contact-email-text', profileData.email);
    const emailLink = document.getElementById('contact-email');
    if (emailLink) emailLink.setAttribute('href', `mailto:${profileData.email}`);
    
    setTextContent('contact-phone-text', profileData.phone);
    
    // Hero Avatar
    const avatarWrapper = document.getElementById('hero-avatar-wrapper');
    if (avatarWrapper) {
        if (profileData.avatar) {
            avatarWrapper.innerHTML = `
                <img src="${profileData.avatar}" alt="${profileData.name}" class="avatar-image" onerror="handleAvatarError(this)">
            `;
        } else {
            renderAvatarFallback(avatarWrapper);
        }
    }

    // Dynamic Lists Rendering
    renderResearchInterests();
    renderExperience();
    renderPublications();
    renderPatentsAndBooks();
    renderCourses();
    renderAwards();
    renderMemberships();
    
    // Add inline blur listeners for contenteditables
    setupContentEditableListeners();
}

// --- Dynamic Content Renderers ---

function renderResearchInterests() {
    const container = document.getElementById('interests-tags-flex');
    if (!container) return;
    
    const interests = profileData.researchInterests || [];
    let html = interests.map((tag, idx) => `
        <span class="interest-tag" style="position:relative;">
            ${tag}
            <div class="editor-controls" style="top:-8px; right:-8px;">
                <div class="edit-cell-btn delete" onclick="deleteItem('researchInterests', ${idx})" title="Delete tag">✕</div>
            </div>
        </span>
    `).join('');
    
    // Add tag card
    html += `
        <div class="add-cell-card interest-tag" style="padding:0.35rem 1rem; border-radius:12px; min-height:auto;" onclick="openEditor('researchInterests')">
            <span style="font-size:0.9rem; font-weight:600; display:flex; align-items:center; gap:0.25rem;">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg> Add Area
            </span>
        </div>
    `;
    container.innerHTML = html;
}

function renderExperience() {
    const container = document.getElementById('timeline-experience');
    if (!container) return;
    
    const experience = profileData.experience || [];
    if (experience.length === 0 && !isEditing) {
        container.innerHTML = '<p style="color:var(--text-muted);">No experiences loaded.</p>';
        return;
    }
    
    let html = experience.map((exp, idx) => `
        <div class="timeline-item">
            <div class="timeline-node"></div>
            <div class="timeline-content">
                <div class="editor-controls">
                    <div class="edit-cell-btn" onclick="openEditor('experience', ${idx})" title="Edit Experience">✎</div>
                    <div class="edit-cell-btn delete" onclick="deleteItem('experience', ${idx})" title="Delete">✕</div>
                </div>
                <div class="timeline-header">
                    <span class="timeline-role">${exp.role}</span>
                    <span class="timeline-duration">${exp.duration}</span>
                </div>
                <div class="timeline-org">${exp.organization}</div>
            </div>
        </div>
    `).join('');
    
    // Add new timeline element button
    html += `
        <div class="add-cell-card" style="margin-left:0; min-height:75px;" onclick="openEditor('experience')">
            <div class="add-cell-content">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                <span>Add Professional Experience</span>
            </div>
        </div>
    `;
    container.innerHTML = html;
}

function renderPublications() {
    const container = document.getElementById('pub-list-container');
    if (!container) return;
    
    const key = activeTab === 'journals' ? 'publications' : 'conferences';
    const list = profileData[key] || [];
    
    // Update badge counts
    const jCount = document.getElementById('journal-count');
    if (jCount) jCount.textContent = (profileData.publications || []).length;
    const cCount = document.getElementById('conf-count');
    if (cCount) cCount.textContent = (profileData.conferences || []).length;
    
    if (list.length === 0 && !isEditing) {
        container.innerHTML = '<p style="color:var(--text-muted); padding: 2rem 0;">No publications found in this category.</p>';
        return;
    }
    
    let html = `<div class="pub-list">`;
    html += list.map((pub, idx) => `
        <div class="pub-card-cell" style="position:relative;">
            <div class="editor-controls">
                <div class="edit-cell-btn" onclick="openEditor('${key}', ${idx})" title="Edit Publication">✎</div>
                <div class="edit-cell-btn delete" onclick="deleteItem('${key}', ${idx})" title="Delete">✕</div>
            </div>
            <div class="pub-number">${idx + 1}</div>
            <div class="pub-body">
                <div class="pub-text">${formatCitationPdf(pub)}</div>
            </div>
        </div>
    `).join('');
    
    // Add publication button
    html += `
        <div class="add-cell-card" style="min-height:80px; padding: 1.5rem;" onclick="openEditor('${key}')">
            <div class="add-cell-content" style="flex-direction:row; gap:0.5rem;">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                <span>Add ${activeTab === 'journals' ? 'Journal/Publication' : 'Conference Citation'}</span>
            </div>
        </div>
    `;
    html += `</div>`;
    container.innerHTML = html;
}

function renderPatentsAndBooks() {
    const container = document.getElementById('patents-books-grid');
    if (!container) return;
    
    const patents = profileData.patents || [];
    const books = profileData.books || [];
    
    let html = '';
    
    // Render Books
    books.forEach((book, idx) => {
        html += `
            <div class="cell-card book-item">
                <div class="editor-controls">
                    <div class="edit-cell-btn" onclick="openEditor('books', ${idx})" title="Edit Book">✎</div>
                    <div class="edit-cell-btn delete" onclick="deleteItem('books', ${idx})" title="Delete">✕</div>
                </div>
                <div>
                    <div class="book-tag">Book / Textbook</div>
                    <h3>${book.title}</h3>
                </div>
                ${book.link ? `<a href="${book.link}" target="_blank" class="pub-link-btn">
                    View Resource 
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                </a>` : ''}
            </div>
        `;
    });
    
    // Add Book Card button
    html += `
        <div class="add-cell-card" onclick="openEditor('books')">
            <div class="add-cell-content">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                <span>Add Book Entry</span>
            </div>
        </div>
    `;

    // Render Patents
    patents.forEach((pat, idx) => {
        html += `
            <div class="cell-card patent-item">
                <div class="editor-controls">
                    <div class="edit-cell-btn" onclick="openEditor('patents', ${idx})" title="Edit Patent">✎</div>
                    <div class="edit-cell-btn delete" onclick="deleteItem('patents', ${idx})" title="Delete">✕</div>
                </div>
                <div>
                    <div class="patent-tag">Patent Filed</div>
                    <h3>${pat.title}</h3>
                </div>
                <span style="font-size:0.8rem; font-weight:600; background-color:var(--accent-light); color:var(--accent); border:1px solid var(--card-border); padding:0.2rem 0.6rem; border-radius:6px; width:fit-content; margin-top:auto;">Filed</span>
            </div>
        `;
    });
    
    // Add Patent Card button
    html += `
        <div class="add-cell-card" onclick="openEditor('patents')">
            <div class="add-cell-content">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                <span>Add Patent Entry</span>
            </div>
        </div>
    `;
    
    container.innerHTML = html;
}

function renderCourses() {
    const container = document.getElementById('courses-grid');
    if (!container) return;
    
    const courses = profileData.courses || [];
    let html = courses.map((course, idx) => `
        <div class="cell-card course-item">
            <div class="editor-controls">
                <div class="edit-cell-btn" onclick="openEditor('courses', ${idx})" title="Edit Course">✎</div>
                <div class="edit-cell-btn delete" onclick="deleteItem('courses', ${idx})" title="Delete">✕</div>
            </div>
            <div class="course-code">${course.code}</div>
            <h3>${course.name}</h3>
        </div>
    `).join('');
    
    // Add Course Card button
    html += `
        <div class="add-cell-card" onclick="openEditor('courses')">
            <div class="add-cell-content">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                <span>Add Course Entry</span>
            </div>
        </div>
    `;
    
    container.innerHTML = html;
}

function renderAwards() {
    const container = document.getElementById('awards-list');
    if (!container) return;
    
    const awards = profileData.awards || [];
    if (awards.length === 0 && !isEditing) {
        container.innerHTML = '<p style="color:var(--text-muted);">No awards listed.</p>';
        return;
    }
    
    let html = awards.map((award, idx) => `
        <div class="award-item" style="position:relative; width:100%;">
            <div class="editor-controls" style="top:5px; right:0;">
                <div class="edit-cell-btn" onclick="openEditor('awards', ${idx})" title="Edit Award">✎</div>
                <div class="edit-cell-btn delete" onclick="deleteItem('awards', ${idx})" title="Delete">✕</div>
            </div>
            <svg class="award-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="8" r="7"></circle>
                <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
            </svg>
            <div class="award-text">${award}</div>
        </div>
    `).join('');
    
    // Add Award button
    html += `
        <div class="add-cell-card" style="min-height:50px; padding:0.5rem;" onclick="openEditor('awards')">
            <div class="add-cell-content" style="flex-direction:row; gap:0.5rem;">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                <span>Add Award / Honour</span>
            </div>
        </div>
    `;
    container.innerHTML = html;
}

function renderMemberships() {
    const container = document.getElementById('memberships-list');
    if (!container) return;
    
    const memberships = profileData.professional_bodies || [];
    if (memberships.length === 0 && !isEditing) {
        container.innerHTML = '<p style="color:var(--text-muted);">No professional memberships listed.</p>';
        return;
    }
    
    let html = memberships.map((member, idx) => `
        <div class="membership-item" style="position:relative; width:100%;">
            <div class="editor-controls" style="top:5px; right:0;">
                <div class="edit-cell-btn" onclick="openEditor('professional_bodies', ${idx})" title="Edit Membership">✎</div>
                <div class="edit-cell-btn delete" onclick="deleteItem('professional_bodies', ${idx})" title="Delete">✕</div>
            </div>
            <svg class="membership-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
            <div class="membership-text">${member}</div>
        </div>
    `).join('');
    
    // Add Membership button
    html += `
        <div class="add-cell-card" style="min-height:50px; padding:0.5rem;" onclick="openEditor('professional_bodies')">
            <div class="add-cell-content" style="flex-direction:row; gap:0.5rem;">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                <span>Add Membership</span>
            </div>
        </div>
    `;
    container.innerHTML = html;
}

function formatCitationLinks(text) {
    if (!text) return '';
    
    // 1. Parse URLs (e.g. https://doi.org/10.1145/3629978)
    const urlRegex = /(https?:\/\/[^\s,;()]+)/gi;
    let formatted = text.replace(urlRegex, (url) => {
        let cleanUrl = url;
        let suffix = '';
        if (url.endsWith('.')) {
            cleanUrl = url.slice(0, -1);
            suffix = '.';
        }
        return `<a href="${cleanUrl}" target="_blank" style="color: var(--accent); text-decoration: underline; word-break: break-all;">${cleanUrl}</a>${suffix}`;
    });
    
    // 2. Parse raw DOIs (e.g. doi: 10.1109/TMC.2025.3530818)
    const doiRegex = /doi:\s*(10\.\d{4,9}\/[^\s,;()]+)/gi;
    formatted = formatted.replace(doiRegex, (match, doiGroup) => {
        if (match.includes('href=')) return match;
        
        let cleanDoi = doiGroup;
        let suffix = '';
        if (doiGroup.endsWith('.')) {
            cleanDoi = doiGroup.slice(0, -1);
            suffix = '.';
        }
        return `doi: <a href="https://doi.org/${cleanDoi}" target="_blank" style="color: var(--accent); text-decoration: underline; word-break: break-all;">${cleanDoi}</a>${suffix}`;
    });
    
    return formatted;
}

function formatCitationPdf(citationText) {
    if (!citationText) return '';
    // Strip [pdf] (with optional leading space) case insensitively
    let cleanText = citationText.replace(/\s*\[pdf\]/gi, '').trim();
    return formatCitationLinks(cleanText);
}

function handleAvatarError(img) {
    img.style.display = 'none';
    const parent = img.parentNode;
    renderAvatarFallback(parent);
}

function renderAvatarFallback(parent) {
    parent.innerHTML = `
        <div class="avatar-placeholder">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
            <span>${profileData.name || 'RM'}</span>
        </div>
    `;
}

function setTextContent(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text || '';
}

// --- Theme Management ---
function initTheme() {
    const savedTheme = localStorage.getItem('rahul_mishra_theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    const themeBtn = document.getElementById('theme-toggle-btn');
    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('rahul_mishra_theme', newTheme);
        });
    }
}

// --- Tab System ---
function initTabs() {
    const tabs = document.querySelectorAll('.tab-btn');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            activeTab = tab.getAttribute('data-tab');
            renderPublications();
        });
    });
}

// --- Scroll Animations ---
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('appear');
                observer.unobserve(entry.target); // Animates once
            }
        });
    }, observerOptions);

    // Initial hooks
    setTimeout(() => {
        document.querySelectorAll('.animate-on-scroll').forEach(el => {
            observer.observe(el);
        });
    }, 100);
}

// --- inline edit listeners ---
function setupContentEditableListeners() {
    const textBindings = [
        { id: 'hero-name', key: 'name' },
        { id: 'nav-name', key: 'name' },
        { id: 'hero-designation', key: 'designation' },
        { id: 'hero-dept', key: 'department' },
        { id: 'hero-bio-text', key: 'about' },
        { id: 'contact-email-text', key: 'email' },
        { id: 'contact-phone-text', key: 'phone' }
    ];

    textBindings.forEach(binding => {
        const el = document.getElementById(binding.id);
        if (el) {
            el.addEventListener('blur', () => {
                if (!isEditing) return;
                const value = el.innerText.trim();
                if (value) {
                    profileData[binding.key] = value;
                    // Keep header and hero name synced
                    if (binding.key === 'name') {
                        setTextContent('hero-name', value);
                        setTextContent('nav-name', value);
                    }
                    saveLocalState();
                }
            });
        }
    });
}

// --- Admin Portal Logic (Modal / Password) ---
function initAdminPortal() {
    const trigger = document.getElementById('admin-trigger-lock');
    const overlay = document.getElementById('login-modal-overlay');
    const cancelBtn = document.getElementById('login-cancel-btn');
    const submitBtn = document.getElementById('login-submit-btn');
    const pwdInput = document.getElementById('admin-password-input');
    const errorMsg = document.getElementById('login-error-msg');
    
    // Sticky Banner elements
    const stickyBanner = document.getElementById('admin-sticky-banner');
    const saveBtn = document.getElementById('admin-save-btn');
    const passwordBtn = document.getElementById('admin-password-btn');
    const exitBtn = document.getElementById('admin-exit-btn');

    if (trigger) {
        trigger.addEventListener('click', () => {
            if (isEditing) {
                exitEditMode();
            } else {
                overlay.classList.add('active');
                pwdInput.focus();
            }
        });
    }

    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            overlay.classList.remove('active');
            pwdInput.value = '';
            errorMsg.style.display = 'none';
        });
    }

    if (submitBtn) {
        submitBtn.addEventListener('click', handleAuth);
    }
    
    if (pwdInput) {
        pwdInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') handleAuth();
        });
    }

    function handleAuth() {
        const pwd = pwdInput.value;
        if (pwd === (profileData.admin_password || 'iitp@123')) {
            overlay.classList.remove('active');
            pwdInput.value = '';
            errorMsg.style.display = 'none';
            enterEditMode();
        } else {
            errorMsg.style.display = 'block';
            pwdInput.select();
        }
    }

    function enterEditMode() {
        isEditing = true;
        document.body.classList.add('editing-active');
        stickyBanner.classList.add('active');
        
        // Enable Content Editables
        document.querySelectorAll('[contenteditable]').forEach(el => {
            el.setAttribute('contenteditable', 'true');
        });
        
        // Re-render arrays to load buttons
        renderAll();
    }

    function exitEditMode() {
        isEditing = false;
        document.body.classList.remove('editing-active');
        stickyBanner.classList.remove('active');
        
        // Disable Content Editables
        document.querySelectorAll('[contenteditable]').forEach(el => {
            el.setAttribute('contenteditable', 'false');
        });
        
        // Re-render to clear buttons
        renderAll();
    }

    if (exitBtn) {
        exitBtn.addEventListener('click', exitEditMode);
    }

    if (passwordBtn) {
        passwordBtn.addEventListener('click', () => openEditor('password'));
    }

    if (saveBtn) {
        saveBtn.addEventListener('click', () => {
            saveLocalState();
            exportJsonFile();
            alert("Changes saved locally! Your updated 'profile_data.json' has been downloaded. Overwrite the 'profile_data.json' in your V2 folder with this file to make it permanent.");
        });
    }

    // Modal Editor Listeners
    const editorCancel = document.getElementById('editor-cancel-btn');
    const editorForm = document.getElementById('editor-modal-form');
    
    if (editorCancel) {
        editorCancel.addEventListener('click', closeEditor);
    }
    
    if (editorForm) {
        editorForm.addEventListener('submit', saveEditorEntry);
    }
}

// --- Dynamic Modal Editor System ---

function openEditor(type, index = null) {
    currentEditType = type;
    currentEditIndex = index;
    
    const overlay = document.getElementById('editor-modal-overlay');
    const title = document.getElementById('editor-modal-title');
    const fieldsContainer = document.getElementById('editor-form-fields');
    
    if (!overlay || !fieldsContainer) return;
    
    // Set Title
    let titleText = '';
    if (type === 'password') {
        titleText = 'Change Admin Password';
    } else {
        const modeText = index === null ? 'Add' : 'Edit';
        let typeText = type;
        if (type === 'experience') typeText = 'Professional Experience';
        else if (type === 'courses') typeText = 'Course';
        else if (type === 'publications') typeText = 'Journal / Publication';
        else if (type === 'conferences') typeText = 'Conference Publication';
        else if (type === 'books') typeText = 'Book / Textbook';
        else if (type === 'patents') typeText = 'Patent';
        else if (type === 'awards') typeText = 'Award / Honour';
        else if (type === 'professional_bodies') typeText = 'Membership';
        else if (type === 'researchInterests') typeText = 'Research Area';
        titleText = `${modeText} ${typeText}`;
    }
    title.textContent = titleText;
    
    // Fetch values if edit mode
    let val = {};
    if (index !== null) {
        val = profileData[type][index];
    }
    
    // Build Form Content
    let fieldsHtml = '';
    
    if (type === 'experience') {
        fieldsHtml = `
            <div class="input-group">
                <label class="input-label">Role / Designation</label>
                <input type="text" id="form-exp-role" class="input-field" value="${val.role || ''}" required placeholder="e.g. Assistant Professor">
            </div>
            <div class="input-group">
                <label class="input-label">Organization / University</label>
                <input type="text" id="form-exp-org" class="input-field" value="${val.organization || ''}" required placeholder="e.g. DA-IICT Gandhinagar">
            </div>
            <div class="input-group">
                <label class="input-label">Duration</label>
                <input type="text" id="form-exp-dur" class="input-field" value="${val.duration || ''}" required placeholder="e.g. Dec 2022 - Feb 2024">
            </div>
        `;
    } else if (type === 'courses') {
        fieldsHtml = `
            <div class="input-group">
                <label class="input-label">Course Code</label>
                <input type="text" id="form-course-code" class="input-field" value="${val.code || ''}" required placeholder="e.g. CS244">
            </div>
            <div class="input-group">
                <label class="input-label">Course Name</label>
                <input type="text" id="form-course-name" class="input-field" value="${val.name || ''}" required placeholder="e.g. Algorithms">
            </div>
        `;
    } else if (type === 'books') {
        fieldsHtml = `
            <div class="input-group">
                <label class="input-label">Book Title & Details</label>
                <input type="text" id="form-book-title" class="input-field" value="${val.title || ''}" required placeholder="e.g. AICTE Textbook on Design and Analysis of Algorithm (Link)">
            </div>
            <div class="input-group">
                <label class="input-label">Hyperlink URL (Optional)</label>
                <input type="url" id="form-book-link" class="input-field" value="${val.link || ''}" placeholder="e.g. https://ekumbh.aicte-india.org/book.php">
            </div>
        `;
    } else if (type === 'patents') {
        fieldsHtml = `
            <div class="input-group">
                <label class="input-label">Patent Citation / Details</label>
                <textarea id="form-patent-title" class="input-field" rows="4" required placeholder="Authors, Title, Patent no. etc.">${val.title || ''}</textarea>
            </div>
        `;
    } else if (type === 'publications' || type === 'conferences') {
        // String arrays
        const citation = index === null ? '' : profileData[type][index];
        fieldsHtml = `
            <div class="input-group">
                <label class="input-label">Citation Entry Text</label>
                <textarea id="form-pub-citation" class="input-field" rows="5" required placeholder="Authors, Title, Journal Name, vol, pp, Year, doi, [pdf]">${citation}</textarea>
            </div>
        `;
    } else if (type === 'awards' || type === 'professional_bodies') {
        const itemText = index === null ? '' : profileData[type][index];
        fieldsHtml = `
            <div class="input-group">
                <label class="input-label">Entry Text</label>
                <input type="text" id="form-single-text" class="input-field" value="${itemText}" required placeholder="e.g. IEEE Member">
            </div>
        `;
    } else if (type === 'researchInterests') {
        const tagText = index === null ? '' : profileData.researchInterests[index];
        fieldsHtml = `
            <div class="input-group">
                <label class="input-label">Research Field Tag</label>
                <input type="text" id="form-tag-text" class="input-field" value="${tagText}" required placeholder="e.g. Deep Learning">
            </div>
        `;
    } else if (type === 'password') {
        fieldsHtml = `
            <div class="input-group">
                <label class="input-label">New Admin Password</label>
                <input type="text" id="form-admin-pwd" class="input-field" value="${profileData.admin_password || ''}" required placeholder="e.g. iitp@123">
            </div>
        `;
    }
    
    fieldsContainer.innerHTML = fieldsHtml;
    overlay.classList.add('active');
}

function closeEditor() {
    const overlay = document.getElementById('editor-modal-overlay');
    if (overlay) overlay.classList.remove('active');
    currentEditType = null;
    currentEditIndex = null;
}

function saveEditorEntry(e) {
    if (e) e.preventDefault();
    
    const type = currentEditType;
    const index = currentEditIndex;
    
    if (type === 'password') {
        const newPwd = document.getElementById('form-admin-pwd').value.trim();
        if (newPwd) {
            profileData.admin_password = newPwd;
            saveLocalState();
            alert("Password updated in memory! Remember to click 'Save Changes' to download your new configuration file.");
            closeEditor();
        }
        return;
    }
    
    let entry = null;
    
    // Fetch values based on type
    if (type === 'experience') {
        entry = {
            role: document.getElementById('form-exp-role').value.trim(),
            organization: document.getElementById('form-exp-org').value.trim(),
            duration: document.getElementById('form-exp-dur').value.trim()
        };
    } else if (type === 'courses') {
        entry = {
            code: document.getElementById('form-course-code').value.trim(),
            name: document.getElementById('form-course-name').value.trim()
        };
    } else if (type === 'books') {
        entry = {
            title: document.getElementById('form-book-title').value.trim(),
            link: document.getElementById('form-book-link').value.trim()
        };
    } else if (type === 'patents') {
        entry = {
            title: document.getElementById('form-patent-title').value.trim()
        };
    } else if (type === 'publications' || type === 'conferences') {
        entry = document.getElementById('form-pub-citation').value.trim();
    } else if (type === 'awards' || type === 'professional_bodies') {
        entry = document.getElementById('form-single-text').value.trim();
    } else if (type === 'researchInterests') {
        entry = document.getElementById('form-tag-text').value.trim();
    }
    
    if (!entry) return;
    
    // Save to profileData
    if (!profileData[type]) profileData[type] = [];
    
    if (index === null) {
        // Add
        profileData[type].push(entry);
    } else {
        // Update
        profileData[type][index] = entry;
    }
    
    saveLocalState();
    renderAll();
    closeEditor();
}

function deleteItem(type, index) {
    if (!confirm('Are you sure you want to delete this entry?')) return;
    
    if (profileData[type] && profileData[type][index] !== undefined) {
        profileData[type].splice(index, 1);
        saveLocalState();
        renderAll();
    }
}

// --- Data Synchronization Helpers ---

function saveLocalState() {
    localStorage.setItem('rahul_mishra_profile_v2', JSON.stringify(profileData));
}

function exportJsonFile() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(profileData, null, 2));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", "profile_data.json");
    dlAnchorElem.click();
}

function importJsonFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(evt) {
        try {
            const imported = JSON.parse(evt.target.result);
            if (imported.name && imported.admin_password) {
                profileData = imported;
                saveLocalState();
                renderAll();
                alert("Profile data imported successfully and refreshed!");
            } else {
                alert("Invalid profile JSON format. Make sure it contains 'name' and 'admin_password'.");
            }
        } catch (err) {
            alert("Failed to parse JSON file.");
            console.error(err);
        }
    };
    reader.readAsText(file);
}

// Expose editor methods globally so they are accessible by inline HTML onclick handlers
window.openEditor = openEditor;
window.deleteItem = deleteItem;
window.handleAvatarError = handleAvatarError;

// --- Start the App ---
window.addEventListener('DOMContentLoaded', init);
