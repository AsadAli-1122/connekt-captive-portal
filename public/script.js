// public/script.js

document.addEventListener('DOMContentLoaded', function() {
  const section1 = document.getElementById('section_1');
  const section2 = document.getElementById('section_2');
  const section3 = document.getElementById('section_3');
  const section4 = document.getElementById('section_4');
  const myButton = document.getElementById('login');
  const sendOtpButton = document.getElementById('send_otp');
  const verifyOtpButton = document.getElementById('verify_otp');
  const nameInput = document.getElementById('name');
  const numberInput = document.getElementById('number');
  const otpInput = document.getElementById('otp_input');
  const errorName = document.getElementById('error_name');
  const errorNumber = document.getElementById('error_number');
  const errorOtp = document.getElementById('error_otp');
  let otpCode = "";

  myButton.addEventListener('click', function() {
    section1.style.display = 'none';
    section2.style.display = 'block';
    playRandomVideo();
  });

  function playRandomVideo() {
    const videoSources = [
      'https://firebasestorage.googleapis.com/v0/b/connect-captive-portal.appspot.com/o/videos%2Fvideo_1.mp4?alt=media&token=fc68ae79-30e6-4523-81f8-a32bad40bcc6',
      'https://firebasestorage.googleapis.com/v0/b/connect-captive-portal.appspot.com/o/videos%2Fvideo_2.mp4?alt=media&token=f55a02b6-4953-4130-bbbe-73b763903b5a',
      'https://firebasestorage.googleapis.com/v0/b/connect-captive-portal.appspot.com/o/videos%2Fvideo_3.mp4?alt=media&token=bf8fb228-b441-4834-a4e5-ce1d76191960',
      'https://firebasestorage.googleapis.com/v0/b/connect-captive-portal.appspot.com/o/videos%2Fvideo_4.mp4?alt=media&token=6d2c3860-58d8-498b-a8e2-ae720a64cf1f'
    ];
    const randomIndex = Math.floor(Math.random() * videoSources.length);
    const randomVideoSource = videoSources[randomIndex];
    const myVideo = document.getElementById('myVideo');
    myVideo.src = randomVideoSource;
    myVideo.load();
    myVideo.play();
  }

  const myVideo = document.getElementById('myVideo');
  myVideo.addEventListener('ended', function() {
    section2.style.display = 'none';
    section3.style.display = 'block';
  });

  sendOtpButton.addEventListener('click', async function(e) {
    e.preventDefault();

    const username = nameInput.value;
    const number = numberInput.value;
  
    let hasError = false; // Track if there are any errors
  
    if (username.trim() === '') {
      showErrorName('Username is required.');
      hasError = true;
    } else if (!validateName(username)) {
      showErrorName('Username must be 4 to 19 characters.');
      hasError = true;
    } else {
      hideErrorName(); // Username is valid, remove the error message
    }
  
    if (number.trim() === '') {
      showErrorNumber('Phone number is required.');
      hasError = true;
    } else if (!validateNumber(number)) {
      showErrorNumber('Invalid number format. Please use the format 923001234567.');
      hasError = true;
    } else {
      hideErrorNumber(); // Number is valid, remove the error message
    }
  
    if (hasError) {
      return; // Stop further execution if there are any errors
    }



    otpCode = generateOTP();

    // Send the verification code via Twilio SMS
    try {
      const response = await fetch('/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          number: number,
          code: otpCode,
        }),
      });

      if (response.ok) {
        showSuccessMessage('Verification code sent to your phone number!');
        console.log('OTP code sent successfully!');
      } else {
        console.log('Failed to send OTP code.');
      }
    } catch (error) {
      console.log('Error sending OTP code:', error);
    }

  });

  verifyOtpButton.addEventListener('click', function(e) {
    e.preventDefault();
  
    const enteredOtp = otpInput.value;
    if (enteredOtp.trim() === '') {
      showErrorOtp('OTP is required.');
      return;
    }
  
    if (enteredOtp === otpCode) {
      console.log('OTP matched!');
      section3.style.display = 'none';
      section4.style.display = 'block';
      saveDataToDatabase(nameInput.value, numberInput.value);
    } else {
      console.log('OTP not matched!');
      showErrorOtp('OTP not matched!');
    }
  });
  
  async function saveDataToDatabase(name, number) {
    try {
      const response = await fetch('/store-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name,
          number: number,
        }),
      });
  
      if (response.ok) {
        console.log('Data saved to database successfully!');
      } else {
        throw new Error('Failed to save data to database.');
      }
    } catch (error) {
      console.log('Error saving data to database:', error);
    }
  }
  

  function generateOTP() {
    const digits = '0123456789';
    let otp = '';

    for (let i = 0; i < 4; i++) {
      otp += digits[Math.floor(Math.random() * 10)];
    }

    return otp;
  }
  
  function validateNumber(number) {
    const numberRegex = /^923\d{9}$/;
    return numberRegex.test(number);
  }
  function validateName(username) {
    const nameRegex = /^.{4,19}$/;
    return nameRegex.test(username);
  }
  
  function showErrorNumber(errorMessage) {
    errorNumber.innerText = errorMessage;
    errorNumber.style.display = 'block';
  }
  
  function showErrorName(errorMessage) {
    errorName.innerText = errorMessage;
    errorName.style.display = 'block';
  }

  
  function showErrorOtp(errorMessage) {
    errorOtp.innerText = errorMessage;
    errorOtp.style.display = 'block';
  }

  function hideErrorName() {
    errorName.innerText = '';
    errorName.style.display = 'none';
  }
  
  function hideErrorNumber() {
    errorNumber.innerText = '';
    errorNumber.style.display = 'none';
  }

function showSuccessMessage(message) {
  const successMessage = document.getElementById('success_message');
  successMessage.innerText = message;
  successMessage.style.display = 'block';
}

  
});
