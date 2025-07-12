document.addEventListener('DOMContentLoaded', function() {
            // Set min date to today
            const today = new Date();
            const formattedDate = today.toISOString().split('T')[0];
            document.getElementById('travelDate').min = formattedDate;
            
            // Show/hide return date based on return ticket selection
            document.getElementById('returnTicket').addEventListener('change', function() {
                const returnDateContainer = document.getElementById('returnDateContainer');
                if (this.value === 'Yes') {
                    returnDateContainer.style.display = 'block';
                    document.getElementById('returnDate').required = true;
                } else {
                    returnDateContainer.style.display = 'none';
                    document.getElementById('returnDate').required = false;
                }
            });
            
            // Helper function to format date
            function formatDate(dateString) {
                if (!dateString) return '';
                const options = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'short' };
                return new Date(dateString).toLocaleDateString('en-US', options);
            }
            
            // Generate random flight number
            function generateFlightNumber() {
                const prefix = '6E';
                const num = Math.floor(Math.random() * 900) + 100;
                return `${prefix}${num}`;
            }
            
            // Generate random seat
            function generateSeat() {
                const rows = ['A', 'B', 'C', 'D', 'E', 'F'];
                const row = rows[Math.floor(Math.random() * rows.length)];
                const num = Math.floor(Math.random() * 30) + 1;
                return `${num}${row}`;
            }
            
            // Generate random booking reference
            function generateBookingRef() {
                const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
                let result = '';
                for (let i = 0; i < 6; i++) {
                    result += chars.charAt(Math.floor(Math.random() * chars.length));
                }
                return result;
            }
            
            // Form submission handler
            document.getElementById('flightForm').addEventListener('submit', function(event) {
                event.preventDefault();
                
                // Collect form data
                const formData = {
                    from: document.getElementById('from').value,
                    to: document.getElementById('to').value,
                    passengers: document.getElementById('passengers').value,
                    travelDate: document.getElementById('travelDate').value,
                    returnTicket: document.getElementById('returnTicket').value,
                    returnDate: document.getElementById('returnDate').value,
                    fullName: document.getElementById('fullName').value,
                    age: document.getElementById('age').value,
                    gender: document.getElementById('gender').value,
                    mobile: document.getElementById('mobile').value,
                    email: document.getElementById('email').value,
                    bookingDate: new Date().toISOString().split('T')[0],
                    flightNumber: generateFlightNumber(),
                    seat: generateSeat(),
                    bookingRef: generateBookingRef()
                };
                
                // Validate mobile number
                if (!/^\d{10}$/.test(formData.mobile)) {
                    alert('📵 Invalid mobile number. Please enter a 10-digit number.');
                    return;
                }
                
                // Validate travel date is not in the past
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const travelDate = new Date(formData.travelDate);
                if (travelDate < today) {
                    alert('📅 Travel date cannot be in the past!');
                    return;
                }
                
                // Validate return date if applicable
                if (formData.returnTicket === 'Yes') {
                    const returnDate = new Date(formData.returnDate);
                    if (returnDate < travelDate) {
                        alert('🔁 Return date must be after travel date!');
                        return;
                    }
                }
                
                // Save to localStorage
                saveBooking(formData);
                
                // Generate ticket content
                const ticketContent = `
                    <div class="ticket-card">
                        <div class="ticket-header">
                            <div class="d-flex justify-content-between align-items-center">
                                <div>
                                    <h3 class="mb-0">INDI<span style="color: #ff7f00;">GO</span></h3>
                                    <p class="mb-0">Flight Ticket</p>
                                </div>
                                <div class="text-end">
                                    <p class="mb-0">Booking Reference</p>
                                    <h4 class="mb-0">${formData.bookingRef}</h4>
                                </div>
                            </div>
                        </div>
                        <div class="ticket-body">
                            <div class="flight-info">
                                <div class="flight-route">
                                    <div class="from-to">${formData.from.split(' ')[0]} → ${formData.to.split(' ')[0]}</div>
                                    <div class="airports">${formData.from} to ${formData.to}</div>
                                </div>
                                <div class="flight-time">
                                    <p><strong>Departure:</strong> ${formatDate(formData.travelDate)}</p>
                                    <p><strong>Flight:</strong> ${formData.flightNumber}</p>
                                </div>
                            </div>
                            
                            <div class="passenger-info">
                                <div class="ticket-row">
                                    <div class="ticket-label">Passenger Name:</div>
                                    <div class="ticket-value">${formData.fullName}</div>
                                </div>
                                <div class="ticket-row">
                                    <div class="ticket-label">Age & Gender:</div>
                                    <div class="ticket-value">${formData.age} / ${formData.gender}</div>
                                </div>
                                <div class="ticket-row">
                                    <div class="ticket-label">Seat:</div>
                                    <div class="ticket-value">${formData.seat}</div>
                                </div>
                                <div class="ticket-row">
                                    <div class="ticket-label">Passengers:</div>
                                    <div class="ticket-value">${formData.passengers}</div>
                                </div>
                                ${formData.returnTicket === 'Yes' ? `
                                <div class="ticket-row">
                                    <div class="ticket-label">Return Date:</div>
                                    <div class="ticket-value">${formatDate(formData.returnDate)}</div>
                                </div>` : ''}
                                <div class="ticket-row">
                                    <div class="ticket-label">Contact:</div>
                                    <div class="ticket-value">+91-${formData.mobile}</div>
                                </div>
                                <div class="ticket-row">
                                    <div class="ticket-label">Email:</div>
                                    <div class="ticket-value">${formData.email}</div>
                                </div>
                            </div>
                            
                            <div class="ticket-qr">
                                <div class="qr-placeholder">
                                   <img  src="./qr code.jpg" alt="" class="qr" >
                                </div>
                                <p>Scan at airport for boarding</p>
                            </div>
                        </div>
                        <div class="ticket-footer">
                            <p>Booking Date: ${formatDate(formData.bookingDate)} | Status: <span class="text-success">Confirmed</span></p>
                        </div>
                    </div>
                `;
                
                // Set modal content
                document.getElementById('ticketModalBody').innerHTML = ticketContent;
                
                // Show the modal
                const ticketModal = new bootstrap.Modal(document.getElementById('ticketModal'));
                ticketModal.show();
                
                // Set up download button
                document.getElementById('downloadTicketBtn').addEventListener('click', function() {
                    // Create PDF
                    const { jsPDF } = window.jspdf;
                    const doc = new jsPDF('p', 'mm', 'a4');
                    
                    doc.setFont("helvetica", "normal");
                    doc.setFontSize(12);
                    
                    // Add header
                    doc.setFillColor(40, 7, 230);
                    doc.rect(0, 0, 210, 30, 'F');
                    doc.setTextColor(255, 255, 255);
                    doc.setFontSize(18);
                    doc.text("INDI", 20, 20);
                    doc.setTextColor(255, 127, 0);
                    doc.text("GO", 38, 20);
                    doc.setTextColor(255, 255, 255);
                    doc.setFontSize(12);
                    doc.text("Flight Ticket", 20, 27);
                    
                    // Add flight info
                    doc.setTextColor(0, 0, 0);
                    doc.setFontSize(14);
                    doc.text(`Flight: ${formData.from} → ${formData.to}`, 20, 50);
                    doc.setFontSize(12);
                    doc.text(`Departure: ${formatDate(formData.travelDate)}`, 20, 60);
                    doc.text(`Flight Number: ${formData.flightNumber}`, 20, 67);
                    
                    if (formData.returnTicket === 'Yes') {
                        doc.text(`Return: ${formatDate(formData.returnDate)}`, 20, 74);
                    }
                    
                    // Add passenger info
                    doc.text(`Passenger: ${formData.fullName}`, 20, 85);
                    doc.text(`Age/Gender: ${formData.age} / ${formData.gender}`, 20, 92);
                    doc.text(`Seat: ${formData.seat}`, 20, 99);
                    doc.text(`Passengers: ${formData.passengers}`, 20, 106);
                    doc.text(`Contact: +91-${formData.mobile}`, 20, 113);
                    doc.text(`Email: ${formData.email}`, 20, 120);
                    
                    // Add booking info
                    doc.text(`Booking Reference: ${formData.bookingRef}`, 20, 130);
                    doc.text(`Booking Date: ${formatDate(formData.bookingDate)}`, 20, 137);
                    
                    // Add footer
                    doc.setFontSize(10);
                    doc.setTextColor(100, 100, 100);
                    doc.text("Thank you for choosing IndiGo. Have a safe journey!", 105, 180, null, null, 'center');
                    doc.text("© 2025 IndiGo Airlines. All rights reserved.", 105, 190, null, null, 'center');
                    
                    // Save the PDF
                    doc.save(`IndiGo-Ticket-${formData.bookingRef}.pdf`);
                });
            });
            
            // Function to save booking to localStorage
            function saveBooking(booking) {
                let bookings = JSON.parse(localStorage.getItem('bookings')) || [];
                bookings.push(booking);
                localStorage.setItem('bookings', JSON.stringify(bookings));
            }
            
            // Function to load saved bookings
            function loadSavedBookings() {
                const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
                const savedTicketsList = document.getElementById('savedTicketsList');
                savedTicketsList.innerHTML = '';
                
                if (bookings.length === 0) {
                    savedTicketsList.innerHTML = `
                        <div class="alert alert-warning text-center">
                            No saved bookings found. Book a flight to see it here.
                        </div>
                    `;
                } else {
                    bookings.forEach((booking, index) => {
                        savedTicketsList.innerHTML += `
                            <div class="saved-ticket-card">
                                <div class="saved-ticket-header">
                                    <div>
                                        <h5 class="mb-0">Booking #${index + 1}</h5>
                                        <small>${formatDate(booking.bookingDate)}</small>
                                         <img src="./IndiGo_logo_2x.avif" alt="Indigo" height="40">
                                    </div>
                                    <div>
                                        <span class="badge bg-success">Confirmed</span>
                                    </div>
                                </div>
                                <div class="saved-ticket-body">
                                    <div class="row">
                                        <div class="col-md-6">
                                        <p><strong>BOOKING  : </strong> CONFIRMED<p/>
                                            <p><strong>Passenger:</strong> ${booking.fullName}</p>
                                            <p><strong>Route:</strong> ${booking.from.split(' ')[0]} → ${booking.to.split(' ')[0]}</p>
                                            <p><strong>Departure:</strong> ${formatDate(booking.travelDate)}</p>
                                        </div>
                                        <div class="col-md-6">
                                            <p><strong>Flight:</strong> ${booking.flightNumber}</p>
                                            <p><strong>Passengers:</strong> ${booking.passengers}</p>
                                            <p><strong>Reference:</strong> ${booking.bookingRef}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        `;
                    });
                }
            }
            
            // View saved bookings
            document.getElementById('viewSavedBookings').addEventListener('click', function(e) {
                e.preventDefault();
                document.getElementById('savedTicketsSection').style.display = 'block';
                document.getElementById('savedTicketsSection').scrollIntoView({ behavior: 'smooth' });
                loadSavedBookings();
            });
        });
    

        