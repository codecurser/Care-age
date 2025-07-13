// DOM Elements
const modalOverlay = document.getElementById('modalOverlay');
const triggerModal = document.getElementById('triggerModal');
const closeModal = document.getElementById('closeModal');
const scrollIndicator = document.querySelector('.scroll-indicator');
const body = document.body;

// Form elements
const loginToggle = document.getElementById('loginToggle');
const signupToggle = document.getElementById('signupToggle');
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const formTitle = document.getElementById('formTitle');
const formSubtitle = document.getElementById('formSubtitle');
const signupPrompt = document.getElementById('signupPrompt');
const loginPrompt = document.getElementById('loginPrompt');
const showSignupLink = document.getElementById('showSignupLink');
const showLoginLink = document.getElementById('showLoginLink');

// Modal state
let isModalOpen = false;

// Google Sheets configuration
const scriptURL = "https://script.google.com/macros/s/AKfycbwdPVjpSPQZ5gbaYv3ObV6W58ib9cZYrSVk_qJ8ElOBR1ez2EhVUEL_VDso_R6QSqXS/exec";

// Form switching functionality
const switchToSignup = () => {
  loginToggle.classList.remove('active');
  signupToggle.classList.add('active');
  loginForm.classList.remove('active');
  signupForm.classList.add('active');
  formTitle.textContent = 'Create Account';
  formSubtitle.textContent = 'Join Care Age for professional senior care services';
  signupPrompt.style.display = 'none';
  loginPrompt.style.display = 'block';
};

const switchToLogin = () => {
  signupToggle.classList.remove('active');
  loginToggle.classList.add('active');
  signupForm.classList.remove('active');
  loginForm.classList.add('active');
  formTitle.textContent = 'Welcome Back';
  formSubtitle.textContent = 'Sign in to access your personalized care dashboard';
  loginPrompt.style.display = 'none';
  signupPrompt.style.display = 'block';
};

// Event listeners for form switching
loginToggle.addEventListener('click', switchToLogin);
signupToggle.addEventListener('click', switchToSignup);
showSignupLink.addEventListener('click', (e) => {
  e.preventDefault();
  switchToSignup();
});
showLoginLink.addEventListener('click', (e) => {
  e.preventDefault();
  switchToLogin();
});

// Open modal function
const openModal = () => {
  if (isModalOpen) return;
  
  isModalOpen = true;
  modalOverlay.classList.add('active');
  body.style.overflow = 'hidden';
  
  // Add entrance animation
  setTimeout(() => {
    modalOverlay.style.opacity = '1';
  }, 10);
};

// Close modal function
const closeModalFunc = () => {
  if (!isModalOpen) return;
  
  isModalOpen = false;
  modalOverlay.classList.remove('active');
  body.style.overflow = '';
  
  // Reset forms
  const forms = document.querySelectorAll('.login-form, .signup-form');
  forms.forEach(form => {
    form.reset();
  });
  
  // Reset to login form
  switchToLogin();
};

// Event listeners
triggerModal.addEventListener('click', openModal);
closeModal.addEventListener('click', closeModalFunc);

// Close modal when clicking outside
modalOverlay.addEventListener('click', (e) => {
  if (e.target === modalOverlay) {
    closeModalFunc();
  }
});

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && isModalOpen) {
    closeModalFunc();
  }
});

// Scroll indicator functionality
let scrollIndicatorVisible = true;

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  const windowHeight = window.innerHeight;
  
  // Hide scroll indicator when scrolled down
  if (scrollY > windowHeight * 0.3 && scrollIndicatorVisible) {
    scrollIndicator.style.opacity = '0';
    scrollIndicator.style.transform = 'translateX(-50%) translateY(20px)';
    scrollIndicatorVisible = false;
  } else if (scrollY <= windowHeight * 0.3 && !scrollIndicatorVisible) {
    scrollIndicator.style.opacity = '0.8';
    scrollIndicator.style.transform = 'translateX(-50%) translateY(0)';
    scrollIndicatorVisible = true;
  }
  
  // Auto-open modal when scrolled to bottom
  if (scrollY > windowHeight * 0.8 && !isModalOpen) {
    openModal();
  }
});

// Password strength checker
const checkPasswordStrength = (password) => {
  let strength = 0;
  let feedback = [];
  
  if (password.length >= 8) strength += 1;
  else feedback.push('At least 8 characters');
  
  if (/[a-z]/.test(password)) strength += 1;
  else feedback.push('Include lowercase letter');
  
  if (/[A-Z]/.test(password)) strength += 1;
  else feedback.push('Include uppercase letter');
  
  if (/[0-9]/.test(password)) strength += 1;
  else feedback.push('Include number');
  
  if (/[^A-Za-z0-9]/.test(password)) strength += 1;
  else feedback.push('Include special character');
  
  return { strength, feedback };
};

// Form validation and enhancement
document.addEventListener('DOMContentLoaded', () => {
  const allInputs = document.querySelectorAll('input[type="text"], input[type="email"], input[type="password"], input[type="tel"]');
  
  allInputs.forEach(input => {
    // Add focus effects
    input.addEventListener('focus', () => {
      input.parentElement.classList.add('focused');
    });
    
    input.addEventListener('blur', () => {
      input.parentElement.classList.remove('focused');
      
      // Basic validation
      if (input.value.trim() === '') {
        input.classList.add('error');
        input.classList.remove('success');
      } else {
        input.classList.remove('error');
        input.classList.add('success');
      }
    });
    
    // Real-time validation
    input.addEventListener('input', () => {
      if (input.value.trim() !== '') {
        input.classList.remove('error');
        input.classList.add('success');
      } else {
        input.classList.remove('success');
      }
    });
  });
  
  // Password strength indicator for signup
  const signupPassword = document.getElementById('signupPassword');
  const signupConfirmPassword = document.getElementById('signupConfirmPassword');
  
  if (signupPassword) {
    signupPassword.addEventListener('input', () => {
      const password = signupPassword.value;
      const { strength, feedback } = checkPasswordStrength(password);
      
      // Remove existing strength indicator
      const existingIndicator = signupPassword.parentElement.querySelector('.password-strength');
      if (existingIndicator) {
        existingIndicator.remove();
      }
      
      if (password.length > 0) {
        const strengthIndicator = document.createElement('div');
        strengthIndicator.className = 'password-strength';
        
        let strengthText = '';
        let strengthClass = '';
        
        if (strength <= 2) {
          strengthText = 'Weak';
          strengthClass = 'strength-weak';
        } else if (strength <= 3) {
          strengthText = 'Fair';
          strengthClass = 'strength-fair';
        } else if (strength <= 4) {
          strengthText = 'Good';
          strengthClass = 'strength-good';
        } else {
          strengthText = 'Strong';
          strengthClass = 'strength-strong';
        }
        
        strengthIndicator.innerHTML = `
          <div>Password strength: <span style="color: ${strengthClass.includes('weak') ? '#ef4444' : strengthClass.includes('fair') ? '#f59e0b' : '#10b981'}">${strengthText}</span></div>
          <div class="strength-bar">
            <div class="strength-fill ${strengthClass}"></div>
          </div>
        `;
        
        signupPassword.parentElement.appendChild(strengthIndicator);
      }
    });
  }
  
  // Confirm password validation
  if (signupConfirmPassword) {
    signupConfirmPassword.addEventListener('input', () => {
      const password = signupPassword.value;
      const confirmPassword = signupConfirmPassword.value;
      
      if (confirmPassword.length > 0) {
        if (password === confirmPassword) {
          signupConfirmPassword.classList.remove('error');
          signupConfirmPassword.classList.add('success');
        } else {
          signupConfirmPassword.classList.remove('success');
          signupConfirmPassword.classList.add('error');
        }
      }
    });
  }
  
  // Checkbox functionality
  const checkboxes = document.querySelectorAll('.checkbox-input');
  checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', () => {
      const customCheckbox = checkbox.nextElementSibling;
      if (checkbox.checked) {
        customCheckbox.style.transform = 'scale(1.1)';
        setTimeout(() => {
          customCheckbox.style.transform = 'scale(1)';
        }, 150);
      }
    });
  });
});

// Smooth scroll for better UX
const smoothScrollTo = (target) => {
  const element = document.querySelector(target);
  if (element) {
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }
};

// Enhanced form submission with proper redirect
const enhanceFormSubmission = () => {
  // Login form submission
  const loginFormElement = document.getElementById('loginForm');
  if (loginFormElement) {
    loginFormElement.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const submitButton = loginFormElement.querySelector('.login-button');
      const originalContent = submitButton.innerHTML;
      
      // Show loading state
      submitButton.innerHTML = `
        <svg class="loading-spinner" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 12a9 9 0 11-6.219-8.56"/>
        </svg>
        <span>Signing In...</span>
      `;
      submitButton.disabled = true;
      
      try {
        // Get form data
        const formData = new FormData(loginFormElement);
        const email = formData.get('email');
        const password = formData.get('password');
        
        // Basic validation
        if (!email || !password) {
          showNotification('Please fill in all fields', 'error');
          submitButton.innerHTML = originalContent;
          submitButton.disabled = false;
          return;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          showNotification('Please enter a valid email address', 'error');
          submitButton.innerHTML = originalContent;
          submitButton.disabled = false;
          return;
        }
        
        // Submit to Google Sheets
        const response = await fetch(scriptURL, {
          method: 'POST',
          body: formData
        });
        
        if (response.ok) {
          // Show success message
          showNotification('Successfully signed in! Redirecting to dashboard...', 'success');
          
          // Reset button
          submitButton.innerHTML = originalContent;
          submitButton.disabled = false;
          
          // Close modal after delay
          setTimeout(() => {
            closeModalFunc();
          }, 1500);
          
          // Redirect to home page after a short delay
          setTimeout(() => {
            window.location.href = '/html/home.html';
          }, 2000);
          
        } else {
          throw new Error('Network response was not ok');
        }
        
      } catch (error) {
        console.error('Error!', error.message);
        showNotification('An error occurred. Please try again.', 'error');
        submitButton.innerHTML = originalContent;
        submitButton.disabled = false;
      }
    });
  }
  
  // Signup form submission
  const signupFormElement = document.getElementById('signupForm');
  if (signupFormElement) {
    signupFormElement.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const submitButton = signupFormElement.querySelector('.login-button');
      const originalContent = submitButton.innerHTML;
      
      // Show loading state
      submitButton.innerHTML = `
        <svg class="loading-spinner" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 12a9 9 0 11-6.219-8.56"/>
        </svg>
        <span>Creating Account...</span>
      `;
      submitButton.disabled = true;
      
      try {
        // Get form data
        const formData = new FormData(signupFormElement);
        const name = formData.get('name');
        const email = formData.get('email');
        const phone = formData.get('phone');
        const password = formData.get('password');
        const confirmPassword = formData.get('confirmPassword');
        const termsAccepted = document.getElementById('termsCheckbox').checked;
        
        // Basic validation
        if (!name || !email || !phone || !password || !confirmPassword) {
          showNotification('Please fill in all fields', 'error');
          submitButton.innerHTML = originalContent;
          submitButton.disabled = false;
          return;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          showNotification('Please enter a valid email address', 'error');
          submitButton.innerHTML = originalContent;
          submitButton.disabled = false;
          return;
        }
        
        // Password validation
        if (password !== confirmPassword) {
          showNotification('Passwords do not match', 'error');
          submitButton.innerHTML = originalContent;
          submitButton.disabled = false;
          return;
        }
        
        // Password strength validation
        const { strength } = checkPasswordStrength(password);
        if (strength < 3) {
          showNotification('Password is too weak. Please choose a stronger password.', 'error');
          submitButton.innerHTML = originalContent;
          submitButton.disabled = false;
          return;
        }
        
        // Terms validation
        if (!termsAccepted) {
          showNotification('Please accept the Terms & Conditions', 'error');
          submitButton.innerHTML = originalContent;
          submitButton.disabled = false;
          return;
        }
        
        // Submit to Google Sheets
        const response = await fetch(scriptURL, {
          method: 'POST',
          body: formData
        });
        
        if (response.ok) {
          // Show success message
          showNotification('Account created successfully! Redirecting to dashboard...', 'success');
          
          // Reset button
          submitButton.innerHTML = originalContent;
          submitButton.disabled = false;
          
          // Close modal after delay
          setTimeout(() => {
            closeModalFunc();
          }, 1500);
          
          // Redirect to home page after a short delay
          setTimeout(() => {
            window.location.href = '/html/home.html';
          }, 2000);
          
        } else {
          throw new Error('Network response was not ok');
        }
        
      } catch (error) {
        console.error('Error!', error.message);
        showNotification('An error occurred. Please try again.', 'error');
        submitButton.innerHTML = originalContent;
        submitButton.disabled = false;
      }
    });
  }
};

// Enhanced notification system
const showNotification = (message, type = 'info') => {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  
  const icon = type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ';
  const bgColor = type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6';
  
  notification.innerHTML = `
    <div class="notification-content">
      <div class="notification-icon">${icon}</div>
      <span class="notification-message">${message}</span>
      <button class="notification-close">&times;</button>
    </div>
  `;
  
  // Add styles
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${bgColor};
    color: white;
    padding: 1rem 1.5rem;
    border-radius: 12px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
    z-index: 10000;
    transform: translateX(100%);
    transition: all 0.3s ease;
    max-width: 350px;
    font-family: 'Inter', sans-serif;
  `;
  
  document.body.appendChild(notification);
  
  // Animate in
  setTimeout(() => {
    notification.style.transform = 'translateX(0)';
  }, 100);
  
  // Auto remove after 5 seconds
  setTimeout(() => {
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification);
      }
    }, 300);
  }, 5000);
  
  // Close button functionality
  const closeBtn = notification.querySelector('.notification-close');
  closeBtn.addEventListener('click', () => {
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification);
      }
    }, 300);
  });
};

// Initialize enhancements
document.addEventListener('DOMContentLoaded', () => {
  enhanceFormSubmission();
  
  // Add CSS for enhanced styling
  const style = document.createElement('style');
  style.textContent = `
    .loading-spinner {
      animation: spin 1s linear infinite;
      width: 20px;
      height: 20px;
    }
    
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    
    .input-wrapper.focused {
      transform: scale(1.02);
    }
    
    .input-wrapper input.error {
      border-color: #ef4444;
      box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.1);
    }
    
    .notification-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
    }
    
    .notification-icon {
      font-size: 1.25rem;
      font-weight: bold;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 50%;
      flex-shrink: 0;
    }
    
    .notification-message {
      flex: 1;
      font-size: 0.875rem;
      font-weight: 500;
    }
    
    .notification-close {
      background: none;
      border: none;
      color: white;
      font-size: 1.5rem;
      cursor: pointer;
      padding: 0;
      line-height: 1;
      opacity: 0.8;
      transition: opacity 0.3s ease;
    }
    
    .notification-close:hover {
      opacity: 1;
    }
    
    /* Enhanced animations */
    @keyframes slideInRight {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    
    @keyframes slideOutRight {
      from {
        transform: translateX(0);
        opacity: 1;
      }
      to {
        transform: translateX(100%);
        opacity: 0;
      }
    }
    
    /* Floating animation for cards */
    .floating-card {
      transition: all 0.3s ease;
    }
    
    .floating-card:hover {
      transform: translateY(-10px) scale(1.05);
      box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
    }
    
    /* Enhanced button hover effects */
    .login-button:hover {
      transform: translateY(-3px);
      box-shadow: 0 15px 35px rgba(102, 126, 234, 0.4);
    }
    
    .trigger-button:hover {
      transform: translateY(-5px);
      box-shadow: 0 20px 40px rgba(102, 126, 234, 0.5);
    }
  `;
  document.head.appendChild(style);
});

// Performance optimization: Debounce scroll events
let scrollTimeout;
window.addEventListener('scroll', () => {
  clearTimeout(scrollTimeout);
  scrollTimeout = setTimeout(() => {
    // Scroll handling logic here
  }, 10);
});

// Add smooth page transitions
document.addEventListener('DOMContentLoaded', () => {
  // Add page transition effect
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.5s ease';
  
  setTimeout(() => {
    document.body.style.opacity = '1';
  }, 100);
});

// Enhanced accessibility
document.addEventListener('DOMContentLoaded', () => {
  // Add keyboard navigation
  const focusableElements = document.querySelectorAll('button, input, a, [tabindex]:not([tabindex="-1"])');
  
  focusableElements.forEach(element => {
    element.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        element.click();
      }
    });
  });
});