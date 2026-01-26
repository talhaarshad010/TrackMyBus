const BASE_URL = 'https://trackmybus-backend.vercel.app';

export const generateOTP = () =>
    Math.floor(100000 + Math.random() * 900000).toString();

export const sendOTP = async email => {
    const otp = generateOTP();

    const res = await fetch(`${BASE_URL}/api/send-otp`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email,
            otp,
        }),
    });

    console.log("Responce:", res)

    return otp; // verification ke liye
};
