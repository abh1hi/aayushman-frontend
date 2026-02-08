
const API_BASE_URL = 'http://localhost:3000';

export const EnquiryService = {
    async submitEnquiry(enquiryData) {
        try {
            const response = await fetch(`${API_BASE_URL}/enquiries`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(enquiryData),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Failed to submit enquiry');
            }

            return await response.json();
        } catch (error) {
            console.error('Enquiry Submission Error:', error);
            throw error;
        }
    }
};
