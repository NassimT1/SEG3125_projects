document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const target = document.querySelector(this.getAttribute('href'));
            const headerHeight = document.querySelector('.header').offsetHeight; 
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;

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
        const services = urlParams.getAll('service').join(', '); // Doesn't work for some reason
        const time = urlParams.get('time');
        const date = urlParams.get('date');

        const confirmationText = document.getElementById('confirmationText');

        const barberSpan = document.createElement('span');
        barberSpan.textContent = barber;
        barberSpan.classList.add('fw-bolder');

        const servicesSpan = document.createElement('span');
        servicesSpan.textContent = services;
        servicesSpan.classList.add('fw-bolder');

        const timeSpan = document.createElement('span');
        timeSpan.textContent = time;
        timeSpan.classList.add('fw-bolder');

        const dateSpan = document.createElement('span');
        dateSpan.textContent = date;
        dateSpan.classList.add('fw-bolder');

        const confirmationString = `Your appointment with ${barberSpan.outerHTML} has been confirmed for ${timeSpan.outerHTML} on ${dateSpan.outerHTML}.`;
        confirmationText.innerHTML = confirmationString;
    }

    // Booking page logic
    $(document).ready(function() {
        $('.datepicker').datepicker({
            format: 'mm/dd/yyyy',
            startDate: '0d',
            autoclose: true
        });

        $('#date').on('changeDate', function() {
            var selectedDate = $(this).datepicker('getDate');
            var dayOfWeek = selectedDate.getUTCDay();
            var timeSelect = $('#time');
            timeSelect.empty();

            var openingTime, closingTime;
            if (dayOfWeek >= 1 && dayOfWeek <= 5) {
                // Monday to Friday
                openingTime = 8;  
                closingTime = 20; 
            } else {
                // Saturday and Sunday
                openingTime = 9;  
                closingTime = 17; 
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

    // Checkbox logic
    const services = {
        "Adult Haircut": ["Adult Haircut", "Beard", "Waxing"],
        "Student Haircut": ["Student Haircut", "Beard", "Waxing"],
        "Kids Haircut": ["Kids Haircut", "Waxing"],
        "Line Up & Taper": ["Line Up & Taper", "Beard", "Waxing"],
        "Beard": ["Beard", "Adult Haircut", "Student Haircut", "Waxing", "Line Up & Taper"],
        "Waxing": ["Waxing", "Adult Haircut", "Student Haircut", "Kids Haircut", "Beard", "Line Up & Taper"]
    };
    function getIntersectionOfSelectedServices(selectedServices) {
        let intersection = services[selectedServices[0]];
        selectedServices.slice(1).forEach(service => {
            intersection = intersection.filter(value => services[service].includes(value));
        });
        return intersection;
    }

    document.querySelectorAll('#services .form-check-input').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            document.querySelectorAll('#services .form-check-input').forEach(checkbox => {
                checkbox.disabled = false;
            });

            const selectedServices = Array.from(document.querySelectorAll('#services .form-check-input:checked')).map(checkbox => checkbox.value);
            const intersection = getIntersectionOfSelectedServices(selectedServices);

            document.querySelectorAll('#services .form-check-input').forEach(checkbox => {
                if (!intersection.includes(checkbox.value)) {
                    checkbox.disabled = true;
                }
            });
        });
    });
});
