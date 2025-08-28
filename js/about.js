// Form validation
$(document).ready(function() {
    $('#feedbackForm').submit(function (e) {
        e.preventDefault();
        
        // Reset previous validation states
        $('.form-control').removeClass('is-invalid');
        $('.invalid-feedback').hide();
        
        let isValid = true;
        
        // Email validation
        const email = $('#email').val();
        if (!email || email.indexOf('@') === -1) {
            $('#email').addClass('is-invalid');
            isValid = false;
        }
        
        // Name validation
        const name = $('#name').val();
        if (!name) {
            $('#name').addClass('is-invalid');
            isValid = false;
        }
        
        // Feedback type validation
        const feedbackType = $('#feedbackType').val();
        if (!feedbackType) {
            $('#feedbackType').addClass('is-invalid');
            isValid = false;
        }
        
        // Message validation
        const message = $('#message').val();
        if (!message) {
            $('#message').addClass('is-invalid');
            isValid = false;
        }
        
        if (isValid) {
            // Form is valid, proceed with submission
            alert('Thank you for your feedback!');
            $('#feedbackForm')[0].reset();
        }
    });
    
    // Remove invalid state when user starts typing/selecting
    $('.form-control').on('input change', function() {
        $(this).removeClass('is-invalid');
    });
    
    // Add hover effect to team cards
    const teamCards = document.querySelectorAll('.team-card');
    
    teamCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
});