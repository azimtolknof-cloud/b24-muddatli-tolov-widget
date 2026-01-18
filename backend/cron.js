const axios = require('axios');
const schedule = require('node-schedule');

// Example: Daily job at midnight
schedule.scheduleJob('0 0 * * *', async () => {
    console.log('Running daily cron job');

    try {
        // Fetch pending payments from Bitrix24
        const response = await axios.get('https://your-bitrix24-api-url/pending-payments', {
            headers: { Authorization: `Bearer YOUR_ACCESS_TOKEN` },
        });

        const payments = response.data;

        payments.forEach(payment => {
            const dueDate = new Date(payment.dueDate);
            const today = new Date();
            const diff = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));

            if (diff === 1) {
                console.log(`Reminder task for payment ID: ${payment.id}`);
                // Create reminder task logic
            } else if (diff === -1) {
                console.log(`Overdue task for payment ID: ${payment.id}`);
                // Create overdue task logic
            }
        });
    } catch (error) {
        console.error('Error running cron job:', error);
    }
});