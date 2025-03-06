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
  })()





    document.addEventListener("DOMContentLoaded", function () {
        flatpickr("#checkin", {
            minDate: "today",
            dateFormat: "Y-m-d",
            onChange: function(selectedDates, dateStr) {
                let minCheckout = new Date(selectedDates[0]);
                minCheckout.setDate(minCheckout.getDate() + 2); // Minimum stay of 2 nights
                flatpickr("#checkout", {
                    minDate: minCheckout,
                    dateFormat: "Y-m-d"
                });
            }
        });

        flatpickr("#checkout", {
            minDate: new Date().fp_incr(2), // Enforce minimum 2-night stay
            dateFormat: "Y-m-d"
        });
    });

