(() => {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }

      form.classList.add('was-validated')
    }, false)
  })

  // Dark Mode Logic
  const toggle = document.getElementById('darkModeToggle');
  const icon = document.querySelector('.form-check-label i');

  if (toggle && icon) {
    const currentTheme = localStorage.getItem('theme');

    if (currentTheme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
      toggle.checked = true;
      icon.classList.remove('fa-moon');
      icon.classList.add('fa-sun');
    }

    toggle.addEventListener('change', function (e) {
      if (e.target.checked) {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
      } else {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
      }
    });
  }
})()