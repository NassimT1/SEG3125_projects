document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const target = document.querySelector(this.getAttribute('href'));
            const headerHeight = document.querySelector('.header').offsetHeight; // Get the height of the header
            const offset = headerHeight; // Add 20px extra padding
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        });
    });

    // Confirmation page logic
    if (document.getElementById('confirmationText')) {
        const urlParams = new URLSearchParams(window.location.search);
        const barber = urlParams.get('barber');
        const services = urlParams.getAll('service').join(', '); // Get all selected services as a comma-separated string
        const time = urlParams.get('time');
        const date = urlParams.get('date');

        const confirmationText = document.getElementById('confirmationText');

        // Create separate spans for each detail
        const barberSpan = document.createElement('span');
        barberSpan.textContent = barber;
        barberSpan.classList.add('fw-bolder'); // Apply Bootstrap's bolder weight

        const servicesSpan = document.createElement('span');
        servicesSpan.textContent = services;
        servicesSpan.classList.add('fw-bolder');

        const timeSpan = document.createElement('span');
        timeSpan.textContent = time;
        timeSpan.classList.add('fw-bolder');

        const dateSpan = document.createElement('span');
        dateSpan.textContent = date;
        dateSpan.classList.add('fw-bolder');

        // Build the confirmation message string
        const confirmationString = `Your appointment with ${barberSpan.outerHTML} has been confirmed for ${timeSpan.outerHTML} on ${dateSpan.outerHTML}.`;

        confirmationText.innerHTML = confirmationString;
    }

    // Booking page logic
    $(document).ready(function() {
        // Initialize the datepicker
        $('.datepicker').datepicker({
            format: 'mm/dd/yyyy',
            startDate: '0d',
            autoclose: true
        });

        // Populate time slots based on selected date
        $('#date').on('changeDate', function() {
            var selectedDate = $(this).datepicker('getDate');
            var dayOfWeek = selectedDate.getUTCDay();
            var timeSelect = $('#time');
            timeSelect.empty();

            var openingTime, closingTime;
            if (dayOfWeek >= 1 && dayOfWeek <= 5) {
                // Monday to Friday
                openingTime = 8;  // 8 AM
                closingTime = 20; // 8 PM
            } else {
                // Saturday and Sunday
                openingTime = 9;  // 9 AM
                closingTime = 17; // 5 PM
            }

            for (var hour = openingTime; hour < closingTime; hour++) {
                for (var min = 0; min < 60; min += 30) {
                    var time = (hour < 10 ? '0' : '') + hour + ':' + (min == 0 ? '00' : min);
                    var period = hour < 12 ? 'AM' : 'PM';
                    var displayHour = hour % 12;
                    displayHour = displayHour ? displayHour : 12; // The hour '0' should be '12'
                    var displayTime = displayHour + ':' + (min == 0 ? '00' : min) + ' ' + period;
                    timeSelect.append($('<option></option>').attr('value', time).text(displayTime));
                }
            }
        });
    });

    const services = {
        "Adult Haircut": ["Adult Haircut", "Beard", "Waxing"],
        "Student Haircut": ["Student Haircut", "Beard", "Waxing"],
        "Kids Haircut": ["Kids Haircut", "Waxing"],
        "Line Up & Taper": ["Line Up & Taper", "Beard", "Waxing"],
        "Beard": ["Beard", "Adult Haircut", "Student Haircut", "Waxing", "Line Up & Taper"],
        "Waxing": ["Waxing", "Adult Haircut", "Student Haircut", "Kids Haircut", "Beard", "Line Up & Taper"]
    };

    // Function to get the intersection of all selected services
    function getIntersectionOfSelectedServices(selectedServices) {
        let intersection = services[selectedServices[0]];
        selectedServices.slice(1).forEach(service => {
            intersection = intersection.filter(value => services[service].includes(value));
        });
        return intersection;
    }

    document.querySelectorAll('#services .form-check-input').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            // Temporarily enable all checkboxes
            document.querySelectorAll('#services .form-check-input').forEach(checkbox => {
                checkbox.disabled = false;
            });

            // Get all selected services
            const selectedServices = Array.from(document.querySelectorAll('#services .form-check-input:checked')).map(checkbox => checkbox.value);

            // Get the intersection of all selected services
            const intersection = getIntersectionOfSelectedServices(selectedServices);

            // Disable checkboxes for services not in the intersection
            document.querySelectorAll('#services .form-check-input').forEach(checkbox => {
                if (!intersection.includes(checkbox.value)) {
                    checkbox.disabled = true;
                }
            });
        });
    });
});
