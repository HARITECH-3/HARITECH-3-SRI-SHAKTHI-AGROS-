// Service abstraction for managing tractor and spare parts enquiries
window.enquiryService = {
  STORAGE_KEY: "sri_shakthi_agros_enquiries",

  /**
   * Creates a new sales or spare parts enquiry.
   * @param {Object} enquiryDetails 
   * @returns {Promise<Object>} The saved enquiry object with ID and timestamp
   */
  createEnquiry: function(enquiryDetails) {
    return new Promise((resolve, reject) => {
      // Simulate network latency (250-500ms)
      setTimeout(() => {
        try {
          // Perform basic validations
          if (!enquiryDetails.name || !enquiryDetails.phone || !enquiryDetails.type) {
            return reject(new Error("Please fill in your name and phone number."));
          }
          
          // Validate Indian Mobile Number (10 digits)
          const cleanPhone = enquiryDetails.phone.replace(/[\s\-()]/g, "");
          const phoneRegex = /^(?:\+91|0)?[6-9]\d{9}$/;
          if (!phoneRegex.test(cleanPhone)) {
            return reject(new Error("Please enter a valid 10-digit Indian mobile number."));
          }

          // Tractor model is required for tractor type, category is required for parts
          if (enquiryDetails.type === "tractor" && !enquiryDetails.tractorModel) {
            return reject(new Error("Please select a tractor model."));
          }
          if (enquiryDetails.type === "parts" && !enquiryDetails.partsCategory) {
            return reject(new Error("Please select a parts category."));
          }

          // Fetch current list
          const enquiries = this.getEnquiriesSync();

          // Construct new enquiry record
          const newEnquiry = {
            id: "ENQ-" + Date.now() + "-" + Math.floor(Math.random() * 1000),
            name: enquiryDetails.name.trim(),
            phone: cleanPhone,
            type: enquiryDetails.type, // 'tractor' or 'parts'
            tractorModel: enquiryDetails.tractorModel || "",
            partsCategory: enquiryDetails.partsCategory || "",
            description: enquiryDetails.description ? enquiryDetails.description.trim() : "",
            createdAt: new Date().toISOString(),
            status: "New"
          };

          // Save record
          enquiries.push(newEnquiry);
          localStorage.setItem(this.STORAGE_KEY, JSON.stringify(enquiries));

          resolve(newEnquiry);
        } catch (e) {
          reject(new Error("Storage Write Error: Failed to save enquiry."));
        }
      }, 400);
    });
  },

  /**
   * Synchronous retrieval of enquiries (internal helper)
   */
  getEnquiriesSync: function() {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  },

  /**
   * Asynchronous retrieval of enquiries
   * @returns {Promise<Array>} List of enquiries
   */
  getEnquiries: function() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.getEnquiriesSync());
      }, 100);
    });
  }
};
