/**
 * Doggy Star - Interactive Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    initOpeningHoursBadge();
    initNavbarAutoClose();
});

/**
 * Updates the 'Open/Closed' badge in the footer based on current time.
 * Hours: Mon-Fri 09:00 - 18:00, Sat 09:00 - 13:00, Sun Closed.
 */
function initOpeningHoursBadge() {
    const badge = document.getElementById('status-badge');
    const now = new Date();
    const day = now.getDay(); // 0 = Sunday, 1 = Monday, ...
    const hour = now.getHours();
    const minute = now.getMinutes();
    
    // Helper to check if currently open
    // Mon(1) - Fri(5): 9-18
    // Sat(6): 9-13
    // Sun(0): Closed
    
    let isOpen = false;
    
    if (day >= 1 && day <= 5) {
        // Weekdays: 9:00 to 18:00 (exclusive of 18:00)
        if (hour >= 9 && hour < 18) {
            isOpen = true;
        }
    } else if (day === 6) {
        // Saturday: 9:00 to 13:00 (exclusive of 13:00)
        if (hour >= 9 && hour < 13) {
            isOpen = true;
        }
    }
    // Sunday is always closed (isOpen starts false)

    updateBadgeUI(badge, isOpen);
}

function updateBadgeUI(element, isOpen) {
    // Remove all semantic classes
    element.className = 'badge rounded-pill px-3 py-2 fs-6'; // Reset base classes (Bootstrap classes)
    
    if (isOpen) {
        element.classList.add('text-bg-success'); // Bootstrap 5 helper for white text on green
        element.innerHTML = '<i class="fa-solid fa-door-open me-2"></i>ORA SIAMO APERTI';
    } else {
        element.classList.add('text-bg-danger'); // Bootstrap 5 helper for white text on red
        element.innerHTML = '<i class="fa-solid fa-door-closed me-2"></i>CHIUSI';
    }
}

/**
 * Visual Enhancement:
 * Closes the mobile navbar when a link is clicked.
 */
function initNavbarAutoClose() {
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link:not(.dropdown-toggle)');
    const navbarCollapse = document.getElementById('navbarNav');
    
    // Bootstrap instance for the collapse element
    // We check if the element exists and is visible before trying to logic it
    
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navbarCollapse.classList.contains('show')) {
                // Use Bootstrap 5 API to toggle
                const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
                if (bsCollapse) {
                    bsCollapse.hide();
                }
            }
        });
    });
}
