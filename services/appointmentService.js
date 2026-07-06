// Service abstraction for managing tractor service appointments
window.appointmentService = {
  STORAGE_KEY: "sri_shakthi_agros_appointments",

  /**
   * Creates a new service appointment.
   * @param {Object} appointmentDetails 
   * @returns {Promise<Object>} The saved appointment object with ID and timestamp
   */
  createAppointment: function(appointmentDetails) {
    return new Promise((resolve, reject) => {
      // Simulate network latency (200-500ms) for realistic UX loader
      setTimeout(() => {
        try {
          // Perform structural validations
          if (!appointmentDetails.fullName || !appointmentDetails.phone || !appointmentDetails.tractorModel || !appointmentDetails.serviceType || !appointmentDetails.preferredDate || !appointmentDetails.preferredTime) {
            return reject(new Error("Please fill in all required fields."));
          }
          
          // Validate Indian Mobile Number (10 digits, optionally starting with +91 or 0)
          const cleanPhone = appointmentDetails.phone.replace(/[\s\-()]/g, "");
          const phoneRegex = /^(?:\+91|0)?[6-9]\d{9}$/;
          if (!phoneRegex.test(cleanPhone)) {
            return reject(new Error("Please enter a valid 10-digit Indian mobile number."));
          }

          // Fetch current list
          const appointments = this.getAppointmentsSync();

          // Construct new appointment record
          const newAppointment = {
            id: "APT-" + Date.now() + "-" + Math.floor(Math.random() * 1000),
            fullName: appointmentDetails.fullName.trim(),
            phone: cleanPhone,
            email: appointmentDetails.email ? appointmentDetails.email.trim() : "",
            tractorModel: appointmentDetails.tractorModel,
            registrationNumber: appointmentDetails.registrationNumber ? appointmentDetails.registrationNumber.trim() : "",
            serviceType: appointmentDetails.serviceType,
            preferredDate: appointmentDetails.preferredDate,
            preferredTime: appointmentDetails.preferredTime,
            description: appointmentDetails.description ? appointmentDetails.description.trim() : "",
            createdAt: new Date().toISOString(),
            status: "Pending Confirmation"
          };

          // Save record
          appointments.push(newAppointment);
          localStorage.setItem(this.STORAGE_KEY, JSON.stringify(appointments));

          resolve(newAppointment);
        } catch (e) {
          reject(new Error("Storage Write Error: Failed to save appointment."));
        }
      }, 400);
    });
  },

  /**
   * Synchronous retrieval of appointments (internal helper)
   */
  getAppointmentsSync: function() {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  },

  /**
   * Asynchronous retrieval of appointments
   * @returns {Promise<Array>} List of appointments
   */
  getAppointments: function() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.getAppointmentsSync());
      }, 100);
    });
  }
};
