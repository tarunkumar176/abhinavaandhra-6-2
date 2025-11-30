import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';

async function testUpload() {
    try {
        // 1. Login
        console.log('Logging in...');
        const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
            email: 'admin@teluguepaper.com',
            password: 'admin123'
        });
        const token = loginResponse.data.data.token;
        console.log('Login successful, token obtained.');

        // 2. Upload
        // Create dummy files
        fs.writeFileSync('test.pdf', 'dummy pdf content');
        fs.writeFileSync('test.jpg', 'dummy image content');

        const form = new FormData();
        form.append('pdf', fs.createReadStream('test.pdf'), 'test.pdf');
        form.append('thumbnail', fs.createReadStream('test.jpg'), 'test.jpg');
        form.append('date', '2025-12-31'); // Future date
        form.append('title', 'Test Paper');

        console.log('Sending upload request...');
        const response = await axios.post('http://localhost:5000/api/papers/upload', form, {
            headers: {
                ...form.getHeaders(),
                'Authorization': `Bearer ${token}`
            }
        });

        console.log('Upload success:', response.data);
    } catch (error) {
        console.error('Upload failed:', error.response ? error.response.data : error.message);
    } finally {
        // Cleanup
        if (fs.existsSync('test.pdf')) fs.unlinkSync('test.pdf');
        if (fs.existsSync('test.jpg')) fs.unlinkSync('test.jpg');
    }
}

testUpload();
